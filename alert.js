function mainAlert() {
  GM_addStyle(styles.mainAlert);

  alertBtn();

  interceptNetworkRequests({
    onLoad: (data) => {
      if (
        data.currentTarget.responseURL.includes("ObterListaOrdenacao") ||
        data.currentTarget.responseURL.includes("ObterListaFiltro") ||
        data.currentTarget.responseURL.includes("IndexPartial")
      ) {
        setTimeout(() => {
          alertBtn();
        }, "1");
      }
    },
  });
}

function alertBtn() {
  const oldAlertBtn = document.querySelectorAll(".alertBtn");

  if (oldAlertBtn.length > 0) oldAlertBtn.forEach((btn) => btn.remove());

  function createBtn(ticketNumber) {
    const customBtn = document.createElement("button");

    customBtn.innerHTML = `<i class="fa fa-bell-o" aria-hidden="true"></i>`;
    customBtn.classList = "alertBtn";
    customBtn.type = "button";

    // if (ticketsWithHistory.includes(ticketNumber)) {
    //   customBtn.style.backgroundColor = "rgb(255, 210, 162)";
    //   customBtn.style.color = "rgb(0, 0, 0)";
    //   customBtn.innerHTML = `<i class="fa fa-bell" aria-hidden="true"></i>`;
    // }

    customBtn.addEventListener("click", () => {
      customBtn.blur();
      alertModal(ticketNumber);
    });

    return customBtn;
  }

  // const alertListContainer = document.createElement("div");
  // alertListContainer.classList = "alertListContainer";
  //
  // const alertContainer = document.createElement("div");
  // alertContainer.classList = "alertContainer";
  //
  // alertBtn.addEventListener("click", () => {});

  if (document.getElementById("btnSeguir")) {
    const buttonsRow = document.getElementById("btnSeguir").parentElement;
    const ticketNumber = document
      .getElementById("TicketMlo_Protocolo")
      .value.replace(/\D/g, "");
    const customBtn = createBtn(ticketNumber);

    buttonsRow.prepend(customBtn);
  }
}

function alertBtnHome() {
  const navSearch = document.querySelector("#nav-search");

  const alertIcon = document.createElement("btn");

  navSearch.style.display = "flex";
  navSearch.style.gap = "15px";
  navSearch.style.alignItems = "center";

  alertIcon.innerHTML = `<i class="fa fa-bell-o" aria-hidden="true"></i>`;
  // alertIcon.classList = "alertBtn";
  alertIcon.type = "button";
  alertIcon.classList = "copyBtnStyle";

  navSearch.appendChild(alertIcon);

  alertIcon.addEventListener("click", () => {});
}

async function alertModal(ticketNumber) {
  const body = document.querySelector("body");
  const userLogged =
    document.getElementById("spanNomeAbreviado").innerText.split(".")[0] ||
    document.getElementById("spanNomeAbreviado");
  const scrollY = window.scrollY;

  body.style.overflow = "hidden";

  try {
    const modalHTML = `
      <div class="modalBackdrop" style="top: ${scrollY}px;">
        <div class="modalWrapper">
          <div class="modalContent">
            <span style="text-align:center; color:#ff88004a">Carregando...</span>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modalBackdrop = document.querySelector(".modalBackdrop");
    const modalTextArea = document.querySelector(".modalTextArea");
    const modalSendBtn = document.querySelector(".modalSendBtn");

    // const msgList = await fetch(`${API_URL}/ticket/${ticketNumber}`).then(
    //   (res) => res.json(),
    // );

    // modalSendBtn.addEventListener("click", async () => {
    //   if (!modalTextArea.value.trim()) {
    //     modalTextArea.value = "";
    //     return;
    //   }
    //
    //   msgList.push({
    //     sender: userLogged,
    //     date: new Date(),
    //     message: modalTextArea.value.trim(),
    //   });
    //
    //   await fetch(`${API_URL}/ticket`, {
    //     body: JSON.stringify({
    //       ticket: ticketNumber,
    //       message: modalTextArea.value.trim(),
    //       sender: userLogged,
    //     }),
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //   });
    //
    //   modalTextArea.value = "";
    //   renderMessages(msgList, userLogged);
    // });
    //
    // renderMessages(msgList, userLogged);

    // Lida com o fechamento do modal ao clicar no backdrop
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) {
        fecharModal();
      }
    });

    // Lida com o fechamento ao pressionar "Esc"
    document.addEventListener("keyup", function handleEscape(event) {
      if ((event.key === "Escape" || event.key === "Esc") && modalBackdrop) {
        fecharModal();
        document.removeEventListener("keyup", handleEscape);
      }
    });

    function fecharModal() {
      document.body.style.overflow = "auto";
      modalBackdrop.remove();
      alertBtn();
    }
  } catch (error) {
    console.log(error);
  }
}

// function renderMessages(msgList, userLogged) {
//   const modalContent = document.querySelector(".modalContent");
//
//   modalContent.innerHTML = "";
//
//   if (!msgList.length) {
//     modalContent.innerHTML = `<span style="text-align:center; color:#cdcbcb" >Nenhum alerta encontrado</span>`;
//     return;
//   }
//
//   msgList.forEach((msg) => {
//     const modalMsgWrapper = document.createElement("div");
//     const modalMsgInfo = document.createElement("span");
//     const modalMsg = document.createElement("div");
//
//     modalMsgWrapper.classList.add("modalMsgWrapper");
//     modalMsgInfo.classList.add("modalMsgInfo");
//     modalMsg.classList.add(
//       userLogged === msg.sender ? "modalMsg" : "modalMsgOther",
//     );
//
//     modalMsgWrapper.style.alignItems =
//       userLogged === msg.sender
//         ? (modalMsg.style.alignSelf = "flex-end")
//         : (modalMsg.style.alignSelf = "flex-start");
//
//     modalMsg.innerText = `${msg.message}`;
//
//     modalMsgInfo.innerHTML = ` ${msg.sender} <br> ${new Date(
//       msg.date,
//     ).toLocaleString()}`;
//     modalMsgInfo.style.textAlign =
//       userLogged === msg.sender ? "right" : "flex-left";
//
//     modalMsgWrapper.appendChild(modalMsgInfo);
//     modalMsgWrapper.appendChild(modalMsg);
//     modalContent.appendChild(modalMsgWrapper);
//   });
//
//   modalContent.scrollTop = modalContent.scrollHeight;
// }
