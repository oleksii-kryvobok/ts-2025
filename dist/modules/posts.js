var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { $ } from "../utils/dom.js";
import { escapeHtml } from "../utils/escapeHtml.js";
export function fetchPostsAndRender() {
    return __awaiter(this, arguments, void 0, function* (url = "https://jsonplaceholder.typicode.com/posts?_limit=5", containerSelector = "#posts") {
        const container = $(containerSelector);
        if (!container)
            return;
        container.innerHTML = `<div class="loader">Loading...</div>`;
        try {
            const resp = yield fetch(url);
            if (!resp.ok)
                throw new Error(`HTTP ${resp.status}`);
            const posts = (yield resp.json());
            container.innerHTML = posts
                .map((p) => `
          <section class="post fade-in scroll-fade">
            <h3>${escapeHtml(p.title)}</h3>
            <p>${escapeHtml(p.body)}</p>
            <ul class="actions">
              <li><a href="#" class="button small show-comments" data-post-id="${p.id}">Comments</a></li>
            </ul>
            <div class="comments" id="comments-${p.id}"></div>
          </section>
        `)
                .join("");
            container.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
                const target = e.target;
                const btn = target.closest(".show-comments");
                if (!btn)
                    return;
                e.preventDefault();
                const pid = btn.dataset.postId;
                if (!pid)
                    return;
                const commentsBlock = $(`#comments-${pid}`);
                if (!commentsBlock)
                    return;
                if (commentsBlock.classList.contains("open")) {
                    commentsBlock.classList.remove("open");
                    commentsBlock.innerHTML = "";
                    return;
                }
                commentsBlock.innerHTML = `<div class="loader-small">Loading...</div>`;
                const respC = yield fetch(`https://jsonplaceholder.typicode.com/posts/${pid}/comments`);
                const comments = yield respC.json();
                commentsBlock.innerHTML = comments
                    .slice(0, 4)
                    .map((c) => `
            <div class="comment">
              <strong>${escapeHtml(c.name)}</strong>
              <p>${escapeHtml(c.body)}</p>
            </div>`)
                    .join("");
                commentsBlock.classList.add("open");
            }));
        }
        catch (err) {
            container.innerHTML = `<div class="error">Unable to load data</div>`;
            console.error(err);
        }
    });
}
