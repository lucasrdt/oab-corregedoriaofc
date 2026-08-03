import { useMemo, useState } from "react";
import { PanelLeftClose, PanelLeftOpen, Search, SearchX, X } from "lucide-react";
import { areasDisponiveis, buscarPorArea } from "@/data/tabelaHonorarios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getAreaIcon } from "./areaIcons";

interface SidebarAreasProps {
  areaSelecionada: string;
  onSelecionar: (area: string) => void;
}

const SidebarAreas = ({ areaSelecionada, onSelecionar }: SidebarAreasProps) => {
  const [filtro, setFiltro] = useState("");
  const [compacta, setCompacta] = useState(false);

  const capitulos = useMemo(
    () => areasDisponiveis.map((area) => ({ area, total: buscarPorArea(area).length })),
    [],
  );

  const capitulosFiltrados = useMemo(() => {
    const termo = filtro.trim().toLowerCase();
    if (!termo) return capitulos;
    return capitulos.filter(({ area }) => area.toLowerCase().includes(termo));
  }, [capitulos, filtro]);

  return (
    <aside
      className={cn(
        "rounded-2xl border border-border/50 bg-card font-body shadow-sm transition-[width] duration-200",
        compacta ? "w-[4.5rem]" : "w-full lg:w-72",
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border/40 px-5 py-4">
        {!compacta && (
          <div className="min-w-0">
            <h2 className="font-heading text-base font-bold text-primary">Áreas do Direito</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {capitulos.length} capítulos · navegação por especialidade
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCompacta((v) => !v)}
          aria-label={compacta ? "Expandir lista de áreas" : "Recolher lista de áreas"}
          className="ml-auto shrink-0 rounded-full p-1.5 text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
        >
          {compacta ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      {!compacta && (
        <div className="border-b border-border/40 px-3 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Buscar área…"
              aria-label="Buscar área do direito"
              className="h-9 rounded-xl pl-9 pr-8 text-sm"
            />
            {filtro && (
              <button
                type="button"
                onClick={() => setFiltro("")}
                aria-label="Limpar busca"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {filtro && (
            <p className="mt-1.5 px-0.5 text-[11px] text-muted-foreground">
              {capitulosFiltrados.length} de {capitulos.length} áreas
            </p>
          )}
        </div>
      )}

      <nav aria-label="Capítulos da Tabela OAB-MA">
        <ScrollArea className="h-[420px] lg:h-[calc(100vh-420px)] lg:max-h-[640px]">
          <div className={cn("space-y-1 py-3", compacta ? "px-2" : "px-3")}>
            {capitulosFiltrados.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border/50 bg-muted/30 px-3 py-8 text-center">
                <SearchX className="h-5 w-5 text-muted-foreground/50" />
                <p className="text-xs text-muted-foreground">
                  Nenhuma área encontrada para "{filtro}".
                </p>
              </div>
            ) : (
              capitulosFiltrados.map(({ area, total }) => {
                const ativo = areaSelecionada === area;
                const Icone = getAreaIcon(area);

                const botao = (
                  <button
                    key={area}
                    onClick={() => onSelecionar(area)}
                    aria-current={ativo ? "true" : undefined}
                    aria-label={compacta ? area : undefined}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg border-l-4 text-left text-sm transition-all duration-300 ease-out",
                      compacta ? "justify-center px-0 py-2.5" : "px-3.5 py-2.5",
                      ativo
                        ? "border-l-[#BC231A] bg-[#BC231A]/10 font-semibold text-primary shadow-[inset_0_0_0_1px_rgba(188,35,26,0.08)]"
                        : "border-l-transparent text-muted-foreground hover:translate-x-0.5 hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icone
                      className={cn("h-4 w-4 shrink-0", ativo ? "text-[#BC231A]" : "text-muted-foreground/60")}
                    />
                    {!compacta && (
                      <>
                        <span className="min-w-0 flex-1 leading-snug">{area}</span>
                        <span
                          className={cn(
                            "shrink-0 self-start rounded-full px-1.5 py-0.5 font-mono text-[10px] tabular-nums transition-colors duration-300",
                            ativo ? "bg-[#BC231A]/15 text-[#BC231A]" : "bg-muted text-muted-foreground/70",
                          )}
                        >
                          {total}
                        </span>
                      </>
                    )}
                  </button>
                );

                if (!compacta) return botao;

                return (
                  <Tooltip key={area} delayDuration={200}>
                    <TooltipTrigger asChild>{botao}</TooltipTrigger>
                    <TooltipContent side="right">
                      {area} · {total}
                    </TooltipContent>
                  </Tooltip>
                );
              })
            )}
          </div>
        </ScrollArea>
      </nav>
    </aside>
  );
};

export default SidebarAreas;
