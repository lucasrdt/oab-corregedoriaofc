// scripts/extrair-categorias-honorarios.mjs
// Extrai o mapeamento id -> categoria-mae a partir do texto do PDF oficial
// (public/Tabela_Honorarios_OABMA_2026_VisualLaw.pdf), recuperando os cabecalhos de categoria
// hierarquicos que nao foram capturados na extracao original de src/data/tabelaHonorarios.ts
// (ex: item "Como patrono de ambas as partes" nao diz se e divorcio, separacao, uniao estavel).
//
// Uso:
//   pdftotext -layout -enc UTF-8 public/Tabela_Honorarios_OABMA_2026_VisualLaw.pdf tabela.txt
//   node scripts/extrair-categorias-honorarios.mjs tabela.txt id_categoria.json
//
// O resultado alimenta scripts/corrigir-tabela-honorarios.mjs, que aplica as categorias (e
// corrige hifens de quebra de linha) direto em src/data/tabelaHonorarios.ts.

import fs from "node:fs";

const text = fs.readFileSync(process.argv[2], "utf8");
const lines = text.split("\n");

const STATUS_TAGS = new Set(["ATUALIZADO", "EMENDA", "PROPOSTA 26", "NOVA ÁREA", "NOVO"]);

function stripStatusSuffix(line) {
  // Remove tags de status/situacao que grudam no fim da linha de cabecalho
  // (ex: "... PROPOSTA 26", "... NOVA ÁREA", "— NOVA ÁREA", "— PROPOSTA 26").
  let out = line
    .replace(/\s*[—–-]?\s*(PROPOSTA 26|NOVA ÁREA|ATUALIZADO|EMENDA)\s*$/g, "")
    .trim();
  // Remove traco solto no final (valor vazio de coluna % que colou na linha do cabecalho).
  out = out.replace(/\s*[—–-]\s*$/, "").trim();
  // Se a segunda metade repete a primeira metade ao pe da letra (cabecalho duplicado por
  // artefato de extracao do PDF), mantem so a primeira ocorrencia.
  const mid = Math.floor(out.length / 2);
  for (const cut of [out.length - Math.floor(out.length / 2), mid]) {
    const a = out.slice(0, cut).trim();
    const b = out.slice(cut).trim();
    if (a.length > 10 && a === b) {
      out = a;
      break;
    }
  }
  return out;
}

function isHeaderLine(raw) {
  const line = raw.trim();
  if (!line) return false;
  if (/^\d/.test(line)) return false; // itens comecam com numero
  if (/CAPÍTULO\s+\d/.test(line)) return false; // titulo de capitulo (mesmo com marcador "◆" na frente)
  if (/^ITEM\s+SERVIÇO/.test(line)) return false; // cabecalho de coluna, qualquer espacamento/tabs
  if (/VALOR\s+2021|VALOR\s+PROPOSTO|^SITUAÇÃO/.test(line)) return false; // assinatura de cabecalho de coluna
  if (/^TABELA COMPLETA DE HONOR/.test(line)) return false; // subtitulo do documento, pagina 1
  if (/R\$/.test(line)) return false;
  if (/^(%|VALOR|SITUAÇÃO)/.test(line)) return false;
  if (STATUS_TAGS.has(line.replace(/^[—–-]\s*/, "").trim())) return false; // linha e so uma tag solta
  if (/[a-z]/.test(line)) return false; // qualquer minuscula -> nao e cabecalho em caixa alta
  if (!/[A-ZÀ-Ú]/.test(line)) return false; // precisa ter ao menos uma letra
  return true;
}

const idRegex = /^(\d+(?:\.\d+)+(?:-[A-Z])?)\s+(.+)$/;

let currentCategory = null;
let previousLineWasHeader = false;
const idToCategory = {};

for (const raw of lines) {
  const line = raw.trim();
  if (isHeaderLine(line)) {
    const cleaned = stripStatusSuffix(
      line.replace(/\s{2,}/g, " ").replace(/([A-ZÀ-Ú])-\s+([A-ZÀ-Ú])/g, "$1$2")
    );
    // Cabecalhos que se estendem por mais de uma linha fisica (sem hifen na quebra) sao
    // concatenados; uma linha em branco ou um item entre eles reinicia a categoria.
    currentCategory = previousLineWasHeader && currentCategory ? `${currentCategory} ${cleaned}` : cleaned;
    previousLineWasHeader = true;
    continue;
  }
  previousLineWasHeader = false;
  const m = line.match(idRegex);
  if (m) {
    idToCategory[m[1]] = currentCategory;
  }
}

// Correcoes pontuais de artefatos de OCR/extracao que o parser generico nao cobre
// (confirmados manualmente contra o PDF original).
const MANUAL_FIXES = {
  "SEPARAÇÃO 0, EXTRAJUDICIAL – SEM BENS A SEREM PARTILHADOS": "SEPARAÇÃO EXTRAJUDICIAL – SEM BENS A SEREM PARTILHADOS",
  "ASSESSORIA E CONSULTORIA JURÍDICA PARA CÂMARA DE VEREADORES EM MATÉRIAS ADMINISTRATIVAS, EM GERAL (COM PRESTAÇÃO TERCEIRIZADA DE SERVIÇOS REGULARES) ASSESSORIA E CONSULTORIA JURÍDICA PARA CÂMARA DE VEREADORES EM MATÉRIAS ADMINISTRATIVAS, EM GERAL (COM PRESTAÇÃO TERCEIRIZADA DE SERVIÇOS REGULARES)":
    "ASSESSORIA E CONSULTORIA JURÍDICA PARA CÂMARA DE VEREADORES EM MATÉRIAS ADMINISTRATIVAS, EM GERAL (COM PRESTAÇÃO TERCEIRIZADA DE SERVIÇOS REGULARES)",
};
for (const id of Object.keys(idToCategory)) {
  const fixed = MANUAL_FIXES[idToCategory[id]];
  if (fixed) idToCategory[id] = fixed;
}

fs.writeFileSync(process.argv[3], JSON.stringify(idToCategory, null, 2), "utf8");
console.log(`Total ids mapeados: ${Object.keys(idToCategory).length}`);
