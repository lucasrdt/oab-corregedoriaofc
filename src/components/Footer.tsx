import { useSite } from "@/contexts/SiteContext";
import { Instagram, Facebook, Linkedin, Phone, Twitter, Youtube, MapPin, Mail, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const { config } = useSite();
  const { content } = config;
  const companyName = content?.companyName || "Ivaldo Praddo";

  const socialNetworks = [
    { name: 'instagram', url: content.social.instagram, icon: Instagram, label: 'Instagram' },
    { name: 'facebook', url: content.social.facebook, icon: Facebook, label: 'Facebook' },
    { name: 'linkedin', url: content.social.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { name: 'twitter', url: content.social.twitter, icon: Twitter, label: 'Twitter' },
    { name: 'youtube', url: content.social.youtube, icon: Youtube, label: 'YouTube' },
  ].filter(social => social.url && social.url.trim() !== '');

  const hasWhatsApp = content.whatsapp && content.whatsapp.trim() !== '';

  return (
    <footer className="bg-navy-deep text-white border-t border-white/5">
      {/* 1. SEÇÃO DE APOIO / LOGOS */}
      <div className="bg-black/10 border-b border-white/5">
        <div className="container-padding py-6 flex items-center justify-between opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
           <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40">Institucional</span>
           <div className="flex items-center gap-8">
              {/* Espaço para logos de parceiros/governo se necessário */}
              <div className="h-6 w-24 bg-white/5 rounded flex items-center justify-center text-[9px] font-bold text-white/20 uppercase tracking-tighter">OAB Nacional</div>
              <div className="h-6 w-24 bg-white/5 rounded flex items-center justify-center text-[9px] font-bold text-white/20 uppercase tracking-tighter">CNJ</div>
              <div className="h-6 w-24 bg-white/5 rounded flex items-center justify-center text-[9px] font-bold text-white/20 uppercase tracking-tighter">Justiça</div>
           </div>
        </div>
      </div>

      {/* 2. CONTEÚDO PRINCIPAL */}
      <div className="container-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">

          {/* Coluna 1: Identidade */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              {content?.logo?.imageUrlWhite ? (
                <img src={content.logo.imageUrlWhite} alt={companyName} className="h-10 md:h-12 object-contain" />
              ) : content?.logo?.imageUrl ? (
                <img src={content.logo.imageUrl} alt={companyName} className="h-10 md:h-12 object-contain opacity-90" />
              ) : (
                <div className="h-10 w-10 md:h-12 md:w-12 rounded bg-white/10 flex items-center justify-center border border-white/10 shadow-lg">
                  <span className="text-white font-black text-xl">{companyName.charAt(0)}</span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-[16px] md:text-[18px] font-bold text-white leading-tight uppercase tracking-tight">
                  {companyName}
                </span>
                <span className="text-[9px] md:text-[10px] text-white/70 font-bold uppercase tracking-[0.2em] mt-1">
                  Forte e ao seu lado
                </span>
              </div>
            </div>
            
            
            <div className="flex flex-col gap-3">
               <h5 className="text-[10px] font-bold uppercase tracking-widest text-white/60">Horário de Atendimento</h5>
               <p className="text-xs text-white/40 font-medium">
                 {content.businessHours?.weekdays || "Segunda a Sexta: 08h às 18h"}
               </p>
            </div>
          </div>

          {/* Coluna 2: Navegação */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white py-1 border-b border-white/20 w-fit">
              Sistemas
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { name: "Administrativo", path: "/portal" },
                { name: "Andamento de Processos", path: "/subsecoes" },
                { name: "Subseções", path: "/subsecoes" },
                { name: "Transparência", path: "/" },
              ].map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-sm text-white/40 hover:text-white transition-colors inline-block"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Coluna 3: Institucional */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white py-1 border-b border-white/20 w-fit">
              Institucional
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { name: "Equipe", path: "/equipe" },
                { name: "Na Mídia", path: "/na-midia" },
                { name: "Cursos", path: "/cursos" },
                { name: "Contato", path: "/contato" },
              ].map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-sm text-white/40 hover:text-white transition-colors inline-block"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Coluna 4: Contato & Localização */}
          <div className="md:col-span-4 space-y-8">
            <div className="space-y-4">
               <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Fale Conosco</h4>
               <div className="grid grid-cols-1 gap-4">
                  {content.phone && (
                    <a href={`tel:${content.phoneClean}`} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
                      <Phone className="h-4 w-4 text-white/60 group-hover:scale-110 group-hover:text-white transition-all" />
                      <span className="text-sm font-bold text-white/70">{content.phone}</span>
                    </a>
                  )}
                  {content.email && (
                    <a href={`mailto:${content.email}`} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
                      <Mail className="h-4 w-4 text-white/60 group-hover:scale-110 group-hover:text-white transition-all" />
                      <span className="text-sm font-bold text-white/70 break-all">{content.email}</span>
                    </a>
                  )}
               </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Unidade Sede</h4>
               <div className="flex items-start gap-3 text-white/40 text-sm leading-relaxed">
                  <MapPin className="h-4 w-4 text-white/60 flex-shrink-0 mt-1" />
                  <p>
                    {content.addresses?.[0]?.street}, {content.addresses?.[0]?.neighborhood}<br/>
                    {content.addresses?.[0]?.city} - {content.addresses?.[0]?.state}
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RODAPÉ INFERIOR */}
      <div className="border-t border-white/5 bg-black/30">
        <div className="container-padding py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">
              {content.footer?.copyright || `© ${new Date().getFullYear()} ${content.companyName}`}
            </p>
            <p className="text-[9px] text-white/20 uppercase tracking-[0.1em]">
              {content.footer?.description || "Todos os direitos reservados • CNPJ 00.000.000/0001-00"}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
             {socialNetworks.map((social) => {
               const IconComponent = social.icon;
               return (
                 <a
                   key={social.name}
                   href={social.url}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/30 hover:text-secondary hover:bg-white/10 hover:border-white/10 border border-transparent transition-all duration-300"
                 >
                   <IconComponent className="h-4 w-4" />
                 </a>
               );
             })}
          </div>

          <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
             <span className="hover:text-white transition-colors cursor-pointer">Privacidade</span>
             <span className="w-1 h-1 rounded-full bg-white/10"></span>
             <span className="hover:text-white transition-colors cursor-pointer">Termos</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
