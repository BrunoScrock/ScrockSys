/* ==========================================================================
   SCROCKSYS — storage.js
   --------------------------------------------------------------------------
   Camada de armazenamento local (localStorage).

   O QUE É ARMAZENADO
   - filtro de categoria escolhido na última visita
   - projects marcados como favoritos (funcionalidade futura)
   - preferência de visualização

   O QUE NUNCA É ARMAZENADO
   - dados pessoais do visitante
   - nome, e-mail ou telefone enviados pelo formulário
   - qualquer informação sensível

   Se o navegador bloquear o localStorage (modo anônimo, iframe, etc.),
   tudo continua funcionando: as funções apenas não persistem nada.
   ========================================================================== */

window.Storage = (function () {
  "use strict";

  var PREFIXO = "scrocksys:";

  /* Confere se o localStorage está disponível neste navegador */
  var disponivel = (function () {
    try {
      var teste = PREFIXO + "teste";
      window.localStorage.setItem(teste, "1");
      window.localStorage.removeItem(teste);
      return true;
    } catch (erro) {
      return false;
    }
  })();

  /* Memória temporária: usada quando o localStorage não funciona */
  var memoria = {};

  function lerInterno(chave) {
    if (disponivel) {
      try {
        return window.localStorage.getItem(PREFIXO + chave);
      } catch (erro) {
        return memoria[chave] || null;
      }
    }
    return memoria[chave] || null;
  }

  function gravarInterno(chave, valor) {
    memoria[chave] = String(valor);

    if (!disponivel) return false;

    try {
      window.localStorage.setItem(PREFIXO + chave, String(valor));
      return true;
    } catch (erro) {
      return false;
    }
  }

  function removerInterno(chave) {
    delete memoria[chave];

    if (!disponivel) return false;

    try {
      window.localStorage.removeItem(PREFIXO + chave);
      return true;
    } catch (erro) {
      return false;
    }
  }

  /* ------------------------------------------------------------------
     API PÚBLICA
     ------------------------------------------------------------------ */

  /** Lê um valor salvo. Devolve null se não existir. */
  function ler(chave, padrao) {
    var valor = lerInterno(chave);
    if (valor === null || valor === undefined) {
      return padrao === undefined ? null : padrao;
    }

    // Tenta devolver o tipo original (útil para booleanos e objetos)
    try {
      return JSON.parse(valor);
    } catch (erro) {
      return valor;
    }
  }

  /** Salva um valor. Retorna true se conseguiu persistir. */
  function salvar(chave, valor) {
    try {
      return gravarInterno(chave, JSON.stringify(valor));
    } catch (erro) {
      return gravarInterno(chave, valor);
    }
  }

  /** Apaga uma chave. */
  function remover(chave) {
    return removerInterno(chave);
  }

  /* ---------------------- Filtros do portfólio ---------------------- */

  /**
   * Guarda a última categoria escolhida para lembrar
   * a preferência do visitante entre visitas.
   */
  function salvarFiltro(secao, categoria) {
    return salvar("filtro:" + secao, categoria || "Todos");
  }

  /** Recupera o último filtro usado na seção informada. */
  function lerFiltro(secao, padrao) {
    return ler("filtro:" + secao, padrao || "Todos");
  }

  /* ---------------------- Favoritos (futuro) ----------------------- */

  /** Marca um projeto como favorito. Não guarda dados do visitante. */
  function alternarFavorito(idProjeto) {
    var lista = ler("favoritos", []) || [];

    if (!Array.isArray(lista)) lista = [];

    var indice = lista.indexOf(idProjeto);

    if (indice >= 0) {
      lista.splice(indice, 1);
    } else {
      lista.push(idProjeto);
    }

    salvar("favoritos", lista);
    return indice < 0;
  }

  function ehFavorito(idProjeto) {
    var lista = ler("favoritos", []) || [];
    return Array.isArray(lista) && lista.indexOf(idProjeto) >= 0;
  }

  function listarFavoritos() {
    var lista = ler("favoritos", []) || [];
    return Array.isArray(lista) ? lista : [];
  }

  /* ---------------------- Utilidades ------------------------------- */

  /** Apaga tudo que este site salvou (usado pelo botão "limpar"). */
  function limparTudo() {
    if (!disponivel) {
      memoria = {};
      return;
    }

    try {
      var chaves = [];
      for (var indice = 0; indice < window.localStorage.length; indice++) {
        var chave = window.localStorage.key(indice);
        if (chave && chave.indexOf(PREFIXO) === 0) chaves.push(chave);
      }
      chaves.forEach(function (chave) {
        window.localStorage.removeItem(chave);
      });
    } catch (erro) {
      /* site segue funcionando sem storage */
    }
  }

  return {
    disponivel: disponivel,
    ler: ler,
    salvar: salvar,
    remover: remover,
    salvarFiltro: salvarFiltro,
    lerFiltro: lerFiltro,
    alternarFavorito: alternarFavorito,
    ehFavorito: ehFavorito,
    listarFavoritos: listarFavoritos,
    limparTudo: limparTudo
  };
})();
