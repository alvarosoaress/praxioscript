# CONTEXT.md -- praxioscript (Client-Side Userscript)

> Companion document to the server-side API docs.
> This file documents the **Tampermonkey userscript** that injects custom UI into the Praxio ticket portal.

---

## 1. Project Overview

**praxioscript** is a Tampermonkey userscript that enhances `portaldocliente.praxio.com.br` (a Praxio support ticket portal built on ASP.NET with DevExpress controls). It adds:

- **Grid page** (`/Ticket`) -- Custom injected columns (History, SLA, VOC), inline history buttons, file preview modals
- **Ticket page** (`/Ticket/TicketPrincipal/:id`) -- Copy buttons, message templates, SLA/VOC badges, company data tab, history notes, file preview modals, hyperlink insertion
- **Azure DevOps** (`dev.azure.com/praxio/Autumn/...`) -- Button linking back to the portal ticket

Authors: Calvaro, Breno, Vitor.

---

## 2. File Inventory

| File | Lines | Purpose |
|------|-------|---------|
| `utilsPraxio.user.js` | 236 | **Entry point / orchestrator**. Contains Tampermonkey metadata, page routing, `mainTicket()`, `ticketVars()`, `interceptNetworkRequests()` |
| `sla.user.js` | 440 | SLA & VOC column injection on grid; SLA/VOC badge on ticket page. API: `POST /sla` |
| `history.js` | 455 | History column injection on grid; history button + chat modal on ticket page. API: `GET /alltickets`, `GET /ticket/:n`, `POST /ticket` |
| `utils.user.js` | 1027 | Utility functions: file preview modals (image/video/PDF/DOCX/Excel/XML/TXT/SQL), empresa data tab, `createImagesView()`, `insertSLA()` |
| `css.js` | 499 | CSS styles object with keys `mainTicket`, `mainHistory`, `mainAlert`. Applied via `GM_addStyle()` |
| `customMessage.js` | 286 | Template message dropdown for ticket page editor. Pre-defined response templates |
| `customButton.js` | 127 | Copy buttons (title, number, phone, email), Azure search link, hyperlink button for ticket page |
| `azure.js` | 61 | Azure DevOps integration. Adds portal link button on work item pages |
| `hyperlink.js` | 120 | Link insertion modal with cursor position save/restore for rich text editor |
| `customMessageText.js` | 75 | Custom text input modal (used by customMessage for free-text placeholder replacement) |
| `customMessageSelect.js` | 81 | Custom select dropdown modal (used by customMessage for option-based placeholder replacement) |
| `alert.js` | 208 | Alert/notification feature -- **mostly commented out / WIP**, currently disabled in entry point |

---

## 3. Tampermonkey Configuration

### 3.1 Metadata Block (from `utilsPraxio.user.js`)

```
// @match   https://portaldocliente.praxio.com.br/Ticket*
// @match   https://dev.azure.com/praxio/Autumn/_sprints/taskboard/...
// @match   https://dev.azure.com/praxio/Autumn/_boards/board/*
// @run-at  document-idle
// @grant   GM_addStyle
```

External libraries loaded via `@require`:
- `xlsx.full.min.js` (SheetJS) -- Excel file parsing
- `mammoth.browser.min.js` -- DOCX to HTML conversion
- `waitForKeyElements.js` -- DOM polling utility

### 3.2 Local Development vs. Remote

The **published** `utilsPraxio.user.js` uses GitHub raw URLs for `@require`:
```
@require https://github.com/alvarosoaress/praxioscript/raw/master/sla.user.js
```

For **local development**, a separate `UtilsPraxioLocal.user.js` (installed in Tampermonkey) uses `file://` URLs:
```
@require file:///C:/dev/portalPraxio/praxioscript/sla.user.js
```

This allows editing files locally and seeing changes immediately on page refresh without pushing to GitHub.

### 3.3 Sandbox Mode (CRITICAL)

Because `@grant GM_addStyle` is present, Tampermonkey enables its **sandbox**. This has major implications:

- Each `@require` file is wrapped in its own function closure
- `var`, `let`, `const` declarations are **scoped to their file** and do NOT leak between files
- `window.*` assignments also fail because `window` is a Proxy in sandbox mode
- **Only `function` declarations are hoisted to the shared scope** between `@require` files

