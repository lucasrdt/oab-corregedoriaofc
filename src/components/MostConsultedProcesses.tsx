import { useSite } from "@/contexts/SiteContext";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { getCompanySlug } from "@/utils/slugify";
import { ExternalLink } from "lucide-react";

const MostConsultedProcesses = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { config } = useSite();

  const processes = config.content.companies.filter(c => c.highlighted);

  return (
    <section ref={ref} className={`scroll-fade-in ${isVisible ? 'visible' : ''}`}>
      <div className="container mx-auto">
        <h2 className="text-primary font-bold text-3xl md:text-4xl mb-10">
          Processos Mais Consultados
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {processes.map((process) => (
            <a
              key={process.id}
              href={`/${getCompanySlug(process, config.content.companies)}`}
              className="block group h-full"
            >
              <div className="bg-gradient-to-tl from-[#003B6F] to-[#015D9D] h-full border border-[#015D9D]/30 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#003B6F]/30 hover:-translate-y-1 flex flex-col">
                {/* Logo Area */}
                <div className="p-6 flex items-center justify-center h-48 bg-white/5 border-b border-white/10 group-hover:bg-white/10 transition-colors">
                  {process.logo ? (
                    <div className="bg-white p-4 rounded-xl w-full h-full flex items-center justify-center shadow-inner">
                       <img
                         src={process.logo}
                         alt={process.name}
                         className="max-w-full max-h-full object-contain transition-all duration-500 group-hover:scale-105"
                       />
                    </div>
                  ) : (
                    <div className="w-24 h-24 flex items-center justify-center bg-white/10 shadow-inner rounded-full text-white font-bold text-4xl">
                      {process.initials || process.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Info Area */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight group-hover:text-[#FFC72C] transition-colors mb-3">
                      {process.name}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-white/70 text-sm font-medium">
                        Passivo: <span className="text-white font-bold">{process.passivo}</span>
                      </p>
                      <p className="text-white/70 text-sm">
                        Credores: <span className="text-white font-bold">{process.credores}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-auto flex items-center text-[#FFC72C] font-bold text-[11px] uppercase tracking-widest gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    Ver detalhes <ExternalLink className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MostConsultedProcesses;
