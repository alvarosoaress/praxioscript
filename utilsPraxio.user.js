// ==UserScript==
// @name         Utils Portal
// @namespace
// @version      1.3.1
// @description  Utilitários para o portal do cliente Praxio
// @author       Cálvaro (e Breno quebrando o script)
// @match        https://portaldocliente.praxio.com.br/Ticket*
// @match        https://dev.azure.com/praxio/Autumn/_sprints/taskboard/*/Autumn/*/*?workitem=*
// @match        https://dev.azure.com/praxio/Autumn/_sprints/taskboard/*/Autumn/*/*&workitem=*
// @match        https://dev.azure.com/praxio/Autumn/_sprints/taskboard/*/Autumn/*/*
// @match        https://dev.azure.com/praxio/Autumn/_boards/board/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=praxio.com.br
// @require 	   https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@v1.3/waitForKeyElements.js
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

let savedRange = null;

function saveCursorPosition() {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    savedRange = selection.getRangeAt(0);
  }
}

function restoreCursorPosition() {
  const selection = window.getSelection();
  if (savedRange) {
    selection.removeAllRanges();
    selection.addRange(savedRange);
  }
}

function customBtn(ticketClient, nextMonth, ticketPSESIM, allTicketPSESIM) {
  const tabsNav = document.querySelector("#abasTicketPrincipal");

  const telephoneInput = document.getElementById(
    "TicketMlo_OperadorContato_Telefone",
  );
  const cellphoneInput = document.getElementById(
    "TicketMlo_OperadorContato_Celular",
  );
  const emailInput = document.getElementById(
    "TicketMlo_OperadorContato_Usuario",
  );

  const btnGroup = document.querySelector('[data-original-title="Indent (Tab)"]').parentElement;

  const copyTitleWrapper = document.createElement("li");
  const copyTitleBtn = document.createElement("btn");

  const copyNumberWrapper = document.createElement("li");
  const copyNumberBtn = document.createElement("btn");

  const azureWrapper = document.createElement("li");
  const azureBtn = document.createElement("btn");

  const copyCellphoneBtn = document.createElement("btn");
  const copyTelephoneBtn = document.createElement("btn");
  const copyEmailBtn = document.createElement("btn");

  const linkBtn = document.createElement("a");

  copyTitleBtn.innerHTML = `<i class="fa fa-clipboard"></i> Copiar Título`;
  copyTitleBtn.classList.add("copyBtnStyle");

  copyNumberBtn.innerHTML = `<i class="fa fa-clipboard"></i> Copiar Nº do ticket`;
  copyNumberBtn.classList.add("copyBtnStyle");

  azureBtn.innerHTML = `<i class="fa fa-external-link-square" aria-hidden="true"></i> Azure`;
  azureBtn.classList = "copyBtnStyle azureBtnStyle";

  copyTelephoneBtn.innerHTML = `<i class="fa fa-clipboard"></i>`;
  copyTelephoneBtn.classList = "copyBtnStyle copyCellphoneBtn";

  copyCellphoneBtn.innerHTML = `<i class="fa fa-clipboard"></i>`;
  copyCellphoneBtn.classList = "copyBtnStyle copyCellphoneBtn";

  copyEmailBtn.innerHTML = `<i class="fa fa-clipboard"></i>`;
  copyEmailBtn.classList = "copyBtnStyle copyCellphoneBtn";

  linkBtn.innerHTML = `<i class="fa fa-link"></i>`;
  linkBtn.classList = "btn btn-sm btn-purple";

  linkBtn.setAttribute("data-original-title", "Adicionar Link");

  copyTitleWrapper.appendChild(copyTitleBtn);
  tabsNav.appendChild(copyTitleWrapper);

  copyNumberWrapper.appendChild(copyNumberBtn);
  tabsNav.appendChild(copyNumberWrapper);

  azureWrapper.appendChild(azureBtn);
  tabsNav.appendChild(azureWrapper);

  cellphoneInput.parentElement.appendChild(copyCellphoneBtn);
  telephoneInput.parentElement.appendChild(copyTelephoneBtn);
  emailInput.parentElement.appendChild(copyEmailBtn);

  btnGroup.appendChild(linkBtn);

  const ticketTitle = document.querySelector("#AssuntoAtualizado").innerHTML;
  const ticketNumber = document.querySelector("#TicketMlo_Protocolo").value;

  const cellphoneNumber = cellphoneInput.value.replace(/\D/g, "");
  const telephoneNumber = telephoneInput.value.replace(/\D/g, "");
  const email = emailInput.value;

  copyTitleBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(ticketTitle);
    copyTitleBtn.innerHTML = `<i class="fa fa-check-square"></i> Título Copiado!`;
    setTimeout(() => {
      copyTitleBtn.innerHTML = `<i class="fa fa-clipboard"></i> Copiar Título`;
    }, 1000);
  });

  copyNumberBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(ticketNumber);
    copyNumberBtn.innerHTML = `<i class="fa fa-check-square"></i> Número Copiado!`;
    setTimeout(() => {
      copyNumberBtn.innerHTML = `<i class="fa fa-clipboard"></i> Copiar Número`;
    }, 1000);
  });

  azureBtn.addEventListener("click", () => {
    window.open(
      `https://dev.azure.com/praxio/Autumn/_search?text=${allTicketPSESIM.join(" OR ")}&type=workitem&lp=workitems-Team&filters=Projects%7BAutumn%7D&pageSize=25`,
    );
  });

  copyCellphoneBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(cellphoneNumber);
    copyCellphoneBtn.innerHTML = `<i class="fa fa-check-square"></i>`;
    setTimeout(() => {
      copyCellphoneBtn.innerHTML = `<i class="fa fa-clipboard"></i>`;
    }, 1000);
  });

  copyTelephoneBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(telephoneNumber);
    copyTelephoneBtn.innerHTML = `<i class="fa fa-check-square"></i>`;
    setTimeout(() => {
      copyTelephoneBtn.innerHTML = `<i class="fa fa-clipboard"></i>`;
    }, 1000);
  });

  copyEmailBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(email);
    copyEmailBtn.innerHTML = `<i class="fa fa-check-square"></i>`;
    setTimeout(() => {
      copyEmailBtn.innerHTML = `<i class="fa fa-clipboard"></i>`;
    }, 1000);
  });

  linkBtn.addEventListener("click", () => {
    saveCursorPosition();
    linkModal();
  });
}

