import { useEffect, useMemo, useRef, useState } from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import gsap from "gsap";
import { NumericFormat } from "react-number-format";
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  Building2,
  Calculator as CalculatorIcon,
  Check,
  Coins,
  Copy,
  CirclePlus,
  FileCheck,
  FileSearch,
  FileText,
  FolderOpen,
  Gavel,
  GraduationCap,
  History,
  Info,
  KeyRound,
  Landmark,
  ListChecks,
  Loader2,
  MapPin,
  Megaphone,
  MessageCircle,
  Monitor,
  MoreHorizontal,
  Paperclip,
  Pencil,
  RotateCcw,
  Scale,
  ShieldCheck,
  SlidersHorizontal,
  SprayCan,
  Trash2,
  User,
  Users,
  Wifi,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { gerarId } from "@/lib/id";
import { copiarTexto } from "@/lib/copiar";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatarMoeda } from "./format";
import {
  COMPLEXIDADE_PCT,
  DURACAO_PCT,
  IMPOSTO_PADRAO_PCT,
  PARCELAMENTO_PCT,
  calcularHonorariosCustos,
  type DuracaoId,
  type MemoriaEtapa,
  type ParcelamentoId,
  type Periodicidade,
} from "./calculoCustos";
import { historicoCustosRepository, type CalculoCustos } from "./historicoCustos";

// Mesmo método de precificação por hora do CalculoCustosForm.tsx (custos fixos ÷ horas
// produtivas = hora-base), expandido em stepper com escopo por demanda, complexidade A–D,
// duração do caso, parcelamento, urgência e imposto — conforme o Manual de Utilização e a
// planilha oficial de honorários. Toda a matemática vive em calculoCustos.ts; nenhuma etapa
// aqui recalcula por conta própria.
type Etapa = "infraestrutura" | "escopo" | "refinamento" | "resultado";

const ETAPAS: { id: Etapa; numero: number; nome: string }[] = [
  { id: "infraestrutura", numero: 1, nome: "Infraestrutura" },
  { id: "escopo", numero: 2, nome: "Escopo do Projeto" },
  { id: "refinamento", numero: 3, nome: "Refinamento Ético" },
  { id: "resultado", numero: 4, nome: "Resultado" },
];

// --- Etapa 1: catálogo de categorias de custo fixo -------------------------------------

interface CategoriaCusto {
  id: string;
  label: string;
  icone: LucideIcon;
  periodicidadePadrao: Periodicidade;
  placeholder?: string;
  tooltip?: string;
}

// Nenhuma ativa por padrão — a lista de custos começa vazia (o guia acima dos chips já
// orienta "toque numa categoria pra adicionar"), quem decide o que compõe o custo fixo é o
// próprio advogado.
const CATEGORIAS_CUSTO: CategoriaCusto[] = [
  { id: "pro-labore", label: "Pró-labore", icone: User, periodicidadePadrao: "mensal" },
  { id: "aluguel", label: "Aluguel/coworking", icone: Building2, periodicidadePadrao: "mensal" },
  { id: "contabilidade", label: "Contabilidade", icone: CalculatorIcon, periodicidadePadrao: "mensal" },
  {
    id: "oab",
    label: "OAB e taxas de exercício",
    icone: BadgeCheck,
    periodicidadePadrao: "anual",
    placeholder: "959",
    tooltip:
      "Valor anual da anuidade. A ferramenta rateia por 12 para compor o custo mensal. A OAB-MA permite parcelar (até 12x); confira o valor vigente na sua seccional.",
  },
  { id: "sistemas", label: "Sistemas jurídicos e assinaturas", icone: Monitor, periodicidadePadrao: "mensal" },
  { id: "internet", label: "Internet e telefonia", icone: Wifi, periodicidadePadrao: "mensal" },
  { id: "energia", label: "Energia e água", icone: Zap, periodicidadePadrao: "mensal" },
  { id: "token", label: "Certificado digital/token", icone: KeyRound, periodicidadePadrao: "anual" },
  { id: "salarios", label: "Salários e encargos", icone: Users, periodicidadePadrao: "mensal" },
  { id: "marketing", label: "Marketing e publicidade", icone: Megaphone, periodicidadePadrao: "mensal" },
  { id: "cursos", label: "Cursos e capacitação", icone: GraduationCap, periodicidadePadrao: "mensal" },
  { id: "material", label: "Material de escritório", icone: Paperclip, periodicidadePadrao: "mensal" },
  {
    id: "seguro",
    label: "Seguro de responsabilidade profissional",
    icone: ShieldCheck,
    periodicidadePadrao: "anual",
  },
  { id: "bancario", label: "Custos bancários/tarifas", icone: Landmark, periodicidadePadrao: "mensal" },
  { id: "limpeza", label: "Limpeza e conservação", icone: SprayCan, periodicidadePadrao: "mensal" },
  { id: "publicacoes", label: "Publicações e jurisprudência", icone: BookOpen, periodicidadePadrao: "mensal" },
  { id: "licenciamento", label: "Licenciamento e taxas", icone: FileCheck, periodicidadePadrao: "anual" },
  { id: "outros", label: "Outros custos fixos", icone: MoreHorizontal, periodicidadePadrao: "mensal" },
];

interface LinhaCusto {
  chaveId: string;
  categoriaId: string | null; // null = custo personalizado, sem categoria do catálogo
  label: string;
  icone: LucideIcon;
  valor: string;
  periodicidade: Periodicidade;
}

const linhaPadrao = (categoria: CategoriaCusto): LinhaCusto => ({
  chaveId: categoria.id,
  categoriaId: categoria.id,
  label: categoria.label,
  icone: categoria.icone,
  valor: "",
  periodicidade: categoria.periodicidadePadrao,
});

// --- Etapa 2: as 7 demandas do processo (planilha oficial) ------------------------------

