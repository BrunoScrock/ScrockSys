/* ==========================================================================
   SCROCKSYS — search.js
   --------------------------------------------------------------------------
   Busca e filtros do portfólio.

   O QUE JÁ FUNCIONA
   - filtro por categoria (Todos, Institucional, Comércio, ...)
   - filtro por classe (SITE, SISTEMA, DESIGN, LANDING_PAGE...)
   - busca por texto (título, categoria, descrição e tags)

   COMO USAR
     Search.criar({
       itens: Api.todosOsProjetos(),
       filtros: CONFIG.portfolio.filtrosSites,
       chave: "sites"              // remember no localStorage
     });

     Search.filtrar(container, "Institucional");
     Search.buscar(container, "piso");
   ========================================================================== */

window.Search = (function () {
  "use strict";

  var U = window.Utils;
  var St = window.Storage;

  /* Estado de cada instância de busca */
  var instancias = {};

  /* ------------------------------------------------------------------
     NORMALIZAÇÃO
     ------------------------------------------------------------------ */

  function chaveNormalizada(valor) {
    return U.normalizar(valor);
  }

  /* ------------------------------------------------------------------
     FILTRAGEM
     ------------------------------------------------------------------ */

  /**
   * Decide se um projeto passa pelo filtro.
   *
   * @param {Object} projeto    projeto preparado pelo Classifier
   * @param {string} categoria  categoria ativa ("Todos" libera tudo)
   * @param {string} classe     classe ativa ("" ou "TODOS" libera tudo)
   */
  function corresponde(projeto, categoria, classe) {
    if (!projeto) return false;

    var alvo = chaveNormalizada(categoria || "Todos");
    var querTodos = alvo === "" || alvo === "todos";

    if (!querTodos && chaveNormalizada(projeto.categoria) !== alvo) {
      return false;
    }

    if (classe && classe !== "TODOS" && projeto.classe !== classe) {
      return false;
    }

    return true;
  }

  /**
   * Aplica os filtros a uma lista e devolve a nova lista.
   * Não altera o array original.
   */
  function aplicarFiltro(lista, categoria, classe) {
    return (lista || []).filter(function (projeto) {
      return corresponde(projeto, categoria, classe);
    });
  }

  /**
   * Aplica a busca por texto. Cada palavra digitada precisa
   * aparecer em algum campo do projeto.
   */
  function aplicarBusca(lista, termo) {
    var palavras = chaveNormalizada(termo).split(/\s+/).filter(Boolean);

    if (!palavras.length) return (lista || []).slice();

    return (lista || []).filter(function (projeto) {
      var texto = projeto.busca || chaveNormalizada([
        projeto.titulo,
        projeto.categoria,
        projeto.descricao,
        (projeto.tags || []).join(" ")
      ].join(" "));

      return palavras.every(function (palavra) {
        return texto.indexOf(palavra) >= 0;
      });
    });
  }

  /* ------------------------------------------------------------------
     INSTÂNCIA DE BUSCA
     ------------------------------------------------------------------ */

  /**
   * Cria (ou recria) uma instância de busca para uma seção.
   *
   * @param {Object} opcoes
   *   itens:   Array de projetos já preparados
   *   filtros: Array com as categorias permitidas
   *   chave:   identificador único ("sites", "design", ...)
   *   classe:  classe fixa da seção (ex.: "SISTEMA")
   */
  function criar(opcoes) {
    var nome = opcoes.chave || "padrao";

    instancias[nome] = {
      itens: opcoes.itens || [],
      filtros: opcoes.filtros || [],
      classe: opcoes.classe || "",
      categoria: "Todos"
    };

    return instancias[nome];
  }

  function obter(chave) {
    return instancias[chave || "padrao"] || null;
  }

  /** Resultado atual da instância (aplica categoria + classe). */
  function resultado(chave) {
    var instancia = obter(chave);
    if (!instancia) return [];

    return aplicarFiltro(instancia.itens, instancia.categoria, instancia.classe);
  }

  /* ------------------------------------------------------------------
     APLICAÇÃO NO DOM
     ------------------------------------------------------------------ */

  /**
   * Mostra/esconde os cards de um container conforme o filtro.
   * Cada card precisa ter data-categoria e (opcionalmente) data-classe.
   *
   * @returns {number} quantidade de cards visíveis
   */
  function aplicarNoDom(container, categoria, classe) {
    if (!container) return 0;

    var cards = U.$$("[data-categoria]", container);
    var visiveis = 0;

    cards.forEach(function (card) {
      var mostrar = corresponde({
        categoria: card.dataset.categoria,
        classe: card.dataset.classe
      }, categoria, classe);

      card.classList.toggle("is-oculto", !mostrar);
      if (mostrar) visiveis++;
    });

    return visiveis;
  }

  /**
   * Define a categoria ativa de uma instância, aplica no DOM,
   * mostra o aviso de "nenhum resultado" e lembra a preferência.
   */
  function selecionarCategoria(chave, categoria, opcoes) {
    var instancia = obter(chave);
    if (!instancia) return 0;

    var alvo = categoria || "Todos";
    instancia.categoria = alvo;

    var container = opcoes && opcoes.container;
    var aviso = opcoes && opcoes.aviso;
    var filtrosContainer = opcoes && opcoes.filtrosContainer;

    // 1. Destaca o botão do filtro ativo
    if (filtrosContainer) {
      U.$$(".filtro", filtrosContainer).forEach(function (botao) {
        botao.classList.toggle("is-ativo", botao.dataset.filtro === alvo);
        botao.setAttribute("aria-pressed", botao.dataset.filtro === alvo ? "true" : "false");
      });
    }

    // 2. Aplica no DOM
    var visiveis = container
      ? aplicarNoDom(container, alvo, instancia.classe)
      : resultado(chave).length;

    // 3. Mostra ou esconde o aviso de lista vazia
    if (aviso) aviso.hidden = visiveis > 0;

    // 4. Lembra a escolha (não dado sensível, só preferência de filtro)
    St.salvarFiltro(chave, alvo);

    return visiveis;
  }

  /**
   * Busca por texto aplicando o resultado no DOM.
   * Cada card precisa ter data-busca com o texto já normalizado.
   */
  function buscarNoDom(container, termo) {
    if (!container) return 0;

    var palavras = U.normalizar(termo).split(/\s+/).filter(Boolean);
    var cards = U.$$("[data-busca]", container);
    var visiveis = 0;

    cards.forEach(function (card) {
      var texto = card.dataset.busca || "";
      var mostrar = !palavras.length || palavras.every(function (p) {
        return texto.indexOf(p) >= 0;
      });

      card.classList.toggle("is-oculto", !mostrar);
      if (mostrar) visiveis++;
    });

    return visiveis;
  }

  /* ------------------------------------------------------------------
     FILTROS (HTML)
     ------------------------------------------------------------------ */

  /**
   * Cria os botões de filtro dentro de um container e já registra
   * o clique de cada um.
   *
   * @param {HTMLElement} container
   * @param {Array} categorias
   * @param {string} chave        instância de busca
   * @param {Object} opcoes       { containerCards, aviso }
   */
  function montarFiltros(container, categorias, chave, opcoes) {
    if (!container) return;

    container.innerHTML = "";

    var lista = Array.isArray(categorias) && categorias.length
      ? categorias
      : ["Todos"];

    // Garante que "Todos" exista e vem primeiro
    if (lista[0] !== "Todos") lista.unshift("Todos");

    lista.forEach(function (categoria) {
      var botao = U.criarEl("button", {
        class: "filtro",
        type: "button",
        text: categoria,
        dataset: { filtro: categoria },
        "aria-pressed": "false"
      });

      botao.addEventListener("click", function () {
        selecionarCategoria(chave, categoria, {
          container: opcoes && opcoes.containerCards,
          aviso: opcoes && opcoes.aviso,
          filtrosContainer: container
        });

        if (typeof window.UI !== "undefined" && window.UI.anunciar) {
          window.UI.anunciar(
            categoria === "Todos"
              ? "Mostrando todos os projetos."
              : "Mostrando projetos de " + categoria + "."
          );
        }
      });

      container.appendChild(botao);
    });

    // Aplica o último filtro usado (ou "Todos" na primeira visita)
    var preferencia = St.lerFiltro(chave, "Todos");
    var categoriaInicial = lista.indexOf(preferencia) >= 0 ? preferencia : "Todos";

    selecionarCategoria(chave, categoriaInicial, {
      container: opcoes && opcoes.containerCards,
      aviso: opcoes && opcoes.aviso,
      filtrosContainer: container
    });
  }

  /* ------------------------------------------------------------------
     FILTROS POR CLASSE (SITES / SISTEMAS / DESIGN)
     ------------------------------------------------------------------ */

  /**
   * Devolve a lista de filtros de uma seção usando as categorias
   * realmente presentes nos projetos — evita botões vazios.
   */
  function filtrosDaSecao(chave, listaFiltrosConfig) {
    var instancia = obter(chave);
    if (!instancia) return listaFiltrosConfig || ["Todos"];

    var doConfig = listaFiltrosConfig && listaFiltrosConfig.length;
    var categorias = window.Classifier.extrairCategorias(instancia.itens);

    // Usa o config como base (para respeitar a ordem escolhida)
    // e acrescenta qualquer categoria que tenha ficado de fora.
    var resultado = doConfig ? listaFiltrosConfig.slice() : ["Todos"];

    categorias.forEach(function (categoria) {
      if (resultado.indexOf(categoria) < 0) resultado.push(categoria);
    });

    return resultado;
  }

  return {
    criar: criar,
    obter: obter,
    resultado: resultado,
    corresponde: corresponde,
    aplicarFiltro: aplicarFiltro,
    aplicarBusca: aplicarBusca,
    aplicarNoDom: aplicarNoDom,
    aplicarNoDomTexto: aplicarNoDom,
    buscarNoDom: buscarNoDom,
    selecionarCategoria: selecionarCategoria,
    montarFiltros: montarFiltros,
    filtrosDaSecao: filtrosDaSecao
  };
})();
