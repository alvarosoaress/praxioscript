// ==UserScript==
// @name         Utils Portal
// @namespace
// @version      1.0.85
// @description  Utilitários para o portal do cliente Praxio
// @author       Cálvaro (e Breno quebrando o script)
// @match        https://portaldocliente.praxio.com.br/Ticket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=praxio.com.br
// @require 	 https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@v1.3/waitForKeyElements.js
// @downloadURL  https://github.com/alvarosoaress/praxioscript/raw/master/utilsPraxio.user.js
// @updateURL    https://github.com/alvarosoaress/praxioscript/raw/master/utilsPraxio.user.js
// @run-at       document-idle
// @grant        GM_addStyle
// ==/UserScript==

(function () {
	"use strict";

    if(window.location.href.includes('TicketPrincipal')){
        waitForKeyElements("#AdequacoesVinculadasRow_Nenhuma", () => mainTicket());
    }else{
        waitForKeyElements("#grdTicket", () => mainHistory());
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
      `;

	GM_addStyle(styles);

	const { ticketClient, nextMonth, ticketPSESIM, allTicketPSESIM } = globalVar();

	document.querySelector('.copyBtnStyle') ? null : customBtn(ticketClient, nextMonth, ticketPSESIM, allTicketPSESIM);

	!document.querySelector('.selectDefaultTextStyle') && !document.querySelector('#msgAvaliacao1') ? customMessage(ticketClient, nextMonth, ticketPSESIM, allTicketPSESIM) : null
}

function globalVar() {
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

function customBtn(ticketClient, nextMonth, ticketPSESIM, allTicketPSESIM) {
	const tabsNav = document.querySelector("#abasTicketPrincipal");

	const telephoneInput = document.getElementById('TicketMlo_OperadorContato_Telefone');
	const cellphoneInput = document.getElementById('TicketMlo_OperadorContato_Celular');
	const emailInput = document.getElementById('TicketMlo_OperadorContato_Usuario');

	const copyTitleWrapper = document.createElement("li");
	const copyTitleBtn = document.createElement("btn");

	const copyNumberWrapper = document.createElement("li");
	const copyNumberBtn = document.createElement("btn");

	const azureWrapper = document.createElement("li");
	const azureBtn = document.createElement("btn");

	const copyCellphoneBtn = document.createElement("btn");
	const copyTelephoneBtn = document.createElement("btn");
	const copyEmailBtn = document.createElement("btn");

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

	copyTitleWrapper.appendChild(copyTitleBtn);
	tabsNav.appendChild(copyTitleWrapper);

	copyNumberWrapper.appendChild(copyNumberBtn);
	tabsNav.appendChild(copyNumberWrapper);

	azureWrapper.appendChild(azureBtn);
	tabsNav.appendChild(azureWrapper);

	cellphoneInput.parentElement.appendChild(copyCellphoneBtn);
	telephoneInput.parentElement.appendChild(copyTelephoneBtn);
	emailInput.parentElement.appendChild(copyEmailBtn);

	const ticketTitle = document.querySelector("#AssuntoAtualizado").innerHTML;
	const ticketNumber = document.querySelector("#TicketMlo_Protocolo").value;

	const cellphoneNumber = cellphoneInput.value.replace(/\D/g, '');
	const telephoneNumber = telephoneInput.value.replace(/\D/g, '');
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
			if(opt.disabled) option.classList.add("selectTopic");
			selectDefaultText.appendChild(option);
		});
	}

	const situations = {
		"Em andamento": document.querySelector('#listaStatus').querySelector(':nth-child(1)').children[0],
		"Pendente Cliente": document.querySelector('#listaStatus').querySelector(':nth-child(2)').children[0],
		"Aguardando Ad": document.querySelector('#listaStatus').querySelector(':nth-child(3)').children[0],
		"Cancelado": document.querySelector('#listaStatus').querySelector(':nth-child(4)').children[0],
		"Concluído": document.querySelector('#listaStatus').querySelector(':nth-child(4)').children[0],
	}

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
			situation: situations["Aguardando Ad"]
		},
		{
			text: "Retorno - Fila de desenvolvimento",
			value: `Olá ${ticketClient}, 
					<br>
					<br>Demanda se encontra na fila de desenvolvimento, qualquer novidade lhe manteremos informado ;).<br>
                    `,
			situation: situations["Aguardando Ad"]
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
			situation: situations["Aguardando Ad"]
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
			situation: situations["Aguardando Ad"]
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
			situation: situations["Pendente Cliente"]
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
			situation: situations["Pendente Cliente"]
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

	selectDefaultText.addEventListener("change", (e) => {
		fillTextArea(e.target.value);
		optionsArray[selectDefaultText.selectedIndex-1].situation.click();
	});

	cabecalhoTramite.appendChild(selectDefaultText);
}

function mainHistory(){
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
		color: #cc0000;
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
      `;

	GM_addStyle(styles);

    historyButton();

	interceptNetworkRequests({
		onLoad: (data) => {
			if(data.currentTarget.responseURL.includes('ObterListaOrdenacao') || data.currentTarget.responseURL.includes('ObterListaFiltro') ||  data.currentTarget.responseURL.includes('PesquisaPartial')){
				setTimeout(() => {
                    historyButton();
                }, "100");
			}
		}
	});
}

function historyButton(){
    const ticketArray = document.querySelectorAll('.dxgvDataRow_Metropolis');
    const customBtn = document.createElement('button');

    customBtn.innerText = 'Hist';
    customBtn.classList = 'histBtn';

    ticketArray.forEach((el) => {
        el.firstElementChild.classList.add('histBlock');
        el.firstElementChild.appendChild(customBtn.cloneNode(true));
    })
}

// credits: https://gist.githubusercontent.com/benjamingr/0433b52559ad61f6746be786525e97e8/raw/df41dfca476c1b06db4d8480b6e47ddd7e190c6a/intercept-network-requests.js
function interceptNetworkRequests(ee) {
    const open = XMLHttpRequest.prototype.open;
    const send = XMLHttpRequest.prototype.send;

    const isRegularXHR = open.toString().indexOf('native code') !== -1;

    if (isRegularXHR) {
        XMLHttpRequest.prototype.open = function() {
            ee.onOpen && ee.onOpen(this, arguments);
            if (ee.onLoad) {
                this.addEventListener('load', ee.onLoad.bind(ee));
            }
            if (ee.onError) {
                this.addEventListener('error', ee.onError.bind(ee));
            }
            return open.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function() {
            ee.onSend && ee.onSend(this, arguments);
            return send.apply(this, arguments);
        };
    }

    return ee;
}