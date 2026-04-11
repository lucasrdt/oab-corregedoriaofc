import TeamSection from "@/components/TeamSection";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Equipe = () => {
  return (
    <div className="flex flex-col space-y-8 pb-12 animate-fade-in">
      {/* Breadcrumbs */}
      <div className="flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground gap-2">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-primary">Nossa Equipe</span>
      </div>

      <TeamSection />
    </div>
  );
};

export default Equipe;
