// scripts/gerar-modelos-edge-minutas.mjs
// Gera supabase/functions/claude-minutas/modelos.ts a partir de src/data/minutasModelos.ts.
// A Edge Function roda em Deno (runtime separado do bundle Vite/React), entao nao pode
// importar o arquivo .ts do frontend diretamente - esse script mantem as duas fontes
// sincronizadas automaticamente. Rodar de novo sempre que src/data/minutasModelos.ts mudar.
//
// Rodar: node scripts/gerar-modelos-edge-minutas.mjs

import { modelosMinutas } from '../src/data/minutasModelos.ts';
import fs from 'fs';
import path from 'path';

const OUT_PATH = path.resolve('supabase/functions/claude-minutas/modelos.ts');
fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });

// So o que a IA precisa pra extrair dados: id, label, tipo, obrigatorio, opcoes (quando houver).
// Metadados de UI (ajuda, categoria, descricao) ficam de fora - isso e so o "molde" pra IA.
const modelosParaEdge = modelosMinutas.map((m) => ({
  id: m.id,
  nome: m.nome,
  campos: m.campos.map((c) => ({
    id: c.id,
    label: c.label,
    tipo: c.tipo,
    obrigatorio: c.obrigatorio,
    ...(c.opcoes ? { opcoes: c.opcoes } : {}),
  })),
}));

const conteudo = `// supabase/functions/claude-minutas/modelos.ts
// GERADO AUTOMATICAMENTE por scripts/gerar-modelos-edge-minutas.mjs a partir de
// src/data/minutasModelos.ts - NAO EDITAR A MAO. Rode o script gerador de novo
// depois de qualquer mudanca no schema do frontend.

export interface CampoMinutaEdge {
  id: string;
  label: string;
  tipo: string;
  obrigatorio: boolean;
  opcoes?: string[];
}

export interface ModeloMinutaEdge {
  id: string;
  nome: string;
  campos: CampoMinutaEdge[];
}

export const modelosMinutas: ModeloMinutaEdge[] = ${JSON.stringify(modelosParaEdge, null, 2)};

export function buscarModeloPorId(id: string): ModeloMinutaEdge | undefined {
  return modelosMinutas.find((m) => m.id === id);
}
`;

fs.writeFileSync(OUT_PATH, conteudo, 'utf8');
console.log('gerado:', OUT_PATH, `(${modelosParaEdge.length} modelos)`);
