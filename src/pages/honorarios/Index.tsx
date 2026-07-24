import { useEffect, useMemo, useRef, useState } from "react";
import { Calculator, ScrollText, Search } from "lucide-react";
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
import Kbd from "@/components/honorarios/Kbd";
import ChatWidget from "@/components/honorarios/ChatWidget";
import RecentesStrip from "@/components/honorarios/RecentesStrip";
import { useRecentes } from "@/components/honorarios/useRecentes";
import { formatarMoeda } from "@/components/honorarios/format";

type Resultado = { resultado: number; explicacao: string };

// Traço fino sob o título — desenha uma vez ao montar (não é loop). Isolado aqui (via
// <style> inline) em vez de tailwind.config.ts, que é compartilhado com o resto do site e
// o módulo /honorarios não pode alterar.
const honorariosHeroRuleKeyframes = `
  @keyframes honorarios-hero-rule {
    from { width: 0; opacity: 0; }
    to { width: 4rem; opacity: 1; }
  }
  .honorarios-hero-rule {
    animation: honorarios-hero-rule 0.6s 0.1s ease-out both;
  }
  @media (prefers-reduced-motion: reduce) {
    .honorarios-hero-rule {
      animation: none;
      width: 4rem;
      opacity: 1;
    }
  }
`;

const HonorariosIndex = () => {
  const totalAreas = areasDisponiveis.length;
  const totalItens = tabelaHonorarios.length;

  const [areaSelecionada, setAreaSelecionada] = useState(areasDisponiveis[0]);
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [chatAberto, setChatAberto] = useState(false);
  const [perguntaHero, setPerguntaHero] = useState("");
  const [calculadoraAberta, setCalculadoraAberta] = useState(false);
  const [pdfAberto, setPdfAberto] = useState(false);

  const [itemCalculo, setItemCalculo] = useState<ItemTabela | null>(null);
  const [calculoAberto, setCalculoAberto] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [itemResultado, setItemResultado] = useState<ItemTabela | null>(null);
  const [filtroServico, setFiltroServico] = useState("");
  const filtroServicoRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const { recentes, registrar } = useRecentes();

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
      {/* Hero — faixa navy full-bleed, escapa do container-padding herdado do MainLayout */}
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden bg-gradient-to-br from-[#1A2238] via-[#141a2c] to-[#10141f] py-16 text-white md:py-24">
        <style>{honorariosHeroRuleKeyframes}</style>

        {/* Profundidade tonal estática (sem loop, sem grade animada) — dois glows parados
            que dão variação de cor dentro da própria paleta navy/vermelho do site, em vez
            de um bloco chapado ou de decoração cinética. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-1/3 right-0 h-[32rem] w-[32rem] rounded-full bg-white/[0.04] blur-[110px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#BC231A]/10 blur-[100px]"
        />

        <div className="container-padding relative z-10 mx-auto max-w-4xl text-center">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            Corregedoria-Geral da Justiça · OAB-MA
          </p>
          <h1 className="mt-3 font-heading text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            Sua consulta, <span className="text-[#BC231A]">resolvida agora.</span>
          </h1>
          <span
            aria-hidden
            className="honorarios-hero-rule mx-auto mt-5 block h-px bg-white/25"
          />
          <p className="mx-auto mt-5 max-w-2xl font-body text-base text-white/60 sm:text-lg">
            Tabela Consolidada 2026 e assistente inteligente da Corregedoria-Geral, reunidos em um
            só lugar.
          </p>

          <div className="mx-auto mt-8 max-w-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setChatAberto(true);
              }}
              className="group relative flex w-full items-center gap-3 rounded-2xl bg-white/95 px-6 py-4 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.4)] ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_36px_-10px_rgba(0,0,0,0.45)] focus-within:-translate-y-0.5 focus-within:shadow-[0_10px_36px_-10px_rgba(0,0,0,0.45)]"
            >
              <button
                type="button"
                onClick={() => setChatAberto(true)}
                aria-label="Abrir assistente de honorários"
                className="shrink-0 text-muted-foreground transition-colors duration-300 group-hover:text-[#BC231A]"
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
                className="flex-1 bg-transparent font-body text-sm text-foreground outline-none placeholder:text-muted-foreground sm:text-base"
              />
              <Kbd
                keys={["command", "K"]}
                className="hidden px-2 py-1 text-xs transition-colors duration-300 group-hover:border-[#BC231A]/40 sm:inline-block"
              />
            </form>

            <div className="mt-4 flex flex-wrap items-center justify-start gap-x-3 gap-y-2 font-body text-xs text-white/50">
              <button
                type="button"
                onClick={() => setCalculadoraAberta(true)}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <Calculator className="h-3.5 w-3.5 text-[#BC231A]" />
                Calculadora por atividade
              </button>
              <button
                type="button"
                onClick={() => setPdfAberto(true)}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <ScrollText className="h-3.5 w-3.5 text-[#BC231A]" />
                Tabela Oficial (PDF)
              </button>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6 font-body sm:gap-10">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold tabular-nums text-white sm:text-3xl">
                {totalAreas}
              </span>
              <span className="text-xs uppercase tracking-wider text-white/50">Áreas</span>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold tabular-nums text-white sm:text-3xl">
                {totalItens}
              </span>
              <span className="text-xs uppercase tracking-wider text-white/50">
                Itens Catalogados
              </span>
            </div>
          </div>
        </div>
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
