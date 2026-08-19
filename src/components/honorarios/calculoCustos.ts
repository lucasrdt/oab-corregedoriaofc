// Motor de cálculo da Calculadora de Custos e Hora Técnica — módulo dedicado, sem estado e
// sem JSX, pra nenhuma etapa do wizard (CalculadoraCustosSheet.tsx) recalcular por conta
// própria. Regra de ouro: os acréscimos são COMPOSTOS (cada percentual incide sobre o
// subtotal do passo anterior), nunca somados num fator único.

export type Periodicidade = "mensal" | "anual";

export interface CustoFixoInput {
  valor: number | string;
  periodicidade: Periodicidade;
}

export const COMPLEXIDADE_PCT: Record<"A" | "B" | "C" | "D", number> = {
  A: 0.1,
  B: 0.2,
  C: 0.3,
  D: 0.4,
};

export type DuracaoId = "1-2" | "2-4" | "4-5" | "6+";

export const DURACAO_PCT: Record<DuracaoId, number> = {
  "1-2": 0.1,
  "2-4": 0.2,
  "4-5": 0.3,
  "6+": 0.4,
};

export type ParcelamentoId = "vista" | "3" | "6-8" | "8-12";

// Acréscimo por PARCELAR os honorários (diferente da divisão em N parcelas — ver `parcelas`
// no retorno de calcularHonorarios).
export const PARCELAMENTO_PCT: Record<ParcelamentoId, number> = {
  vista: 0,
  "3": 0.1,
  "6-8": 0.2,
  "8-12": 0.3,
};

export const IMPOSTO_PADRAO_PCT = 0.065;

// Normaliza qualquer custo fixo para base MENSAL — valor anual é rateado ÷12 (amortização,
// não cobrança mensal; ex: anuidade da OAB).
export function custoMensal({ valor, periodicidade }: CustoFixoInput): number {
  const v = Number(valor) || 0;
  return periodicidade === "anual" ? v / 12 : v;
}

export interface MemoriaEtapa {
  etapa: string;
  pct?: number;
  valor: number;
}

export interface ResultadoCalculoCustos {
  horaBase: number;
  horasCaso: number;
  iniciais: number;
  total: number;
  memoria: MemoriaEtapa[];
  parcelas: Record<number, number>;
}

export interface CalcularHonorariosParams {
  custosFixos: CustoFixoInput[];
  horasFaturaveis: number;
  horasPorDemanda: number[];
  complexidadePct: number;
  duracaoPct: number;
  lucroPct: number;
  parcelamentoPct?: number;
  urgenciaPct?: number;
  impostoPct?: number;
}

export function calcularHonorariosCustos({
  custosFixos,
  horasFaturaveis,
  horasPorDemanda,
  complexidadePct,
  duracaoPct,
  lucroPct,
  parcelamentoPct = 0,
  urgenciaPct = 0,
  impostoPct = IMPOSTO_PADRAO_PCT,
}: CalcularHonorariosParams): ResultadoCalculoCustos {
  const somaCustos = custosFixos.reduce((total, custo) => total + custoMensal(custo), 0);
  const horaBase = horasFaturaveis > 0 ? somaCustos / horasFaturaveis : 0;
  const horasCaso = horasPorDemanda.reduce((total, h) => total + (Number(h) || 0), 0);
  const iniciais = horaBase * horasCaso;

  const fatores: { rotulo: string; pct: number }[] = [
    { rotulo: "Complexidade", pct: complexidadePct },
    { rotulo: "Duração", pct: duracaoPct },
    { rotulo: "Lucro", pct: lucroPct },
    { rotulo: "Parcelamento", pct: parcelamentoPct },
    { rotulo: "Urgência", pct: urgenciaPct },
    { rotulo: "Imposto", pct: impostoPct },
  ];

  const memoria: MemoriaEtapa[] = [{ etapa: "Honorários iniciais", valor: iniciais }];
  let subtotal = iniciais;
  for (const fator of fatores) {
    subtotal = subtotal * (1 + fator.pct);
    memoria.push({ etapa: fator.rotulo, pct: fator.pct, valor: subtotal });
  }
  const total = subtotal;

  const parcelas: Record<number, number> = {};
  for (let n = 2; n <= 12; n++) parcelas[n] = total / n;

  return { horaBase, horasCaso, iniciais, total, memoria, parcelas };
}