function customMessage(ticketClient, nextMonth, ticketPSESIM, allTicketPSESIM) {
  function fillTextArea(value) {
    const textArea = document.querySelector("#EditorTramite");
    textArea.innerHTML = value;
  }

  function createOptions(optArr) {
    optArr.map((opt) => {
      const option = document.createElement("option");
      option.text = opt.text;
      option.value = opt.value;
      option.disabled = opt.disabled;
      if (opt.disabled) option.classList.add("selectTopic");
      selectDefaultText.appendChild(option);
    });
  }

  const situations = {
    "Em andamento": document
      .querySelector("#listaStatus")
      .querySelector(":nth-child(1)").children[0],
    "Pendente Cliente": document
      .querySelector("#listaStatus")
      .querySelector(":nth-child(2)").children[0],
    "Aguardando Ad": document
      .querySelector("#listaStatus")
      .querySelector(":nth-child(3)").children[0],
    Cancelado: document
      .querySelector("#listaStatus")
      .querySelector(":nth-child(4)").children[0],
    Concluído: document
      .querySelector("#listaStatus")
      .querySelector(":nth-child(4)").children[0],
  };

  const optionsArray = [
    {
      text: "PRODUTO",
      value: ``,
      disabled: true,
    },
    {
      text: "Retorno - Em Analise",
      value: `Olá ${ticketClient}, estamos analisando e em breve daremos um retorno.<br>
                        <br>
                        Qualquer duvida estamos a disposição.
                    `,
      situation: situations["Aguardando Ad"],
    },
    {
      text: "Retorno - Fila de desenvolvimento",
      value: `Olá ${ticketClient}, 
					<br>
					<br>Demanda se encontra na fila de desenvolvimento, qualquer novidade lhe manteremos informado ;).<br>
                    `,
      situation: situations["Aguardando Ad"],
    },
    {
      text: "TESTE",
      value: ``,
      disabled: true,
    },
    {
      text: "Teste - inicio",
      value: `${ticketClient}, bom dia.<br>
                    <br>
                    Demanda já finalizada pelo nosso time de Dev.<br>
                    Nesse momento em fase de testes.<br>
                    Qualquer novidade, lhe manteremos informados por aqui.<br>
                    <br>
                    <b>Att.<br>
                    *Setor de testes/Qualidade de  Software*</b>
                    `,
      situation: situations["Aguardando Ad"],
    },
    {
      text: "Teste - finalizado",
      value: `${ticketClient}, bom dia.<br>
                    <br>
                    Testes foram finalizados com sucesso.<br>
                    <b>Necessário somente aguardar a próxima atualização de Release do SIGAi prevista para ${nextMonth}/2024</b>.<br>
                    <br>
                    Até lá lhe manteremos informado por aqui em qualquer novidade.<br>
                    <br>
                    <b>Att.<br>
                    *Setor de testes/Qualidade de Software*</b>
                    `,
      situation: situations["Aguardando Ad"],
    },
    {
      text: "Versão cliente - LOCAL",
      value: `${ticketClient}, bom dia.<br>
                    <br>
                    Finalizamos a solicitação de desenvolvimento nº:<br>
                    <b>${ticketPSESIM} - DESCRIÇÃO</b><br>
                    <br>
                    <b>Segue anexo contendo, manual de orientação, script do banco de dados e versão SIGAiXX X.X.XX</b><br>
                    <br>
                    Favor entrar em contato com o suporte para atualização da versão caso necessário.<br>
                    Não é recomendada a atualização de versão na sexta-feira.<br>
                    <br>
                    Aguardamos seu retorno com a validação da implementação realizada.<br>
                    Qualquer dúvida estamos à disposição.<br>
                    <br>
                    <b>Att.<br>
                    *Setor de testes/Qualidade de Software*</b><br>
                    `,
      situation: situations["Pendente Cliente"],
    },
    {
      text: "Versão cliente - NUVEM",
      value: `${ticketClient}, bom dia.<br>
                    <br>
                    Finalizamos a solicitação de desenvolvimento nº:<br>
                    <b>${ticketPSESIM} - DESCRIÇÃO</b><br>
                    <br>
                    <b>A versão SIGAiXX X.X.XX, já foi atualizada no nosso servidor e esta disponível para utilização. "Necessário reiniciar o acesso no navegador"</b><br>
                    <br>
                    Segue em anexo manual de orientação, exemplificando a implementação.<br>
                    <br>
                    Aguardamos seu retorno com a validação da implementação realizada.<br>
                    Qualquer dúvida estamos à disposição.<br>
                    <br>
                    <b>Att.<br>
                    *Setor de testes/Qualidade de Software*</b><br>
                    `,
      situation: situations["Pendente Cliente"],
    },
    {
      text: "Retorno - Em validação",
      value: `${ticketClient}, bom dia.<br>
                    <br>
                    Ok, muito obrigado !<br>
                    <br>
                    Fico no aguardo do seu retorno com validação final.<br>
                    <br>
                    ;)
                    `,
      situation: situations["Pendente Cliente"],
    },
    {
      text: "Release LUNA / LUNA ADM",
      value: `${ticketClient}, bom dia. Espero que esteja tudo bem.<br>
                    Informo que Release de atualização dos sistemas LUNA e LUNA ADM já está liberada.<br>
                    A sua demanda já encontra-se disponível na nova versão do sistema.<br>
                    <br>
                    Segue anexo a Release Notes através do link da base de conhecimento com as atualizações solicitadas.<br>
                    <b><i><a href="" id="linkColado" target="_blank"><font>TEXTO LINK</font></a></i></b><br>
                    <b><u>*Favor copiar e colar esse link no seu navegador para acesso</u></b>.<br>
                    <br>
                    Gentileza efetuar as validações e encerramento do ticket.<br>
                    A sua satisfação é o nosso maior objetivo!<br>
                    Agradecemos se puder avaliar o nosso atendimento e também a solução dada para sua demanda.<br>
                    Atenciosamente,<br>
                    <b>ASSINATURA</b>
                    `,
      situation: situations["Pendente Cliente"],
      link: "linkColado",
    },
  ];

  const cabecalhoTramite = document.querySelector("#cabecalhoTramite");

  const selectDefaultText = document.createElement("select");

  selectDefaultText.innerHTML = "Alternativo Texto Padrão";
  selectDefaultText.classList =
    "input-xlarge chosen-select selectDefaultTextStyle";

  const selectPlaceholder = document.createElement("option");

  selectPlaceholder.text = "Selecione uma opção";
  selectPlaceholder.value = "";
  selectPlaceholder.disabled = true;
  selectPlaceholder.selected = true;

  selectDefaultText.appendChild(selectPlaceholder);

  createOptions(optionsArray);

  selectDefaultText.addEventListener("change", async (e) => {
    fillTextArea(e.target.value);
    optionsArray[selectDefaultText.selectedIndex - 1].situation.click();

    if (optionsArray[selectDefaultText.selectedIndex - 1].link) {
      //TODO também adicionar botão de adicionar link no conteúdo do Texto
      //TODO esse terá o mesmo comportamento de modal e irá adicionar um a com  href
      //TODO na posição atual do cursor no texto, tlvz concatenando o inner html atual com o novo a

      linkModal(optionsArray[selectDefaultText.selectedIndex - 1].link);
    }
  });

  cabecalhoTramite.appendChild(selectDefaultText);
}

