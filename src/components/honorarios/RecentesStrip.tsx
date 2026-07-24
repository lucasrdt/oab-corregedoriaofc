import { History } from "lucide-react";
import type { ItemTabela } from "@/data/tabelaHonorarios";
import { getAreaIcon } from "./areaIcons";

interface RecentesStripProps {
  itens: ItemTabela[];
  onSelecionar: (item: ItemTabela) => void;
}

// Só renderiza quando há histórico — sem placeholder vazio, sem "nada por aqui ainda":
// é um atalho de conveniência, não uma seção que precisa de estado vazio próprio.
const RecentesStrip = ({ itens, onSelecionar }: RecentesStripProps) => {
  if (itens.length === 0) return null;

  return (
    <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
      <span className="inline-flex shrink-0 items-center gap-1.5 font-body text-xs font-medium text-muted-foreground">
        <History className="h-3.5 w-3.5" />
        Recentes
      </span>
      {itens.map((item) => {
        const Icone = getAreaIcon(item.area);
        return (
          <button
            key={item.id}
            onClick={() => onSelecionar(item)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/50 bg-card px-3 py-1.5 font-body text-xs text-foreground transition-colors hover:border-[#BC231A]/40 hover:bg-muted"
          >
            <Icone className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
            <span className="max-w-[10rem] truncate">{item.descricao}</span>
          </button>
        );
      })}
    </div>
  );
};

export default RecentesStrip;
