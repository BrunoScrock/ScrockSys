/* ==========================================================================
   SCROCKSYS — utils.js
   --------------------------------------------------------------------------
   Funções auxiliares usadas pelo restante do site.

   Todas as funções são expostas em window.Utils para que os outros
   arquivos (storage, classifier, api, search, ui, app) possam usá-las.
   Nenhuma delas depende de biblioteca externa.
   ========================================================================== */

window.Utils = (function () {
  "use strict";

  /* ------------------------------------------------------------------
     SELEÇÃO DE ELEMENTOS
     ------------------------------------------------------------------ */

  function $(seletor, contexto) {
    return (contexto || document).querySelector(seletor);
  }

  function $$(seletor, contexto) {
    return Array.prototype.slice.call((contexto || document).querySelectorAll(seletor));
  }

  /* ------------------------------------------------------------------
     CRIAÇÃO DE ELEMENTOS
     ------------------------------------------------------------------ */

  /**
   * Anexa filhos a um elemento. Strings viram nós de texto,
   * elementos são adicionados direto, null/undefined são ignorados.
   */
  function adicionarFilhos(pai, filhos) {
    (Array.isArray(filhos) ? filhos : [filhos]).forEach(function (filho) {
      if (filho === null || filho === undefined || filho === false) return;
      pai.appendChild(typeof filho === "string" ? document.createTextNode(filho) : filho);
    });
  }

  /**
   * Cria um elemento com atributos, classes e filhos.
   * Se algum valor for null/undefined, o atributo simply não é criado.
   *
   * @param {string} tag
   * @param {Object} atributos  { class, id, href, src, alt, ... }
   * @param {Array|string} filhos
   */
  function criarEl(tag, atributos, filhos) {
    var el = document.createElement(tag);

    if (atributos) {
      Object.keys(atributos).forEach(function (chave) {
        var valor = atributos[chave];

        if (valor === null || valor === undefined || valor === false) return;

        if (chave === "class") {
          el.className = valor;
        } else if (chave === "text") {
          el.textContent = valor;
        } else if (chave === "html") {
          el.innerHTML = valor;
        } else if (chave === "dataset") {
          Object.keys(valor).forEach(function (d) {
            if (valor[d] !== null && valor[d] !== undefined) {
              el.dataset[d] = valor[d];
            }
          });
        } else if (chave.indexOf("on") === 0 && typeof valor === "function") {
          el.addEventListener(chave.slice(2).toLowerCase(), valor);
        } else if (valor === true) {
          el.setAttribute(chave, "");
        } else {
          el.setAttribute(chave, valor);
        }
      });
    }

    if (filhos !== null && filhos !== undefined) {
      adicionarFilhos(el, filhos);
    }

    return el;
  }

  /**
   * Cria um <svg><use> apontando para um símbolo do sprite do index.html.
   *
   * @param {string} nome  Ex.: "whatsapp", "monitor", "check"
   * @param {string} classe
   */
  function criarIcone(nome, classe) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", classe || "icone");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#i-" + nome);
    svg.appendChild(use);

    return svg;
  }

  /* ------------------------------------------------------------------
     TEXTO
     ------------------------------------------------------------------ */

  /**
   * Remove acentos e deixa em minúsculas — usado para busca e filtros.
   * Ex.: "Sites Institucionais" -> "sites institucionais"
   */
  function normalizar(texto) {
    if (!texto) return "";
    return String(texto)
      .normalize("NFD")
      .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
      .toLowerCase()
      .trim();
  }

  /**
   * Escapa caracteres-HTML antes de inserir texto vindo do config.js.
   * Protege contra quebra de layout caso o texto tenha < ou &.
   */
  function escaparHtml(texto) {
    if (!texto) return "";
    return String(texto)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /** Texto já vem pronto no config.js — devolve sempre string. */
  function texto(valor) {
    return valor === null || valor === undefined ? "" : String(valor);
  }

  /**
   * Verifica se um valor do config.js ainda é placeholder "[INSERIR ...]".
   * Quando true, o site oculta o bloco em vez de exibir dado inventado.
   */
  function ehPlaceholder(valor) {
    if (valor === null || valor === undefined) return true;
    return /^\s*\[INSERIR/i.test(String(valor));
  }

  /** Verdadeiro somente quando existe texto real para exibir. */
  function configurado(valor) {
    return !ehPlaceholder(valor) && String(valor).trim().length > 0;
  }

  /** Remove acentos de uma chave e devolve em minúsculas com hífen. */
  function chave(texto) {
    return normalizar(texto).replace(/\s+/g, "-");
  }

  /** "lancamentos" -> "Lançamentos" (para ids de serviço no WhatsApp) */
  function camelCase(texto) {
    return String(texto || "")
      .split(/[\s-]+/)
      .filter(Boolean)
      .map(function (parte, indice) {
        return indice === 0
          ? parte.charAt(0).toLowerCase() + parte.slice(1)
          : parte.charAt(0).toUpperCase() + parte.slice(1);
      })
      .join("");
  }

  /* ------------------------------------------------------------------
     WHATSAPP
     ------------------------------------------------------------------ */

  /**
   * Monta o link do WhatsApp já com a mensagem pronta.
   * Ex.: https://wa.me/5541999999999?text=Ola
   */
  function urlWhatsapp(mensagem) {
    var numero = "";

    if (typeof CONFIG !== "undefined" && CONFIG.whatsapp) {
      numero = String(CONFIG.whatsapp).replace(/\D/g, "");
    }

    // Sem número configurado: devolve "#" para o site não abrir link quebrado.
    if (!numero || numero.length < 10) return "#";

    var base = "https://wa.me/" + numero;

    return mensagem ? base + "?text=" + encodeURIComponent(mensagem) : base;
  }

  /**
   * Link do WhatsApp com a mensagem do serviço informado.
   *
   * A chave da mensagem no config.js é "mensagem" + o id do serviço
   * com a primeira letra maiúscula:
   *   "sites"       -> CONFIG.mensagemSites
   *   "landing"     -> CONFIG.mensagemLanding
   *   "manutencao"  -> CONFIG.mensagemManutencao
   *   "padrao"      -> CONFIG.mensagemPadrao
   *
   * @param {string} chaveMensagem  id do serviço (ex.: "sites")
   */
  function urlWhatsappPadrao(chaveMensagem) {
    var mensagem = "";

    if (typeof CONFIG !== "undefined") {
      var id = String(chaveMensagem || "padrao").trim();
      var nome = "mensagem" + id.charAt(0).toUpperCase() + id.slice(1);

      mensagem = CONFIG[nome] || CONFIG.mensagemPadrao || "";
    }

    return urlWhatsapp(mensagem);
  }

  /**
   * Substitui {campo} na mensagem do config.js pelos dados do formulário.
   * O bloco {mensagem} só entra se o visitante tiver escrito algo.
   */
  function aplicarMensagem(modelo, dados) {
    return String(modelo || "").replace(/\{(\w+)\}/g, function (_, campo) {
      var valor = dados[campo];
      return valor ? String(valor).trim() : "";
    }).replace(/\s{2,}/g, " ").trim();
  }

  /* ------------------------------------------------------------------
     TELEFONE
     ------------------------------------------------------------------ */

  /**
   * Máscara progressiva do telefone brasileiro.
   *
   * Aceita o número com ou sem o código do país:
   *   "41999999999"     -> (41) 99999-9999   (11 dígitos, celular)
   *   "5541999999999"   -> (41) 99999-9999   (13 dígitos, com o 55)
   *   "4133333333"      -> (41) 3333-3333    (10 dígitos, fixo)
   */
  function formatarTelefone(valor) {
    var d = String(valor || "").replace(/\D/g, "").slice(0, 13);

    if (!d.length) return "";

    // Tira o código do país (55) quando ele vier no começo
    // e ainda sobre espaço para o número nacional.
    var nacional = (d.length > 11 && d.slice(0, 2) === "55") ? d.slice(2) : d;

    if (nacional.length <= 2) return "(" + nacional;

    var ddd = nacional.slice(0, 2);
    var resto = nacional.slice(2);

    if (!resto.length) return "(" + ddd + ") ";
    if (resto.length <= 4) return "(" + ddd + ") " + resto;
    if (resto.length <= 8) return "(" + ddd + ") " + resto.slice(0, 4) + "-" + resto.slice(4);
    return "(" + ddd + ") " + resto.slice(0, 5) + "-" + resto.slice(5, 10);
  }

  /**
   * Telefone válido = 10 dígitos (fixo) ou 11 dígitos (celular),
   * com ou sem o código do país na frente.
   */
  function telefoneValido(valor) {
    var d = String(valor || "").replace(/\D/g, "");
    var nacional = (d.length > 11 && d.slice(0, 2) === "55") ? d.slice(2) : d;

    return nacional.length === 10 || nacional.length === 11;
  }

  /* ------------------------------------------------------------------
     FUNÇÕES DE APOIO
     ------------------------------------------------------------------ */

  /** Adia a execução da função até o usuário parar de digitar/rolar. */
  function debounce(fn, espera) {
    var timer;
    return function () {
      var contexto = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(contexto, args);
      }, espera || 150);
    };
  }

  /**
   * Limita a frequência de execução, mas SEM perder a última chamada.
   *
   * Por que não pode ser o throttle comum (que simplesmente "pula" os
   * eventos dentro do intervalo): em efeitos ligados à rolagem, o evento
   * descartado é justamente o que traz a posição final. O Hero voltava
   * do scroll com opacidade 0,87 em vez de 1 e nunca era corrigido,
   * porque o evento que traria o valor certo tinha sido ignorado.
   *
   * Aqui a última chamada fica sempre agendada e é executada no
   * próximo quadro, garantindo que o estado final seja aplicado.
   */
  function throttle(fn, intervalo) {
    var intervaloMs = intervalo || 100;
    var ultimo = 0;
    var agendado = false;
    var contexto = null;
    var args = null;

    return function () {
      var agora = Date.now();
      contexto = this;
      args = arguments;

      if (agora - ultimo >= intervaloMs) {
        // Cabe na janela: executa agora e cancela qualquer agendamento
        if (agendado && typeof cancelAnimationFrame === "function") {
          cancelAnimationFrame(agendado);
        }
        agendado = false;
        ultimo = agora;
        fn.apply(contexto, args);
        return;
      }

      // Ainda dentro da janela: guarda para executar logo em seguida
      if (agendado) return;

      agendado = typeof requestAnimationFrame === "function"
        ? requestAnimationFrame(function () {
            agendado = false;
            ultimo = Date.now();
            fn.apply(contexto, args);
          })
        : setTimeout(function () {
            agendado = false;
            ultimo = Date.now();
            fn.apply(contexto, args);
          }, intervaloMs - (agora - ultimo));
    };
  }

  /** Adiciona ou remove uma classe de forma simples. */
  function alternarClasse(el, classe, ativar) {
    if (!el) return;
    if (ativar === undefined) el.classList.toggle(classe);
    else el.classList.toggle(classe, !!ativar);
  }

  /** Verdadeiro quando o usuário pediu menos movimento no sistema. */
  function movimentoReduzido() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /** Verdadeiro em celular/tablet (usado para reduzir o canvas do Hero). */
  function ehTelaPequena() {
    return window.matchMedia("(max-width: 767px)").matches;
  }

  /** Dispositivo com pouca potência — recebe versão simplificada das animações. */
  function ehDispositivoLeve() {
    var memoria = navigator.deviceMemory || navigator.deviceMemory === 0 ? navigator.deviceMemory : 8;
    var nucleos = navigator.hardwareConcurrency || 4;
    var economiza = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return economiza || memoria <= 2 || nucleos <= 2;
  }

  /**
   * Rola suavemente até uma seção, compensando o cabeçalho fixo.
   * @param {string} alvo  seletor CSS ou "#id"
   */
  function rolarSuave(alvo, extra) {
    var el = typeof alvo === "string" ? $(alvo) : alvo;
    if (!el) return;

    var cabecalho = $("#cabecalho");
    var altura = (cabecalho ? cabecalho.offsetHeight : 74) + (extra || 12);
    var topo = el.getBoundingClientRect().top + window.pageYOffset - altura;

    window.scrollTo({
      top: Math.max(topo, 0),
      behavior: movimentoReduzido() ? "auto" : "smooth"
    });
  }

  /** Número formatado com ponto de milhar: 1280 -> "1.280" */
  function formatarNumero(valor) {
    var n = parseInt(String(valor).replace(/\D/g, ""), 10);
    if (isNaN(n)) return String(valor);
    return n.toLocaleString("pt-BR");
  }

  /** Copia texto para a área de transferência (com fallback). */
  function copiar(texto) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(texto);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = texto;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch (erro) {
        reject(erro);
      }
      document.body.removeChild(area);
    });
  }

  return {
    $: $,
    $$: $$,
    criarEl: criarEl,
    criarIcone: criarIcone,
    normalizar: normalizar,
    escaparHtml: escaparHtml,
    texto: texto,
    ehPlaceholder: ehPlaceholder,
    configurado: configurado,
    chave: chave,
    camelCase: camelCase,
    urlWhatsapp: urlWhatsapp,
    urlWhatsappPadrao: urlWhatsappPadrao,
    aplicarMensagem: aplicarMensagem,
    formatarTelefone: formatarTelefone,
    telefoneValido: telefoneValido,
    debounce: debounce,
    throttle: throttle,
    alternarClasse: alternarClasse,
    movimentoReduzido: movimentoReduzido,
    ehTelaPequena: ehTelaPequena,
    ehDispositivoLeve: ehDispositivoLeve,
    rolarSuave: rolarSuave,
    formatarNumero: formatarNumero,
    copiar: copiar
  };
})();
