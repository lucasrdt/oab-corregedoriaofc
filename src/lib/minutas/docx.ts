// src/lib/minutas/docx.ts
// Preenchimento dos templates .docx da Biblioteca de Minutas (ver src/data/minutasModelos.ts)
// via docxtemplater. Os placeholders nos arquivos em public/minutas/templates usam
// delimitadores {{campo_id}} (confirmado por scripts/validar-templates-minutas.mjs).

import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export const DISCLAIMER_MINUTA =
  'Este modelo é de referência e deve ser revisado pelo advogado antes do uso.';

export const MIME_DOCX =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const escaparXml = (texto: string) =>
  texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

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

  const zipRenderizado = doc.getZip();

  // Os templates .docx originais não trazem o aviso legal — só a UI mostrava. Injeta o
  // aviso como último parágrafo do corpo, antes de <w:sectPr> (que precisa continuar
  // sendo o último filho de <w:body>, regra do formato OOXML), pra ele ir junto no arquivo.
  const documentXmlPath = 'word/document.xml';
  const documentXmlAtual = zipRenderizado.files[documentXmlPath].asText();
  const paragrafoAviso =
    '<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:i/><w:sz w:val="16"/><w:szCs w:val="16"/></w:rPr>' +
    `<w:t xml:space="preserve">${escaparXml(DISCLAIMER_MINUTA)}</w:t></w:r></w:p>`;
  const indiceSectPr = documentXmlAtual.indexOf('<w:sectPr');
  const documentXmlComAviso =
    indiceSectPr !== -1
      ? documentXmlAtual.slice(0, indiceSectPr) + paragrafoAviso + documentXmlAtual.slice(indiceSectPr)
      : documentXmlAtual.replace('</w:body>', `${paragrafoAviso}</w:body>`);
  zipRenderizado.file(documentXmlPath, documentXmlComAviso);

  return zipRenderizado.generate({
    type: 'blob',
    mimeType: MIME_DOCX,
  });
}

export function baixarBlob(blob: Blob, nomeArquivo: string, mimeType?: string) {
  // Reforça o MIME type oficial no momento do download, mesmo que o blob recebido já
  // tenha vindo com o tipo correto de origem — garante reconhecimento imediato por
  // Word/Google Docs independentemente de como o blob foi construído a montante.
  const blobParaBaixar =
    mimeType && blob.type !== mimeType ? new Blob([blob], { type: mimeType }) : blob;
  const url = URL.createObjectURL(blobParaBaixar);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
