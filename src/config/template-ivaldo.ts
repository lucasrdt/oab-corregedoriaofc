/**
 * TEMPLATE IVALDO - Configuração Central
 * Este arquivo centraliza todas as variáveis editáveis do template
 * para facilitar a replicação e personalização do site
 */

export const fullIvaldoTemplate = {
  // Identificação do template
  id: "ivaldo",
  name: "Corregedoria Geral OAB-MA",
  version: "1.0.0",

  // EDITÁVEL PELO GERADOR: SEO
  seo: {
    title: "Corregedoria Geral - OAB Maranhão",
    description: "Corregedoria Geral da Ordem dos Advogados do Brasil - Seccional Maranhão.",
    favicon: "/favicon.jpg", // Favicon padrão branco (será substituído pelo SiteContext quando carregar)
    ogImage: "", // Imagem para compartilhamento em redes sociais (será carregada do banco)
  },

  // EDITÁVEL PELO GERADOR: Cores da marca
  colors: {
    primary: "#1A2238",   // Midnight Navy
    secondary: "#C1A461", // Matte Gold
    background: "#F8F9FA", // Light Off-White - fundo geral
    textDark: "#2D3436",   // Dark Graphite - texto principal
    textLight: "#636e72",  // Slate - texto secundário
  },

  // EDITÁVEL PELO GERADOR: Tipografia
  fonts: {
    heading: "'Roboto', sans-serif", // Fonte para títulos e destaques
    body: "'Roboto', sans-serif", // Fonte para textos gerais
  },

  // EDITÁVEL PELO GERADOR: Dados da empresa
  content: {
    companyName: "Ivaldo Praddo",
    tagline: "administração judicial",
    slogan: "Experiência e Compromisso com a Justiça",

    // Contatos
    phone: "(98) 99116-7252",
    phoneClean: "5598991167252",
    email: "contato@ivaldopraddo.com",
    website: "www.ivaldopraddo.com",
    whatsapp: "5598991167252",

    // Endereços (suporta múltiplos endereços)
    addresses: [
      {
        id: 1,
        street: "Av. do Holandeses, s/n",
        complement: "Edf. Lagoa Corporate, Torre II, salas 809, 810",
        neighborhood: "Ponta D'areia/ Península",
        city: "São Luís",
        state: "MA",
        zip: "65.077-300",
      },
    ],

    // Redes sociais (deixe vazio '' ou remova a propriedade se não usar)
    social: {
      instagram: "https://www.instagram.com/ivaldopraddo?igsh=MWRzcHF5NGF4MDNnZQ==",
      facebook: "", // Deixe vazio se não tiver
      linkedin: "", // Deixe vazio se não tiver
      twitter: "", // Opcional
      youtube: "", // Opcional
    },

    // Logo e Imagens
    logo: {
      text: "Ivaldo Praddo",
      imageUrl: "", // Logo principal (será carregada do banco)
      imageUrlWhite: "", // Logo branca para fundos escuros (será carregada do banco)
    },
    images: {
      hero: "", // Imagem de fundo do Hero (será carregada do banco)
      aboutBackground: "", // Imagem de fundo da seção Quem Somos (será carregada do banco)
    },
    videos: {
      hero: "/videos/hero-background.mp4", // Vídeo de fundo do Hero
    },

    // Quem Somos
    about: {
      title: "Quem Somos",
      description: "Com mais de duas décadas de experiência em administração judicial, atuamos com excelência e compromisso em processos de recuperação judicial e falência em todo o território nacional.",
      benefits: [
        {
          id: 1,
          text: "Experiência Nacional",
          description: "Atuação consolidada em 8 estados brasileiros"
        },
        {
          id: 2,
          text: "Equipe Especializada",
          description: "Profissionais capacitados e dedicados"
        },
        {
          id: 3,
          text: "Processos Complexos",
          description: "Gestão de alta complexidade e rigor técnico"
        },
        {
          id: 4,
          text: "Compromisso e Ética",
          description: "Transparência em cada etapa dos processos"
        },
      ]
    },

    // Mapa do Brasil - Estados destacados
    mapStates: ["MA", "AC", "DF", "BA", "MG", "SP", "MT", "PR"],

    // Estatísticas (números que aparecem no site) - 6 variáveis editáveis
    stats: [
      {
        id: 1,
        label: "processos em\nandamento",
        value: 9,
      },
      {
        id: 2,
        label: "estados de\natuação",
        value: 8,
      },
      {
        id: 3,
        label: "membros na\nequipe",
        value: 7,
      },
      {
        id: 4,
        label: "anos de\nexperiência",
        value: 20,
      },
      {
        id: 5,
        label: "casos\natendidos",
        value: 5000,
      },
      {
        id: 6,
        label: "taxa de\nsucesso",
        value: "95%",
      },
    ],

    // Áreas de atuação/expertise
    expertise: ["Agronegócios", "Transporte", "Comércio", "Indústria", "Construção", "Imobiliário"],

    // Categorias de notícias/artigos
    newsCategories: [
      { id: 1, title: "RECUPERAÇÃO JUDICIAL" },
      { id: 2, title: "ADMINISTRAÇÃO JUDICIAL" },
      { id: 3, title: "ANÁLISE" },
      { id: 4, title: "ASSEMBLEIA" },
      { id: 5, title: "ENTREVISTA" }
    ],

    // Artigos completos para páginas individuais
    articles: [
      {
        id: 1,
        category: "RECUPERAÇÃO JUDICIAL",
        date: "24/01/2024",
        title: "Nova decisão favorável em processo de recuperação judicial",
        excerpt: "Entenda como a decisão recente impacta os credores e o futuro da empresa em recuperação...",
        image: "/placeholder.svg",
        content: `A recente decisão judicial representa um marco importante para o processo de recuperação judicial em andamento. Esta medida impacta diretamente os credores e estabelece novos parâmetros para a continuidade das atividades empresariais.

O entendimento do magistrado considerou diversos aspectos técnicos e econômicos que fundamentam a viabilidade do plano de recuperação apresentado. A decisão leva em conta tanto os interesses dos credores quanto a preservação da atividade econômica e dos empregos.

Entre os pontos destacados na decisão, encontram-se a análise detalhada da capacidade de pagamento da empresa, o cronograma de quitação das dívidas e as garantias oferecidas aos credores. Todos estes elementos foram cuidadosamente avaliados para assegurar o equilíbrio entre as partes.

A administração judicial continuará acompanhando de perto o cumprimento do plano aprovado, garantindo transparência e segurança jurídica a todos os envolvidos no processo.`
      },
      {
        id: 2,
        category: "ADMINISTRAÇÃO JUDICIAL",
        date: "18/01/2024",
        title: "Escritório assume administração de novo caso de grande porte",
        excerpt: "Escritório assume a administração judicial de empresa com mais de 2 mil credores...",
        image: "/placeholder.svg",
        content: `O escritório foi nomeado para administrar judicialmente um dos maiores processos de recuperação judicial do estado, envolvendo mais de 2 mil credores e um passivo significativo.

Este caso representa um desafio importante para a administração judicial, exigindo expertise técnica e capacidade de gestão de processos complexos. A equipe já iniciou os trabalhos de levantamento de ativos e análise da situação econômico-financeira da empresa.

O processo envolve múltiplas áreas de atuação, incluindo análise contábil, avaliação de bens, gestão de credores e acompanhamento de assembleias. Todas as etapas serão conduzidas com total transparência e rigor técnico.

Os credores terão acesso a relatórios periódicos sobre o andamento do processo através de nossa plataforma online, garantindo total visibilidade das ações em curso.`
      },
      {
        id: 3,
        category: "ANÁLISE",
        date: "10/01/2024",
        title: "Cenário econômico e seus reflexos nas recuperações judiciais",
        excerpt: "Especialistas analisam como o momento econômico atual afeta os processos em andamento...",
        image: "/placeholder.svg",
        content: `O cenário econômico atual apresenta desafios específicos para empresas em processo de recuperação judicial. A análise de especialistas aponta para a necessidade de ajustes nos planos de recuperação para adequação à nova realidade.

As variações nas taxas de juros, inflação e câmbio impactam diretamente a capacidade de pagamento das empresas e exigem reavaliação constante das estratégias de recuperação. É fundamental que os planos sejam flexíveis o suficiente para se adaptar a estas mudanças.

Os credores também precisam estar atentos a estes movimentos econômicos, pois afetam diretamente suas expectativas de recebimento. A comunicação transparente entre administração judicial, empresa e credores é essencial neste contexto.

As projeções para os próximos meses indicam a necessidade de cautela, mas também apontam oportunidades para empresas bem estruturadas que conseguirem atravessar este período desafiador.`
      },
      {
        id: 4,
        category: "ASSEMBLEIA",
        date: "05/01/2024",
        title: "Assembleia geral aprova plano de recuperação",
        excerpt: "Credores aprovam plano com 89% dos votos em assembleia histórica...",
        image: "/placeholder.svg",
        content: `Em assembleia realizada de forma virtual, os credores aprovaram por ampla maioria o plano de recuperação judicial apresentado pela empresa. A votação contou com 89% de aprovação, demonstrando a confiança no projeto de reestruturação.

A assembleia contou com a participação de credores de todas as classes, que puderam debater amplamente as propostas apresentadas antes da votação final. O ambiente virtual permitiu maior participação e transparência no processo.

O plano aprovado prevê o pagamento escalonado dos credores ao longo dos próximos anos, com garantias robustas e mecanismos de acompanhamento. A administração judicial seguirá fiscalizando rigorosamente o cumprimento de todas as etapas.

Este resultado representa um marco importante para a empresa e para todos os envolvidos no processo, abrindo caminho para a retomada das atividades em bases mais sólidas.`
      },
      {
        id: 5,
        category: "RECUPERAÇÃO JUDICIAL",
        date: "28/12/2023",
        title: "Balanço 2023: números da administração judicial",
        excerpt: "Retrospectiva mostra crescimento de 15% nos casos administrados pelo escritório...",
        image: "/placeholder.svg",
        content: `O ano de 2023 foi marcado por crescimento significativo nas atividades de administração judicial do escritório. Foram administrados processos que envolveram mais de 20 mil credores e movimentaram valores superiores a R$ 8 bilhões.

Este crescimento reflete tanto a confiança do Poder Judiciário no trabalho realizado quanto a complexidade crescente dos casos de recuperação judicial no país. A equipe foi ampliada para atender à demanda crescente, mantendo os padrões de qualidade e eficiência.

Entre os destaques do ano, estão a conclusão bem-sucedida de três grandes processos, a implementação de novas ferramentas tecnológicas para gestão de processos e o aumento na taxa de satisfação dos credores.

Para 2024, as perspectivas são de continuidade no crescimento, com novos desafios e oportunidades no horizonte.`
      },
      {
        id: 6,
        category: "ENTREVISTA",
        date: "15/12/2023",
        title: "Perspectivas para 2024",
        excerpt: "Em entrevista exclusiva, equipe fala sobre desafios e oportunidades para o próximo ano...",
        image: "/placeholder.svg",
        content: `Em entrevista exclusiva, a equipe do escritório compartilha suas perspectivas e expectativas para 2024, ano que promete ser desafiador mas repleto de oportunidades no campo da administração judicial.

Os principais desafios identificados incluem a adaptação às mudanças econômicas, a necessidade de maior digitalização dos processos e a gestão de casos cada vez mais complexos. Por outro lado, vemos oportunidades importantes na consolidação de boas práticas e no fortalecimento das relações com credores.

A tecnologia será uma aliada fundamental, permitindo maior agilidade e transparência nos processos. Investimentos em novas plataformas e ferramentas estão previstos para o próximo ano.

A equipe reafirma seu compromisso com a excelência no atendimento e na gestão dos processos, sempre pautada pela ética, transparência e rigor técnico.`
      }
    ],

    // Horário de atendimento
    businessHours: {
      weekdays: "Segunda a Sexta: 8h às 18h",
      saturday: "Sábado: 8h às 12h",
      sunday: "Domingo: Fechado",
    },

    // Dúvidas Frequentes
    faq: [
      {
        id: 1,
        question: "O que é administração judicial?",
        answer: "A administração judicial é o processo de gestão de empresas em recuperação judicial ou falência, realizado por profissionais especializados para preservar os ativos da empresa e viabilizar o pagamento dos credores."
      },
      {
        id: 2,
        question: "Como consultar meu processo?",
        answer: "Você pode consultar seu processo através da área do credor em nosso site, utilizando seu CPF/CNPJ e número do processo. Também é possível entrar em contato com nossa equipe através dos canais de atendimento."
      },
      {
        id: 3,
        question: "Quais documentos são necessários para habilitação de crédito?",
        answer: "Os documentos necessários incluem: comprovante de crédito (notas fiscais, contratos, etc.), documentos pessoais do credor (RG, CPF para pessoa física ou contrato social para pessoa jurídica), e procuração caso seja representado por advogado."
      },
      {
        id: 4,
        question: "Quanto tempo dura um processo de recuperação judicial?",
        answer: "O tempo de duração varia de acordo com a complexidade do caso, mas geralmente um processo de recuperação judicial dura entre 2 e 5 anos, desde o pedido inicial até a homologação final."
      },
      {
        id: 5,
        question: "Como participo das assembleias?",
        answer: "As datas das assembleias são publicadas em nosso calendário. É importante comparecer ou enviar um representante legal com procuração adequada."
      },
      {
        id: 6,
        question: "O que acontece se o plano de recuperação não for aprovado?",
        answer: "Caso o plano de recuperação judicial não seja aprovado pela assembleia de credores, o juiz pode decretar a falência da empresa ou solicitar a apresentação de um novo plano modificado."
      }
    ],

    // EDITÁVEL PELO ADMIN: Assembleias
    assemblies: [
      {
        id: 1,
        date: new Date(2025, 10, 5), // 5 de novembro de 2025
        companyName: "ANG COMERCIO EXTO",
        fullCompanyName: "ANG COMERCIO EXPORTAÇÃO E IMPORTAÇÃO LTDA.",
        convocation: "2ª CONVOCAÇÃO, 2º PROSSEGUIMENTO",
        description:
          "Ficam convocados todos os credores e demais interessados para a Assembleia Geral de Credores na plataforma virtual disponibilizada pela Administração Judicial e acessível através do link: https://us06web.zoom.us/j/89564183039.",
        meetingLink: "https://us06web.zoom.us/j/89564183039",
        accessTime:
          "A plataforma virtual da assembleia estará disponível para acesso a partir das 13h para credenciamento.",
        status: "Aberta", // Aberta, Encerrada, Cancelada
      },
      {
        id: 2,
        date: new Date(2025, 10, 12),
        companyName: "BRASIL SUL COMERCIO",
        fullCompanyName: "BRASIL SUL COMÉRCIO E DISTRIBUIÇÃO LTDA.",
        convocation: "1ª CONVOCAÇÃO",
        description:
          "Ficam convocados todos os credores e demais interessados para a Assembleia Geral de Credores na plataforma virtual disponibilizada pela Administração Judicial e acessível através do link: https://us06web.zoom.us/j/89564183039.",
        meetingLink: "https://us06web.zoom.us/j/89564183039",
        accessTime:
          "A plataforma virtual da assembleia estará disponível para acesso a partir das 14h para credenciamento.",
        status: "Aberta",
      },
      {
        id: 3,
        date: new Date(2025, 10, 15),
        companyName: "QTNI TRANSPORTES",
        fullCompanyName: "QTNI TRANSPORTES E LOGÍSTICA S.A.",
        convocation: "3ª CONVOCAÇÃO",
        description:
          "Ficam convocados todos os credores e demais interessados para a Assembleia Geral de Credores na plataforma virtual disponibilizada pela Administração Judicial e acessível através do link: https://us06web.zoom.us/j/89564183039.",
        meetingLink: "https://us06web.zoom.us/j/89564183039",
        accessTime:
          "A plataforma virtual da assembleia estará disponível para acesso a partir das 13h para credenciamento.",
        status: "Aberta",
      },
      {
        id: 4,
        date: new Date(2025, 10, 20),
        companyName: "MERCOPANPA TRANS",
        fullCompanyName: "MERCOPANPA TRANSPORTES RODOVIÁRIOS LTDA.",
        convocation: "1ª CONVOCAÇÃO, 1º PROSSEGUIMENTO",
        description:
          "Ficam convocados todos os credores e demais interessados para a Assembleia Geral de Credores na plataforma virtual disponibilizada pela Administração Judicial e acessível através do link: https://us06web.zoom.us/j/89564183039.",
        meetingLink: "https://us06web.zoom.us/j/89564183039",
        accessTime:
          "A plataforma virtual da assembleia estará disponível para acesso a partir das 15h para credenciamento.",
        status: "Aberta",
      },
      {
        id: 5,
        date: new Date(2025, 10, 23),
        companyName: "AELBRA EDUCAÇÃO",
        fullCompanyName: "AELBRA EDUCAÇÃO E TECNOLOGIA LTDA.",
        convocation: "2ª CONVOCAÇÃO",
        description:
          "Ficam convocados todos os credores e demais interessados para a Assembleia Geral de Credores na plataforma virtual disponibilizada pela Administração Judicial e acessível através do link: https://us06web.zoom.us/j/89564183039.",
        meetingLink: "https://us06web.zoom.us/j/89564183039",
        accessTime:
          "A plataforma virtual da assembleia estará disponível para acesso a partir das 13h para credenciamento.",
        status: "Aberta",
      },
      {
        id: 6,
        date: new Date(2025, 10, 28),
        companyName: "MAXIMA DISTRIBUIDO",
        fullCompanyName: "MAXIMA DISTRIBUIDORA DE MDF LTDA. E MADEIRO MDF LTDA",
        convocation: "2ª CONVOCAÇÃO, 2º PROSSEGUIMENTO",
        description:
          "Ficam convocados todos os credores e demais interessados para a Assembleia Geral de Credores na plataforma virtual disponibilizada pela Administração Judicial e acessível através do link: https://us06web.zoom.us/j/89564183039.",
        meetingLink: "https://us06web.zoom.us/j/89564183039",
        accessTime:
          "A plataforma virtual da assembleia estará disponível para acesso a partir das 13h para credenciamento.",
        status: "Aberta",
      },
      {
        id: 7,
        date: new Date(2025, 10, 31),
        companyName: "TRESBOMM COMÉRCIO",
        fullCompanyName: "TRESBOMM COMÉRCIO E SERVIÇOS LTDA.",
        convocation: "1ª CONVOCAÇÃO",
        description:
          "Ficam convocados todos os credores e demais interessados para a Assembleia Geral de Credores na plataforma virtual disponibilizada pela Administração Judicial e acessível através do link: https://us06web.zoom.us/j/89564183039.",
        meetingLink: "https://us06web.zoom.us/j/89564183039",
        accessTime:
          "A plataforma virtual da assembleia estará disponível para acesso a partir das 14h para credenciamento.",
        status: "Aberta",
      },
    ],

    // Tipos de casos e suas informações
    caseTypes: [
      {
        id: "recuperacao-judicial",
        slug: "recuperacao-judicial",
        title: "Recuperação Judicial",
        description: "O que é recuperação judicial?",
        explanation: "É um procedimento instituído pela Lei n.º 11.101/2005, utilizado por empresários individuais e sociedades empresárias que desejam superar crises econômico-financeiras e evitar a decretação de falência.\n\nA recuperação judicial possibilita a renegociação do passivo com a elaboração de um plano que engloba propostas de pagamento e estratégias de soerguimento. Este plano é apresentado pela empresa nos autos do processo, e, caso algum credor manifeste objeção aos seus termos, será designada uma assembleia-geral de credores para deliberação da proposta.\n\nCaso o plano seja aprovado pelos credores e homologado pelo Juiz condutor do processo, as obrigações da empresa devedora são novadas. Através disso, permite-se que a devedora modifique substancialmente seu perfil de endividamento, a viabilizar a preservação de sua atuação no mercado.\n\nEm síntese, o processo de recuperação judicial oferece um amparo a que a empresa reverta sua situação de insolvência, porém sem perder de vista os interesses de seus credores. Assim, privilegia-se o empreendedorismo e fomenta-se a atividade econômica, a geração de empregos e o recolhimento de tributos."
      },
      {
        id: "falencia",
        slug: "falencia",
        title: "Falência",
        description: "O que é falência?",
        explanation: "A falência é um processo judicial destinado à liquidação dos bens do devedor empresário para satisfação dos credores. É decretada pelo juiz quando verificada a impossibilidade de recuperação da empresa e o não pagamento de dívidas líquidas vencidas.\n\nQuando uma empresa não consegue mais honrar suas obrigações financeiras e não há possibilidade de recuperação, o juiz decreta a falência. Este processo visa a arrecadação, administração e venda dos bens da empresa para pagamento dos credores, seguindo a ordem de preferência estabelecida em lei.\n\nO administrador judicial fica responsável por administrar os bens do falido, realizar o inventário patrimonial, e proceder à alienação dos ativos para converter em recursos financeiros destinados ao pagamento dos credores.\n\nDiferentemente da recuperação judicial, na falência não há perspectiva de continuidade das atividades empresariais. O objetivo é encerrar a empresa de forma ordenada, preservando ao máximo os direitos dos credores."
      },
      {
        id: "administracao-judicial",
        slug: "administracao-judicial",
        title: "Administração Judicial",
        description: "O que é administração judicial?",
        explanation: "A administração judicial é exercida por profissional especializado nomeado pelo juiz para fiscalizar as atividades do devedor em recuperação judicial, receber e processar as habilitações de créditos, além de convocar e presidir as assembleias gerais de credores.\n\nO administrador judicial atua como um auxiliar da justiça, zelando pela lisura e transparência do processo de recuperação judicial ou falência. Entre suas atribuições está a verificação da regularidade do plano de recuperação, análise das habilitações de crédito apresentadas pelos credores, e prestação de contas ao juízo.\n\nEm processos de recuperação judicial, o administrador monitora o cumprimento das obrigações assumidas pela empresa recuperanda, apresenta relatórios mensais sobre as atividades da empresa, e manifesta-se sobre qualquer questão relevante ao processo.\n\nSua atuação é fundamental para garantir o equilíbrio entre os interesses da empresa em recuperação e os direitos dos credores, sempre sob a supervisão do Poder Judiciário."
      },
      {
        id: "litisconsorcio",
        slug: "litisconsorcio",
        title: "Litisconsórcio",
        description: "O que é litisconsórcio?",
        explanation: "Litisconsórcio ocorre quando há pluralidade de partes no polo ativo ou passivo de uma ação judicial. Em processos de recuperação judicial, é comum quando várias empresas do mesmo grupo econômico buscam a recuperação conjunta.\n\nQuando empresas de um mesmo grupo empresarial enfrentam dificuldades financeiras correlacionadas, podem requerer a recuperação judicial em litisconsórcio, ou seja, conjuntamente no mesmo processo. Isso permite uma visão integrada da situação econômico-financeira do grupo e facilita a elaboração de um plano de recuperação unificado.\n\nO litisconsórcio pode ser ativo (quando várias empresas figuram como requerentes) ou passivo (quando há vários requeridos). No contexto da recuperação judicial, o litisconsórcio ativo é mais comum, permitindo economia processual e melhor coordenação das atividades de reestruturação.\n\nEsta modalidade é particularmente útil quando as empresas do grupo possuem operações integradas, compartilham credores, ou quando a viabilidade de uma depende da recuperação das demais."
      }
    ],

    // Empresas/Casos (dados de exemplo)
    companies: [
      // Recuperação Judicial
      {
        id: 1,
        name: "ABASTECEDORA DE COMBUSTÍVEIS PERSICI LTDA",
        initials: "AC",
        logo: "",
        caseType: "recuperacao-judicial",
        comarca: "São Luís",
        uf: "MA",
        processo: "0012345-12.2024.8.10.0001",
        passivo: "R$ 50.000.000,00",
        credores: 150,
        linkHabilitacoes: "",
        especialistaResponsavel: "Ana Clara Andrade Ranzani",
        ajuizamento: "29/11/2022",
        deferimento: "22/03/2023",
        vara: "1ª Vara Cível",
        highlighted: true,
        documentos: {
          principais: [
            { id: 1, nome: "Petição Inicial", url: "#" },
            { id: 2, nome: "Decisão de Deferimento do Processamento da Recuperação Judicial", url: "#" },
            { id: 3, nome: "Edital do art. 52, § 1º, da Lei 11.101/2005", url: "#" },
            { id: 4, nome: "Plano de Recuperação Judicial", url: "#" },
            { id: 5, nome: "Demonstrações Financeiras", url: "#" }
          ],
          relatorioAtividades: [
            { id: 1, nome: "Relatório Mensal - Janeiro 2024", url: "#" },
            { id: 2, nome: "Relatório Mensal - Fevereiro 2024", url: "#" },
            { id: 3, nome: "Relatório Mensal - Março 2024", url: "#" },
            { id: 4, nome: "Relatório Mensal - Abril 2024", url: "#" }
          ],
          atas: [
            { id: 1, nome: "Ata da Assembleia Geral de Credores - 1ª Convocação", url: "#" },
            { id: 2, nome: "Ata da Assembleia Geral de Credores - 2ª Convocação", url: "#" },
            { id: 3, nome: "Ata de Deliberação sobre o Plano de Recuperação", url: "#" }
          ],
          relatorioIncidentes: [
            { id: 1, nome: "Incidente Processual - Habilitação de Crédito", url: "#" },
            { id: 2, nome: "Impugnação de Crédito - Credor XYZ", url: "#" }
          ],
          relatorioOficios: [
            { id: 1, nome: "Ofício ao Banco Central", url: "#" },
            { id: 2, nome: "Ofício à Receita Federal", url: "#" },
            { id: 3, nome: "Ofício ao INSS", url: "#" }
          ],
          relatorioCreditos: [
            { id: 1, nome: "Relatório de Verificação de Créditos - Fase 1", url: "#" },
            { id: 2, nome: "Relatório de Verificação de Créditos - Fase 2", url: "#" },
            { id: 3, nome: "Quadro Geral de Credores", url: "#" }
          ]
        }
      },
      {
        id: 2,
        name: "Grupo Baza Ipanema",
        initials: "GB",
        logo: "",
        caseType: "recuperacao-judicial",
        comarca: "São Paulo",
        uf: "SP",
        processo: "0012346-12.2024.8.26.0100",
        passivo: "R$ 504.069.737,49",
        credores: 2232,
        linkHabilitacoes: "",
        especialistaResponsavel: "Dr. João Silva Santos",
        ajuizamento: "15/05/2023",
        deferimento: "10/08/2023",
        vara: "2ª Vara de Falências e Recuperações Judiciais",
        documentos: {
          principais: [
            { id: 1, nome: "Petição Inicial", url: "#" },
            { id: 2, nome: "Plano de Recuperação Judicial", url: "#" }
          ],
          relatorioAtividades: [],
          atas: [],
          relatorioIncidentes: [],
          relatorioOficios: [],
          relatorioCreditos: []
        }
      },
      {
        id: 3,
        name: "RR Viana Transportes",
        initials: "RV",
        logo: "",
        caseType: "recuperacao-judicial",
        comarca: "Curitiba",
        uf: "PR",
        processo: "0012347-12.2024.8.16.0001",
        passivo: "R$ 18.220.462,73",
        credores: 334,
        linkHabilitacoes: "",
        especialistaResponsavel: "Dra. Maria Oliveira",
        ajuizamento: "20/06/2023",
        deferimento: "30/09/2023",
        vara: "1ª Vara Cível",
        documentos: {
          principais: [],
          relatorioAtividades: [],
          atas: [],
          relatorioIncidentes: [],
          relatorioOficios: [],
          relatorioCreditos: []
        }
      },
      {
        id: 4,
        name: "Grupo Morroque Agropecuária",
        initials: "GM",
        logo: "",
        caseType: "recuperacao-judicial",
        comarca: "Belo Horizonte",
        uf: "MG",
        processo: "0012349-12.2024.8.13.0024",
        passivo: "R$ 183.800.699,15",
        credores: 51,
        linkHabilitacoes: "",
        especialistaResponsavel: "Dr. Carlos Eduardo",
        ajuizamento: "10/03/2023",
        deferimento: "25/06/2023",
        vara: "3ª Vara Empresarial",
        documentos: {
          principais: [],
          relatorioAtividades: [],
          atas: [],
          relatorioIncidentes: [],
          relatorioOficios: [],
          relatorioCreditos: []
        }
      },
      {
        id: 5,
        name: "BF Agro Exportação",
        initials: "BF",
        logo: "",
        caseType: "recuperacao-judicial",
        comarca: "Brasília",
        uf: "DF",
        processo: "0012350-12.2024.8.07.0001",
        passivo: "R$ 127.450.320,88",
        credores: 289,
        linkHabilitacoes: "",
        especialistaResponsavel: "Dra. Patricia Lima",
        ajuizamento: "05/04/2023",
        deferimento: "18/07/2023",
        vara: "1ª Vara de Falências",
        documentos: {
          principais: [],
          relatorioAtividades: [],
          atas: [],
          relatorioIncidentes: [],
          relatorioOficios: [],
          relatorioCreditos: []
        }
      },
      {
        id: 6,
        name: "Engefort Construções",
        initials: "EC",
        logo: "",
        caseType: "recuperacao-judicial",
        comarca: "Salvador",
        uf: "BA",
        processo: "0012351-12.2024.8.05.0001",
        passivo: "R$ 95.340.127,33",
        credores: 412,
        linkHabilitacoes: "",
        especialistaResponsavel: "Dr. Roberto Almeida",
        ajuizamento: "12/02/2023",
        deferimento: "30/05/2023",
        vara: "2ª Vara Cível",
        documentos: {
          principais: [],
          relatorioAtividades: [],
          atas: [],
          relatorioIncidentes: [],
          relatorioOficios: [],
          relatorioCreditos: []
        }
      },

      // Falência
      {
        id: 7,
        name: "San Pietro Indústria Têxtil",
        initials: "SP",
        logo: "",
        caseType: "falencia",
        comarca: "Rio de Janeiro",
        uf: "RJ",
        processo: "0012348-12.2024.8.19.0001",
        passivo: "R$ 653.873.257,76",
        credores: 2000,
        linkHabilitacoes: "",
        especialistaResponsavel: "Dr. Fernando Costa",
        ajuizamento: "08/01/2023",
        deferimento: "20/04/2023",
        vara: "1ª Vara Empresarial",
        documentos: {
          principais: [],
          relatorioAtividades: [],
          atas: [],
          relatorioIncidentes: [],
          relatorioOficios: [],
          relatorioCreditos: []
        }
      },
      {
        id: 8,
        name: "Metalúrgica Nordeste S.A.",
        initials: "MN",
        logo: "",
        caseType: "falencia",
        comarca: "São Luís",
        uf: "MA",
        processo: "0012352-12.2024.8.10.0001",
        passivo: "R$ 42.890.450,22",
        credores: 187,
        linkHabilitacoes: "",
        especialistaResponsavel: "Dra. Juliana Martins",
        ajuizamento: "15/09/2022",
        deferimento: "10/12/2022",
        vara: "2ª Vara Cível",
        documentos: {
          principais: [],
          relatorioAtividades: [],
          atas: [],
          relatorioIncidentes: [],
          relatorioOficios: [],
          relatorioCreditos: []
        }
      },
      {
        id: 9,
        name: "Plásticos do Sul Ltda",
        initials: "PS",
        logo: "",
        caseType: "falencia",
        comarca: "Porto Alegre",
        uf: "RS",
        processo: "0012353-12.2024.8.21.0001",
        passivo: "R$ 28.567.893,45",
        credores: 98,
        linkHabilitacoes: "",
        especialistaResponsavel: "Dr. André Souza",
        ajuizamento: "22/07/2023",
        deferimento: "05/10/2023",
        vara: "3ª Vara Cível",
        documentos: {
          principais: [],
          relatorioAtividades: [],
          atas: [],
          relatorioIncidentes: [],
          relatorioOficios: [],
          relatorioCreditos: []
        }
      },
      {
        id: 10,
        name: "Cerâmica Imperial",
        initials: "CI",
        logo: "",
        caseType: "falencia",
        comarca: "Manaus",
        uf: "AM",
        processo: "0012354-12.2024.8.04.0001",
        passivo: "R$ 15.234.678,90",
        credores: 54,
        linkHabilitacoes: "",
        especialistaResponsavel: "Dra. Camila Rocha",
        ajuizamento: "30/04/2023",
        deferimento: "15/07/2023",
        vara: "1ª Vara Cível",
        documentos: {
          principais: [],
          relatorioAtividades: [],
          atas: [],
          relatorioIncidentes: [],
          relatorioOficios: [],
          relatorioCreditos: []
        }
      },

      // Administração Judicial
      {
        id: 11,
        name: "FCA Incorporadora",
        initials: "FC",
        logo: "",
        caseType: "administracao-judicial",
        comarca: "São Paulo",
        uf: "SP",
        processo: "0012355-12.2024.8.26.0100",
        passivo: "R$ 234.567.890,12",
        credores: 876,
        linkHabilitacoes: "",
        especialistaResponsavel: "Dr. Marcos Vieira",
        ajuizamento: "18/08/2023",
        deferimento: "02/11/2023",
        vara: "1ª Vara de Falências e Recuperações Judiciais",
        documentos: {
          principais: [],
          relatorioAtividades: [],
          atas: [],
          relatorioIncidentes: [],
          relatorioOficios: [],
          relatorioCreditos: []
        }
      },
      {
        id: 12,
        name: "RTD Holding Empresarial",
        initials: "RH",
        logo: "",
        caseType: "administracao-judicial",
        comarca: "Curitiba",
        uf: "PR",
        processo: "0012356-12.2024.8.16.0001",
        passivo: "R$ 156.789.234,56",
        credores: 543,
        linkHabilitacoes: "",
        especialistaResponsavel: "Dra. Beatriz Campos",
        ajuizamento: "25/05/2023",
        deferimento: "10/08/2023",
        vara: "2ª Vara Empresarial",
        documentos: {
          principais: [],
          relatorioAtividades: [],
          atas: [],
          relatorioIncidentes: [],
          relatorioOficios: [],
          relatorioCreditos: []
        }
      },
      {
        id: 13,
        name: "Distribuidora Centro-Oeste",
        initials: "DC",
        logo: "",
        caseType: "administracao-judicial",
        comarca: "Cuiabá",
        uf: "MT",
        processo: "0012357-12.2024.8.11.0001",
        passivo: "R$ 89.456.123,78",
        credores: 321,
        linkHabilitacoes: "",
        especialistaResponsavel: "Dr. Rafael Mendes",
        ajuizamento: "10/06/2023",
        deferimento: "22/09/2023",
        vara: "1ª Vara Cível",
        documentos: {
          principais: [],
          relatorioAtividades: [],
          atas: [],
          relatorioIncidentes: [],
          relatorioOficios: [],
          relatorioCreditos: []
        }
      },
      {
        id: 14,
        name: "Comércio Bahia Norte",
        initials: "CB",
        logo: "",
        caseType: "administracao-judicial",
        comarca: "Salvador",
        uf: "BA",
        processo: "0012358-12.2024.8.05.0001",
        passivo: "R$ 67.234.567,89",
        credores: 234,
        linkHabilitacoes: "",
        especialistaResponsavel: "Dra. Sandra Reis",
        ajuizamento: "05/07/2023",
        deferimento: "18/10/2023",
        vara: "3ª Vara Cível",
        documentos: {
          principais: [],
          relatorioAtividades: [],
          atas: [],
          relatorioIncidentes: [],
          relatorioOficios: [],
          relatorioCreditos: []
        }
      },

      // Litisconsórcio
      {
        id: 15,
        name: "Grupo NorteGrãos",
        initials: "GN",
        logo: "",
        caseType: "litisconsorcio",
        comarca: "Rio Branco",
        uf: "AC",
        processo: "0012359-12.2024.8.01.0001",
        passivo: "R$ 345.678.901,23",
        credores: 1234,
        linkHabilitacoes: "",
        especialistaResponsavel: "Dr. Paulo Henrique",
        ajuizamento: "12/09/2023",
        deferimento: "28/11/2023",
        vara: "1ª Vara Cível",
        documentos: {
          principais: [],
          relatorioAtividades: [],
          atas: [],
          relatorioIncidentes: [],
          relatorioOficios: [],
          relatorioCreditos: []
        }
      },
      {
        id: 16,
        name: "Conglomerado ABC Empresas",
        initials: "CA",
        caseType: "litisconsorcio",
        comarca: "Belo Horizonte",
        uf: "MG",
        processo: "0012360-12.2024.8.13.0024",
        passivo: "R$ 278.901.234,56",
        credores: 987,
        linkHabilitacoes: "",
        especialistaResponsavel: "Dra. Luciana Fernandes",
        ajuizamento: "20/10/2023",
        deferimento: "05/12/2023",
        vara: "2ª Vara Empresarial",
        documentos: {
          principais: [],
          relatorioAtividades: [],
          atas: [],
          relatorioIncidentes: [],
          relatorioOficios: [],
          relatorioCreditos: []
        }
      },
      {
        id: 17,
        name: "Grupo Transportes Unidos",
        initials: "GT",
        caseType: "litisconsorcio",
        comarca: "Brasília",
        uf: "DF",
        processo: "0012361-12.2024.8.07.0001",
        passivo: "R$ 198.765.432,10",
        credores: 654,
        linkHabilitacoes: "",
        especialistaResponsavel: "Dr. Gabriel Pereira",
        ajuizamento: "15/11/2023",
        deferimento: "20/12/2023",
        vara: "1ª Vara de Falências",
        documentos: {
          principais: [],
          relatorioAtividades: [],
          atas: [],
          relatorioIncidentes: [],
          relatorioOficios: [],
          relatorioCreditos: []
        }
      },
      {
        id: 18,
        name: "Holding Agrícola Sul",
        initials: "HA",
        caseType: "litisconsorcio",
        comarca: "Curitiba",
        uf: "PR",
        processo: "0012362-12.2024.8.16.0001",
        passivo: "R$ 156.432.109,87",
        credores: 432,
        linkHabilitacoes: "",
        especialistaResponsavel: "Dra. Amanda Silva",
        ajuizamento: "28/09/2023",
        deferimento: "15/11/2023",
        vara: "3ª Vara Empresarial",
        documentos: {
          principais: [],
          relatorioAtividades: [],
          atas: [],
          relatorioIncidentes: [],
          relatorioOficios: [],
          relatorioCreditos: []
        }
      }
    ],

    // Processos Mais Consultados (destaque na home)
    mostConsulted: [
      { id: 1, company: "Grupo Baza Ipanema", passivo: "R$ 504.069.737,49", credores: 2232, logo: "/placeholder.svg" },
      { id: 2, company: "RR Viana", passivo: "R$ 18.220.462,73", credores: 334, logo: "/placeholder.svg" },
      { id: 3, company: "San Pietro", passivo: "R$ 653.873.257,76", credores: 2000, logo: "/placeholder.svg" },
      { id: 4, company: "Grupo Morroque", passivo: "R$ 183.800.699,15", credores: 51, logo: "/placeholder.svg" },
      { id: 5, company: "RTD Holding Ltda", passivo: "R$ 59.848.764,43", credores: 230, logo: "/placeholder.svg" },
      { id: 6, company: "Engefort", passivo: "R$ 2.173.318.067,79", credores: 5129, logo: "/placeholder.svg" },
      { id: 7, company: "Grupo B&F Agro", passivo: "R$ 3.283.242.261,83", credores: 8114, logo: "/placeholder.svg" },
      { id: 8, company: "FCA Incorp. e Const.", passivo: "R$ 438.578.668,60", credores: 12984, logo: "/placeholder.svg" },
      { id: 9, company: "Nortegrãos", passivo: "R$ 150.000.000,00", credores: 500, logo: "/placeholder.svg" },
    ],
    footer: {
      copyright: "© 2024 Ivaldo Praddo. Todos os direitos reservados.",
      description: "Administração Judicial com excelência e compromisso."
    }
  },

  // EDITÁVEL PELO GERADOR: Áreas de atuação jurídica
  practiceAreas: [
    {
      id: 1,
      title: "Recuperação Judicial",
      description:
        "Assessoria completa em processos de recuperação judicial, desde a análise viabilidade até a homologação do plano.",
      icon: "Scale",
    },
    {
      id: 2,
      title: "Administração Judicial",
      description: "Gestão profissional e transparente de processos de recuperação judicial e falências.",
      icon: "Briefcase",
    },
    {
      id: 3,
      title: "Direito Empresarial",
      description: "Consultoria jurídica estratégica para empresas de todos os portes e segmentos.",
      icon: "Building",
    },
    {
      id: 4,
      title: "Falências",
      description:
        "Acompanhamento completo de processos falimentares com foco na preservação dos interesses dos credores.",
      icon: "FileText",
    },
    {
      id: 5,
      title: "Direito Tributário",
      description: "Planejamento tributário e defesa em processos administrativos e judiciais.",
      icon: "Calculator",
    },
    {
      id: 6,
      title: "Contencioso Cível",
      description: "Representação judicial em ações cíveis de alta complexidade.",
      icon: "Gavel",
    },
  ],

  // EDITÁVEL PELO GERADOR: Depoimentos
  testimonials: [
    {
      id: 1,
      name: "João Silva",
      role: "CEO - Empresa XYZ",
      content:
        "Profissionalismo e dedicação excepcionais. A equipe do Ivaldo Praddo foi fundamental para a recuperação da nossa empresa.",
      rating: 5,
    },
    {
      id: 2,
      name: "Maria Santos",
      role: "Diretora Financeira - ABC Ltda",
      content: "Atendimento personalizado e resultados concretos. Recomendo fortemente os serviços prestados.",
      rating: 5,
    },
    {
      id: 3,
      name: "Pedro Oliveira",
      role: "Empresário",
      content:
        "Competência técnica aliada a um atendimento humanizado. Excelente trabalho em todas as etapas do processo.",
      rating: 5,
    },
  ],

  // EDITÁVEL PELO GERADOR: Membros da equipe
  team: [
    {
      id: 1,
      name: "Ivaldo Praddo",
      role: "Fundador",
      oab: "",
      description:
        "Advogado e Administrador de Empresas. Formação em Recuperação Judicial e Falências (ESMEG-TJGO, PUC-PR/EBRADI). Credenciado como Perito Administrador Judicial no TJMA, TJPI, TJPA, TJPR, TJBA, TJMG, TJMS, TJMT, TJDFT. MBA em Gestão Empresarial pela FGV, MBA em Contabilidade, Controladoria e Auditoria, MBA em Gestão e Governança, Pós-Graduado em Direito Processual, MBA em Administração e Agronegócios, Formação no Método Harvard de Negociação pela CMI Interser e Negociação Internacional pela CAENI/IRI/USP, Formação em Valuation e Métricas de Valor (USP). Secretario-Geral Adjunto e Corregedor Geral da OAB-MA (2025-2027), Presidente do Conselho Regional de Administração do Maranhão (2023-2024), Presidente da Caixa de Assistência dos Advogados do Maranhão (2022-2024).",
      email: "contato@ivaldopraddo.com",
      photo: "/team/member-4.jpg",
    },
    {
      id: 2,
      name: "Dra. Joana Pessoa",
      role: "Advogada",
      oab: "OAB-MA 8598",
      description:
        "Advogada desde 2008, Especializada em Direito Público, Pós-Graduada em Direito Tributário, Eleitoral, Controle Interno, Licitações e Contratos. Já foi Procuradora Geral de vários Municípios, Procuradora Geral do CRO-MA, Conselheira Estadual da OAB-MA, Membro do TED/OAB-MA",
      email: "contato@ivaldopraddo.com",
      photo: "/team/member-5.jpg",
    },
    {
      id: 3,
      name: "João Júnior",
      role: "Perito, Contador",
      oab: "CRC-MA 006054/O-0",
      description:
        "Contador e Auditor, Perito na Justiça Federal do Maranhão, Administrador Judicial em RJ/TJMA, Contador da OAB-MA, CAAMA, CRA-MA e CRO-MA, com vasta experiência em auditoria, perícia e contabilidade comercial e pública.",
      email: "contato@ivaldopraddo.com",
      photo: "/team/member-7.jpg",
    },
    {
      id: 4,
      name: "Dra. Olivia Brandão Melo",
      role: "Advogada",
      oab: "OAB-PI 9652",
      description:
        "Professora Doutora da Faculdade de Direito da Universidade Federal do Piauí, Coordenadora do Núcleo de Prática Jurídica da UFPI, Presidente da Comissão de Processo Civil da OAB/PI 2022-2024",
      email: "contato@ivaldopraddo.com",
      photo: "/team/member-1.jpg",
    },
    {
      id: 5,
      name: "Dr. Talmy Tércio Junior",
      role: "Advogado",
      oab: "OAB-PI 6170",
      description:
        "Procurador Municipal, Mestre em Direito pela Universidade Autônoma de Lisboa, Pós-Graduado em Ciências Jurídicas e Direito Público, Professor de Direito, Coordenador de Direito entre os anos de 2012 a 2019 em faculdade Privada de Teresina, Diretor do Núcleo de Apoio à Advocacia da OAB (Gestão 2016/2018) e Presidente da Caixa de Assistência dos Advogados do Piauí - CAAPI (Gestão 2022/2024)",
      email: "contato@ivaldopraddo.com",
      photo: "/team/member-6.jpg",
    },
    {
      id: 6,
      name: "Francisco de Assis R. Miranda Junior",
      role: "Advogado",
      oab: "OAB-PA 8278",
      description:
        "Advogado e Contador, Vice-Presidente da OAB/PA Gestão 2022-2024, já foi Presidente da CAA/PA Gestão 2013-2015",
      email: "contato@ivaldopraddo.com",
      photo: "/team/member-2.jpg",
    },
    {
      id: 7,
      name: "Gilvar Paim De Oliveira",
      role: "Advogado",
      oab: "OAB-RS 49.296",
      description:
        'Advogado. Bacharel em Ciências Jurídicas e Sociais pela Universidade Federal do Rio Grande do Sul - UFRGS. Membro do Comitê Brasileiro de Arbitragem – CBAr e do Grupo de Estudos e Pesquisas em "Direito Empresarial Contemporâneo e Liberdade Negocial".',
      email: "contato@ivaldopraddo.com",
      photo: "/team/member-3.png",
    },
  ],

  // Design system - não editar diretamente, usar as cores acima
  design: {
    borderRadius: {
      sm: "0.25rem",
      md: "0.5rem",
      lg: "1rem",
    },
    spacing: {
      section: "py-16 md:py-24",
      container: "px-4 md:px-8 lg:px-12 xl:px-16",
    },
    shadows: {
      sm: "0 1px 2px 0 rgba(17, 61, 62, 0.05)",
      md: "0 4px 6px -1px rgba(17, 61, 62, 0.1)",
      lg: "0 10px 15px -3px rgba(17, 61, 62, 0.1)",
    },
  },
};

