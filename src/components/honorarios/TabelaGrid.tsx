import { useEffect, useMemo, useState, type RefObject } from "react";
import { Calculator, ChevronRight, Search, X } from "lucide-react";
import type { ItemTabela } from "@/data/tabelaHonorarios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatarMoeda } from "./format";
import { STATUS_TAG_STYLES, getStatusTag } from "./itemTags";
import Kbd from "./Kbd";

const ITENS_POR_PAGINA = 20;

interface TabelaGridProps {
  itens: ItemTabela[];
  onCalcular: (item: ItemTabela) => void;
  filtro: string;
  onFiltroChange: (valor: string) => void;
  inputRef?: RefObject<HTMLInputElement>;
}

const valorFinal2026 = (item: ItemTabela) => {
  if (item.situacoes && item.situacoes.length > 0) {
    return `A partir de ${formatarMoeda(item.situacoes[0].valor_minimo)}`;
  }
  if (item.tipo === "percentual" && item.percentual_minimo) {
    return item.valor_minimo ? `mín. ${formatarMoeda(item.valor_minimo)}` : "Sob consulta";
  }
  return formatarMoeda(item.valor_minimo ?? 0);
};

const percentualCol = (item: ItemTabela) =>
  item.tipo === "percentual" && item.percentual_minimo ? `${item.percentual_minimo}%` : "—";

const TabelaGrid = ({ itens, onCalcular, filtro, onFiltroChange, inputRef }: TabelaGridProps) => {
  const [pagina, setPagina] = useState(1);

  const itensFiltrados = useMemo(() => {
    const termo = filtro.trim().toLowerCase();
    if (!termo) return itens;
    return itens.filter(
      (item) => item.descricao.toLowerCase().includes(termo) || item.id.toLowerCase().includes(termo),
    );
  }, [itens, filtro]);

  useEffect(() => {
    setPagina(1);
  }, [itensFiltrados]);

  // Nome da área vem sempre da lista completa (não da filtrada), pra continuar aparecendo
  // no cabeçalho mesmo quando o filtro não encontra nenhum resultado.
  const nomeArea = itens[0]?.area ?? "";

  const totalPaginas = Math.max(1, Math.ceil(itensFiltrados.length / ITENS_POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const itensDaPagina = itensFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA);

  return (
    <div className="font-body">
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border/40 bg-muted/40 px-5 py-4">
          <div>
            <h3 className="font-heading text-base font-bold text-primary">{nomeArea}</h3>
            <p className="text-xs text-muted-foreground">
              {filtro.trim()
                ? `Mostrando ${itensFiltrados.length} de ${itens.length} itens`
                : `${itens.length} ${itens.length === 1 ? "item catalogado" : "itens catalogados"} nesta área`}
            </p>
          </div>
          <Badge variant="outline" className="shrink-0 border-primary/20 bg-primary/5 text-[10px] text-primary">
            Fonte oficial
          </Badge>
        </div>

        <div className="border-b border-border/40 px-5 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={filtro}
              onChange={(e) => onFiltroChange(e.target.value)}
              placeholder='Filtrar serviço nesta área (ex: "recurso", "inicial")...'
              aria-label="Filtrar serviço nesta área"
              className="h-9 rounded-lg pl-9 pr-14 text-sm"
            />
            {filtro ? (
              <button
                type="button"
                onClick={() => onFiltroChange("")}
                aria-label="Limpar filtro"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <Kbd
                keys={["command", "J"]}
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
              />
            )}
          </div>
        </div>

        {itensFiltrados.length === 0 ? (
          <div className="flex min-h-[220px] items-center justify-center px-5 py-10">
            <p className="max-w-xs text-center text-sm text-muted-foreground">
              Nenhum serviço encontrado nesta área. Tente mudar o termo ou consultar a IA.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/40 bg-muted/60 hover:bg-muted/60">
                <TableHead className="w-16 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Item
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Serviço / Procedimento
                </TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  % mín.
                </TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Valor (R$)
                </TableHead>
                <TableHead className="w-12 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Ação
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/30">
              {itensDaPagina.map((item) => {
                const tag = getStatusTag(item.id);
                return (
                  <TableRow
                    key={item.id}
                    className="group cursor-pointer border-border/20 transition-colors hover:bg-muted/40"
                    onClick={() => onCalcular(item)}
                  >
                    <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                      {item.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{item.descricao}</span>
                        {tag && (
                          <Badge
                            variant="outline"
                            className={cn("shrink-0 text-[10px]", STATUS_TAG_STYLES[tag])}
                          >
                            {tag}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                      {percentualCol(item)}
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold tabular-nums text-primary">
                      <span className="inline-flex items-center justify-end gap-1.5">
                        {item.tipo === "percentual" && (
                          <Calculator className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                        )}
                        {valorFinal2026(item)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        type="button"
                        aria-label={`Calcular ${item.descricao}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onCalcular(item);
                        }}
                        className="inline-flex items-center justify-center rounded-full p-1 text-muted-foreground/60 transition-colors group-hover:bg-[#BC231A]/10 group-hover:text-[#BC231A]"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {itensFiltrados.length > ITENS_POR_PAGINA && (
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span className="tabular-nums">
            Exibindo {inicio + 1}–{Math.min(inicio + ITENS_POR_PAGINA, itensFiltrados.length)} de{" "}
            {itensFiltrados.length} itens
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={paginaAtual === 1}
              onClick={() => setPagina((p) => p - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={paginaAtual === totalPaginas}
              onClick={() => setPagina((p) => p + 1)}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      <p className="mt-2 text-xs text-muted-foreground">
        * O histórico de valores anteriores ainda não está disponível na base de dados consolidada.
      </p>
    </div>
  );
};

export default TabelaGrid;
