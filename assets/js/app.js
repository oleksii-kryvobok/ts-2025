"use strict";
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));
function setupModal(options) {
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
function setupHeaderOnScroll(headerSelector = "#header") {
    const header = $(headerSelector);
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
function setupScrollAnimations(selector = ".scroll-fade") {
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
async function fetchPostsAndRender(url = "https://jsonplaceholder.typicode.com/posts?_limit=5", containerSelector = "#posts") {
    const container = $(containerSelector);
    if (!container)
        return;
    container.innerHTML = `<div class="loader">Loading...</div>`;
    try {
        const resp = await fetch(url);
        if (!resp.ok)
            throw new Error(`HTTP ${resp.status}`);
        const posts = (await resp.json());
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
        container.addEventListener("click", async (e) => {
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
            const respC = await fetch(`https://jsonplaceholder.typicode.com/posts/${pid}/comments`);
            const comments = await respC.json();
            commentsBlock.innerHTML = comments
                .slice(0, 4)
                .map((c) => `
            <div class="comment">
              <strong>${escapeHtml(c.name)}</strong>
              <p>${escapeHtml(c.body)}</p>
            </div>`)
                .join("");
            commentsBlock.classList.add("open");
        });
    }
    catch (err) {
        container.innerHTML = `<div class="error">Unable to load data</div>`;
        console.error(err);
    }
}
function escapeHtml(s) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
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
