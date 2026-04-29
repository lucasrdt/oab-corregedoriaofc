import { MapPin, Phone, Mail, Building2, ChevronRight, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubsections } from "@/hooks/useSubsections";
import { CardSkeleton } from "@/components/SkeletonLoader";
import { Link } from "react-router-dom";

const Subsecoes = () => {
  const { data, isLoading, error } = useSubsections();

  return (
    <div className="flex flex-col space-y-8 pb-12 animate-fade-in">
      {/* Page header */}
      <div className="space-y-4">
        <div className="flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground gap-2">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary">Subseções</span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-primary">
          Subseções Municipais
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Encontre a subseção da OAB-MA mais próxima de você — contatos e responsáveis por município.
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/20 p-12 rounded-lg text-center">
          <p className="text-destructive font-bold text-lg">Erro ao carregar subseções.</p>
          <p className="text-destructive/70 text-sm mt-1">Tente novamente mais tarde.</p>
        </div>
      ) : data && data.length === 0 ? (
        <div className="bg-muted/30 border border-border p-12 rounded-lg text-center">
          <p className="text-muted-foreground font-medium">Nenhuma subseção cadastrada ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((subsection) => (
            <Card
              key={subsection.id}
              className="group rounded-lg border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 overflow-hidden bg-card"
            >
              {/* Cover image */}
              {subsection.cover_image_url ? (
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={subsection.cover_image_url}
                    alt={`Subseção ${subsection.city}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                </div>
              ) : (
                <div className="h-1 bg-primary/10 group-hover:bg-primary transition-colors" />
              )}

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-primary/5 rounded-lg text-primary mb-2">
                    <Building2 className="h-5 w-5" />
                  </div>
                </div>
                <CardTitle className="text-xl font-black text-foreground group-hover:text-primary transition-colors">
                  {subsection.city}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground mt-1">
                  <User className="h-4 w-4 text-secondary" />
                  <span>{subsection.corregedor}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 border-t border-border/50">
                {subsection.address && (
                  <div className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed">
                    <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <span>{subsection.address}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {subsection.phone && (
                    <div className="flex items-center gap-3 text-sm font-medium">
                      <Phone className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground">{subsection.phone}</span>
                    </div>
                  )}
                  {subsection.email && (
                    <div className="flex items-center gap-3 text-sm font-medium">
                      <Mail className="h-4 w-4 text-primary shrink-0" />
                      <a
                        href={`mailto:${subsection.email}`}
                        className="text-foreground hover:text-primary transition-colors truncate"
                      >
                        {subsection.email}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subsecoes;
