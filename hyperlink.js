
let savedRange = null;

function saveCursorPosition() {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    savedRange = selection.getRangeAt(0);
  }
}

function restoreCursorPosition() {
  const selection = window.getSelection();
  if (savedRange) {
    selection.removeAllRanges();
    selection.addRange(savedRange);
  }
}


function insertLinkAtCursor(url, text) {
    if (savedRange) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedRange);
  
      const link = document.createElement('b');
      link.innerHTML = `<i><a href="${url}" target="_blank" style="cursor: pointer;"><font>${text}</font></a></i>`;
  
      savedRange.deleteContents();
      savedRange.insertNode(link);
  
      savedRange.setStartAfter(link);
      savedRange.setEndAfter(link);
      selection.removeAllRanges();
      selection.addRange(savedRange);
    }
  }
  
  function linkModal(elementId) {
    const body = document.querySelector("body");
    const scrollY = window.scrollY;
  
    body.style.overflow = "hidden";
  
    const modalBackdrop = document.createElement("div");
    const modalWrapper = document.createElement("div");
    const modalLinkTitle = document.createElement("h2");
    const modalLinkText = document.createElement("input");
    const modalLink = document.createElement("input");
    const modalConfirmBtn = document.createElement("button");
  
    modalBackdrop.style.top = scrollY + "px";
    modalBackdrop.classList.add("modalBackdrop");
    modalWrapper.classList.add("modalLinkWrapper");
    modalLinkText.classList.add("modalLinkInput");
    modalLink.classList.add("modalLinkInput");
    modalConfirmBtn.classList.add("modalLinkConfirmBtn");
    modalConfirmBtn.type = "button";
  
    modalConfirmBtn.innerHTML = `<span>Confirmar</span>`;
  
    modalLinkText.placeholder = "Texto do link";
    modalLink.placeholder = "Link";
  
    modalLinkTitle.innerText = "Adicionar Link";
  
    body.appendChild(modalBackdrop);
  
    modalWrapper.appendChild(modalLinkTitle);
    modalWrapper.appendChild(modalLinkText);
    modalWrapper.appendChild(modalLink);
    modalWrapper.appendChild(modalConfirmBtn);
    modalWrapper.appendChild(modalConfirmBtn);
  
    modalBackdrop.appendChild(modalWrapper);
  
    modalConfirmBtn.addEventListener("click", async () => {
      if (!modalLinkText.value.trim() || !modalLink.value.trim()) {
        modalLinkText.value = "";
  
        body.style.overflow = "auto";
        modalBackdrop.remove();
        return;
      }
  
      if(elementId){
        const element = document.getElementById(elementId);
        element.href = modalLink.value.trim();
        element.innerText = modalLinkText.value.trim();
        element.style.cursor = "pointer";
  
        body.style.overflow = "auto";
        modalBackdrop.remove();
        return;
      }
  
      restoreCursorPosition();
      insertLinkAtCursor(modalLink.value.trim(), modalLinkText.value.trim());
      body.style.overflow = "auto";
      modalBackdrop.remove();
      return;
    });
  
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) {
        body.style.overflow = "auto";
        modalBackdrop.remove();
      }
    });
  
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" || (event.key === "Esc" && modalBackdrop)) {
        body.style.overflow = "auto";
        modalBackdrop.remove();
      }
    });
  }