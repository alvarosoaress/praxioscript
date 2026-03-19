function customMessageTextModal(elementId) {
    const body = document.querySelector("body");
    const scrollY = window.scrollY;

    body.style.overflow = "hidden";

    const modalBackdrop = document.createElement("div");
    const modalWrapper = document.createElement("div");
    const modalTextTitle = document.createElement("h2");
    const modalText = document.createElement("input");
    const modalConfirmBtn = document.createElement("button");

    modalBackdrop.style.top = scrollY + "px";
    modalBackdrop.classList.add("modalBackdrop");
    modalWrapper.classList.add("modalTextWrapper");
    modalText.classList.add("modalTextInput");
    modalConfirmBtn.classList.add("modalTextConfirmBtn");
    modalConfirmBtn.type = "button";

    modalConfirmBtn.innerHTML = `<span>Confirmar</span>`;

    modalText.placeholder = "Texto personalizado";
    modalTextTitle.innerText = "Adicionar Texto";

    body.appendChild(modalBackdrop);

    modalWrapper.appendChild(modalTextTitle);
    modalWrapper.appendChild(modalText);
    modalWrapper.appendChild(modalConfirmBtn);

    modalBackdrop.appendChild(modalWrapper);

    modalConfirmBtn.addEventListener("click", async () => {
        if (!modalText.value.trim()) {
            modalText.value = "";

            body.style.overflow = "auto";
            modalBackdrop.remove();
            return;
        }

        if (elementId) {
            const element = document.getElementById(elementId);
            element.innerText = modalText.value.trim();
            element.style.cursor = "pointer";

            body.style.overflow = "auto";
            modalBackdrop.remove();
            return;
        }

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

        if (event.key === "Enter" && (document.activeElement === modalText || document.activeElement === modalConfirmBtn)) {
            modalConfirmBtn.click();
        }
    });
}

