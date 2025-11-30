import { setupModal } from "./modules/modal.js";
import { setupHeaderOnScroll } from "./modules/header.js";
import { setupScrollAnimations } from "./modules/scrollAnimations.js";
import { fetchPostsAndRender } from "./modules/posts.js";
function init() {
    setupModal({
        modalSelector: "#myModal",
        openBtnSelector: "#openModal",
        closeBtnSelector: "#closeModal",
    });
    setupHeaderOnScroll("#header");
    setupScrollAnimations(".scroll-fade");
    fetchPostsAndRender();
    document.addEventListener("click", (e) => {
        var _a;
        const el = e.target;
        if (el.closest(".track-click")) {
            console.log("Click tracked:", (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim());
        }
    });
}
document.addEventListener("DOMContentLoaded", init);
