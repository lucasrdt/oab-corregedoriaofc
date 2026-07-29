-- supabase/migrations/20260728_comparacao_modos_resultado.sql
-- Fase 3 (conclusao): tabela com o resultado da comparacao final de ponta a ponta entre o modo
-- "antigo" (tabela inteira sempre, via supabase/functions/teste-full-context) e o modo "atual"
-- que estava em producao (pipeline em camadas: extracao + embeddings + busca hibrida +
-- fallback). Rodada completa nas 1841 perguntas do dataset de avaliacao, nos dois modos.
--
-- Resultado (documentado aqui pra referencia futura, ver tambem o commit que reverte
-- claude-honorarios pra tabela inteira): antigo 90.2% de acerto geral / atual 86.6% - antigo
-- vence quase todas as categorias (contexto, sinonimos, comparativa, fora de escopo), atual so
-- vence em perguntas ambiguas (100% vs 77.7%). Tempo medio quase igual (6.23s vs 5.75s) porque
-- a Fase 1 (cache + streaming) ja resolvia o problema real de latencia - o "piso" de ~5-6s e
-- tempo de geracao da resposta, que nenhum dos dois modos elimina.

create table if not exists public.comparacao_modos_resultado (
  id uuid primary key default gen_random_uuid(),
  pergunta_id uuid not null references public.honorarios_eval_dataset(id),
  modo text not null check (modo in ('antigo', 'atual')),
  resposta text,
  erro text,
  acertou boolean,
  tempo_ms int,
  created_at timestamptz not null default now(),
  unique (pergunta_id, modo)
);

alter table public.comparacao_modos_resultado enable row level security;

drop policy if exists "Leitura autenticada dos resultados de comparacao" on public.comparacao_modos_resultado;
create policy "Leitura autenticada dos resultados de comparacao" on public.comparacao_modos_resultado
  for select to authenticated using (true);

grant select on public.comparacao_modos_resultado to authenticated, anon;
