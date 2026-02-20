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
    "Cancelado": document
      .querySelector("#listaStatus")
      .querySelector(":nth-child(4)").children[0],
    "Concluido": document
      .querySelector("#listaStatus")
      .querySelector(":nth-child(5)").children[0],
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
  const company = document.getElementById('sinalizadorCliente').innerText.slice(11);

  const cellphoneNumber = cellphoneInput.value;
  const telephoneNumber = telephoneInput.value;
  const email = emailInput.value;

  const nextFriday = new Date(new Date().setUTCDate(new Date().getUTCDate() + (5 - new Date().getDay()))).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' })

  function dateTimeMessage() {
    const hour = new Date().getHours();
    let message = 'bom dia.'

    if (hour >= 12 && hour <= 18) message = 'boa tarde.'

    return message;
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
      value: `${ticketClient}, ${dateTimeMessage()}<br>
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
      text: "Teste - finalizado SIGA",
      value: `${ticketClient}, ${dateTimeMessage()}<br>
                      <br>
                      Testes foram finalizados com sucesso.<br>
                      <b>Necessário somente aguardar a próxima atualização de Release do SIGA prevista para ${nextMonth}/${new Date().getFullYear()}</b>.<br>
                      <br>
                      Até lá lhe manteremos informado por aqui em qualquer novidade.<br>
                      <br>
                      <b>Att.<br>
                      *Setor de testes/Qualidade de Software*</b>
                      `,
      situation: situations["Aguardando Ad"],
    },
    {
      text: "Teste - finalizado LUNA",
      value: `${ticketClient}, ${dateTimeMessage()}<br>
                      <br>
                      Testes foram finalizados com sucesso.<br>
                      <b>Necessário somente aguardar a próxima atualização de Release do Luna prevista para ${nextMonth}/${new Date().getFullYear()}</b>.<br>
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
      value: `${ticketClient}, ${dateTimeMessage()}<br>
                      <br>
                      Finalizamos a solicitação de desenvolvimento nº:<br>
                      <b>${ticketPSESIM} - DESCRIÇÃO</b><br>
                      <br>
                      <b>Segue anexo contendo, manual de orientação, script do banco de dados e versão SIGAXX X.X.XX</b><br>
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
      value: `${ticketClient}, ${dateTimeMessage()}<br>
                      <br>
                      Finalizamos a solicitação de desenvolvimento nº:<br>
                      <b>${ticketPSESIM} - DESCRIÇÃO</b><br>
                      <br>
                      <b>A versão SIGAXX X.X.XX, já foi atualizada no nosso servidor e esta disponível para utilização. "Necessário reiniciar o acesso no navegador"</b><br>
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
      value: `${ticketClient}, ${dateTimeMessage()}<br>
                      <br>
                      Ok, muito obrigado !<br>
                      <br>
                      Fico no aguardo do seu retorno com a validação da implementação.<br>
                      <br>
                      ;)
                      `,
      situation: situations["Pendente Cliente"],
    },
    {
      text: "Retorno - Email para Conclusão",
      value: `${ticketClient}, ${dateTimeMessage()}<br>
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
      value: `${ticketClient}, ${dateTimeMessage()} Espero que esteja tudo bem.<br>
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
    {
      text: "ATENDIMENTO",
      value: ``,
      disabled: true,
    },
    {
      text: "SVB - Segunda Via Boleto",
      value: `Prezados ${company}, ${dateTimeMessage()}<br>
                      <br>
                      A título informativo, registro neste ticket que o cliente ${ticketClient} entrou em contato solicitando a segunda via do boleto.<br>
                      <br>
                      O cliente foi devidamente orientado a encaminhar um e-mail ao time financeiro. Após o envio, a solicitação foi atendida e a situação solucionada com sucesso.<br>
                      <br>
                      Dessa forma, o atendimento está sendo encerrado.
                      `,
      situation: situations["Concluido"],
    },
    {
      text: "Cobrança BSOFT",
      value: `Prezados, ${dateTimeMessage()}<br>
                      <br>
                      A cliente entrou em contato solicitando esclarecimentos a respeito das cobranças recebidas, questionando se deveria continuar efetuando o pagamento do boleto da Bsoft ou do Emissor.<br>
                      <br>
                      Após os devidos esclarecimentos, foi informado que os boletos emitidos pela Bsoft seriam devidamente cancelados, não sendo necessário realizar novos pagamentos referentes a esses títulos.
                      <br>
                      <br>
                      Com isso, o atendimento está sendo encerrado.<br>
                      Permaneço à disposição para quaisquer esclarecimentos adicionais.
                      `,
      situation: situations["Concluido"],
    },
    {
      text: "Atendimento concluído Divulgalive",
      value: `Olá ${ticketClient}, ${dateTimeMessage()}<br>
                  <br>
                  Estamos <strong>concluindo</strong> o atendimento.<br>
                  Em caso de necessidade, salientamos que este ticket pode ser reaberto <strong>em até 5 dias</strong> ou um novo ticket pode ser aberto a qualquer instante.<br>
                  <br>
                  A sua satisfação é o nosso <strong>maior objetivo!</strong> Agradecemos se puder <strong>avaliar</strong> o nosso atendimento e também a solução dada para a sua demanda.<br>
                  <br>
                  ;)<br>
                  <br>
                  <strong>LIVE SIGA</strong> - <i>Descubra como agilizar sua operação!</i><br>
                  <br>
                  <strong>Data:</strong> 26/02 | <strong>Horário:</strong> 15h | <strong>Local:</strong> Via Teams<br>
                  <br>
                  Participe do nosso encontro exclusivo e aprenda a organizar rotinas e padronizar processos para aumentar a produtividade do seu time utilizando o <strong>SIGA</strong>.<br>
                  <br>
                  Evento <span style="color:#16a765;"><strong>100% gratuito</strong></span>, mas as vagas são <span style="color:red;"><strong>limitadas</strong></span>!<br>
                  <br>
                  <a href="https://23423180.hs-sites.com/descubra-como-o-siga-pode-agilizar-sua-opera%C3%A7%C3%A3o" style="color:#2f6fad; cursor: pointer; font-weight: bold;" target="_blank">Clique aqui e garanta sua vaga</a>
                  `,
      situation: situations["Concluido"],
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
      linkModal(optionsArray[selectDefaultText.selectedIndex - 1].link);
    }
  });

  cabecalhoTramite.appendChild(selectDefaultText);
}