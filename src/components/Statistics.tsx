import { useSite } from "@/contexts/SiteContext";
import MapaMaranhaoSVG from "./MapaMaranhaoSVG";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useSubsections } from "@/hooks/useSubsections";

const Statistics = () => {
  const { config } = useSite();
  const { content } = config;
  const { ref, isVisible } = useScrollAnimation();

  const { data: subsections = [] } = useSubsections();
  const activeCities = subsections.map((s) => s.city);

  return (
    <section ref={ref} className={`scroll-fade-in ${isVisible ? "visible" : ""}`}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Mapa — 7 colunas */}
          <div className="lg:col-span-7 bg-card rounded-lg shadow-sm border border-border/50 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-primary font-bold text-lg md:text-xl">
                Subseções no Maranhão
              </h3>
              {activeCities.length > 0 && (
                <span className="text-xs font-bold uppercase tracking-widest text-primary/60 bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                  {activeCities.length} {activeCities.length === 1 ? "município" : "municípios"}
                </span>
              )}
            </div>
            <div className="w-full flex items-center justify-center">
              <MapaMaranhaoSVG activeCities={activeCities} />
            </div>
          </div>

          {/* Stats — 5 colunas, empilhadas */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {content.stats.map((stat) => (
              <div
                key={stat.id}
                className="bg-primary p-5 rounded-lg text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-center items-center text-center group"
              >
                <div className="text-3xl md:text-4xl font-black mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold opacity-80 leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Statistics;