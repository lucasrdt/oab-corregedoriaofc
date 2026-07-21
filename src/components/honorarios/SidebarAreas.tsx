import { useMemo, useState } from "react";
import { Search, SearchX, X } from "lucide-react";
import { areasDisponiveis, buscarPorArea } from "@/data/tabelaHonorarios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SidebarAreasProps {
  areaSelecionada: string;
  onSelecionar: (area: string) => void;
}

const SidebarAreas = ({ areaSelecionada, onSelecionar }: SidebarAreasProps) => {
  const [filtro, setFiltro] = useState("");

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
    <aside className="rounded-2xl border border-border/50 bg-card font-body shadow-sm">
      <div className="border-b border-border/40 px-5 py-4">
        <h2 className="font-heading text-base font-bold text-primary">Áreas do Direito</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {capitulos.length} capítulos · navegação por especialidade
        </p>
      </div>

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

      <nav aria-label="Capítulos da Tabela OAB-MA">
        <ScrollArea className="h-[420px] lg:h-[calc(100vh-420px)] lg:max-h-[640px]">
          <div className="space-y-1 px-3 py-3">
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
                return (
                  <button
                    key={area}
                    onClick={() => onSelecionar(area)}
                    aria-current={ativo ? "true" : undefined}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg border-l-4 px-3.5 py-2.5 text-left text-sm transition-colors",
                      ativo
                        ? "border-l-[#BC231A] bg-[#BC231A]/10 font-semibold text-primary"
                        : "border-l-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span className="min-w-0 flex-1 leading-snug">{area}</span>
                    <span
                      className={cn(
                        "shrink-0 self-start rounded-full px-1.5 py-0.5 font-mono text-[10px] tabular-nums",
                        ativo ? "bg-[#BC231A]/15 text-[#BC231A]" : "bg-muted text-muted-foreground/70",
                      )}
                    >
                      {total}
                    </span>
                  </button>
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
