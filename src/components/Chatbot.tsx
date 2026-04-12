import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useSite } from "@/contexts/SiteContext";

interface FAQItem {
    id: number;
    question: string;
    answer: string;
}

interface Message {
    id: number;
    text: string;
    type: "bot" | "user";
}

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [showOptions, setShowOptions] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const { config } = useSite();

    // Get FAQ from site config
    const faqItems: FAQItem[] = config?.content?.faq || [];
    const companyName = config?.content?.companyName || "EscritÃ³rio";

    // Initialize welcome message â€” hooks must always run before any return
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: 1,
                    text: `OlÃ¡! Sou o assistente virtual do ${companyName}. Como posso te ajudar hoje?`,
                    type: "bot",
                },
            ]);
        }
    }, [companyName, messages.length]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Don't render on admin or portal pages (after all hooks)
    if (location.pathname.startsWith("/admin") || location.pathname.startsWith("/portal")) {
        return null;
    }

    // WhatsApp link

    const whatsappLink = "https://w.app/oab-ma";

    const handleOptionClick = (item: FAQItem) => {
        // Add user message
        const userMessage: Message = {
            id: Date.now(),
            text: item.question,
            type: "user",
        };

        // Add bot response
        const botMessage: Message = {
            id: Date.now() + 1,
            text: item.answer,
            type: "bot",
        };

        setMessages((prev) => [...prev, userMessage, botMessage]);
        setShowOptions(false);

        // Show options again after a delay
        setTimeout(() => {
            setShowOptions(true);
        }, 500);
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Chat Window */}
            <div
                className={`fixed bottom-24 right-4 sm:right-6 w-[calc(100%-2rem)] sm:w-[380px] max-h-[70vh] sm:max-h-[500px] 
          bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 
          transition-all duration-300 ease-out origin-bottom-right
          ${isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}
            >
                {/* Header */}
                <div className="bg-primary text-primary-foreground px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">Atendimento</h3>
                            <p className="text-xs opacity-80">{companyName}</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleChat}
                        className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                        aria-label="Fechar chat"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${message.type === "bot"
                                    ? "bg-card text-card-foreground rounded-bl-md shadow-sm"
                                    : "bg-primary text-primary-foreground rounded-br-md ml-auto"
                                }`}
                        >
                            {message.text}
                        </div>
                    ))}

                    {/* FAQ Options */}
                    {showOptions && faqItems.length > 0 && (
                        <div className="space-y-2 pt-2">
                            {faqItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleOptionClick(item)}
                                    className="w-full text-left px-4 py-3 bg-card border border-border rounded-xl text-sm
                    hover:border-primary hover:bg-primary/5 transition-all duration-200
                    text-foreground"
                                >
                                    {item.question}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* WhatsApp CTA - shows after messages exist (user interacted) */}
                    {whatsappLink && messages.length > 1 && (
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#25D366] hover:bg-[#128C7E] 
                                text-white rounded-xl text-sm font-medium transition-colors duration-200 mt-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Falar no WhatsApp
                        </a>
                    )}


                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Floating Action Button */}
            <button
                onClick={toggleChat}
                className={`fixed bottom-6 right-4 sm:right-6 w-14 h-14 bg-primary hover:bg-primary/90 
          text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-50
          transition-all duration-300 hover:scale-105 active:scale-95
          ${isOpen ? "rotate-0" : "rotate-0"}`}
                aria-label={isOpen ? "Fechar chat" : "Abrir chat"}
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <MessageCircle className="w-6 h-6" />
                )}
            </button>
        </>
    );
};

export default Chatbot;
