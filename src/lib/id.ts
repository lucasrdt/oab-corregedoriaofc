// crypto.randomUUID() só existe em secure context (HTTPS ou localhost) — acessando o site
// por IP de rede ou HTTP puro, ele fica indefinido e derruba qualquer código que dependa
// dele sem checagem. Usar gerarId() no lugar de crypto.randomUUID() direto em toda parte.
export function gerarId(): string {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}
