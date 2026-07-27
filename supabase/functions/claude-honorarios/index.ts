// supabase/functions/claude-honorarios/index.ts
// Fase 3 (continuacao): pipeline de busca em 3 camadas antes de responder.
// 1) Extrai o pedido central da pergunta (Haiku) - tira o ruido de perguntas com muito
//    contexto/narrativa, que atrapalham tanto a busca por palavra-chave quanto a semantica.
// 2) Busca hibrida (palavra-chave + embeddings via Voyage AI) com o pedido extraido.
// 3) Checa a confianca do resultado (distancia de cosseno minima): se a busca claramente nao
//    achou nada bom, cai pra mandar a TABELA INTEIRA (970 itens) em vez dos itens filtrados -
//    mais lento e caro, mas medido em teste real como MUITO mais preciso nesses casos dificeis
//    (86.7% de acerto vs a busca nao achando o item de jeito nenhum). So paga esse custo nas
//    perguntas realmente dificeis, nao em todas.
//
// Degradacao graciosa: se a Voyage falhar (rate limit, rede, etc.), cai pra busca so por
// palavra-chave (sem embeddings, sem fallback de confianca) em vez de quebrar o chat inteiro.
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Acima desse valor, a busca semantica esta "no chute" (medido no dataset de avaliacao da
// Fase 3: perguntas com distancia minima acima disso tem recall bem pior) - dispara o fallback
// pra tabela inteira.
const LIMIAR_DISTANCIA_FALLBACK = 0.47;

const SYSTEM_PROMPT_BASE = `Você é um assistente jurídico especializado da OAB-MA (Ordem dos Advogados do Brasil — Seccional Maranhão).

Seu papel é responder dúvidas de advogados inscritos na OAB-MA sobre honorários advocatícios, com base exclusivamente na Tabela de Honorários Mínimos OAB-MA 2026 (versão final VisualLaw — inclui emendas do Cons. Michael Eceiza e reajuste de 10% nos itens não atualizados).

Você NÃO recebe necessariamente a tabela inteira: na maioria das vezes, um sistema de busca seleciona automaticamente os itens mais relevantes (bloco enviado logo após estas regras) e é SOMENTE com base neles que você deve responder. Em alguns casos você recebe a tabela completa — nesse caso, use-a inteira para encontrar o item certo.

## REGRAS OBRIGATÓRIAS

1. Responda SEMPRE em português do Brasil, com linguagem formal e objetiva.
2. Cite SEMPRE o número do indicativo (ex: item 2.1, item 16.3) ao informar um valor.
3. Quando houver percentual E valor mínimo, informe os dois e explique que vale o maior.
4. Quando o item tiver situações (a, b, c), apresente todas as opções ao advogado.
5. Quando houver observação de acréscimo ou cálculo especial, informe claramente.
6. NUNCA invente valores. Se o bloco de itens vier vazio ou nenhum item corresponder de fato à pergunta, diga que não foi localizado na tabela e oriente a consultar o documento oficial — não tente adivinhar com base em itens parecidos de área diferente. Cada item vem marcado com "[Área]" entre colchetes antes da categoria/descrição — vários itens diferentes podem ter a mesma descrição genérica (ex: "Mandado de Segurança") em áreas distintas; use SEMPRE a área correta indicada, nunca invente ou presuma a área de um item. Quando dois itens de áreas diferentes parecerem ambos plausíveis, escolha o que corresponde à área mencionada ou implícita na pergunta do usuário — não hedge listando os dois como se fossem igualmente válidos.
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

function extrairIdsReferenciados(mensagem: string): string[] {
  const matches = mensagem.match(/\b\d{1,2}\.\d{1,2}(?:\.\d{1,2})?\b/g);
  return matches ? [...new Set(matches)] : [];
}

const SCHEMA_EXTRACAO = {
  type: 'object',
  properties: {
    pedido_central: {
      type: 'string',
      description: 'O serviço jurídico específico que a pessoa quer saber o honorário, em uma frase curta e direta, sem os detalhes da história do cliente (nomes, motivos, contexto emocional).',
    },
  },
  required: ['pedido_central'],
  additionalProperties: false,
};

// Extrai o pedido central da pergunta via Haiku (rapido/barato) - tira o ruido de perguntas
// com muito contexto/narrativa. Se falhar por qualquer motivo, usa a mensagem original.
async function extrairPedidoCentral(anthropicKey: string, mensagem: string): Promise<string> {
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': anthropicKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 200,
        system: 'Você extrai o pedido jurídico central de perguntas de advogados sobre honorários, removendo a narrativa/contexto do cliente.',
        messages: [{ role: 'user', content: mensagem }],
        output_config: { format: { type: 'json_schema', schema: SCHEMA_EXTRACAO } },
      }),
    });
    if (!resp.ok) return mensagem;
    const data = await resp.json();
    const textBlock = data.content?.find((b: any) => b.type === 'text');
    if (!textBlock) return mensagem;
    const parsed = JSON.parse(textBlock.text);
    return parsed.pedido_central || mensagem;
  } catch {
    return mensagem;
  }
}

// Busca o embedding da pergunta via Voyage AI. Retorna null em qualquer falha (rate limit,
// rede, etc.) - o chamador deve degradar graciosamente pra busca so por palavra-chave.
async function buscarEmbedding(voyageKey: string, texto: string): Promise<number[] | null> {
  try {
    const resp = await fetch('https://api.voyageai.com/v1/embeddings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${voyageKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: [texto], model: 'voyage-3.5', input_type: 'query' }),
    });
    if (!resp.ok) {
      console.error('[claude-honorarios] Voyage falhou, degradando pra busca so-palavra-chave:', await resp.text());
      return null;
    }
    const data = await resp.json();
    return data.data?.[0]?.embedding ?? null;
  } catch (err) {
    console.error('[claude-honorarios] Exception na Voyage, degradando pra busca so-palavra-chave:', err);
    return null;
  }
}

interface ResultadoBusca {
  itens: ItemHonorario[];
  usouTabelaCompleta: boolean;
}

// Perguntas curtas/diretas (a maioria, pelo padrao real observado no chat) sao bem atendidas
// pela busca rapida so-palavra-chave (~92-95% de recall medido). So vale pagar a latencia
// extra da extracao+embedding (pipeline completo) quando a pergunta parece ter narrativa/
// contexto (mais longa) OU quando a busca rapida claramente nao achou nada bom - assim a
// maioria das perguntas continua respondendo em ~1-2s, e so as dificeis pagam mais.
const LIMIAR_TAMANHO_PERGUNTA_LONGA = 180;

async function buscarItensRelevantes(
  supabaseAdmin: ReturnType<typeof createClient>,
  anthropicKey: string,
  voyageKey: string | undefined,
  mensagem: string,
): Promise<ResultadoBusca> {
  const idsReferenciados = extrairIdsReferenciados(mensagem);
  const idsPromise = idsReferenciados.length > 0
    ? supabaseAdmin.from('honorarios_itens').select('*').in('id', idsReferenciados)
    : Promise.resolve({ data: [], error: null });

  // Caminho rapido primeiro (sempre): busca so por palavra-chave na mensagem original, sem
  // nenhuma chamada de IA/embedding extra antes de comecar.
  //
  // Tentativa revertida: usar "o modo AND-preciso da busca encontrou algo?" como sinal de
  // pergunta dificil parecia bom em teoria, mas na pratica o websearch_to_tsquery do Postgres
  // NAO trata palavras de pergunta em portugues ("quanto", "cobrar", "qual") como stopword -
  // ele exige que o item contenha essas palavras tambem, o que quase nenhum item tem. Resultado:
  // o sinal disparava pra quase toda pergunta real (inclusive as faceis, tipo "quanto cobrar por
  // inventario?"), nao so as dificeis - teria feito o pipeline caro rodar sempre, undo do ganho
  // de latencia da Fase 1. Ficou registrado pra uma correcao futura mais robusta (tirar essas
  // palavras de pergunta antes de montar a tsquery), mas exige mais teste antes de reativar.
  const buscaRapida = await supabaseAdmin.rpc('buscar_honorarios_itens', { termo_busca: mensagem, limite: 25 });
  if (buscaRapida.error) console.error('[claude-honorarios] Erro na busca rapida:', buscaRapida.error);

  const perguntaParecheLonga = mensagem.length >= LIMIAR_TAMANHO_PERGUNTA_LONGA;
  const buscaRapidaFraca = !buscaRapida.data || buscaRapida.data.length === 0;

  let usouTabelaCompleta = false;
  let buscaResult = buscaRapida;

  // So escala pro pipeline caro (extracao + embedding + busca hibrida + possivel tabela
  // inteira) quando ha sinal de que vale a pena - pergunta longa/com contexto, ou a busca
  // rapida nao achou nada.
  if (voyageKey && (perguntaParecheLonga || buscaRapidaFraca)) {
    const pedidoCentral = await extrairPedidoCentral(anthropicKey, mensagem);
    const embedding = await buscarEmbedding(voyageKey, pedidoCentral);

    if (embedding) {
      const [distanciaResult, hibridoResult] = await Promise.all([
        supabaseAdmin.rpc('distancia_minima_embedding', { embedding_busca: embedding }),
        supabaseAdmin.rpc('buscar_honorarios_itens_hibrido', { termo_busca: pedidoCentral, embedding_busca: embedding, limite: 25 }),
      ]);
      if (!hibridoResult.error) buscaResult = hibridoResult;
      const distancia = distanciaResult.data as number | null;
      if (distancia != null && distancia > LIMIAR_DISTANCIA_FALLBACK) {
        usouTabelaCompleta = true;
      }
    } else if (buscaRapidaFraca) {
      // Voyage falhou e a busca rapida tambem nao achou nada - tenta de novo so com
      // palavra-chave usando o pedido extraido (pode ter menos ruido que a mensagem crua).
      const retry = await supabaseAdmin.rpc('buscar_honorarios_itens', { termo_busca: pedidoCentral, limite: 25 });
      if (!retry.error && retry.data?.length > 0) buscaResult = retry;
    }
  }

  if (buscaResult.error) console.error('[claude-honorarios] Erro na busca:', buscaResult.error);

  const idsResult = await idsPromise;
  if (idsResult.error) console.error('[claude-honorarios] Erro na busca por id:', idsResult.error);

  if (usouTabelaCompleta) {
    const { data: todos, error } = await supabaseAdmin
      .from('honorarios_itens')
      .select('id, area, categoria, descricao, tipo, percentual_minimo, valor_minimo, requer_valor_causa, observacao, situacoes')
      .order('id');
    if (error) {
      console.error('[claude-honorarios] Erro ao buscar tabela completa, usando resultado da busca hibrida mesmo:', error);
      usouTabelaCompleta = false;
    } else {
      return { itens: todos as ItemHonorario[], usouTabelaCompleta: true };
    }
  }

  const porId = new Map<string, ItemHonorario>();
  for (const item of (idsResult.data ?? []) as ItemHonorario[]) porId.set(item.id, item);
  for (const item of (buscaResult.data ?? []) as ItemHonorario[]) if (!porId.has(item.id)) porId.set(item.id, item);

  return { itens: [...porId.values()], usouTabelaCompleta: false };
}

function montarBlocoContexto(resultado: ResultadoBusca): string {
  if (resultado.itens.length === 0) {
    return 'ITENS RELEVANTES PARA ESTA PERGUNTA:\n(nenhum item da tabela correspondeu a esta pergunta — siga a regra 6)';
  }
  const cabecalho = resultado.usouTabelaCompleta
    ? 'TABELA COMPLETA DE HONORÁRIOS (a busca automática não teve confiança suficiente nesta pergunta — segue a tabela inteira)'
    : 'ITENS RELEVANTES PARA ESTA PERGUNTA (selecionados automaticamente, podem não ser exaustivos)';
  return `${cabecalho}:\n\n${resultado.itens.map(formatarItem).join('\n')}`;
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
    const voyageKey = Deno.env.get('VOYAGE_API_KEY');

    const resultadoBusca = await buscarItensRelevantes(supabaseAdmin, anthropicKey, voyageKey, mensagem);
    const blocoContexto = montarBlocoContexto(resultadoBusca);

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
          { type: 'text', text: SYSTEM_PROMPT_BASE, cache_control: { type: 'ephemeral', ttl: '1h' } },
          // Contexto dinamico: muda a cada pergunta (itens filtrados OU tabela inteira quando
          // a busca nao teve confianca), entao nao leva cache_control proprio. Quando cai na
          // tabela inteira, o TEXTO em si e sempre o mesmo (a tabela nao muda entre perguntas),
          // mas nao vale a pena cachear separadamente so pra esse caso raro.
          { type: 'text', text: blocoContexto },
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