const DEMANDAS: { id: string; label: string; icone: LucideIcon }[] = [
  { id: "analise", label: "Análise de documentos", icone: FileSearch },
  { id: "peticoes", label: "Petições", icone: FileText },
  { id: "reunioes", label: "Reuniões de negociação", icone: Users },
  { id: "diligencias", label: "Diligências", icone: MapPin },
  { id: "conciliacao", label: "Audiência de conciliação", icone: Scale },
  { id: "instrucao", label: "Audiência de instrução", icone: Gavel },
  { id: "contatos", label: "Contatos com o cliente", icone: MessageCircle },
];

// --- Etapa 3: complexidade e duração ------------------------------------------------

const COMPLEXIDADES: { id: "A" | "B" | "C" | "D"; nome: string; descricao: string }[] = [
  { id: "A", nome: "Rotineira", descricao: "Procedimento padrão, baixo risco" },
  { id: "B", nome: "Moderada", descricao: "Exige análise específica do caso" },
  { id: "C", nome: "Complexa", descricao: "Múltiplas frentes ou teses discutíveis" },
  { id: "D", nome: "Estratégica", descricao: "Alta responsabilidade, alto risco" },
];

const DURACOES: { id: DuracaoId; nome: string }[] = [
  { id: "1-2", nome: "1 a 2 anos" },
  { id: "2-4", nome: "2 a 4 anos" },
  { id: "4-5", nome: "4 a 5 anos" },
  { id: "6+", nome: "Mais de 6 anos" },
];

// --- Etapa 4: parcelamento (acréscimo por parcelar — diferente da divisão em N vezes) ---

const OPCOES_PARCELAMENTO: { id: ParcelamentoId; nome: string }[] = [
  { id: "vista", nome: "À vista" },
  { id: "3", nome: "Até 3 meses" },
  { id: "6-8", nome: "6 a 8 meses" },
  { id: "8-12", nome: "8 a 12 meses" },
];

const numero = (v: string) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

// Texto do "Copiar resumo" — função pura (recebe dados, não estado) pra funcionar tanto no
// cálculo ao vivo quanto ao reabrir um item do histórico.
function construirTextoResumo(params: {
  rotulo?: string;
  criadoEm?: string;
  horaBase: number;
  horasCaso: number;
  complexidade: "A" | "B" | "C" | "D";
  duracaoNome: string;
  memoria: MemoriaEtapa[];
  total: number;
  parcelas: Record<number, number>;
}): string {
  const { rotulo, criadoEm, horaBase, horasCaso, complexidade, duracaoNome, memoria, total, parcelas } = params;
  const dataTexto = new Date(criadoEm ?? Date.now()).toLocaleDateString("pt-BR");
  const porEtapa = (nome: string) => memoria.find((m) => m.etapa === nome);
  const pctTexto = (nome: string) => `${((porEtapa(nome)?.pct ?? 0) * 100).toFixed(1)}%`;
  const valorTexto = (nome: string) => formatarMoeda(porEtapa(nome)?.valor ?? 0);

  return [
    `Proposta de honorários — ${rotulo?.trim() || dataTexto}`,
    `Hora-base: ${formatarMoeda(horaBase)}`,
    `Horas do caso: ${horasCaso}h`,
    `Honorários iniciais: ${formatarMoeda(memoria[0]?.valor ?? 0)}`,
    `Complexidade (${complexidade}, +${pctTexto("Complexidade")}): ${valorTexto("Complexidade")}`,
    `Duração (${duracaoNome}, +${pctTexto("Duração")}): ${valorTexto("Duração")}`,
    `Lucro (+${pctTexto("Lucro")}): ${valorTexto("Lucro")}`,
    `Parcelamento (+${pctTexto("Parcelamento")}): ${valorTexto("Parcelamento")}`,
    `Urgência (+${pctTexto("Urgência")}): ${valorTexto("Urgência")}`,
    `Imposto (+${pctTexto("Imposto")}): ${valorTexto("Imposto")}`,
    "",
    `VALOR TOTAL: ${formatarMoeda(total)}`,
    `Parcelas: ${Object.entries(parcelas)
      .map(([n, v]) => `${n}x ${formatarMoeda(v)}`)
      .join(" · ")}`,
  ].join("\n");
}

// Contador animado — anima o valor anterior até o novo via GSAP (tween sobre um objeto
// simples, não sobre o DOM), reaproveitando o mesmo padrão gsap.context de
// CanetaDestaque.tsx. Pula direto pro valor final quando o usuário pediu menos movimento.
const ContadorMoeda = ({ valor, className }: { valor: number; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const anterior = useRef(0);

  useEffect(() => {
    if (!ref.current) return;
    const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzMovimento) {
      ref.current.textContent = formatarMoeda(valor);
      anterior.current = valor;
      return;
    }

    const obj = { v: anterior.current };
    const tween = gsap.to(obj, {
      v: valor,
      duration: 0.6,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) ref.current.textContent = formatarMoeda(obj.v);
      },
      onComplete: () => {
        // Só marca "chegou" quando a animação realmente terminou — commitar isso cedo
        // demais (antes do tween completar) fazia a PRÓXIMA animação partir do alvo
        // anterior em vez do valor de fato exibido, e podia estacionar num número errado
        // quando vários campos mudavam em sequência rápida.
        anterior.current = valor;
        if (ref.current) ref.current.textContent = formatarMoeda(valor);
      },
    });
    return () => {
      tween.kill();
      anterior.current = obj.v; // preserva o ponto onde a animação foi interrompida
    };
  }, [valor]);

  return (
    <span ref={ref} className={className}>
      {formatarMoeda(valor)}
    </span>
  );
};

interface CalculadoraCustosSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CalculadoraCustosSheet = ({ open, onOpenChange }: CalculadoraCustosSheetProps) => {
  const { toast } = useToast();
  const conteudoRef = useRef<HTMLDivElement>(null);

  const [etapa, setEtapa] = useState<Etapa>("infraestrutura");

  // Etapa 1 — Infraestrutura
  const [linhasCusto, setLinhasCusto] = useState<LinhaCusto[]>([]);
  const [horasProdutivas, setHorasProdutivas] = useState("");
  const [erroInfra, setErroInfra] = useState<string | null>(null);

