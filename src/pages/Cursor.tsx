import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Code2, Zap, Bot, GitBranch, Terminal, Layers } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "IA Integrada ao Editor",
    description:
      "O Cursor incorpora modelos de linguagem avançados (como Claude e GPT-4) diretamente no ambiente de desenvolvimento, permitindo geração, revisão e refatoração de código por meio de linguagem natural.",
  },
  {
    icon: Zap,
    title: "Autocompletar Inteligente",
    description:
      "Vai além do autocompletar tradicional: o Cursor entende o contexto de todo o projeto — arquivos, imports, convenções — para sugerir blocos inteiros de código com precisão.",
  },
  {
    icon: Code2,
    title: "Chat com o Código",
    description:
      "Converse diretamente com a IA sobre o código aberto. Peça explicações, identifique bugs, solicite melhorias e aplique as mudanças com um clique — sem sair do editor.",
  },
  {
    icon: GitBranch,
    title: "Edição Multi-arquivo",
    description:
      "A IA consegue propor e aplicar alterações em múltiplos arquivos ao mesmo tempo, mantendo consistência entre componentes, tipos e testes ao longo de todo o repositório.",
  },
  {
    icon: Terminal,
    title: "Baseado no VS Code",
    description:
      "Cursor é um fork do Visual Studio Code. Isso significa compatibilidade total com extensões, temas e atalhos que os desenvolvedores já conhecem, com camadas extras de inteligência.",
  },
  {
    icon: Layers,
    title: "Contexto de Projeto Completo",
    description:
      "Diferente de plugins externos, o Cursor lê o projeto inteiro como contexto, tornando as sugestões muito mais relevantes e reduzindo erros de integração.",
  },
];

const Cursor = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto container-padding text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-full px-4 py-1.5 text-sm mb-2">
              <Bot className="h-4 w-4" />
              Ferramenta de Desenvolvimento
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Cursor
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              O editor de código com IA que acelera o desenvolvimento deste projeto — escrevendo, revisando e corrigindo código em linguagem natural.
            </p>
          </div>
        </section>

        {/* What is Cursor */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto container-padding max-w-3xl space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">O que é o Cursor?</h2>
            <p className="text-muted-foreground leading-relaxed">
              O <strong className="text-foreground">Cursor</strong> é um editor de código de próxima geração que combina a interface familiar do VS Code com modelos de inteligência artificial de ponta. Criado pela Anysphere, ele foi projetado para tornar o desenvolvimento de software mais rápido, preciso e acessível — independentemente do nível de experiência do programador.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Neste projeto, o Cursor foi utilizado para construir e refinar toda a base de código: desde a estrutura de rotas no React até os componentes de UI com Tailwind CSS e Shadcn, passando pelas integrações com Supabase e pela lógica de autenticação do portal interno.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              A ferramenta permitiu uma iteração muito mais ágil: em vez de escrever código repetitivo manualmente, o desenvolvedor descreve a intenção e o Cursor gera, revisa e adapta o código, reduzindo drasticamente o tempo de desenvolvimento sem sacrificar qualidade.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-14 md:py-20 bg-muted/40">
          <div className="container mx-auto container-padding">
            <div className="max-w-3xl mx-auto mb-12 text-center space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold">Principais Recursos</h2>
              <p className="text-muted-foreground">
                O que torna o Cursor diferente de outros editores de código
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="bg-card border border-border rounded-xl p-6 space-y-3 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it was used */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto container-padding max-w-3xl space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Como foi usado neste projeto</h2>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <p>
                  <strong className="text-foreground">Estrutura inicial:</strong> A arquitetura de pastas, rotas do React Router e configuração do Vite foram geradas e refinadas com auxílio do Cursor.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <p>
                  <strong className="text-foreground">Componentes de UI:</strong> Todos os dashboards do portal (Admin, Presidente, User), o Header responsivo e as páginas públicas foram construídos iterativamente no Cursor.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <p>
                  <strong className="text-foreground">Integrações Supabase:</strong> Queries, mutations, autenticação e edge functions foram escritas e depuradas com sugestões da IA integrada ao editor.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <p>
                  <strong className="text-foreground">Refinamentos e correções:</strong> Bugs e melhorias de UX foram identificados e corrigidos em conversas diretas com a IA dentro do editor, sem necessidade de alternar entre ferramentas.
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 md:py-20 bg-muted/40">
          <div className="container mx-auto container-padding max-w-2xl text-center space-y-4">
            <h2 className="text-2xl font-bold">Saiba mais</h2>
            <p className="text-muted-foreground">
              Acesse o site oficial do Cursor para conhecer todos os recursos, planos e documentação.
            </p>
            <a
              href="https://cursor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Code2 className="h-4 w-4" />
              cursor.com
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Cursor;
