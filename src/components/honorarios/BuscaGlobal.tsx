import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { tabelaHonorarios, type ItemTabela } from "@/data/tabelaHonorarios";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const MAX_RESULTADOS = 12;

interface BuscaGlobalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelecionarItem: (item: ItemTabela) => void;
}

// Busca por código do item, descrição do serviço ou nome da área — combinadas,
// já que buscarPorDescricao() (em tabelaHonorarios.ts) não cobre o código.
const buscarPorCodigoDescricaoOuArea = (termo: string): ItemTabela[] => {
  const lower = termo.toLowerCase();
  return tabelaHonorarios.filter(
    (item) =>
      item.id.toLowerCase().includes(lower) ||
      item.descricao.toLowerCase().includes(lower) ||
      item.area.toLowerCase().includes(lower),
  );
};

const BuscaGlobal = ({ open, onOpenChange, onSelecionarItem }: BuscaGlobalProps) => {
  const [termo, setTermo] = useState("");

  useEffect(() => {
    if (!open) setTermo("");
  }, [open]);

  const resultados = useMemo(
    () =>
      termo.trim().length >= 2
        ? buscarPorCodigoDescricaoOuArea(termo).slice(0, MAX_RESULTADOS)
        : [],
    [termo],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className="flex max-h-[70vh] w-[calc(100vw-2rem)] max-w-xl flex-col gap-0 overflow-hidden rounded-2xl p-0 font-body"
      >
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            autoFocus
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Buscar por código, serviço ou área..."
            className="border-none px-0 shadow-none focus-visible:ring-0"
          />
          <kbd className="hidden shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
            Esc
          </kbd>
        </div>

        <ScrollArea className="max-h-[50vh]">
          {termo.trim().length < 2 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              Digite ao menos 2 letras para buscar.
            </p>
          ) : resultados.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">Nenhum item encontrado.</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {resultados.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onSelecionarItem(item)}
                    className="flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left transition-colors hover:bg-muted/60"
                  >
                    <span className="text-sm font-medium text-foreground">{item.descricao}</span>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {item.area} · item {item.id}
                    </span>
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

export default BuscaGlobal;