function mainHistory() {
  const styles = `
    .histBtn {
      display: block;
		  background-color: #F9F9F9;
		  cursor: pointer;
		  color: #999;
      border: 1px solid gray;
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

    .copyBtnStyle {
      display: block;
		  background-color: #F9F9F9;
      cursor: pointer;
      color: #999;
      border: 1px solid rgb(197, 208, 220);
      padding: 5px 5px 5px;
      line-height: 18px;
    }

    .copyBtnStyle:hover {
		  background-color: #FFF;
		  border: 1px solid #000;
		  color: #cc0000;
    }
    `;

  GM_addStyle(styles);

  keyBtn();

  historyButton();

  interceptNetworkRequests({
    onLoad: (data) => {
      if (
        data.currentTarget.responseURL.includes("ObterListaOrdenacao") ||
        data.currentTarget.responseURL.includes("ObterListaFiltro") ||
        data.currentTarget.responseURL.includes("IndexPartial")
      ) {
        setTimeout(() => {
          historyButton();
        }, "1");
      }
    },
  });
}

function keyBtn() {
  const navSearch = document.querySelector("#nav-search");

  const keyBtn = document.createElement("btn");

  navSearch.style.display = "flex";
  navSearch.style.gap = "15px";
  navSearch.style.alignItems = "center";

  keyBtn.innerHTML = `<i class="fa fa-key"></i>`;
  keyBtn.classList = "copyBtnStyle";
  navSearch.appendChild(keyBtn);

  keyBtn.addEventListener("click", () => {
    const key = prompt("Digite a chave para realizar as requisições", "");

    if (key === null) return;

    if (key === "") {
      alert("Chave inválida");
      return;
    }

    const keyBtn = document.querySelector(".copyBtnStyle");

    keyBtn.innerHTML = `<i class="fa fa-key"></i> Chave salva!`;
    keyBtn.style.color = "#0078d4";

    setTimeout(() => {
      keyBtn.innerHTML = `<i class="fa fa-key"></i>`;
      keyBtn.style.color = "#999";
      window.location.reload();
    }, 1000);

    localStorage.setItem("apiKey", key);
  });
}

