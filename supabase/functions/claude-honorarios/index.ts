// supabase/functions/claude-honorarios/index.ts
// Fase 3 (conclusao): revertido pro modelo simples (tabela inteira + cache + streaming), apos
// medir de ponta a ponta contra o pipeline de busca em camadas (extracao + embeddings + busca
// hibrida + fallback) nas 1841 perguntas do dataset de avaliacao. Resultado real: a tabela
// inteira acerta MAIS (90.2% vs 86.6% no total, bem mais em contexto/sinonimos/fora de escopo)
// e nao e significativamente mais lenta (6.23s vs 5.75s de media) - a Fase 1 (cache de 1h +
// streaming) ja resolvia o problema real de latencia percebida antes da Fase 2/3 existirem; o
// "piso" de ~5-6s e tempo de geracao da resposta, que cache nenhum elimina. O pipeline de busca
// (embeddings, Voyage AI, extracao via Haiku) ficou mais lento E menos preciso na pratica,
// alem de acrescentar uma dependencia externa fragil (rate limit da Voyage). Ver
// supabase/functions/teste-full-context/ (o protótipo desta abordagem) e
// scripts/eval-honorarios/ (harness que gerou os numeros da comparacao).
//
// Unica vitoria real do pipeline de busca: perguntas ambiguas (100% vs 77.7%) - o modelo com
// menos itens na tela hesitava menos em pedir esclarecimento. Reproduzido aqui via prompt
// (regra 9), sem precisar do pipeline inteiro pra isso.
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ItemHonorario {
  id: string;
  area: string;
  categoria: string | null;
  descricao: string;
  tipo: 'fixo' | 'percentual' | 'faixas';
  percentual_minimo: number | null;
  valor_minimo: number | null;
  observacao: string | null;
  situacoes: { situacao: string; valor_minimo: number }[] | null;
}

