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
  