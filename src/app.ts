interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const $ = <T extends Element = Element>(
  selector: string,
  parent: ParentNode = document
): T | null => parent.querySelector(selector) as T | null;

const $$ = <T extends Element = Element>(
  selector: string,
  parent: ParentNode = document
): T[] => Array.from(parent.querySelectorAll(selector)) as T[];

function setupModal(options: {
  modalSelector: string;
  openBtnSelector: string;
  closeBtnSelector?: string;
}): void {
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

  openBtn.addEventListener("click", (e: Event): void => {
    e.preventDefault();
    openModal();
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", (e: Event): void => {
      e.preventDefault();
      closeModal();
    });
  }

  modal.addEventListener("click", (e: Event): void => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e: KeyboardEvent): void => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
}

function setupHeaderOnScroll(headerSelector = "#header"): void {
  const header = $(headerSelector);
  if (!header) return;

  const onScroll = (): void => {
    if (window.scrollY > 80) header.classList.add("alt");
    else header.classList.remove("alt");
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function setupScrollAnimations(selector = ".scroll-fade"): void {
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

async function fetchPostsAndRender(
  url = "https://jsonplaceholder.typicode.com/posts?_limit=5",
  containerSelector = "#posts"
): Promise<void> {
  const container = $(containerSelector);
  if (!container) return;

  container.innerHTML = `<div class="loader">Loading...</div>`;

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

    const posts = (await resp.json()) as Post[];

    container.innerHTML = posts
      .map(
        (p: Post): string => `
          <section class="post fade-in scroll-fade">
            <h3>${escapeHtml(p.title)}</h3>
            <p>${escapeHtml(p.body)}</p>
            <ul class="actions">
              <li><a href="#" class="button small show-comments" data-post-id="${p.id}">Comments</a></li>
            </ul>
            <div class="comments" id="comments-${p.id}"></div>
          </section>
        `
      )
      .join("");

    container.addEventListener("click", async (e: Event): Promise<void> => {
      const target = e.target as HTMLElement;
      const btn = target.closest(".show-comments") as HTMLAnchorElement | null;
      if (!btn) return;

      e.preventDefault();

      const pid = btn.dataset.postId;
      if (!pid) return;

      const commentsBlock = $(`#comments-${pid}`);
      if (!commentsBlock) return;

      if (commentsBlock.classList.contains("open")) {
        commentsBlock.classList.remove("open");
        commentsBlock.innerHTML = "";
        return;
      }

      commentsBlock.innerHTML = `<div class="loader-small">Loading...</div>`;

      const respC = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${pid}/comments`
      );
      const comments = await respC.json();

      commentsBlock.innerHTML = comments
        .slice(0, 4)
        .map(
          (c: any): string => `
            <div class="comment">
              <strong>${escapeHtml(c.name)}</strong>
              <p>${escapeHtml(c.body)}</p>
            </div>`
        )
        .join("");

      commentsBlock.classList.add("open");
    });
  } catch (err) {
    container.innerHTML = `<div class="error">Unable to load data</div>`;
    console.error(err);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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