// A ordem aqui importa. navigator.clipboard.writeText() é async — se ele falha (foco,
// permissão, HTTP puro), o fallback só rodaria DEPOIS do await, ou seja, fora da janela do
// gesto do clique, e o navegador bloqueia o document.execCommand nesse momento. Por isso o
// caminho síncrono (execCommand) roda PRIMEIRO, ainda dentro do clique; a API moderna entra
// só como reforço opcional.
function copiarViaExecCommand(texto: string): boolean {
  const area = document.createElement("textarea");
  area.value = texto;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.left = "-9999px";
  area.style.top = "0";

  // Todo chamador deste helper roda de dentro de um Dialog/Sheet do Radix, que prende o
  // foco (FocusScope) dentro do próprio painel por acessibilidade. Um textarea anexado
  // direto no document.body fica FORA dessa área presa — assim que area.select() tenta
  // focá-lo, o Radix detecta o foco escapando e puxa de volta pro dialog, derrubando a
  // seleção antes do execCommand rodar (e o execCommand ainda pode retornar `true` mesmo
  // assim, mascarando a falha). Por isso: anexa dentro do dialog aberto, se existir.
  const container = document.querySelector<HTMLElement>('[role="dialog"]') ?? document.body;
  container.appendChild(area);
  area.select();
  area.setSelectionRange(0, area.value.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  container.removeChild(area);
  return ok;
}

export async function copiarTexto(texto: string): Promise<boolean> {
  if (copiarViaExecCommand(texto)) return true;

  if (globalThis.navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(texto);
      return true;
    } catch {
      // ignora — já tentamos os dois caminhos
    }
  }

  return false;
}
