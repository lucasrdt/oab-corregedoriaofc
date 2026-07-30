-- scripts/eval-honorarios/harness_recall_por_area.sql
-- Mesmo harness de scripts/eval-honorarios/harness_recall.sql, mas agregado por area do
-- direito em vez de tipo de pergunta - usa pra achar em qual area a busca textual falha mais.
-- Edite o filtro de tipo_pergunta conforme o que quiser investigar.
--
-- Uso: supabase db query --linked -f scripts/eval-honorarios/harness_recall_por_area.sql

with resultados as (
  select
    d.id as pergunta_id,
    d.tipo_pergunta,
    b.area,
    bool_or(r.id = d.item_id_esperado) as encontrado_principal
  from public.honorarios_eval_dataset d
  join public.honorarios_itens b on b.id = d.item_id_base
  left join lateral public.buscar_honorarios_itens(d.pergunta, 25) r on true
  where d.item_id_esperado is not null and d.tipo_pergunta in ('contexto', 'sinonimos')
  group by d.id, d.tipo_pergunta, b.area
)
select
  area,
  count(*) as total,
  count(*) filter (where encontrado_principal) as encontrados,
  round(100.0 * count(*) filter (where encontrado_principal) / count(*), 1) as recall_pct
from resultados
group by area
having count(*) >= 4
order by recall_pct asc;
