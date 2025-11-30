import { $ } from "../utils/dom.js";
export function setupModal(options) {
    const modalEl = $(options.modalSelector);
    const openBtnEl = $(options.openBtnSelector);
    const closeBtnEl = options.closeBtnSelector ? $(options.closeBtnSelector) : null;
    if (!modalEl || !openBtnEl)
        return;
    const modal = modalEl;
    const openBtn = openBtnEl;
    const closeBtn = closeBtnEl;
    function openModal() {
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }
    function closeModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }
    openBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
    });
    if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            closeModal();
        });
    }
    modal.addEventListener("click", (e) => {
        if (e.target === modal)
            closeModal();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open"))
            closeModal();
    });
}
