import { useMemo, useState } from "react";
import { Calculator, Info, Search, X } from "lucide-react";
import { tabelaHonorarios, type ItemTabela } from "@/data/tabelaHonorarios";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatarMoeda } from "@/components/honorarios/format";

interface CalculadoraModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelecionarItem: (item: ItemTabela) => void;
}

// MVP: escopo restrito ao cálculo pela Tabela Oficial (itens percentuais). O modo "Hora
// Técnica / Custos" (CalculoCustosForm) foi postergado — continua existindo, só não é mais
// renderizado aqui.
const itensCalculaveis = tabelaHonorarios.filter((item) => item.tipo === "percentual");

// Mesmo padrão visual do ChatWidget.tsx (painel central, cabeçalho vermelho translúcido com
// glow, avatar circular, gradiente navy) — os dois "lançadores" do hero (Assistente e
// Calculadora) seguem a mesma linguagem; só o DetalheItemSheet (detalhe de item) é um
// painel lateral, por ter um propósito diferente (contexto da tabela ao fundo).
const CalculadoraModal = ({ open, onOpenChange, onSelecionarItem }: CalculadoraModalProps) => {
  const [termo, setTermo] = useState("");

  const itensFiltrados = useMemo(() => {
    const lower = termo.trim().toLowerCase();
    if (!lower) return itensCalculaveis;
    return itensCalculaveis.filter(
      (item) =>
        item.id.toLowerCase().includes(lower) ||
        item.descricao.toLowerCase().includes(lower) ||
        item.area.toLowerCase().includes(lower),
    );
  }, [termo]);

  const selecionar = (item: ItemTabela) => {
    onOpenChange(false);
    onSelecionarItem(item);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className="flex h-[680px] w-[calc(100vw-2rem)] max-w-2xl max-h-[90vh] flex-col gap-0 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1A2238] via-[#141a2c] to-[#10141f] p-0 font-body shadow-2xl"
      >
        <DialogHeader className="relative flex-row items-center justify-between gap-3 space-y-0 overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#3a1512]/70 via-[#BC231A]/10 to-transparent px-5 py-5 text-left backdrop-blur-sm">
          <div className="pointer-events-none absolute -right-6 -top-10 h-32 w-32 rounded-full bg-[#BC231A] opacity-20 blur-2xl" />
          <div className="relative flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
              <Calculator className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-sm font-semibold leading-snug text-white">
                Calculadora de Honorários
              </DialogTitle>
              <DialogDescription className="text-xs text-white/60">
                Tabela OAB-MA 2026 — itens com percentual mínimo
              </DialogDescription>
            </div>
          </div>
          <DialogClose
            aria-label="Fechar"
            className="relative shrink-0 rounded-full p-1.5 text-white/80 opacity-80 transition-opacity hover:bg-white/10 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>

        <div className="space-y-4 bg-background px-6 pt-5">
          <Alert className="border-primary/20 bg-primary/5 p-5">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-xs leading-relaxed text-muted-foreground">
              Esta calculadora lista apenas atividades com percentual mínimo. Itens de valor fixo
              (sem %) não têm cálculo — para esses, use a busca da tabela. O resultado segue o
              Art. 3º: paga o maior entre % × valor base e o valor mínimo.
            </AlertDescription>
          </Alert>

          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
              placeholder="Buscar atividade — ex: 'cível', 'inventário'..."
              aria-label="Buscar atividade calculável"
              className="h-12 rounded-full border-2 border-foreground/10 pl-11 text-sm shadow-sm transition-colors focus-visible:border-primary/50 focus-visible:ring-0"
            />
          </div>

          <p className="pb-1 text-xs text-muted-foreground">
            {itensFiltrados.length} de {itensCalculaveis.length} atividades calculáveis na Tabela
            2026.
          </p>
        </div>

        <ScrollArea className="min-h-0 flex-1 bg-background px-3 pb-3">
          {itensFiltrados.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              Nenhuma atividade encontrada para "{termo}".
            </p>
          ) : (
            <ul className="divide-y divide-border/40">
              {itensFiltrados.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => selecionar(item)}
                    className="grid w-full grid-cols-1 items-center gap-2 rounded-lg px-4 py-5 text-left transition-colors hover:bg-muted/60 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] text-muted-foreground">{item.id}</p>
                      <p className="truncate text-sm font-bold text-foreground">{item.descricao}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.area}</p>
                    </div>
                    <div className="shrink-0 text-left sm:text-right">
                      <p className="text-lg font-bold tabular-nums text-primary">
                        {item.percentual_minimo}%
                      </p>
                      {item.valor_minimo != null ? (
                        <p className="text-sm font-semibold tabular-nums text-muted-foreground">
                          {formatarMoeda(item.valor_minimo)}
                        </p>
                      ) : (
                        <p className="text-xs italic text-muted-foreground">sem piso definido</p>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CalculadoraModal;