**Pattern for shared state between files** -- use function declarations with static properties (singleton pattern):
```js
// CORRECT: shared between @require files
function _getSlaCache() {
    if (!_getSlaCache._instance) {
        _getSlaCache._instance = { data: null, loading: false };
    }
    return _getSlaCache._instance;
}

// WRONG: confined to the file's closure
const slaCache = { data: null, loading: false };
var slaCache = { data: null, loading: false };
window.slaCache = { data: null, loading: false };
```

**Constants must also be functions**:
```js
// CORRECT
function _getSlaTeam() { return ["VITOR.OLIVEIRA", ...]; }

// WRONG
const SLA_TEAM = ["VITOR.OLIVEIRA", ...];
```

**Exception**: Variables that are only used within a single file (like `let savedRange = null` in `hyperlink.js`) can use normal declarations. The singleton pattern is only required for cross-file shared state.

**Another exception**: The `const styles = {...}` in `css.js` works because `styles` is technically accessible from the main IIFE in `utilsPraxio.user.js` and files loaded in the same execution context. Similarly, `const API_URL` at the top of `utilsPraxio.user.js` (outside the IIFE) is accessible to other files.

---

## 4. Execution Flow

### 4.1 Page Detection & Routing (`utilsPraxio.user.js:36-58`)

```
@run-at document-idle
        |
        v
const API_URL = localStorage.getItem("apiKey")?.slice(104)
        |
        v
IIFE starts
        |
        +---> page.ticket (/TicketPrincipal/) ?
        |         waitForKeyElements("#AdequacoesVinculadasRow_Nenhuma")
        |             -> mainTicket()
        |
        +---> page.home (portaldocliente) ?
        |         waitForKeyElements("#grdTicket")
        |             -> mainHistory()     <-- history column
        |             -> initSLAColumns()  <-- SLA/VOC columns
        |
        +---> else (Azure DevOps)
                  -> mainAzure()
```

### 4.2 Grid Page Flow

```
mainHistory() [history.js:246]
    |
    +---> GM_addStyle(styles.mainHistory)
    +---> initHistoryColumn()
    |         +---> hookHistoryGridCallbacks()
    |         +---> await loadHistoryData()  -- GET /alltickets
    |         +---> injectHistoryColumn(cache.data)
    +---> interceptNetworkRequests({ onLoad: ... })
    
initSLAColumns() [sla.user.js:424]
    |
    +---> hookGridCallbacks()
    +---> setupNetworkInterceptor()
    +---> await loadSLAData()  -- POST /sla
    +---> injectSLAColumns(cache.ticketMap)
```

**Order matters**: `mainHistory()` is called before `initSLAColumns()`, so the History column injects at position 1 first, then SLA/VOC inject at position 2 (which is now after the History column).

### 4.3 Ticket Page Flow

```
mainTicket() [utilsPraxio.user.js:61]
    |
    +---> GM_addStyle(styles.mainTicket)
    +---> ticketVars()  -- extracts client name, PSESIM numbers, etc.
    +---> customBtn()   -- copy buttons, Azure link, hyperlink button
    +---> customMessage() -- template message dropdown
    +---> historyButtonTicketPage() -- history button

utils.user.js self-executing IIFE [line 1019]:
    |
    +---> createTabEmpresa() -- empresa data tab (with null guard)
    +---> createTabButton()  -- tab navigation button
    +---> createImagesView() -- inline file previews
    +---> insertSLA()        -- SLA/VOC badge near ticket header
```

### 4.4 Azure DevOps Flow

```
mainAzure() [azure.js:1]
    |
    +---> interceptNetworkRequests({ onLoad: ... })
              when dataProviders response detected:
                  -> waitForKeyElements('[aria-label="Description"]')
                      -> azureVars()  -- extract ticket number regex from description/criteria
                      -> azureCustomBtn(ticket)  -- add portal link button
```

---

## 5. DevExpress Grid Integration

### 5.1 Grid Structure

The portal uses **DevExpress ASPxGridView** (`#grdTicket`). Key selectors:

| Selector | Purpose |
|----------|---------|
| `#grdTicket_DXMainTable` | Main table element |
| `#grdTicket_DXHeadersRow0` | Header row |
| `#grdTicket_DXFilterRow` | Filter input row |
| `tr.dxgvArm` | Invisible "arm" row that defines column widths |
| `tr.dxgvDataRow_Metropolis` | Data rows (one per ticket) |
| `a[href*='/Ticket/TicketPrincipal/']` | Links in data rows used to extract ticket IDs |

