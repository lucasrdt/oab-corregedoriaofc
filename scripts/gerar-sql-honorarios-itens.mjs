// scripts/gerar-sql-honorarios-itens.mjs
// Gera um arquivo SQL com INSERT ... ON CONFLICT DO UPDATE para popular
// public.honorarios_itens a partir dos 970 itens de src/data/tabelaHonorarios.ts.
// Uso: npx tsx scripts/gerar-sql-honorarios-itens.mjs > scratchpad/honorarios_itens_seed.sql

import { tabelaHonorarios } from "../src/data/tabelaHonorarios.ts";

function sqlString(value) {
  if (value === null || value === undefined) return "null";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlNumber(value) {
  if (value === null || value === undefined) return "null";
  return String(value);
}

function sqlBool(value) {
  return value ? "true" : "false";
}

function sqlJsonb(value) {
  if (value === null || value === undefined) return "null";
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
}

const lines = [];
lines.push("-- Gerado automaticamente por scripts/gerar-sql-honorarios-itens.mjs. Nao editar a mao.");
lines.push("begin;");

for (const item of tabelaHonorarios) {
  const cols = [
    "id", "area", "categoria", "descricao", "tipo",
    "percentual_minimo", "valor_minimo", "requer_valor_causa",
    "observacao", "situacoes",
  ];
  const values = [
    sqlString(item.id),
    sqlString(item.area),
    sqlString(item.categoria),
    sqlString(item.descricao),
    sqlString(item.tipo),
    sqlNumber(item.percentual_minimo),
    sqlNumber(item.valor_minimo),
    sqlBool(item.requer_valor_causa),
    sqlString(item.observacao),
    sqlJsonb(item.situacoes),
  ];
  lines.push(
    `insert into public.honorarios_itens (${cols.join(", ")}) values (${values.join(", ")}) ` +
    `on conflict (id) do update set ` +
    cols.slice(1).map((c) => `${c} = excluded.${c}`).join(", ") +
    `, updated_at = now();`
  );
}

lines.push("commit;");

process.stdout.write(lines.join("\n") + "\n");
