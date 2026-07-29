// supabase/functions/gerar-embeddings-honorarios/index.ts
// Ferramenta interna (Fase 3): gera/regenera embeddings dos itens de honorarios_itens via
// Voyage AI (modelo voyage-3.5, escolhido apos comparacao empirica com voyage-law-2). Roda uma
// vez apos qualquer mudanca no conteudo da tabela (novo item, descricao editada, etc) - a
// coluna "embedding" alimenta a busca hibrida usada por claude-honorarios. Uso pontual via
// curl autenticado - nao e chamada pelo frontend.
//   POST { modelo: "voyage-3.5", coluna: "embedding", offset?, limite? }
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

    const voyageKey = Deno.env.get('VOYAGE_API_KEY');
    if (!voyageKey) return jsonResponse({ error: 'VOYAGE_API_KEY não configurada' }, 500);

    const body = await req.json().catch(() => ({}));
    const modelo = body.modelo ?? 'voyage-3.5';
    const coluna = body.coluna ?? 'embedding';
    const offset = Number(body.offset ?? 0);
    const limite = Number(body.limite ?? 150);

    const { data: itens, error } = await supabaseAdmin
      .from('honorarios_itens')
      .select('id, area, categoria, descricao, tipo, percentual_minimo, valor_minimo, observacao')
      .order('id')
      .range(offset, offset + limite - 1);
    if (error) return jsonResponse({ error: error.message }, 500);

    const todos = itens as ItemRow[];
    const textos = todos.map(descreverItem);

    const voyageResp = await fetch('https://api.voyageai.com/v1/embeddings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${voyageKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: textos, model: modelo, input_type: 'document' }),
    });
    const voyageData = await voyageResp.json();
    if (!voyageResp.ok) return jsonResponse({ error: voyageData }, voyageResp.status);

    const embeddings: number[][] = voyageData.data
      .sort((a: any, b: any) => a.index - b.index)
      .map((d: any) => d.embedding);
    if (embeddings.length !== todos.length) {
      return jsonResponse({ error: `Esperava ${todos.length} embeddings, recebeu ${embeddings.length}` }, 500);
    }

    const ids = todos.map((item) => item.id);
    const embeddingsJson = embeddings.map((e) => JSON.stringify(e));
    const { data: atualizados, error: updateError } = await supabaseAdmin.rpc('atualizar_embeddings_lote', {
      ids,
      embeddings_json: embeddingsJson,
      coluna_alvo: coluna,
    });
    if (updateError) return jsonResponse({ error: updateError.message }, 500);

    return jsonResponse({
      atualizados,
      modelo,
      coluna,
      offset,
      recebidos_nesta_fatia: todos.length,
      tokens_usados: voyageData.usage?.total_tokens,
    });
  } catch (err: any) {
    return jsonResponse({ error: err.message }, 500);
  }
});