### 5.2 Grid Rebuild Behavior

The grid **destroys and recreates ALL HTML** on every AJAX callback:
- Filtering
- Pagination
- Sorting
- Any server-side grid operation

This means injected columns disappear and must be re-injected after each rebuild.

### 5.3 Re-injection Hooks (3 mechanisms)

1. **`grdTicket.EndCallback.AddHandler()`** (primary) -- DevExpress client-side event
2. **`MutationObserver`** on `#dt_example` (fallback) -- if `grdTicket` JS object not available
3. **Network interceptors** on `fetch`/`XMLHttpRequest` -- monitors portal AJAX URLs:
   - `/Ticket/PesquisaPartial`
   - `/Ticket/ObterListaFiltro`
   - `/Ticket/ObterListaPaginacao`
   - `/Ticket/ObterListaOrdenacao`
   - `/Ticket/indexPartial`

Both `history.js` and `sla.user.js` register their own independent hooks.

### 5.4 The `dxgv` Class Constraint (CRITICAL)

**DO NOT add class `dxgv` to injected `<td>` elements in data rows.**

DevExpress internally uses the `dxgv` class to map cells by column index. Adding `dxgv` to injected cells shifts the mapping and corrupts the display of native columns (wrong data appears in wrong columns).

Current behavior: `tdSLA.className = "truncated dxgv"` and `tdVOC.className = "truncated dxgv"` in `sla.user.js:281-282` and `td.className = "truncated dxgv"` in `history.js:153` -- **these lines include `dxgv` which may cause issues**. If column corruption is observed, remove `dxgv` from injected data cells.

Header and filter cells CAN safely copy the `className` from the adjacent reference cell (which already has the correct DevExpress classes).

### 5.5 Column Injection Pattern (4-Row Pattern)

All injected columns follow this structure:

```
1. Header Row  (#grdTicket_DXHeadersRow0)  -- column title text/icon
2. Filter Row  (#grdTicket_DXFilterRow)    -- empty &nbsp; cell
3. Arm Row     (tr.dxgvArm)               -- width-defining invisible cell
4. Data Rows   (tr.dxgvDataRow_Metropolis) -- actual content per ticket
```

Each injection function:
- Checks a `table.dataset.*Injected` flag to prevent double-injection
- Sets the flag to `"true"` immediately
- Uses `data-*` attributes (`data-sla-col`, `data-hist-col`) to mark injected cells for cleanup
- Uses `insertBefore(newCell, referenceCell)` for positioning

### 5.6 Column Order After Injection

| Position | Column | Source |
|----------|--------|--------|
| 0 | Checkbox | DevExpress native |
| 1 | **History** (icon button) | `history.js` -- inserts at `children[1]` |
| 2 | **SLA** (time value) | `sla.user.js` -- inserts at `children[2]` |
| 3 | **VOC** (time value) | `sla.user.js` -- inserts at `children[2]` (pushes after SLA) |
| 4+ | Native data columns | DevExpress |

---

## 6. API Integration

The API base URL is extracted from localStorage:
```js
const API_URL = localStorage.getItem("apiKey").slice(104);
```

### 6.1 Endpoints Used

| Endpoint | Method | Used By | Purpose |
|----------|--------|---------|---------|
| `/sla` | POST | `sla.user.js` | Get SLA/VOC data for all team tickets. Body: `{ team: string[] }` |
| `/alltickets` | GET | `history.js` | Get list of ticket numbers that have history notes |
| `/ticket/:number` | GET | `history.js` | Get message list for a specific ticket |
| `/ticket` | POST | `history.js` | Send a new message. Body: `{ ticket, message, sender }` |

All API calls use native `fetch()` with CORS enabled on the server.

### 6.2 SLA Data Flow

```
fetchSLAData() -> POST /sla { team: [...] }
    response: { tickets: [ { id, slaFormatted, slaMinutes, vocFormatted, vocMinutes } ], cached, processedAt }
    -> stored in _getSlaCache() as { data: [], ticketMap: Map<id, ticket> }
    -> injectSLAColumns(ticketMap) uses Map.get(ticketId) per row
```

Color coding:
- **SLA**: green < 2h, blue < 8h, red >= 8h
- **VOC**: green < 2d, blue < 4d, red >= 4d

