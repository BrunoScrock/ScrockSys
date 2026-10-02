/* ==========================================================================
   SCROCKSYS — CONFIGURAÇÃO CENTRALIZADA
   --------------------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa editar para atualizar o site.

   Altere aqui:
   - Nome da marca, WhatsApp, e-mail, cidade, redes sociais
   - Preços (desenvolvimento, domínio, hospedagem)
   - Serviços, diferenciais, processo, o que está incluído
   - Projetos do portfólio (sites, sistemas, design)
   - Projetos de Antes e Depois
   - Frases de marketing

   REGRA IMPORTANTE
   Todo texto que começa com "[INSERIR" é tratado pelo site como
   "não configurado": o bloco é ocultado ou o valor não é exibido.
   Assim, nada de informação inventada aparece para o visitante.

   WHATSAPP
   Formato: 55 + DDD + número, somente dígitos. Ex.: 5541999999999

   POR QUE ESTE ARQUIVO USA window.
   As variáveis são atribuídas em window (em vez de const solto no escopo
   global) para que continuem disponíveis mesmo se o navegador, uma
   extensão ou um otimizador reordenar os scripts. Assim você não
   precisa se preocupar com a ordem de carregamento.
   ========================================================================== */

window.CONFIG = {

  /* ==========================================================================
     1. IDENTIDADE
     ========================================================================== */

  nome: "ScrockSys",

  /* Frase curta exibida ao lado da marca (cabeçalho e rodapé) */
  marca: "ScrockSys",

  /* ---------------------------------------------------------------
     NOME DA MARCA EM DUAS PARTES (cabeçalho e rodapé)

     A marca é exibida em duas cores:
       parte 1 -> azul escuro, em negrito   ("Scrock")
       parte 2 -> azul claro, sem negrito   ("Sys")

     Troque as palavras aqui. As cores de cada parte ficam no
     css/style.css, em .marca__nome-1 e .marca__nome-2.
     --------------------------------------------------------------- */
  marcaParte1: "Scrock",
  marcaParte2: "Sys",

  /* Assinatura da empresa */
  assinatura: "Sites • Sistemas • Design",

  slogan: "Design que apresenta. Tecnologia que funciona.",

  tagline: "Desenvolvimento de Sites, Sistemas e Design",

  /* Descrição usada no SEO (meta description) e no rodapé */
  descricao:
    "Criação de sites profissionais, sistemas web e design gráfico para empresas. " +
    "Desenvolvimento de interfaces, landing pages, identidade visual e soluções digitais personalizadas.",

  /* Frase abaixo do título do Hero */
  heroSubtitulo:
    "Criação de sites profissionais, sistemas web e soluções digitais personalizadas " +
    "para empresas que querem apresentar seu trabalho com mais profissionalismo.",

  /* Chamada pequena acima do título */
  heroChamada: "Sites • Sistemas • Design • Soluções Digitais",

  /* Título do Hero — cada item do array é uma linha animada.
     Use {{D}} para destacar a palavra com gradiente.
     Ex.: "SEU NEGÓCIO {{D}}MERECE ESTAR NA INTERNET" */
  heroTitulo: [
    "DESENVOLVA SUA PRESENÇA DIGITAL",
    "SEU NEGÓCIO {{D}}MERECE ESTAR NA INTERNET"
  ],

  /* ==========================================================================
     2. CONTATO
     ========================================================================== */

  /* Somente dígitos: 55 + DDD + número. Ex.: 5541999999999 */
  whatsapp: "[INSERIR WHATSAPP]",

  /* Ex.: (41) 99999-9999 */
  telefone: "[INSERIR TELEFONE]",

  /* Ex.: contato@scrocksys.com.br */
  email: "[INSERIR E-MAIL]",

  /* Ex.: https://www.instagram.com/sua-conta/ */
  instagram: "",

  /* Ex.: https://github.com/sua-conta */
  github: "",

  /* Ex.: https://www.linkedin.com/in/sua-conta/ */
  linkedin: "",

  /* ==========================================================================
     3. LOCALIZAÇÃO
     ========================================================================== */

  /* Ex.: Curitiba - PR */
  cidade: "[INSERIR CIDADE]",

  /* Ex.: Atendimento em toda a região e por remoto */
  areaAtendimento: "[INSERIR ÁREA DE ATENDIMENTO]",

  /* Ex.: Segunda a sexta, das 9h às 19h */
  horario: "[INSERIR HORÁRIO DE ATENDIMENTO]",

  /* Frase curta exibida em selos */
  horarioResumo: "Resposta em até 24 horas",

  /* ==========================================================================
     4. SEO / URLs
     ========================================================================== */

  /* URL do site — usada em robots.txt, sitemap.xml, Open Graph e rodapé.
     Ex.: https://brunoscrock.github.io/scrocksys/ */
  siteUrl: "[INSERIR URL DO SITE]",

  /* Título padrão das páginas (aparece no Google) */
  seoTitle: "Desenvolvimento de Sites, Sistemas e Design Gráfico | ScrockSys",

  /* Descrição padrão (aparece no Google) */
  seoDescription:
    "Criação de sites profissionais, sistemas web e design gráfico para empresas. " +
    "Sites institucionais, landing pages, interfaces, identidade visual e manutenção de sites.",

  /* ==========================================================================
     5. SEÇÃO "SOBRE"
     ========================================================================== */

  sobreTitulo: ["TRANSFORMO IDEIAS EM", "EXPERIÊNCIAS DIGITAIS."],

  sobreTexto: [
    "A ScrockSys desenvolve sites, sistemas web e interfaces para empresas que precisam se apresentar melhor na internet. O trabalho começa entendendo o negócio e termina com um projeto publicado, funcionando e pronto para receber clientes.",
    "Cada projeto é construído do zero: estrutura, design, código e publicação. Nada de templates prontos — o visual, o conteúdo e a navegação são pensados para a realidade da empresa que está sendo atendida."
  ],

  /* Números exibidos nos selos. Enquanto for "[INSERIR NÚMERO]",
     o cartão inteiro é ocultado — nada de estatística inventada. */
  estatisticas: [
    { valor: "[INSERIR NÚMERO]", rotulo: "Projetos publicados" },
    { valor: "[INSERIR NÚMERO]", rotulo: "Empresas atendidas" },
    { valor: "[INSERIR NÚMERO]", rotulo: "Anos de experiência" },
    { valor: "[INSERIR NÚMERO]", rotulo: "Tecnologias utilizadas" }
  ],

  /* Provas sem número — apenas texto */
  garantias: [
    { icone: "codigo", titulo: "Código próprio", texto: "Cada projeto é escrito do zero, sem template genérico." },
    { icone: "celular", titulo: "Mobile first", texto: "Layout pensado primeiro para o celular." },
    { icone: "busca", titulo: "Estrutura para busca", texto: "Boas práticas básicas de SEO aplicadas." },
    { icone: "whatsapp", titulo: "Contato direto", texto: "Você fala com quem desenvolve, sem intermediário." }
  ],

  /* ==========================================================================
     6. SERVIÇOS — seção "Soluções digitais para sua empresa"
     ==========================================================================
     Para adicionar um serviço: duplique um bloco e ajuste os campos.
     icone: monitor, alvo, sistema, paleta, marca, ferramenta
  ========================================================================== */

  servicos: [
    {
      id: "sites",
      icone: "monitor",
      titulo: "Sites Profissionais",
      descricao: "Sites institucionais, comerciais e personalizados, desenvolvidos para apresentar a empresa e seus serviços com clareza.",
      tags: ["Institucional", "Comercial", "Autoral"]
    },
    {
      id: "landing",
      icone: "alvo",
      titulo: "Landing Pages",
      descricao: "Páginas focadas em divulgação e conversão, ideais para campanhas, promoções e lançamento de serviços.",
      tags: ["Campanha", "Conversão", "Carregamento rápido"]
    },
    {
      id: "sistemas",
      icone: "sistema",
      titulo: "Sistemas Web",
      descricao: "Sistemas personalizados para controle, organização e acompanhamento de processos, telas administrativas e painéis de dados.",
      tags: ["Painéis", "Controle", "Formulários"]
    },
    {
      id: "design",
      icone: "paleta",
      titulo: "Design Gráfico",
      descricao: "Criação e edição de artes para empresas: banners, posts, peças comerciais, materiais de divulgação e edição de imagens.",
      tags: ["Artes", "Banners", "Posts"]
    },
    {
      id: "identidade",
      icone: "marca",
      titulo: "Identidade Visual",
      descricao: "Elementos visuais que fortalecem a marca: logo, paleta de cores, tipografia e padronização dos materiais da empresa.",
      tags: ["Logo", "Cores", "Padronização"]
    },
    {
      id: "manutencao",
      icone: "ferramenta",
      titulo: "Manutenção de Sites",
      descricao: "Atualizações, correções e alterações de conteúdo para o site continuar atual, seguro e compatível com os dispositivos.",
      tags: ["Atualizações", "Correções", "Conteúdo"]
    }
  ],

  /* ==========================================================================
     7. "O QUE ESTÁ INCLUÍDO"
     ==========================================================================
     Cada item desta lista virou um bloco real na seção.
     icone: site, celular, busca, servicos, galeria, whatsapp, avaliacao,
            hospedagem, dominio, manutencao
  ========================================================================== */

  incluido: [
    {
      icone: "site",
      titulo: "Site personalizado",
      texto: "Desenvolvimento de acordo com a identidade, o tom de voz e as cores da sua empresa. Nada de site genérico com o nome trocado."
    },
    {
      icone: "celular",
      titulo: "Computador e celular",
      texto: "Layout responsivo para computador, tablet e celular, testado nas telas que os seus clientes realmente usam."
    },
    {
      icone: "busca",
      titulo: "Estrutura otimizada para Google",
      texto: "Organização das páginas, títulos, descrições e boas práticas básicas de SEO para facilitar a empresa ser encontrada nas buscas."
    },
    {
      icone: "servicos",
      titulo: "Serviços e informações",
      texto: "Apresentação clara dos serviços oferecidos, com textos objetivos que ajudam o cliente a entender o que a empresa faz."
    },
    {
      icone: "galeria",
      titulo: "Galeria de fotos",
      texto: "Espaco dedicado para mostrar trabalhos realizados, resultados, equipe e a estrutura física da empresa."
    },
    {
      icone: "whatsapp",
      titulo: "Botão de WhatsApp",
      texto: "Contato direto com o cliente em um clique, sem precisar abrir aplicativo, copiar número ou digitar endereço."
    },
    {
      icone: "avaliacao",
      titulo: "Botão de avaliação",
      texto: "Possibilidade de direcionar clientes para as avaliações da empresa no Google, construindo prova social."
    },
    {
      icone: "hospedagem",
      titulo: "Hospedagem",
      texto: "Para projetos compatíveis com hospedagem estática, é possível utilizar hospedagem gratuita, sem mensalidade de servidor."
    },
    {
      icone: "dominio",
      titulo: "Domínio",
      texto: "O endereço próprio (.com.br) possui custo separado do desenvolvimento e é registrado no nome da empresa."
    },
    {
      icone: "manutencao",
      titulo: "Manutenção",
      texto: "Atualização de textos, fotos, valores e serviços publicados em um curto período de tempo, sem refazer o site."
    }
  ],

  /* ==========================================================================
     8. SISTEMAS WEB — tipos de sistema que podem ser desenvolvidos
     ========================================================================== */

  sistemas: [
    {
      icone: "painel",
      titulo: "Controle administrativo",
      descricao: "Tela restrita para gerenciar clientes, registros, valores e informações que hoje ficam espalhadas em planilhas e WhatsApp."
    },
    {
      icone: "sistema",
      titulo: "Sistemas internos",
      descricao: "Ferramentas para organizar rotinas da equipe: cadastros, fichas de atendimento, ordens de serviço e histórico."
    },
    {
      icone: "dashboard",
      titulo: "Dashboards e painéis",
      descricao: "Visão clara de indicadores, com gráficos e tabelas para acompanhar o desempenho do negócio em tempo real."
    },
    {
      icone: "formulario",
      titulo: "Formulários inteligentes",
      descricao: "Formulários que validam dados, organizam as informações recebidas e preparam o processo para seguir de forma automática."
    },
    {
      icone: "controle",
      titulo: "Sistemas de controle",
      descricao: "Controle de estoque, agenda, financeiro, status de pedido ou qualquer processo específico da operação da empresa."
    },
    {
      icone: "ferramenta",
      titulo: "Ferramentas personalizadas",
      descricao: "Quando um sistema pronto não resolve, crio a ferramenta exata que a empresa precisa usar no dia a dia."
    }
  ],

  /* ==========================================================================
     9. DIFERENCIAIS — seção "Mais do que um site"
     ========================================================================== */

  diferenciais: [
    { icone: "atendimento", titulo: "Atendimento direto", texto: "Você conversa com quem desenvolve o projeto, sem fila e sem intermediário." },
    { icone: "camadas", titulo: "Projeto personalizado", texto: "Cada site é desenhado para a necessidade da empresa, não para um modelo pronto." },
    { icone: "celular", titulo: "Responsividade", texto: "Funcionamento correto em celular, tablet e computador, que é onde a busca acontece." },
    { icone: "olho", titulo: "Visual profissional", texto: "Design pensado para transmitir seriedade, organização e confiança." },
    { icone: "busca", titulo: "SEO básico", texto: "Estrutura preparada para mecanismos de busca, com títulos e descrições organizados." },
    { icone: "whatsapp", titulo: "WhatsApp integrado", texto: "Facilidade para o cliente entrar em contato direto com a empresa." },
    { icone: "atualizacao", titulo: "Atualizações", texto: "Possibilidade de alterações futuras conforme a empresa cresce ou muda." },
    { icone: "camadas", titulo: "Soluções personalizadas", texto: "Além de sites, também desenvolvo sistemas e ferramentas sob medida." }
  ],

  /* ==========================================================================
     10. PROCESSO — "Como funciona o desenvolvimento?"
     ========================================================================== */

  processo: [
    {
      numero: "01",
      titulo: "Conversa inicial",
      texto: "Entendo a empresa, os serviços oferecidos e o objetivo do projeto antes de escrever qualquer linha de código."
    },
    {
      numero: "02",
      titulo: "Definição do projeto",
      texto: "Definimos juntos a estrutura das páginas, os conteúdos, as imagens necessárias e as funcionalidades."
    },
    {
      numero: "03",
      titulo: "Desenvolvimento",
      texto: "O site ou sistema começa a ser construído: layout, código, conteúdo e comportamento responsivo."
    },
    {
      numero: "04",
      titulo: "Apresentação",
      texto: "O projeto é apresentado para avaliação, com acesso para você ver o que foi feito até o momento."
    },
    {
      numero: "05",
      titulo: "Ajustes",
      texto: "São realizados os ajustes necessários nos textos, imagens, cores e posições até a aprovação."
    },
    {
      numero: "06",
      titulo: "Publicação",
      texto: "O projeto é publicado e disponibilizado na internet, no endereço definido para a empresa."
    }
  ],

  /* ==========================================================================
     11. INVESTIMENTO — seção de preços
     ==========================================================================
     Todos os textos vêm daqui. Nada de valor fixo escondido no HTML.
  ========================================================================== */

  investimento: {
    titulo: ["QUANTO CUSTA", "CRIAR UM SITE?"],

    subtitulo:
      "Mostro abertamente como o investimento é calculado, para você saber, " +
      "antes de começar, o que está incluso e o que tem custo separado.",

    /* Cartão principal de desenvolvimento */
    desenvolvimento: {
      rotulo: "Desenvolvimento",
      preco: "A partir de R$ 350,00",
      descricao:
        "Valor inicial de referência para um site institucional de uma página. " +
        "O valor pode variar de acordo com a quantidade de páginas, funcionalidades, " +
        "quantidade de conteúdo e nível de personalização.",
      itens: [
        "Site institucional de até 1 página",
        "Layout responsivo (celular, tablet e computador)",
        "Formulário de contato via WhatsApp",
        "Estrutura básica para mecanismos de busca",
        "Publicação do site na internet"
      ],
      aviso:
        "O valor final é sempre informado antes do início do projeto, " +
        "após a conversa sobre o escopo."
    },

    /* Parcelamento */
    pagamento: {
      rotulo: "Pagamento facilitado",
      titulo: "Parcelamento em até 3x",
      texto:
        "Possibilidade de parcelamento em até 3x no cartão, conforme negociação. " +
        "Para projetos maiores, o pagamento pode ser dividido em etapas " +
        "entregues ao longo do desenvolvimento."
    },

    /* Cartão de domínio */
    dominio: {
      rotulo: "Custo separado",
      titulo: "Domínio .com.br",
      preco: "Aproximadamente R$ 40,00 por ano",
      texto:
        "Para utilizar um endereço personalizado, como www.suaempresa.com.br, " +
        "é necessário registrar um domínio. O registro é feito em nome da própria " +
        "empresa e possui custo anual, separado do valor de desenvolvimento.",
      exemplo: "www.suaempresa.com.br"
    },

    /* Cartão de hospedagem */
    hospedagem: {
      rotulo: "Sem mensalidade",
      titulo: "Hospedagem",
      preco: "R$ 0,00 em projetos estáticos compatíveis",
      texto: [
        "Para projetos compatíveis com hospedagem estática, é possível utilizar hospedagem gratuita, sem mensalidade de servidor. GitHub Pages e outras plataformas gratuitas suportam esse tipo de site.",
        "Sistemas Web que precisam de back-end, banco de dados ou infraestrutura específica não funcionam em hospedagem estática gratuita. Nesse caso, a hospedagem depende da arquitetura utilizada e é orçada separadamente."
      ]
    },

    /* Faixas de escopo — ajudam o cliente a se localizar */
    faixas: [
      {
        nome: "Landing Page",
        preco: "a partir de R$ 350,00",
        texto: "Uma página focada em divulgação ou conversão.",
        itens: ["Seção de apresentação", "Botão de WhatsApp", "Carregamento rápido"]
      },
      {
        nome: "Site Institucional",
        preco: "sob orçamento",
        texto: "Site completo com as seções da empresa.",
        itens: ["Várias páginas ou seções", "Galeria de fotos", "SEO básico"]
      },
      {
        nome: "Sistema Web",
        preco: "sob orçamento",
        texto: "Ferramenta com painel, cadastro e dados.",
        itens: ["Tela de controle", "Banco de dados", "Hospedagem específica"]
      }
    ],

    /* Observações que não podem ser esquecidas */
    observacoes: [
      "Valores de referência, sujeitos a alteração conforme o escopo definido.",
      "Domínio tem custo próprio, cobrado anualmente pela registradora.",
      "Hospedagem gratuita se aplica somente a sites estáticos compatíveis.",
      "Sistemas com back-end exigem infraestrutura de hospedagem própria."
    ]
  },

  /* ==========================================================================
     12. "SUA EMPRESA JÁ ESTÁ NA INTERNET?"
     ========================================================================== */

  presenca: {
    titulo: "SUA EMPRESA JÁ ESTÁ NA INTERNET?",
    subtitulo:
      "A diferença entre apenas existir nas redes sociais e ter um site próprio " +
      "muda a forma como o cliente enxerga a sua empresa.",

    semSite: {
      rotulo: "Sem site",
      titulo: "Só redes sociais",
      itens: [
        "Cliente encontra apenas posts e stories.",
        "Informações ficam espalhadas entre comentários e mensagens.",
        "Menor controle da apresentação da empresa.",
        "Dificuldade para apresentar a lista completa de serviços.",
        "A empresa depende exclusivamente das redes sociais.",
        "O trabalho passado fica perdido no feed."
      ]
    },

    comSite: {
      rotulo: "Com site",
      titulo: "Presença digital própria",
      itens: [
        "Apresentação profissional da empresa.",
        "Serviços organizados em páginas claras.",
        "Informações centralizadas em um só endereço.",
        "Portfólio com fotos dos trabalhos realizados.",
        "Botão de WhatsApp para contato imediato.",
        "Localização, horários e formas de atendimento.",
        "Mais controle sobre o que o cliente vê."
      ]
    },

    nota:
      "Ter um site não garante aumento de clientes nem resultado financeiro. " +
      "O que ele oferece é controle, organização e uma apresentação consistente da empresa."
  },

  /* ==========================================================================
     13. ANTES E DEPOIS
     ==========================================================================
     IMPORTANTE: as duas imagens precisam ter o MESMO enquadramento e a
     MESMA proporção, senão a comparação por arraste fica distorcida.
     Aceita .svg, .webp, .jpg ou .png — mantenha a extensão igual ao arquivo.
  ========================================================================== */

  antesDepois: [
    {
      id: "projeto-01",
      titulo: "Projeto 01 — Oficina Mecânica",
      categoria: "Site institucional",
      antes: "assets/images/before-after/projeto-01/antes.svg",
      depois: "assets/images/before-after/projeto-01/depois.svg",
      antesLabel: "Presença digital limitada",
      depoisLabel: "Site profissional",
      descricao: "Antes, a oficina dependia de um perfil de rede social com informações soltas. Hoje tem site próprio com serviços, fotos da estrutura e contato por WhatsApp."
    },
    {
      id: "projeto-02",
      titulo: "Projeto 02 — Barbearia",
      categoria: "Comércio e serviços",
      antes: "assets/images/before-after/projeto-02/antes.svg",
      depois: "assets/images/before-after/projeto-02/depois.svg",
      antesLabel: "Apenas redes sociais",
      depoisLabel: "Site com apresentação dos serviços",
      descricao: "De posts avulsos para uma página própria com apresentação dos serviços, horários, localização e galeria de trabalhos."
    },
    {
      id: "projeto-03",
      titulo: "Projeto 03 — Empresa de Pisos",
      categoria: "Portfólio",
      antes: "assets/images/before-after/projeto-03/antes.svg",
      depois: "assets/images/before-after/projeto-03/depois.svg",
      antesLabel: "Divulgação básica",
      depoisLabel: "Site com portfólio",
      descricao: "A empresa tinha apenas um card de divulgação. O novo site mostra os serviços instalados, galeria de ambientes e atendimento por WhatsApp."
    },
    {
      id: "projeto-04",
      titulo: "Projeto 04 — Identidade Visual",
      categoria: "Design e marca",
      antes: "assets/images/before-after/projeto-04/antes.svg",
      depois: "assets/images/before-after/projeto-04/depois.svg",
      antesLabel: "Material visual antigo",
      depoisLabel: "Nova apresentação de marca",
      descricao: "Logo, paleta de cores e materiais de divulgação reorganizados para passar uma imagem consistente em todos os pontos de contato."
    }
  ],

  /* ==========================================================================
     14. PORTFÓLIO
     ==========================================================================
     Categorias usadas nos filtros:
       Sites      -> "Institucional", "Comércio", "Portfólio"
       Sistemas   -> "Sistema"
       Design     -> "Logo", "Identidade Visual", "Social Media",
                     "Banners", "Material Comercial"

     Os filtros devem conter só categorias que existem em "sites", senão
     clicar em uma categoria vazia mostra "nenhum resultado".
   ========================================================================== */

  portfolio: {

    /* Filtros da seção "Sites desenvolvidos".
       "Todos" sempre aparece primeiro e não precisa ser removido.
       Mantenha sincronizado com a propriedade "categoria" dos itens abaixo. */
    filtrosSites: ["Todos", "Institucional", "Comércio", "Portfólio"],

    /* Filtros da seção "Design gráfico" */
    filtrosDesign: ["Todos", "Logo", "Identidade Visual", "Social Media", "Banners", "Material Comercial"],

    sites: [
      {
        titulo: "INOVE Mecânica",
        categoria: "Institucional",
        imagem: "assets/images/portfolio/sites/inove-mecanica.webp",
        descricao: "Site institucional para oficina mecânica, com hero em tela cheia, serviços de diagnóstico e manutenção, atendimento profissional e contato por WhatsApp.",
        url: "#",
        tags: ["Institucional", "WhatsApp", "Hero com foto"],
        destaque: true
      },
      {
        titulo: "Quirino Barbearia",
        categoria: "Comércio",
        imagem: "assets/images/portfolio/sites/quirino-barbearia.webp",
        descricao: "Página de serviços para barbearia com horários, estilo e precisão, atendimento personalizado e galeria de trabalhos.",
        url: "#",
        tags: ["Comércio", "Galeria", "Botão de avaliação"]
      },
      {
        titulo: "Arte Final Pisos de Madeira",
        categoria: "Portfólio",
        imagem: "assets/images/portfolio/sites/arte-final-pisos.webp",
        descricao: "Site com portfólio de ambientes instalados, seleção de materiais, atendimento com hora marcada e contato direto com a equipe.",
        url: "#",
        tags: ["Portfólio", "Galeria", "Hora marcada"]
      }
    ],

    /* Sistemas web */
    sistemas: [
      {
        titulo: "Sistema de Gestão de Lotações",
        categoria: "Sistema",
        imagem: "assets/images/portfolio/sistemas/gestao-lotacoes.svg",
        descricao: "Painel para controle de entradas, cadastro de clientes e relatórios de ocupação.",
        url: "#",
        tags: ["Dashboard", "Relatórios"]
      },
      {
        titulo: "Dashboard Administrativo",
        categoria: "Sistema",
        imagem: "assets/images/portfolio/sistemas/dashboard.svg",
        descricao: "Visão consolidada de indicadores do negócio com gráficos, filtros e tabelas.",
        url: "#",
        tags: ["Dashboard", "Indicadores"]
      },
      {
        titulo: "Sistema de Formulários",
        categoria: "Sistema",
        imagem: "assets/images/portfolio/sistemas/formularios.svg",
        descricao: "Formulários validados que organizam solicitações e alimentam o painel de controle.",
        url: "#",
        tags: ["Formulários", "Automação"]
      }
    ],

    /* Design gráfico — galeria com lightbox */
    design: [
      {
        titulo: "Logotipo e marca",
        categoria: "Logo",
        imagem: "assets/images/portfolio/design/logo-marca.svg",
        descricao: "Criação do logotipo com variações para fundo claro e fundo escuro.",
        url: "#",
        tags: ["Logo", "Variações"]
      },
      {
        titulo: "Identidade Visual",
        categoria: "Identidade Visual",
        imagem: "assets/images/portfolio/design/identidade-visual.svg",
        descricao: "Paleta de cores, tipografia e aplicações da marca em materiais reais.",
        url: "#",
        tags: ["Cores", "Tipografia"]
      },
      {
        titulo: "Banner Promocional",
        categoria: "Banners",
        imagem: "assets/images/portfolio/design/banner-promocional.svg",
        descricao: "Peça de divulgação para redes sociais, dimensionada para telas de promoções.",
        url: "#",
        tags: ["Banner", "Campanha"]
      },
      {
        titulo: "Post para Social Media",
        categoria: "Social Media",
        imagem: "assets/images/portfolio/design/post-social.svg",
        descricao: "Arte quadrada para Instagram e Facebook, mantendo a identidade da empresa.",
        url: "#",
        tags: ["Post", "Instagram"]
      },
      {
        titulo: "Arte Comercial",
        categoria: "Material Comercial",
        imagem: "assets/images/portfolio/design/arte-comercial.svg",
        descricao: "Arte para divulgação de serviço com chamada direta e botão de contato visual.",
        url: "#",
        tags: ["Arte", "Serviço"]
      },
      {
        titulo: "Edição de Imagem",
        categoria: "Material Comercial",
        imagem: "assets/images/portfolio/design/edicao-imagem.svg",
        descricao: "Tratamento, ajuste de cor e recorte de imagens para uso comercial.",
        url: "#",
        tags: ["Edição", "Tratamento"]
      },
      {
        titulo: "Cartão de Visita",
        categoria: "Material Comercial",
        imagem: "assets/images/portfolio/design/cartao-visita.svg",
        descricao: "Layout de cartão de visita com frente e verso e dados de contato.",
        url: "#",
        tags: ["Cartão", "Impressão"]
      },
      {
        titulo: "Capa para Facebook",
        categoria: "Social Media",
        imagem: "assets/images/portfolio/design/capa-facebook.svg",
        descricao: "Capa de perfil e destaque de campanha com a identidade da empresa.",
        url: "#",
        tags: ["Capa", "Campanha"]
      }
    ]
  },

  /* ==========================================================================
     15. MENSAGENS DO WHATSAPP
     ==========================================================================
     A chave é "mensagem" + o id do serviço em CamelCase.
     Ex.: falarPeloWhatsApp("sites") usa CONFIG.mensagemSites.
  ========================================================================== */

  mensagemPadrao:
    "Olá! Gostaria de solicitar um orçamento para desenvolver um site ou sistema para a minha empresa.",

  mensagemSites: "Olá! Gostaria de falar sobre a criação de um site para a minha empresa.",
  mensagemLanding: "Olá! Gostaria de falar sobre uma landing page para uma campanha.",
  mensagemSistemas: "Olá! Preciso de um sistema web ou painel para a minha empresa.",
  mensagemDesign: "Olá! Gostaria de um orçamento para artes e material de design.",
  mensagemIdentidade: "Olá! Gostaria de criar a identidade visual da minha empresa.",
  mensagemManutencao: "Olá! Preciso de manutenção ou atualizações no meu site.",
  mensagemAvaliacao: "Olá! Gostaria de solicitar um orçamento.",

  /* Mensagem da seção de contato (formulário).
     Os campos {nome}, {empresa}, {servico} e {mensagem} são preenchidos
     automaticamente. {mensagem} só entra se o campo for preenchido. */
  mensagemContato:
    "Olá! Meu nome é {nome} e sou da empresa {empresa}. Tenho interesse em {servico}. Gostaria de conversar sobre um orçamento.",

  /* Rótulo do botão flutuante no desktop */
  textoBotaoFlutuante: "Falar sobre meu projeto",

  /* Rótulo do botão flutuante no celular */
  textoBotaoFlutuanteMobile: "Orçamento",

  /* Opções do campo "Serviço desejado" no formulário */
  opcoesServico: [
    "Site institucional",
    "Landing page",
    "Sistema web / painel",
    "Design gráfico",
    "Identidade visual",
    "Manutenção de site",
    "Outro projeto"
  ],

  /* ==========================================================================
     16. TEXTOS DE APOIO
     ========================================================================== */

  frases: {
    portfolioSites: {
      titulo: "SITES DESENVOLVIDOS",
      subtitulo:
        "Projetos reais publicados para empresas. Cada card abre detalhes do " +
        "que foi construído e como o site resolve o problema apresentado."
    },
    portfolioDesign: {
      titulo: "DESIGN GRÁFICO",
      subtitulo:
        "Banners, artes, logos, identidade visual e materiais comerciais. " +
        "Clique em qualquer peça para ampliar."
    },
    sistemas: {
      titulo: "SISTEMAS WEB PERSONALIZADOS",
      subtitulo:
        "Não trabalho somente com sites. Quando o processo da empresa precisa de " +
        "controle, histórico ou automação, desenvolvo o sistema sob medida."
    },
    antesDepois: {
      titulo: "ANTES E DEPOIS",
      subtitulo:
        "Veja como uma presença digital profissional pode transformar a apresentação de uma empresa."
    },
    incluido: {
      titulo: "O QUE ESTÁ INCLUÍDO",
      subtitulo:
        "Todo site desenvolvido pela ScrockSys inclui os itens abaixo. " +
        "Nenhum item é cobrado separado dentro do desenvolvimento."
    },
    servicos: {
      titulo: "SOLUÇÕES DIGITAIS PARA SUA EMPRESA",
      subtitulo:
        "Mais do que um site bonito: soluções que apresentam a empresa, " +
        "organizam serviços e facilitam o contato."
    }
  }
};


