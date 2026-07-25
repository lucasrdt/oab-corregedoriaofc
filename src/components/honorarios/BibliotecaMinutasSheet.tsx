import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  FileCheck2,
  FileSignature,
  FileText,
  FileX2,
  Info,
  Loader2,
  Repeat,
  Sparkles,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdvogadoAuth } from "@/contexts/AdvogadoAuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { modelosMinutas, type ModeloMinuta, type CampoMinuta } from "@/data/minutasModelos";
import { gerarDocxBlob, baixarBlob } from "@/lib/minutas/docx";

const DISCLAIMER_MINUTA = "Este modelo é de referência e deve ser revisado pelo advogado antes do uso.";

// Biblioteca (galeria) mostra só os modelos de atuação processual/contratual — os dois
// modelos de categoria "Financeiro" (recibo, prestação de contas) ficam fora deste
// gerador de minutas por enquanto.
const modelosBiblioteca = modelosMinutas.filter((m) => m.categoria !== "Financeiro");

const ICONE_CATEGORIA: Record<ModeloMinuta["categoria"], typeof FileSignature> = {
  Procuração: FileSignature,
  Substabelecimento: Repeat,
  Renúncia: FileX2,
  Contrato: FileText,
  Termo: FileCheck2,
  Financeiro: FileText,
};

// "Regra de ouro": identidade do advogado logado nunca é perguntada à IA — vem direto do
// AdvogadoAuthContext. UF fixa "MA" porque este portal é exclusivo da OAB-MA.
const CAMPOS_ADVOGADO_NOME = new Set(["advogado_nome", "advogado_nome_sociedade"]);
const CAMPOS_ADVOGADO_OAB_NUMERO = new Set(["advogado_oab_numero"]);
const CAMPOS_ADVOGADO_OAB_UF = new Set(["advogado_oab_uf"]);

