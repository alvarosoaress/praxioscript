// ==UserScript==
// @name         Utils Portal
// @namespace
// @version      1.3.2
// @description  Utilitários para o portal do cliente Praxio
// @author       Cálvaro (e Breno quebrando o script)
// @match        https://portaldocliente.praxio.com.br/Ticket*
// @match        https://dev.azure.com/praxio/Autumn/_sprints/taskboard/*/Autumn/*/*?workitem=*
// @match        https://dev.azure.com/praxio/Autumn/_sprints/taskboard/*/Autumn/*/*&workitem=*
// @match        https://dev.azure.com/praxio/Autumn/_sprints/taskboard/*/Autumn/*/*
// @match        https://dev.azure.com/praxio/Autumn/_boards/board/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=praxio.com.br
// @require 	   https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@v1.3/waitForKeyElements.js
// @require      https://github.com/alvarosoaress/praxioscript/raw/master/customButton.js
// @require      https://github.com/alvarosoaress/praxioscript/raw/master/customMessage.js
// @require      https://github.com/alvarosoaress/praxioscript/raw/master/history.js
// @require      https://github.com/alvarosoaress/praxioscript/raw/master/azure.js
// @require      https://github.com/alvarosoaress/praxioscript/raw/master/hyperlink.js
// @downloadURL  https://github.com/alvarosoaress/praxioscript/raw/master/utilsPraxio.user.js
// @updateURL    https://github.com/alvarosoaress/praxioscript/raw/master/utilsPraxio.user.js
// @run-at       document-idle
// @grant        GM_addStyle
// ==/UserScript==

const API_URL = localStorage.getItem('apiKey') ? localStorage.getItem('apiKey').slice(-31) : null;

(function () {
  "use strict";

  if (window.location.href.includes("TicketPrincipal")) {
    waitForKeyElements("#AdequacoesVinculadasRow_Nenhuma", () => mainTicket());
  } else if (window.location.href.includes("portaldocliente")) {
    waitForKeyElements("#grdTicket", () => mainHistory());
  }
  else {
    // waitForKeyElements(`[aria-label="Description"]`, () => mainAzure());
    mainAzure()
  }
})();

function mainTicket() {
  const styles = `
    .copyBtnStyle {
      display: block;
		  background-color: #F9F9F9;
      cursor: pointer;
      color: #999;
      border: 1px solid rgb(197, 208, 220);
      padding: 7px 12px 8px;
      line-height: 18px;
    }

    .copyBtnStyle:hover {
		  background-color: #FFF;
		  border: 1px solid #000;
		  color: #cc0000;
    }

	  .copyCellphoneBtn {
	 	  position: absolute;
		  right: 0;
		  padding: 7px 7px 7px; 
	  }

    .azureBtnStyle:hover {
      color: #0078d4;
    }

    .selectDefaultTextStyle, .selectDefaultTextStyle:focus {
		  background: #FFF;
		  vertical-align: middle;
		  background-color: #FAFAFA !important;
    }

	  .selectTopic {
		  background: #d5d5d5;
		  font-weight: bold;
	  }

    .histBtn {
		  background-color: #F9F9F9;
		  cursor: pointer;
		  color: #999;
      border: 1px solid gray;
      padding-block: 0;
      padding-inline: 5px;
    }

    .histBtn:hover {
		  background-color: #FFF;
		  border: 1px solid #000;
		  color: #cc0000 !important;
    }

    .histBlock {
      display: flex;
		  flex-direction: column;
      gap: 10px;
      align-items: center;
      justify-content: center;
      padding-inline: 0;
    }

    .azureBtnStyle:hover {
      color: #0078d4;
    }

    .selectDefaultTextStyle, .selectDefaultTextStyle:focus {
		  background: #FFF;
		  vertical-align: middle;
		  background-color: #FAFAFA !important;
    }

	  .selectTopic {
		  background: #d5d5d5;
		  font-weight: bold;
	  }

	  .modalBackdrop {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 0;
      left: 0;
      z-index: 100;
      width: 100vw;
      height: 100vh;
      background-color: #00000096;
	  }

	  .modalWrapper {
      width: 65vw;
      height: 80vh;
      background-color: #FFF;
      padding: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 10px;
      gap: 20px;
	  }

	  .modalContent {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
      overflow-y: auto;
	  }

	  .modalMsg {
      max-width: 95%;
      background-color: #ff88004a;
      padding: 10px;
      border-radius: 10px 0px 10px 10px;
      word-break: break-all;
	  }

	  .modalMsgOther {
      max-width: 95%;
      background-color: #00000012;
      padding: 10px;
      border-radius: 0px 10px 10px 10px;
	  }

	  .modalMsgInfo {
      font-size: 10px;
      color: #cdcbcb;
	  }

    .modalMsgWrapper {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-inline: 5px;
	  }

	  .modalTextArea {
      width: 100%;
      height: 100%; 
      resize: none;
      border-radius: 10px;
      font-size: 18px;
      background-color: #e4e6e9;
      color: #696969;
	  }

	  .modalTextArea:focus {
      background-color: #e4e6e9;
      color: #696969;
	  }

	  .modalSendBtn {
      color: #0078d4;
      padding: 10px;
      border-radius: 10px;
      cursor: pointer;
      border: none;	
      outline: none;
      scale: 1.5;
	  }

	  .modalSendWrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100px;
      gap: 20px;
	  }

    .modalLinkWrapper {
      min-width: 20vw;
      min-height: 20vh;
      background-color: #FFF;
      padding: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 10px;
      gap: 20px;
	  }

    .modalLinkInput {
      width: 100%;
      height: 100%; 
      resize: none;
      border-radius: 10px;
      font-size: 18px;
      background-color: white;
      padding: 5px;
      color: #696969;
      border: 1px solid #d5d5d5;
	  }

	  .modalLinkInput:focus {
      background-color: #e4e6e9;
      color: #696969;
	  }

    .modalLinkConfirmBtn {
      color: #0078d4;
      padding: 10px;
      border-radius: 10px;
      cursor: pointer;
      border: none;	
      outline: none;
      transition: all 0.3s;
	  }

    .modalLinkConfirmBtn:hover {
      scale: 1.1;
	  }
      `;

  GM_addStyle(styles);

  const { ticketClient, nextMonth, ticketPSESIM, allTicketPSESIM } = ticketVars();

  document.querySelector(".copyBtnStyle") ? null : customBtn(ticketClient, nextMonth, ticketPSESIM, allTicketPSESIM);

  !document.querySelector(".selectDefaultTextStyle") && !document.querySelector("#msgAvaliacao1")
    ? customMessage(ticketClient, nextMonth, ticketPSESIM, allTicketPSESIM)
    : null;

  document.querySelector(".histBtn") ? null : historyButton()
}

function ticketVars() {
  const ticketClient = document.getElementById(
    "TicketMlo_OperadorContato_Nome",
  ).value;

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

  return { ticketClient, nextMonth, ticketPSESIM, allTicketPSESIM };
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