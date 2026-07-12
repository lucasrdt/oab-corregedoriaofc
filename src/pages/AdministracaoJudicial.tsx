import { useSite } from "@/contexts/SiteContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronRight, ChevronDown, ChevronUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Link } from "react-router-dom";
import { useState } from "react";
import { getCompanySlug } from "@/utils/slugify";

const AdministracaoJudicial = () => {
  const { config } = useSite();
  const { content } = config;
  const { ref, isVisible } = useScrollAnimation();
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComarca, setSelectedComarca] = useState("todas");
  const [selectedUF, setSelectedUF] = useState("todas");

  const caseType = (content.caseTypes || []).find(c => c && c.id === "administracao-judicial");


  const filteredCompanies = (content.companies || []).filter(company => {

    const matchesCaseType = company.caseType === "administracao-judicial";
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesComarca = selectedComarca === "todas" || company.comarca === selectedComarca;
    const matchesUF = selectedUF === "todas" || company.uf === selectedUF;

    return matchesCaseType && matchesSearch && matchesComarca && matchesUF;
  });

  const comarcas = Array.from(new Set((content.companies || []).filter(c => c && c.caseType === "administracao-judicial").map(c => c.comarca)));
  const ufs = Array.from(new Set((content.companies || []).filter(c => c && c.caseType === "administracao-judicial").map(c => c.uf)));


  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-primary py-3 md:py-4">
          <div className="container mx-auto container-padding">
            <div className="flex items-center text-sm md:text-base text-primary-foreground flex-wrap gap-2">
              <Link to="/" className="hover:text-secondary transition-colors">
                {content.companyName}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span>{caseType?.title}</span>
            </div>
          </div>
        </div>

        <section ref={ref} className={`pt-8 md:pt-12 pb-16 md:pb-20 lg:pb-24 bg-background scroll-fade-in ${isVisible ? 'visible' : ''}`}>
          <div className="container mx-auto container-padding">

            <div className="mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
                {caseType?.title}
              </h1>

              <button
                onClick={() => setIsExplanationOpen(!isExplanationOpen)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted rounded-lg transition-colors duration-200 group mb-4"
              >
                <span className="text-sm md:text-base text-foreground">
                  {caseType?.description}
                </span>
                {isExplanationOpen ? (
                  <ChevronUp className="h-4 w-4 text-primary transition-transform" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-primary transition-transform" />
                )}
              </button>

              {isExplanationOpen && (
                <div className="text-foreground text-base md:text-lg leading-relaxed space-y-4 mt-4 animate-fade-in bg-muted/30 p-6 rounded-lg">
                  {caseType?.explanation.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-12">
              <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6">
                Filtrar por
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                <Input
                  placeholder="Empresa"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-background"
                />

                <Select value={selectedComarca} onValueChange={setSelectedComarca}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Comarca" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="todas">Todas</SelectItem>
                    {comarcas.map((comarca) => (
                      <SelectItem key={comarca} value={comarca}>
                        {comarca}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedUF} onValueChange={setSelectedUF}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="UF" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="todas">Todos</SelectItem>
                    {ufs.map((uf) => (
                      <SelectItem key={uf} value={uf}>
                        {uf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  className="bg-primary hover:bg-secondary text-primary-foreground"
                  onClick={() => { }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  BUSCAR
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-border">
                <h3 className="text-lg md:text-xl font-bold text-foreground">Empresa</h3>
                <h3 className="text-lg md:text-xl font-bold text-foreground text-right">
                  Litisconsórcio
                </h3>
              </div>

              {filteredCompanies.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    Nenhuma empresa encontrada com os filtros selecionados.
                  </p>
                </div>
              ) : (
                filteredCompanies.map((company) => (
                  <Link
                    key={company.id}
                    to={`/${getCompanySlug(company, content.companies || [])}`}
                    className="block"
                  >
                    <div className="border-b border-border py-4 hover:bg-muted/30 transition-colors duration-200 px-4 md:px-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">
                            {company.initials}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground text-base md:text-lg">
                              {company.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {company.comarca} - {company.uf}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-foreground font-medium">
                            {company.passivo}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {company.credores} credores
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AdministracaoJudicial;
