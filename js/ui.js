/* ==========================================================================
   SCROCKSYS — ui.js
   --------------------------------------------------------------------------
   Componentes de interface:

   - Loader (tela de carregamento)
   - Menu fixo com efeito ao rolar + barra de progresso
   - Painel de menu do celular
   - Link ativo conforme a seção visível
   - Reveal / scroll reveal
   - Botão flutuante do WhatsApp
   - Comparador "antes e depois" (arrastar, clicar, teclado)
   - Lightbox da galeria
   - Toasts
   - Brilho que segue o cursor nos cards
   - Parallax suave da cena do Hero

   Exporta tudo em window.UI. app.js chama UI.iniciarTudo() no fim.
   ========================================================================== */

window.UI = (function () {
  "use strict";

  var U = window.Utils;

  /* Área viva para leitores de tela (anúncios de filtro, etc.) */
  var regionAnuncio = null;

  function criarRegionAnuncio() {
    if (regionAnuncio) return regionAnuncio;

    regionAnuncio = U.criarEl("div", {
      "aria-live": "polite",
      "aria-atomic": "true",
      style: "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0"
    });

    document.body.appendChild(regionAnuncio);
    return regionAnuncio;
  }

  /** Anuncia uma mensagem para leitores de tela. */
  function anunciar(mensagem) {
    var regiao = criarRegionAnuncio();
    regiao.textContent = "";
    window.setTimeout(function () {
      regiao.textContent = mensagem;
    }, 60);
  }

  /* ==================================================================
     1. LOADER
     ================================================================== */

  function iniciarLoader() {
    var loader = U.$("#loader");
    if (!loader) return;

    // Nunca deixa a tela travada, mesmo se algo der errado
    var esconder = function () {
      loader.classList.add("is-oculto");
      window.setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 700);
    };

    if (document.readyState === "complete") {
      window.setTimeout(esconder, 420);
    } else {
      window.addEventListener("load", function () {
        window.setTimeout(esconder, 420);
      });
    }

    // Rede de segurança: 4 segundos e o loader sai de qualquer forma
    window.setTimeout(esconder, 4000);
  }

  /* ==================================================================
     2. CABEÇALHO: fundo ao rolar + progresso + link ativo
     ================================================================== */

  function iniciarCabecalho() {
    var cabecalho = U.$("#cabecalho");
    var progresso = U.$("#barraProgresso");
    if (!cabecalho) return;

    /* Destaca a seção em AMBOS os menus: a barra do desktop e também o
       menu lateral do celular. Antes só a barra era atualizada, então no
       celular nenhum item ficava marcado ao rolar a página. */
    var linksCabecalho = U.$$("#listaNavegacao a");
    var linksMenu = U.$$(".painel-menu__lista a");

    /* Cada menu é calculado com os SEUS links: a barra do desktop não tem
       "Diferenciais", mas o menu lateral tem. Se os dois usassem a mesma
       lista, o celular marcaria "Design" ao rolar até Diferenciais.

       Nome da função só com letras ASCII: identificador com acento é
       frágil (encoding, minificação e ferramentas externas). */
    function secaoAtiva(links, linha) {
      var ativa = null;

      links.forEach(function (link) {
        var href = link.getAttribute("href");
        if (!href || href === "#") return;

        var alvo = document.querySelector(href);
        if (!alvo) return;

        if (alvo.getBoundingClientRect().top + window.pageYOffset <= linha) {
          ativa = href;
        }
      });

      return ativa;
    }

    function atualizar() {
      var rolou = window.pageYOffset > 24;
      cabecalho.classList.toggle("is-rolado", rolou);

      // Barra de progresso de leitura
      if (progresso) {
        var altura = document.documentElement.scrollHeight - window.innerHeight;
        var percentual = altura > 0 ? Math.min(100, (window.pageYOffset / altura) * 100) : 0;
        progresso.style.width = percentual + "%";
      }

      // A seção é considerada atual quando passa de 32% da altura da tela
      var linha = window.pageYOffset + (window.innerHeight * 0.32);

      linksCabecalho.forEach(function (link) {
        link.classList.toggle("is-ativo", link.getAttribute("href") === secaoAtiva(linksCabecalho, linha));
      });

      linksMenu.forEach(function (link) {
        link.classList.toggle("is-ativo", link.getAttribute("href") === secaoAtiva(linksMenu, linha));
      });
    }

    atualizar();
    window.addEventListener("scroll", U.throttle(atualizar, 90), { passive: true });
    window.addEventListener("resize", U.debounce(atualizar, 160));

    /* Mantém o item ativo visível quando o menu lateral abre */
    U.$("#painelMenu").addEventListener("transitionend", function () {
      var item = U.$(".painel-menu__lista a.is-ativo", this);
      if (!item) return;

      var lista = U.$(".painel-menu__lista", this);
      var topoItem = item.offsetTop;
      var base = topoItem - lista.offsetTop;

      if (base < lista.scrollTop || base + item.offsetHeight > lista.scrollTop + lista.clientHeight) {
        item.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    });
  }

  /* ==================================================================
     3. PAINEL DE MENU (CELULAR)
     ================================================================== */

  function iniciarMenu() {
    var hamburguer = U.$("#menuHamburguer");
    var painel = U.$("#painelMenu");
    var fundo = U.$("#painelMenuFundo");
    var fechar = U.$("#menuFechar");
    if (!hamburguer || !painel || !fundo) return;

    var aberto = false;
    var ultimoFoco = null;

    function abrir() {
      if (aberto) return;
      aberto = true;
      ultimoFoco = document.activeElement;

      fundo.hidden = false;
      painel.hidden = false;

      // Forces reflow para a transição funcionar
      void painel.offsetWidth;

      fundo.classList.add("is-visivel");
      painel.classList.add("is-aberto");
      hamburguer.classList.add("is-aberto");
      hamburguer.setAttribute("aria-expanded", "true");
      hamburguer.setAttribute("aria-label", "Fechar menu de navegação");
      document.body.classList.add("sem-scroll");

      var primeiro = U.$(".painel-menu__lista a", painel);
      if (primeiro) primeiro.focus();
    }

    function fecharMenu() {
      if (!aberto) return;
      aberto = false;

      fundo.classList.remove("is-visivel");
      painel.classList.remove("is-aberto");
      hamburguer.classList.remove("is-aberto");
      hamburguer.setAttribute("aria-expanded", "false");
      hamburguer.setAttribute("aria-label", "Abrir menu de navegação");
      document.body.classList.remove("sem-scroll");

      window.setTimeout(function () {
        if (aberto) return;
        fundo.hidden = true;
        painel.hidden = true;
      }, 640);

      if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    }

    hamburguer.addEventListener("click", function () {
      aberto ? fecharMenu() : abrir();
    });

    if (fechar) fechar.addEventListener("click", fecharMenu);
    fundo.addEventListener("click", fecharMenu);

    // Fecha ao clicar em qualquer link do painel
    U.$$(".painel-menu__lista a", painel).forEach(function (link) {
      link.addEventListener("click", fecharMenu);
    });

    // ESC fecha o painel
    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape" && aberto) fecharMenu();

      // Mantém o foco dentro do painel enquanto ele estiver aberto
      if (evento.key === "Tab" && aberto) {
        var focaveis = U.$$('a[href], button:not([disabled])', painel)
          .filter(function (el) { return el.offsetParent !== null; });

        if (!focaveis.length) return;

        var primeiro = focaveis[0];
        var ultimo = focaveis[focaveis.length - 1];

        if (evento.shiftKey && document.activeElement === primeiro) {
          evento.preventDefault();
          ultimo.focus();
        } else if (!evento.shiftKey && document.activeElement === ultimo) {
          evento.preventDefault();
          primeiro.focus();
        }
      }
    });

    // Se a tela ficar grande, o painel não pode ficar preso aberto
    window.addEventListener("resize", U.debounce(function () {
      if (window.innerWidth > 1024 && aberto) fecharMenu();
    }, 200));

    painel.fechar = fecharMenu;
  }

  /* ==================================================================
     4. SCROLL REVEAL
     ================================================================== */

  function iniciarReveal() {
    var alvos = U.$$("[data-reveal], .escalonar");

    if (!alvos.length) return;

    // Sem IntersectionObserver ou com menos movimento:
    // mostra tudo de uma vez.
    if (!("IntersectionObserver" in window) || U.movimentoReduzido()) {
      alvos.forEach(function (alvo) {
        alvo.classList.add("is-revelado");
      });
      return;
    }

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("is-revelado");
        observador.unobserve(entrada.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    });

    alvos.forEach(function (alvo) {
      observador.observe(alvo);
    });
  }

  /* ==================================================================
     5. MARQUEE DA FAIXA DE SERVIÇOS
     ------------------------------------------------------------------
     A animação translada a faixa até -50%. Para o loop ser invisível,
     o conteúdo precisa estar duplicado: quando a primeira metade sai
     pela esquerda, a segunda ocupa exatamente o mesmo lugar.

     Sem a duplicação a barra ficava com metade vazia — era o
     "faltando letras" que aparecia quando a rolagem chegava ao fim.
     ================================================================== */

  function iniciarFaixaServicos() {
    var conteudo = U.$("#faixaConteudo");
    if (!conteudo) return;
    if (conteudo.dataset.duplicado === "sim") return;

    // Rótulo para leitores de tela
    conteudo.setAttribute("role", "marquee");
    conteudo.setAttribute("aria-label", "Áreas de atuação");

    // A cópia fica fora da árvore acessível (aria-hidden) para o leitor
    // de tela não announcementar as mesmas palavras duas vezes.
    var copia = U.criarEl("div", {
      class: "faixa__conteudo faixa__conteudo--copia",
      "aria-hidden": "true"
    });
    copia.innerHTML = conteudo.innerHTML;

    conteudo.parentNode.appendChild(copia);
    conteudo.dataset.duplicado = "sim";
  }

  /* ==================================================================
     6. CTA FLUTUANTE
     ================================================================== */

  function iniciarCtaFlutuante() {
    var cta = U.$("#ctaFlutuante");
    if (!cta) return;

    function atualizar() {
      // Aparece depois do Hero e esconde quando a seção de contato entra
      var passouHero = window.pageYOffset > window.innerHeight * 0.55;
      var contato = U.$("#contato");
      var dentroDoContato = false;

      if (contato) {
        var topo = contato.getBoundingClientRect().top;
        dentroDoContato = topo < window.innerHeight * 0.75;
      }

      cta.classList.toggle("is-visivel", passouHero && !dentroDoContato);
    }

    atualizar();
    window.addEventListener("scroll", U.throttle(atualizar, 140), { passive: true });
  }

  /* ==================================================================
     6. COMPARADOR "ANTES E DEPOIS"
     ================================================================== */

  function iniciarComparadores() {
    var comparadores = U.$$("[data-comparador]");

    comparadores.forEach(function (comparador) {
      var alca = U.$(".comparador__alca", comparador);
      var posicao = 50;
      var arrastando = false;

      function marcarExtremo(valor) {
        if (valor <= 4) comparador.dataset.extremo = "inicio";
        else if (valor >= 96) comparador.dataset.extremo = "fim";
        else comparador.dataset.extremo = "meio";
      }

      function aplicar(percentual) {
        posicao = Math.max(0, Math.min(100, percentual));
        comparador.style.setProperty("--pos", posicao + "%");
        marcarExtremo(posicao);

        if (alca) {
          alca.setAttribute("aria-valuenow", String(Math.round(posicao)));
          alca.setAttribute("aria-valuetext", Math.round(posicao) + "% antes, " + Math.round(100 - posicao) + "% depois");
        }
      }

      function percentualDoEvento(evento) {
        var caixa = comparador.getBoundingClientRect();
        if (!caixa.width) return posicao; // layout ainda não calculado

        var x = (evento.clientX !== undefined ? evento.clientX : 0) - caixa.left;
        return (x / caixa.width) * 100;
      }

      function iniciarArraste(evento) {
        arrastando = true;
        comparador.classList.add("is-arrastando");
        if (alca && alca.focus) alca.focus({ preventScroll: true });
        aplicar(percentualDoEvento(evento));
      }

      function mover(evento) {
        if (!arrastando) return;
        // Impede a página de rolar junto no celular
        if (evento.cancelable) evento.preventDefault();
        aplicar(percentualDoEvento(evento));
      }

      function encerrar() {
        if (!arrastando) return;
        arrastando = false;
        comparador.classList.remove("is-arrastando");
      }

      /* Mouse */
      comparador.addEventListener("mousedown", iniciarArraste);
      window.addEventListener("mousemove", mover);
      window.addEventListener("mouseup", encerrar);

      /* Toque / caneta — pointer events cobrem celular e tablet */
      comparador.addEventListener("touchstart", function (evento) {
        iniciarArraste(evento.touches[0]);
      }, { passive: true });

      comparador.addEventListener("touchmove", function (evento) {
        if (!arrastando) return;
        evento.preventDefault();
        aplicar(percentualDoEvento(evento.touches[0]));
      }, { passive: false });

      comparador.addEventListener("touchend", encerrar);
      comparador.addEventListener("touchcancel", encerrar);

      /* Teclado: setas e Home/End */
      comparador.addEventListener("keydown", function (evento) {
        var passos = {
          ArrowLeft: -4,
          ArrowDown: -4,
          ArrowRight: 4,
          ArrowUp: 4
        };

        if (evento.key in passos) {
          evento.preventDefault();
          aplicar(posicao + passos[evento.key]);
          return;
        }

        if (evento.key === "Home") {
          evento.preventDefault();
          aplicar(0);
          return;
        }

        if (evento.key === "End") {
          evento.preventDefault();
          aplicar(100);
        }
      });

      aplicar(50);
    });
  }

  /* ==================================================================
     7. LIGHTBOX
     ================================================================== */

  function iniciarLightbox() {
    var lightbox = U.$("#lightbox");
    if (!lightbox) return;

    var imagem = U.$("#lightboxImagem");
    var titulo = U.$("#lightboxTitulo");
    var categoria = U.$("#lightboxCategoria");
    var texto = U.$("#lightboxTexto");
    var tags = U.$("#lightboxTags");
    var link = U.$("#lightboxLink");
    var contador = U.$("#lightboxContador");
    var btnAnterior = U.$("#lightboxAnterior");
    var btnProximo = U.$("#lightboxProximo");

    var itens = [];
    var indice = 0;
    var focoAnterior = null;

    function visiveis() {
      return itens.filter(function (item) {
        return !item.elemento || !item.elemento.classList.contains("is-oculto");
      });
    }

    function mostrar() {
      var lista = visiveis();
      if (!lista.length) return;

      indice = ((indice % lista.length) + lista.length) % lista.length;
      var item = lista[indice];

      imagem.src = item.imagem;
      imagem.alt = item.titulo || "Peça de design";
      titulo.textContent = item.titulo || "";
      categoria.textContent = item.categoria || "";
      texto.textContent = item.descricao || "";
      contador.textContent = indice + 1 + " / " + lista.length;

      if (link) {
        link.href = item.url || "#";
        link.setAttribute("aria-label",
          item.url && item.url !== "#"
            ? "Ver projeto " + (item.titulo || "")
            : "Ver projeto " + (item.titulo || "") + " (link ainda não configurado)");
      }

      tags.innerHTML = "";
      (item.tags || []).forEach(function (tag) {
        tags.appendChild(U.criarEl("span", { text: tag }));
      });

      // Só mostra navegação quando há mais de um item
      if (btnAnterior) btnAnterior.hidden = lista.length < 2;
      if (btnProximo) btnProximo.hidden = lista.length < 2;
    }

    function abrir(item, indiceInicial) {
      itens = item;
      focoAnterior = document.activeElement;

      /*
       * Importante: o índice vem da lista completa, mas a navegação
       * acontece sobre a lista de itens VISÍVEIS (um filtro pode estar
       * ativo). Por isso o índice é recalculado aqui — sem isso, abrir
       * a 3ª peça mostraria outra quando há filtro aplicado.
       */
      var listaVisivel = visiveis();
      var alvo = item[indiceInicial];
      indice = listaVisivel.indexOf(alvo);
      if (indice < 0) indice = 0;

      lightbox.hidden = false;
      void lightbox.offsetWidth;
      lightbox.classList.add("is-aberto");
      document.body.classList.add("sem-scroll");

      mostrar();

      var fechar = U.$("[data-fechar-lightbox]", lightbox) || U.$(".lightbox__fechar", lightbox);
      if (fechar) fechar.focus();
    }

    function fechar() {
      lightbox.classList.remove("is-aberto");
      document.body.classList.remove("sem-scroll");

      window.setTimeout(function () {
        lightbox.hidden = true;
        imagem.src = "";
      }, 340);

      if (focoAnterior && focoAnterior.focus) focoAnterior.focus();
    }

    function navegar(passo) {
      var lista = visiveis();
      if (lista.length < 2) return;

      indice = ((indice + passo) % lista.length + lista.length) % lista.length;
      mostrar();
    }

    /* Abre a partir de qualquer elemento com data-lightbox */
    document.addEventListener("click", function (evento) {
      var gatilho = evento.target.closest("[data-lightbox]");
      if (!gatilho) return;

      evento.preventDefault();

      var chave = gatilho.dataset.lightbox;
      var lista = [];

      U.$$('[data-lightbox="' + chave + '"]').forEach(function (elemento) {
        lista.push({
          elemento: elemento,
          imagem: elemento.dataset.imagem,
          titulo: elemento.dataset.titulo,
          categoria: elemento.dataset.categoria,
          descricao: elemento.dataset.descricao,
          url: elemento.dataset.url,
          tags: (elemento.dataset.tags || "").split("|").filter(Boolean)
        });
      });

      if (lista.length) abrir(lista, lista.indexOf(gatilho));
    });

    U.$$("[data-fechar-lightbox]", lightbox).forEach(function (elemento) {
      elemento.addEventListener("click", fechar);
    });

    if (btnAnterior) btnAnterior.addEventListener("click", function () { navegar(-1); });
    if (btnProximo) btnProximo.addEventListener("click", function () { navegar(1); });

    document.addEventListener("keydown", function (evento) {
      if (lightbox.hidden) return;

      if (evento.key === "Escape") fechar();
      if (evento.key === "ArrowLeft") navegar(-1);
      if (evento.key === "ArrowRight") navegar(1);
    });

    // Bloqueia a rolagem do fundo com a roda do mouse sobre o lightbox
    lightbox.addEventListener("wheel", function (evento) {
      if (evento.target.closest(".lightbox__legenda")) return;
      evento.preventDefault();
    }, { passive: false });

    lightbox.abrir = abrir;
    lightbox.fechar = fechar;
  }

  /* ==================================================================
     8. TOASTS
     ================================================================== */

  var ICONES_TOAST = {
    sucesso: "check",
    erro: "fechar",
    info: "brilho"
  };

  function toast(mensagem, tipo) {
    var container = U.$("#toasts");
    if (!container || !mensagem) return;

    var estilo = tipo || "info";
    var elemento = U.criarEl("div", {
      class: "toast toast--" + estilo,
      role: "status"
    });

    elemento.appendChild(U.criarEl("span", {
      class: "toast__icone",
      "aria-hidden": "true"
    }, U.criarIcone(ICONES_TOAST[estilo] || "info")));

    elemento.appendChild(U.criarEl("span", { text: mensagem }));
    container.appendChild(elemento);

    window.setTimeout(function () {
      elemento.classList.add("is-saindo");
      window.setTimeout(function () {
        if (elemento.parentNode) elemento.parentNode.removeChild(elemento);
      }, 320);
    }, 4200);
  }

  /* ==================================================================
     9. BRILHO QUE SEGUE O CURSOR NOS CARDS
     ================================================================== */

  function iniciarBrilhoCursor() {
    if (U.ehTelaPequena() || U.movimentoReduzido()) return;

    document.addEventListener("pointermove", U.throttle(function (evento) {
      var card = evento.target.closest(".servico, .bento__item, .peca");
      if (!card) return;

      var caixa = card.getBoundingClientRect();
      card.style.setProperty("--mx", (evento.clientX - caixa.left) + "px");
      card.style.setProperty("--my", (evento.clientY - caixa.top) + "px");
    }, 40), { passive: true });
  }

  /* ==================================================================
     10. PARALLAX SUAVE DA CENA DO HERO
     ================================================================== */

  function iniciarParallax() {
    var cena = U.$("#heroCena");
    var hero = U.$(".hero");
    if (!cena || !hero) return;

    if (U.movimentoReduzido() || U.ehTelaPequena()) return;

    var elementos = U.$$("[data-flutua]", cena);

    window.addEventListener("scroll", U.throttle(function () {
      var alturaHero = hero.offsetHeight;
      if (alturaHero <= 0) return;

      // 0 no topo do Hero, 1 quando ele sai da tela
      var progresso = Math.max(0, Math.min(1, window.pageYOffset / alturaHero));

      cena.style.transform = "translateY(" + (progresso * 34).toFixed(2) + "px)";
      cena.style.opacity = String(Math.max(0, 1 - progresso * 1.15));

      // Cada elemento flutua com uma velocidade um pouco diferente
      elementos.forEach(function (elemento, indice) {
        var peso = (indice + 1) * 7;
        elemento.style.setProperty("--parallax", (progresso * peso).toFixed(2) + "px");
      });
    }, 60), { passive: true });
  }

  /* ==================================================================
     11. LINKS DE WHATSAPP
     ================================================================== */

  function iniciarLinksWhatsapp() {
    document.addEventListener("click", function (evento) {
      var link = evento.target.closest("[data-whatsapp]");
      if (!link) return;

      var url = U.urlWhatsappPadrao(link.dataset.whatsapp);

      // Número ainda não configurado: não navega para lugar nenhum
      if (url === "#") {
        evento.preventDefault();
        toast("Configure o número de WhatsApp em js/config.js para ativar este botão.", "info");
        anunciar("O botão de WhatsApp ainda não está configurado.");
        return;
      }

      link.setAttribute("href", url);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });

    // Já aplica os links corretos ao carregar
    U.$$("[data-whatsapp]").forEach(function (link) {
      var url = U.urlWhatsappPadrao(link.dataset.whatsapp);
      if (url !== "#") {
        link.setAttribute("href", url);
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    });
  }

  /* ==================================================================
     INICIALIZAÇÃO
     ================================================================== */

  function iniciarTudo() {
    iniciarLoader();
    iniciarCabecalho();
    iniciarMenu();
    iniciarFaixaServicos();
    iniciarReveal();
    iniciarCtaFlutuante();
    iniciarComparadores();
    iniciarLightbox();
    iniciarBrilhoCursor();
    iniciarParallax();
    iniciarLinksWhatsapp();
  }

  return {
    iniciarTudo: iniciarTudo,
    toast: toast,
    anunciar: anunciar
  };
})();