  // Etapa 2 — Escopo do Projeto
  const [horasDemandas, setHorasDemandas] = useState<Record<string, string>>({});
  const [erroEscopo, setErroEscopo] = useState<string | null>(null);

  // Etapa 3 — Refinamento Ético
  const [complexidade, setComplexidade] = useState<"A" | "B" | "C" | "D">("B");
  const [duracao, setDuracao] = useState<DuracaoId>("1-2");
  const [margemLucro, setMargemLucro] = useState([30]);

  // Etapa 4 — Fechamento
  const [parcelamento, setParcelamento] = useState<ParcelamentoId>("vista");
  const [urgencia, setUrgencia] = useState("0");
  const [imposto, setImposto] = useState(String(IMPOSTO_PADRAO_PCT * 100));
  const [rotulo, setRotulo] = useState("");

  const [copiado, setCopiado] = useState(false);

  // Histórico de cálculos — painel próprio, sobrepõe o conteúdo do wizard sem fechar o Sheet.
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [historico, setHistorico] = useState<CalculoCustos[]>([]);
  const [carregandoHistorico, setCarregandoHistorico] = useState(false);
  const [editandoRotuloId, setEditandoRotuloId] = useState<string | null>(null);
  const [rascunhoRotulo, setRascunhoRotulo] = useState("");

  const carregarHistorico = async () => {
    setCarregandoHistorico(true);
    try {
      const lista = await historicoCustosRepository.listar();
      setHistorico(lista);
    } finally {
      setCarregandoHistorico(false);
    }
  };