/* ==========================================================================
   CLASSES DE PROJETO
   --------------------------------------------------------------------------
   Usada por js/classifier.js para organizar e filtrar o portfólio.
   ======================================================================== */

window.CLASSES = {
  SITE: "SITE",
  SISTEMA: "SISTEMA",
  DESIGN: "DESIGN",
  IDENTIDADE_VISUAL: "IDENTIDADE_VISUAL",
  LANDING_PAGE: "LANDING_PAGE",
  OUTROS: "OUTROS"
};


/* ==========================================================================
   MAPA DE CATEGORIAS PARA CLASSES
   --------------------------------------------------------------------------
   Serve para o filtro de portfólio classificar cada projeto
   automaticamente em SITE / SISTEMA / DESIGN / LANDING_PAGE etc.
   ======================================================================== */

window.MAPA_CLASSES = {
  site: window.CLASSES.SITE,
  institucional: window.CLASSES.SITE,
  servicos: window.CLASSES.SITE,
  comercio: window.CLASSES.SITE,
  profissionais: window.CLASSES.SITE,
  portfolio: window.CLASSES.SITE,
  sistema: window.CLASSES.SISTEMA,
  sistemas: window.CLASSES.SISTEMA,
  dashboard: window.CLASSES.SISTEMA,
  formularios: window.CLASSES.SISTEMA,
  design: window.CLASSES.DESIGN,
  "design grafico": window.CLASSES.DESIGN,
  logo: window.CLASSES.DESIGN,
  banner: window.CLASSES.DESIGN,
  banners: window.CLASSES.DESIGN,
  "social media": window.CLASSES.DESIGN,
  "material comercial": window.CLASSES.DESIGN,
  "identidade visual": window.CLASSES.IDENTIDADE_VISUAL,
  "landing page": window.CLASSES.LANDING_PAGE,
  landing: window.CLASSES.LANDING_PAGE,
  outros: window.CLASSES.OUTROS
};


/* ==========================================================================
   FIM DA CONFIGURAÇÃO
   ========================================================================== */