### 6.3 History Data Flow

```
_fetchTicketsWithHistory() -> GET /alltickets
    response: string[]  (ticket numbers with notes)
    -> stored in _getHistoryCache().data
    -> injectHistoryColumn(data) highlights buttons for tickets with notes (orange bg)

historyModal(ticketNumber):
    -> GET /ticket/:number  -> message list
    -> POST /ticket { ticket, message, sender }
    -> on close: invalidates cache, removes injected column, re-injects
```

### 6.4 Cache Patterns

Both `_getSlaCache()` and `_getHistoryCache()` use the same pattern:
- `data`: fetched payload (null until loaded)
- `loading`: boolean dedup flag
- `error`: last error message
- `fetchedAt` (SLA only): timestamp
- `ticketMap` (SLA only): `Map<string, object>` for O(1) lookup

Loading deduplication: if `cache.loading === true`, a second caller polls every 200ms until loading completes, then resolves with the cached data.

---

## 7. Ticket Page Features

### 7.1 Copy Buttons (`customButton.js`)

Injected into `#abasTicketPrincipal` (tab nav):
- **Copy Title** -- copies ticket title to clipboard
- **Copy Number** -- copies ticket protocol number
- **Azure** -- opens Azure DevOps search for linked work items (uses all PSESIM numbers)
- **Copy phone/email** -- small clipboard buttons next to contact fields
- **Link button** -- adds hyperlink insertion button to the rich text editor toolbar

### 7.2 Template Messages (`customMessage.js`)

A `<select>` dropdown appended to `#cabecalhoTramite` with pre-defined response templates:
- Product: "Em Analise", "Fila de desenvolvimento"
- Test: "Inicio", "Finalizado SIGA/LUNA"
- Version: "Local", "Nuvem"
- Returns: "Em validacao", "Email para Conclusao"
- Release LUNA
- Service: "Usuario AutoSky", "Atualizacao de modulo"

Each option has:
- `value`: HTML template text (uses `ticketClient`, `nextMonth`, `ticketPSESIM`, etc.)
- `situation`: auto-clicks the corresponding status button (Em andamento, Pendente Cliente, etc.)
- `link` (optional): opens `linkModal()` for URL input
- `custom` + `options` (optional): opens `customMessageSelectModal()` or `customMessageTextModal()`

### 7.3 Hyperlink Modal (`hyperlink.js`)

Uses cursor save/restore pattern:
1. `saveCursorPosition()` -- saves current selection range before modal opens
2. Modal collects link URL and display text
3. `restoreCursorPosition()` + `insertLinkAtCursor()` -- restores cursor and injects `<b><i><a>` HTML

Can also work with a target `elementId` (for template message links).

### 7.4 File Preview Modals (`utils.user.js`)

`createImagesView()` polls for `.anexosTramite` buttons, fetches attachment lists per tramite, and renders inline previews + click-to-open modals:

| Format | Modal Function | Features |
|--------|---------------|----------|
| Images (jpg/png/gif/webp) | `abrirModalImagem()` | Zoom (scroll wheel), pan (drag), no ghost-drag |
| Video (mp4/webm/mov/ogg) | `abrirModalVideo()` | Autoplay, controls |
| PDF | `abrirModalPDF()` | iframe with blob URL |
| DOCX | `abrirModalDOCX()` | mammoth.js HTML conversion |
| Excel (xlsx/xls) | `abrirModalExcel()` | SheetJS HTML table rendering |
| XML | `abrirModalXML()` | Formatted XML with syntax coloring |
| TXT/SQL | `abrirModalTXT()` | Pre-formatted text with zoom/copy buttons |

All modals: close on backdrop click or Escape key.

### 7.5 Empresa Data Tab (`utils.user.js`)

`createTabEmpresa()` fetches company data from `portal-livid-five.vercel.app` API using the client name from `#sinalizadorCliente`. Renders: nome fantasia, banco, IP banco, URL servico, nome portal, sites list, POS devices list.

Has a **null guard** on `#tabCliente` since this element only exists on the ticket page, not the grid page. The IIFE at the bottom of `utils.user.js` runs on both pages.

### 7.6 SLA/VOC Badge (`sla.user.js:insertSLABadge()`)

On the ticket page, inserts colored SLA and VOC text spans before `#btnIA`:
```
SLA: 01:30  (green)  |  VOC: 3d 2h  (blue)
```

