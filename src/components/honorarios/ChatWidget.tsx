import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw, Scale, Send, Sparkles, User, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/lib/supabase";
import { AVISO_TABELA } from "@/data/tabelaHonorarios";
import { useAdvogadoAuth } from "@/contexts/AdvogadoAuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGESTOES = [
  "Divórcio consensual",
  "Audiência trabalhista",
  "Inventário R$ 300 mil",
  "Consulta avulsa",
  "Ação cível ordinária",
  "Defesa em processo criminal",
  "Recurso de apelação",
  "Parecer jurídico escrito",
  "Diligência externa",
  "Honorários previdenciários",
];

// Animação de entrada das mensagens, isolada aqui (via <style> inline) em vez de
// tailwind.config.ts / index.css — esses arquivos são compartilhados com o resto do
// site e o módulo /honorarios não pode alterá-los.
const honorariosChatFadeInKeyframes = `
  @keyframes honorarios-chat-fade-in {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .honorarios-chat-fade-in {
    animation: honorarios-chat-fade-in 0.25s ease-out;
  }
`;

interface ChatWidgetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Pergunta já digitada em outro ponto da página (ex: barra de busca do hero) — enviada automaticamente assim que o modal abre. */
  mensagemInicial?: string;
  /** Chamado logo depois de `mensagemInicial` ser enviada, para o pai limpar o valor e não reenviar em aberturas futuras. */
  onMensagemInicialEnviada?: () => void;
}

