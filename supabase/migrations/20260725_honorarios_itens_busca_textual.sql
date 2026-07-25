-- supabase/migrations/20260725_honorarios_itens_busca_textual.sql
-- Tabela canonica dos itens da Tabela de Honorarios OAB-MA 2026, com busca textual.
-- Fase 2 do plano de reducao de latencia do chat de honorarios (claude-honorarios): em vez
-- de embutir a tabela inteira (~36 mil tokens) no system prompt da IA, a Edge Function passa
-- a buscar aqui so os itens relevantes pra cada pergunta.

create table if not exists public.honorarios_itens (
  id text primary key,
  area text not null,
  categoria text,
  descricao text not null,
  tipo text not null check (tipo in ('fixo', 'percentual', 'faixas')),
  percentual_minimo numeric,
  valor_minimo numeric,
  requer_valor_causa boolean not null default false,
  observacao text,
  situacoes jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- categoria recupera o nome da categoria-mae de itens hierarquicos (ex: "Divorcio consensual
-- sem bens"), perdido na extracao original do PDF - sem isso a busca textual nao conseguia
-- distinguir itens irmaos com descricao identica (ex: "Como patrono de ambas as partes"
-- repetido em ~14 categorias diferentes de Direito de Familia).
alter table public.honorarios_itens add column if not exists categoria text;

-- Coluna de busca textual (portugues), gerada automaticamente a partir de area+categoria+
-- descricao+observacao - nao precisa de trigger, o Postgres mantem sincronizada sozinha a
-- cada insert/update. A barra "/" e trocada por espaco SO aqui (nao no texto exibido ao
-- usuario): sem isso, "CONSULTA/REUNIÃO" vira um unico lexema colado ("consulta/reuni") e a
-- palavra "consulta" nunca fica pesquisavel sozinha - afeta ~94 dos 970 itens que usam esse
-- tipo de barra sem espaco (ex: "Defesa/Recurso", "administrativo/judicial").
alter table public.honorarios_itens drop column if exists busca;
alter table public.honorarios_itens
  add column busca tsvector
  generated always as (
    to_tsvector('portuguese',
      replace(
        coalesce(area, '') || ' ' || coalesce(categoria, '') || ' ' || coalesce(descricao, '') || ' ' || coalesce(observacao, ''),
        '/', ' '
      )
    )
  ) stored;

create index if not exists honorarios_itens_busca_idx on public.honorarios_itens using gin (busca);
create index if not exists honorarios_itens_area_idx on public.honorarios_itens (area);

-- Dados publicos e nao sensiveis (mesma tabela oficial ja exposta na calculadora do site) -
-- leitura liberada pra qualquer um; sem politica de insert/update/delete (dados so mudam via
-- migration/admin, nao pela aplicacao em tempo de execucao).
alter table public.honorarios_itens enable row level security;

drop policy if exists "Leitura publica dos itens de honorarios" on public.honorarios_itens;
create policy "Leitura publica dos itens de honorarios" on public.honorarios_itens
  for select
  to public
  using (true);