async function historyButton() {
  //TODO Add realtime chat
  // const { io } = await import('https://cdn.socket.io/4.7.5/socket.io.esm.min.js');
  // const socket = io(API_URL);

  // console.log(socket)

  const oldHistBtn = document.querySelectorAll(".histBtn");

  if (oldHistBtn.length > 0) oldHistBtn.forEach((btn) => btn.remove());

  const ticketsWithHistory = await fetch(`${API_URL}/alltickets`).then((res) =>
    res.json()
  );

  function createBtn(ticketNumber) {
    const customBtn = document.createElement("button");

    customBtn.innerHTML = `<i class="fa fa-history" aria-hidden="true"></i>`;
    customBtn.classList = "histBtn";
    customBtn.type = "button";

    if (ticketsWithHistory.includes(ticketNumber)) {
      customBtn.style.backgroundColor = "rgb(255, 210, 162)";
      customBtn.style.color = "rgb(0, 0, 0)";
    }

    customBtn.addEventListener("click", () => {
      customBtn.blur();
      historyModal(ticketNumber);
    });

    return customBtn;
  }

  if (document.getElementById("btnSeguir")) {
    const buttonsRow = document.getElementById("btnSeguir").parentElement;
    const ticketNumber = document
      .getElementById("TicketMlo_Protocolo")
      .value.replace(/\D/g, "");
    const customBtn = createBtn(ticketNumber);

    buttonsRow.prepend(customBtn);
  } else {
    const ticketArray = document.querySelectorAll(".dxgvDataRow_Metropolis");
    ticketArray.forEach((el) => {
      const ticketNumber = el
        .querySelector("td:nth-child(2)")
        .innerText.replace(/\D/g, "");

      const customBtn = createBtn(ticketNumber);

      el.firstElementChild.classList.add("histBlock");
      el.firstElementChild.appendChild(customBtn);
    });
  }
}

