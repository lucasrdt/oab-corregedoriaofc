import { useEffect, useMemo, useState } from "react";
import { tabelaHonorarios, type ItemTabela } from "@/data/tabelaHonorarios";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

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

// shouldFilter={false} porque a filtragem já é feita "na mão" (buscarPorCodigoDescricaoOuArea,
// com corte em MAX_RESULTADOS) — o matcher fuzzy padrão do cmdk rodaria em cima dos 970 itens
// a cada tecla à toa, já que só renderizamos os resultados que nós mesmos selecionamos.
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
    // Dialog + Command montados na mão (em vez do CommandDialog de ui/command.tsx) porque
    // precisamos de shouldFilter={false} no Command — a filtragem já é feita acima — e
    // CommandDialog não expõe essa prop; é um wrapper compartilhado com o resto do site
    // que o módulo /honorarios não pode alterar.
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-2xl p-0 shadow-2xl">
        <Command shouldFilter={false} className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3">
          <CommandInput
            value={termo}
            onValueChange={setTermo}
            placeholder="Buscar por código, serviço ou área..."
          />
          <CommandList className="max-h-[60vh]">
            {termo.trim().length < 2 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                Digite ao menos 2 letras para buscar.
              </p>
            ) : (
              <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
            )}

            {resultados.length > 0 && (
              <CommandGroup
                heading={`${resultados.length} resultado${resultados.length > 1 ? "s" : ""}`}
              >
                {resultados.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => onSelecionarItem(item)}
                    className="flex flex-col items-start gap-0.5 rounded-lg border-l-2 border-l-transparent data-[selected=true]:border-l-[#BC231A] data-[selected=true]:bg-[#BC231A]/10"
                  >
                    <span className="text-sm font-medium text-foreground">{item.descricao}</span>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {item.area} · item {item.id}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default BuscaGlobal;
