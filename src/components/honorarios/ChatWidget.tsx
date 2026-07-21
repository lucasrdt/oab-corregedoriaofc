import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw, Scale, Send, Sparkles, User, X } from "lucide-react";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { AVISO_TABELA } from "@/data/tabelaHonorarios";
import { useAdvogadoAuth } from "@/contexts/AdvogadoAuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
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
  const { session, advogado } = useAdvogadoAuth();
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const enviarMensagem = async (textoForcado?: string) => {
    const mensagem = (textoForcado ?? input).trim();
    if (!mensagem || loading) return;

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

    try {
      const { data, error } = await supabase.functions.invoke("claude-honorarios", {
        body: { mensagem, historico },
      });

      if (error) {
        let mensagemErro = error.message;
        if (error instanceof FunctionsHttpError) {
          const body = await error.context.json().catch(() => null);
          if (body?.error) mensagemErro = body.error;
        }
        throw new Error(mensagemErro);
      }
      if (data?.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: data?.resposta ?? "" },
      ]);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Tente novamente em instantes.";
      toast({
        title: "Não foi possível consultar a Corregedoria",
        description: mensagem,
        variant: "destructive",
      });
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Não foi possível concluir a consulta agora. Tente novamente em instantes ou procure os canais oficiais da Corregedoria.",
        },
      ]);
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
      <div className="group fixed bottom-40 right-4 z-50 sm:right-6">
        <div className="pointer-events-none absolute -top-11 right-0 whitespace-nowrap rounded-lg border border-border/40 bg-card px-3 py-1.5 font-body text-xs text-foreground opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
          Assistente de honorários
        </div>
        <DialogTrigger asChild>
          <button
            aria-label="Abrir assistente de honorários"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:bg-primary/90"
          >
            <Scale className="h-6 w-6" />
          </button>
        </DialogTrigger>
        {!open && (
          <span className="pointer-events-none absolute -top-0.5 right-0 flex h-3.5 w-3.5">
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
                    {message.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="honorarios-chat-fade-in flex items-start gap-2">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Scale className="h-3.5 w-3.5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="max-w-[80%] space-y-2 rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#BC231A] [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#BC231A] [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#BC231A]" />
                      </div>
                      <p className="text-xs text-muted-foreground">Consultando normas da Corregedoria...</p>
                    </div>
                    <Skeleton className="h-3 w-40" />
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-24" />
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
