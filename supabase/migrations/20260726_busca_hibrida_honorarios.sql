-- supabase/migrations/20260726_busca_hibrida_honorarios.sql
-- Fase 3 (continuacao): combina a busca textual existente (buscar_honorarios_itens) com busca
-- semantica por embeddings, usando Reciprocal Rank Fusion (RRF) - soma 1/(k+posicao) de cada
-- lista pra cada item, sem precisar calibrar as escalas bem diferentes de ts_rank (0-1 relativo)
-- e distancia de cosseno (0-2). Cada metodo cobre o ponto fraco do outro: palavra-chave e
-- rapida e precisa em perguntas diretas; embeddings capturam sinonimos e perguntas com
-- contexto/narrativa que nao compartilham palavras literais com o texto do item.
--
-- Parametros (30 candidatos por perna, k=30, peso igual entre os dois metodos) tunados via
-- harness contra o dataset de avaliacao da Fase 3 - testei tambem 30 candidatos/k=60 (pior) e
-- peso 1.5x pro lado semantico (pior ainda, ver commit de "perf: aumenta limite..." e o
-- historico de testes documentado na conversa). Nao mexer nesses numeros sem remedir.

create or replace function public.buscar_honorarios_itens_hibrido(
  termo_busca text,
  embedding_busca vector(1024),
  limite int default 25
)
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
language sql
stable
as $$
  with textual as (
    select h.id, row_number() over () as posicao
    from public.buscar_honorarios_itens(termo_busca, 40) h
  ),
  semantica as (
    select h.id, row_number() over (order by h.embedding <=> embedding_busca) as posicao
    from public.honorarios_itens h
    where h.embedding is not null
    order by h.embedding <=> embedding_busca
    limit 40
  ),
  combinado as (
    select id, sum(1.0 / (30 + posicao)) as rrf
    from (
      select id, posicao from textual
      union all
      select id, posicao from semantica
    ) todos
    group by id
  )
  select h.id, h.area, h.categoria, h.descricao, h.tipo, h.percentual_minimo,
         h.valor_minimo, h.requer_valor_causa, h.observacao, h.situacoes,
         c.rrf::real as relevancia
  from combinado c
  join public.honorarios_itens h on h.id = c.id
  order by c.rrf desc
  limit limite;
$$;

grant execute on function public.buscar_honorarios_itens_hibrido(text, vector, int) to authenticated, anon;

-- Usada pela Edge Function claude-honorarios pra decidir se cai no fallback de tabela
-- completa: distancia de cosseno minima entre a pergunta e qualquer item da tabela. Acima de
-- ~0.47 (medido no dataset de avaliacao), a busca semantica esta essencialmente "no chute".
create or replace function public.distancia_minima_embedding(embedding_busca vector(1024))
returns real
language sql
stable
as $$
  select min(h.embedding <=> embedding_busca)
  from public.honorarios_itens h
  where h.embedding is not null;
$$;

grant execute on function public.distancia_minima_embedding(vector) to authenticated, anon;

-- Update em lote de embeddings via unnest - usada por gerar-embeddings-honorarios. Upsert via
-- PostgREST nao funciona aqui porque tenta um INSERT completo por baixo dos panos e viola as
-- colunas NOT NULL nao incluidas no payload parcial; esta funcao faz UPDATE de verdade.
create or replace function public.atualizar_embeddings_lote(ids text[], embeddings_json text[], coluna_alvo text)
returns int
language plpgsql
as $$
declare
  atualizados int;
begin
  if coluna_alvo not in ('embedding') then
    raise exception 'coluna invalida: %', coluna_alvo;
  end if;

  execute format(
    'update public.honorarios_itens h set %I = v.emb::vector from (select unnest($1) as id, unnest($2) as emb) v where h.id = v.id',
    coluna_alvo
  ) using ids, embeddings_json;

  get diagnostics atualizados = row_count;
  return atualizados;
end;
$$;

grant execute on function public.atualizar_embeddings_lote(text[], text[], text) to authenticated, anon, service_role;
