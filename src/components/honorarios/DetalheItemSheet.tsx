import * as SheetPrimitive from "@radix-ui/react-dialog";
import { Printer, Share2, Sparkles, X } from "lucide-react";
import type { ItemTabela } from "@/data/tabelaHonorarios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CalculadoraForm from "@/components/honorarios/CalculadoraForm";
import ResultadoCalculo from "@/components/honorarios/ResultadoCalculo";
import { formatarMoeda } from "@/components/honorarios/format";
import { STATUS_TAG_STYLES_DARK, getStatusTag } from "@/components/honorarios/itemTags";
import { cn } from "@/lib/utils";

type Resultado = { resultado: number; explicacao: string };

interface DetalheItemSheetProps {
  item: ItemTabela | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resultado: Resultado | null;
  itemResultado: ItemTabela | null;
  onCalcular: (resultado: Resultado, item: ItemTabela) => void;
  onLimpar: () => void;
  onPerguntar: () => void;
  onCompartilhar: () => void;
}

// Sheet montado com os primitivos do Radix (em vez do wrapper compartilhado em
// src/components/ui/sheet.tsx) porque precisamos de um overlay com blur customizado e
// largura própria — o wrapper compartilhado não expõe essas opções, e é um arquivo fora
// de /honorarios que não podemos alterar.
const DetalheItemSheet = ({
  item,
  open,
  onOpenChange,
  resultado,
  itemResultado,
  onCalcular,
  onLimpar,
  onPerguntar,
  onCompartilhar,
}: DetalheItemSheetProps) => {
  const precisaInput = item ? Boolean(item.situacoes?.length) || item.requer_valor_causa : false;

  return (
    <SheetPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <SheetPrimitive.Portal>
        <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <SheetPrimitive.Content className="fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col border-l border-border/60 bg-background shadow-2xl outline-none transition ease-in-out data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-[550px]">
          <div className="relative flex items-start justify-between gap-3 overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#1A2238] via-[#141a2c] to-[#10141f] px-6 py-5">
            <div className="pointer-events-none absolute -right-8 -top-14 h-40 w-40 rounded-full bg-[#BC231A] opacity-20 blur-2xl" />
            <div className="relative min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-mono text-xs uppercase tracking-wider text-white/60">
                  {item?.id} · {item?.area}
                </p>
                {item && getStatusTag(item.id) && (
                  <Badge
                    variant="outline"
                    className={cn("shrink-0", STATUS_TAG_STYLES_DARK[getStatusTag(item.id)!])}
                  >
                    {getStatusTag(item.id)}
                  </Badge>
                )}
              </div>
              <SheetPrimitive.Title className="mt-1 font-heading text-lg font-bold leading-snug text-white">
                {item?.descricao}
              </SheetPrimitive.Title>
              <SheetPrimitive.Description className="sr-only">
                Detalhes e cálculo de honorários do item selecionado da Tabela OAB-MA 2026.
              </SheetPrimitive.Description>
            </div>
            <SheetPrimitive.Close
              aria-label="Fechar"
              className="relative shrink-0 rounded-full p-1.5 text-white/80 opacity-80 transition-opacity hover:bg-white/10 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <X className="h-4 w-4" />
            </SheetPrimitive.Close>
          </div>

          {item && (
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="space-y-5 font-body">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border/50 bg-muted/30 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      % Mínimo
                    </p>
                    <p className="mt-1 text-lg font-bold tabular-nums text-primary">
                      {item.tipo === "percentual" && item.percentual_minimo
                        ? `${item.percentual_minimo}%`
                        : "—"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/50 bg-muted/30 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Valor Mínimo
                    </p>
                    <p className="mt-1 text-lg font-bold tabular-nums text-primary">
                      {item.valor_minimo != null ? formatarMoeda(item.valor_minimo) : "—"}
                    </p>
                  </div>
                </div>

                {precisaInput && (
                  <CalculadoraForm key={item.id} item={item} onCalcular={onCalcular} onLimpar={onLimpar} />
                )}

                <ResultadoCalculo resultado={resultado} item={itemResultado} />
              </div>
            </div>
          )}

          {item && (
            <div className="flex flex-col gap-2 border-t border-border/50 px-6 py-4">
              <Button
                onClick={onPerguntar}
                className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Sparkles className="h-4 w-4" />
                Perguntar ao assistente sobre este item
              </Button>
              {resultado && (
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => window.print()} className="flex-1 gap-2">
                    <Printer className="h-4 w-4" />
                    Imprimir
                  </Button>
                  <Button type="button" variant="outline" onClick={onCompartilhar} className="flex-1 gap-2">
                    <Share2 className="h-4 w-4" />
                    Compartilhar
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

export default DetalheItemSheet;
