import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatarMoeda } from "./format";

type Complexidade = "baixa" | "media" | "alta";

const MULTIPLICADOR_COMPLEXIDADE: Record<Complexidade, number> = {
  baixa: 1,
  media: 1.3,
  alta: 1.6,
};

interface ResultadoCustos {
  horaBase: number;
  horaComLucro: number;
  valorFinal: number;
}

const SegmentoTitulo = ({ numero, titulo }: { numero: number; titulo: string }) => (
  <div className="flex items-center gap-2">
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
      {numero}
    </span>
    <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">{titulo}</h3>
  </div>
);

const CalculoCustosForm = () => {
  const [custosFixos, setCustosFixos] = useState("");
  const [horasProdutivas, setHorasProdutivas] = useState("");
  const [margemLucro, setMargemLucro] = useState("");
  const [horasCaso, setHorasCaso] = useState("");
  const [complexidade, setComplexidade] = useState<Complexidade>("media");
  const [resultado, setResultado] = useState<ResultadoCustos | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const horaBasePreview = useMemo(() => {
    const fixos = Number(custosFixos);
    const horasProd = Number(horasProdutivas);
    if (!fixos || fixos <= 0 || !horasProd || horasProd <= 0) return null;
    return fixos / horasProd;
  }, [custosFixos, horasProdutivas]);

  const handleCalcular = () => {
    const horas = Number(horasCaso);

    if (horaBasePreview === null) {
      setErro("Informe os custos fixos mensais e as horas produtivas por mês.");
      setResultado(null);
      return;
    }
    if (!horas || horas <= 0) {
      setErro("Informe a quantidade de horas estimadas para o caso.");
      setResultado(null);
      return;
    }

    setErro(null);
    const margem = Number(margemLucro) || 0;
    const horaComLucro = horaBasePreview * (1 + margem / 100);
    const valorFinal = horaComLucro * horas * MULTIPLICADOR_COMPLEXIDADE[complexidade];

    setResultado({ horaBase: horaBasePreview, horaComLucro, valorFinal });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="font-heading text-xl text-primary">Calculadora de Custos</CardTitle>
          <CardDescription className="font-body">
            Fluxo do Manual de Utilização: custos fixos → hora base → lucro e complexidade. Método
            complementar à Tabela oficial, útil para casos sem parâmetro fixo definido.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 font-body">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <SegmentoTitulo numero={1} titulo="Custos fixos" />
              <div className="space-y-2 pl-8">
                <Label htmlFor="custosFixos">Custos fixos mensais do escritório (R$)</Label>
                <Input
                  id="custosFixos"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  value={custosFixos}
                  onChange={(e) => setCustosFixos(e.target.value)}
                />
              </div>
              <div className="space-y-2 pl-8">
                <Label htmlFor="horasProdutivas">Horas produtivas/faturáveis por mês</Label>
                <Input
                  id="horasProdutivas"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Ex: 120"
                  value={horasProdutivas}
                  onChange={(e) => setHorasProdutivas(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <SegmentoTitulo numero={2} titulo="Hora base" />
              <div className="ml-8 rounded-lg bg-muted/50 px-4 py-3">
                <p className="text-2xl font-bold text-primary">
                  {horaBasePreview !== null ? formatarMoeda(horaBasePreview) : "—"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Calculada automaticamente: custos fixos ÷ horas produtivas
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <SegmentoTitulo numero={3} titulo="Lucro e complexidade" />
            <div className="grid grid-cols-1 gap-4 pl-8 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="margemLucro">Margem de lucro desejada (%)</Label>
                <Input
                  id="margemLucro"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Ex: 30"
                  value={margemLucro}
                  onChange={(e) => setMargemLucro(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horasCaso">Horas estimadas para o caso</Label>
                <Input
                  id="horasCaso"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="Ex: 8"
                  value={horasCaso}
                  onChange={(e) => setHorasCaso(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2 pl-8">
              <Label htmlFor="complexidade">Complexidade do caso</Label>
              <Select value={complexidade} onValueChange={(v) => setComplexidade(v as Complexidade)}>
                <SelectTrigger id="complexidade">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {erro && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {erro}
            </p>
          )}

          <Button
            onClick={handleCalcular}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Calcular
          </Button>
        </CardContent>
      </Card>

      {!resultado ? (
        <Card className="flex min-h-[280px] items-center justify-center border-dashed border-border/50 bg-muted/30">
          <CardContent className="py-10 text-center font-body">
            <p className="max-w-xs text-sm text-muted-foreground">
              Preencha os custos do escritório para estimar sua hora-base e o valor sugerido para o caso.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-heading text-xl text-primary">Estimativa de Honorários</CardTitle>
            <CardDescription className="font-body">
              Cálculo de custos — não é um valor oficial da Tabela OAB-MA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 font-body">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Hora base</span>
              <span className="font-medium text-foreground">{formatarMoeda(resultado.horaBase)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Hora com margem de lucro</span>
              <span className="font-medium text-foreground">{formatarMoeda(resultado.horaComLucro)}</span>
            </div>
            <p className="text-4xl font-bold text-primary">{formatarMoeda(resultado.valorFinal)}</p>

            <div className="flex items-start gap-2 rounded-lg border-l-4 border-secondary bg-muted/40 p-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Estimativa baseada no método de precificação por hora (custos fixos ÷ horas produtivas). Não
                substitui os valores mínimos da Tabela OAB-MA 2026 exibidos na aba "Tabela Oficial".
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalculoCustosForm;
