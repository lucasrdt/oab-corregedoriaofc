import { useSite } from "@/contexts/SiteContext";
import { ChevronRight, HelpCircle, MessageCircle, ExternalLink } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Duvidas = () => {
  const { config } = useSite();
  const { content } = config;
  const { ref, isVisible } = useScrollAnimation();

  const faqs = content.faq || [];

  return (
    <div className="flex flex-col space-y-8 pb-12 animate-fade-in">
      {/* Breadcrumbs */}
      <div className="flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground gap-2">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-primary">Dúvidas Frequentes</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl md:text-5xl font-black text-primary leading-tight">
          Como podemos ajudar?
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg font-medium">
          Encontre respostas rápidas para as principais dúvidas sobre processos, prazos e procedimentos legais.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* FAQ Accordion */}
        <div className="lg:col-span-3 space-y-4">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="border border-border/50 rounded-lg px-6 bg-card shadow-sm hover:border-primary/20 transition-all duration-300"
              >
                <AccordionTrigger className="text-left py-6 hover:no-underline group">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/5 text-primary rounded group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-colors mt-0.5">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <span className="text-sm md:text-base font-black text-primary tracking-tight">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-6 pl-12 border-t border-border/30 pt-4 font-medium italic">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Support Sidebar */}
        <div className="space-y-6">
          <div className="bg-primary p-8 rounded-lg shadow-lg text-primary-foreground space-y-6 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 opacity-10 rotate-12">
              <MessageCircle className="h-24 w-24" />
            </div>
            
            <h3 className="text-lg font-black text-secondary uppercase tracking-tight relative z-10">
              Ainda com dúvidas?
            </h3>
            <p className="text-white/70 text-sm font-medium leading-relaxed relative z-10">
              Nossa equipe técnica e jurídica está à disposição para esclarecimentos adicionais através do WhatsApp.
            </p>
            
            <Button asChild className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-black text-[10px] tracking-widest uppercase h-12 shadow-md relative z-10">
              <a
                href="https://w.app/oab-ma"
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar com Especialista <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
          </div>

          <div className="p-6 bg-card border border-border/50 rounded-lg shadow-sm">
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-4">Canais Institucionais</p>
            <div className="space-y-3">
              <Link to="/contato" className="flex items-center justify-between text-xs font-bold text-primary hover:translate-x-1 transition-transform group">
                CENTRAL DE ATENDIMENTO
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <div className="h-px bg-border/50 w-full" />
              <Link to="/equipe" className="flex items-center justify-between text-xs font-bold text-primary hover:translate-x-1 transition-transform group">
                NOSSA EQUIPE
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Duvidas;
