import { modelosMinutas } from '../src/data/minutasModelos.ts';
import fs from 'fs';
import path from 'path';

const CHECK_DIR = 'C:/Users/lucas/AppData/Local/Temp/claude/c--projects-oab-corregedoriaofc-main/24180319-5651-4bbc-8810-910eaddf8f7f/scratchpad/docx-check';

let algumProblema = false;
for (const modelo of modelosMinutas) {
  const base = modelo.arquivoTemplate.replace('/minutas/templates/', '').replace('.docx', '');
  const idsEsperados = [...new Set(modelo.campos.map((c) => c.id))];

  const xmlPath = path.join(CHECK_DIR, base + '.xml');
  const xml = fs.readFileSync(xmlPath, 'utf8');
  const placeholdersNoDocx = [...new Set([...xml.matchAll(/\{\{([a-z_]+)\}\}/g)].map((m) => m[1]))];

  const faltandoNoDocx = idsEsperados.filter((id) => !placeholdersNoDocx.includes(id));
  const extraNoDocx = placeholdersNoDocx.filter((id) => !idsEsperados.includes(id));

  console.log('---', base, '---', idsEsperados.length, 'campos /', placeholdersNoDocx.length, 'placeholders');
  if (faltandoNoDocx.length) {
    console.log('  FALTANDO no docx:', faltandoNoDocx);
    algumProblema = true;
  }
  if (extraNoDocx.length) {
    console.log('  EXTRA no docx:', extraNoDocx);
    algumProblema = true;
  }
}
console.log(algumProblema ? '\nPROBLEMAS ENCONTRADOS' : '\nTUDO OK - todos os placeholders batem exatamente com os campos do schema');
