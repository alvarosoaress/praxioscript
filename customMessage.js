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

  const cellphoneInput = document.getElementById(
    "TicketMlo_OperadorContato_Celular",
  );
  const telephoneInput = document.getElementById(
    "TicketMlo_OperadorContato_Telefone",
  );
  const emailInput = document.getElementById(
    "TicketMlo_OperadorContato_Usuario",
  );

  const cellphoneNumber = cellphoneInput.value;
  const telephoneNumber = telephoneInput.value;
  const email = emailInput.value;

  const nextFriday = new Date(new Date().setUTCDate(new Date().getUTCDate() + (5 - new Date().getDay()))).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' })

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
      text: "Retorno - Email para Conclusão",
      value: `${ticketClient}, bom dia.<br>
                      <br>
                      Tentei contato ontem e hoje várias vezes pelo número ${cellphoneNumber || telephoneNumber}, mas não obtive sucesso.<br>
                      <br>
                      Também entrei em contato via e-mail com o endereço ${email} informando qual a situação do ticket.<br>
                      <br>
                      Caso não ocorra nenhuma resposta, o ticket será automaticamente concluído nessa sexta-feira, data ${nextFriday} !
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