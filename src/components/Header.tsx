import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSite } from "@/contexts/SiteContext";
import { Menu, X, LogIn, ChevronDown, ChevronRight, Search, Globe, Phone, Mail, Instagram } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDenunciasSub, setShowDenunciasSub] = useState(false);
  
  const { config } = useSite();
  const { content } = config;

  const logoUrl = content?.logo?.imageUrl || "";
  const companyName = content?.companyName || "Ivaldo Praddo";
  const location = useLocation();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset" };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
    setSearchOpen(false);
    setShowDenunciasSub(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Início", path: "/" },
    { name: "Quem Somos", path: "/equipe" },
    { name: "Subseções", path: "/subsecoes" },
    { name: "Denúncias", path: "#denuncias", isParent: true },
    { name: "Cursos e Eventos", path: "/cursos" },
    { name: "Notícias", path: "/na-midia" },
    { name: "Dúvidas Frequentes", path: "/duvidas" },
    { name: "Fale Conosco", path: "/contato" },
  ];

  const denunciasLinks = [
    { name: "Prerrogativas", path: "/contato#prerrogativas" },
    { name: "Fiscalização", path: "/contato#fiscalizacao" },
    { name: "Ouvidoria", path: "/contato#ouvidoria" },
    { name: "TED", path: "/contato#ted" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Buscando por: ${searchQuery}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm bg-white">
      {/* 1. TOP BAR (Estilo TJRN) */}
      <div className="hidden md:block w-full border-b border-border/40 bg-slate-50/50">
        <div className="container-padding h-10 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px] font-medium text-muted-foreground/80">
            <Link to="/contato#prerrogativas" className="hover:text-primary transition-colors">PRERROGATIVAS</Link>
            <span className="opacity-20">/</span>
            <Link to="/contato#fiscalizacao" className="hover:text-primary transition-colors">FISCALIZAÇÃO</Link>
            <span className="opacity-20">/</span>
            <Link to="/contato#ouvidoria" className="hover:text-primary transition-colors">OUVIDORIA</Link>
            <span className="opacity-20">/</span>
            <Link to="/contato#ted" className="hover:text-primary transition-colors">TED</Link>
          </div>
          <div className="flex items-center gap-4">
             <a href={content?.social?.instagram} target="_blank" className="text-muted-foreground/60 hover:text-primary transition-colors">
               <Instagram className="h-3.5 w-3.5" />
             </a>
             <div className="h-3 w-[1px] bg-border/40"></div>
             <Link to="/portal" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-70 transition-opacity">
               Acesso Restrito
             </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <div className="w-full bg-white border-b border-border/20">
        <div className="container-padding h-16 md:h-20 flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3">
             {logoUrl ? (
               <img src={logoUrl} alt={companyName} className="h-9 md:h-12 object-contain" />
             ) : (
               <div className="h-10 w-10 md:h-12 md:w-12 rounded bg-primary flex items-center justify-center">
                 <span className="text-white font-black text-xl">{companyName.charAt(0)}</span>
               </div>
             )}
             <div className="flex flex-col">
               <span className="text-[14px] md:text-[16px] font-bold text-primary leading-tight uppercase tracking-tight">
                 {companyName}
               </span>
               <span className="text-[9px] md:text-[10px] text-muted-foreground/70 font-medium uppercase tracking-[0.2em]">
                 {content?.tagline || "Administração Judicial"}
               </span>
             </div>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Box Trigger */}
            <div className="relative flex items-center">
               {searchOpen && (
                 <form onSubmit={handleSearch} className="absolute right-full mr-2 animate-in slide-in-from-right-4 fade-in duration-300">
                    <input 
                      type="text"
                      autoFocus
                      placeholder="Pesquisar..."
                      className="w-48 lg:w-64 h-10 px-4 rounded-full border border-border bg-slate-50 outline-none text-sm focus:ring-2 focus:ring-primary/20"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                 </form>
               )}
               <button 
                 onClick={() => setSearchOpen(!searchOpen)}
                 className={`hidden md:flex flex-row items-center justify-center p-2.5 rounded-full transition-all duration-200 ${searchOpen ? 'bg-primary text-white' : 'bg-slate-100 text-primary hover:bg-slate-200'}`}
               >
                 <Search className="h-5 w-5" />
               </button>
            </div>

            <div className="h-8 w-[1px] bg-border/40 hidden md:block"></div>

            {/* Menu Toggle Button */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-md text-primary font-bold uppercase text-[12px] md:text-[13px] tracking-wider hover:bg-slate-50 transition-colors group"
            >
              <span>Menu</span>
              <div className="flex flex-col gap-1 w-5">
                <span className="h-[2px] w-full bg-primary rounded-full transition-transform group-hover:scale-x-110 origin-right"></span>
                <span className="h-[2px] w-2/3 bg-primary rounded-full ml-auto"></span>
                <span className="h-[2px] w-full bg-primary rounded-full"></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 3. FULL SCREEN MENU OVERLAY */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white animate-in fade-in duration-300 overflow-y-auto">
          <div className="container-padding py-6 md:py-10 flex flex-col min-h-screen">
            {/* Overlay Header */}
            <div className="flex items-center justify-between mb-12 md:mb-16">
               <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                  {logoUrl ? (
                    <img src={logoUrl} alt={companyName} className="h-9 object-contain" />
                  ) : (
                    <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                      <span className="text-white font-black text-sm">{companyName.charAt(0)}</span>
                    </div>
                  )}
                  <span className="text-lg font-bold text-primary uppercase tracking-tight">{companyName}</span>
               </Link>
               <button 
                 onClick={() => setIsMenuOpen(false)}
                 className="p-3 rounded-full bg-slate-100 text-primary hover:bg-primary hover:text-white transition-all duration-300"
               >
                 <X className="h-6 w-6 md:h-8 md:w-8" />
               </button>
            </div>

            {/* Overlay Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              {/* Navigation Links */}
              <nav className="flex flex-col gap-3 md:gap-4">
                 {navLinks.map((link, idx) => {
                   if ('isParent' in link && link.isParent) {
                     return (
                       <div key={link.name} className="flex flex-col">
                         <button
                           onClick={() => setShowDenunciasSub(!showDenunciasSub)}
                           className="group flex items-baseline justify-between gap-3 md:gap-4 text-lg md:text-xl lg:text-2xl font-bold text-primary/40 hover:text-primary transition-all duration-300 transform hover:translate-x-2 w-full text-left"
                         >
                           <div className="flex items-baseline gap-3 md:gap-4">
                             <span className="text-[10px] md:text-xs font-bold opacity-30 group-hover:opacity-100 transition-opacity">0{idx+1}</span>
                             <span className="uppercase tracking-tight">{link.name}</span>
                           </div>
                           <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showDenunciasSub ? 'rotate-180' : ''}`} />
                         </button>
                         {showDenunciasSub && (
                           <div className="flex flex-col gap-2 mt-4 ml-8 md:ml-12 border-l border-primary/10 pl-6 animate-in slide-in-from-top-4 duration-300">
                             {denunciasLinks.map((subLink) => (
                               <Link
                                 key={subLink.name}
                                 to={subLink.path}
                                 onClick={() => setIsMenuOpen(false)}
                                 className="text-sm md:text-base font-bold text-primary/60 hover:text-secondary transition-colors uppercase tracking-widest py-1"
                               >
                                 {subLink.name}
                               </Link>
                             ))}
                           </div>
                         )}
                       </div>
                     );
                   }
                   return (
                     <Link
                       key={link.path}
                       to={link.path}
                       className="group flex items-baseline gap-3 md:gap-4 text-lg md:text-xl lg:text-2xl font-bold text-primary/40 hover:text-primary transition-all duration-300 transform hover:translate-x-2"
                       style={{ animationDelay: `${idx * 50}ms` }}
                     >
                       <span className="text-[10px] md:text-xs font-bold opacity-30 group-hover:opacity-100 transition-opacity">0{idx+1}</span>
                       <span className="uppercase tracking-tight">{link.name}</span>
                     </Link>
                   );
                 })}
              </nav>

              {/* Contact Info & Extra Section */}
              <div className="flex flex-col gap-10 lg:pl-10 lg:border-l border-border/60">
                 <div className="space-y-6">
                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground/60">Contatos Diretos</h3>
                    <div className="flex flex-col gap-4">
                       <a href={`tel:${content?.phoneClean}`} className="flex items-center gap-4 text-xl md:text-2xl font-bold text-primary hover:text-secondary transition-colors">
                          <Phone className="h-6 w-6 text-secondary" />
                          {content?.phone}
                       </a>
                       <a href={`mailto:${content?.email}`} className="flex items-center gap-4 text-xl md:text-2xl font-bold text-primary hover:text-secondary transition-colors break-all">
                          <Mail className="h-6 w-6 text-secondary" />
                          {content?.email}
                       </a>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground/60">Endereço Unidade I</h3>
                    <div className="flex items-start gap-4">
                       <div className="p-2 rounded-lg bg-secondary/10 flex-shrink-0">
                          <ChevronRight className="h-5 w-5 text-secondary" />
                       </div>
                       <p className="text-primary/70 font-medium leading-relaxed">
                          {content?.addresses?.[0]?.street}, {content?.addresses?.[0]?.neighborhood}<br/>
                          {content?.addresses?.[0]?.city} - {content?.addresses?.[0]?.state}<br/>
                          CEP: {content?.addresses?.[0]?.zip}
                       </p>
                    </div>
                 </div>

                 <div className="pt-10 flex items-center gap-6">
                    <Link to="/portal" className="px-8 py-4 bg-primary text-white rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20">
                      Administrativo
                    </Link>
                    <div className="flex items-center gap-4">
                       <a href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-slate-50 transition-colors">
                          <Instagram className="h-5 w-5 text-primary" />
                       </a>
                       <a href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-slate-50 transition-colors">
                          <Globe className="h-5 w-5 text-primary" />
                       </a>
                    </div>
                 </div>
              </div>
            </div>

            {/* Overlay Footer */}
            <div className="mt-auto pt-16 flex items-center justify-between text-[11px] font-bold text-muted-foreground/40 uppercase tracking-[0.4em]">
               <span>© {new Date().getFullYear()} {companyName}</span>
               <span className="hidden sm:inline">A Casa de Todos e Todas, da advocacia e da sociedade</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
