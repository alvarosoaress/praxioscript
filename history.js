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

    document.addEventListener("keyup", function handleEscape(event) {
      if ((event.key === "Escape" || event.key === "Esc") && modalBackdrop) {
        body.style.overflow = "auto";
        modalBackdrop.remove();
        modalWrapper.remove();
        modalContent.remove();
        modalTextArea.remove();
        modalSendBtn.remove();
        modalSendWrapper.remove();
        document.removeEventListener("keyup", handleEscape);
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
