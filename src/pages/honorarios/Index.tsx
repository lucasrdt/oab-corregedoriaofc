import { useEffect, useMemo, useRef, useState } from "react";
import { Calculator, FileText, Search } from "lucide-react";
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
import { formatarMoeda } from "@/components/honorarios/format";

type Resultado = { resultado: number; explicacao: string };

// Drift da grade de fundo do hero — isolado aqui (via <style> inline) em vez de
// tailwind.config.ts, que é compartilhado com o resto do site e o módulo /honorarios não
// pode alterar. 14s de duração + 60px (exatamente um "tile" do padrão) mantém o loop
// perfeitamente contínuo, e a translação por transform já roda na GPU.
const honorariosGridDriftKeyframes = `
  @keyframes honorarios-grid-drift {
    from { transform: translate3d(0, 0, 0); }
    to { transform: translate3d(-60px, -60px, 0); }
  }
  .honorarios-grid-drift {
    animation: honorarios-grid-drift 14s linear infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .honorarios-grid-drift {
      animation: none;
    }
  }
`;

// Luz vermelha que percorre a borda da barra de busca no hover/foco, em vez do brilho
// difuso (blur) que tinha antes — usa a técnica de gradiente cônico rotativo mascarado
// pra só a borda fina aparecer (não o miolo). @property registra o ângulo como animável.
const honorariosSearchBeamKeyframes = `
  @property --honorarios-beam-angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }
  @keyframes honorarios-search-beam-spin {
    to { --honorarios-beam-angle: 360deg; }
  }
  .honorarios-search-beam {
    padding: 1.5px;
    background: conic-gradient(
      from var(--honorarios-beam-angle),
      transparent 0%,
      transparent 72%,
      #bc231a 82%,
      #f5a39c 88%,
      #bc231a 94%,
      transparent 100%
    );
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: honorarios-search-beam-spin 3s linear infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .honorarios-search-beam {
      animation: none;
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
        <style>{honorariosGridDriftKeyframes}</style>

        {/* Grade quadriculada num wrapper à parte, maior que a seção (-inset-[60px]) e
            animada por exatamente um "tile" (60px) — o loop fica invisível porque volta a
            coincidir com o próprio padrão. Linhas de destaque/pontos ficam num SVG estático
            separado, fixos, servindo de referência enquanto a grade fina desliza atrás. */}
        <div
          aria-hidden
          className="honorarios-grid-drift pointer-events-none absolute -inset-[60px] will-change-transform"
        >
          <svg className="h-full w-full">
            <defs>
              <pattern id="honorarios-hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#honorarios-hero-grid)" />
          </svg>
        </div>

        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          <line x1="0" y1="20%" x2="100%" y2="20%" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <line x1="0" y1="80%" x2="100%" y2="80%" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <line x1="20%" y1="0" x2="20%" y2="100%" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <line x1="80%" y1="0" x2="80%" y2="100%" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <circle cx="20%" cy="20%" r="2" fill="rgba(255,255,255,0.25)" />
          <circle cx="80%" cy="20%" r="2" fill="rgba(255,255,255,0.25)" />
          <circle cx="20%" cy="80%" r="2" fill="rgba(255,255,255,0.25)" />
          <circle cx="80%" cy="80%" r="2" fill="rgba(255,255,255,0.25)" />
          <circle cx="50%" cy="50%" r="1.5" fill="rgba(255,255,255,0.2)" />
        </svg>

        <div aria-hidden className="pointer-events-none absolute left-8 top-8 h-2 w-2 bg-white/20" />
        <div aria-hidden className="pointer-events-none absolute right-8 top-8 h-2 w-2 bg-white/20" />
        <div aria-hidden className="pointer-events-none absolute bottom-8 left-8 h-2 w-2 bg-white/20" />
        <div aria-hidden className="pointer-events-none absolute bottom-8 right-8 h-2 w-2 bg-white/20" />

        <div className="container-padding relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="font-heading text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            Sua consulta, <span className="text-[#BC231A]">resolvida agora.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-body text-base text-white/70 sm:text-lg">
            Tabela Consolidada 2026 e assistente inteligente da Corregedoria-Geral, reunidos em um
            só lugar.
          </p>

          <div className="mx-auto mt-8 max-w-2xl">
            <style>{honorariosSearchBeamKeyframes}</style>
            <div className="group relative">
              <div
                aria-hidden
                className="honorarios-search-beam pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:opacity-100 group-focus-within:-translate-y-0.5 group-focus-within:opacity-100"
              />
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setChatAberto(true);
                }}
                className="relative flex w-full items-center gap-3 rounded-2xl bg-white/95 px-6 py-4 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.4)] ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-0.5 focus-within:-translate-y-0.5 focus-within:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]"
              >
              <button
                type="button"
                onClick={() => setChatAberto(true)}
                aria-label="Abrir assistente de honorários"
                className="shrink-0 text-muted-foreground transition-all duration-300 group-hover:scale-110 group-hover:text-[#BC231A]"
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
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-start gap-x-3 gap-y-2 font-body text-xs text-white/60">
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
                <FileText className="h-3.5 w-3.5 text-[#BC231A]" />
                Tabela Oficial (PDF)
              </button>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6 font-body sm:gap-10">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold tabular-nums text-white sm:text-3xl">
                {totalAreas}
              </span>
              <span className="text-xs uppercase tracking-wider text-white/60">Áreas</span>
            </div>
            <div className="h-10 w-px bg-white/15" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold tabular-nums text-white sm:text-3xl">
                {totalItens}
              </span>
              <span className="text-xs uppercase tracking-wider text-white/60">
                Itens Catalogados
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="container-padding mx-auto max-w-6xl py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-1.5 font-heading text-lg font-bold text-primary">
            Tabela Oficial
            <Calculator className="h-4 w-4 text-muted-foreground/50" aria-hidden />
          </h2>

          <button
            onClick={() => setBuscaAberta(true)}
            className="inline-flex items-center gap-1.5 font-body text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            <Search className="h-3.5 w-3.5" />
            Busca em todas as áreas
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-3">
            <SidebarAreas
              areaSelecionada={areaSelecionada}
              onSelecionar={(area) => {
                setAreaSelecionada(area);
                setFiltroServico("");
              }}
            />
          </div>
          <div className="min-w-0 lg:col-span-9">
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
