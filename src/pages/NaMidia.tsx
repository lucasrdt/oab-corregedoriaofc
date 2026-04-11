
import { useSite } from "@/contexts/SiteContext";
import { ChevronRight, ChevronLeft, ChevronRight as ChevronRightIcon, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "@/utils/formatDate";

// Placeholder para artigos sem imagem
const articlePlaceholder = "/placeholder.svg";

interface Article {
  id: number;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  image?: string;
}

const NaMidia = () => {
  const { config } = useSite();
  const { content } = config;
  const { ref, isVisible } = useScrollAnimation();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("TODAS");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  const articlesPerPage = 6;

  const articles: Article[] = content.articles;

  // Converter data para Date de forma robusta
  const parseDate = (dateString: string): Date => {
    if (!dateString) return new Date();
    if (dateString.match(/^\d{4}[\/\-]\d{2}[\/\-]\d{2}/)) {
      const parts = dateString.split(/[\/\-]/).map(Number);
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    const parts = dateString.split('/').map(Number);
    if (parts.length === 3) {
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    return new Date();
  };

  // Filtrar artigos por categoria
  const filteredArticles = selectedCategory === "TODAS"
    ? articles
    : articles.filter(article => article.category === selectedCategory);

  // Ordenar artigos por data
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return sortOrder === "recent" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
  });

  // Paginação
  const totalPages = Math.ceil(sortedArticles.length / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = sortedArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset para primeira página ao trocar categoria
  };

  return (
    <div>
        {/* Breadcrumbs */}
        <div className="bg-primary py-3 md:py-4">
          <div className="container mx-auto container-padding">
            <div className="flex items-center text-sm md:text-base text-primary-foreground">
              <a href="/" className="hover:text-secondary transition-colors">
                {content.companyName}
              </a>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span>Na mídia</span>
            </div>
          </div>
        </div>

        <section ref={ref} className={`pt-8 md:pt-12 pb-16 md:pb-20 lg:pb-24 bg-background scroll-fade-in ${isVisible ? 'visible' : ''}`}>
          <div className="container mx-auto container-padding">
            <h1 className="section-title mb-8">Na Mídia</h1>

            {/* Filtro de Categorias e Ordenação */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "TODAS" ? "default" : "outline"}
                  onClick={() => handleCategoryChange("TODAS")}
                  className={`text-xs md:text-sm ${selectedCategory === "TODAS" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border-input bg-background hover:bg-secondary hover:text-secondary-foreground"}`}
                >
                  TODAS
                </Button>
                {(content.newsCategories || []).filter(cat => cat && cat.id).map((category) => (

                  <Button
                    key={category.id}
                    variant={selectedCategory === category.title ? "default" : "outline"}
                    onClick={() => handleCategoryChange(category.title)}
                    className={`text-xs md:text-sm ${selectedCategory === category.title ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border-input bg-background hover:bg-secondary hover:text-secondary-foreground"}`}
                  >
                    {category.title}
                  </Button>
                ))}
              </div>

              {/* Ordenação */}
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === "recent" ? "oldest" : "recent")}
                className="text-xs md:text-sm gap-2 w-fit border-input bg-background hover:bg-secondary hover:text-secondary-foreground"
              >
                <ArrowUpDown className="h-4 w-4" />
                {sortOrder === "recent" ? "Mais Recentes" : "Mais Antigos"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {currentArticles.map((article) => (
                <Link key={article.id} to={`/artigo/${article.id}`} className="block">
                  <Card className="hover-lift overflow-hidden border-border shadow-sm h-full transition-all duration-300 hover:shadow-lg">
                    {/* Image */}
                    <img
                      src={article.image || articlePlaceholder}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />

                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded uppercase">
                          {article.category}
                        </span>
                        <span className="text-xs md:text-sm text-muted-foreground">
                          {formatDate(article.date)}
                        </span>
                      </div>

                      <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 min-h-[56px]">
                        {article.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
                        {article.excerpt}
                      </p>

                      <Button className="w-full bg-secondary hover:bg-primary text-secondary-foreground hover:text-primary-foreground">
                        Leia Mais
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-10 w-10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                    className="h-10 w-10"
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-10 w-10"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </section>
    </div>
  );
};

export default NaMidia;
