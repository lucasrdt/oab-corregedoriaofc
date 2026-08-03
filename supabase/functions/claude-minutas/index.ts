// supabase/functions/claude-minutas/index.ts
//
// Recebe a descricao livre de um caso + o id de um modelo de minuta, e devolve os
// valores dos campos variaveis extraidos via IA (Structured Outputs da Anthropic),
// para preencher o template .docx correspondente (ver src/data/minutasModelos.ts e
// supabase/functions/claude-minutas/modelos.ts - gerado automaticamente a partir do
// primeiro por scripts/gerar-modelos-edge-minutas.mjs).
//
// Contrato:
//   POST /functions/v1/claude-minutas
//   Headers: Authorization: Bearer <token de sessao>, apikey: <anon key>
//   Body: {
//     modeloId: string,            // ex: "procuracao-geral"
//     descricao: string,           // descricao livre do caso, escrita pelo advogado
//     camposFaltantes?: string[],  // ids dos campos que ainda precisam ser preenchidos
//                                  // (default: todos os campos do modelo). O frontend
//                                  // deve excluir daqui os campos ja preenchidos com
//                                  // dados do perfil do advogado logado (nome, OAB) -
//                                  // esses NAO devem ser "adivinhados" pela IA.
//   }
//   Resposta 200: {
//     campos: Record<string, string | number>,  // valores extraidos com sucesso
//     naoIdentificados: string[],                // ids dos campos que a IA nao
//                                                 // conseguiu inferir da descricao
//   }

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { buscarModeloPorId, type CampoMinutaEdge } from './modelos.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function tipoParaJsonSchema(campo: CampoMinutaEdge): Record<string, unknown> {
  if (campo.tipo === 'selecao' && campo.opcoes?.length) {
    return { type: ['string', 'null'], enum: [...campo.opcoes, null] };
  }
  if (campo.tipo === 'numero') {
    return { type: ['number', 'null'] };
  }
  return { type: ['string', 'null'] };
}

function montarJsonSchema(campos: CampoMinutaEdge[]) {
  const properties: Record<string, unknown> = {};
  for (const campo of campos) {
    properties[campo.id] = {
      ...tipoParaJsonSchema(campo),
      description: campo.label,
    };
  }
  return {
    type: 'object',
    properties,
    required: campos.map((c) => c.id),
    additionalProperties: false,
  };
}

function montarSystemPrompt(nomeModelo: string, campos: CampoMinutaEdge[]) {
  const listaCampos = campos
    .map((c) => `- ${c.id}: ${c.label}${c.obrigatorio ? ' (obrigatório)' : ' (opcional)'}`)
    .join('\n');

  return `Você é um assistente jurídico da Corregedoria-Geral da OAB-MA. Sua tarefa é extrair dados estruturados a partir da descrição livre de um caso, escrita por um advogado, para preencher o modelo de minuta "${nomeModelo}".

Campos a preencher:
${listaCampos}

REGRAS OBRIGATÓRIAS:
1. Extraia SOMENTE informações que estão explícita ou implicitamente na descrição do caso.
2. NUNCA invente nomes, números de processo, valores, datas ou qualquer dado que não conste na descrição.
3. Se um campo não puder ser identificado com segurança na descrição, retorne null para ele — não tente adivinhar.
4. Datas devem ser formatadas como DD/MM/AAAA.
5. Valores monetários devem ser retornados como número (ex: 1500.5 para R$ 1.500,50), sem símbolo de moeda.
6. Percentuais devem ser retornados como número (ex: 20 para 20%).
7. Para campos do tipo texto/textarea, use linguagem formal e jurídica adequada ao tipo de documento, mesmo que a descrição original do advogado seja informal.`;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return jsonResponse({ error: 'Missing authorization header' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return jsonResponse({ error: 'Invalid token' }, 401);
    }

    const body = await req.json();
    const { modeloId, descricao, camposFaltantes } = body;

    if (!modeloId || typeof modeloId !== 'string') {
      return jsonResponse({ error: 'Missing or invalid field: modeloId' }, 400);
    }
    if (!descricao || typeof descricao !== 'string') {
      return jsonResponse({ error: 'Missing or invalid field: descricao' }, 400);
    }

    const modelo = buscarModeloPorId(modeloId);
    if (!modelo) {
      return jsonResponse({ error: `Modelo nao encontrado: ${modeloId}` }, 404);
    }

    const idsFiltrados = Array.isArray(camposFaltantes) && camposFaltantes.length > 0
      ? camposFaltantes
      : modelo.campos.map((c) => c.id);
    const camposParaExtrair = modelo.campos.filter((c) => idsFiltrados.includes(c.id));

    if (camposParaExtrair.length === 0) {
      return jsonResponse({ campos: {}, naoIdentificados: [] }, 200);
    }

    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) {
      return jsonResponse({ error: 'Anthropic API key is not configured' }, 500);
    }

    const jsonSchema = montarJsonSchema(camposParaExtrair);
    const systemPrompt = montarSystemPrompt(modelo.nome, camposParaExtrair);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        // Structured Outputs (output_config.format) so e suportado em modelos especificos -
        // claude-sonnet-4-6 (usado no claude-honorarios) NAO esta entre eles. claude-sonnet-5
        // suporta, e mantem a mesma familia/custo-beneficio.
        model: 'claude-sonnet-5',
        max_tokens: 2048,
        system: systemPrompt,
        output_config: {
          format: { type: 'json_schema', schema: jsonSchema },
        },
        messages: [{ role: 'user', content: descricao }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[claude-minutas] Anthropic API failed:', errorText);
      return jsonResponse(
        { error: `Anthropic API error: ${response.statusText}`, details: errorText },
        response.status
      );
    }

    const responseData = await response.json();
    // Sonnet 5 roda com thinking adaptativo por padrao e retorna um bloco "thinking"
    // antes do bloco "text" - por isso procuramos pelo tipo em vez de usar content[0].
    const blocoTexto = responseData.content?.find((b: any) => b.type === 'text');
    const textoResposta = blocoTexto?.text || '{}';
    const extraido = JSON.parse(textoResposta);

    const campos: Record<string, string | number> = {};
    const naoIdentificados: string[] = [];

    for (const campo of camposParaExtrair) {
      const valor = extraido[campo.id];
      if (valor === null || valor === undefined || valor === '') {
        naoIdentificados.push(campo.id);
      } else {
        campos[campo.id] = valor;
      }
    }

    return jsonResponse({ campos, naoIdentificados }, 200);
  } catch (err: any) {
    console.error('[claude-minutas] Exception occurred:', err.message);
    return jsonResponse({ error: err.message }, 500);
  }
});