async function historyModal(ticketNumber) {
  const body = document.querySelector("body");
  const userLogged =
    document.getElementById("spanNomeAbreviado").innerText.split(".")[0] ||
    document.getElementById("spanNomeAbreviado");
  const scrollY = window.scrollY;

  body.style.overflow = "hidden";

  try {
    const modalBackdrop = document.createElement("div");
    const modalWrapper = document.createElement("div");
    const modalContent = document.createElement("div");

    const modalSendWrapper = document.createElement("div");

    const modalTextArea = document.createElement("textarea");
    const modalSendBtn = document.createElement("button");

    modalBackdrop.style.top = scrollY + "px";
    modalBackdrop.classList.add("modalBackdrop");
    modalWrapper.classList.add("modalWrapper");
    modalContent.classList.add("modalContent");
    modalTextArea.classList.add("modalTextArea");
    modalSendBtn.classList.add("modalSendBtn");
    modalSendBtn.type = "button";
    modalSendWrapper.classList.add("modalSendWrapper");

    modalSendBtn.innerHTML = `<i class="fa fa-paper-plane" aria-hidden="true"></i>`;

    body.appendChild(modalBackdrop);

    modalBackdrop.appendChild(modalWrapper);

    modalWrapper.appendChild(modalContent);

    modalSendWrapper.appendChild(modalTextArea);
    modalSendWrapper.appendChild(modalSendBtn);

    modalWrapper.appendChild(modalSendWrapper);

    modalContent.innerHTML = `<span style="text-align:center; color:#ff88004a" >Carregando...</span>`;

    const msgList = await fetch(`${API_URL}/ticket/${ticketNumber}`).then(
      (res) => res.json()
    );

    modalSendBtn.addEventListener("click", async () => {
      if (!modalTextArea.value.trim()) {
        modalTextArea.value = "";
        return;
      }

      msgList.push({
        sender: userLogged,
        date: new Date(),
        message: modalTextArea.value.trim(),
      });

      await fetch(`${API_URL}/ticket`, {
        body: JSON.stringify({
          ticket: ticketNumber,
          message: modalTextArea.value.trim(),
          sender: userLogged,
        }),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      modalTextArea.value = "";

      renderMessages(msgList, userLogged);

      // socket.emit('chat message', { msg: modalTextArea.value.trim(), ticketNumber });
    });

    renderMessages(msgList, userLogged);

    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) {
        body.style.overflow = "auto";
        modalBackdrop.remove();
        modalWrapper.remove();
        modalContent.remove();
        modalTextArea.remove();
        modalSendBtn.remove();
        modalSendWrapper.remove();
        historyButton();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" || (event.key === "Esc" && modalBackdrop)) {
        body.style.overflow = "auto";
        modalBackdrop.remove();
        modalWrapper.remove();
        modalContent.remove();
        modalTextArea.remove();
        modalSendBtn.remove();
        modalSendWrapper.remove();
        historyButton();
      }
    });
  } catch (error) {
    console.log(error);
  }
}