export const skeletonTemplate = {
  id: "skeleton",
  name: "Carregando...",
  version: "1.0.0",
  seo: { title: "", description: "", favicon: "", ogImage: "" },
  colors: {
    primary: "#e5e7eb", // gray-200
    secondary: "#f3f4f6", // gray-100
    background: "#ffffff",
    textDark: "#d1d5db", // gray-300
    textLight: "#e5e7eb", // gray-200
  },
  fonts: { heading: "sans-serif", body: "sans-serif" },
  content: {
    companyName: "",
    tagline: "",
    slogan: "",
    phone: "",
    phoneClean: "",
    email: "",
    website: "",
    whatsapp: "",
    addresses: [],
    social: { instagram: "", facebook: "", linkedin: "", twitter: "", youtube: "" },
    logo: { text: "", imageUrl: "", imageUrlWhite: "" },
    images: { hero: "", aboutBackground: "" },
    videos: { hero: "" },
    about: {
      title: "Quem Somos",
      description: "Somos uma empresa especializada com anos de experiência no mercado.",
      benefits: [
        { id: 1, text: "Experiência Nacional", description: "Atuação consolidada em 8 estados brasileiros" },
        { id: 2, text: "Equipe Especializada", description: "Profissionais capacitados e dedicados" },
        { id: 3, text: "Processos Complexos", description: "Gestão de alta complexidade e rigor técnico" },
        { id: 4, text: "Compromisso e Ética", description: "Transparência em cada etapa dos processos" },
      ]
    },
    mapStates: [],
    stats: [
      { id: 1, label: "processos em\nandamento", value: 9 },
      { id: 2, label: "estados de\natuação", value: 8 },
      { id: 3, label: "membros na\nequipe", value: 7 },
      { id: 4, label: "anos de\nexperiência", value: 20 },
      { id: 5, label: "casos\natendidos", value: 5000 },
      { id: 6, label: "taxa de\nsucesso", value: "95%" },
    ],

    expertise: [],
    newsCategories: [],
    articles: [],
    businessHours: { weekdays: "", saturday: "", sunday: "" },
    faq: [],
    assemblies: [],
    caseTypes: [],
    companies: [],
    mostConsulted: [],
    footer: {
      copyright: "",
      description: ""
    }
  },
  practiceAreas: [],
  testimonials: [],
  team: [],
  design: fullIvaldoTemplate.design
};

// Tipo TypeScript para o template (útil para validação)
export type TemplateIvaldo = typeof fullIvaldoTemplate;

// Backward compatibility alias
export const templateIvaldo = fullIvaldoTemplate;
