-- scripts/eval-honorarios/harness_recall.sql
-- Harness de recall da busca textual (Fase 3): pra cada pergunta do dataset de avaliacao
-- (public.honorarios_eval_dataset) com item esperado conhecido, roda a mesma funcao de busca
-- usada pela Edge Function claude-honorarios (buscar_honorarios_itens) e verifica se o item
-- certo aparece nos top-15 resultados. 100% em Postgres, sem custo de IA - roda em segundos.
--
-- Uso: supabase db query --linked -f scripts/eval-honorarios/harness_recall.sql

with resultados as (
  select
    d.id as pergunta_id,
    d.tipo_pergunta,
    d.item_id_base,
    b.area,
    bool_or(r.id = d.item_id_esperado) as encontrado_principal,
    bool_or(d.item_id_esperado_secundario is not null and r.id = d.item_id_esperado_secundario) as encontrado_secundario
  from public.honorarios_eval_dataset d
  join public.honorarios_itens b on b.id = d.item_id_base
  left join lateral public.buscar_honorarios_itens(d.pergunta, 15) r on true
  where d.item_id_esperado is not null
  group by d.id, d.tipo_pergunta, d.item_id_base, b.area
)
select
  tipo_pergunta,
  count(*) as total,
  count(*) filter (where encontrado_principal) as encontrados,
  round(100.0 * count(*) filter (where encontrado_principal) / count(*), 1) as recall_pct
from resultados
group by tipo_pergunta
order by recall_pct asc;
