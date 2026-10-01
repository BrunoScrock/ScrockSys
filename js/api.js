/* ==========================================================================
   SCROCKSYS — api.js
   --------------------------------------------------------------------------
   Camada de dados do site. É o único lugar que "fala" com a fonte
   de informações — hoje, o próprio js/config.js.

   POR QUE EXISTE ESTE ARQUIVO
   Se um dia você quiser buscar projetos de um arquivo JSON, de uma
   planilha no Google Sheets ou de qualquer API, muda só este arquivo.
   Nenhum outro precisa saber de onde os dados vieram.

   IMPORTANTE
   O site funciona 100% sem backend. Nada aqui é obrigatório para o
   site funcionar, e nenhuma requisição é feita na versão atual.

   EXEMPLO DE USO FUTURO
     Api.definirFonte("https://meusite.com/projetos.json")
     Api.carregarProjetos().then(lista => ...)
   ========================================================================== */

window.Api = (function () {
  "use strict";

  var U = window.Utils;

  /* ------------------------------------------------------------------
     CONFIGURAÇÃO DA FONTE DE DADOS
     ------------------------------------------------------------------ */

  var fonte = {
    // Quando null, os dados vêm do CONFIG (comportamento padrão).
    url: null,
    timeout: 6000,
    tentativas: 2
  };

  var cache = {};

  /* ------------------------------------------------------------------
     LEITURA DO CONFIG (fonte padrão)
     ------------------------------------------------------------------ */

  /** Todos os sites declarados no config.js. */
  function sites() {
    return CONFIG.portfolio && Array.isArray(CONFIG.portfolio.sites)
      ? CONFIG.portfolio.sites
      : [];
  }

  /** Todos os sistemas declarados no config.js. */
  function sistemas() {
    return CONFIG.portfolio && Array.isArray(CONFIG.portfolio.sistemas)
      ? CONFIG.portfolio.sistemas
      : [];
  }

  /** Todas as peças de design declaradas no config.js. */
  function design() {
    return CONFIG.portfolio && Array.isArray(CONFIG.portfolio.design)
      ? CONFIG.portfolio.design
      : [];
  }

  /** Todos os projetos de antes e depois. */
  function antesDepois() {
    return Array.isArray(CONFIG.antesDepois) ? CONFIG.antesDepois : [];
  }

  /** Todos os projetos, de todas as categorias, já classificados. */
  function todosOsProjetos() {
    return window.Classifier.prepararLista(sites().concat(sistemas(), design()));
  }

  /* ------------------------------------------------------------------
     CONFIGURAÇÃO
     ------------------------------------------------------------------ */

  /**
   * Define uma fonte externa de dados (opcional).
   * Enquanto não for chamada, o site usa somente o config.js.
   */
  function definirFonte(url, opcoes) {
    fonte.url = url || null;
    fonte.timeout = (opcoes && opcoes.timeout) || fonte.timeout;
    fonte.tentativas = (opcoes && opcoes.tentativas) || fonte.tentativas;
    limparCache();
  }

  function limparCache() {
    cache = {};
  }

  /* ------------------------------------------------------------------
     REQUISIÇÃO (usada apenas se uma fonte externa for configurada)
     ------------------------------------------------------------------ */

  /**
   * Busca dados de uma URL com timeout e novas tentativas.
   * Devolve uma Promise. Nunca lança erro para fora: em caso de
   * falha, resolve com null para que o site siga funcionando.
   */
  function requisitar(caminho) {
    if (!fonte.url) return Promise.resolve(null);

    var url = fonte.url.replace(/\/$/, "") + "/" + String(caminho).replace(/^\//, "");
    var tentativa = 0;

    function tentar() {
      tentativa++;

      return new Promise(function (resolve) {
        var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
        var timer = setTimeout(function () {
          if (controller) controller.abort();
        }, fonte.timeout);

        fetch(url, controller ? { signal: controller.signal } : undefined)
          .then(function (resposta) {
            clearTimeout(timer);
            if (!resposta.ok) throw new Error("HTTP " + resposta.status);
            return resposta.json();
          })
          .then(resolve)
          .catch(function () {
            clearTimeout(timer);
            if (tentativa < fonte.tentativas) return setTimeout(function () { tentar().then(resolve); }, 400);
            resolve(null);
          });
      });
    }

    return tentar();
  }

  /**
   * Carrega a lista de projetos.
   * Tenta a fonte externa; se não houver ou falhar, usa o config.js.
   */
  function carregarProjetos(chave) {
    var nome = chave || "projetos";

    if (cache[nome]) return Promise.resolve(cache[nome]);

    if (!fonte.url) {
      cache[nome] = todosOsProjetos();
      return Promise.resolve(cache[nome]);
    }

    return requisitar(nome + ".json").then(function (dados) {
      var lista = Array.isArray(dados) ? dados : todosOsProjetos();
      cache[nome] = window.Classifier.prepararLista(lista);
      return cache[nome];
    });
  }

  /* ------------------------------------------------------------------
     RECURSOS FUTUROS
     ------------------------------------------------------------------
     Exemplos de funções que poderão existir quando o site ganhar
     backend. Hoje todas devolvem null de propósito — o site não
     depende delas para funcionar.

   Api.contatos()
       Lista de mensagens recebidas pelo formulário.

   Api.disponibilidade()
       Horários de atendimento e status "online/offline".

   Api.lead(dados)
       Envia um briefing para um CRM ou planilha.
   ------------------------------------------------------------------ */

  function contatos() {
    return requisitar("contatos.json");
  }

  function disponibilidade() {
    return requisitar("disponibilidade.json");
  }

  function lead(dados) {
    // Sem backend: apenas devolve os dados normalizados.
    // Quando existir um endpoint, troque este bloco por um POST.
    return Promise.resolve({
      enviado: false,
      motivo: "site estático — sem backend configurado",
      dados: dados
    });
  }

  return {
    definirFonte: definirFonte,
    limparCache: limparCache,
    carregarProjetos: carregarProjetos,
    sites: sites,
    sistemas: sistemas,
    design: design,
    antesDepois: antesDepois,
    todosOsProjetos: todosOsProjetos,
    contatos: contatos,
    disponibilidade: disponibilidade,
    lead: lead
  };
})();
