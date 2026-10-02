/* ==========================================================================
   SCROCKSYS — app.js
   --------------------------------------------------------------------------
   Inicialização e montagem da página.

   Este arquivo transforma o js/config.js em HTML visível:

     CONFIG  ->  <section>, <article>, <li>, <figure>...

   Organização
   01. Texto do Hero (animação letra a letra)
   02. Fundo animado do Hero (canvas com partículas e linhas)
   03. SEO (title, description, canonical, Open Graph)
   04. Sobre
   05. Serviços
   06. O que está incluído
   07. Sistemas Web
   08. Portfólio de sites (Bento Grid)
   09. Antes e Depois
   10. Design gráfico
   11. Sua empresa na internet
   12. Diferenciais
   13. Processo
   14. Investimento
   15. Contato e formulário
   16. Rodapé
   17. Navegação suave entre seções

   Para adicionar conteúdo, edite apenas o js/config.js.
   ========================================================================== */

(function () {
  "use strict";

  var U = window.Utils;
  var Api = window.Api;
  var Cl = window.Classifier;
  var Se = window.Search;
  var UI = window.UI;

  /* Textos animados usados no título do Hero */
  var CARACTERES = "!@#$%^&*_+-=<>:;0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  /* ==================================================================
     01. TÍTULO DO HERO — animação letra a letra
     ================================================================== */

  /**
   * Monta o título do Hero quebrando cada linha em letras animadas.
   *
   * O texto vem de CONFIG.heroTitulo. O marcador {{D}} define a palavra
   * que recebe o gradiente animado.
   */
  function montarTituloHero() {
    var container = U.$("#heroTitulo");
    if (!container) return;

    var linhas = Array.isArray(CONFIG.heroTitulo) ? CONFIG.heroTitulo : [];

    // Limpa qualquer texto de exemplo do HTML.
    // Os spans antigos são destruídos por isso, então criamos novos
    // (não dá para reaproveitar os que estavam no index.html).
    container.innerHTML = "";

    var alvos = [];

    linhas.forEach(function (textoLinha) {
      var linha = U.criarEl("span", { class: "hero__linha" });
      container.appendChild(linha);
      alvos.push(linha);
    });

    alvos.forEach(function (linha, indiceLinha) {
      var textoLinha = linhas[indiceLinha];

      // Separa a parte normal da parte destacada ({{D}})
      var partes = String(textoLinha).split(/\{\{D\}\}/i);

      partes.forEach(function (parte, indiceParte) {
        var ehDestaque = indiceParte > 0;
        var palavras = parte.split(/\s+/).filter(Boolean);

        palavras.forEach(function (palavra, indicePalavra) {
          // Espaço entre as palavras (não vira letra animada)
          if (indicePalavra > 0) {
            linha.appendChild(U.criarEl("span", { text: " " }));
          }

          /* Uma caixa por PALAVRA — nunca por trecho.
             Se agrupar várias palavras em uma única caixa com
             white-space:nowrap, o texto inteiro sai da tela
             em vez de quebrar linha. */
          var containerPalavra = U.criarEl("span", {
            class: ehDestaque ? "hero__destaque" : "hero__palavra"
          });

          // Cada letra vira um <span> com atraso próprio
          palavra.split("").forEach(function (letra, indiceLetra) {
            var span = U.criarEl("span", { class: "hero__letra", text: letra });

            /* Atraso cresce da esquerda para a direita, linha a linha.
               Os valores são ajustados para o título inteiro aparecer
               em cerca de 1,5 s — mais que isso trava a leitura. */
            var atraso = (indiceLinha * 320) + (indicePalavra * 56) + (indiceLetra * 18);
            span.style.setProperty("--atraso", atraso + "ms");

            containerPalavra.appendChild(span);
          });

          linha.appendChild(containerPalavra);
        });
      });
    });

    // Dispara a animação no próximo quadro, para o CSS inicial ser aplicado
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        alvos.forEach(function (linha) {
          linha.classList.add("is-animada");
        });
      });
    });
  }

  /* ==================================================================
     02. FUNDO ANIMADO DO HERO (canvas)
     ==================================================================
     Partículas com linhas de conexão entre as que estão próximas.
     Think "rede de dados" — discreta, atrás do texto, sem atrapalhar
     a leitura.

     Dispositivos com pouca potência ou que preferem menos movimento
     recebem apenas o fundo em CSS (grid + auroras), sem canvas.
     ================================================================== */

  function iniciarFundoHero() {
    var canvas = U.$("#heroCanvas");
    var hero = U.$(".hero");
    if (!canvas || !hero) return;

    // Fallback estático: sem canvas, o grid e as auroras do CSS já bastam
    if (!canvas.getContext || U.ehDispositivoLeve()) {
      canvas.style.display = "none";
      return;
    }

    var ctx = canvas.getContext("2d");
    var particulas = [];
    var conexoes = [];
    var animacao = null;
    var rodando = true;
    var largura = 0;
    var altura = 0;

    var quantidadeBase = 58;
    var distanciaMax = 132;

    function calcularQuantidade() {
      var area = largura * altura;
      var quantidade = Math.round(area / 17000);

      if (U.ehTelaPequena()) quantidade = Math.min(quantidade, 26);
      return Math.max(18, Math.min(quantidadeBase, quantidade));
    }

    function ajustar() {
      var caixa = hero.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);

      largura = caixa.width;
      altura = caixa.height;

      canvas.width = Math.round(largura * dpr);
      canvas.height = Math.round(altura * dpr);
      canvas.style.width = largura + "px";
      canvas.style.height = altura + "px";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particulas = [];
      var quantidade = calcularQuantidade();

      for (var i = 0; i < quantidade; i++) {
        particulas.push({
          x: Math.random() * largura,
          y: Math.random() * altura,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          raio: Math.random() * 1.7 + 0.9,
          alfa: Math.random() * 0.4 + 0.28
        });
      }
    }

    function desenhar() {
      if (!rodando) return;

      ctx.clearRect(0, 0, largura, altura);
      conexoes.length = 0;

      // 1. Linhas entre partículas próximas
      for (var i = 0; i < particulas.length; i++) {
        for (var j = i + 1; j < particulas.length; j++) {
          var dx = particulas[i].x - particulas[j].x;
          var dy = particulas[i].y - particulas[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < distanciaMax) {
            conexoes.push({
              x1: particulas[i].x, y1: particulas[i].y,
              x2: particulas[j].x, y2: particulas[j].y,
              alfa: (1 - dist / distanciaMax) * 0.2
            });
          }
        }
      }

      ctx.lineWidth = 1;

      for (var c = 0; c < conexoes.length; c++) {
        var conexao = conexoes[c];
        ctx.strokeStyle = "rgba(29, 92, 255, " + conexao.alfa.toFixed(3) + ")";
        ctx.beginPath();
        ctx.moveTo(conexao.x1, conexao.y1);
        ctx.lineTo(conexao.x2, conexao.y2);
        ctx.stroke();
      }

      // 2. Partículas
      for (var p = 0; p < particulas.length; p++) {
        var particula = particulas[p];

        particula.x += particula.vx;
        particula.y += particula.vy;

        // Volta para o outro lado em vez de sair da tela
        if (particula.x < -10) particula.x = largura + 10;
        if (particula.x > largura + 10) particula.x = -10;
        if (particula.y < -10) particula.y = altura + 10;
        if (particula.y > altura + 10) particula.y = -10;

        ctx.beginPath();
        ctx.arc(particula.x, particula.y, particula.raio, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(29, 92, 255, " + particula.alfa.toFixed(3) + ")";
        ctx.fill();
      }

      animacao = window.requestAnimationFrame(desenhar);
    }

    function iniciar() {
      if (animacao) return;
      rodando = true;
      desenhar();
    }

    function pausar() {
      rodando = false;
      if (animacao) window.cancelAnimationFrame(animacao);
      animacao = null;
    }

    ajustar();
    desenhar();

    window.addEventListener("resize", U.debounce(function () {
      ajustar();
      pausar();
      iniciar();
    }, 220));

    // Não gasta bateria com a animação em segundo plano
    document.addEventListener("visibilitychange", function () {
      document.hidden ? pausar() : iniciar();
    });

    // E para quando o Hero sai da tela
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
          entrada.isIntersecting ? iniciar() : pausar();
        });
      }, { threshold: 0 }).observe(hero);
    }
  }

  /* ==================================================================
     03. SEO E DADOS DO DOCUMENTO
     ================================================================== */

  function aplicarSeo() {
    var url = U.configurado(CONFIG.siteUrl) ? CONFIG.siteUrl.trim() : "";
    var imagem = "assets/images/hero/og-cover.svg";

    document.title = CONFIG.seoTitle || document.title;

    var descricao = document.querySelector('meta[name="description"]');
    if (descricao && CONFIG.seoDescription) descricao.content = CONFIG.seoDescription;

    if (url) {
      var canonico = U.$("#linkCanonical");
      if (canonico) canonico.href = url;

      ["#ogUrl"].forEach(function (seletor) {
        var meta = U.$(seletor);
        if (meta) meta.content = url;
      });
    }

    ["#ogImage", "#twImage"].forEach(function (seletor) {
      var meta = U.$(seletor);
      if (meta) meta.content = new URL(imagem, window.location.href).href;
    });
  }

  /* ==================================================================
     04. SOBRE
     ================================================================== */

  function montarSobre() {
    /* Título em duas linhas animadas */
    var titulo = U.$("#sobreTitulo");
    var linhas = Array.isArray(CONFIG.sobreTitulo) ? CONFIG.sobreTitulo : [];

    if (titulo && linhas.length) {
      titulo.innerHTML = "";
      linhas.forEach(function (linha) {
        titulo.appendChild(U.criarEl("span", { class: "linha", text: linha }));
      });
    }

    /* Parágrafos */
    var textos = U.$("#sobreTextos");
    if (textos) {
      textos.innerHTML = "";
      (CONFIG.sobreTexto || []).forEach(function (paragrafo) {
        textos.appendChild(U.criarEl("p", { text: paragrafo }));
      });
    }

    /* Provas (com ícone) */
    var garantias = U.$("#listaGarantias");
    if (garantias) {
      garantias.innerHTML = "";
      garantias.classList.add("escalonar");

      (CONFIG.garantias || []).forEach(function (garantia) {
        garantias.appendChild(U.criarEl("li", { class: "garantia" }, [
          U.criarEl("span", { class: "garantia__icone", "aria-hidden": "true" },
            U.criarIcone(garantia.icone || "check")),
          U.criarEl("span", {}, [
            U.criarEl("strong", { text: garantia.titulo }),
            U.criarEl("small", { text: garantia.texto })
          ])
        ]));
      });
    }

    /* Estatísticas — só mostra as que estiverem preenchidas */
    var estatisticas = U.$("#listaEstatisticas");
    if (estatisticas) {
      estatisticas.innerHTML = "";

      var validas = (CONFIG.estatisticas || []).filter(function (item) {
        return U.configurado(item.valor) && !/^\s*\[INSERIR N/i.test(item.valor);
      });

      // Com nenhuma estatística real, o bloco fica oculto
      if (validas.length) {
        estatisticas.hidden = false;
        validas.forEach(function (item) {
          estatisticas.appendChild(U.criarEl("div", { class: "estatistica" }, [
            U.criarEl("strong", { text: U.formatarNumero(item.valor) }),
            U.criarEl("small", { text: item.rotulo })
          ]));
        });
      } else {
        estatisticas.hidden = true;
      }
    }
  }

  /* ==================================================================
     05. SERVIÇOS
     ================================================================== */

  function montarServicos() {
    var container = U.$("#listaServicos");
    if (!container) return;

    container.innerHTML = "";
    container.classList.add("escalonar");

    (CONFIG.servicos || []).forEach(function (servico, indice) {
      container.appendChild(U.criarEl("article", { class: "servico" }, [
        U.criarEl("span", {
          class: "servico__numero",
          "aria-hidden": "true",
          text: String(indice + 1).padStart(2, "0")
        }),
        U.criarEl("span", { class: "servico__icone", "aria-hidden": "true" },
          U.criarIcone(servico.icone || "monitor")),
        U.criarEl("h3", { text: servico.titulo }),
        U.criarEl("p", { text: servico.descricao }),
        (servico.tags && servico.tags.length
          ? U.criarEl("div", { class: "servico__tags" },
              servico.tags.map(function (tag) {
                return U.criarEl("span", { text: tag });
              }))
          : null),
        /* Cada serviço abre o WhatsApp com a mensagem específica dele */
        U.criarEl("a", {
          class: "servico__link",
          href: "#",
          dataset: { whatsapp: servico.id || "padrao" },
          "aria-label": "Falar sobre " + servico.titulo + " pelo WhatsApp"
        }, [
          U.criarEl("span", { text: "Falar sobre este serviço" }),
          U.criarIcone("seta-direita")
        ])
      ]));
    });
  }

  /* ==================================================================
     06. O QUE ESTÁ INCLUÍDO
     ================================================================== */

  function montarIncluido() {
    var container = U.$("#listaIncluido");
    if (!container) return;

    container.innerHTML = "";
    container.classList.add("escalonar");

    (CONFIG.incluido || []).forEach(function (item) {
      container.appendChild(U.criarEl("article", { class: "incluido" }, [
        U.criarEl("span", { class: "incluido__icone", "aria-hidden": "true" },
          U.criarIcone(item.icone || "check")),
        U.criarEl("div", {}, [
          U.criarEl("h3", { text: item.titulo }),
          U.criarEl("p", { text: item.texto })
        ])
      ]));
    });
  }

  /* ==================================================================
     07. SISTEMAS WEB
     ================================================================== */

  function montarSistemas() {
    /* Cards de tipos de sistema */
    var cards = U.$("#listaSistemas");
    if (cards) {
      cards.innerHTML = "";
      cards.classList.add("escalonar");

      (CONFIG.sistemas || []).forEach(function (sistema) {
        cards.appendChild(U.criarEl("article", { class: "sistema-card" }, [
          U.criarEl("span", { class: "sistema-card__icone", "aria-hidden": "true" },
            U.criarIcone(sistema.icone || "sistema")),
          U.criarEl("h3", { text: sistema.titulo }),
          U.criarEl("p", { text: sistema.descricao })
        ]));
      });
    }

    /* Galeria de sistemas (bento menor) */
    var galeria = U.$("#listaPortfolioSistemas");
    if (!galeria) return;

    galeria.innerHTML = "";
    galeria.classList.add("escalonar");

    var projetos = Cl.prepararLista(Api.sistemas());
    if (!projetos.length) {
      galeria.hidden = true;
      return;
    }

    galeria.hidden = false;

    projetos.forEach(function (projeto) {
      galeria.appendChild(U.criarEl("article", {
        class: "bento__item bento__item--terco",
        dataset: {
          categoria: projeto.categoria || "",
          classe: projeto.classe,
          busca: projeto.busca,
          lightbox: "sistemas",
          imagem: projeto.imagem,
          titulo: projeto.titulo,
          descricao: projeto.descricao,
          url: projeto.url || "#",
          tags: (projeto.tags || []).join("|")
        },
        tabindex: "0",
        role: "button",
        "aria-label": "Ver detalhes do sistema " + projeto.titulo
      }, [
        U.criarEl("div", { class: "bento__midia" },
          U.criarEl("img", {
            src: projeto.imagem,
            alt: "Tela do sistema " + projeto.titulo,
            loading: "lazy",
            decoding: "async"
          })),
        U.criarEl("div", { class: "bento__sobreposicao" }, [
          U.criarEl("span", { class: "bento__categoria", text: projeto.categoria || "Sistema" }),
          U.criarEl("h3", { class: "bento__titulo", text: projeto.titulo }),
          U.criarEl("p", { class: "bento__descricao", text: projeto.descricao })
        ])
      ]));
    });

    // O clique no lightbox é delegado pelo ui.js. Aqui só o teclado.
    habilitarTecladoNosCards(galeria, "[data-lightbox='sistemas']");
  }

  /**
   * Permite abrir um card com Enter ou Espaço (acessibilidade).
   * O clique é tratado pelo listener delegado em ui.js.
   */
  function habilitarTecladoNosCards(container, seletor) {
    U.$$(seletor, container).forEach(function (card) {
      card.addEventListener("keydown", function (evento) {
        if (evento.key !== "Enter" && evento.key !== " ") return;
        evento.preventDefault();
        card.click();
      });
    });
  }

  /* ==================================================================
     08. PORTFÓLIO DE SITES (BENTO GRID)
     ================================================================== */

  /* ------------------------------------------------------------------------
     BENTO GRID — o layout é calculado para a grade nunca ficar com buraco.

     As fotos de site são screenshots de desktop (~2,1:1, bem largas), então
     os cards também são largos: um formato retrato cortaria a maior parte da
     imagem. Cada formato foi escolhido pela proporção resultante:

        destaque (12 x 3) -> 2,16  (recorta ~3% da altura)   quase intacto
        metade  (6  x 2) -> 1,65  (recorta ~21% da largura)  aceitável
        largo   (12 x 2) -> 3,30  (recorta ~36% da altura)   uso raro

     Ciclo que fecha 12 colunas exatas:
       destaque (12)                 = 12   (3 linhas de altura)
       metade (6) + metade (6)       = 12   (2 linhas de altura)

     Quando a quantidade de projetos não fecha o ciclo completo, a cauda
     é reorganizada. Veja a tabela abaixo (12 colunas = largura da grade):

       sobra 0  ->  nada a fazer, o ciclo já fechou
       sobra 1  ->  1 card destaque (12)
       sobra 2  ->  2 cards de metade (6 + 6)
     ---------------------------------------------------------------------- */

  var CICLO_BENTO = ["destaque", "metade", "metade"];

  var FECHAMENTO_BENTO = {
    1: ["destaque"],
    2: ["metade", "metade"]
  };

  function calcularTamanhosBento(lista) {
    var ciclo = CICLO_BENTO.length;

    var tamanhos = lista.map(function (projeto, indice) {
      return projeto.destaque ? "destaque" : CICLO_BENTO[indice % ciclo];
    });

    /*
     * A cauda tem prioridade sobre o ciclo: é ela que garante que a
     * última linha fique completa. Um item marcado como "destaque"
     * pelo config.js perde o tamanho especial se estiver na cauda,
     * porque o buraco na grade é pior que o destaque visual.
     */
    var fechamento = FECHAMENTO_BENTO[lista.length % ciclo];

    if (fechamento) {
      var inicio = lista.length - fechamento.length;
      fechamento.forEach(function (tamanho, posicao) {
        tamanhos[inicio + posicao] = tamanho;
      });
    }

    return tamanhos;
  }

  function montarPortfolio() {
    var bento = U.$("#bentoSites");
    var filtros = U.$("#filtrosSites");
    var aviso = U.$("#semResultadoSites");
    if (!bento) return;

    var projetos = Cl.prepararLista(Api.sites());

    /* Registra a instância de busca */
    Se.criar({
      itens: projetos,
      filtros: CONFIG.portfolio.filtrosSites,
      chave: "sites"
    });

    bento.innerHTML = "";
    bento.classList.add("escalonar");

    if (!projetos.length) {
      bento.hidden = true;
      if (aviso) aviso.hidden = false;
      return;
    }

    bento.hidden = false;

    var tamanhos = calcularTamanhosBento(projetos);

    projetos.forEach(function (projeto, indice) {
      var tamanho = tamanhos[indice];

      var card = U.criarEl("article", {
        class: "bento__item bento__item--" + tamanho,
        dataset: {
          categoria: projeto.categoria || "",
          classe: projeto.classe,
          busca: projeto.busca,
          lightbox: "sites",
          imagem: projeto.imagem,
          titulo: projeto.titulo,
          descricao: projeto.descricao,
          url: projeto.url || "#",
          tags: (projeto.tags || []).join("|")
        },
        tabindex: "0",
        role: "button",
        "aria-label": "Ver detalhes do projeto " + projeto.titulo
      }, [
        U.criarEl("div", { class: "bento__midia" },
          U.criarEl("img", {
            src: projeto.imagem,
            alt: "Imagem do projeto " + projeto.titulo,
            loading: indice < 2 ? "eager" : "lazy",
            decoding: "async"
          })),
        tamanho === "destaque"
          ? U.criarEl("span", { class: "bento__marca" }, [
              U.criarEl("span", { class: "ponto-luz", "aria-hidden": "true" }),
              "Projeto em destaque"
            ])
          : null,
        U.criarEl("div", { class: "bento__sobreposicao" }, [
          U.criarEl("span", { class: "bento__categoria", text: projeto.categoria || "Site" }),
          U.criarEl("h3", { class: "bento__titulo", text: projeto.titulo }),
          U.criarEl("p", { class: "bento__descricao", text: projeto.descricao }),
          U.criarEl("span", { class: "bento__acao" }, [
            "Ver projeto",
            U.criarIcone("seta-direita")
          ])
        ])
      ]);

      bento.appendChild(card);
    });

    /* O clique no lightbox é delegado pelo ui.js. Aqui só o teclado. */
    habilitarTecladoNosCards(bento, "[data-lightbox='sites']");

    /* Filtros por categoria */
    Se.montarFiltros(filtros, Se.filtrosDaSecao("sites", CONFIG.portfolio.filtrosSites), "sites", {
      containerCards: bento,
      aviso: aviso
    });
  }

  /* ==================================================================
     09. ANTES E DEPOIS
     ================================================================== */

  function montarAntesDepois() {
    var container = U.$("#listaAntesDepois");
    if (!container) return;

    container.innerHTML = "";
    container.classList.add("escalonar");

    var projetos = Api.antesDepois();

    if (!projetos.length) {
      container.hidden = true;
      return;
    }

    container.hidden = false;

    projetos.forEach(function (projeto) {
      container.appendChild(U.criarEl("article", { class: "comparador-bloco" }, [
        U.criarEl("div", {
          class: "comparador",
          dataset: { comparador: projeto.id || "" },
          tabindex: "0",
          role: "group",
          "aria-label":
            "Comparação antes e depois: " + projeto.titulo +
            ". Use as setas do teclado para mover a alça."
        }, [
          /* Imagem "depois" como base */
          U.criarEl("img", {
            class: "comparador__imagem",
            src: projeto.depois,
            alt: (projeto.depoisLabel || "Depois") + " — " + projeto.titulo,
            loading: "lazy",
            decoding: "async"
          }),

          /* Camada "antes", recortada pela alça */
          U.criarEl("div", { class: "comparador__camada" },
            U.criarEl("img", {
              class: "comparador__imagem",
              src: projeto.antes,
              alt: (projeto.antesLabel || "Antes") + " — " + projeto.titulo,
              loading: "lazy",
              decoding: "async"
            })),

          U.criarEl("span", { class: "comparador__tag comparador__tag--antes", text: "Antes" }),
          U.criarEl("span", { class: "comparador__tag comparador__tag--depois", text: "Depois" }),

          U.criarEl("div", { class: "comparador__divisor", "aria-hidden": "true" }),

          U.criarEl("div", {
            class: "comparador__alca",
            role: "slider",
            tabindex: "-1",
            "aria-label": "Alça de comparação antes e depois",
            "aria-valuemin": "0",
            "aria-valuemax": "100",
            "aria-valuenow": "50"
          }, U.criarIcone("arraste"))
        ]),

        U.criarEl("div", { class: "comparador__info" }, [
          U.criarEl("span", { class: "comparador__categoria", text: projeto.categoria || "" }),
          U.criarEl("h3", { text: projeto.titulo }),
          U.criarEl("p", { text: projeto.descricao || "" })
        ])
      ]));
    });

    /* Os comparadores são registrados por UI.iniciarTudo(), chamado
       logo depois de todas as seções serem montadas. */
  }

  /* ==================================================================
     10. DESIGN GRÁFICO
     ================================================================== */

  var SERVICOS_DESIGN = [
    "Banners", "Artes para redes sociais", "Logotipos", "Identidade visual",
    "Posts para Instagram e Facebook", "Materiais comerciais", "Cartões de visita",
    "Edita\u00e7\u00e3o de imagens", "Capa de Facebook"
  ];

  function montarDesign() {
    var galeria = U.$("#galeriaDesign");
    var filtros = U.$("#filtrosDesign");
    var aviso = U.$("#semResultadoDesign");
    if (!galeria) return;

    var projetos = Cl.prepararLista(Api.design());

    Se.criar({ itens: projetos, filtros: CONFIG.portfolio.filtrosDesign, chave: "design" });

    galeria.innerHTML = "";
    galeria.classList.add("escalonar");

    projetos.forEach(function (projeto, indice) {
      galeria.appendChild(U.criarEl("figure", {
        class: "peca",
        dataset: {
          categoria: projeto.categoria || "",
          classe: projeto.classe,
          busca: projeto.busca,
          lightbox: "design",
          imagem: projeto.imagem,
          titulo: projeto.titulo,
          descricao: projeto.descricao,
          url: projeto.url || "#",
          tags: (projeto.tags || []).join("|")
        },
        tabindex: "0",
        role: "button",
        "aria-label": "Ampliar peça: " + projeto.titulo
      }, [
        U.criarEl("img", {
          src: projeto.imagem,
          alt: projeto.titulo + " — " + (projeto.categoria || "design gráfico"),
          loading: indice < 4 ? "eager" : "lazy",
          decoding: "async"
        }),
        U.criarEl("span", { class: "peca__fundo", "aria-hidden": "true" },
          U.criarIcone("busca")),
        U.criarEl("figcaption", { class: "peca__info" }, [
          U.criarEl("strong", { text: projeto.titulo }),
          U.criarEl("small", { text: projeto.categoria || "" })
        ])
      ]));
    });

    /* O clique no lightbox é delegado pelo ui.js. Aqui só o teclado. */
    habilitarTecladoNosCards(galeria, "[data-lightbox='design']");

    Se.montarFiltros(filtros, Se.filtrosDaSecao("design", CONFIG.portfolio.filtrosDesign), "design", {
      containerCards: galeria,
      aviso: aviso
    });

    /* Serviços de design */
    var servicos = U.$("#listaDesignServicos");
    if (servicos) {
      servicos.innerHTML = "";
      SERVICOS_DESIGN.forEach(function (nome) {
        servicos.appendChild(U.criarEl("span", { text: nome }));
      });
    }
  }

  /* ==================================================================
     11. SUA EMPRESA JÁ ESTÁ NA INTERNET?
     ================================================================== */

  function montarPresenca() {
    var container = U.$("#comparativoPresenca");
    if (!container) return;

    container.innerHTML = "";

    var sem = CONFIG.presenca.semSite;
    var com = CONFIG.presenca.comSite;

    /* Coluna "sem site" */
    var listaSem = U.criarEl("ul", { class: "cenario__lista" },
      (sem.itens || []).map(function (item) {
        return U.criarEl("li", {}, [
          U.criarIcone("fechar"),
          U.criarEl("span", { text: item })
        ]);
      })
    );

    container.appendChild(U.criarEl("article", { class: "cenario cenario--sem" }, [
      U.criarEl("div", { class: "cenario__cabecalho" }, [
        U.criarEl("span", { class: "cenario__marca", "aria-hidden": "true", text: "✕" }),
        U.criarEl("div", {}, [
          U.criarEl("span", { class: "cenario__rotulo", text: sem.rotulo || "" }),
          U.criarEl("h3", { class: "cenario__titulo", text: sem.titulo || "" })
        ])
      ]),
      listaSem
    ]));

    /* Coluna "com site" */
    var listaCom = U.criarEl("ul", { class: "cenario__lista" },
      (com.itens || []).map(function (item) {
        return U.criarEl("li", {}, [
          U.criarIcone("check"),
          U.criarEl("span", { text: item })
        ]);
      })
    );

    container.appendChild(U.criarEl("article", { class: "cenario cenario--com" }, [
      U.criarEl("div", { class: "cenario__cabecalho" }, [
        U.criarEl("span", { class: "cenario__marca", "aria-hidden": "true", text: "✓" }),
        U.criarEl("div", {}, [
          U.criarEl("span", { class: "cenario__rotulo", text: com.rotulo || "" }),
          U.criarEl("h3", { class: "cenario__titulo", text: com.titulo || "" })
        ])
      ]),
      listaCom
    ]));

    /* Nota de honestidade sobre resultados */
    var nota = U.$("#notaPresenca");
    if (nota) nota.textContent = CONFIG.presenca.nota || "";
  }

  /* ==================================================================
     12. DIFERENCIAIS
     ================================================================== */

  function montarDiferenciais() {
    var container = U.$("#listaDiferenciais");
    if (!container) return;

    container.innerHTML = "";
    container.classList.add("escalonar");

    (CONFIG.diferenciais || []).forEach(function (item) {
      container.appendChild(U.criarEl("article", { class: "diferencial" }, [
        U.criarEl("span", { class: "diferencial__icone", "aria-hidden": "true" },
          U.criarIcone(item.icone || "marca")),
        U.criarEl("h3", { text: item.titulo }),
        U.criarEl("p", { text: item.texto })
      ]));
    });
  }

  /* ==================================================================
     13. PROCESSO
     ================================================================== */

  function montarProcesso() {
    var container = U.$("#linhaDoTempo");
    if (!container) return;

    container.innerHTML = "";
    container.classList.add("escalonar");

    (CONFIG.processo || []).forEach(function (passo) {
      container.appendChild(U.criarEl("li", { class: "passo" }, [
        U.criarEl("span", { class: "passo__numero", text: passo.numero || "" }),
        U.criarEl("h3", { text: passo.titulo }),
        U.criarEl("p", { text: passo.texto })
      ]));
    });
  }

  /* ==================================================================
     14. INVESTIMENTO
     ================================================================== */

  function montarInvestimento() {
    var inv = CONFIG.investimento;
    if (!inv) return;

    /* Título em duas linhas */
    var titulo = U.$("#investimentoTitulo");
    if (titulo && Array.isArray(inv.titulo)) {
      titulo.innerHTML = "";
      inv.titulo.forEach(function (linha) {
        titulo.appendChild(U.criarEl("span", { class: "linha", text: linha }));
      });
    }

    /* Cartão principal */
    preencher("#precoRotulo", inv.desenvolvimento.rotulo);
    preencher("#precoValor", inv.desenvolvimento.preco);
    preencher("#precoDescricao", inv.desenvolvimento.descricao);
    preencher("#precoAviso", inv.desenvolvimento.aviso);

    var itens = U.$("#precoItens");
    if (itens) {
      itens.innerHTML = "";
      (inv.desenvolvimento.itens || []).forEach(function (item) {
        itens.appendChild(U.criarEl("li", {}, [
          U.criarIcone("check"),
          U.criarEl("span", { text: item })
        ]));
      });
    }

    /* Pagamento */
    preencher("#pagamentoRotulo", inv.pagamento.rotulo);
    preencher("#pagamentoTitulo", inv.pagamento.titulo);
    preencher("#pagamentoTexto", inv.pagamento.texto);

    /* Domínio */
    preencher("#dominioRotulo", inv.dominio.rotulo);
    preencher("#dominioTitulo", inv.dominio.titulo);
    preencher("#dominioPreco", inv.dominio.preco);
    preencher("#dominioTexto", inv.dominio.texto);
    preencher("#dominioExemplo", inv.dominio.exemplo);

    /* Hospedagem */
    preencher("#hospedagemRotulo", inv.hospedagem.rotulo);
    preencher("#hospedagemTitulo", inv.hospedagem.titulo);
    preencher("#hospedagemPreco", inv.hospedagem.preco);

    var hospedagemTextos = U.$("#hospedagemTextos");
    if (hospedagemTextos) {
      hospedagemTextos.innerHTML = "";

      var textos = Array.isArray(inv.hospedagem.texto)
        ? inv.hospedagem.texto
        : [inv.hospedagem.texto];

      textos.forEach(function (paragrafo) {
        hospedagemTextos.appendChild(U.criarEl("p", { text: paragrafo }));
      });
    }

    /* Faixas de escopo */
    var faixas = U.$("#listaFaixas");
    if (faixas) {
      faixas.innerHTML = "";
      faixas.classList.add("escalonar");

      (inv.faixas || []).forEach(function (faixa) {
        faixas.appendChild(U.criarEl("article", { class: "faixa-item" }, [
          U.criarEl("h3", { text: faixa.nome }),
          U.criarEl("span", { class: "faixa-item__preco", text: faixa.preco }),
          U.criarEl("p", { text: faixa.texto }),
          (faixa.itens && faixa.itens.length
            ? U.criarEl("ul", {}, faixa.itens.map(function (item) {
                return U.criarEl("li", {}, [
                  U.criarIcone("check"),
                  U.criarEl("span", { text: item })
                ]);
              }))
            : null)
        ]));
      });
    }

    /* Observações */
    var observacoes = U.$("#listaObservacoes");
    if (observacoes) {
      observacoes.innerHTML = "";
      (inv.observacoes || []).forEach(function (item) {
        observacoes.appendChild(U.criarEl("li", { text: item }));
      });
    }

    function preencher(seletor, valor) {
      var el = U.$(seletor);
      if (el && valor) el.textContent = valor;
    }
  }

  /* ==================================================================
     15. CONTATO E FORMULÁRIO
     ================================================================== */

  function montarContato() {
    /* Itens de contato (WhatsApp, e-mail, cidade, horário) */
    var itens = U.$("#listaContato");
    if (itens) {
      itens.innerHTML = "";

      var whatsappNumero = String(CONFIG.whatsapp || "").replace(/\D/g, "");
      var whatsappPronto = whatsappNumero.length >= 10;

      if (whatsappPronto) {
        itens.appendChild(U.criarEl("li", {}, [
          U.criarIcone("whatsapp"),
          U.criarEl("a", {
            href: U.urlWhatsapp(CONFIG.mensagemPadrao),
            target: "_blank",
            rel: "noopener noreferrer"
          }, "WhatsApp: " + (CONFIG.telefone && !U.ehPlaceholder(CONFIG.telefone)
            ? CONFIG.telefone : CONFIG.whatsapp))
        ]));
      }

      if (U.configurado(CONFIG.email)) {
        itens.appendChild(U.criarEl("li", {}, [
          U.criarIcone("email"),
          U.criarEl("a", { href: "mailto:" + CONFIG.email }, CONFIG.email)
        ]));
      }

      if (U.configurado(CONFIG.cidade)) {
        itens.appendChild(U.criarEl("li", {}, [
          U.criarIcone("local"),
          U.criarEl("span", { text: CONFIG.cidade })
        ]));
      }

      if (U.configurado(CONFIG.horario)) {
        itens.appendChild(U.criarEl("li", {}, [
          U.criarIcone("relogio"),
          U.criarEl("span", { text: CONFIG.horario })
        ]));
      }

      itens.hidden = !itens.children.length;
    }

    /* Redes sociais */
    var redes = [
      { url: CONFIG.instagram, icone: "instagram", nome: "Instagram" },
      { url: CONFIG.github, icone: "github", nome: "GitHub" },
      { url: CONFIG.linkedin, icone: "linkedin", nome: "LinkedIn" }
    ].filter(function (rede) {
      return U.configurado(rede.url);
    });

    var containerRedes = U.$("#listaRedes");
    if (containerRedes) {
      containerRedes.innerHTML = "";
      containerRedes.hidden = !redes.length;

      redes.forEach(function (rede) {
        containerRedes.appendChild(U.criarEl("a", {
          class: "rede-social",
          href: rede.url,
          target: "_blank",
          rel: "noopener noreferrer"
        }, [U.criarIcone(rede.icone), U.criarEl("span", { text: rede.nome })]));
      });
    }

    /* Mesma lista, formato só com ícone, no rodapé */
    var redesRodape = U.$("#redesRodape");
    if (redesRodape) {
      redesRodape.innerHTML = "";
      redesRodape.hidden = !redes.length;

      redes.forEach(function (rede) {
        redesRodape.appendChild(U.criarEl("a", {
          href: rede.url,
          target: "_blank",
          rel: "noopener noreferrer",
          "aria-label": rede.nome,
          title: rede.nome
        }, U.criarIcone(rede.icone)));
      });
    }

    montarFormulario();
  }

  function montarFormulario() {
    var form = U.$("#formularioContato");
    var select = U.$("#campoServico");
    if (!form || !select) return;

    /* Opções do serviço */
    select.innerHTML = "";
    select.appendChild(U.criarEl("option", { value: "", text: "Selecione uma opção" }));

    (CONFIG.opcoesServico || []).forEach(function (opcao) {
      select.appendChild(U.criarEl("option", { value: opcao, text: opcao }));
    });

    /* Máscara do WhatsApp enquanto digita */
    var campoWhatsapp = U.$("#campoWhatsapp");

    if (campoWhatsapp) {
      campoWhatsapp.addEventListener("input", function () {
        campoWhatsapp.value = U.formatarTelefone(campoWhatsapp.value);
      });
    }

    /* Limpa o erro enquanto o usuário digita */
    U.$$(".campo input, .campo select, .campo textarea", form).forEach(function (campo) {
      campo.addEventListener("input", function () {
        var bloco = campo.closest(".campo");
        if (bloco) bloco.classList.remove("is-erro");
      });
    });

    /* Envio: monta a mensagem e abre o WhatsApp */
    form.addEventListener("submit", function (evento) {
      evento.preventDefault();

      var dados = {
        nome: U.$("#campoNome").value.trim(),
        empresa: U.$("#campoEmpresa").value.trim(),
        whatsapp: U.$("#campoWhatsapp").value.trim(),
        servico: select.value || "um projeto para a minha empresa",
        mensagem: U.$("#campoMensagem").value.trim()
      };

      /* Validação */
      var valido = validarFormulario(dados);
      if (!valido) {
        UI.toast("Confira os campos destacados antes de enviar.", "erro");
        UI.anunciar("Há campos obrigatórios para preencher.");
        var primeiroErro = U.$(".campo.is-erro input, .campo.is-erro select", form);
        if (primeiroErro) primeiroErro.focus();
        return;
      }

      /* Número configurado? */
      var numero = String(CONFIG.whatsapp || "").replace(/\D/g, "");
      if (numero.length < 10) {
        UI.toast("Configure o WhatsApp em js/config.js para receber os pedidos.", "info");
        return;
      }

      /* Monta a mensagem */
      var base = U.aplicarMensagem(CONFIG.mensagemContato, dados);

      // A mensagem digitada pelo visitante entra no final, se houver
      var mensagem = dados.mensagem ? base + "\n\n" + dados.mensagem : base;

      // Registra a intenção (só o tipo de serviço — sem dados pessoais)
      window.Api.lead({
        tipo: "orcamento",
        servico: dados.servico,
        origem: "formulario"
      });

      window.open(U.urlWhatsapp(mensagem), "_blank", "noopener,noreferrer");

      UI.toast("Abrindo o WhatsApp com a mensagem pronta.", "sucesso");
      UI.anunciar("Mensagem pronta. O WhatsApp vai abrir em uma nova aba.");

      form.reset();
    });
  }

  function validarFormulario(dados) {
    var form = U.$("#formularioContato");
    var erros = {
      nome: dados.nome.length >= 2 ? "" : "Informe seu nome.",
      empresa: dados.empresa.length >= 2 ? "" : "Informe o nome da empresa.",
      whatsapp: U.telefoneValido(dados.whatsapp) ? "" : "Informe um WhatsApp válido com DDD."
    };

    var valido = true;

    Object.keys(erros).forEach(function (nome) {
      var bloco = U.$('.campo [name="' + nome + '"]', form);
      if (!bloco) return;

      var container = bloco.closest(".campo");
      var mensagem = U.$('[data-erro="' + nome + '"]', form);

      if (mensagem) mensagem.textContent = erros[nome];

      if (erros[nome]) {
        container.classList.add("is-erro");
        bloco.setAttribute("aria-invalid", "true");
        valido = false;
      } else {
        container.classList.remove("is-erro");
        bloco.removeAttribute("aria-invalid");
      }
    });

    return valido;
  }

  /* ==================================================================
     16. RODAPÉ
     ================================================================== */

  function montarRodape() {
    /* Serviços no rodapé */
    var servicos = U.$("#listaRodapeServicos");
    if (servicos) {
      servicos.innerHTML = "";

      (CONFIG.servicos || []).forEach(function (servico) {
        servicos.appendChild(U.criarEl("li", {}, [
          U.criarEl("a", { href: "#servicos" }, [
            U.criarIcone("seta-direita"),
            U.criarEl("span", { text: servico.titulo })
          ])
        ]));
      });
    }

    /* Contato no rodapé */
    var contato = U.$("#listaRodapeContato");
    if (contato) {
      contato.innerHTML = "";

      var whatsappNumero = String(CONFIG.whatsapp || "").replace(/\D/g, "");

      if (whatsappNumero.length >= 10) {
        contato.appendChild(U.criarEl("li", {}, [
          U.criarEl("a", {
            href: U.urlWhatsapp(CONFIG.mensagemPadrao),
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            U.criarIcone("whatsapp"),
            U.criarEl("span", {
              text: U.configurado(CONFIG.telefone) ? CONFIG.telefone : CONFIG.whatsapp
            })
          ])
        ]));
      }

      if (U.configurado(CONFIG.email)) {
        contato.appendChild(U.criarEl("li", {}, [
          U.criarEl("a", { href: "mailto:" + CONFIG.email }, [
            U.criarIcone("email"),
            U.criarEl("span", { text: CONFIG.email })
          ])
        ]));
      }

      if (U.configurado(CONFIG.cidade)) {
        contato.appendChild(U.criarEl("li", {}, [
          U.criarIcone("local"),
          U.criarEl("span", { text: CONFIG.cidade })
        ]));
      }

      if (U.configurado(CONFIG.areaAtendimento)) {
        contato.appendChild(U.criarEl("li", {}, [
          U.criarIcone("dominio"),
          U.criarEl("span", { text: CONFIG.areaAtendimento })
        ]));
      }

      contato.hidden = !contato.children.length;
    }

    /* Copyright */
    var copyright = U.$("#rodapeCopyright");
    if (copyright) {
      copyright.textContent = "© " + new Date().getFullYear() + " " + CONFIG.nome +
        ". Desenvolvimento de Sites, Sistemas e Design.";
    }

    /* Texto do botão flutuante */
    var textoCta = U.$("#ctaFlutuanteTexto");
    if (textoCta) textoCta.textContent = CONFIG.textoBotaoFlutuante || "Falar sobre meu projeto";
  }

  /* ==================================================================
     TEXTOS SIMPLES (data-config)
     ================================================================== */

  /**
   * Preenche todo elemento com data-config="caminho.do.campo".
   * Ex.: data-config="frases.servicos.titulo"
   */
  function aplicarTextosDoConfig() {
    U.$$("[data-config]").forEach(function (el) {
      var valor = CONFIG;
      var partes = el.dataset.config.split(".");

      partes.forEach(function (parte) {
        if (valor && typeof valor === "object") valor = valor[parte];
      });

      if (typeof valor === "string" && valor.length) el.textContent = valor;
    });
  }

  /**
   * Monta o nome da marca em duas partes: "Scrock" (azul escuro, negrito)
   * e "Sys" (azul claro, sem negrito). Os textos vêm do config.js.
   */
  function aplicarMarca() {
    U.$$("[data-marca]").forEach(function (el) {
      var texto = CONFIG["marcaParte" + el.dataset.marca];

      if (typeof texto === "string" && texto.length) {
        el.textContent = texto;
      } else {
        // Sem configuração: mostra a marca inteira numa cor só
        var partes = U.$$("[data-marca]");

        if (partes.length === 2) {
          partes[0].textContent = CONFIG.marca || "";
          if (partes[1]) partes[1].textContent = "";
        }
      }
    });
  }

  /* ==================================================================
     17. NAVEGAÇÃO SUAVE
     ================================================================== */

  function iniciarNavegacaoSuave() {
    document.addEventListener("click", function (evento) {
      var link = evento.target.closest('a[href^="#"]');
      if (!link) return;

      var hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      var alvo = document.querySelector(hash);
      if (!alvo) return;

      evento.preventDefault();
      U.rolarSuave(alvo);

      // Mantém a URL limpa (sem # na barra de endereço)
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", hash);
      }

      // Fecha o menu do celular, se estiver aberto
      var painel = U.$("#painelMenu");
      if (painel && painel.classList.contains("is-aberto") && typeof painel.fechar === "function") {
        painel.fechar();
      }
    });
  }

  /* ==================================================================
     INICIALIZAÇÃO
     ================================================================== */

  /**
   * Espera o js/config.js estar disponível antes de montar a página.
   *
   * Em um navegador comum os scripts são executados na ordem em que
   * aparecem no HTML, então esta espera dura zero tempo. Ela existe
   * para o site não quebrar caso um CDN, um proxy de cache ou uma
   * ferramenta de otimização reordene o carregamento dos arquivos.
   */
  function quandoConfigPronto(callback) {
    if (window.CONFIG) {
      callback();
      return;
    }

    var tentativas = 0;

    var intervalo = window.setInterval(function () {
      if (window.CONFIG) {
        window.clearInterval(intervalo);
        callback();
        return;
      }

        // Depois de ~2 segundos desiste e monta assim mesmo,
        // para o site nunca ficar em branco.
      if (++tentativas > 40) {
        window.clearInterval(intervalo);
        console.warn(
          "ScrockSys: js/config.js não carregou. Verifique se o arquivo existe " +
          "e se está no mesmo caminho do index.html."
        );
        callback();
      }
    }, 50);
  }

  function preparar() {
    aplicarSeo();
    aplicarTextosDoConfig();
    aplicarMarca();

    montarTituloHero();
    montarSobre();
    montarServicos();
    montarIncluido();
    montarSistemas();
    montarPortfolio();
    montarAntesDepois();
    montarDesign();
    montarPresenca();
    montarDiferenciais();
    montarProcesso();
    montarInvestimento();
    montarContato();
    montarRodape();

    iniciarNavegacaoSuave();

    // O UI roda depois que o HTML existe, para poder enxergar os comparadores
    UI.iniciarTudo();

    // O canvas do Hero é o último, para não atrasar o primeiro paint
    window.requestAnimationFrame(iniciarFundoHero);
  }

  function iniciar() {
    quandoConfigPronto(preparar);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
