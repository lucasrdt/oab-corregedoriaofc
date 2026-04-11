import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useSite } from "@/contexts/SiteContext";

const Hero = () => {
  const { config } = useSite();
  const { content } = config;
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className={`relative min-h-[300px] md:min-h-[400px] flex items-center overflow-hidden bg-white border-b border-slate-100 scroll-fade-in ${isVisible ? 'visible' : ''}`}>
      
      {/* Content */}
      <div className="relative z-10 w-full container-padding py-16 lg:py-24">
        <div className="max-w-2xl lg:max-w-3xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-primary leading-[1.2] tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            Bem-vindo à {content?.companyName}
          </h1>

          <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed mb-4 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            {content?.about?.description || "Órgão máximo de disciplina, fiscalização, controle e orientação administrativa."}
          </p>

          {content?.slogan && (
            <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1200 delay-150">
              {content.slogan}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
