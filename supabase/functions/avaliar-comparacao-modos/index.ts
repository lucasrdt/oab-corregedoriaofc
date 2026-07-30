// supabase/functions/avaliar-comparacao-modos/index.ts
// Ferramenta interna (Fase 3): roda uma pergunta do dataset de avaliacao contra o modo
// "antigo" (teste-full-context, tabela inteira sempre) ou "atual" (claude-honorarios, o
// pipeline em camadas de producao), grava a resposta e uma nota automatica de acerto. Uso
// pontual via curl autenticado, chamado em lote por um script orquestrador externo.
//   POST { modo: "antigo" | "atual", pergunta_id }
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

// Nota automatica: procura o(s) numero(s) de item esperado no texto da resposta. Confiavel
// porque o system prompt (nos dois modos) exige citar o numero do item entre colchetes ou
// junto da palavra "item". Pra perguntas ambiguas/fora de escopo, usa heuristica de linguagem.
function avaliarResposta(resposta: string, linha: {
  item_id_esperado: string | null;
  item_id_esperado_secundario: string | null;
  comportamento_esperado: string;
}): boolean {
  const texto = resposta.toLowerCase();

  if (linha.comportamento_esperado === 'resposta_direta') {
    if (!linha.item_id_esperado) return false;
    return texto.includes(linha.item_id_esperado.toLowerCase());
  }

  if (linha.comportamento_esperado === 'comparar_dois') {
    if (!linha.item_id_esperado) return false;
    const temPrincipal = texto.includes(linha.item_id_esperado.toLowerCase());
    const temSecundario = linha.item_id_esperado_secundario
      ? texto.includes(linha.item_id_esperado_secundario.toLowerCase())
      : true;
    return temPrincipal && temSecundario;
  }

  if (linha.comportamento_esperado === 'pedir_esclarecimento') {
    const marcadoresEsclarecimento = ['?', 'poderia', 'poderia informar', 'poderia esclarecer', 'poderia detalhar', 'não tenho certeza', 'não foi possível identificar', 'poderia especificar', 'preciso de mais informa'];
    const pareceuCitarItemComCerteza = /\[\d+\.\d+/.test(resposta) && !marcadoresEsclarecimento.some((m) => texto.includes(m));
    return !pareceuCitarItemComCerteza;
  }

  if (linha.comportamento_esperado === 'recusar_fora_escopo') {
    const marcadoresRecusa = ['não é sobre honorários', 'fora do escopo', 'não posso ajudar', 'não é da minha', 'foge do escopo', 'não tenho como responder', 'não é relacionado', 'não é uma pergunta sobre honorários', 'sou um assistente especializado em honorários'];
    const citouValor = /r\$\s*\d/.test(texto);
    return marcadoresRecusa.some((m) => texto.includes(m)) && !citouValor;
  }

  return false;
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

    const body = await req.json().catch(() => ({}));
    const modo = body.modo;
    const perguntaId = body.pergunta_id;
    if (!modo || !perguntaId) return jsonResponse({ error: 'modo e pergunta_id são obrigatórios' }, 400);

    const { data: linha, error } = await supabaseAdmin
      .from('honorarios_eval_dataset')
      .select('id, pergunta, item_id_esperado, item_id_esperado_secundario, comportamento_esperado')
      .eq('id', perguntaId)
      .single();
    if (error || !linha) return jsonResponse({ error: error?.message ?? 'pergunta não encontrada' }, 404);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SUPABASE_PUBLISHABLE_KEYS')!;
    const inicio = Date.now();
    let resposta = '';
    let erro: string | null = null;

    try {
      if (modo === 'antigo') {
        const resp = await fetch(`${supabaseUrl}/functions/v1/teste-full-context`, {
          method: 'POST',
          headers: { Authorization: authHeader, apikey: anonKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({ mensagem: linha.pergunta }),
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(JSON.stringify(data));
        resposta = data.resposta ?? '';
      } else if (modo === 'atual') {
        const resp = await fetch(`${supabaseUrl}/functions/v1/claude-honorarios`, {
          method: 'POST',
          headers: { Authorization: authHeader, apikey: anonKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({ mensagem: linha.pergunta, historico: [] }),
        });
        if (!resp.ok) throw new Error(await resp.text());
        resposta = await resp.text();
      } else {
        return jsonResponse({ error: 'modo inválido' }, 400);
      }
    } catch (err: any) {
      erro = err.message ?? String(err);
    }

    const tempoMs = Date.now() - inicio;
    const acertou = erro ? null : avaliarResposta(resposta, linha);

    const { error: upsertError } = await supabaseAdmin
      .from('comparacao_modos_resultado')
      .upsert(
        { pergunta_id: perguntaId, modo, resposta: resposta || null, erro, acertou, tempo_ms: tempoMs },
        { onConflict: 'pergunta_id,modo' }
      );
    if (upsertError) return jsonResponse({ error: upsertError.message }, 500);

    return jsonResponse({ pergunta_id: perguntaId, modo, acertou, erro, tempo_ms: tempoMs });
  } catch (err: any) {
    return jsonResponse({ error: err.message }, 500);
  }
});
