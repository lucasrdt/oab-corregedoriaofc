import { useState } from "react";
import { Check, Copy, FileText, Info } from "lucide-react";
import { AVISO_TABELA, type ItemTabela } from "@/data/tabelaHonorarios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatarMoeda } from "./format";

interface ResultadoCalculoProps {
  resultado: { resultado: number; explicacao: string } | null;
  item: ItemTabela | null;
}

// "Oficial": valor fixo ou com piso definido na Tabela. "Consulta": percentual puro,
// sem piso — o valor final varia conforme o caso e depende de análise específica.
const ehValorOficial = (item: ItemTabela) =>
  item.tipo !== "percentual" || Boolean(item.situacoes?.length) || item.valor_minimo != null;

const ResultadoCalculo = ({ resultado, item }: ResultadoCalculoProps) => {
  const [copiado, setCopiado] = useState(false);

  // A calculadora é reativa (CalculadoraForm já mostra "Valor mínimo da Tabela" como base
  // enquanto o usuário não digita) — sem resultado ainda, não há mais nada útil a exibir
  // aqui, então não ocupamos espaço com um placeholder de instrução desatualizado.
  if (!resultado || !item) {
    return null;
  }

  const clausula = `Os honorários advocatícios ficam fixados em ${formatarMoeda(resultado.resultado)}, conforme item ${item.id} da Tabela de Honorários Mínimos OAB-MA 2026.`;

  const copiarClausula = async () => {
    try {
      await navigator.clipboard.writeText(clausula);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // clipboard indisponível (ex: contexto não seguro) — sem tratamento visual, não é crítico
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="font-heading text-xl text-primary">Valor de Honorários</CardTitle>
          <CardDescription className="font-body">
            {item.area} — {item.descricao}
          </CardDescription>
        </div>
        {ehValorOficial(item) ? (
          <Badge className="shrink-0 border-transparent bg-primary text-primary-foreground">Oficial</Badge>
        ) : (
          <Badge variant="outline" className="shrink-0 border-amber-300 bg-amber-50 text-amber-700">
            Consulta
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-5 font-body">
        <p className="text-4xl font-bold tabular-nums text-primary">{formatarMoeda(resultado.resultado)}</p>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Fundamentação</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{resultado.explicacao}</p>
        </div>

        <div className="space-y-2 rounded-lg border border-border/50 bg-muted/20 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <FileText className="h-3.5 w-3.5" />
              Cláusula contratual
            </p>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={copiarClausula}
              className="h-7 gap-1.5 px-2 text-xs"
            >
              {copiado ? (
                <>
                  <Check className="h-3 w-3" /> Copiado
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Copiar
                </>
              )}
            </Button>
          </div>
          <p className="font-serif text-sm italic leading-relaxed text-muted-foreground">"{clausula}"</p>
        </div>

        <div className="flex items-start gap-2 rounded-lg border-l-4 border-primary bg-muted/40 p-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-xs leading-relaxed text-muted-foreground">{AVISO_TABELA}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultadoCalculo;
