
import { useSite } from "@/contexts/SiteContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronRight, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { formatDate } from "@/utils/formatDate";

// Placeholder para artigos sem imagem
const articlePlaceholder = "/placeholder.svg";

const Artigo = () => {
  const { config } = useSite();
  const { content } = config;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  const { id } = useParams();

  // Buscar artigo pelo ID (em produção viria de API/banco de dados)
  const article = content.articles.find(a => a.id === parseInt(id || "1"));

  // Atualiza metadados Open Graph dinamicamente para a página de artigo
  useEffect(() => {
    if (!article) return;

    const origin = window.location.origin;
    const currentUrl = window.location.href;

    const resolveAbsoluteUrl = (url?: string | null) => {
      if (!url) return "";
      if (url.startsWith("http://") || url.startsWith("https://")) return url;
      if (url.startsWith("/")) return `${origin}${url}`;
      return `${origin}/${url}`;
    };

    const defaultOgImage =
      resolveAbsoluteUrl(config.seo?.ogImage) || resolveAbsoluteUrl("/favicon.jpg");

    const stripHtml = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    const ogTitle = article.title;
    const ogDescription = stripHtml(article.excerpt);
    const ogImage = resolveAbsoluteUrl(article.image) || defaultOgImage;
    const ogUrl = currentUrl;

    const setOgMeta = (property: string, content: string) => {
      if (!content) return;
      let tag = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setOgMeta("og:type", "article");
    setOgMeta("og:title", ogTitle);
    setOgMeta("og:description", ogDescription);
    setOgMeta("og:image", ogImage);
    setOgMeta("og:url", ogUrl);

    // Atualiza também Twitter Cards para melhor compatibilidade de compartilhamento
    const setTwitterMeta = (name: string, content: string) => {
      if (!content) return;
      let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setTwitterMeta("twitter:card", "summary_large_image");
    setTwitterMeta("twitter:title", ogTitle);
    setTwitterMeta("twitter:description", ogDescription);
    setTwitterMeta("twitter:image", ogImage);
  }, [article, config.seo]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">Artigo não encontrado</h1>
            <Link to="/na-midia">
              <Button>Voltar para Na Mídia</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="bg-primary py-3 md:py-4">
          <div className="container mx-auto container-padding">
            <div className="flex items-center text-sm md:text-base text-primary-foreground flex-wrap gap-2">
              <Link to="/" className="hover:text-secondary transition-colors">
                {content.companyName}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/na-midia" className="hover:text-secondary transition-colors">
                Na mídia
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="truncate">{article.title}</span>
            </div>
          </div>
        </div>

        <article className={`pt-8 md:pt-12 pb-16 md:pb-20 lg:pb-24 bg-background scroll-fade-in ${isVisible ? 'visible' : ''}`}>
          <div className="container mx-auto container-padding max-w-4xl">
            {/* Article Header */}
            <div className="mb-8 md:mb-12">
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm md:text-base text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-secondary" />
                  <span className="font-medium text-secondary">{article.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.date)}</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 leading-tight">
                {article.title}
              </h1>

              <p
                className="text-lg md:text-xl text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.excerpt }}
              />
            </div>

            {/* Featured Image */}
            <div className="mb-8 md:mb-12">
              <img
                src={article.image || articlePlaceholder}
                alt={article.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div
                className="text-foreground leading-relaxed space-y-6 text-base md:text-lg"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>

            {/* Back to News */}
            <div className="mt-12 pt-8 border-t border-border text-center">
              <Link to="/na-midia">
                <Button variant="outline" size="lg">
                  Voltar para Na Mídia
                </Button>
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default Artigo;