---

## 8. CSS Architecture (`css.js`)

The `styles` object has three keys:

| Key | Applied By | Context |
|-----|-----------|---------|
| `mainTicket` | `mainTicket()` via `GM_addStyle()` | Ticket page |
| `mainHistory` | `mainHistory()` via `GM_addStyle()` | Grid page |
| `mainAlert` | `mainAlert()` via `GM_addStyle()` | Alert feature (disabled) |

CSS classes defined include: `.histBtn`, `.copyBtnStyle`, `.azureBtnStyle`, `.selectDefaultTextStyle`, `.selectTopic`, `.modalBackdrop`, `.modalWrapper`, `.modalContent`, `.modalMsg`, `.modalMsgOther`, `.modalMsgInfo`, `.modalTextArea`, `.modalSendBtn`, `.modalLinkWrapper`, `.modalLinkInput`, `.modalTextWrapper`, `.modalTextInput`, `.modalSelectConfirmBtn`, `.alertBtn`, `.alertListContainer`.

Note: Some classes are duplicated between `mainTicket` and `mainHistory` (e.g. `.histBtn`, `.modalBackdrop`) because each context applies only one stylesheet.

---

## 9. Known Constraints & Gotchas

1. **Sandbox scoping** -- See section 3.3. All shared state MUST use function declaration + static property singleton. `const`/`let`/`var`/`window.*` will NOT work across files.

2. **`dxgv` class breaks grid** -- See section 5.4. Never add `dxgv` to injected cells if it breaks column mapping.

3. **Grid destroys HTML on AJAX** -- All injected DOM is lost. Must re-inject via hooks (section 5.3).

4. **Injection order matters** -- History inserts at position 1, then SLA/VOC at position 2. If the order in `utilsPraxio.user.js` changes, column positions will shift.

5. **No server-side sort/filter/export** for injected columns -- They are purely visual; DevExpress server-side operations ignore them.

6. **`MutationObserver` + remove cycle** -- Removing `[data-sla-col]` or `[data-hist-col]` elements triggers the MutationObserver which tries to re-inject. The current design avoids this by fetching data first, then injecting once (no remove+re-inject on initial load).

7. **`createTabEmpresa()` null guard** -- `#tabCliente` doesn't exist on the grid page. The IIFE in `utils.user.js` runs on all pages, so the function must bail early if the element is missing.

8. **History modal cache invalidation** -- When the history modal closes, it sets `_getHistoryCache().data = null`, removes all `[data-hist-col]` elements, sets `table.dataset.histColumnInjected = "false"`, and calls `initHistoryColumn()` to re-fetch and re-inject (in case the user added a note).

9. **`alert.js` is disabled** -- The `@require` line is commented out in `utilsPraxio.user.js`, and calls to `mainAlert()` and `alertBtnHome()` are also commented out. The file itself is mostly commented-out code.

10. **API URL extraction** -- `localStorage.getItem("apiKey").slice(104)` extracts the base URL from a longer stored string. If the apiKey format changes, this offset must be updated.

---

## 10. Development Workflow

1. Edit files in `C:\dev\portalPraxio\praxioscript\`
2. Save file
3. Refresh the portal page in the browser (Tampermonkey re-reads `file://` requires on page load)
4. Check browser DevTools console for `[SLA]` and `[History]` log messages
5. To publish: push to `master` branch on GitHub (`alvarosoaress/praxioscript`)

### Debugging Tips

- Console logs are prefixed: `[SLA]`, `[History]`
- Data rows have `data-sla-col` and `data-hist-col` attributes for inspection
- `_getSlaCache()` and `_getHistoryCache()` can be called from the console (they're global function declarations)
- `table.dataset.slaColumnsInjected` and `table.dataset.histColumnInjected` show injection state

---

## 11. Relationship to Server-Side API

The server-side API is documented in the companion `CONTEXT-SCRIPT.md` (in the `remote-portalNotify` project). Key points:

- The API scrapes the portal for ticket data, calculates SLA/VOC times, and serves them via REST endpoints
- CORS is enabled so the userscript's `fetch()` calls work cross-origin
- The `/sla` endpoint accepts a `team` array and returns SLA/VOC data only for tickets assigned to those team members
- The `/alltickets` and `/ticket/:n` endpoints manage internal team notes (not visible to clients)
