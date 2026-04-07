// =============================================================
// SLA & VOC Columns — Injeta colunas SLA e VOC no grid de tickets
// Usa POST /sla da API remote-portalNotify via fetch (CORS)
// =============================================================

function _getSlaTeam() {
    return [
        //LUNA
        "VITOR.OLIVEIRA",
        "AURORA.SIMONELLI",
        "MATHEUS.SANTOS",
        "ELISMAR.SILVA",
        "ELISMAR",
        "BRENO.AUGUSTO",
        "JONATAS.BARBOSA",
        "ALEX.REZENDE",
        "CASSIO.AMANCIO",
        "FABRICIO.GHORAYEB",
        "WANDERSON.JUNIOR",

        //SIGA
        "PEDRO.JORDAO",
        "PEDRO.MACIEL",
        "EMERSON.ROSA",
        "RAFAEL.ROCHA",
        "RONALDO.REIS",
        "VICTOR.SOUZA",
        "HEILBUTH",
        "ALAN.BAXTER",
        "MATHEUS.SILVA",
        "FELIPE.DIAS",
        "RAFAEL.SILVA",
        "ADILSON.MONTES",
        "CLEONE.CEZAR",
        "GUSTAVO.SOARES",
        "RAFAEL.BASTOS",
        "VICTOR.SOUSA",
        "RONALDO.REIS",
        "MARCOS.SILVA",
        "DEYMERSON.MOREIRA",
        "ANA.PAIXÃO",
        "ITALO.THIAGO",
        "JEFFERSON.EMANOEL",
    ];
}

// Cache em memória (sobrevive a re-renders do grid, mas não a refresh de página)
// Encapsulado em function porque o Tampermonkey isola cada @require em uma closure,
// então var/let/const não são compartilhados. function declarations sim.
function _getSlaCache() {
    if (!_getSlaCache._instance) {
        _getSlaCache._instance = {
            data: null,       // array de tickets com SLA/VOC
            ticketMap: null,   // Map<ticketId, ticket> para lookup rápido
            fetchedAt: null,
            loading: false,
            error: null,
        };
    }
    return _getSlaCache._instance;
}

// ======================== API FETCH ========================

function _getSlaApiUrl() {
    const raw = localStorage.getItem("apiKey");
    if (!raw) return null;
    return raw.slice(104)
}

/**
 * Faz POST /sla via fetch (CORS habilitado no servidor).
 * Retorna Promise<{ tickets: [], cached: boolean, processedAt: string }>
 */
async function fetchSLAData() {
    const baseUrl = _getSlaApiUrl();
    if (!baseUrl) {
        throw new Error("apiKey não encontrada no localStorage");
    }

    const url = `${baseUrl}/sla`;

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": API_KEY },
        body: JSON.stringify({ team: _getSlaTeam() }),
        signal: AbortSignal.timeout(120000),
    });

    const json = await response.json();

    if (!response.ok) {
        throw new Error(`API retornou HTTP ${response.status}: ${json.error || JSON.stringify(json)}`);
    }

    return json;
}

/**
 * Busca dados SLA da API e armazena no cache em memória.
 * Se já há dados em cache, retorna imediatamente.
 * Se já está carregando, aguarda a conclusão.
 */
async function loadSLAData() {
    const cache = _getSlaCache();

    if (cache.data) {
        return cache;
    }

    if (cache.loading) {
        return new Promise((resolve) => {
            const check = setInterval(() => {
                if (!_getSlaCache().loading) {
                    clearInterval(check);
                    resolve(_getSlaCache());
                }
            }, 200);
        });
    }

    cache.loading = true;
    cache.error = null;

    try {
        const response = await fetchSLAData();
        const tickets = response.tickets || [];

        const ticketMap = new Map();
        tickets.forEach(t => {
            if (t.id) ticketMap.set(String(t.id), t);
        });

        cache.data = tickets;
        cache.ticketMap = ticketMap;
        cache.fetchedAt = new Date();
        cache.loading = false;

        console.log(`[SLA] ${tickets.length} tickets carregados (cached=${response.cached || false})`);
        return cache;
    } catch (err) {
        cache.loading = false;
        cache.error = err.message;
        console.error("[SLA] Erro ao carregar dados:", err.message);
        throw err;
    }
}

// ======================== COLOR HELPERS ========================

function _slaColor(minutes) {
    if (minutes == null) return "#999";
    if (minutes <= 480) return "#2e7d32";    // verde   — < 8h
    if (minutes > 480 && minutes < 1440) return "#1565c0";    // azul    — < 1d
    return "#c62828";                        // vermelho — >= 1d
}

function _vocColor(minutes) {
    if (minutes == null) return "#999";
    if (minutes < 1440) return "#2e7d32";     // verde  — < 1d
    if (minutes < 4320) return "#1565c0";    // azul   — < 3d
    return "#c62828";                        // vermelho — >= 3d
}

// ======================== DOM INJECTION ========================

