// =============================================================
// History Column — Injeta coluna de histórico no grid de tickets
// Usa GET /alltickets da API remote-portalNotify via fetch (CORS)
// =============================================================

// Cache singleton (mesmo padrão de _getSlaCache — function declaration
// para compartilhar entre @require files no sandbox do Tampermonkey)
function _getHistoryCache() {
  if (!_getHistoryCache._instance) {
    _getHistoryCache._instance = {
      data: null,       // array de ticket IDs com notas
      loading: false,
      error: null,
    };
  }
  return _getHistoryCache._instance;
}

/**
 * Busca lista de tickets que possuem notas.
 * Retorna array de strings (ticket numbers).
 */
async function _fetchTicketsWithHistory() {
  return fetch(`${API_URL}/alltickets`, {
    headers: { "Authorization": API_KEY },
  }).then(res => res.json());
}

/**
 * Carrega dados de tickets com histórico, com cache e deduplicação.
 */
async function loadHistoryData() {
  const cache = _getHistoryCache();

  if (cache.data) return cache;

  if (cache.loading) {
    return new Promise(resolve => {
      const check = setInterval(() => {
        if (!_getHistoryCache().loading) {
          clearInterval(check);
          resolve(_getHistoryCache());
        }
      }, 200);
    });
  }

  cache.loading = true;
  cache.error = null;

  try {
    const tickets = await _fetchTicketsWithHistory();
    cache.data = tickets || [];
    cache.loading = false;
    console.log(`[History] ${cache.data.length} tickets com notas carregados`);
    return cache;
  } catch (err) {
    cache.loading = false;
    cache.error = err.message;
    console.error("[History] Erro ao carregar dados:", err.message);
    throw err;
  }
}

// ======================== DOM INJECTION ========================

/**
 * Retorna a célula de referência para inserção da coluna de histórico.
 * Insere na posição 1 (após o checkbox, antes da primeira coluna de dados).
 */
function _getHistInsertRef(row) {
  const cells = row.children;
  return cells.length > 1 ? cells[1] : null;
}

/**
 * Cria um <td> marcado como coluna de histórico injetada.
 */
function _createHistCell(tag) {
  const td = document.createElement("td");
  td.setAttribute("data-hist-col", tag);
  return td;
}

/**
 * Extrai o número do ticket de uma data row do grid.
 * Usa o link <a href="/Ticket/TicketPrincipal/..."> como seletor robusto
 * (não depende de nth-child que muda com colunas injetadas).
 */
function _extractTicketNumberFromRow(row) {
  const link = row.querySelector("a[href*='/Ticket/TicketPrincipal/']");
  if (link) {
    return link.textContent.trim().replace(/\D/g, "");
  }
  return null;
}

/**
 * Injeta a coluna de histórico no grid DevExpress.
 * @param {string[]|null} ticketsWithHistory — array de ticket IDs com notas, null = loading
 */
function injectHistoryColumn(ticketsWithHistory) {
  const table = document.querySelector("#grdTicket_DXMainTable");
  if (!table) return;

  if (table.dataset.histColumnInjected === "true") return;
  table.dataset.histColumnInjected = "true";

  const isLoading = !ticketsWithHistory;

  // 1. Header Row
  const headerRow = document.querySelector("#grdTicket_DXHeadersRow0");
  if (headerRow) {
    const ref = _getHistInsertRef(headerRow);
    if (ref) {
      const th = _createHistCell("hist-header");
      th.className = ref.className;
      th.innerHTML = `<i class="fa fa-history" aria-hidden="true"></i>`;
      th.style.cssText = "min-width:40px; max-width:40px; text-align:center; padding:4px 2px;";
      headerRow.insertBefore(th, ref);
    }
  }

  // 2. Filter Row
  const filterRow = document.querySelector("#grdTicket_DXFilterRow");
  if (filterRow) {
    const ref = _getHistInsertRef(filterRow);
    if (ref) {
      const td = _createHistCell("hist-filter");
      td.className = ref.className;
      td.innerHTML = "&nbsp;";
      filterRow.insertBefore(td, ref);
    }
  }

  // 3. Arm Row (define larguras)
  const armRow = document.querySelector("tr.dxgvArm");
  if (armRow) {
    const ref = _getHistInsertRef(armRow);
    if (ref) {
      const td = _createHistCell("hist-arm");
      td.style.width = "40px";
      armRow.insertBefore(td, ref);
    }
  }

  // 4. Data Rows
  document.querySelectorAll("tr.dxgvDataRow_Metropolis").forEach(row => {
    const ref = _getHistInsertRef(row);
    if (!ref) return;

    const ticketNumber = _extractTicketNumberFromRow(row);

    const td = _createHistCell("hist-data");
    td.className = "truncated dxgv";
    td.style.cssText = "text-align:center; padding:2px 6px; white-space:nowrap;";

    if (isLoading) {
      td.innerHTML = '<span style="color:#999; font-size:11px;">...</span>';
    } else {
      const hasHistory = ticketNumber && ticketsWithHistory.includes(ticketNumber);

      const btn = document.createElement("button");
      btn.innerHTML = `<i class="fa fa-history" aria-hidden="true"></i>`;
      btn.classList = "histBtn";
      btn.type = "button";

      if (hasHistory) {
        btn.style.backgroundColor = "rgb(255, 210, 162)";
        btn.style.color = "rgb(0, 0, 0)";
      }

      if (ticketNumber) {
        btn.addEventListener("click", () => {
          btn.blur();
          historyModal(ticketNumber);
        });
      }

      td.appendChild(btn);
    }

    row.insertBefore(td, ref);
  });
}

