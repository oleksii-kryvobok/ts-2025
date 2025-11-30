import { $ } from "../utils/dom.js";
export function setupHeaderOnScroll(selector = "#header") {
    const header = $(selector);
    if (!header)
        return;
    const onScroll = () => {
        if (window.scrollY > 80)
            header.classList.add("alt");
        else
            header.classList.remove("alt");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
}
