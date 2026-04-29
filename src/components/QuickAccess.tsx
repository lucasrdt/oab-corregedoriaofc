import { Link } from "react-router-dom";
import { Shield, Search, Ear, Scale, ChevronRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const quickLinks = [
  { 
    name: "QUEM SOMOS", 
    path: "/equipe", 
    icon: Shield,
    description: "Conheça mais sobre nossa estrutura e valores institucionais."
  },
  { 
    name: "DÚVIDAS FREQUENTES", 
    path: "/duvidas", 
    icon: Search,
    description: "Encontre respostas rápidas para as principais questões."
  },
  { 
    name: "FALE CONOSCO", 
    path: "/contato", 
    icon: Ear,
    description: "Canais de comunicação direta com nossa equipe."
  },
  { 
    name: "DENÚNCIAS", 
    path: "/contato#denuncias", 
    icon: Scale,
    description: "Acesse nossos canais oficiais para registrar sua denúncia."
  },
];

const QuickAccess = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section 
      ref={ref} 
      className={`py-12 bg-background scroll-fade-in ${isVisible ? 'visible' : ''}`}
    >
      <div className="container-padding">
        <div className="mb-10 flex flex-col items-center text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary flex flex-col items-center gap-3">
            Acesso Rápido
            <div className="h-1 w-12 bg-secondary rounded-full" />
          </h2>
          <p className="text-muted-foreground mt-3">Encontre informações e serviços essenciais</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {quickLinks.map((link, idx) => (
            <Link
              key={link.path}
              to={link.path}
              className="group bg-white border border-border/60 p-6 rounded-xl shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col h-full items-center text-center"
            >
              {/* Icon Circle */}
              <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-6 border border-border/40 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                <link.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
              </div>

              <h3 className="text-primary font-bold text-[15px] leading-tight mb-3 group-hover:text-secondary transition-colors">
                {link.name}
              </h3>
              
              <p className="text-xs text-muted-foreground leading-relaxed mb-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                {link.description}
              </p>

              <div className="mt-5 flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary/40 group-hover:text-primary transition-colors bg-slate-50 px-4 py-2 rounded-full w-full group-hover:bg-primary/5">
                Acessar <ChevronRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;
