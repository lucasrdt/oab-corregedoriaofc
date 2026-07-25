// src/lib/minutas/docx.ts
// Preenchimento dos templates .docx da Biblioteca de Minutas (ver src/data/minutasModelos.ts)
// via docxtemplater. Os placeholders nos arquivos em public/minutas/templates usam
// delimitadores {{campo_id}} (confirmado por scripts/validar-templates-minutas.mjs).

import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export async function gerarDocxBlob(
  arquivoTemplate: string,
  campos: Record<string, string | number>,
): Promise<Blob> {
  const response = await fetch(arquivoTemplate);
  if (!response.ok) {
    throw new Error('Não foi possível carregar o modelo .docx.');
  }

  const arrayBuffer = await response.arrayBuffer();
  const zip = new PizZip(arrayBuffer);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: { start: '{{', end: '}}' },
    // Campo sem valor (opcional não preenchido, ou obrigatório que o advogado ainda não
    // completou) vira uma lacuna visível no documento, em vez de quebrar a geração.
    nullGetter: () => '____________________',
  });

  doc.render(campos);

  return doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
}

export function baixarBlob(blob: Blob, nomeArquivo: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
