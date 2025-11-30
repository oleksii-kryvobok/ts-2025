import { $$ } from "../utils/dom.js";

export function setupScrollAnimations(selector = ".scroll-fade"): void {
  const items = $$(selector) as HTMLElement[];
  if (!items.length) return;

  function check(): void {
    const trigger = window.innerHeight * 0.85;

    for (const el of items) {
      const top = el.getBoundingClientRect().top;
      if (top < trigger) el.classList.add("visible");
    }
  }

  window.addEventListener("scroll", check, { passive: true });
  window.addEventListener("resize", check);
  check();
}