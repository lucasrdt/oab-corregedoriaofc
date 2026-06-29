import { useSite } from "@/contexts/SiteContext";
import { ChevronRight, ChevronDown, ChevronUp, Search, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Link, useParams, Navigate } from "react-router-dom";
import { useState } from "react";
import { getCompanySlug, generateBaseSlug } from "@/utils/slugify";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSubsections } from "@/hooks/useSubsections";

const CategoryPage = () => {
  const { categorySlug, slug } = useParams<{ categorySlug?: string; slug?: string }>();
  const activeSlug = categorySlug || slug;
  const { config } = useSite();
  const { content } = config;
  const { ref, isVisible } = useScrollAnimation();

  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComarca, setSelectedComarca] = useState("todas");
  const [selectedUF, setSelectedUF] = useState("todas");

  const { data: subsections = [], isLoading: isLoadingSubsections } = useSubsections();

  const { data: dbCases = [], isLoading: isCasesLoading } = useQuery({
    queryKey: ['public-casos-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('casos')
        .select('*');
      if (error) throw error;
      return data || [];
    }
  });

  const caseType = (content.caseTypes || []).find(
    (ct) => ct && (ct.slug === activeSlug || ct.id === activeSlug)
  );

  const subsection = subsections.find(
    (s) => s.id === activeSlug || generateBaseSlug(s.city) === activeSlug
  );

  const resolvedCategory = caseType || (subsection ? {
    id: subsection.id,
    title: `SUBSEÇÃO ${subsection.city.toUpperCase()}`,
    slug: `subsecao-${generateBaseSlug(subsection.city)}`,
    description: `Processos pertencentes à Subseção de ${subsection.city}.`,
    explanation: `Esta página lista todos os processos sob responsabilidade da Subseção de ${subsection.city}.`
  } : null);

  if (isCasesLoading || isLoadingSubsections) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground font-medium">Carregando processos...</p>
      </div>
    );
  }

  if (!resolvedCategory) {
    return <Navigate to="/not-found" replace />;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const mappedCompanies = dbCases.map((c: any) => ({
    ...c,
    name: c.nome,
    initials: c.initials || getInitials(c.nome),
    linkHabilitacoes: c.link_habilitacoes,
    especialistaResponsavel: c.especialista,
  }));

  const companiesOfType = mappedCompanies.filter((c: any) => {
    if (caseType) {
      return c.caseType === caseType.id || c.caseType === caseType.slug || c.case_type === caseType.id || c.case_type === caseType.slug;
    }
    if (subsection) {
      return c.subsection_id === subsection.id;
    }
    return false;
  });

  const filteredCompanies = companiesOfType.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesComarca = selectedComarca === "todas" || company.comarca === selectedComarca;
    const matchesUF = selectedUF === "todas" || company.uf === selectedUF;
    return matchesSearch && matchesComarca && matchesUF;
  });

  const comarcas = Array.from(new Set(companiesOfType.map((c) => c.comarca).filter(Boolean)));
  const ufs = Array.from(new Set(companiesOfType.map((c) => c.uf).filter(Boolean)));

  return (
    <div className="flex flex-col space-y-8 pb-12">
      {/* Breadcrumb & Title Section */}
      <div className="space-y-6">
        <div className="flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground gap-2">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary">{resolvedCategory.title}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-primary">
            {resolvedCategory.title}
          </h1>

          {(resolvedCategory.description || resolvedCategory.explanation) && (
            <Button
              variant="outline"
              onClick={() => setIsExplanationOpen(!isExplanationOpen)}
              className="w-fit border-primary/20 hover:bg-primary/5 text-primary font-bold"
            >
              <Info className="mr-2 h-4 w-4" />
              {isExplanationOpen ? "OCULTAR INFORMAÇÕES" : "O QUE É ESTE PROCESSO?"}
            </Button>
          )}
        </div>

        {isExplanationOpen && resolvedCategory.explanation && (
          <div className="bg-white/50 border border-primary/10 p-8 rounded-lg animate-fade-in shadow-sm">
            <div className="prose prose-blue max-w-none text-muted-foreground leading-relaxed">
              {resolvedCategory.explanation.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filters Card */}
      <div className="bg-card border border-border/50 rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-background/50 focus:bg-background transition-colors"
            />
          </div>

          <Select value={selectedComarca} onValueChange={setSelectedComarca}>
            <SelectTrigger className="h-11 bg-background/50">
              <SelectValue placeholder="Comarca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as Comarcas</SelectItem>
              {comarcas.map((comarca) => (
                <SelectItem key={comarca} value={comarca}>{comarca}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedUF} onValueChange={setSelectedUF}>
            <SelectTrigger className="h-11 bg-background/50">
              <SelectValue placeholder="Estado (UF)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todos os Estados</SelectItem>
              {ufs.map((uf) => (
                <SelectItem key={uf} value={uf}>{uf}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className="h-11 bg-primary hover:bg-primary/90 text-white font-bold">
            FILTRAR RESULTADOS
          </Button>
        </div>
      </div>

      {/* Result Table */}
      <div className="bg-card border border-border/50 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-primary">Empresa</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-primary text-right">Informações Financeiras</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-primary text-center">Ação</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center text-muted-foreground font-medium">
                    Nenhuma empresa encontrada com os critérios selecionados.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company) => (
                  <tr 
                    key={company.id} 
                    className="group border-b border-border/50 hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-6 py-6 font-medium">
                      <div className="flex items-center gap-4">
                        {(company as any).logo ? (
                          <img
                            src={(company as any).logo}
                            alt={company.name}
                            className="w-12 h-12 rounded-lg object-contain bg-white p-1 border border-border"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/5">
                            {company.initials}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                            {company.name}
                          </p>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                            {company.comarca} • {company.uf}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <p className="font-black text-primary text-lg">{company.passivo}</p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {(company.credores || 0).toLocaleString()} credores registrados
                      </p>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <Link 
                        to={`/${getCompanySlug(company, mappedCompanies)}`}
                        className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-primary/5 hover:bg-primary text-primary hover:text-white font-bold text-sm transition-all"
                      >
                        VER DETALHES
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