function _extractTicketIdFromRow(row) {
    const link = row.querySelector("a[href*='/Ticket/TicketPrincipal/']");
    if (link) {
        const match = link.href.match(/TicketPrincipal\/(\d+)/);
        return match ? match[1] : null;
    }
    const cell = row.childNodes[2];
    if (cell) {
        const aTag = cell.querySelector ? cell.querySelector("a") : null;
        if (aTag && aTag.href) {
            const match = aTag.href.match(/TicketPrincipal\/(\d+)/);
            return match ? match[1] : null;
        }
    }
    return null;
}

/**
 * Remove todas as células SLA/VOC previamente injetadas.
 */
function _removeInjectedColumns() {
    document.querySelectorAll("[data-sla-col]").forEach(el => el.remove());
    const table = document.querySelector("#grdTicket_DXMainTable");
    if (table) table.dataset.slaColumnsInjected = "false";
}

/**
 * Cria um <td> marcado como injetado.
 */
function _createCell(tag) {
    const td = document.createElement("td");
    td.setAttribute("data-sla-col", tag);
    return td;
}

/**
 * Retorna a célula de referência para inserção nas colunas SLA/VOC.
 * Insere APÓS a 2ª célula visível (após a coluna "Solicitante"),
 * ou seja, antes de childNodes[2] (0-indexed: checkbox, solicitante, → aqui).
 * INSERT_POSITION = índice do childNode antes do qual inserir.
 */
function _getInsertRef(row) {
    // Inserir após a 1ª coluna de dados (índice 2 = 3ª célula)
    const cells = row.children;
    return cells.length > 2 ? cells[2] : null;
}

/**
 * Injeta as colunas SLA e VOC no grid DevExpress.
 * @param {Map<string, object>|null} ticketMap — null = loading state
 */
function injectSLAColumns(ticketMap) {
    const table = document.querySelector("#grdTicket_DXMainTable");
    if (!table) return;

    if (table.dataset.slaColumnsInjected === "true") return;
    table.dataset.slaColumnsInjected = "true";

    const isLoading = !ticketMap;

    // 1. Header Row
    const headerRow = document.querySelector("#grdTicket_DXHeadersRow0");
    if (headerRow) {
        const ref = _getInsertRef(headerRow);
        if (ref) {
            const thSLA = _createCell("sla-header");
            thSLA.className = ref.className;
            thSLA.textContent = "SLA";
            thSLA.style.cssText = "min-width:85px; text-align:center; font-weight:bold; padding:4px 6px;";
            headerRow.insertBefore(thSLA, ref);

            const thVOC = _createCell("voc-header");
            thVOC.className = ref.className;
            thVOC.textContent = "VOC";
            thVOC.style.cssText = "min-width:85px; text-align:center; font-weight:bold; padding:4px 6px;";
            headerRow.insertBefore(thVOC, ref);
        }
    }

    // 2. Filter Row
    const filterRow = document.querySelector("#grdTicket_DXFilterRow");
    if (filterRow) {
        const ref = _getInsertRef(filterRow);
        if (ref) {
            const tdF1 = _createCell("sla-filter");
            tdF1.className = ref.className;
            tdF1.innerHTML = "&nbsp;";
            filterRow.insertBefore(tdF1, ref);

            const tdF2 = _createCell("voc-filter");
            tdF2.className = ref.className;
            tdF2.innerHTML = "&nbsp;";
            filterRow.insertBefore(tdF2, ref);
        }
    }

    // 3. Arm Row (define larguras)
    const armRow = document.querySelector("tr.dxgvArm");
    if (armRow) {
        const ref = _getInsertRef(armRow);
        if (ref) {
            const tdA1 = _createCell("sla-arm");
            tdA1.style.width = "85px";
            armRow.insertBefore(tdA1, ref);

            const tdA2 = _createCell("voc-arm");
            tdA2.style.width = "85px";
            armRow.insertBefore(tdA2, ref);
        }
    }

    // 4. Data Rows
    document.querySelectorAll("tr.dxgvDataRow_Metropolis").forEach(row => {
        const ref = _getInsertRef(row);
        if (!ref) return;

        const ticketId = _extractTicketIdFromRow(row);
        const ticket = ticketId && ticketMap ? ticketMap.get(ticketId) : null;

        // Coluna SLA
        const tdSLA = _createCell("sla-data");
        tdSLA.className = "truncated dxgv";
        tdSLA.style.cssText = "text-align:center; padding:2px 6px; white-space:nowrap;";

        if (isLoading) {
            tdSLA.innerHTML = '<span style="color:#999; font-size:11px;">...</span>';
        } else if (ticket) {
            const slaText = ticket.slaFormatted || "-";
            const color = _slaColor(ticket.slaMinutes);
            tdSLA.innerHTML = `<span style="color:${color}; font-weight:600; font-size:12px;">${slaText}</span>`;
        } else {
            tdSLA.innerHTML = '<span style="color:#bbb; font-size:11px;">-</span>';
        }
        row.insertBefore(tdSLA, ref);

        // Coluna VOC
        const tdVOC = _createCell("voc-data");
        tdVOC.className = "truncated dxgv";
        tdVOC.style.cssText = "text-align:center; padding:2px 6px; white-space:nowrap;";
        if (isLoading) {
            tdVOC.innerHTML = '<span style="color:#999; font-size:11px;">...</span>';
        } else if (ticket) {
            const vocText = ticket.vocFormatted || "-";
            const color = _vocColor(ticket.vocMinutes);
            tdVOC.innerHTML = `<span style="color:${color}; font-weight:600; font-size:12px;">${vocText}</span>`;
        } else {
            tdVOC.innerHTML = '<span style="color:#bbb; font-size:11px;">-</span>';
        }
        row.insertBefore(tdVOC, ref);
    });
}

