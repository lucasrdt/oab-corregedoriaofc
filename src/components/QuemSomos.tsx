import { useSite } from "@/contexts/SiteContext";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Shield, Search, Ear, Scale } from "lucide-react";
import TeamSection from "@/components/TeamSection";

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

        {/* ── 4 Cards de Benefícios ───────────────────────────── */}
        {content?.about?.benefits?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.about.benefits.map((benefit: any, index: number) => {
              const Icon = cardIcons[index] ?? Shield;
              return (
                <div
                  key={benefit.id}
                  className="flex flex-col items-start gap-3 p-6 rounded-xl border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-base text-foreground">{benefit.text}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Equipe ──────────────────────────────────────────── */}
        <div className="mt-16">
          <TeamSection />
        </div>

      </div>
    </section>
  );
};

export default QuemSomos;
