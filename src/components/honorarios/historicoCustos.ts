import { gerarId } from "@/lib/id";
import type { DuracaoId, ParcelamentoId, Periodicidade, ResultadoCalculoCustos } from "./calculoCustos";

// Espelha só o essencial de cada linha/demanda pro histórico — não serializa o ícone
// (LucideIcon não é serializável) nem chaves de UI (chaveId).
export interface CustoFixoSalvo {
  rotulo: string;
  valor: number;
  periodicidade: Periodicidade;
}

export interface DemandaSalva {
  rotulo: string;
  horas: number;
}

export interface CalculoCustos {
  id: string;
  criadoEm: string; // ISO
  rotulo?: string;
  entradas: {
    custosFixos: CustoFixoSalvo[];
    horasFaturaveis: number;
    demandas: DemandaSalva[];
    complexidade: "A" | "B" | "C" | "D";
    duracao: DuracaoId;
    lucroPct: number;
    parcelamento: ParcelamentoId;
    urgenciaPct: number;
    impostoPct: number;
  };
  resultado: ResultadoCalculoCustos;
}

const STORAGE_KEY = "honorarios:historico-custos";

function lerTudo(): CalculoCustos[] {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    return bruto ? (JSON.parse(bruto) as CalculoCustos[]) : [];
  } catch {
    return [];
  }
}

function salvarTudo(lista: CalculoCustos[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  } catch {
    // localStorage indisponível (aba anônima, quota cheia) — histórico só não persiste
  }
}

// Interface async de propósito — hoje é localStorage, mas os componentes que consomem este
// repositório não sabem disso. TODO: trocar a implementação por Supabase (tabela `calculos`,
// RLS por advogado autenticado — ver AdvogadoAuthContext) quando o fluxo da Calculadora de
// Custos passar a exigir login; a assinatura async de cada método já está pronta pra isso,
// não deve exigir mudança nos componentes. Ao migrar: não enviar o `id` gerado por gerarId()
// no insert — deixar o `gen_random_uuid()` da própria tabela gerar, e devolver o registro
// criado pelo Supabase.
export const historicoCustosRepository = {
  async listar(): Promise<CalculoCustos[]> {
    return [...lerTudo()].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
  },

  async salvar(calculo: Omit<CalculoCustos, "id" | "criadoEm">): Promise<CalculoCustos> {
    const novo: CalculoCustos = {
      ...calculo,
      id: gerarId(),
      criadoEm: new Date().toISOString(),
    };
    salvarTudo([...lerTudo(), novo]);
    return novo;
  },

  async obter(id: string): Promise<CalculoCustos | null> {
    return lerTudo().find((c) => c.id === id) ?? null;
  },

  async atualizarRotulo(id: string, rotulo: string): Promise<void> {
    salvarTudo(lerTudo().map((c) => (c.id === id ? { ...c, rotulo } : c)));
  },

  async remover(id: string): Promise<void> {
    salvarTudo(lerTudo().filter((c) => c.id !== id));
  },
};
