// supabase/functions/gerar-eval-honorarios/index.ts
// Ferramenta interna (Fase 3): gera o dataset de avaliacao do chat de honorarios via Batches
// API da Anthropic (50% mais barato, ideal pra geracao em massa nao urgente). Nao e chamada
// pelo frontend - uso pontual via curl autenticado, com acoes:
//   POST { acao: "submit" }              -> monta e envia o batch, devolve o batch_id
//   POST { acao: "status", batch_id }    -> devolve processing_status + contagens
//   POST { acao: "collect", batch_id }   -> le os resultados prontos e grava em
//                                            public.honorarios_eval_dataset
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
  });
}

interface ItemRow {
  id: string;
  area: string;
  categoria: string | null;
  descricao: string;
  tipo: string;
  percentual_minimo: number | null;
  valor_minimo: number | null;
  observacao: string | null;
  amostra_avaliacao: boolean;
}

// custom_id da Batches API so aceita [a-zA-Z0-9_-]{1,64} - os ids dos itens usam ponto
// (ex: "16.14.1"), entao precisam ser codificados/decodificados na ida e volta.
function encodeId(id: string): string {
  return id.replace(/\./g, '_');
}
function decodeId(id: string): string {
  return id.replace(/_/g, '.');
}

function descreverItem(item: ItemRow): string {
  const partes = [`Área: ${item.area}`];
  if (item.categoria) partes.push(`Categoria: ${item.categoria}`);
  partes.push(`Descrição: ${item.descricao}`);
  if (item.tipo === 'percentual' && item.percentual_minimo) {
    partes.push(`Cobrança: ${item.percentual_minimo}% sobre o valor da causa/benefício`);
  } else if (item.valor_minimo != null) {
    partes.push(`Valor mínimo: R$ ${item.valor_minimo}`);
  }
  if (item.observacao) partes.push(`Observação: ${item.observacao}`);
  return partes.join(' | ');
}

const SCHEMA_BASE = {
  type: 'object',
  properties: {
    pergunta: {
      type: 'string',
      description: 'Pergunta curta, em português coloquial, que um advogado real digitaria para descobrir o honorário deste item, sem citar o número do item.',
    },
  },
  required: ['pergunta'],
  additionalProperties: false,
};

const SCHEMA_STRESS = {
  type: 'object',
  properties: {
    sinonimos: { type: 'string', description: 'Reformulação da pergunta usando sinônimos e palavras diferentes das usadas na descrição oficial do item, mas com o mesmo significado.' },
    contexto: { type: 'string', description: 'Pergunta com um cenário/contexto de cliente real embutido (2-3 frases), terminando na dúvida sobre o honorário.' },
    ambigua: { type: 'string', description: 'Pergunta deliberadamente vaga/incompleta sobre o mesmo tema, faltando informação que distinguiria este item de outros parecidos - deve ser genuinamente ambígua, não identificável com certeza.' },
    comparativa: { type: ['string', 'null'], description: 'Pergunta comparando este item com o item secundário fornecido (pedindo a diferença de valor ou quando usar cada um). Null se nenhum item secundário foi fornecido.' },
  },
  required: ['sinonimos', 'contexto', 'ambigua', 'comparativa'],
  additionalProperties: false,
};

function buildBaseRequest(item: ItemRow) {
  return {
    custom_id: `base__${encodeId(item.id)}`,
    params: {
      model: 'claude-opus-5',
      max_tokens: 300,
      system: 'Você ajuda a criar um dataset de teste para um chat jurídico de honorários advocatícios da OAB-MA. Gere perguntas realistas, como um advogado brasileiro digitaria num chat, sem formalidade excessiva.',
      messages: [
        { role: 'user', content: `Item da tabela de honorários:\n${descreverItem(item)}\n\nGere 1 pergunta natural sobre o valor deste serviço.` },
      ],
      output_config: { format: { type: 'json_schema', schema: SCHEMA_BASE } },
    },
  };
}

