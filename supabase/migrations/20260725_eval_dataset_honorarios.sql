-- supabase/migrations/20260725_eval_dataset_honorarios.sql
-- Fase 3 do plano de reducao de latencia/qualidade do chat de honorarios: dataset de
-- avaliacao (~1800-2000 perguntas com gabarito conhecido) pra medir objetivamente recall da
-- busca textual e precisao da resposta final, em vez de testar manualmente um punhado de
-- perguntas.

-- Marca os ~200 itens (amostra estratificada, proporcional por area, minimo 2 por area) que
-- recebem variacoes extras de pergunta (sinonimos, contexto, ambigua, comparativa) alem da
-- pergunta base em linguagem natural que TODOS os 970 itens recebem.
alter table public.honorarios_itens add column if not exists amostra_avaliacao boolean not null default false;

create table if not exists public.honorarios_eval_dataset (
  id uuid primary key default gen_random_uuid(),
  item_id_base text references public.honorarios_itens(id),
  tipo_pergunta text not null check (tipo_pergunta in ('linguagem_natural', 'sinonimos', 'contexto', 'ambigua', 'comparativa', 'fora_escopo')),
  pergunta text not null,
  -- item(s) que a busca/resposta deveriam identificar corretamente. Nulo para 'ambigua'
  -- (comportamento esperado e pedir esclarecimento, nao chutar um item) e 'fora_escopo'
  -- (nao ha item de honorarios relacionado).
  item_id_esperado text references public.honorarios_itens(id),
  item_id_esperado_secundario text references public.honorarios_itens(id), -- segundo item, so para 'comparativa'
  comportamento_esperado text not null check (comportamento_esperado in ('resposta_direta', 'pedir_esclarecimento', 'recusar_fora_escopo', 'comparar_dois')),
  valor_esperado numeric,
  created_at timestamptz not null default now()
);

create index if not exists honorarios_eval_dataset_item_idx on public.honorarios_eval_dataset (item_id_base);
create index if not exists honorarios_eval_dataset_tipo_idx on public.honorarios_eval_dataset (tipo_pergunta);

alter table public.honorarios_eval_dataset enable row level security;

drop policy if exists "Leitura publica do dataset de avaliacao" on public.honorarios_eval_dataset;
create policy "Leitura publica do dataset de avaliacao" on public.honorarios_eval_dataset
  for select
  to public
  using (true);
