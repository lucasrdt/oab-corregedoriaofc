import { useSite } from "@/contexts/SiteContext";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Shield, Search, Ear, Scale } from "lucide-react";

/** Ícones mapeados por índice para os 4 cards de serviço */
const cardIcons = [
  Shield,   // Prerrogativas
  Search,   // Fiscalização
  Ear,      // Ouvidoria
  Scale,    // TED
];

const QuemSomos = () => {
  const { config } = useSite();
  const { content } = config;
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      ref={ref}
      className={`scroll-fade-in ${isVisible ? "visible" : ""}`}
    >
      <div className="container-padding">
        {/* ── Hero: 60 / 40 split ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-center mb-14">
          {/* Text — 60 % */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-primary font-bold text-3xl md:text-4xl lg:text-[2.75rem] leading-tight">
              {content?.about?.title}
            </h2>

            <div className="w-16 h-1 rounded-full bg-secondary" />

            <p className="text-foreground/80 text-base md:text-lg leading-relaxed max-w-2xl">
              {content?.about?.description}
            </p>
          </div>

          {/* Image — 40 % */}
          <div className="lg:col-span-2 relative">
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
              <img
                src={content?.images?.aboutBackground || "/placeholder.svg"}
                alt="Sede institucional"
                className="w-full h-full object-cover"
              />
              {/* subtle overlay for polish */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent rounded-xl" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default QuemSomos;
