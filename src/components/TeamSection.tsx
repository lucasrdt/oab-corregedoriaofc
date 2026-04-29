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
                  {/* Photo — círculo colorido e centralizado */}
                  <div className="flex justify-center pt-6 pb-2">
                    <div className="relative w-36 h-36 rounded-full overflow-hidden ring-2 ring-border/30 group-hover:ring-primary/50 transition-all duration-300 flex-shrink-0">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <span className="text-4xl font-black text-primary/40">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
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
        <DialogContent className="max-w-4xl p-0 border-none shadow-2xl overflow-hidden">
          <span className="sr-only">Visualize o perfil completo do integrante da nossa equipe jurídica</span>
          <div className="flex flex-col md:flex-row">

            {/* Left side — foto ou avatar placeholder */}
            <div className="w-full md:w-[38%] md:min-h-[420px] relative flex-shrink-0 bg-muted flex items-center justify-center">
              {selectedMember?.image ? (
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="w-full h-full object-contain object-center"
                  style={{ maxHeight: '520px' }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full min-h-[200px] md:min-h-[420px]">
                  <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-5xl font-black text-primary/30">
                      {selectedMember?.name?.charAt(0)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right side — conteúdo com scroll para bios longas */}
            <div className="flex-1 p-8 md:p-10 bg-card overflow-y-auto max-h-[85vh] space-y-6">
              <div>
                <DialogTitle className="text-3xl font-black text-primary mb-3">
                  {selectedMember?.name}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-white bg-primary px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                    {selectedMember?.role}
                  </span>
                  {selectedMember?.oab && (
                    <span className="text-muted-foreground text-xs font-medium border-l border-border pl-3">
                      {selectedMember.oab}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedMember?.description}
              </p>

              {selectedMember?.email && (
                <div className="pt-6 border-t border-border/50">
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
