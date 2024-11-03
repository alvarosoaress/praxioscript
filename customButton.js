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
  