// supabase/functions/teste-full-context/index.ts
// Teste pontual (Fase 3): reproduz a arquitetura ANTERIOR a Fase 2 (tabela inteira de 970
// itens embutida no system prompt, sem busca/retrieval nenhuma) pra comparar contra a
// abordagem de busca+IA em perguntas que a busca atual nao consegue achar. Objetivo: saber se
// vale a pena aceitar mais latencia/tokens em troca de melhor precisao nesses casos dificeis.
// Monta a tabela na hora a partir do banco (nao de um secret - 970 itens passa do limite de
// 24KB de um secret do Supabase). Uso pontual via curl autenticado.
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

interface ItemHonorario {
  id: string;
  area: string;
  categoria: string | null;
  descricao: string;
  tipo: string;
  percentual_minimo: number | null;
  valor_minimo: number | null;
  observacao: string | null;
  situacoes: { situacao: string; valor_minimo: number }[] | null;
}

function formatarMoeda(valor: number): string {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

function formatarItem(item: ItemHonorario): string {
  const rotulo = item.categoria
    ? `[${item.area}] ${item.categoria} — ${item.descricao}`
    : `[${item.area}] ${item.descricao}`;

  if (item.situacoes && item.situacoes.length > 0) {
    const linhas = item.situacoes.map((s) => `  - ${s.situacao}: ${formatarMoeda(s.valor_minimo)}`);
    let bloco = `[${item.id}] ${rotulo}:\n${linhas.join('\n')}`;
    if (item.observacao) bloco += `\n  OBS: ${item.observacao}`;
    return bloco;
  }

  const partes: string[] = [];
  if (item.tipo === 'percentual' && item.percentual_minimo != null) {
    partes.push(`${item.percentual_minimo}%`);
    if (item.valor_minimo != null) partes.push(`mínimo ${formatarMoeda(item.valor_minimo)}`);
  } else if (item.valor_minimo != null) {
    partes.push(formatarMoeda(item.valor_minimo));
  }
  let linha = `[${item.id}] ${rotulo}`;
  if (partes.length > 0) linha += ` | ${partes.join(' | ')}`;
  if (item.observacao) linha += ` | OBS: ${item.observacao}`;
  return linha;
}

const SYSTEM_PROMPT_BASE = `Você é um assistente jurídico especializado da OAB-MA (Ordem dos Advogados do Brasil — Seccional Maranhão).

Seu papel é responder dúvidas de advogados inscritos na OAB-MA sobre honorários advocatícios, com base exclusivamente na Tabela de Honorários Mínimos OAB-MA 2026 (versão final VisualLaw).

Você recebe a TABELA INTEIRA logo abaixo (não é um subconjunto filtrado).

## REGRAS OBRIGATÓRIAS

1. Responda SEMPRE em português do Brasil, com linguagem formal e objetiva.
2. Cite SEMPRE o número do indicativo (ex: item 2.1, item 16.3) ao informar um valor.
3. Quando houver percentual E valor mínimo, informe os dois e explique que vale o maior.
4. Quando o item tiver situações (a, b, c), apresente todas as opções ao advogado.
5. Quando houver observação de acréscimo ou cálculo especial, informe claramente.
6. NUNCA invente valores. Se não encontrar o item na tabela, diga que não foi localizado e oriente a consultar o documento oficial. Vários itens diferentes podem ter a mesma descrição genérica em áreas distintas — use SEMPRE a área correta indicada entre colchetes, nunca presuma.
7. Sempre finalize com: "Os valores são mínimos conforme a Tabela OAB-MA 2026 (versão final). Confirme no documento oficial antes de formalizar contratos."
8. Responda de forma direta e conversacional. Para perguntas diretas e específicas, a resposta deve caber em 2-4 frases: cite o item, informe o valor, e pare.

## TABELA DE HONORÁRIOS MÍNIMOS OAB-MA 2026 — TABELA COMPLETA (970 itens)
`;

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
    const mensagem = body.mensagem;
    if (!mensagem) return jsonResponse({ error: 'mensagem é obrigatória' }, 400);

    const { data: itens, error } = await supabaseAdmin
      .from('honorarios_itens')
      .select('id, area, categoria, descricao, tipo, percentual_minimo, valor_minimo, observacao, situacoes')
      .order('id');
    if (error) return jsonResponse({ error: error.message }, 500);

    const tabelaTexto = (itens as ItemHonorario[]).map(formatarItem).join('\n');
    const systemPromptCompleto = SYSTEM_PROMPT_BASE + tabelaTexto;

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: [{ type: 'text', text: systemPromptCompleto, cache_control: { type: 'ephemeral', ttl: '1h' } }],
        messages: [{ role: 'user', content: mensagem }],
      }),
    });
    const data = await resp.json();
    if (!resp.ok) return jsonResponse({ error: data }, resp.status);

    const textBlock = data.content?.find((b: any) => b.type === 'text');
    return jsonResponse({ resposta: textBlock?.text, usage: data.usage, tamanho_prompt: systemPromptCompleto.length });
  } catch (err: any) {
    return jsonResponse({ error: err.message }, 500);
  }
});
