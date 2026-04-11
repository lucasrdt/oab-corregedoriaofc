import { useSite } from "@/contexts/SiteContext";
import { ChevronRight, FileText, ChevronLeft, Calendar, User, Scale, MapPin, Hash, Users, ExternalLink, Info, Building2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { getCompanySlug } from "@/utils/slugify";
import { Link, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import CategoryPage from "@/pages/CategoryPage";

const DetalheCaso = () => {
  const { config } = useSite();
  const { content } = config;
  const { ref, isVisible } = useScrollAnimation();
  const { slug } = useParams();
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const companies = content.companies || [];
  const company = companies.find(c => c && getCompanySlug(c, companies) === slug);
  const caseType = (content.caseTypes || []).find(c => c && c.id === company?.caseType);

  const matchedCaseType = (content.caseTypes || []).find(
    (ct) => ct && (ct.id === slug || ct.slug === slug)
  );

  const checkScroll = () => {
    if (tabsListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsListRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (tabsListRef.current) {
      const { scrollWidth, clientWidth } = tabsListRef.current;
      tabsListRef.current.scrollTo({
        left: direction === 'left' ? 0 : scrollWidth - clientWidth,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300);
    }
  };

  if (matchedCaseType) {
    return <CategoryPage />;
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="bg-muted p-6 rounded-full mb-6">
          <Info className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Caso não encontrado</h2>
        <p className="text-muted-foreground mt-2">O processo que você procura não existe ou foi movido.</p>
        <Button asChild className="mt-8 bg-primary hover:bg-primary/90 text-white font-bold">
          <Link to="/">VOLTAR PARA HOME</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8 pb-12 animate-fade-in">
      {/* Breadcrumb & Header */}
      <div className="space-y-6">
        <div className="flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground gap-2">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/${company.caseType}`} className="hover:text-primary transition-colors">{caseType?.title}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary">{company.name}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded text-[10px] font-black uppercase tracking-widest border border-primary/5">
              {caseType?.title}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-primary leading-tight">
              {company.name}
            </h1>
          </div>
          
          {company.linkHabilitacoes && (
            <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-black px-8 h-12 shadow-md">
              <a href={company.linkHabilitacoes} target="_blank" rel="noopener noreferrer">
                HABILITAÇÕES E CRÉDITO <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Bento Grid Info */}
      <div className="w-full">
        {/* Main Process Info */}
        <div className="bg-card border border-border/50 rounded-lg p-8 shadow-sm space-y-8">
          <h3 className="text-lg font-black text-primary flex items-center gap-2 uppercase tracking-tight">
            <Scale className="h-5 w-5" /> Informações do Processo
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Número do Processo</p>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-primary" />
                <p className="text-lg font-black text-foreground">{company.processo}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Responsável</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <p className="text-lg font-bold text-foreground">{company.especialistaResponsavel}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Vara Judicial</p>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <p className="text-lg font-bold text-foreground">{company.vara}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Comarca / Estado</p>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <p className="text-lg font-bold text-foreground">{company.comarca} - {company.uf}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Tabs Section */}
      <div className="bg-card border border-border/50 rounded-lg shadow-sm overflow-hidden">
        <Tabs defaultValue="principais" className="w-full">
          <div className="relative border-b border-border bg-muted/20">
            {showLeftArrow && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-muted/50 to-transparent"
                onClick={() => scroll('left')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}

            {showRightArrow && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-muted/50 to-transparent"
                onClick={() => scroll('right')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}

            <TabsList
              ref={tabsListRef}
              onScroll={checkScroll}
              className="w-full justify-start bg-transparent rounded-none h-14 p-0 overflow-x-auto scrollbar-hide flex"
            >
              {[
                { id: "principais", label: "PRINCIPAIS DOCUMENTOS" },
                { id: "atividades", label: "RELATÓRIO DE ATIVIDADES" },
                { id: "atas", label: "ATAS" },
                { id: "incidentes", label: "RELATÓRIO DE INCIDENTES" },
                { id: "oficios", label: "RELATÓRIO DE OFÍCIOS" },
                { id: "creditos", label: "VERIFICAÇÃO DE CRÉDITOS" }
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-8 h-14 text-[10px] font-black tracking-widest whitespace-nowrap"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="p-8">
            <TabsContent value="principais" className="mt-0 animate-fade-in outline-none">
              <DocumentList documents={company.documentos.principais} />
            </TabsContent>
            <TabsContent value="atividades" className="mt-0 animate-fade-in outline-none">
              <DocumentList documents={company.documentos.relatorioAtividades} />
            </TabsContent>
            <TabsContent value="atas" className="mt-0 animate-fade-in outline-none">
              <DocumentList documents={company.documentos.atas} />
            </TabsContent>
            <TabsContent value="incidentes" className="mt-0 animate-fade-in outline-none">
              <DocumentList documents={company.documentos.relatorioIncidentes} />
            </TabsContent>
            <TabsContent value="oficios" className="mt-0 animate-fade-in outline-none">
              <DocumentList documents={company.documentos.relatorioOficios} />
            </TabsContent>
            <TabsContent value="creditos" className="mt-0 animate-fade-in outline-none">
              <DocumentList documents={company.documentos.relatorioCreditos} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

const DocumentList = ({ documents }: { documents: any[] }) => {
  if (documents.length === 0) {
    return (
      <div className="py-12 text-center bg-muted/10 rounded-lg border border-dashed border-border">
        <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground font-medium">Nenhum documento disponível nesta categoria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {documents.map((doc) => (
        <a
          key={doc.id}
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between p-4 bg-background hover:bg-primary/5 border border-border/50 hover:border-primary/20 rounded-lg transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-foreground font-bold group-hover:text-primary transition-colors">{doc.nome}</span>
          </div>
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
            DOWNLOAD <ExternalLink className="ml-2 h-3 w-3" />
          </Button>
        </a>
      ))}
    </div>
  );
};

export default DetalheCaso;