  useEffect(() => {
    if (open) void carregarHistorico();
  }, [open]);

  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setEtapa("infraestrutura");
      setLinhasCusto([]);
      setHorasProdutivas("");
      setErroInfra(null);
      setHorasDemandas({});
      setErroEscopo(null);
      setComplexidade("B");
      setDuracao("1-2");
      setMargemLucro([30]);
      setParcelamento("vista");
      setUrgencia("0");
      setImposto(String(IMPOSTO_PADRAO_PCT * 100));
      setRotulo("");
      setCopiado(false);
      setMostrarHistorico(false);
      setEditandoRotuloId(null);
    }, 300);
    return () => clearTimeout(t);
  }, [open]);

  // Transição de entrada de cada etapa — crossfade sutil (transform + opacity, sem
  // propriedades de layout), mesmo idioma de CanetaDestaque.tsx (gsap.context + ctx.revert
  // no cleanup).
  useEffect(() => {
    if (!conteudoRef.current) return;
    const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzMovimento) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        conteudoRef.current,
        { opacity: 0, x: 16 },
        { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" },
      );
    });
    return () => ctx.revert();
  }, [etapa, mostrarHistorico]);

  const toggleCategoria = (categoria: CategoriaCusto) => {
    setLinhasCusto((atual) => {
      const jaAtiva = atual.some((l) => l.categoriaId === categoria.id);
      if (jaAtiva) return atual.filter((l) => l.categoriaId !== categoria.id);
      return [...atual, linhaPadrao(categoria)];
    });
  };

  const adicionarCustoPersonalizado = () => {
    setLinhasCusto((atual) => [
      ...atual,
      {
        chaveId: `custom-${gerarId()}`,
        categoriaId: null,
        label: "",
        icone: MoreHorizontal,
        valor: "",
        periodicidade: "mensal",
      },
    ]);
  };

  const removerLinha = (chaveId: string) => {
    setLinhasCusto((atual) => atual.filter((l) => l.chaveId !== chaveId));
  };

  const atualizarLinha = (chaveId: string, patch: Partial<LinhaCusto>) => {
    setLinhasCusto((atual) => atual.map((l) => (l.chaveId === chaveId ? { ...l, ...patch } : l)));
  };

  const custosFixosInput = useMemo(
    () => linhasCusto.map((l) => ({ valor: l.valor, periodicidade: l.periodicidade })),
    [linhasCusto],
  );

  const horasPorDemanda = useMemo(
    () => DEMANDAS.map((d) => numero(horasDemandas[d.id] ?? "")),
    [horasDemandas],
  );
  const horasTotaisCaso = horasPorDemanda.reduce((a, b) => a + b, 0);

  // Etapa 3 — "ao vivo" só até o lucro (parcelamento/urgência/imposto ainda não entram
  // nesta etapa, por isso zerados aqui e só preenchidos de verdade na Etapa 4).
  const previaEtapa3 = useMemo(
    () =>
      calcularHonorariosCustos({
        custosFixos: custosFixosInput,
        horasFaturaveis: numero(horasProdutivas),
        horasPorDemanda,
        complexidadePct: COMPLEXIDADE_PCT[complexidade],
        duracaoPct: DURACAO_PCT[duracao],
        lucroPct: margemLucro[0] / 100,
        parcelamentoPct: 0,
        urgenciaPct: 0,
        impostoPct: 0,
      }),
    [custosFixosInput, horasProdutivas, horasPorDemanda, complexidade, duracao, margemLucro],
  );
  const valorAoVivoEtapa3 = previaEtapa3.memoria[3]?.valor ?? 0; // 0=iniciais,1=complex.,2=duração,3=lucro

  // Etapa 4 — cadeia completa: iniciais → complexidade → duração → lucro → parcelamento →
  // urgência → imposto (sempre composto, nunca somado num fator único).
  const resultado = useMemo(
    () =>
      calcularHonorariosCustos({
        custosFixos: custosFixosInput,
        horasFaturaveis: numero(horasProdutivas),
        horasPorDemanda,
        complexidadePct: COMPLEXIDADE_PCT[complexidade],
        duracaoPct: DURACAO_PCT[duracao],
        lucroPct: margemLucro[0] / 100,
        parcelamentoPct: PARCELAMENTO_PCT[parcelamento],
        urgenciaPct: numero(urgencia) / 100,
        impostoPct: numero(imposto) / 100,
      }),
    [custosFixosInput, horasProdutivas, horasPorDemanda, complexidade, duracao, margemLucro, parcelamento, urgencia, imposto],
  );

  const avancarInfra = () => {
    if (resultado.horaBase <= 0) {
      setErroInfra("Informe ao menos um custo fixo e as horas produtivas por mês para calcular sua hora-base.");
      return;
    }
    setErroInfra(null);
    setEtapa("escopo");
  };

  const avancarEscopo = () => {
    if (horasTotaisCaso <= 0) {
      setErroEscopo("Informe ao menos uma demanda com horas estimadas.");
      return;
    }
    setErroEscopo(null);
    setEtapa("refinamento");
  };

  const voltar = () => {
    if (etapa === "escopo") setEtapa("infraestrutura");
    else if (etapa === "refinamento") setEtapa("escopo");
    else if (etapa === "resultado") setEtapa("refinamento");
  };

  const salvarNoHistorico = async () => {
    await historicoCustosRepository.salvar({
      rotulo: rotulo.trim() || undefined,
      entradas: {
        custosFixos: linhasCusto.map((l) => ({
          rotulo: l.label || "Custo personalizado",
          valor: Number(l.valor) || 0,
          periodicidade: l.periodicidade,
        })),
        horasFaturaveis: numero(horasProdutivas),
        demandas: DEMANDAS.map((d) => ({ rotulo: d.label, horas: numero(horasDemandas[d.id] ?? "") })),
        complexidade,
        duracao,
        lucroPct: margemLucro[0] / 100,
        parcelamento,
        urgenciaPct: numero(urgencia) / 100,
        impostoPct: numero(imposto) / 100,
      },
      resultado,
    });
    await carregarHistorico();
  };

  const copiarResumo = async () => {
    const texto = construirTextoResumo({
      rotulo,
      horaBase: resultado.horaBase,
      horasCaso: resultado.horasCaso,
      complexidade,
      duracaoNome: DURACOES.find((d) => d.id === duracao)?.nome ?? "",
      memoria: resultado.memoria,
      total: resultado.total,
      parcelas: resultado.parcelas,
    });

    const ok = await copiarTexto(texto);
    if (ok) {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
      await salvarNoHistorico();
    } else {
      toast({
        title: "Não foi possível copiar",
        description: "Copie o resumo manualmente.",
        variant: "destructive",
      });
    }
  };

  const concluir = async () => {
    await salvarNoHistorico();
    onOpenChange(false);
  };

  const reiniciar = () => {
    setEtapa("infraestrutura");
  };

  // Reconstrói o estado do wizard a partir de um item salvo — tenta religar cada custo/
  // demanda de volta à categoria do catálogo (pelo rótulo) pra recuperar o ícone; o que não
  // bate mais (categoria removida, por exemplo) volta como linha personalizada.
  const reabrirCalculo = (calculo: CalculoCustos) => {
    setLinhasCusto(
      calculo.entradas.custosFixos.map((c) => {
        const categoria = CATEGORIAS_CUSTO.find((cat) => cat.label === c.rotulo);
        return {
          chaveId: categoria ? categoria.id : `custom-${gerarId()}`,
          categoriaId: categoria?.id ?? null,
          label: c.rotulo,
          icone: categoria?.icone ?? MoreHorizontal,
          valor: c.valor ? String(c.valor) : "",
          periodicidade: c.periodicidade,
        };
      }),
    );
    setHorasProdutivas(calculo.entradas.horasFaturaveis ? String(calculo.entradas.horasFaturaveis) : "");
    setHorasDemandas(
      Object.fromEntries(
        calculo.entradas.demandas
          .map((salva) => {
            const demanda = DEMANDAS.find((d) => d.label === salva.rotulo);
            return demanda ? [demanda.id, salva.horas ? String(salva.horas) : ""] : null;
          })
          .filter((par): par is [string, string] => par !== null),
      ),
    );
    setComplexidade(calculo.entradas.complexidade);
    setDuracao(calculo.entradas.duracao);
    setMargemLucro([Math.round(calculo.entradas.lucroPct * 100)]);
    setParcelamento(calculo.entradas.parcelamento);
    setUrgencia(String(calculo.entradas.urgenciaPct * 100));
    setImposto(String(calculo.entradas.impostoPct * 100));
    setRotulo(calculo.rotulo ?? "");
    setMostrarHistorico(false);
    setEtapa("resultado");
  };

  const copiarResumoDoHistorico = async (calculo: CalculoCustos) => {
    const texto = construirTextoResumo({
      rotulo: calculo.rotulo,
      criadoEm: calculo.criadoEm,
      horaBase: calculo.resultado.horaBase,
      horasCaso: calculo.resultado.horasCaso,
      complexidade: calculo.entradas.complexidade,
      duracaoNome: DURACOES.find((d) => d.id === calculo.entradas.duracao)?.nome ?? "",
      memoria: calculo.resultado.memoria,
      total: calculo.resultado.total,
      parcelas: calculo.resultado.parcelas,
    });
    const ok = await copiarTexto(texto);
    if (ok) {
      toast({ title: "Copiado", description: "Resumo copiado para a área de transferência." });
    } else {
      toast({
        title: "Não foi possível copiar",
        description: "Copie o resumo manualmente.",
        variant: "destructive",
      });
    }
  };

  const iniciarRenomeio = (calculo: CalculoCustos) => {
    setEditandoRotuloId(calculo.id);
    setRascunhoRotulo(calculo.rotulo ?? "");
  };

  const confirmarRenomeio = async (id: string) => {
    await historicoCustosRepository.atualizarRotulo(id, rascunhoRotulo.trim());
    setEditandoRotuloId(null);
    await carregarHistorico();
  };

  const removerDoHistorico = async (id: string) => {
    await historicoCustosRepository.remover(id);
    await carregarHistorico();
  };

  const indiceAtual = ETAPAS.findIndex((e) => e.id === etapa);
  const etapaAtualInfo = ETAPAS[indiceAtual];

  return (
    <SheetPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <SheetPrimitive.Portal>
        <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <SheetPrimitive.Content className="fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col border-l border-border/60 bg-background shadow-2xl outline-none transition ease-in-out data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-2xl">
          {/* Header — mesma linguagem visual do BibliotecaMinutasSheet: gradiente navy,
              glow vermelho, seta de voltar quando não é a primeira etapa. */}
          <div className="relative flex shrink-0 items-start justify-between gap-3 overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#1A2238] via-[#141a2c] to-[#10141f] px-6 py-5">
            <div className="pointer-events-none absolute -right-8 -top-14 h-40 w-40 rounded-full bg-[#BC231A] opacity-20 blur-2xl" />
            <div className="relative flex min-w-0 items-center gap-3">
              {(etapa !== "infraestrutura" || mostrarHistorico) && (
                <button
                  type="button"
                  onClick={() => (mostrarHistorico ? setMostrarHistorico(false) : voltar())}
                  aria-label="Voltar"
                  className="shrink-0 rounded-full p-1.5 text-white/80 opacity-80 transition-opacity hover:bg-white/10 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <div className="min-w-0">
                <SheetPrimitive.Title className="truncate font-heading text-lg font-bold leading-snug text-white">
                  Calculadora de Custos e Hora Técnica
                </SheetPrimitive.Title>
                <SheetPrimitive.Description className="truncate text-xs text-white/60">
                  {mostrarHistorico
                    ? "Histórico de cálculos"
                    : `Etapa ${etapaAtualInfo.numero} de ${ETAPAS.length} · ${etapaAtualInfo.nome}`}
                </SheetPrimitive.Description>
              </div>
            </div>
            <div className="relative flex shrink-0 items-center gap-1">
              {!mostrarHistorico && (
                <button
                  type="button"
                  onClick={() => setMostrarHistorico(true)}
                  aria-label="Ver histórico de cálculos"
                  title="Histórico de cálculos"
                  className="rounded-full p-1.5 text-white/80 opacity-80 transition-opacity hover:bg-white/10 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  <History className="h-4 w-4" />
                </button>
              )}
              <SheetPrimitive.Close
                aria-label="Fechar"
                className="rounded-full p-1.5 text-white/80 opacity-80 transition-opacity hover:bg-white/10 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <X className="h-4 w-4" />
              </SheetPrimitive.Close>
            </div>
          </div>

          {/* Trilha de progresso — 4 segmentos, a ordem aqui carrega informação real (cada
              etapa depende do resultado da anterior), por isso a numeração faz sentido.
              Some no painel de histórico, que não faz parte da sequência do wizard. */}
          {!mostrarHistorico && (
            <div className="flex shrink-0 items-center gap-1.5 border-b border-border/50 bg-muted/20 px-6 py-3">
              {ETAPAS.map((e, i) => (
                <div
                  key={e.id}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors duration-300",
                    i <= indiceAtual ? "bg-[#BC231A]" : "bg-border",
                  )}
                />
              ))}
            </div>
          )}

          {/* Corpo sóbrio — o painel em si é liso (bg-background); só os campos e cards de
              resultado ganham o vidro fosco (bg-white/40 + backdrop-blur-md + border-white/20). */}
          <div ref={conteudoRef} className="flex-1 overflow-y-auto px-6 py-6">
            {mostrarHistorico ? (
              <div className="space-y-3 font-body">
                {carregandoHistorico ? (
                  <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Carregando histórico...
                  </div>
                ) : historico.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border/50 bg-muted/20 px-4 py-12 text-center">
                    <History className="h-6 w-6 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      Nenhum cálculo salvo ainda. Ao concluir ou copiar um resumo, ele aparece aqui.
                    </p>
                  </div>
                ) : (
                  historico.map((c) => {
                    const complexidadeInfo = COMPLEXIDADES.find((x) => x.id === c.entradas.complexidade);
                    const duracaoInfo = DURACOES.find((x) => x.id === c.entradas.duracao);
                    const dataTexto = new Date(c.criadoEm).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={c.id}
                        className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            {editandoRotuloId === c.id ? (
                              <div className="flex items-center gap-1.5">
                                <Input
                                  autoFocus
                                  value={rascunhoRotulo}
                                  onChange={(e) => setRascunhoRotulo(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") void confirmarRenomeio(c.id);
                                    if (e.key === "Escape") setEditandoRotuloId(null);
                                  }}
                                  placeholder="Rótulo do cálculo"
                                  className="h-8 text-sm"
                                />
                                <Button size="sm" className="h-8 shrink-0 px-2.5" onClick={() => void confirmarRenomeio(c.id)}>
                                  <Check className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            ) : (
                              <p className="truncate font-heading text-sm font-bold text-foreground">
                                {c.rotulo || dataTexto}
                              </p>
                            )}
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                              {dataTexto} · {c.resultado.horasCaso}h · {complexidadeInfo?.id} {complexidadeInfo?.nome} ·{" "}
                              {duracaoInfo?.nome}
                            </p>
                          </div>
                          <span className="shrink-0 font-heading text-base font-black tabular-nums text-primary">
                            {formatarMoeda(c.resultado.total)}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1.5 text-xs"
                            onClick={() => reabrirCalculo(c)}
                          >
                            <FolderOpen className="h-3.5 w-3.5" />
                            Reabrir
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1.5 text-xs"
                            onClick={() => void copiarResumoDoHistorico(c)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                            Copiar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1.5 text-xs"
                            onClick={() => iniciarRenomeio(c)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Renomear
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1.5 text-xs text-destructive hover:text-destructive"
                            onClick={() => void removerDoHistorico(c.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remover
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <>
                {etapa === "infraestrutura" && (
                  <div className="space-y-5 font-body">
                    <div className="rounded-[1.75rem] border border-white/20 bg-white/40 p-5 shadow-glass backdrop-blur-md">
                      <div className="mb-1 flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">
                          Custos fixos mensais
                        </h3>
                      </div>
                      <p className="mb-4 text-[11px] leading-relaxed font-light text-muted-foreground">
                        Toque numa categoria pra adicioná-la à lista. Valores anuais (como a OAB) são
                        rateados por 12 automaticamente.
                      </p>

                      {/* Chips de categoria — toggle: ativar insere uma linha abaixo, desativar remove */}
                      <div className="flex flex-wrap gap-1.5">
                        {CATEGORIAS_CUSTO.map((categoria) => {
                          const ativa = linhasCusto.some((l) => l.categoriaId === categoria.id);
                          return (
                            <button
                              key={categoria.id}
                              type="button"
                              onClick={() => toggleCategoria(categoria)}
                              aria-pressed={ativa}
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                                ativa
                                  ? "border-primary/30 bg-primary text-primary-foreground"
                                  : "border-white/30 bg-white/50 text-foreground hover:border-primary/30 hover:bg-white/70",
                              )}
                            >
                              <categoria.icone className="h-3.5 w-3.5 shrink-0" />
                              {categoria.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Lista de custos ativos */}
                      <div className="mt-4 space-y-2.5">
                        {linhasCusto.map((linha) => {
                          const categoria = CATEGORIAS_CUSTO.find((c) => c.id === linha.categoriaId);
                          return (
                            <div
                              key={linha.chaveId}
                              className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/20 bg-white/50 p-2.5 backdrop-blur-md sm:flex-nowrap"
                            >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <linha.icone className="h-4 w-4 text-primary" />
                              </div>

                              {linha.categoriaId ? (
                                <div className="flex min-w-0 flex-1 items-center gap-1.5 basis-full sm:basis-auto">
                                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                                    {linha.label}
                                  </span>
                                  {categoria?.tooltip && (
                                    <Tooltip delayDuration={200}>
                                      <TooltipTrigger asChild>
                                        <button
                                          type="button"
                                          aria-label={`Sobre ${linha.label}`}
                                          className="shrink-0 text-muted-foreground/60 hover:text-muted-foreground"
                                        >
                                          <Info className="h-3.5 w-3.5" />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent side="top" className="max-w-[16rem] text-xs">
                                        {categoria.tooltip}
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>
                              ) : (
                                <Input
                                  value={linha.label}
                                  onChange={(e) => atualizarLinha(linha.chaveId, { label: e.target.value })}
                                  placeholder="Nome do custo"
                                  aria-label="Nome do custo personalizado"
                                  className="h-8 min-w-0 flex-1 basis-full border-white/40 bg-white/60 text-sm sm:basis-auto"
                                />
                              )}

                              <NumericFormat
                                customInput={Input}
                                value={linha.valor}
                                onValueChange={(values) => atualizarLinha(linha.chaveId, { valor: values.value })}
                                prefix="R$ "
                                thousandSeparator="."
                                decimalSeparator=","
                                decimalScale={2}
                                allowNegative={false}
                                placeholder={categoria?.placeholder ? `Ex: R$ ${categoria.placeholder},00` : "R$ 0,00"}
                                aria-label={`Valor de ${linha.label || "custo personalizado"}`}
                                className="h-8 w-28 shrink-0 border-white/40 bg-white/60 text-right text-sm"
                              />

                              <div className="flex shrink-0 overflow-hidden rounded-lg border border-white/40">
                                {(["mensal", "anual"] as const).map((p) => (
                                  <button
                                    key={p}
                                    type="button"
                                    onClick={() => atualizarLinha(linha.chaveId, { periodicidade: p })}
                                    aria-pressed={linha.periodicidade === p}
                                    className={cn(
                                      "px-2 py-1.5 text-[11px] font-semibold transition-colors",
                                      linha.periodicidade === p
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-white/60 text-muted-foreground hover:bg-white/80",
                                    )}
                                  >
                                    {p === "mensal" ? "Mensal" : "Anual"}
                                  </button>
                                ))}
                              </div>

                              <button
                                type="button"
                                onClick={() => removerLinha(linha.chaveId)}
                                aria-label={`Remover ${linha.label || "custo personalizado"}`}
                                className="shrink-0 rounded-full p-1.5 text-muted-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          );
                        })}

                        {linhasCusto.length === 0 && (
                          <p className="rounded-xl border border-dashed border-white/30 bg-white/20 px-3 py-4 text-center text-xs text-muted-foreground">
                            Nenhum custo adicionado. Toque numa categoria acima pra começar.
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={adicionarCustoPersonalizado}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                      >
                        <CirclePlus className="h-3.5 w-3.5" />
                        Adicionar custo personalizado
                      </button>
                    </div>

                    <div className="rounded-[1.75rem] border border-white/20 bg-white/40 p-5 shadow-glass backdrop-blur-md">
                      <Label htmlFor="horasProdutivas" className="text-xs font-semibold text-foreground">
                        Capacidade produtiva — horas faturáveis por mês
                      </Label>
                      <Input
                        id="horasProdutivas"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Ex: 120"
                        value={horasProdutivas}
                        onChange={(e) => setHorasProdutivas(e.target.value)}
                        className="mt-1.5 border-white/40 bg-white/50"
                      />
                      <p className="mt-1.5 text-[11px] leading-relaxed font-light text-muted-foreground">
                        Horas realmente vendáveis do mês — descontando gestão, capacitação e administrativo.
                      </p>

                      <div className="mt-4 rounded-2xl border border-white/20 bg-white/50 p-4 backdrop-blur-md">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-light uppercase tracking-wide text-muted-foreground">
                            Total de custos fixos (mensal)
                          </p>
                          <span className="text-sm font-semibold tabular-nums text-foreground">
                            {formatarMoeda(custosFixosInput.reduce((a, c) => a + (Number(c.valor) || 0) / (c.periodicidade === "anual" ? 12 : 1), 0))}
                          </span>
                        </div>
                        <p className="mt-3 text-[11px] font-light uppercase tracking-wide text-muted-foreground">
                          Hora-base calculada
                        </p>
                        <ContadorMoeda
                          valor={resultado.horaBase}
                          className="font-heading text-3xl font-black tabular-nums text-primary"
                        />
                        <p className="mt-1 text-[11px] font-light text-muted-foreground">
                          Custos fixos ÷ horas produtivas
                        </p>
                      </div>
                    </div>

                    {erroInfra && (
                      <p role="alert" className="text-sm font-medium text-destructive">
                        {erroInfra}
                      </p>
                    )}
                  </div>
                )}

                {etapa === "escopo" && (
                  <div className="space-y-5 font-body">
                    <div className="rounded-[1.75rem] border border-white/20 bg-white/40 p-5 shadow-glass backdrop-blur-md">
                      <div className="mb-4 flex items-center gap-2">
                        <ListChecks className="h-4 w-4 text-primary" />
                        <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">
                          Demandas do caso
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {DEMANDAS.map((d) => (
                          <div
                            key={d.id}
                            className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/50 p-3 backdrop-blur-md"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                              <d.icone className="h-4 w-4 text-primary" />
                            </div>
                            <Label htmlFor={d.id} className="flex-1 text-sm font-medium text-foreground">
                              {d.label}
                            </Label>
                            <NumericFormat
                              id={d.id}
                              customInput={Input}
                              value={horasDemandas[d.id] ?? ""}
                              onValueChange={(values) =>
                                setHorasDemandas((atual) => ({ ...atual, [d.id]: values.value }))
                              }
                              suffix=" h"
                              decimalScale={1}
                              allowNegative={false}
                              placeholder="0 h"
                              className="w-24 border-white/40 bg-white/60 text-right"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/20 bg-white/50 px-4 py-3 backdrop-blur-md">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Total de horas do caso
                        </span>
                        <span className="font-heading text-lg font-bold tabular-nums text-primary">
                          {horasTotaisCaso}h
                        </span>
                      </div>
                    </div>

                    {erroEscopo && (
                      <p role="alert" className="text-sm font-medium text-destructive">
                        {erroEscopo}
                      </p>
                    )}
                  </div>
                )}

                {etapa === "refinamento" && (
                  <div className="space-y-5 font-body">
                    <div className="rounded-[1.75rem] border border-white/20 bg-white/40 p-5 shadow-glass backdrop-blur-md">
                      <div className="mb-4 flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-primary" />
                        <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">
                          Complexidade do caso
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {COMPLEXIDADES.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setComplexidade(c.id)}
                            aria-pressed={complexidade === c.id}
                            className={cn(
                              "rounded-2xl border p-3 text-left backdrop-blur-md transition-all",
                              complexidade === c.id
                                ? "border-primary/40 bg-primary text-primary-foreground shadow-md"
                                : "border-white/20 bg-white/50 text-foreground hover:border-primary/30",
                            )}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-heading text-lg font-black">{c.id}</span>
                              <span
                                className={cn(
                                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                                  complexidade === c.id ? "bg-white/20" : "bg-primary/10 text-primary",
                                )}
                              >
                                {(COMPLEXIDADE_PCT[c.id] * 100).toFixed(0)}%
                              </span>
                            </div>
                            <p
                              className={cn(
                                "mt-0.5 text-[11px] font-semibold leading-tight",
                                complexidade === c.id ? "text-primary-foreground" : "text-foreground",
                              )}
                            >
                              {c.nome}
                            </p>
                            <p
                              className={cn(
                                "mt-1 text-[10px] font-light leading-snug",
                                complexidade === c.id ? "text-primary-foreground/80" : "text-muted-foreground",
                              )}
                            >
                              {c.descricao}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-white/20 bg-white/40 p-5 shadow-glass backdrop-blur-md">
                      <h3 className="mb-3 font-heading text-sm font-bold uppercase tracking-wide text-foreground">
                        Duração do caso
                      </h3>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {DURACOES.map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => setDuracao(d.id)}
                            aria-pressed={duracao === d.id}
                            className={cn(
                              "rounded-2xl border px-3 py-2.5 text-center backdrop-blur-md transition-all",
                              duracao === d.id
                                ? "border-primary/40 bg-primary text-primary-foreground shadow-md"
                                : "border-white/20 bg-white/50 text-foreground hover:border-primary/30",
                            )}
                          >
                            <span className="block text-xs font-semibold">{d.nome}</span>
                            <span
                              className={cn(
                                "mt-0.5 block text-[10px] font-bold tabular-nums",
                                duracao === d.id ? "text-primary-foreground/80" : "text-primary",
                              )}
                            >
                              {(DURACAO_PCT[d.id] * 100).toFixed(0)}%
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-white/20 bg-white/40 p-5 shadow-glass backdrop-blur-md">
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">
                          Margem de lucro
                        </h3>
                        <span className="font-heading text-xl font-black tabular-nums text-primary">
                          {margemLucro[0]}%
                        </span>
                      </div>
                      <Slider
                        value={margemLucro}
                        onValueChange={setMargemLucro}
                        min={0}
                        max={100}
                        step={5}
                        className="mt-4"
                      />
                    </div>

                    <div className="rounded-2xl border border-white/20 bg-white/50 p-4 backdrop-blur-md">
                      <p className="text-[11px] font-light uppercase tracking-wide text-muted-foreground">
                        Valor sugerido (ao vivo) — até a margem de lucro
                      </p>
                      <ContadorMoeda
                        valor={valorAoVivoEtapa3}
                        className="font-heading text-3xl font-black tabular-nums text-primary"
                      />
                      <p className="mt-1 text-[11px] font-light text-muted-foreground">
                        Parcelamento, urgência e imposto entram na próxima etapa.
                      </p>
                    </div>
                  </div>
                )}

                {etapa === "resultado" && (
                  <div className="space-y-5 font-body">
                    <div className="rounded-[1.75rem] border border-white/20 bg-white/40 p-5 shadow-glass backdrop-blur-md">
                      <h3 className="mb-3 font-heading text-sm font-bold uppercase tracking-wide text-foreground">
                        Fechamento
                      </h3>

                      <div className="mb-4 space-y-1.5">
                        <Label htmlFor="rotulo" className="text-xs font-semibold text-foreground">
                          Rótulo do cálculo (opcional)
                        </Label>
                        <Input
                          id="rotulo"
                          value={rotulo}
                          onChange={(e) => setRotulo(e.target.value)}
                          placeholder="Ex: Cliente João Silva"
                          className="border-white/40 bg-white/50"
                        />
                      </div>

                      <p className="mb-1.5 text-xs font-semibold text-foreground">
                        Parcelamento dos honorários (acréscimo)
                      </p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {OPCOES_PARCELAMENTO.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setParcelamento(p.id)}
                            aria-pressed={parcelamento === p.id}
                            className={cn(
                              "rounded-xl border px-2 py-2 text-center text-xs font-semibold backdrop-blur-md transition-all",
                              parcelamento === p.id
                                ? "border-primary/40 bg-primary text-primary-foreground shadow-md"
                                : "border-white/20 bg-white/50 text-foreground hover:border-primary/30",
                            )}
                          >
                            {p.nome}
                            <span
                              className={cn(
                                "ml-1 tabular-nums",
                                parcelamento === p.id ? "text-primary-foreground/80" : "text-primary",
                              )}
                            >
                              +{(PARCELAMENTO_PCT[p.id] * 100).toFixed(0)}%
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="urgencia" className="text-xs font-semibold text-foreground">
                            Urgência/emergência (%)
                          </Label>
                          <NumericFormat
                            id="urgencia"
                            customInput={Input}
                            value={urgencia}
                            onValueChange={(values) => setUrgencia(values.value)}
                            suffix=" %"
                            decimalScale={1}
                            allowNegative={false}
                            placeholder="0 %"
                            className="border-white/40 bg-white/50"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="imposto" className="text-xs font-semibold text-foreground">
                            Imposto (%)
                          </Label>
                          <Input
                            id="imposto"
                            type="number"
                            min="0"
                            step="0.5"
                            value={imposto}
                            onChange={(e) => setImposto(e.target.value)}
                            className="border-white/40 bg-white/50"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[2rem] border border-white/20 bg-white/40 p-6 text-center shadow-glass backdrop-blur-md">
                      <p className="text-xs font-light uppercase tracking-[0.2em] text-muted-foreground">
                        Valor sugerido para o caso
                      </p>
                      <ContadorMoeda
                        valor={resultado.total}
                        className="mt-2 block font-heading text-5xl font-black tabular-nums text-primary"
                      />
                      <p className="mt-2 text-xs font-light text-muted-foreground">
                        {resultado.horasCaso}h · complexidade {complexidade} ·{" "}
                        {DURACOES.find((d) => d.id === duracao)?.nome}
                      </p>
                    </div>

                    {/* Memória de cálculo — waterfall: valor após cada camada composta, na ordem
                        real da regra de ouro (nunca somada num fator único). */}
                    <div className="rounded-[1.75rem] border border-white/20 bg-white/40 p-5 shadow-glass backdrop-blur-md">
                      <h3 className="mb-3 font-heading text-sm font-bold uppercase tracking-wide text-foreground">
                        Memória de cálculo
                      </h3>
                      <div className="space-y-2">
                        {resultado.memoria.map((m, i) => (
                          <div
                            key={m.etapa}
                            className={cn(
                              "flex items-center justify-between text-sm",
                              i === resultado.memoria.length - 1 && "border-t border-white/20 pt-2 font-bold",
                            )}
                          >
                            <span className="text-muted-foreground">
                              {m.etapa}
                              {m.pct !== undefined && (
                                <span className="ml-1 tabular-nums text-muted-foreground/70">
                                  (+{(m.pct * 100).toFixed(1)}%)
                                </span>
                              )}
                            </span>
                            <span className="tabular-nums text-foreground">{formatarMoeda(m.valor)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Parcelas — divisão em N vezes do valor total (diferente do acréscimo por
                        parcelamento acima). */}
                    <div className="rounded-[1.75rem] border border-white/20 bg-white/40 p-5 shadow-glass backdrop-blur-md">
                      <h3 className="mb-3 font-heading text-sm font-bold uppercase tracking-wide text-foreground">
                        Parcelas
                      </h3>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {Object.entries(resultado.parcelas).map(([n, valor]) => (
                          <div
                            key={n}
                            className="flex items-center justify-between rounded-lg border border-white/20 bg-white/50 px-2.5 py-1.5 text-xs"
                          >
                            <span className="font-semibold text-muted-foreground">{n}x</span>
                            <span className="tabular-nums text-foreground">{formatarMoeda(valor)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start gap-2 rounded-lg border-l-4 border-secondary bg-muted/40 p-3">
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                      <p className="text-xs leading-relaxed font-light text-muted-foreground">
                        Estimativa educacional baseada no método de precificação por hora técnica. Não
                        substitui os valores mínimos da Tabela OAB-MA 2026 nem constitui aconselhamento
                        tributário.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {!mostrarHistorico && (
            <div className="flex shrink-0 flex-col gap-2 border-t border-border/50 px-6 py-4">
              {etapa === "infraestrutura" && (
                <Button onClick={avancarInfra} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Avançar para o escopo
                </Button>
              )}
              {etapa === "escopo" && (
                <Button onClick={avancarEscopo} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Avançar para o refinamento
                </Button>
              )}
              {etapa === "refinamento" && (
                <Button
                  onClick={() => setEtapa("resultado")}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Ver memória de cálculo
                </Button>
              )}
              {etapa === "resultado" && (
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={() => void copiarResumo()} className="flex-1 gap-2 basis-full sm:basis-auto">
                    {copiado ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiado ? "Copiado" : "Copiar resumo"}
                  </Button>
                  <Button type="button" variant="outline" onClick={reiniciar} className="flex-1 gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Recalcular
                  </Button>
                  <Button
                    type="button"
                    onClick={() => void concluir()}
                    className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Coins className="h-4 w-4" />
                    Concluir
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetPrimitive.Content>
      </SheetPrimitive.Portal>
    </SheetPrimitive.Root>
  );
};

export default CalculadoraCustosSheet;