function renderMessages(msgList, userLogged) {
  const modalContent = document.querySelector(".modalContent");

  modalContent.innerHTML = "";

  if (!msgList.length) {
    modalContent.innerHTML = `<span style="text-align:center; color:#cdcbcb" >Nenhuma mensagem encontrada</span>`;
    return;
  }

  msgList.forEach((msg) => {
    const modalMsgWrapper = document.createElement("div");
    const modalMsgInfo = document.createElement("span");
    const modalMsg = document.createElement("div");

    modalMsgWrapper.classList.add("modalMsgWrapper");
    modalMsgInfo.classList.add("modalMsgInfo");
    modalMsg.classList.add(
      userLogged === msg.sender ? "modalMsg" : "modalMsgOther"
    );

    modalMsgWrapper.style.alignItems =
      userLogged === msg.sender
        ? (modalMsg.style.alignSelf = "flex-end")
        : (modalMsg.style.alignSelf = "flex-start");

    modalMsg.innerText = `${msg.message}`;

    modalMsgInfo.innerHTML = ` ${msg.sender} <br> ${new Date(
      msg.date
    ).toLocaleString()}`;
    modalMsgInfo.style.textAlign =
      userLogged === msg.sender ? "right" : "flex-left";

    modalMsgWrapper.appendChild(modalMsgInfo);
    modalMsgWrapper.appendChild(modalMsg);
    modalContent.appendChild(modalMsgWrapper);
  });

  modalContent.scrollTop = modalContent.scrollHeight;
}

function insertLinkAtCursor(url, text) {
  if (savedRange) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedRange);

    const link = document.createElement('b');
    link.innerHTML = `<i><a href="${url}" target="_blank" style="cursor: pointer;"><font>${text}</font></a></i>`;

    savedRange.deleteContents();
    savedRange.insertNode(link);

    savedRange.setStartAfter(link);
    savedRange.setEndAfter(link);
    selection.removeAllRanges();
    selection.addRange(savedRange);
  }
}

