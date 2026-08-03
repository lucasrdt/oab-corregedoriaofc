import { useCallback, useState } from "react";
import { tabelaHonorarios, type ItemTabela } from "@/data/tabelaHonorarios";

const STORAGE_KEY = "honorarios:recentes";
const MAX_RECENTES = 6;

function lerIds(): string[] {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    return bruto ? (JSON.parse(bruto) as string[]) : [];
  } catch {
    return [];
  }
}

// Advogado consultando a tabela costuma voltar nos mesmos itens várias vezes na mesma
// sessão (ex: conferir o mesmo tipo de audiência em processos diferentes) — persistido em
// localStorage pra sobreviver a reload, sem precisar de backend.
export function useRecentes() {
  const [ids, setIds] = useState<string[]>(lerIds);

  const registrar = useCallback((item: ItemTabela) => {
    setIds((atual) => {
      const proximos = [item.id, ...atual.filter((id) => id !== item.id)].slice(0, MAX_RECENTES);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(proximos));
      } catch {
        // localStorage indisponível (aba anônima, quota cheia) — mantém só em memória
      }
      return proximos;
    });
  }, []);

  const recentes = ids
    .map((id) => tabelaHonorarios.find((item) => item.id === id))
    .filter((item): item is ItemTabela => Boolean(item));

  return { recentes, registrar };
}