function buildStressRequest(item: ItemRow, secundario: ItemRow | null) {
  const contextoSecundario = secundario
    ? `\n\nItem secundário (para a variação comparativa):\n${descreverItem(secundario)}`
    : '\n\n(Não há item secundário disponível - deixe "comparativa" como null.)';
  return {
    custom_id: `stress__${encodeId(item.id)}`,
    params: {
      model: 'claude-opus-5',
      max_tokens: 600,
      system: 'Você ajuda a criar um dataset de teste para um chat jurídico de honorários advocatícios da OAB-MA. Gere perguntas realistas, como um advogado brasileiro digitaria num chat, sem formalidade excessiva.',
      messages: [
        { role: 'user', content: `Item principal da tabela de honorários:\n${descreverItem(item)}${contextoSecundario}\n\nGere as 4 variações pedidas no formato.` },
      ],
      output_config: { format: { type: 'json_schema', schema: SCHEMA_STRESS } },
    },
  };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return jsonResponse({ error: 'Missing authorization header' }, 401);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) return jsonResponse({ error: 'Invalid token' }, 401);

    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) return jsonResponse({ error: 'API key not configured' }, 500);

    const body = await req.json().catch(() => ({}));
    const acao = body.acao;

    if (acao === 'submit') {
      const { data: itens, error } = await supabaseAdmin
        .from('honorarios_itens')
        .select('id, area, categoria, descricao, tipo, percentual_minimo, valor_minimo, observacao, amostra_avaliacao');
      if (error) return jsonResponse({ error: error.message }, 500);

      const todos = itens as ItemRow[];
      const porCategoria = new Map<string, ItemRow[]>();
      for (const item of todos) {
        const chave = item.categoria ?? `__sem_categoria__${item.area}`;
        if (!porCategoria.has(chave)) porCategoria.set(chave, []);
        porCategoria.get(chave)!.push(item);
      }

      const requests = todos.map(buildBaseRequest);

      const amostra = todos.filter((i) => i.amostra_avaliacao);
      for (const item of amostra) {
        const chave = item.categoria ?? `__sem_categoria__${item.area}`;
        const irmaos = (porCategoria.get(chave) ?? []).filter((i) => i.id !== item.id);
        const secundario = irmaos.length > 0 ? irmaos[0] : null;
        requests.push(buildStressRequest(item, secundario));
      }

      const batchResp = await fetch('https://api.anthropic.com/v1/messages/batches', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ requests }),
      });
      const batchData = await batchResp.json();
      if (!batchResp.ok) return jsonResponse({ error: batchData }, batchResp.status);

      return jsonResponse({
        batch_id: batchData.id,
        total_requests: requests.length,
        base: todos.length,
        stress: amostra.length,
        raw: batchData,
      });
    }

    if (acao === 'status') {
      const batchId = body.batch_id;
      if (!batchId) return jsonResponse({ error: 'batch_id obrigatório' }, 400);
      const resp = await fetch(`https://api.anthropic.com/v1/messages/batches/${batchId}`, {
        headers: { 'x-api-key': anthropicKey, 'anthropic-version': '2023-06-01' },
      });
      const data = await resp.json();
      return jsonResponse(data, resp.status);
    }

    if (acao === 'collect') {
      const batchId = body.batch_id;
      if (!batchId) return jsonResponse({ error: 'batch_id obrigatório' }, 400);

      const batchInfoResp = await fetch(`https://api.anthropic.com/v1/messages/batches/${batchId}`, {
        headers: { 'x-api-key': anthropicKey, 'anthropic-version': '2023-06-01' },
      });
      const batchInfo = await batchInfoResp.json();
      if (!batchInfoResp.ok) return jsonResponse({ error: batchInfo }, batchInfoResp.status);
      if (batchInfo.processing_status !== 'ended') {
        return jsonResponse({ error: 'Batch ainda não terminou', processing_status: batchInfo.processing_status }, 409);
      }

      const resultsUrl = batchInfo.results_url;
      const resultsResp = await fetch(resultsUrl, {
        headers: { 'x-api-key': anthropicKey, 'anthropic-version': '2023-06-01' },
      });
      const text = await resultsResp.text();
      const linhas = text.split('\n').filter((l) => l.trim());

      const rows: Record<string, unknown>[] = [];
      let erros = 0;

      for (const linha of linhas) {
        let entry: any;
        try { entry = JSON.parse(linha); } catch { erros++; continue; }
        const customId: string = entry.custom_id;
        if (entry.result?.type !== 'succeeded') { erros++; continue; }

        const content = entry.result.message.content;
        const textBlock = content.find((b: any) => b.type === 'text');
        if (!textBlock) { erros++; continue; }
        let parsed: any;
        try { parsed = JSON.parse(textBlock.text); } catch { erros++; continue; }

        const [tipo, itemIdCodificado] = customId.split('__');
        const itemId = decodeId(itemIdCodificado);
        if (tipo === 'base') {
          rows.push({
            item_id_base: itemId,
            tipo_pergunta: 'linguagem_natural',
            pergunta: parsed.pergunta,
            item_id_esperado: itemId,
            comportamento_esperado: 'resposta_direta',
          });
        } else if (tipo === 'stress') {
          if (parsed.sinonimos) {
            rows.push({ item_id_base: itemId, tipo_pergunta: 'sinonimos', pergunta: parsed.sinonimos, item_id_esperado: itemId, comportamento_esperado: 'resposta_direta' });
          }
          if (parsed.contexto) {
            rows.push({ item_id_base: itemId, tipo_pergunta: 'contexto', pergunta: parsed.contexto, item_id_esperado: itemId, comportamento_esperado: 'resposta_direta' });
          }
          if (parsed.ambigua) {
            rows.push({ item_id_base: itemId, tipo_pergunta: 'ambigua', pergunta: parsed.ambigua, item_id_esperado: null, comportamento_esperado: 'pedir_esclarecimento' });
          }
          if (parsed.comparativa) {
            rows.push({ item_id_base: itemId, tipo_pergunta: 'comparativa', pergunta: parsed.comparativa, item_id_esperado: itemId, comportamento_esperado: 'comparar_dois' });
          }
        }
      }

      const insertBatchSize = 500;
      let inseridos = 0;
      for (let i = 0; i < rows.length; i += insertBatchSize) {
        const lote = rows.slice(i, i + insertBatchSize);
        const { error: insertError } = await supabaseAdmin.from('honorarios_eval_dataset').insert(lote);
        if (insertError) return jsonResponse({ error: insertError.message, inseridos_ate_agora: inseridos }, 500);
        inseridos += lote.length;
      }

      return jsonResponse({ inseridos, erros, total_linhas: linhas.length });
    }

    return jsonResponse({ error: 'acao inválida. use: submit | status | collect' }, 400);
  } catch (err: any) {
    return jsonResponse({ error: err.message }, 500);
  }
});
