import { $ } from "../utils/dom.js";
import { escapeHtml } from "../utils/escapeHtml.js";
import type { Post } from "../types/Post.js";

export async function fetchPostsAndRender(
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