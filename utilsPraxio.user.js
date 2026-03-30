// ==UserScript==
// @name         Utils Portal
// @namespace
// @version      2.0.1
// @description  Utilitários para o portal do cliente Praxio
// @author       Cálvaro, Breno e Vitor
// @match        https://portaldocliente.praxio.com.br/Ticket*
// @match        https://dev.azure.com/praxio/Autumn/_sprints/taskboard/*/Autumn/*/*?workitem=*
// @match        https://dev.azure.com/praxio/Autumn/_sprints/taskboard/*/Autumn/*/*&workitem=*
// @match        https://dev.azure.com/praxio/Autumn/_sprints/taskboard/*/Autumn/*/*
// @match        https://dev.azure.com/praxio/Autumn/_boards/board/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=praxio.com.br
// @require      https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js
// @require      https://cdn.jsdelivr.net/npm/mammoth/mammoth.browser.min.js
// @require      https://github.com/alvarosoaress/praxioscript/raw/master/css.js
// @require 	   https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@v1.3/waitForKeyElements.js
// @require      https://github.com/alvarosoaress/praxioscript/raw/master/sla.user.js
// @require      https://github.com/alvarosoaress/praxioscript/raw/master/utils.user.js
// @require      https://github.com/alvarosoaress/praxioscript/raw/master/customButton.js
// @require      https://github.com/alvarosoaress/praxioscript/raw/master/customMessage.js
// @require      https://github.com/alvarosoaress/praxioscript/raw/master/history.js
// @require      https://github.com/alvarosoaress/praxioscript/raw/master/azure.js
// @require      https://github.com/alvarosoaress/praxioscript/raw/master/hyperlink.js
// @require      https://github.com/alvarosoaress/praxioscript/raw/master/customMessageText.js
// @require      https://github.com/alvarosoaress/praxioscript/raw/master/customMessageSelect.js
// -- @require      https://github.com/alvarosoaress/praxioscript/raw/master/alert.js
// @downloadURL  https://github.com/alvarosoaress/praxioscript/raw/master/utilsPraxio.user.js
// @updateURL    https://github.com/alvarosoaress/praxioscript/raw/master/utilsPraxio.user.js
// @run-at       document-idle
// @grant        GM_addStyle
// ==/UserScript==

const API_URL = localStorage.getItem("apiKey")
  ? localStorage.getItem("apiKey").slice(104)
  : null;

const API_KEY = localStorage.getItem("apiKey")
  ? localStorage.getItem("apiKey").slice(0, 104)
  : null;

(async function () {
  "use strict";

  const URLLocation = new URL(window.location.href);
  const page = {
    ticket: URLLocation.href.includes("TicketPrincipal"),
    home: URLLocation.href.includes("portaldocliente"),
  };

  if (page.ticket) {
    waitForKeyElements("#AdequacoesVinculadasRow_Nenhuma", () => {
      mainTicket();
      // mainAlert();
    });
  } else if (page.home) {
    waitForKeyElements("#grdTicket", () => {
      mainHistory();
      initSLAColumns();
      // alertBtnHome();
    });
  } else {
    mainAzure();
  }
})();

function mainTicket() {
  GM_addStyle(styles.mainTicket);

  const { ticketClient, nextMonth, ticketPSESIM, allTicketPSESIM, sigaModules } =
    ticketVars();

  document.querySelector(".copyBtnStyle")
    ? null
    : customBtn(ticketClient, nextMonth, ticketPSESIM, allTicketPSESIM);

  !document.querySelector(".selectDefaultTextStyle") &&
    !document.querySelector("#msgAvaliacao1")
    ? customMessage(ticketClient, nextMonth, ticketPSESIM, sigaModules)
    : null;

  document.querySelector(".histBtn") ? null : historyButtonTicketPage();
}

function ticketVars() {
  let ticketClient = document.getElementById(
    "TicketMlo_OperadorContato_Nome",
  ).value.split(" ")[0].toLowerCase();

  ticketClient = ticketClient.charAt(0).toUpperCase() + ticketClient.slice(1);

  const nextMonth = new Date(
    new Date().setMonth(new Date().getMonth() + 1),
  ).toLocaleString("default", { month: "long" });

  function findN() {
    let lastValue = null;

    let trArray = document.querySelectorAll("tr");

    trArray.forEach((tr, index) => {
      if (tr.id.includes("Nenhuma") && index > 0) {
        lastValue = trArray[index - 1].children[1].innerText.trim();
      }
    });

    return lastValue;
  }

  function findAllN() {
    let lastValue = [];

    let trArray = document.querySelectorAll("tr");

    trArray.forEach((tr, index) => {
      if (
        tr.id.includes("AdequacoesVinculadasRow") &&
        !tr.id.includes("Nenhuma") &&
        index > 0
      ) {
        lastValue.push(tr.children[1].innerText.trim());
      }
    });

    return lastValue;
  }

  const ticketPSESIM = findN();
  const allTicketPSESIM = findAllN();

  const sigaModules = [
    {
      text: "Abastecimento",
      value: "AB",
    },
    {
      text: "Contabilidade",
      value: "CB",
    },
    {
      text: "Controle de Estoque",
      value: "CE",
    },
    {
      text: "Controle Financeiro ",
      value: "CF",
    },
    {
      text: "Compras",
      value: "CO",
    },
    {
      text: "Controle de Portaria",
      value: "CP",
    },
    {
      text: "Quiosque de Tesouraria",
      value: "CXQ",
    },
    {
      text: "Controle de Tráfego",
      value: "CT",
    },
    {
      text: "Tesouraria",
      value: "CX",
    },
    {
      text: "Escala de Horário",
      value: "EH",
    },
    {
      text: "Controle de Ponto",
      value: "EP",
    },
    {
      text: "Fretamento",
      value: "FR",
    },
    {
      text: "Faturamento",
      value: "FT",
    },
    {
      text: "Livros Fiscais",
      value: "LF",
    },
    {
      text: "Manutenção de Frota",
      value: "MF",
    },
    {
      text: "Mapa de Controle Operacional",
      value: "MCO",
    },
    {
      text: "Quiosque de Borracharia",
      value: "PN",
    },
    {
      text: "Recursos Humanos",
      value: "RH",
    },
    {
      text: "Quiosque de Serviços",
      value: "SV",
    },
    {
      text: "Conhecimento de Transportes",
      value: "TR",
    }
  ]

  return { ticketClient, nextMonth, ticketPSESIM, allTicketPSESIM, sigaModules };
}

// credits: https://gist.githubusercontent.com/benjamingr/0433b52559ad61f6746be786525e97e8/raw/df41dfca476c1b06db4d8480b6e47ddd7e190c6a/intercept-network-requests.js
function interceptNetworkRequests(ee) {
  const open = XMLHttpRequest.prototype.open;
  const send = XMLHttpRequest.prototype.send;

  const isRegularXHR = open.toString().indexOf("native code") !== -1;

  if (isRegularXHR) {
    XMLHttpRequest.prototype.open = function () {
      ee.onOpen && ee.onOpen(this, arguments);
      if (ee.onLoad) {
        this.addEventListener("load", ee.onLoad.bind(ee));
      }
      if (ee.onError) {
        this.addEventListener("error", ee.onError.bind(ee));
      }
      return open.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function () {
      ee.onSend && ee.onSend(this, arguments);
      return send.apply(this, arguments);
    };
  }

  return ee;
}
