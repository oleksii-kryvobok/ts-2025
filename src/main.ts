import { setupModal } from "./modules/modal.js";
import { setupHeaderOnScroll } from "./modules/header.js";
import { setupScrollAnimations } from "./modules/scrollAnimations.js";
import { fetchPostsAndRender } from "./modules/posts.js";

function init(): void {
  setupModal({
    modalSelector: "#myModal",
    openBtnSelector: "#openModal",
    closeBtnSelector: "#closeModal",
  });

  setupHeaderOnScroll("#header");
  setupScrollAnimations(".scroll-fade");
  fetchPostsAndRender();

  document.addEventListener("click", (e: Event): void => {
    const el = e.target as HTMLElement;
    if (el.closest(".track-click")) {
      console.log("Click tracked:", el.textContent?.trim());
    }
  });
}

document.addEventListener("DOMContentLoaded", init);