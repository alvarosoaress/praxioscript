function customMessageSelectModal(elementId, optionsArray) {
    const body = document.querySelector("body");
    const scrollY = window.scrollY;

    body.style.overflow = "hidden";

    const modalBackdrop = document.createElement("div");
    const modalWrapper = document.createElement("div");
    const modalTextTitle = document.createElement("h2");
    const modalSelect = document.createElement("select");
    const modalSelectConfirmBtn = document.createElement("button");

    optionsArray.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.text = option.text;
        modalSelect.appendChild(optionElement);
    });

    modalBackdrop.style.top = scrollY + "px";
    modalBackdrop.classList.add("modalBackdrop");
    modalWrapper.classList.add("modalTextWrapper");
    modalSelect.classList.add("modalSelect");
    modalSelectConfirmBtn.classList.add("modalTextConfirmBtn");
    modalSelectConfirmBtn.type = "button";

    modalSelectConfirmBtn.innerHTML = `<span>Confirmar</span>`;

    modalSelect.placeholder = "Opções";
    modalTextTitle.innerText = "Selecionar opção";

    body.appendChild(modalBackdrop);

    modalWrapper.appendChild(modalTextTitle);
    modalWrapper.appendChild(modalSelect);
    modalWrapper.appendChild(modalSelectConfirmBtn);

    modalBackdrop.appendChild(modalWrapper);

    modalSelectConfirmBtn.addEventListener("click", async () => {
        const selectedOption = optionsArray[modalSelect.selectedIndex];

        if (!modalSelect.value) {
            body.style.overflow = "auto";
            modalBackdrop.remove();
            return;
        }

        if (elementId) {
            const element = document.getElementById(elementId);
            element.innerText = selectedOption.text.trim();

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

        if (event.key === "Enter" && (document.activeElement === modalSelect || document.activeElement === modalSelectConfirmBtn)) {
            modalSelectConfirmBtn.click();
        }
    });
}