function formatarMoeda(valor: number): string {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

function formatarItem(item: ItemHonorario): string {
  // Area SEMPRE incluida, mesmo quando a categoria e generica (ex: "ATOS DIVERSOS" se repete
  // em varias areas diferentes) - sem isso a IA nao tem como saber a qual area o item
  // pertence e pode atribuir a area errada na resposta.
  const rotulo = item.categoria
    ? `[${item.area}] ${item.categoria} — ${item.descricao}`
    : `[${item.area}] ${item.descricao}`;

  if (item.situacoes && item.situacoes.length > 0) {
    const linhas = item.situacoes.map((s) => `  - ${s.situacao}: ${formatarMoeda(s.valor_minimo)}`);
    let bloco = `[${item.id}] ${rotulo}:\n${linhas.join('\n')}`;
    if (item.observacao) bloco += `\n  OBS: ${item.observacao}`;
    return bloco;
  }

  let linha = `[${item.id}] ${rotulo}`;
  if (item.tipo === 'percentual' && item.percentual_minimo) {
    linha += ` | ${item.percentual_minimo}%`;
    linha += item.valor_minimo != null ? ` | mínimo ${formatarMoeda(item.valor_minimo)}` : '';
  } else if (item.valor_minimo != null) {
    linha += ` | ${formatarMoeda(item.valor_minimo)}`;
  }
  if (item.observacao) linha += ` | OBS: ${item.observacao}`;
  return linha;
}

const SYSTEM_PROMPT_BASE = `Você é um assistente jurídico especializado da OAB-MA (Ordem dos Advogados do Brasil — Seccional Maranhão).

Seu papel é responder dúvidas de advogados inscritos na OAB-MA sobre honorários advocatícios, com base exclusivamente na Tabela de Honorários Mínimos OAB-MA 2026 (versão final VisualLaw — inclui emendas do Cons. Michael Eceiza e reajuste de 10% nos itens não atualizados). A tabela completa (970 itens) está logo abaixo destas regras.

## REGRAS OBRIGATÓRIAS

1. Responda SEMPRE em português do Brasil, com linguagem formal e objetiva.
2. Cite SEMPRE o número do indicativo (ex: item 2.1, item 16.3) ao informar um valor.
3. Quando houver percentual E valor mínimo, informe os dois e explique que vale o maior.
4. Quando o item tiver situações (a, b, c), apresente todas as opções ao advogado.
5. Quando houver observação de acréscimo ou cálculo especial, informe claramente.
6. NUNCA invente valores. Se nenhum item corresponder de fato à pergunta, diga que não foi localizado na tabela e oriente a consultar o documento oficial — não tente adivinhar com base em itens parecidos de área diferente. Cada item vem marcado com "[Área]" entre colchetes antes da categoria/descrição — vários itens diferentes podem ter a mesma descrição genérica (ex: "Mandado de Segurança") em áreas distintas; use SEMPRE a área correta indicada, nunca invente ou presuma a área de um item. Quando dois itens de áreas diferentes parecerem ambos plausíveis, escolha o que corresponde à área mencionada ou implícita na pergunta do usuário — não hedge listando os dois como se fossem igualmente válidos.
7. Sempre finalize com: "Os valores são mínimos conforme a Tabela OAB-MA 2026 (versão final). Confirme no documento oficial antes de formalizar contratos."
8. Responda de forma direta e conversacional, como um colega experiente explicando rapidamente — não como uma tabela ou documento formal. Para perguntas diretas e específicas (um item, um valor, "quanto cobrar por X"), a resposta deve caber em 2-4 frases corridas: cite o item, informe o valor, e pare — sem títulos ("##"), sem múltiplas seções, sem tabela markdown. Se a mensagem do usuário for exatamente um dos tópicos de mensagens prontas ('Divórcio consensual', 'Audiência trabalhista', 'Inventário R$ 300 mil', 'Consulta avulsa', 'Ação cível ordinária', 'Defesa em processo criminal', 'Recurso de apelação', 'Parecer jurídico escrito', 'Diligência externa', 'Honorários previdenciários'), que são propositalmente vagos, encerre com uma pergunta curta pedindo mais detalhes do caso. Só use resposta mais longa (com listas ou múltiplos itens) quando o advogado pedir explicitamente comparação entre vários itens, todas as opções de uma área, ou mais detalhamento.
9. Quando a pergunta for genuinamente ambígua — ou seja, quando dois ou mais itens de MESMA área e mesma categoria (não apenas áreas diferentes, isso já é a regra 6) puderem corresponder igualmente bem, e a pergunta não trouxer informação suficiente pra escolher entre eles (ex: perguntar só "quanto custa um divórcio?" sem dizer se é consensual ou litigioso, com ou sem bens, atuando pra uma ou ambas as partes) — NÃO escolha um dos itens só porque parece o mais comum. Faça uma pergunta curta e objetiva pedindo o detalhe que falta, e só responda com o valor depois de ter essa informação.
10. Se a pergunta não for sobre honorários advocatícios da tabela OAB-MA (ex: perguntas gerais, sobre outros assuntos jurídicos não relacionados a honorários, curiosidades, pedidos de tarefas fora desse escopo), diga educadamente que você é especializado só em consultas de honorários da tabela OAB-MA e não pode ajudar com esse tipo de pergunta — não tente responder mesmo que saiba a resposta.`;

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Missing authorization header' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' } });
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' } });
    const body = await req.json();
    const { mensagem, historico } = body;
    if (!mensagem || typeof mensagem !== 'string') return new Response(JSON.stringify({ error: 'Missing mensagem' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' } });
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' } });

    const { data: itens, error: itensError } = await supabaseAdmin
      .from('honorarios_itens')
      .select('id, area, categoria, descricao, tipo, percentual_minimo, valor_minimo, observacao, situacoes')
      .order('id');
    if (itensError) return new Response(JSON.stringify({ error: itensError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' } });

    const tabelaTexto = (itens as ItemHonorario[]).map(formatarItem).join('\n');
    const systemPromptCompleto = `${SYSTEM_PROMPT_BASE}\n\n## TABELA DE HONORÁRIOS MÍNIMOS OAB-MA 2026 — TABELA COMPLETA (970 itens)\n${tabelaTexto}`;

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        stream: true,
        // Regras + tabela inteira num unico bloco cacheado por 1h - a tabela raramente muda,
        // entao o cache fica quente na pratica (ver Fase 1: medido empiricamente 100% de cache
        // hit em uso repetido, sem o qual cada pergunta reprocessaria ~36 mil tokens do zero).
        system: [
          { type: 'text', text: systemPromptCompleto, cache_control: { type: 'ephemeral', ttl: '1h' } },
        ],
        messages: [...(Array.isArray(historico) ? historico : []), { role: 'user', content: mensagem }]
      }),
    });

    if (!anthropicResponse.ok) {
      const err = await anthropicResponse.text();
      return new Response(JSON.stringify({ error: err }), { status: anthropicResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' } });
    }

    const anthropicBody = anthropicResponse.body;
    if (!anthropicBody) {
      return new Response(JSON.stringify({ error: 'Resposta sem corpo da Anthropic' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' } });
    }

    const outStream = new ReadableStream({
      async start(controller) {
        const reader = anthropicBody.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let buffer = '';
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';
            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const dataStr = line.slice(6).trim();
              if (!dataStr) continue;
              let event: any;
              try {
                event = JSON.parse(dataStr);
              } catch {
                continue;
              }
              if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
                controller.enqueue(encoder.encode(event.delta.text));
              } else if (event.type === 'error') {
                console.error('[claude-honorarios] Erro no stream da Anthropic:', JSON.stringify(event));
              }
            }
          }
        } catch (err) {
          console.error('[claude-honorarios] Exception no stream:', err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(outStream, {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' } });
  }
});