function linkModal(elementId) {
  const body = document.querySelector("body");
  const scrollY = window.scrollY;

  body.style.overflow = "hidden";

  const modalBackdrop = document.createElement("div");
  const modalWrapper = document.createElement("div");
  const modalLinkTitle = document.createElement("h2");
  const modalLinkText = document.createElement("input");
  const modalLink = document.createElement("input");
  const modalConfirmBtn = document.createElement("button");

  modalBackdrop.style.top = scrollY + "px";
  modalBackdrop.classList.add("modalBackdrop");
  modalWrapper.classList.add("modalLinkWrapper");
  modalLinkText.classList.add("modalLinkInput");
  modalLink.classList.add("modalLinkInput");
  modalConfirmBtn.classList.add("modalLinkConfirmBtn");
  modalConfirmBtn.type = "button";

  modalConfirmBtn.innerHTML = `<span>Confirmar</span>`;

  modalLinkText.placeholder = "Texto do link";
  modalLink.placeholder = "Link";

  modalLinkTitle.innerText = "Adicionar Link";

  body.appendChild(modalBackdrop);

  modalWrapper.appendChild(modalLinkTitle);
  modalWrapper.appendChild(modalLinkText);
  modalWrapper.appendChild(modalLink);
  modalWrapper.appendChild(modalConfirmBtn);
  modalWrapper.appendChild(modalConfirmBtn);

  modalBackdrop.appendChild(modalWrapper);

  modalConfirmBtn.addEventListener("click", async () => {
    if (!modalLinkText.value.trim() || !modalLink.value.trim()) {
      modalLinkText.value = "";

      body.style.overflow = "auto";
      modalBackdrop.remove();
      return;
    }

    if(elementId){
      const element = document.getElementById(elementId);
      element.href = modalLink.value.trim();
      element.innerText = modalLinkText.value.trim();
      element.style.cursor = "pointer";

      body.style.overflow = "auto";
      modalBackdrop.remove();
      return;
    }

    restoreCursorPosition();
    insertLinkAtCursor(modalLink.value.trim(), modalLinkText.value.trim());
    body.style.overflow = "auto";
    modalBackdrop.remove();
    return;
  });

  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) {
      body.style.overflow = "auto";
      modalBackdrop.remove();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" || (event.key === "Esc" && modalBackdrop)) {
      body.style.overflow = "auto";
      modalBackdrop.remove();
    }
  });
}

function mainAzure(){
  interceptNetworkRequests({
    onLoad: (data) => {
      if (
        data.currentTarget.responseURL.includes("dataProviders") 
      ) {
        setTimeout(() => {
          waitForKeyElements(`[aria-label="Description"]`, () => {
            let {ticket} = azureVars();
            azureCustomBtn(ticket);
          })
        }, "100");
      }
    },
  });
}

function azureVars() {
  const description = document.querySelector(`[aria-label="Description"]`);
  const criteria = document.querySelector(`[aria-label="Acceptance Criteria"]`);

  const regexTicket = /\b\d{4}-\d{6}\b/g;

  const ticket = (description.innerText + " " + criteria.innerText).match(regexTicket);

  return {ticket}
}

function azureCustomBtn(ticket){
  const oldHistBtn = document.querySelectorAll(".portalTicket");

  if (oldHistBtn.length > 0) oldHistBtn.forEach((btn) => btn.remove());

  if (!ticket) return;

  const tabsNav = document.querySelector(`[aria-label="Details"]`).parentElement;

  const portalTicket = document.createElement("div");
  
  const portalIcon = document.createElement("img");
  portalIcon.src = "https://www.google.com/s2/favicons?sz=64&domain=praxio.com.br";
  portalIcon.style.width = "20px";
  portalIcon.style.height = "20px";
  portalTicket.appendChild(portalIcon);

  const arrowIcon = document.createElement("span");
  arrowIcon.classList = "fabric-icon ms-Icon--ArrowTallUpRight";
  portalTicket.appendChild(arrowIcon);
  
  portalTicket.classList = 'bolt-tab focus-treatment flex-noshrink portalTicket';
  portalTicket.style.display = 'inline-flex';
  portalTicket.style.justifyContent = 'center';
  portalTicket.style.alignItems = 'center';

  portalTicket.addEventListener("click", () => {
    window.open(`https://portaldocliente.praxio.com.br/Ticket/PesquisaTramites?tipoPesquisa=1&pesquisaChave=${ticket[0]}`);
  });

  tabsNav.appendChild(portalTicket);
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