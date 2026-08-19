import { useState } from "react";
import { Check, Copy, FileText, Info } from "lucide-react";
import { AVISO_TABELA, type ItemTabela } from "@/data/tabelaHonorarios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatarMoeda } from "./format";
import { copiarTexto } from "@/lib/copiar";

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

  const temResultado = Boolean(resultado && item);
  const semPiso = item ? item.valor_minimo == null : false;

  const clausula =
    resultado && item
      ? `Os honorários advocatícios ficam fixados em ${formatarMoeda(resultado.resultado)}, conforme item ${item.id} da Tabela de Honorários Mínimos OAB-MA 2026.`
      : "";

  const copiarClausula = async () => {
    if (!clausula) return;
    const ok = await copiarTexto(clausula);
    if (ok) {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
    // se falhar mesmo com o fallback, sem tratamento visual aqui — não é crítico
  };

  // O Aviso Legal (AVISO_TABELA) fica sempre visível na base do componente, mesmo antes de
  // haver um resultado calculado — só o card de valor/fundamentação acima dele é condicional.
  return (
    <div className="space-y-4">
      {temResultado && resultado && item && (
        <Card className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/40 shadow-2xl backdrop-blur-xl">
          <div className="pointer-events-none absolute -left-10 -top-12 h-36 w-36 rounded-full bg-[#BC231A]/15 blur-2xl" />
          <CardHeader className="relative flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="font-heading text-xl text-primary">Valor de Honorários</CardTitle>
              <CardDescription className="font-body">
                {item.area} — {item.descricao}
              </CardDescription>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              {ehValorOficial(item) ? (
                <Badge className="border-transparent bg-primary text-primary-foreground">Oficial</Badge>
              ) : (
                <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
                  Consulta
                </Badge>
              )}
              {semPiso && (
                <Badge
                  variant="outline"
                  className="border-white/40 bg-white/60 text-[10px] font-normal text-muted-foreground"
                >
                  Sem piso definido
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="relative space-y-5 font-body">
            <p className="text-center font-heading text-5xl font-black tabular-nums text-primary">
              {formatarMoeda(resultado.resultado)}
            </p>

            {/* Fundamentação em card branco sólido — contraste proposital contra o vidro
                translúcido ao redor. */}
            <div className="space-y-1 rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-primary">Fundamentação</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{resultado.explicacao}</p>
            </div>

            <div className="space-y-2 rounded-2xl border border-white/30 bg-white/50 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-primary">
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
          </CardContent>
        </Card>
      )}

      <div className="flex items-start gap-2 rounded-2xl border-l-4 border-primary bg-muted/40 p-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-xs leading-relaxed text-muted-foreground">{AVISO_TABELA}</p>
      </div>
    </div>
  );
};

export default ResultadoCalculo;
