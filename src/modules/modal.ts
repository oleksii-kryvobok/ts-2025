import { $ } from "../utils/dom.js";

interface ModalOptions {
  modalSelector: string;
  openBtnSelector: string;
  closeBtnSelector?: string;
}

export function setupModal(options: ModalOptions): void {
  const modalEl = $(options.modalSelector);
  const openBtnEl = $(options.openBtnSelector);
  const closeBtnEl = options.closeBtnSelector ? $(options.closeBtnSelector) : null;

  if (!modalEl || !openBtnEl) return;

  const modal = modalEl as HTMLElement;
  const openBtn = openBtnEl as HTMLElement;
  const closeBtn = closeBtnEl as HTMLElement | null;

  function openModal(): void {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal(): void {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  openBtn.addEventListener("click", (e): void => {
    e.preventDefault();
    openModal();
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", (e): void => {
      e.preventDefault();
      closeModal();
    });
  }

  modal.addEventListener("click", (e): void => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e: KeyboardEvent): void => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
}