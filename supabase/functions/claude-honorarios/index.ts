// supabase/functions/claude-honorarios/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Regras fixas + persona - pequeno o bastante pra nem precisar de cache (poucas centenas de
// tokens). O conteudo especifico da tabela de honorarios NAO fica mais aqui: e buscado sob
// demanda (ver buscarItensRelevantes) e injetado como um bloco de contexto separado por
// pergunta, direto no array `system` da chamada a Anthropic.
const SYSTEM_PROMPT_BASE = `Você é um assistente jurídico especializado da OAB-MA (Ordem dos Advogados do Brasil — Seccional Maranhão).

Seu papel é responder dúvidas de advogados inscritos na OAB-MA sobre honorários advocatícios, com base exclusivamente na Tabela de Honorários Mínimos OAB-MA 2026 (versão final VisualLaw — inclui emendas do Cons. Michael Eceiza e reajuste de 10% nos itens não atualizados).

Você NÃO recebe a tabela inteira: a cada pergunta, um sistema de busca seleciona automaticamente os itens mais relevantes (bloco "ITENS RELEVANTES PARA ESTA PERGUNTA", enviado logo após estas regras) e é SOMENTE com base neles que você deve responder.

## REGRAS OBRIGATÓRIAS

1. Responda SEMPRE em português do Brasil, com linguagem formal e objetiva.
2. Cite SEMPRE o número do indicativo (ex: item 2.1, item 16.3) ao informar um valor.
3. Quando houver percentual E valor mínimo, informe os dois e explique que vale o maior.
4. Quando o item tiver situações (a, b, c), apresente todas as opções ao advogado.
5. Quando houver observação de acréscimo ou cálculo especial, informe claramente.
6. NUNCA invente valores. Se o bloco de itens relevantes vier vazio ou nenhum item corresponder de fato à pergunta, diga que não foi localizado na tabela e oriente a consultar o documento oficial — não tente adivinhar com base em itens parecidos de área diferente. Cada item vem marcado com "[Área]" entre colchetes antes da categoria/descrição — vários itens diferentes podem ter a mesma descrição genérica (ex: "Mandado de Segurança") em áreas distintas; use SEMPRE a área correta indicada, nunca invente ou presuma a área de um item.
7. Sempre finalize com: "Os valores são mínimos conforme a Tabela OAB-MA 2026 (versão final). Confirme no documento oficial antes de formalizar contratos."
8. Responda de forma direta e conversacional, como um colega experiente explicando rapidamente — não como uma tabela ou documento formal. Para perguntas diretas e específicas (um item, um valor, "quanto cobrar por X"), a resposta deve caber em 2-4 frases corridas: cite o item, informe o valor, e pare — sem títulos ("##"), sem múltiplas seções, sem tabela markdown. Se a mensagem do usuário for exatamente um dos tópicos de mensagens prontas ('Divórcio consensual', 'Audiência trabalhista', 'Inventário R$ 300 mil', 'Consulta avulsa', 'Ação cível ordinária', 'Defesa em processo criminal', 'Recurso de apelação', 'Parecer jurídico escrito', 'Diligência externa', 'Honorários previdenciários'), que são propositalmente vagos, encerre com uma pergunta curta pedindo mais detalhes do caso. Só use resposta mais longa (com listas ou múltiplos itens) quando o advogado pedir explicitamente comparação entre vários itens, todas as opções de uma área, ou mais detalhamento.`;

interface ItemHonorario {
  id: string;
  area: string;
  categoria: string | null;
  descricao: string;
  tipo: 'fixo' | 'percentual' | 'faixas';
  percentual_minimo: number | null;
  valor_minimo: number | null;
  requer_valor_causa: boolean;
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

// Referencias diretas a um item pelo numero (ex: "item 16.13", "16.13.2") - busca exata por
// id, complementando a busca textual (que pode nao rankear bem uma referencia numerica pura).
function extrairIdsReferenciados(mensagem: string): string[] {
  const matches = mensagem.match(/\b\d{1,2}\.\d{1,2}(?:\.\d{1,2})?\b/g);
  return matches ? [...new Set(matches)] : [];
}

async function buscarItensRelevantes(
  supabaseAdmin: ReturnType<typeof createClient>,
  mensagem: string,
): Promise<ItemHonorario[]> {
  const idsReferenciados = extrairIdsReferenciados(mensagem);

  const [buscaResult, idsResult] = await Promise.all([
    supabaseAdmin.rpc('buscar_honorarios_itens', { termo_busca: mensagem, limite: 25 }),
    idsReferenciados.length > 0
      ? supabaseAdmin.from('honorarios_itens').select('*').in('id', idsReferenciados)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (buscaResult.error) console.error('[claude-honorarios] Erro na busca textual:', buscaResult.error);
  if (idsResult.error) console.error('[claude-honorarios] Erro na busca por id:', idsResult.error);

  const porId = new Map<string, ItemHonorario>();
  for (const item of (idsResult.data ?? []) as ItemHonorario[]) porId.set(item.id, item);
  for (const item of (buscaResult.data ?? []) as ItemHonorario[]) if (!porId.has(item.id)) porId.set(item.id, item);

  return [...porId.values()];
}

function montarBlocoContexto(itens: ItemHonorario[]): string {
  if (itens.length === 0) {
    return 'ITENS RELEVANTES PARA ESTA PERGUNTA:\n(nenhum item da tabela correspondeu a esta pergunta — siga a regra 6)';
  }
  return `ITENS RELEVANTES PARA ESTA PERGUNTA (selecionados automaticamente, podem não ser exaustivos):\n\n${itens.map(formatarItem).join('\n')}`;
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
    if (!authHeader) return new Response(JSON.stringify({ error: 'Missing authorization header' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' } });
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' } });
    const body = await req.json();
    const { mensagem, historico } = body;
    if (!mensagem || typeof mensagem !== 'string') return new Response(JSON.stringify({ error: 'Missing mensagem' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' } });
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' } });

    // Busca os itens relevantes pra esta pergunta (busca textual no Postgres) em vez de
    // mandar a tabela inteira (~36 mil tokens) no system prompt - ver buscarItensRelevantes.
    const itensRelevantes = await buscarItensRelevantes(supabaseAdmin, mensagem);
    const blocoContexto = montarBlocoContexto(itensRelevantes);

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
        system: [
          // Regras fixas: identicas entre usuarios e perguntas, cacheadas por 1h.
          { type: 'text', text: SYSTEM_PROMPT_BASE, cache_control: { type: 'ephemeral', ttl: '1h' } },
          // Contexto dinamico (itens buscados pra esta pergunta especifica): muda a cada
          // pergunta, entao NAO leva cache_control - nao faria sentido cachear algo que
          // nunca se repete.
          { type: 'text', text: blocoContexto },
        ],
        messages: [...(Array.isArray(historico) ? historico : []), { role: 'user', content: mensagem }]
      }),
    });

    if (!anthropicResponse.ok) {
      const err = await anthropicResponse.text();
      return new Response(JSON.stringify({ error: err }), { status: anthropicResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' } });
    }

    // Repassa o stream SSE da Anthropic pro cliente como texto puro incremental (so o
    // delta de texto de cada evento, sem envelope JSON) - o cliente so precisa concatenar
    // os chunks conforme chegam, sem entender o formato de evento da Anthropic.
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
                continue; // linha parcial/nao-JSON, ignora
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