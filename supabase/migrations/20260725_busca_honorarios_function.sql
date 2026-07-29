-- supabase/migrations/20260725_busca_honorarios_function.sql
-- Funcao de busca textual usada pela Edge Function claude-honorarios (Fase 2 do plano de
-- reducao de latencia): recebe a pergunta do usuario e devolve os itens mais relevantes de
-- public.honorarios_itens, ordenados por relevancia (ts_rank), em vez da IA receber a tabela
-- inteira (~36 mil tokens) no system prompt.
--
-- Estrategia em duas etapas:
-- 1) websearch_to_tsquery: mais precisa (AND entre os termos de conteudo, stopwords do
--    portugues ja descartadas pelo dicionario). Funciona bem pra perguntas curtas e diretas,
--    que sao a maioria ("quanto cobrar por divorcio consensual?").
-- 2) Fallback OR entre os lexemas individuais, usado so quando a etapa 1 nao encontra nada -
--    evita zero-resultados em perguntas mais longas/compostas onde nem todo termo aparece
--    junto no mesmo item.

create or replace function public.buscar_honorarios_itens(termo_busca text, limite int default 25)
returns table (
  id text,
  area text,
  categoria text,
  descricao text,
  tipo text,
  percentual_minimo numeric,
  valor_minimo numeric,
  requer_valor_causa boolean,
  observacao text,
  situacoes jsonb,
  relevancia real
)
language plpgsql
stable
as $$
declare
  q tsquery;
  linhas int;
  termos text[];
  termos_discriminantes text[];
  total_itens int;
begin
  q := websearch_to_tsquery('portuguese', termo_busca);

  if q is not null then
    return query
      select h.id, h.area, h.categoria, h.descricao, h.tipo, h.percentual_minimo,
             h.valor_minimo, h.requer_valor_causa, h.observacao, h.situacoes,
             ts_rank(h.busca, q) as relevancia
      from public.honorarios_itens h
      where h.busca @@ q
      order by relevancia desc
      limit limite;

    get diagnostics linhas = row_count;
    if linhas > 0 then
      return;
    end if;
  end if;

  -- Fallback: OR entre os lexemas normalizados, usado so quando a busca precisa (AND) acima
  -- nao encontra nada - evita zero-resultados em perguntas com varios termos que nao aparecem
  -- todos juntos no mesmo item. Remove numeros e palavras de quantia (ex: "300 mil reais")
  -- antes: nao aparecem como texto nos itens (valores ficam em colunas numericas), e "mil"
  -- coincide por acaso com a redacao repetitiva dos itens de Direito Municipalista
  -- ("municipios de X mil habitantes"), o que os faria dominar o ranking sem relacao real
  -- com a pergunta.
  select array_agg(distinct lexeme) into termos
  from unnest(tsvector_to_array(to_tsvector('portuguese',
    regexp_replace(termo_busca, '\m(\d+|mil|milhao|milhoes|cem|reais|real)\M', '', 'gi')
  ))) as lexeme;

  if termos is null then
    return;
  end if;

  select count(*) into total_itens from public.honorarios_itens;

  -- So entram no OR os termos "discriminantes": os que aparecem em menos de 15% dos itens.
  -- Sem isso, palavras comuns no dominio (ex: "sem", "bens", "partes", presentes em dezenas
  -- de categorias de familia) dominam o ranking por frequencia bruta e afogam o termo
  -- realmente especifico da pergunta (ex: "divorcio", "guarda", "inventario"). Usa config
  -- 'simple' pra testar o lexeme ja normalizado sem re-aplicar o stemmer portugues nele.
  select array_agg(t.lexeme) into termos_discriminantes
  from unnest(termos) as t(lexeme)
  where (
    select count(*) from public.honorarios_itens h2
    where h2.busca @@ to_tsquery('simple', t.lexeme)
  )::float / greatest(total_itens, 1) < 0.15;

  -- Se o filtro descartou tudo (pergunta feita so de termos muito genericos), usa todos os
  -- termos originais mesmo assim, pra nao devolver zero itens.
  if termos_discriminantes is null or array_length(termos_discriminantes, 1) = 0 then
    termos_discriminantes := termos;
  end if;

  q := to_tsquery('simple', array_to_string(termos_discriminantes, ' | '));
  if q is null then
    return;
  end if;

  return query
    select h.id, h.area, h.categoria, h.descricao, h.tipo, h.percentual_minimo,
           h.valor_minimo, h.requer_valor_causa, h.observacao, h.situacoes,
           ts_rank(h.busca, q) as relevancia
    from public.honorarios_itens h
    where h.busca @@ q
    order by relevancia desc
    limit limite;
end;
$$;

grant execute on function public.buscar_honorarios_itens(text, int) to authenticated, anon;
