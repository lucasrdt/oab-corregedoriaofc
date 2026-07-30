import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Calculator, FileSignature, ScrollText, Search } from "lucide-react";
import {
  areasDisponiveis,
  buscarPorArea,
  calcularHonorario,
  tabelaHonorarios,
  AVISO_TABELA,
  type ItemTabela,
} from "@/data/tabelaHonorarios";
import { useToast } from "@/hooks/use-toast";
import SidebarAreas from "@/components/honorarios/SidebarAreas";
import TabelaGrid from "@/components/honorarios/TabelaGrid";
import BuscaGlobal from "@/components/honorarios/BuscaGlobal";
import DetalheItemSheet from "@/components/honorarios/DetalheItemSheet";
import PdfPreviewSheet from "@/components/honorarios/PdfPreviewSheet";
import CalculadoraModal from "@/components/honorarios/CalculadoraModal";
import BibliotecaMinutasSheet from "@/components/honorarios/BibliotecaMinutasSheet";
import { ShaderBackground } from "@/components/ui/blue-halftone";
import ChatWidget from "@/components/honorarios/ChatWidget";
import RecentesStrip from "@/components/honorarios/RecentesStrip";
import { useRecentes } from "@/components/honorarios/useRecentes";
import { formatarMoeda } from "@/components/honorarios/format";

type Resultado = { resultado: number; explicacao: string };

