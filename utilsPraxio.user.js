// ==UserScript==
// @name         Utils Portal
// @namespace
// @version      2024-07-26
// @description  Utilitários para o portal do cliente Praxio
// @author       Cálvaro (e Breno quebrando o script)
// @match        https://portaldocliente.praxio.com.br/Ticket/TicketPrincipal/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=praxio.com.br
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @run-at       document-idle
// @grant        GM_addStyle
// ==/UserScript==

(function () {
	"use strict";

	waitForKeyElements("#AdequacoesVinculadasRow_Nenhuma", () => main());
})();

function main() {
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

      .azureBtnStyle:hover {
        color: #0078d4;
      }
  
      .selectDefaultTextStyle {
          background: #FFF;
          vertical-align: middle;
      }
      `;

	GM_addStyle(styles);

	const { ticketClient, nextMonth, ticketPSESIM, allTicketPSESIM } = globalVar();

	customBtn(ticketClient, nextMonth, ticketPSESIM, allTicketPSESIM);

	customMessage(ticketClient, nextMonth, ticketPSESIM, allTicketPSESIM);
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

	const copyTitleWrapper = document.createElement("li");
	const copyTitleBtn = document.createElement("btn");

	const copyNumberWrapper = document.createElement("li");
	const copyNumberBtn = document.createElement("btn");

	const AzureWrapper = document.createElement("li");
	const AzureBtn = document.createElement("btn");

	copyTitleBtn.innerHTML = `<i class="fa fa-clipboard"></i> Copiar Título`;
	copyTitleBtn.classList.add("copyBtnStyle");

	copyNumberBtn.innerHTML = `<i class="fa fa-clipboard"></i> Copiar Nº do ticket`;
	copyNumberBtn.classList.add("copyBtnStyle");

	AzureBtn.innerHTML = `<i class="fa fa-external-link-square" aria-hidden="true"></i> Azure`;
	AzureBtn.classList = "copyBtnStyle azureBtnStyle";

	copyTitleWrapper.appendChild(copyTitleBtn);
	tabsNav.appendChild(copyTitleWrapper);

	copyNumberWrapper.appendChild(copyNumberBtn);
	tabsNav.appendChild(copyNumberWrapper);

	AzureWrapper.appendChild(AzureBtn);
	tabsNav.appendChild(AzureWrapper);

	const ticketTitle = document.querySelector("#AssuntoAtualizado").innerHTML;
	const ticketNumber = document.querySelector("#TicketMlo_Protocolo").value;

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

	AzureBtn.addEventListener("click", () => {
		window.open(
			`https://dev.azure.com/praxio/Autumn/_search?text=${allTicketPSESIM.join(" OR ")}&type=workitem&lp=workitems-Team&filters=Projects%7BAutumn%7D&pageSize=25`,
		);
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
			selectDefaultText.appendChild(option);
		});
	}

	const optionsArray = [
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
		},
		{
			text: "Retorno - Em Analise",
			value: `Olá ${ticketClient}, estamos analisando e em breve daremos um retorno.<br>
                        <br>
                        Qualquer duvida estamos a disposição.
                    `,
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
	});

	cabecalhoTramite.appendChild(selectDefaultText);
}
