/* ==========================================================================
   SCROCKSYS — classifier.js
   --------------------------------------------------------------------------
   Classifica e agrupa os projetos do portfólio.

   PARA QUE SERVE
   Quando você adiciona um projeto novo no config.js, não precisa dizer
   em qual "grupo" ele está. O classificador olha a categoria, as tags
   e o título e decide sozinho se é SITE, SISTEMA, DESIGN, LANDING_PAGE
   etc. Isso permite criar filtros automaticamente no futuro.

   CLASSES DISPONÍVEIS (definidas no config.js)
   SITE, SISTEMA, DESIGN, IDENTIDADE_VISUAL, LANDING_PAGE, OUTROS
   ========================================================================== */

window.Classifier = (function () {
  "use strict";

  var U = window.Utils;

  /* Palavras que indicam cada classe quando a categoria não é óbvia */
  var PALAVRAS_CHAVE = {
    SITE: [
      "site", "sites", "institucional", "institucional", "servicos", "comercio",
      "profissionais", "portfolio", "pagina", "homepage", "loja", "restaurante",
      "clinica", "escola", "advogado", "construtora", "imobiliaria"
    ],
    SISTEMA: [
      "sistema", "sistemas", "painel", "dashboard", "back-end", "backend",
      "banco de dados", "api", "erp", "crm", "formulario", "formularios",
      "gestao", "relatorio", "relatorios", "automacao", "integração", "integracao"
    ],
    DESIGN: [
      "design", "grafico", "grafica", "logo", "logotipo", "banner", "banners",
      "arte", "artes", "post", "social media", "instagram", "facebook",
      "material comercial", "edicao", "edicao de imagem", "identidade visual",
      "identidade", "manual de marca", "peca", "pecas", "folder", "flyer"
    ],
    LANDING_PAGE: [
      "landing", "landing page", "campanha", "promocao", "oferta", "conversao",
      "captacao", "ads", "google ads", "meta ads"
    ]
  };

  /**
   * Descobre a classe de um projeto.
   * A ordem de verificação vai do mais específico ao mais genérico,
   * para que "Landing Page" não seja classificada só como "Site".
   *
   * @param {Object} projeto  { titulo, categoria, tags, descricao }
   * @returns {string}        uma das chaves de CLASSES
   */
  function classificar(projeto) {
    if (!projeto) return CLASSES.OUTROS;

    var categoria = U.normalizar(projeto.categoria);
    var titulo = U.normalizar(projeto.titulo);
    var descricao = U.normalizar(projeto.descricao);
    var tags = (projeto.tags || []).map(U.normalizar);
    var todo = [categoria, titulo, descricao].concat(tags).join(" ");

    // 1. Mapa exato do config.js tem prioridade
    if (typeof MAPA_CLASSES === "object" && MAPA_CLASSES[categoria]) {
      return MAPA_CLASSES[categoria];
    }

    // 2. Detecção por palavras-chave, na ordem de especificidade
    var ordem = ["LANDING_PAGE", "IDENTIDADE_VISUAL", "SISTEMA", "DESIGN", "SITE"];
    for (var i = 0; i < ordem.length; i++) {
      var classe = ordem[i];
      var palavras = PALAVRAS_CHAVE[classe] || [];

      for (var j = 0; j < palavras.length; j++) {
        if (todo.indexOf(palavras[j]) >= 0) return CLASSES[classe];
      }
    }

    return CLASSES.OUTROS;
  }

  /**
   * Adiciona a classe e um id estável ao objeto de projeto.
   * Devolve um novo objeto — o original do config.js não é alterado.
   */
  function preparar(projeto, indice) {
    var itens = projeto && Array.isArray(projeto.tags) ? projeto.tags : [];

    return Object.assign({}, projeto, {
      id: U.chave(projeto && projeto.titulo) || "projeto-" + (indice + 1),
      indice: indice,
      classe: classificar(projeto),
      tags: itens,
      busca: U.normalizar([
        projeto && projeto.titulo,
        projeto && projeto.categoria,
        projeto && projeto.descricao,
        itens.join(" ")
      ].join(" "))
    });
  }

  /** Prepara uma lista inteira de projetos. */
  function prepararLista(lista) {
    return (Array.isArray(lista) ? lista : []).map(preparar);
  }

  /**
   * Gera a lista de categorias presentes em uma lista de projetos,
   * já com "Todos" na primeira posição e sem repetição.
   */
  function extrairCategorias(lista) {
    var categorias = [];
    var vistos = {};

    (Array.isArray(lista) ? lista : []).forEach(function (projeto) {
      var categoria = projeto && projeto.categoria;
      if (!categoria) return;
      if (vistos[categoria]) return;
      vistos[categoria] = true;
      categorias.push(categoria);
    });

    return categorias;
  }

  /** Agrupa projetos por classe (SITE / SISTEMA / DESIGN / ...). */
  function agruparPorClasse(lista) {
    var grupos = {};

    Object.keys(CLASSES).forEach(function (chave) {
      grupos[CLASSES[chave]] = [];
    });

    (Array.isArray(lista) ? lista : []).forEach(function (projeto) {
      var classe = projeto && projeto.classe ? projeto.classe : CLASSES.OUTROS;
      if (!grupos[classe]) grupos[classe] = [];
      grupos[classe].push(projeto);
    });

    return grupos;
  }

  /**
   * Contagem por categoria — usado para mostrar quantos projetos
   * existem em cada filtro.
   */
  function contarPorCategoria(lista) {
    var contagem = { Todos: (lista || []).length };
    (lista || []).forEach(function (projeto) {
      var categoria = projeto && projeto.categoria;
      if (!categoria) return;
      contagem[categoria] = (contagem[categoria] || 0) + 1;
    });
    return contagem;
  }

  /** Rótulo curto e legível para uma classe. */
  function rotuloClasse(classe) {
    var rotulos = {
      SITE: "Sites",
      SISTEMA: "Sistemas",
      DESIGN: "Design",
      IDENTIDADE_VISUAL: "Identidade Visual",
      LANDING_PAGE: "Landing Pages",
      OUTROS: "Outros"
    };
    return rotulos[classe] || "Outros";
  }

  return {
    classificar: classificar,
    preparar: preparar,
    prepararLista: prepararLista,
    extrairCategorias: extrairCategorias,
    agruparPorClasse: agruparPorClasse,
    contarPorCategoria: contarPorCategoria,
    rotuloClasse: rotuloClasse
  };
})();