// ======================== GRID HOOKS ========================

function _isGridHooked() {
    return !!_isGridHooked._done;
}

function hookGridCallbacks() {
    if (_isGridHooked._done) return;
    _isGridHooked._done = true;

    if (typeof grdTicket !== "undefined" && grdTicket && grdTicket.EndCallback) {
        grdTicket.EndCallback.AddHandler(function () {
            setTimeout(() => {
                injectSLAColumns(_getSlaCache().ticketMap);
            }, 50);
        });
        console.log("[SLA] Hook EndCallback registrado");
    } else {
        const container = document.querySelector("#dt_example");
        if (container) {
            let debounce = null;
            const observer = new MutationObserver(() => {
                if (debounce) clearTimeout(debounce);
                debounce = setTimeout(() => {
                    const table = document.querySelector("#grdTicket_DXMainTable");
                    if (table && table.dataset.slaColumnsInjected !== "true") {
                        injectSLAColumns(_getSlaCache().ticketMap);
                    }
                }, 100);
            });
            observer.observe(container, { childList: true, subtree: true });
            console.log("[SLA] MutationObserver registrado como fallback");
        }
    }
}

// ======================== NETWORK INTERCEPTOR ========================

function setupNetworkInterceptor() {
    const TARGET_URLS = [
        "/Ticket/PesquisaPartial",
        "/Ticket/ObterListaFiltro",
        "/Ticket/ObterListaPaginacao",
        "/Ticket/ObterListaOrdenacao",
        "/Ticket/indexPartial",
    ];

    function matchUrl(url) {
        return typeof url === "string" &&
            TARGET_URLS.some(endpoint => url.includes(endpoint));
    }

    function onMatch() {
        setTimeout(() => {
            const table = document.querySelector("#grdTicket_DXMainTable");
            if (table && table.dataset.slaColumnsInjected !== "true") {
                injectSLAColumns(_getSlaCache().ticketMap);
            }
        }, 300);
    }

    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        const url = typeof args[0] === "string" ? args[0] : args[0]?.url;
        if (matchUrl(url)) onMatch();
        return originalFetch.apply(this, args);
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        if (matchUrl(url)) onMatch();
        return originalOpen.call(this, method, url, ...rest);
    };
}

// ======================== SLA NA PÁGINA DO TICKET ========================

async function insertSLABadge() {
    const currentUrl = window.location.href;
    if (!currentUrl.includes("/Ticket/TicketPrincipal/")) return;

    const idTicket = currentUrl.split("/Ticket/TicketPrincipal/")[1]?.replace("#", "");
    if (!idTicket) return;

    try {
        const cache = await loadSLAData();
        const ticket = cache.ticketMap ? cache.ticketMap.get(String(idTicket)) : null;
        if (!ticket) return;

        const btnIA = document.querySelector("#btnIA");
        if (!btnIA) return;

        if (ticket.slaFormatted && ticket.slaFormatted !== "Erro") {
            const slaSpan = document.createElement("span");
            slaSpan.style.cssText = `margin-right: 10px; font-size: 14px; color: ${_slaColor(ticket.slaMinutes)}; font-weight: bold; order: -1;`;
            slaSpan.textContent = `SLA: ${ticket.slaFormatted}`;
            btnIA.parentNode.insertBefore(slaSpan, btnIA);
        }

        if (ticket.vocFormatted && ticket.vocFormatted !== "N/A") {
            const vocSpan = document.createElement("span");
            vocSpan.style.cssText = `margin-right: 15px; font-size: 14px; color: ${_vocColor(ticket.vocMinutes)}; font-weight: bold; order: -1;`;
            vocSpan.textContent = `VOC: ${ticket.vocFormatted}`;
            btnIA.parentNode.insertBefore(vocSpan, btnIA);
        }
    } catch (err) {
        console.error("[SLA] Erro ao inserir badge no ticket:", err.message);
    }
}

// ======================== ENTRY POINT (GRID) ========================

async function initSLAColumns() {
    // 1. Configurar hooks para re-injeção (precisam estar ativos antes do fetch)
    hookGridCallbacks();
    setupNetworkInterceptor();

    // 2. Buscar dados da API primeiro
    try {
        const cache = await loadSLAData();

        // 3. Injetar colunas já com dados reais
        injectSLAColumns(cache.ticketMap);
    } catch (err) {
        // Erro: injetar com Map vazio (mostra "-")
        injectSLAColumns(new Map());
        console.error("[SLA] Falha ao carregar dados SLA/VOC:", err.message);
    }
}
