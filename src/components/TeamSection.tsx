import { useSite } from "@/contexts/SiteContext";
import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  oab?: string;
  description: string;
  email?: string;
  photo?: string;
  image?: string;
}

const TeamSection = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const { ref, isVisible } = useScrollAnimation();
  const { config } = useSite();

  const teamMembers: TeamMember[] = config.team.map((member: any) => ({
    ...member,
    image: member.photo || member.image
  }));

  return (
    <>
      <section ref={ref} className={`scroll-fade-in ${isVisible ? 'visible' : ''}`}>
        <div className="container mx-auto">
          <h2 className="text-primary font-bold text-3xl md:text-4xl mb-10">Nossa Equipe</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="cursor-pointer group flex flex-col h-full"
                onClick={() => setSelectedMember(member)}
              >
                <div className="bg-card h-full rounded-lg overflow-hidden border border-border/50 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 flex flex-col">
                  {/* Photo with subtle zoom on hover */}
                  <div className="relative overflow-hidden aspect-square">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-5xl font-black text-primary/20">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  {/* Name and Role */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-muted-foreground text-xs uppercase tracking-widest font-semibold border-b border-border/30 pb-4 mb-4">
                        {member.role}
                      </p>
                    </div>
                    <div className="flex items-center text-primary text-xs font-bold uppercase tracking-wider gap-2">
                       Ver Perfil <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Member Modal */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-none shadow-2xl glass-effect">
          <span className="sr-only">Visualize o perfil completo do integrante da nossa equipe jurídica</span>
          <div className="flex flex-col md:flex-row h-full">
            {/* Left side - Photo with overlay */}
            {selectedMember?.image && (
              <div className="w-full md:w-[40%] h-[300px] md:h-auto relative">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
              </div>
            )}

            {/* Right side - Content */}
            <div className="flex-1 p-8 md:p-12 space-y-8 bg-card">
              <div>
                <DialogTitle className="text-3xl font-black text-primary mb-2">
                  {selectedMember?.name}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-white bg-primary px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                    {selectedMember?.role}
                  </span>
                  {selectedMember?.oab && (
                    <span className="text-muted-foreground text-xs font-medium border-l border-border pl-4">
                      {selectedMember.oab}
                    </span>
                  )}
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                {selectedMember?.description}
              </div>

              {selectedMember?.email && (
                <div className="pt-8 border-t border-border/50">
                  <a 
                    href={`mailto:${selectedMember.email}`} 
                    className="flex items-center gap-3 text-primary hover:text-primary/80 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <Mail className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-sm">{selectedMember.email}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeamSection;
