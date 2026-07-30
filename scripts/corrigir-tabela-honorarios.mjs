// scripts/corrigir-tabela-honorarios.mjs
// Corrige dois problemas de qualidade de dados herdados da extracao original do PDF oficial:
// 1. Hifens de quebra de linha dentro de descricao/observacao/situacao (ex: "ór- gaos" -> "orgaos").
// 2. Ausencia do nome da categoria-mae para itens hierarquicos (ex: "Como patrono de ambas as
//    partes" nao diz se e divorcio, separacao, uniao estavel etc.) - agora recuperado do PDF
//    oficial e adicionado como campo `categoria`.
// Uso: npx tsx scripts/corrigir-tabela-honorarios.mjs <caminho-id_categoria.json>

import fs from "node:fs";
import { tabelaHonorarios } from "../src/data/tabelaHonorarios.ts";

const idToCategoriaPath = process.argv[2];
if (!idToCategoriaPath) {
  console.error("Uso: npx tsx scripts/corrigir-tabela-honorarios.mjs <id_categoria.json>");
  process.exit(1);
}
const idToCategoria = JSON.parse(fs.readFileSync(idToCategoriaPath, "utf8"));

function dehifenizar(texto) {
  if (texto == null) return texto;
  return texto.replace(/([a-zà-úA-ZÀ-Ú])-\s+([a-zà-ú])/g, "$1$2");
}

let categoriasAplicadas = 0;
let camposDehifenizados = 0;

const corrigidos = tabelaHonorarios.map((item) => {
  const descricaoCorrigida = dehifenizar(item.descricao);
  const observacaoCorrigida = dehifenizar(item.observacao ?? null);
  const situacoesCorrigidas = item.situacoes?.map((s) => ({
    ...s,
    situacao: dehifenizar(s.situacao),
  }));

  if (descricaoCorrigida !== item.descricao) camposDehifenizados++;
  if (observacaoCorrigida !== (item.observacao ?? null)) camposDehifenizados++;

  const categoria = idToCategoria[item.id] ?? null;
  if (categoria) categoriasAplicadas++;

  const { id, area, descricao, tipo, percentual_minimo, valor_minimo, requer_valor_causa, observacao, situacoes } = item;
  const novoItem = {
    id,
    area,
    categoria,
    descricao: descricaoCorrigida,
    tipo,
    percentual_minimo,
    valor_minimo,
    requer_valor_causa,
    ...(observacao !== undefined ? { observacao: observacaoCorrigida } : {}),
    ...(situacoes !== undefined ? { situacoes: situacoesCorrigidas } : {}),
  };
  return novoItem;
});

console.log("Categorias aplicadas:", categoriasAplicadas, "/", tabelaHonorarios.length);
console.log("Campos com hifen corrigido (descricao ou observacao):", camposDehifenizados);

const header = `// src/data/tabelaHonorarios.ts
// Tabela de Honorários Mínimos OAB-MA 2026
// Fonte: Documento oficial OAB-MA — NOVA_TABELA_HONORARIOS_OAB-MA_COM_EMENDAS
// Total: 970 itens | 31 áreas do direito
// AVISO: Valores de referência. Sempre confirme no documento oficial antes de formalizar contratos.

export type TipoCalculo = 'fixo' | 'percentual' | 'faixas';

export interface SituacaoItem {
  situacao: string;
  valor_minimo: number;
}

export interface ItemTabela {
  id: string;
  area: string;
  categoria?: string | null;
  descricao: string;
  tipo: TipoCalculo;
  percentual_minimo: number | null;
  valor_minimo: number | null;
  requer_valor_causa: boolean;
  observacao?: string | null;
  situacoes?: SituacaoItem[];
}

export const AVISO_TABELA =
  'Os valores apresentados são baseados na Tabela de Honorários Mínimos OAB-MA 2026. ' +
  'Sempre confirme no documento oficial antes de formalizar contratos.';

export const tabelaHonorarios: ItemTabela[] = `;

const body = JSON.stringify(corrigidos, null, 2) + ";\n";

fs.writeFileSync(
  new URL("../src/data/tabelaHonorarios.ts", import.meta.url),
  header + body,
  "utf8"
);

console.log("Arquivo src/data/tabelaHonorarios.ts regravado com sucesso.");
