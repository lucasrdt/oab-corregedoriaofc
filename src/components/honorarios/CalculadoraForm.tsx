import { useEffect, useState } from "react";
import { Calculator } from "lucide-react";
import { calcularHonorario, type ItemTabela } from "@/data/tabelaHonorarios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatarMoeda } from "./format";

interface CalculadoraFormProps {
  item: ItemTabela;
  onCalcular: (resultado: { resultado: number; explicacao: string }, item: ItemTabela) => void;
  onLimpar: () => void;
}

// Sempre usado com um item já escolhido (clique numa linha da tabela, na busca global ou
// na lista de atividades calculáveis) — por isso não tem mais seletor de área/serviço.
// Use `key={item.id}` no componente pai pra resetar situação/valor ao trocar de item.
const CalculadoraForm = ({ item, onCalcular, onLimpar }: CalculadoraFormProps) => {
  const [situacaoIdx, setSituacaoIdx] = useState<string>("");
  const [valorCausa, setValorCausa] = useState("");

  // Reativo: o cálculo dispara sozinho a cada mudança de situação/valor da causa — sem
  // botão "Calcular" e sem estado de espera por clique.
  useEffect(() => {
    if (item.situacoes && item.situacoes.length > 0) {
      if (situacaoIdx === "") {
        onLimpar();
        return;
      }
      onCalcular(calcularHonorario(item, undefined, Number(situacaoIdx)), item);
      return;
    }
    if (item.requer_valor_causa) {
      const valor = Number(valorCausa);
      if (!valor || valor <= 0) {
        onLimpar();
        return;
      }
      onCalcular(calcularHonorario(item, valor), item);
      return;
    }
    onLimpar();
    // onCalcular/onLimpar são recriados a cada render do pai — incluí-los aqui causaria
    // loop de re-render. Só a mudança de item/situação/valor deve disparar o cálculo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, situacaoIdx, valorCausa]);

  const valorCausaNum = Number(valorCausa) || 0;
  const percentual = item.percentual_minimo ?? 0;
  const pisoMinimo = item.valor_minimo ?? 0;
  const temPiso = item.valor_minimo != null;
  const parcial = (valorCausaNum * percentual) / 100;
  const usouPiso = temPiso && parcial < pisoMinimo;
  const honorarioFinal = Math.max(parcial, pisoMinimo);

  return (
    <Card className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/40 shadow-2xl backdrop-blur-xl">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#1D4E89]/20 blur-2xl" />
      <CardContent className="relative space-y-5 p-6 font-body">
        {item.situacoes && item.situacoes.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="situacao" className="text-primary">Situação</Label>
            <Select value={situacaoIdx} onValueChange={setSituacaoIdx}>
              <SelectTrigger id="situacao" className="border-white/40 bg-white/60">
                <SelectValue placeholder="Selecione a situação" />
              </SelectTrigger>
              <SelectContent>
                {item.situacoes.map((s, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {s.situacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {item.requer_valor_causa && (
          <div className="space-y-3 rounded-2xl border border-white/30 bg-white/50 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                <Calculator className="h-3.5 w-3.5" />
                Calculadora ({percentual}%)
              </p>
              {!temPiso && (
                <Badge
                  variant="outline"
                  className="shrink-0 border-amber-300 bg-amber-50/80 text-[10px] font-medium text-amber-700"
                >
                  Sem piso definido
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorCausa" className="text-primary">Valor base (R$)</Label>
              <Input
                id="valorCausa"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="0,00"
                value={valorCausa}
                onChange={(e) => setValorCausa(e.target.value)}
                className="border-white/40 bg-white/70"
              />
            </div>

            {valorCausaNum > 0 ? (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {percentual}% × {formatarMoeda(valorCausaNum)}
                  </span>
                  <span className="font-medium tabular-nums text-foreground">{formatarMoeda(parcial)}</span>
                </div>
                {temPiso && (
                  <div
                    className={cn(
                      "flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors",
                      usouPiso ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                    )}
                  >
                    <span>Valor mínimo da Tabela</span>
                    <span className="font-medium tabular-nums">{formatarMoeda(pisoMinimo)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-primary/20 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Honorários (Art. 3º)
                  </span>
                  <span className="font-heading text-lg font-black tabular-nums text-primary">
                    {formatarMoeda(honorarioFinal)}
                  </span>
                </div>
                {usouPiso && (
                  <p className="text-[11px] italic text-muted-foreground">
                    Valor mínimo da tabela aplicado conforme Art. 3º.
                  </p>
                )}
              </div>
            ) : (
              temPiso && (
                <div className="flex items-center justify-between pt-1 text-sm text-muted-foreground">
                  <span>Valor mínimo da Tabela</span>
                  <span className="font-medium tabular-nums text-foreground">{formatarMoeda(pisoMinimo)}</span>
                </div>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalculadoraForm;
