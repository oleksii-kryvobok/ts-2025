import { $$ } from "../utils/dom.js";
export function setupScrollAnimations(selector = ".scroll-fade") {
    const items = $$(selector);
    if (!items.length)
        return;
    function check() {
        const trigger = window.innerHeight * 0.85;
        for (const el of items) {
            const top = el.getBoundingClientRect().top;
            if (top < trigger)
                el.classList.add("visible");
        }
    }
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    check();
}
