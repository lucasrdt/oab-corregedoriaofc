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
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import * as mammoth from "mammoth";
import html2pdf from "html2pdf.js";
import { supabase } from "@/lib/supabase";
import { useAdvogadoAuth } from "@/contexts/AdvogadoAuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  modelosMinutas,
  checklistSegurancaJuridica,
  type ModeloMinuta,
  type CampoMinuta,
} from "@/data/minutasModelos";
import { gerarDocxBlob, baixarBlob, DISCLAIMER_MINUTA, MIME_DOCX } from "@/lib/minutas/docx";

// Galeria mostra os 11 modelos oficiais, incluindo os dois de categoria "Financeiro"
// (recibo de honorários e termo de prestação de contas).
const modelosBiblioteca = modelosMinutas;

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
  const [copiado, setCopiado] = useState(false);
  const [gerandoPreview, setGerandoPreview] = useState(false);
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [docxBlob, setDocxBlob] = useState<Blob | null>(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const [checklistMarcado, setChecklistMarcado] = useState<Set<number>>(new Set());

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
      setDocxBlob(null);
      setPreviewHtml("");
      setChecklistMarcado(new Set());
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

  const irParaPreview = async () => {
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

    // Gera o .docx preenchido e converte pra HTML aqui, uma única vez — o mesmo blob é
    // reaproveitado pelo botão "Baixar .docx", sem reprocessar nada.
    // `campos` é só o estado dos campos do modelo (nome, CPF, valores etc.) — o estado do
    // checklist (`checklistMarcado`) é um Set<number> completamente separado e nunca é
    // lido aqui, então não há como o checklist chegar ao docxtemplater.
    setGerandoPreview(true);
    try {
      const blob = await gerarDocxBlob(modelo.arquivoTemplate, campos);
      const arrayBuffer = await blob.arrayBuffer();
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
      setDocxBlob(blob);
      setPreviewHtml(html);
      setChecklistMarcado(new Set());
      setEtapa("preview");
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Tente novamente em instantes.";
      toast({ title: "Não foi possível gerar a prévia", description: mensagem, variant: "destructive" });
    } finally {
      setGerandoPreview(false);
    }
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

  const alternarChecklistItem = (indice: number) => {
    setChecklistMarcado((prev) => {
      const novo = new Set(prev);
      if (novo.has(indice)) novo.delete(indice);
      else novo.add(indice);
      return novo;
    });
  };

  const checklistCompleto = checklistMarcado.size === checklistSegurancaJuridica.length;

  const baixarDocx = () => {
    if (!modelo || !docxBlob) return;
    baixarBlob(docxBlob, `${modelo.id}.docx`, MIME_DOCX);
  };

  const baixarPdf = async () => {
    if (!modelo) return;
    // Fonte é sempre o DOM de #documento-conteudo-final, não a variável `previewHtml` —
    // assim, mesmo que a árvore ao redor mude no futuro, é fisicamente impossível o
    // checklist (que vive fora dessa div) entrar no PDF.
    const origemDocumento = document.getElementById("documento-conteudo-final");
    if (!origemDocumento) return;

    // Anexa o aviso legal como filho REAL, temporário, da própria div já renderizada na
    // tela — e captura essa div ao vivo. html2canvas produz página em branco quando o
    // alvo é um clone desanexado do DOM posicionado fora da tela (ex.: left:-9999px);
    // capturando o elemento visível de verdade, o problema desaparece.
    const avisoTemporario = document.createElement("p");
    avisoTemporario.setAttribute("data-pdf-only", "true");
    avisoTemporario.style.marginTop = "24px";
    avisoTemporario.style.paddingTop = "12px";
    avisoTemporario.style.borderTop = "1px solid #ccc";
    avisoTemporario.style.fontSize = "11px";
    avisoTemporario.style.fontStyle = "italic";
    avisoTemporario.style.color = "#555";
    avisoTemporario.textContent = DISCLAIMER_MINUTA;
    origemDocumento.appendChild(avisoTemporario);

    setGerandoPdf(true);
    try {
      const nomeArquivo = `${modelo.nome.replace(/[\\/:*?"<>|]+/g, "-")}.pdf`;
      await html2pdf()
        .set({
          margin: 20,
          filename: nomeArquivo,
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          // `pagebreak` existe de verdade em runtime (node_modules/html2pdf.js/dist/
          // html2pdf.js, plugin/pagebreaks.js) mas o .d.ts empacotado pela lib não
          // declara essa opção — daí o `as unknown as` só nesta chamada. Sem isso, o
          // html2pdf fatia a imagem renderizada por altura de página sem saber onde os
          // parágrafos terminam, cortando no meio da linha quando o corte cai em cima de
          // um <p>. "avoid-all" empurra qualquer elemento que ficaria cortado (e couber
          // inteiro numa página) pro início da página seguinte.
          pagebreak: { mode: ["avoid-all"] },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
        .from(origemDocumento)
        .save();
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Tente novamente em instantes.";
      toast({ title: "Não foi possível gerar o PDF", description: mensagem, variant: "destructive" });
    } finally {
      origemDocumento.removeChild(avisoTemporario);
      setGerandoPdf(false);
    }
  };

  const tituloHeader = etapa === "galeria" ? "Biblioteca de Minutas" : modelo?.nome;
  const descricaoHeader =
    etapa === "galeria" ? "11 modelos estruturados · preenchimento com IA" : modelo?.categoria;

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
                      className="mt-1.5 border-white/40 bg-white/30 backdrop-blur-md"
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
                  disabled={gerandoPreview}
                  className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {gerandoPreview ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {gerandoPreview ? "Gerando prévia..." : "Pré-visualizar minuta"}
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
                  {/* Prévia real do .docx preenchido: o blob gerado em irParaPreview() passa
                      pelo mammoth.convertToHtml() e o HTML resultante é renderizado aqui com
                      classes `prose`, simulando a formatação de um documento oficial.
                      id="documento-conteudo-final" é o limite exato do que sai no PDF —
                      baixarPdf() lê só esta div (via getElementById), nunca o checklist
                      abaixo, mesmo que a estrutura ao redor mude no futuro. */}
                  <div
                    id="documento-conteudo-final"
                    className="prose prose-sm max-w-none px-5 py-5 font-body prose-headings:font-heading prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                </div>

                {/* Módulo 12 — Checklist Final (Anexos Práticos do Módulo 2, Corregedoria
                    OAB-MA): confirmação obrigatória de segurança jurídica antes do download.
                    Vive fora de #documento-conteudo-final e nunca é lido por gerarDocxBlob
                    (que só recebe `campos`, o estado dos campos do modelo) nem por baixarPdf
                    (que só captura a div acima) — é malha fina só da interface, nunca do
                    arquivo entregue ao cliente. */}
                <div className="mx-auto mt-4 max-w-lg rounded-xl border border-l-4 border-border/60 border-l-[#1D4E89] bg-[#1D4E89]/[0.04] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-[#1D4E89]" />
                    <p className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                      Checklist de Segurança Jurídica — antes de colher assinatura
                    </p>
                  </div>
                  <ul className="space-y-3">
                    {checklistSegurancaJuridica.map((item, indice) => (
                      <li key={indice} className="flex items-start gap-2.5">
                        <Checkbox
                          id={`checklist-${indice}`}
                          checked={checklistMarcado.has(indice)}
                          onCheckedChange={() => alternarChecklistItem(indice)}
                          className="mt-0.5"
                        />
                        <Label
                          htmlFor={`checklist-${indice}`}
                          className="text-xs font-normal leading-relaxed text-foreground"
                        >
                          {item}
                        </Label>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[10px] italic leading-relaxed text-muted-foreground">
                    Uso interno — este checklist não é impresso nem incluído no .docx ou PDF baixado.
                  </p>
                </div>
              </div>

              {/* Aviso legal fixo na base da visualização — fora da área rolável, sempre
                  visível independentemente do tamanho do documento renderizado acima. */}
              <div className="flex shrink-0 items-start gap-2 border-t border-border/50 bg-muted/40 px-6 py-3">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <p className="text-[11px] leading-relaxed text-muted-foreground">{DISCLAIMER_MINUTA}</p>
              </div>

              <div className="flex shrink-0 flex-col gap-2 border-t border-border/50 px-6 py-4">
                {!checklistCompleto && (
                  <p className="text-center text-[11px] text-amber-600">
                    Confirme todos os itens do checklist para liberar o download.
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={copiarPreview}
                    className="flex-1 gap-2 basis-full sm:basis-auto"
                  >
                    {copiado ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiado ? "Copiado" : "Copiar"}
                  </Button>
                  <Button
                    onClick={baixarPdf}
                    disabled={!previewHtml || gerandoPdf || !checklistCompleto}
                    variant="outline"
                    className="flex-1 gap-2"
                  >
                    {gerandoPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    {gerandoPdf ? "Gerando..." : "Baixar PDF"}
                  </Button>
                  <Button
                    onClick={baixarDocx}
                    disabled={!docxBlob || !checklistCompleto}
                    className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Download className="h-4 w-4" />
                    Baixar .docx
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetPrimitive.Content>
      </SheetPrimitive.Portal>
    </SheetPrimitive.Root>
  );
};

export default BibliotecaMinutasSheet;