// Entrada em stagger do conteúdo do Hero (eyebrow → título → subtítulo → caixa → contadores).
// GSAP cuida das animações contínuas/orgânicas (fluidos do fundo, caneta assinando);
// framer-motion cuida só desta revelação de entrada, que é declarativa e não-orgânica.
const heroContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const heroItemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const HonorariosIndex = () => {
  const totalAreas = areasDisponiveis.length;
  const totalItens = tabelaHonorarios.length;

  const [areaSelecionada, setAreaSelecionada] = useState(areasDisponiveis[0]);
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [chatAberto, setChatAberto] = useState(false);
  const [perguntaHero, setPerguntaHero] = useState("");
  const [calculadoraAberta, setCalculadoraAberta] = useState(false);
  const [pdfAberto, setPdfAberto] = useState(false);
  const [minutasAberta, setMinutasAberta] = useState(false);

  const [itemCalculo, setItemCalculo] = useState<ItemTabela | null>(null);
  const [calculoAberto, setCalculoAberto] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [itemResultado, setItemResultado] = useState<ItemTabela | null>(null);
  const [filtroServico, setFiltroServico] = useState("");
  const filtroServicoRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const { recentes, registrar } = useRecentes();
  const reduzMovimento = useReducedMotion();

  const itensDaArea = useMemo(() => buscarPorArea(areaSelecionada), [areaSelecionada]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      const key = e.key.toLowerCase();
      if (key === "j") {
        // ⌘J agora foca o filtro local de serviços da área (em vez de abrir a busca
        // global) — mimetiza o atalho de busca rápida da OAB-PR na própria listagem.
        e.preventDefault();
        filtroServicoRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        filtroServicoRef.current?.focus();
        filtroServicoRef.current?.select();
      } else if (key === "k") {
        e.preventDefault();
        setChatAberto((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const abrirCalculo = (item: ItemTabela) => {
    setItemCalculo(item);
    setCalculoAberto(true);
    setBuscaAberta(false);
    registrar(item);

    const precisaInput = Boolean(item.situacoes?.length) || item.requer_valor_causa;
    if (!precisaInput) {
      setResultado(calcularHonorario(item));
      setItemResultado(item);
    } else {
      setResultado(null);
      setItemResultado(null);
    }
  };

  const perguntarSobreItem = () => {
    if (!itemCalculo) return;
    setCalculoAberto(false);
    setPerguntaHero(
      `Explique o cálculo de honorários do item ${itemCalculo.id} (${itemCalculo.descricao}) da área ${itemCalculo.area}.`,
    );
    setChatAberto(true);
  };

  const compartilharResultado = async () => {
    if (!itemCalculo || !resultado) return;
    const texto = `Honorários — item ${itemCalculo.id} (${itemCalculo.descricao}): ${formatarMoeda(resultado.resultado)}. Fonte: Tabela de Honorários Mínimos OAB-MA 2026.`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Honorários OAB-MA", text: texto });
      } catch {
        // usuário cancelou o compartilhamento — nada a fazer
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(texto);
      toast({ title: "Copiado", description: "Resumo copiado para a área de transferência." });
    } catch {
      toast({
        title: "Não foi possível compartilhar",
        description: "Copie o resumo manualmente.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Hero — faixa full-bleed clara (SaaS clean), escapa do container-padding herdado do MainLayout */}
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden bg-white py-16 md:py-24">
        <ShaderBackground className="absolute inset-0 z-0" />
        <div aria-hidden className="absolute inset-0 z-[1] bg-slate-950/45 pointer-events-none" />

        <motion.div
          variants={heroContainerVariants}
          initial={reduzMovimento ? "show" : "hidden"}
          animate="show"
          className="container-padding relative z-10 mx-auto max-w-3xl text-center"
        >
          <motion.p
            variants={heroItemVariants}
            className="text-left font-body text-xs font-semibold uppercase tracking-[0.2em] text-slate-300"
          >
            Corregedoria-Geral da Justiça · OAB-MA
          </motion.p>
          <motion.h1
            variants={heroItemVariants}
            className="mt-3 text-left font-heading text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl"
          >
            Sua consulta,{" "}
            <span className="font-serif-display text-[1.1em] font-normal italic text-[#BC231A]">
              resolvida agora.
            </span>
          </motion.h1>
          <motion.p
            variants={heroItemVariants}
            className="mt-5 max-w-2xl text-left font-body text-base font-normal text-slate-400"
          >
            Tabela Consolidada 2026 e assistente inteligente da Corregedoria-Geral, reunidos em um
            só lugar.
          </motion.p>

          {/* Caixa de comando unificada — busca no topo, atalhos + envio no rodapé da mesma caixa */}
          <motion.div variants={heroItemVariants} className="mt-8 max-w-2xl">
            {/* Hierarquia de camadas fiel à referência: moldura branca sólida (fora) → área
                de input em vidro (dentro, no topo, com o botão de envio no canto inferior
                direito dela) → atalhos abaixo, já sobre o branco sólido da moldura, sem vidro. */}
            <div className="rounded-[2.25rem] border border-white/10 bg-slate-900/60 p-4 shadow-[0_20px_60px_-20px_rgba(26,34,56,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_64px_-16px_rgba(26,34,56,0.3)] sm:p-5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setChatAberto(true);
                }}
              >
                {/* Elemento secundário — área de input, efeito de vidro leitoso. A moldura
                    externa é sólida, então o halftone não "vaza" por trás via backdrop-filter
                    (opaco bloqueia o que está atrás); por isso renderizamos um shader local
                    aqui dentro, com um véu bg-white/70 + blur por cima pra dar o efeito glass
                    sem comprometer a legibilidade do texto. */}
                <div className="relative min-h-[150px] overflow-hidden rounded-[1.75rem] border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9)] sm:min-h-[168px]">
                  <ShaderBackground className="absolute inset-0 z-0 pointer-events-none" />
                  {/* Véu escurecido a /60 (não /50): a base do halftone ainda é quase-branca
                      (blue-halftone.tsx não foi alterado), então /50 não segura 4.5:1 pro
                      texto branco nas regiões mais claras do padrão — /60 cobre esse caso. */}
                  <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] bg-slate-900/60 backdrop-blur-xl" />

                  <div aria-hidden className="pointer-events-none absolute -right-6 -top-8 z-[1] h-28 w-28 rounded-full bg-[#BC231A]/25 blur-2xl" />
                  <div aria-hidden className="pointer-events-none absolute -bottom-8 -left-6 z-[1] h-28 w-28 rounded-full bg-[#1D4E89]/25 blur-2xl" />

                  {/* Canto superior direito propositalmente limpo — sem badge de ⌘K aqui */}
                  <div className="relative z-10 flex items-center gap-3 p-5 sm:p-6">
                    <button
                      type="button"
                      onClick={() => setChatAberto(true)}
                      aria-label="Abrir assistente de honorários"
                      className="shrink-0 text-slate-400 transition-colors duration-300 hover:text-[#BC231A]"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                    <input
                      value={perguntaHero}
                      onChange={(e) => setPerguntaHero(e.target.value)}
                      onFocus={() => {
                        // A barra é um atalho para o assistente, não um campo de digitação
                        // próprio — ao focar, já abrimos o modal e o usuário continua
                        // digitando lá dentro (Radix move o foco automaticamente).
                        setPerguntaHero("");
                        setChatAberto(true);
                      }}
                      placeholder="Ex: honorário para divórcio..."
                      aria-label="Pergunte ao assistente de honorários"
                      className="flex-1 bg-transparent font-body text-sm text-white outline-none placeholder:text-slate-400 sm:text-base"
                    />
                  </div>

                  {/* Botão de envio — menor e mais discreto, alinhado à direita dentro do vidro */}
                  <button
                    type="submit"
                    aria-label="Perguntar ao assistente de honorários"
                    className="absolute z-10 bottom-4 right-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#BC231A] text-white shadow-[0_0_0_5px_rgba(188,35,26,0.14)] transition-transform hover:scale-105 hover:bg-[#a31d15] active:scale-95"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                </div>

                {/* Área de atalhos — fora do vidro, sobre o branco sólido da moldura */}
                <div className="flex flex-wrap items-center gap-1.5 px-1.5 pt-4">
                  <button
                    type="button"
                    onClick={() => setCalculadoraAberta(true)}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-body text-[11px] font-medium text-slate-200 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    <Calculator className="h-3 w-3 text-slate-400" />
                    Calculadora
                  </button>
                  <button
                    type="button"
                    onClick={() => setPdfAberto(true)}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-body text-[11px] font-medium text-slate-200 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    <ScrollText className="h-3 w-3 text-slate-400" />
                    Tabela PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setMinutasAberta(true)}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-body text-[11px] font-medium text-slate-200 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    <FileSignature className="h-3 w-3 text-slate-400" />
                    Minutas
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          <motion.div
            variants={heroItemVariants}
            className="mt-8 flex items-center justify-start gap-5 font-body sm:gap-8"
          >
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold tabular-nums text-white sm:text-xl">
                {totalAreas}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-300">
                Áreas
              </span>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold tabular-nums text-white sm:text-xl">
                {totalItens}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-300">
                Itens Catalogados
              </span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <main className="container-padding mx-auto max-w-6xl py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <h2 className="flex items-center gap-1.5 font-heading text-lg font-bold text-primary">
              Tabela Oficial
              <Calculator className="h-4 w-4 text-muted-foreground/50" aria-hidden />
            </h2>
            <div className="flex items-center gap-3 font-body text-xs text-muted-foreground">
              <span>
                <strong className="font-semibold tabular-nums text-foreground">{totalAreas}</strong> áreas
              </span>
              <span className="text-border">·</span>
              <span>
                <strong className="font-semibold tabular-nums text-foreground">{totalItens}</strong> itens
              </span>
            </div>
          </div>

          <button
            onClick={() => setBuscaAberta(true)}
            className="inline-flex items-center gap-1.5 font-body text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            <Search className="h-3.5 w-3.5" />
            Busca em todas as áreas
          </button>
        </div>

        <RecentesStrip itens={recentes} onSelecionar={abrirCalculo} />

        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="min-w-0 lg:shrink-0">
            <SidebarAreas
              areaSelecionada={areaSelecionada}
              onSelecionar={(area) => {
                setAreaSelecionada(area);
                setFiltroServico("");
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <TabelaGrid
              itens={itensDaArea}
              onCalcular={abrirCalculo}
              filtro={filtroServico}
              onFiltroChange={setFiltroServico}
              inputRef={filtroServicoRef}
            />
          </div>
        </div>
      </main>

      <BuscaGlobal open={buscaAberta} onOpenChange={setBuscaAberta} onSelecionarItem={abrirCalculo} />

      <CalculadoraModal
        open={calculadoraAberta}
        onOpenChange={setCalculadoraAberta}
        onSelecionarItem={abrirCalculo}
      />

      <PdfPreviewSheet open={pdfAberto} onOpenChange={setPdfAberto} />

      <BibliotecaMinutasSheet open={minutasAberta} onOpenChange={setMinutasAberta} />

      <DetalheItemSheet
        item={itemCalculo}
        open={calculoAberto}
        onOpenChange={setCalculoAberto}
        resultado={resultado}
        itemResultado={itemResultado}
        onCalcular={(novoResultado, novoItem) => {
          setResultado(novoResultado);
          setItemResultado(novoItem);
        }}
        onLimpar={() => {
          setResultado(null);
          setItemResultado(null);
        }}
        onPerguntar={perguntarSobreItem}
        onCompartilhar={compartilharResultado}
      />

      <ChatWidget
        open={chatAberto}
        onOpenChange={setChatAberto}
        mensagemInicial={perguntaHero}
        onMensagemInicialEnviada={() => setPerguntaHero("")}
      />

      <div className="sticky bottom-0 z-30 border-t border-border/60 bg-background/90 py-3 backdrop-blur-md">
        <p className="container-padding text-center font-body text-xs leading-relaxed text-muted-foreground">
          {AVISO_TABELA}
        </p>
      </div>
    </>
  );
};

export default HonorariosIndex;