// ======================== GRID HOOKS ========================

function _isHistGridHooked() {
  return !!_isHistGridHooked._done;
}

function hookHistoryGridCallbacks() {
  if (_isHistGridHooked._done) return;
  _isHistGridHooked._done = true;

  if (typeof grdTicket !== "undefined" && grdTicket && grdTicket.EndCallback) {
    grdTicket.EndCallback.AddHandler(function () {
      setTimeout(() => {
        injectHistoryColumn(_getHistoryCache().data);
      }, 50);
    });
    console.log("[History] Hook EndCallback registrado");
  } else {
    const container = document.querySelector("#dt_example");
    if (container) {
      let debounce = null;
      const observer = new MutationObserver(() => {
        if (debounce) clearTimeout(debounce);
        debounce = setTimeout(() => {
          const table = document.querySelector("#grdTicket_DXMainTable");
          if (table && table.dataset.histColumnInjected !== "true") {
            injectHistoryColumn(_getHistoryCache().data);
          }
        }, 100);
      });
      observer.observe(container, { childList: true, subtree: true });
      console.log("[History] MutationObserver registrado como fallback");
    }
  }
}

// ======================== ENTRY POINT (GRID) ========================

/**
 * Entry point para a coluna de histórico no grid.
 * Chamado por mainHistory() apenas na página do grid (não na página do ticket).
 */
async function initHistoryColumn() {
  // 1. Configurar hooks para re-injeção
  hookHistoryGridCallbacks();

  // 2. Buscar dados da API primeiro
  try {
    const cache = await loadHistoryData();

    // 3. Injetar coluna já com dados reais
    injectHistoryColumn(cache.data);
  } catch (err) {
    // Erro: injetar com array vazio (botões sem destaque)
    injectHistoryColumn([]);
    console.error("[History] Falha ao carregar dados:", err.message);
  }
}

// ======================== MAIN ========================

function mainHistory() {
  GM_addStyle(styles.mainHistory);

  keyBtn();

  // Na página do grid, usa injeção de coluna
  if (!document.getElementById("btnSeguir")) {
    initHistoryColumn();

    interceptNetworkRequests({
      onLoad: (data) => {
        if (
          data.currentTarget.responseURL.includes("ObterListaOrdenacao") ||
          data.currentTarget.responseURL.includes("ObterListaFiltro") ||
          data.currentTarget.responseURL.includes("IndexPartial")
        ) {
          setTimeout(() => {
            injectHistoryColumn(_getHistoryCache().data);
          }, 1);
        }
      },
    });
  } else {
    // Na página individual do ticket, mantém comportamento original
    historyButtonTicketPage();
  }
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
    let key = prompt("Digite a chave para realizar as requisições", "");

    if (key === null) return;

    if (key === "") {
      alert("Chave inválida");
      return;
    }

    if (key.at(key.length - 1) === "/") {
      key = key.slice(0, -1);
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

// ======================== TICKET PAGE (comportamento original) ========================

/**
 * Adiciona botão de histórico na página individual do ticket.
 * Mantém o comportamento original do historyButton() para a página /TicketPrincipal/.
 */
async function historyButtonTicketPage() {
  try {
    const cache = await loadHistoryData();
    const ticketsWithHistory = cache.data || [];

    const buttonsRow = document.getElementById("btnSeguir").parentElement;
    buttonsRow.style.display = "flex";
    buttonsRow.style.gap = "3px";
    buttonsRow.style.alignItems = "end";
    buttonsRow.style.flexWrap = "wrap";

    const ticketNumber = document
      .getElementById("TicketMlo_Protocolo")
      .value.replace(/\D/g, "");

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

    buttonsRow.prepend(customBtn);
  } catch (err) {
    console.error("[History] Erro ao carregar botão na página do ticket:", err.message);
  }
}

// ======================== MODAL ========================

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

    const msgList = await fetch(`${API_URL}/ticket/${ticketNumber}`, {
      headers: { "Authorization": API_KEY },
    }).then(
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
        headers: { "Content-Type": "application/json", "Authorization": API_KEY },
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
      // Invalidar cache para que ao fechar o modal, os tickets com notas
      // sejam re-carregados (caso o usuário tenha adicionado uma nota)
      _getHistoryCache().data = null;
      // Re-injetar coluna de histórico se estiver no grid
      if (!document.getElementById("btnSeguir")) {
        const table = document.querySelector("#grdTicket_DXMainTable");
        if (table) table.dataset.histColumnInjected = "false";
        document.querySelectorAll("[data-hist-col]").forEach(el => el.remove());
        initHistoryColumn();
      }
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