const ChatWidget = ({
  open: openControlado,
  onOpenChange,
  mensagemInicial,
  onMensagemInicialEnviada,
}: ChatWidgetProps = {}) => {
  const [openInterno, setOpenInterno] = useState(false);
  const open = openControlado ?? openInterno;
  const setOpen = onOpenChange ?? setOpenInterno;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { session, advogado, loading: authLoading } = useAdvogadoAuth();
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    // Ao restaurar a página via bfcache do navegador (ex: fechar a aba com uma pergunta
    // pendente e reabrir/voltar), o React reidrata um snapshot congelado que pode ter
    // `loading: true` de uma requisição que nunca vai resolver — sem isso, o spinner
    // fica travado indefinidamente.
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setLoading(false);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const enviarMensagem = async (textoForcado?: string) => {
    const mensagem = (textoForcado ?? input).trim();
    if (!mensagem || loading) return;
    if (authLoading) return; // sessão do advogado ainda carregando

    if (!session || !advogado) {
      toast({
        title: "Login necessário",
        description: "Faça login como advogado para usar o assistente de IA.",
      });
      navigate("/honorarios/login");
      return;
    }

    // Contrato da Edge Function: o backend acrescenta { role: 'user', content: mensagem }
    // ao histórico — por isso o turno atual não entra em `historico`.
    const historico = messages.map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: mensagem }]);
    setInput("");
    setLoading(true);

    const assistantId = crypto.randomUUID();

    try {
      // Chamada direta (não supabase.functions.invoke) porque a function agora responde
      // em streaming (texto puro incremental) em vez de um JSON único.
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/claude-honorarios`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mensagem, historico }),
        }
      );

      if (!response.ok || !response.body) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error || "Não foi possível consultar a Corregedoria.");
      }

      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let acumulado = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acumulado += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: acumulado } : m))
        );
      }
    } catch (err) {
      const mensagemErro = err instanceof Error ? err.message : "Tente novamente em instantes.";
      toast({
        title: "Não foi possível consultar a Corregedoria",
        description: mensagemErro,
        variant: "destructive",
      });
      setMessages((prev) => {
        const fallback =
          "Não foi possível concluir a consulta agora. Tente novamente em instantes ou procure os canais oficiais da Corregedoria.";
        // Se já criamos a bolha do assistente (erro veio no meio do stream), preenche ela
        // em vez de duplicar; senão, adiciona uma nova.
        if (prev.some((m) => m.id === assistantId)) {
          return prev.map((m) => (m.id === assistantId ? { ...m, content: m.content || fallback } : m));
        }
        return [...prev, { id: crypto.randomUUID(), role: "assistant", content: fallback }];
      });
    } finally {
      setLoading(false);
    }
  };

  const resetarConversa = () => {
    setMessages([]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  useEffect(() => {
    if (open && mensagemInicial?.trim()) {
      enviarMensagem(mensagemInicial);
      onMensagemInicialEnviada?.();
    }
    // Só deve reagir à transição de abertura do modal, não a toda renderização.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* O vão livre entre o FAB de suporte (bottom-6 = 24px, topo em 80px) e o do WhatsApp
          (bottom-40 = 160px) mede 80px. Nosso botão tem 56px (h-14) de altura, sobrando 24px
          de folga — bottom-[5.75rem] (92px) centraliza esse botão no vão, com 12px de vão
          igual acima e abaixo. bottom-24 (96px) deixava 16px em cima e só 8px embaixo,
          visualmente desigual. O tooltip vai pro lado esquerdo (não mais acima do botão) —
          assim nunca invade a faixa vertical do FAB vizinho, não importa o quão apertado
          fique o espaço entre os três botões. */}
      <div className="group fixed bottom-[5.75rem] right-4 z-50 sm:right-6">
        <div className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-border/40 bg-card px-3 py-1.5 font-body text-xs text-foreground opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
          Assistente de honorários
        </div>
        <DialogTrigger asChild>
          <button
            aria-label="Abrir assistente de honorários"
            className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#232d4a] via-[#1A2238] to-[#0A0E1A] text-white shadow-[0_10px_28px_-8px_rgba(10,14,26,0.65)] ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-8px_rgba(188,35,26,0.5)] hover:ring-[#BC231A]/50"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-2.5 top-1.5 h-3.5 rounded-full bg-white/15 blur-[5px]"
            />
            <Scale className="h-6 w-6" />
          </button>
        </DialogTrigger>
        {!open && (
          <span className="pointer-events-none absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#BC231A] opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-[#BC231A] ring-2 ring-white" />
          </span>
        )}
      </div>

      <DialogContent
        hideCloseButton
        style={{ maxWidth: "800px" }}
        className="flex h-[780px] w-[calc(100vw-2rem)] max-h-[90vh] flex-col gap-0 overflow-hidden rounded-2xl border border-border/50 bg-background p-0 font-body shadow-2xl sm:rounded-2xl"
      >
        <style>{honorariosChatFadeInKeyframes}</style>

        <DialogHeader className="relative flex-row items-center justify-between gap-3 space-y-0 bg-primary px-5 py-5 text-left">
          <div className="relative flex min-w-0 flex-1 items-center gap-3">
            <Avatar className="h-9 w-9 shrink-0 bg-white/15 ring-1 ring-white/20">
              <AvatarFallback className="bg-transparent text-white">
                <Scale className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <DialogTitle className="text-sm font-semibold leading-snug text-white">
                Assistente de Honorários da Corregedoria-Geral
              </DialogTitle>
              <DialogDescription className="text-xs text-white/70">OAB-MA</DialogDescription>
            </div>
          </div>
          <div className="relative flex shrink-0 items-center gap-1">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={resetarConversa}
                aria-label="Reiniciar conversa"
                title="Reiniciar conversa"
                className="rounded-full p-1.5 text-white/80 opacity-80 transition-opacity hover:bg-white/10 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
            <DialogClose
              aria-label="Fechar"
              className="rounded-full p-1.5 text-white/80 opacity-80 transition-opacity hover:bg-white/10 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <X className="h-4 w-4" />
            </DialogClose>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-4 py-4">
          {messages.length === 0 && !loading ? (
            <div className="flex h-full min-h-[380px] flex-col items-center justify-center gap-4 px-2 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#BC231A]/15">
                <Sparkles className="h-6 w-6 text-[#BC231A]" />
              </div>
              <div>
                <p className="font-heading text-base font-bold text-primary">Como posso ajudar?</p>
                <p className="mt-1 whitespace-nowrap text-xs text-muted-foreground">
                  Pergunte em linguagem natural — eu consulto a Tabela OAB-MA 2026 e indico o item certo.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGESTOES.map((sugestao) => (
                  <button
                    key={sugestao}
                    onClick={() => enviarMensagem(sugestao)}
                    className="rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-[#BC231A]/50 hover:bg-muted"
                  >
                    {sugestao}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "honorarios-chat-fade-in flex items-start gap-2",
                    message.role === "user" && "flex-row-reverse",
                  )}
                >
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback
                      className={cn(
                        message.role === "assistant"
                          ? "bg-primary text-primary-foreground"
                          : "bg-[#BC231A] text-white",
                      )}
                    >
                      {message.role === "assistant" ? (
                        <Scale className="h-3.5 w-3.5" />
                      ) : (
                        <User className="h-3.5 w-3.5" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      message.role === "assistant"
                        ? "rounded-tl-sm bg-muted text-foreground"
                        : "rounded-tr-md bg-[#BC231A] text-white",
                    )}
                  >
                    {message.role === "assistant" ? (
                      message.content ? (
                        <div className="prose prose-sm max-w-none break-words prose-p:my-1.5 prose-headings:mt-2 prose-headings:mb-1 prose-headings:text-sm prose-headings:font-bold prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5 prose-strong:font-bold prose-strong:text-foreground dark:prose-invert">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        loading && (
                          <div className="flex items-center gap-2 py-1">
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#BC231A] [animation-delay:-0.3s]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#BC231A] [animation-delay:-0.15s]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#BC231A]" />
                          </div>
                        )
                      )
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}

              {loading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="honorarios-chat-fade-in flex items-start gap-2">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Scale className="h-3.5 w-3.5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#BC231A] [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#BC231A] [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#BC231A]" />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </ScrollArea>

        <p className="border-t bg-muted/30 px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">
          {AVISO_TABELA}
        </p>

        <div className="flex items-center gap-2 bg-primary p-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua dúvida sobre honorários..."
            disabled={loading}
            aria-label="Mensagem para o assistente de honorários"
            className="rounded-full border-none bg-white/95 text-foreground ring-offset-0 placeholder:text-muted-foreground focus-visible:ring-white/60 focus-visible:ring-offset-0"
          />
          <Button
            size="icon"
            onClick={() => enviarMensagem()}
            disabled={loading || !input.trim()}
            aria-label="Enviar mensagem"
            className="h-9 w-9 shrink-0 rounded-full bg-white text-primary hover:bg-white/90 disabled:bg-white/40 disabled:text-primary/50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatWidget;