const formatarDataHoje = () => {
  const hoje = new Date();
  const dd = String(hoje.getDate()).padStart(2, "0");
  const mm = String(hoje.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${hoje.getFullYear()}`;
};

type Etapa = "galeria" | "descricao" | "formulario" | "preview";
type ValoresCampos = Record<string, string | number>;

interface BibliotecaMinutasSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CampoInputProps {
  campo: CampoMinuta;
  valor: string;
  atencao: boolean;
  erro: boolean;
  onChange: (valor: string) => void;
}

const CampoInput = ({ campo, valor, atencao, erro, onChange }: CampoInputProps) => {
  const classeDestaque = erro
    ? "border-destructive focus-visible:ring-destructive"
    : atencao
      ? "border-amber-400 bg-amber-50/60 focus-visible:ring-amber-400"
      : "";

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={`campo-${campo.id}`} className="text-xs font-semibold text-foreground">
          {campo.label}
          {campo.obrigatorio && <span className="text-destructive"> *</span>}
        </Label>
        {atencao && (
          <Badge
            variant="outline"
            className="shrink-0 border-amber-300 bg-amber-50 text-[10px] text-amber-700"
          >
            IA não identificou
          </Badge>
        )}
      </div>

      {campo.tipo === "textarea" ? (
        <Textarea
          id={`campo-${campo.id}`}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={cn("mt-1.5", classeDestaque)}
        />
      ) : campo.tipo === "selecao" ? (
        <Select value={valor || undefined} onValueChange={onChange}>
          <SelectTrigger id={`campo-${campo.id}`} className={cn("mt-1.5", classeDestaque)}>
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            {campo.opcoes?.map((op) => (
              <SelectItem key={op} value={op}>
                {op}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={`campo-${campo.id}`}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          type={campo.tipo === "numero" ? "number" : "text"}
          placeholder={
            campo.tipo === "data"
              ? "DD/MM/AAAA"
              : campo.tipo === "moeda"
                ? "R$ 0,00"
                : campo.tipo === "percentual"
                  ? "%"
                  : undefined
          }
          className={cn("mt-1.5", classeDestaque)}
        />
      )}

      {campo.ajuda && <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{campo.ajuda}</p>}
    </div>
  );
};

const BibliotecaMinutasSheet = ({ open, onOpenChange }: BibliotecaMinutasSheetProps) => {
  const { session, advogado } = useAdvogadoAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [etapa, setEtapa] = useState<Etapa>("galeria");
  const [modelo, setModelo] = useState<ModeloMinuta | null>(null);
  const [descricaoCaso, setDescricaoCaso] = useState("");
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [campos, setCampos] = useState<ValoresCampos>({});
  const [naoIdentificados, setNaoIdentificados] = useState<Set<string>>(new Set());
  const [camposComErro, setCamposComErro] = useState<Set<string>>(new Set());
  const [gerandoDocx, setGerandoDocx] = useState(false);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (open) return;
    // Reseta depois da animação de saída (300ms), pra não "piscar" a galeria por trás do
    // conteúdo anterior enquanto o painel ainda está deslizando pra fora.
    const t = setTimeout(() => {
      setEtapa("galeria");
      setModelo(null);
      setDescricaoCaso("");
      setCampos({});
      setNaoIdentificados(new Set());
      setCamposComErro(new Set());
    }, 300);
    return () => clearTimeout(t);
  }, [open]);

  const selecionarModelo = (modeloEscolhido: ModeloMinuta) => {
    const preenchidos: ValoresCampos = {};
    for (const campo of modeloEscolhido.campos) {
      if (CAMPOS_ADVOGADO_NOME.has(campo.id) && advogado?.nome) {
        preenchidos[campo.id] = advogado.nome;
      } else if (CAMPOS_ADVOGADO_OAB_NUMERO.has(campo.id) && advogado?.oab) {
        preenchidos[campo.id] = advogado.oab;
      } else if (CAMPOS_ADVOGADO_OAB_UF.has(campo.id)) {
        preenchidos[campo.id] = "MA";
      } else if (campo.tipo === "data") {
        preenchidos[campo.id] = formatarDataHoje();
      }
    }
    setModelo(modeloEscolhido);
    setCampos(preenchidos);
    setNaoIdentificados(new Set());
    setCamposComErro(new Set());
    setDescricaoCaso("");
    setEtapa("descricao");
  };

  const gerarComIA = async () => {
    if (!modelo) return;
    if (!descricaoCaso.trim()) {
      toast({ title: "Descreva o caso", description: "Escreva um breve resumo antes de gerar com IA." });
      return;
    }
    if (!session || !advogado) {
      toast({
        title: "Login necessário",
        description: "Faça login como advogado para usar o gerador de minutas com IA.",
      });
      onOpenChange(false);
      navigate("/honorarios/login");
      return;
    }

    // Regra de ouro: nome/OAB do advogado já vieram do AdvogadoAuthContext — só os demais
    // campos vão para a IA tentar extrair da descrição livre.
    const camposFaltantes = modelo.campos
      .filter(
        (c) =>
          !CAMPOS_ADVOGADO_NOME.has(c.id) &&
          !CAMPOS_ADVOGADO_OAB_NUMERO.has(c.id) &&
          !CAMPOS_ADVOGADO_OAB_UF.has(c.id),
      )
      .map((c) => c.id);

    setCarregandoIA(true);
    try {
      const { data, error } = await supabase.functions.invoke("claude-minutas", {
        body: { modeloId: modelo.id, descricao: descricaoCaso, camposFaltantes },
      });

      if (error || data?.error) {
        throw new Error(data?.error || error?.message || "Erro desconhecido ao consultar a IA.");
      }

      setCampos((prev) => ({ ...prev, ...(data.campos ?? {}) }));
      setNaoIdentificados(new Set(data.naoIdentificados ?? []));
      setEtapa("formulario");
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Tente novamente em instantes.";
      toast({ title: "Não foi possível gerar com IA", description: mensagem, variant: "destructive" });
    } finally {
      setCarregandoIA(false);
    }
  };

  const pularParaFormulario = () => {
    if (!modelo) return;
    setNaoIdentificados(new Set());
    setEtapa("formulario");
  };

  const atualizarCampo = (id: string, valor: string) => {
    setCampos((prev) => ({ ...prev, [id]: valor }));
    setNaoIdentificados((prev) => {
      if (!prev.has(id)) return prev;
      const novo = new Set(prev);
      novo.delete(id);
      return novo;
    });
    setCamposComErro((prev) => {
      if (!prev.has(id)) return prev;
      const novo = new Set(prev);
      novo.delete(id);
      return novo;
    });
  };

  const irParaPreview = () => {
    if (!modelo) return;
    const faltando = modelo.campos.filter((c) => c.obrigatorio && !String(campos[c.id] ?? "").trim());
    if (faltando.length > 0) {
      setCamposComErro(new Set(faltando.map((c) => c.id)));
      toast({
        title: "Campos obrigatórios pendentes",
        description: "Preencha os campos destacados antes de continuar.",
        variant: "destructive",
      });
      return;
    }
    setCamposComErro(new Set());
    setEtapa("preview");
  };

  const voltar = () => {
    if (etapa === "descricao") setEtapa("galeria");
    else if (etapa === "formulario") setEtapa("descricao");
    else if (etapa === "preview") setEtapa("formulario");
  };

  const textoPreview = useMemo(() => {
    if (!modelo) return "";
    const linhas = modelo.campos
      .map((c) => {
        const valor = campos[c.id];
        if (valor === undefined || valor === null || String(valor).trim() === "") return null;
        return `${c.label}: ${valor}`;
      })
      .filter((linha): linha is string => Boolean(linha));
    return [modelo.nome.toUpperCase(), "", ...linhas, "", DISCLAIMER_MINUTA].join("\n");
  }, [modelo, campos]);

  const copiarPreview = async () => {
    try {
      await navigator.clipboard.writeText(textoPreview);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      toast({
        title: "Não foi possível copiar",
        description: "Copie o texto manualmente.",
        variant: "destructive",
      });
    }
  };

  const baixarDocx = async () => {
    if (!modelo) return;
    setGerandoDocx(true);
    try {
      const blob = await gerarDocxBlob(modelo.arquivoTemplate, campos);
      baixarBlob(blob, `${modelo.id}.docx`);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Tente novamente em instantes.";
      toast({ title: "Não foi possível gerar o .docx", description: mensagem, variant: "destructive" });
    } finally {
      setGerandoDocx(false);
    }
  };

  const tituloHeader = etapa === "galeria" ? "Biblioteca de Minutas" : modelo?.nome;
  const descricaoHeader =
    etapa === "galeria" ? "9 modelos estruturados · preenchimento com IA" : modelo?.categoria;

  return (
    <SheetPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <SheetPrimitive.Portal>
        <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <SheetPrimitive.Content className="fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col border-l border-border/60 bg-background shadow-2xl outline-none transition ease-in-out data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-2xl">
          <div className="relative flex shrink-0 items-start justify-between gap-3 overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#1A2238] via-[#141a2c] to-[#10141f] px-6 py-5">
            <div className="pointer-events-none absolute -right-8 -top-14 h-40 w-40 rounded-full bg-[#BC231A] opacity-20 blur-2xl" />
            <div className="relative flex min-w-0 items-center gap-3">
              {etapa !== "galeria" && (
                <button
                  type="button"
                  onClick={voltar}
                  aria-label="Voltar"
                  className="shrink-0 rounded-full p-1.5 text-white/80 opacity-80 transition-opacity hover:bg-white/10 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <div className="min-w-0">
                <SheetPrimitive.Title className="truncate font-heading text-lg font-bold leading-snug text-white">
                  {tituloHeader}
                </SheetPrimitive.Title>
                <SheetPrimitive.Description className="truncate text-xs text-white/60">
                  {descricaoHeader}
                </SheetPrimitive.Description>
              </div>
            </div>
            <SheetPrimitive.Close
              aria-label="Fechar"
              className="relative shrink-0 rounded-full p-1.5 text-white/80 opacity-80 transition-opacity hover:bg-white/10 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <X className="h-4 w-4" />
            </SheetPrimitive.Close>
          </div>

          {etapa === "galeria" && (
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {modelosBiblioteca.map((m) => {
                  const Icone = ICONE_CATEGORIA[m.categoria];
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => selecionarModelo(m)}
                      className="flex flex-col items-start gap-2 rounded-xl border border-border/50 bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#BC231A]/40 hover:shadow-md"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <Icone className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-heading text-sm font-bold leading-snug text-foreground">{m.nome}</p>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {m.descricao}
                        </p>
                      </div>
                      <Badge variant="outline" className="mt-1 shrink-0 text-[10px]">
                        {m.categoria}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {etapa === "descricao" && modelo && (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="space-y-4 font-body">
                  <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                    <p className="text-xs leading-relaxed text-muted-foreground">{modelo.descricao}</p>
                  </div>

                  <div>
                    <Label
                      htmlFor="descricao-caso"
                      className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      Descreva o caso em linguagem natural
                    </Label>
                    <Textarea
                      id="descricao-caso"
                      autoFocus
                      value={descricaoCaso}
                      onChange={(e) => setDescricaoCaso(e.target.value)}
                      placeholder="Ex: Cliente Maria Silva, CPF 000.000.000-00, solteira, contadora... ação de divórcio consensual, pagamento à vista via PIX, foro em São Luís/MA."
                      rows={8}
                      className="mt-1.5"
                    />
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      A IA extrai o que conseguir identificar no texto. Nome e OAB do advogado logado já
                      são preenchidos automaticamente.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-2 border-t border-border/50 px-6 py-4">
                <Button
                  onClick={gerarComIA}
                  disabled={carregandoIA}
                  className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {carregandoIA ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {carregandoIA ? "Gerando com IA..." : "Gerar com IA"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={pularParaFormulario}
                  className="w-full text-xs text-muted-foreground"
                >
                  Pular e preencher manualmente
                </Button>
              </div>
            </>
          )}

          {etapa === "formulario" && modelo && (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="space-y-4 font-body">
                  {naoIdentificados.size > 0 && (
                    <div className="flex items-start gap-2 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-3">
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                      <p className="text-xs leading-relaxed text-amber-800">
                        A IA não conseguiu identificar{" "}
                        {naoIdentificados.size === 1 ? "1 campo" : `${naoIdentificados.size} campos`} na
                        descrição — preencha manualmente os destacados abaixo.
                      </p>
                    </div>
                  )}
                  {modelo.campos.map((campo) => (
                    <CampoInput
                      key={campo.id}
                      campo={campo}
                      valor={campos[campo.id] != null ? String(campos[campo.id]) : ""}
                      atencao={naoIdentificados.has(campo.id) && !String(campos[campo.id] ?? "").trim()}
                      erro={camposComErro.has(campo.id)}
                      onChange={(v) => atualizarCampo(campo.id, v)}
                    />
                  ))}
                </div>
              </div>
              <div className="shrink-0 border-t border-border/50 px-6 py-4">
                <Button
                  onClick={irParaPreview}
                  className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Pré-visualizar minuta
                </Button>
              </div>
            </>
          )}

          {etapa === "preview" && modelo && (
            <>
              <div className="flex-1 overflow-y-auto bg-muted/30 px-6 py-5">
                <div className="mx-auto max-w-lg overflow-hidden rounded-xl border border-border/60 bg-white shadow-sm">
                  <div className="bg-gradient-to-r from-[#1A2238] to-[#141a2c] px-5 py-3">
                    <p className="font-heading text-xs font-bold uppercase tracking-wider text-white">
                      {modelo.nome}
                    </p>
                  </div>
                  <div className="space-y-3 px-5 py-5 font-body">
                    {modelo.campos.map((campo) => {
                      const valor = campos[campo.id];
                      if (valor === undefined || valor === null || String(valor).trim() === "") return null;
                      return (
                        <div key={campo.id}>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {campo.label}
                          </p>
                          <p className="text-sm leading-relaxed text-foreground">{String(valor)}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-start gap-2 border-t border-border/50 bg-muted/40 px-5 py-3">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <p className="text-[11px] leading-relaxed text-muted-foreground">{DISCLAIMER_MINUTA}</p>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 gap-2 border-t border-border/50 px-6 py-4">
                <Button type="button" variant="outline" onClick={copiarPreview} className="flex-1 gap-2">
                  {copiado ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiado ? "Copiado" : "Copiar"}
                </Button>
                <Button
                  onClick={baixarDocx}
                  disabled={gerandoDocx}
                  className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {gerandoDocx ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {gerandoDocx ? "Gerando..." : "Baixar .docx"}
                </Button>
              </div>
            </>
          )}
        </SheetPrimitive.Content>
      </SheetPrimitive.Portal>
    </SheetPrimitive.Root>
  );
};

export default BibliotecaMinutasSheet;
