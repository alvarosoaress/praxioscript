function mainHistory() {
  GM_addStyle(styles.mainHistory);

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
    res.json(),
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
    const modalHTML = `
      <div class="modalBackdrop" style="top: ${scrollY}px;">
        <div class="modalWrapper">
          <div class="modalContent">
            <span style="text-align:center; color:#ff88004a">Carregando...</span>
          </div>
          <div class="modalSendWrapper">
            <textarea class="modalTextArea"></textarea>
            <button class="modalSendBtn" type="button">
              <i class="fa fa-paper-plane" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modalBackdrop = document.querySelector(".modalBackdrop");
    const modalTextArea = document.querySelector(".modalTextArea");
    const modalSendBtn = document.querySelector(".modalSendBtn");

    const msgList = await fetch(`${API_URL}/ticket/${ticketNumber}`).then(
      (res) => res.json(),
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
    });

    renderMessages(msgList, userLogged);

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
      historyButton();
    }
  } catch (error) {
    console.log(error);
  }
}

function renderMessages(msgList, userLogged) {
  const modalContent = document.querySelector(".modalContent");

  modalContent.innerHTML = "";

  if (!msgList.length) {
    modalContent.innerHTML = `<span style="text-align: center; color: #cdcbcb"
  >Nenhuma mensagem encontrada</span
>`;
    return;
  }

  msgList.forEach((msg) => {
    const modalMsgWrapper = document.createElement("div");
    const modalMsgInfo = document.createElement("span");
    const modalMsg = document.createElement("div");

    modalMsgWrapper.classList.add("modalMsgWrapper");
    modalMsgInfo.classList.add("modalMsgInfo");
    modalMsg.classList.add(
      userLogged === msg.sender ? "modalMsg" : "modalMsgOther",
    );

    modalMsgWrapper.style.alignItems =
      userLogged === msg.sender
        ? (modalMsg.style.alignSelf = "flex-end")
        : (modalMsg.style.alignSelf = "flex-start");

    modalMsg.innerText = `${msg.message}`;

    modalMsgInfo.innerHTML = ` ${msg.sender} <br />
 ${new Date(msg.date).toLocaleString()}`;
    modalMsgInfo.style.textAlign =
      userLogged === msg.sender ? "right" : "flex-left";

    modalMsgWrapper.appendChild(modalMsgInfo);
    modalMsgWrapper.appendChild(modalMsg);
    modalContent.appendChild(modalMsgWrapper);
  });

  modalContent.scrollTop = modalContent.scrollHeight;
}
