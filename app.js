// ===== APP: routing, rendering, search, theme =====

const sidebarEl = document.getElementById("sidebar");
const mainEl = document.getElementById("main");
const tocListEl = document.getElementById("tocList");
const tocEl = document.getElementById("toc");

const collapsedSections = new Set(); // empty = all expanded by default

// ---------- sidebar ----------
function renderSidebar(activeSlug) {
  sidebarEl.innerHTML = "";
  NAV.forEach(section => {
    const wrap = document.createElement("div");
    wrap.className = "nav-section";

    const btn = document.createElement("button");
    btn.className = "nav-section-btn";
    btn.innerHTML = `<span>${section.label}</span>
      <svg class="chev ${collapsedSections.has(section.id) ? "rot" : ""}" width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    btn.onclick = () => {
      if (collapsedSections.has(section.id)) collapsedSections.delete(section.id);
      else collapsedSections.add(section.id);
      renderSidebar(activeSlug);
    };

    const itemsWrap = document.createElement("div");
    itemsWrap.className = "nav-items" + (collapsedSections.has(section.id) ? " collapsed" : "");

    section.items.forEach(item => {
      const a = document.createElement("a");
      a.className = "nav-item" + (item.slug === activeSlug ? " active" : "");
      a.href = "#" + item.slug;
      const badgeCls = item.badge === "GET" ? "get" : item.badge === "POST" ? "post" : item.badge === "WS" ? "ws" : "";
      a.innerHTML = (item.badge ? `<span class="badge-mini ${badgeCls}">${item.badge}</span>` : "") + item.title;
      itemsWrap.appendChild(a);
    });

    wrap.appendChild(btn);
    wrap.appendChild(itemsWrap);
    sidebarEl.appendChild(wrap);
  });
}

// ---------- stub page renderer ----------
const STUB_CHECKLIST = ["Overview & Purpose", "API endpoint & parameters", "Request / response examples", "Error handling", "Best practices", "Python example"];

function renderStub(item, section) {
  return `
  <div class="breadcrumb">
    <span>Docs</span><span class="sep">/</span><span>${section.label}</span><span class="sep">/</span><span class="current">${item.title}</span>
  </div>
  <div class="page-header">
    ${item.badge ? `<div class="endpoint-badge"><span class="method-tag ${item.badge}">${item.badge}</span><span>Endpoint pending</span></div>` : ""}
    <h1 class="page-title">${item.title}</h1>
    <p class="page-desc">Part of ${section.label}.</p>
  </div>
  <div class="stub-box">
    <div><span class="pulse"></span><span class="stub-title">Content in progress</span></div>
    <p>This page follows the same template as the rest of the docs — Overview, Purpose, Parameters, Request/Response examples, Error Handling, Best Practices, Python example and Notes — and will be filled in next.</p>
    <ul class="stub-checklist">${STUB_CHECKLIST.map(c => `<li>${c}</li>`).join("")}</ul>
  </div>`;
}

// ---------- full page renderer ----------
function renderFull(item, section, content) {
  const badgeHtml = content.badge
    ? `<div class="endpoint-badge"><span class="method-tag ${content.badge.method}">${content.badge.method}</span><span>${content.badge.path}</span></div>`
    : "";
  const sectionsHtml = content.sections.map(s => {
    const id = slugify(s.h);
    return `<div class="content-section"><h2 id="${id}">${s.h}</h2>${s.body}</div>`;
  }).join("");

  return `
  <div class="breadcrumb">
    <span>Docs</span><span class="sep">/</span><span>${section.label}</span><span class="sep">/</span><span class="current">${item.title}</span>
  </div>
  <div class="page-header">
    ${badgeHtml}
    <h1 class="page-title">${item.title}</h1>
    <p class="page-desc">${content.desc}</p>
  </div>
  ${sectionsHtml}`;
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ---------- utility bar: edit-on-github + feedback ----------
const REPO_BASE = "https://github.com/Shoonya-API-OAuth-Python/Shoonya_API_OAuth";

function renderUtilityBar(slug) {
  return `<div class="util-bar">
    <a class="edit-link" href="${REPO_BASE}/issues/new?title=Docs%20feedback:%20${encodeURIComponent(slug)}" target="_blank" rel="noopener noreferrer">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      Report an issue with this page
    </a>
    <div class="feedback" id="feedback-${slug}">
      <span>Was this page helpful?</span>
      <button type="button" onclick="submitFeedback(this,true)">Yes</button>
      <button type="button" onclick="submitFeedback(this,false)">No</button>
    </div>
  </div>`;
}

function submitFeedback(btn, helpful) {
  const wrap = btn.closest(".feedback");
  wrap.innerHTML = helpful
    ? `<span class="feedback-thanks">Thanks for the feedback 🎉</span>`
    : `<span class="feedback-thanks">Thanks — please use "Report an issue" above to tell us what's missing.</span>`;
}

// ---------- prev/next footer ----------
function renderPageNav(slug) {
  const idx = FLAT_ORDER.indexOf(slug);
  const prevSlug = idx > 0 ? FLAT_ORDER[idx - 1] : null;
  const nextSlug = idx < FLAT_ORDER.length - 1 ? FLAT_ORDER[idx + 1] : null;
  const prevItem = prevSlug ? SLUG_TO_ITEM[prevSlug] : null;
  const nextItem = nextSlug ? SLUG_TO_ITEM[nextSlug] : null;
  return `<div class="page-nav">
    ${prevItem ? `<a href="#${prevSlug}"><div class="lbl">← Previous</div>${prevItem.title}</a>` : `<span></span>`}
    ${nextItem ? `<a href="#${nextSlug}" class="nxt"><div class="lbl">Next →</div>${nextItem.title}</a>` : `<span></span>`}
  </div>`;
}

// ---------- TOC ----------
function renderTOC() {
  const headings = mainEl.querySelectorAll(".content-section h2");
  if (!headings.length) { tocEl.style.visibility = "hidden"; return; }
  tocEl.style.visibility = "visible";
  tocListEl.innerHTML = Array.from(headings)
    .map(h => `<a href="#${h.id}" data-target="${h.id}">${h.textContent}</a>`)
    .join("");
  tocListEl.querySelectorAll("a").forEach(a => {
    a.onclick = (e) => {
      e.preventDefault();
      document.getElementById(a.dataset.target).scrollIntoView({ behavior: "smooth", block: "start" });
    };
  });
  attachScrollSpy(headings);
}

function attachScrollSpy(headings) {
  window.onscroll = () => {
    let current = null;
    headings.forEach(h => { if (h.getBoundingClientRect().top < 120) current = h.id; });
    tocListEl.querySelectorAll("a").forEach(a => a.classList.toggle("active", a.dataset.target === current));
  };
  window.onscroll();
}

// ---------- routing ----------
function navigate() {
  let slug = location.hash.replace("#", "") || "introduction";
  if (!SLUG_TO_ITEM[slug]) slug = "introduction";
  const item = SLUG_TO_ITEM[slug];
  const section = SLUG_TO_SECTION[slug];
  const content = PAGE_CONTENT[slug];

  mainEl.innerHTML = (content ? renderFull(item, section, content) : renderStub(item, section)) + renderUtilityBar(slug) + renderPageNav(slug);

  // wire up in-content nav links
  mainEl.querySelectorAll("[data-nav]").forEach(el => {
    el.onclick = (e) => { e.preventDefault(); location.hash = el.dataset.nav; };
  });

  renderSidebar(slug);
  renderTOC();

  if (window.hljs) mainEl.querySelectorAll("pre code").forEach(b => hljs.highlightElement(b));
  closeMobileSidebar();
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", navigate);

// ---------- code tabs / copy ----------
function switchTab(groupId, lang) {
  document.querySelectorAll(`.code-tab[data-group="${groupId}"]`).forEach(t => t.classList.toggle("active", t.dataset.lang === lang));
  document.querySelectorAll(`.code-panel[data-group="${groupId}"]`).forEach(p => p.classList.toggle("active", p.dataset.lang === lang));
}

function copyCode(id, btn) {
  const text = document.getElementById(id).innerText;
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.innerHTML;
    btn.innerHTML = "Copied ✓";
    setTimeout(() => (btn.innerHTML = original), 1400);
  });
}

// ---------- theme ----------
const themeBtn = document.getElementById("themeBtn");
themeBtn.onclick = () => {
  const html = document.documentElement;
  const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
};

// ---------- search ----------
(function () {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const searchWrap = document.getElementById("searchWrap");

  if (!searchInput || !searchResults || !searchWrap) return;

  // --- accessibility scaffolding (safe to call even if already set in HTML) ---
  searchInput.setAttribute("role", "combobox");
  searchInput.setAttribute("aria-expanded", "false");
  searchInput.setAttribute("aria-controls", "searchResults");
  searchInput.setAttribute("aria-autocomplete", "list");
  searchResults.setAttribute("role", "listbox");
  searchResults.setAttribute("id", searchResults.id || "searchResults");

  let currentMatches = [];
  let activeIndex = -1;
  let debounceTimer = null;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Wrap the first case-insensitive match of `q` inside `text` with <mark>,
  // escaping everything else so highlighting can never introduce raw HTML.
  function highlightMatch(text, q) {
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return escapeHtml(text);
    const before = escapeHtml(text.slice(0, idx));
    const match = escapeHtml(text.slice(idx, idx + q.length));
    const after = escapeHtml(text.slice(idx + q.length));
    return `${before}<mark>${match}</mark>${after}`;
  }

  function scoreMatch(item, section, q) {
    const title = item.title.toLowerCase();
    const label = section.label.toLowerCase();
    const slug = item.slug.toLowerCase();
    if (title.startsWith(q)) return 0;
    if (title.includes(q)) return 1;
    if (label.includes(q)) return 2;
    if (slug.includes(q)) return 3;
    return 99;
  }

  function getMatches(q) {
    const matches = [];
    NAV.forEach((section) => {
      section.items.forEach((item) => {
        const score = scoreMatch(item, section, q);
        if (score < 99) matches.push({ item, section, score });
      });
    });
    matches.sort((a, b) => a.score - b.score);
    return matches;
  }

  function closeResults() {
    searchResults.classList.remove("open");
    searchInput.setAttribute("aria-expanded", "false");
    searchInput.removeAttribute("aria-activedescendant");
    activeIndex = -1;
    currentMatches = [];
  }

  function render(q) {
    currentMatches = getMatches(q).slice(0, 8);
    activeIndex = currentMatches.length ? 0 : -1;

    searchResults.innerHTML = currentMatches.length
      ? currentMatches
          .map(
            (m, i) => `
        <div class="sr-item${i === 0 ? " active" : ""}"
             id="sr-opt-${i}"
             role="option"
             aria-selected="${i === 0}"
             data-slug="${escapeHtml(m.item.slug)}"
             data-index="${i}">
          <span class="sr-section">${escapeHtml(m.section.label)}</span>
          <span>${highlightMatch(m.item.title, q)}</span>
        </div>`
          )
          .join("")
      : `<div class="sr-item sr-empty" role="status">No results for "${escapeHtml(q)}"</div>`;

    searchResults.classList.add("open");
    searchInput.setAttribute("aria-expanded", "true");
    if (currentMatches.length) {
      searchInput.setAttribute("aria-activedescendant", "sr-opt-0");
    } else {
      searchInput.removeAttribute("aria-activedescendant");
    }
  }

  function setActive(index) {
    if (!currentMatches.length) return;
    const items = searchResults.querySelectorAll(".sr-item[data-index]");
    items.forEach((el) => {
      el.classList.remove("active");
      el.setAttribute("aria-selected", "false");
    });
    activeIndex = (index + items.length) % items.length;
    const el = items[activeIndex];
    if (el) {
      el.classList.add("active");
      el.setAttribute("aria-selected", "true");
      el.scrollIntoView({ block: "nearest" });
      searchInput.setAttribute("aria-activedescendant", el.id);
    }
  }

  function navigateTo(slug) {
    location.hash = slug;
    document.dispatchEvent(new CustomEvent("docs:navigate", { detail: { slug } }));
    searchInput.value = "";
    closeResults();
  }

  // --- input handling (debounced) ---
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    clearTimeout(debounceTimer);
    if (!q) {
      closeResults();
      return;
    }
    debounceTimer = setTimeout(() => render(q), 120);
  });

  // --- delegated click handling (bound once, not per render) ---
  searchResults.addEventListener("click", (e) => {
    const el = e.target.closest(".sr-item[data-slug]");
    if (el) navigateTo(el.dataset.slug);
  });

  // --- keyboard: arrows/enter/escape while the input or results have focus ---
  searchInput.addEventListener("keydown", (e) => {
    if (!searchResults.classList.contains("open")) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive(activeIndex + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive(activeIndex - 1);
        break;
      case "Enter": {
        e.preventDefault();
        const el = searchResults.querySelector(`.sr-item[data-index="${activeIndex}"]`);
        if (el) navigateTo(el.dataset.slug);
        break;
      }
      case "Escape":
        e.preventDefault();
        closeResults();
        searchInput.blur();
        break;
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#searchWrap")) closeResults();
  });

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
    if (
      e.key === "/" &&
      document.activeElement !== searchInput &&
      !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
    ) {
      e.preventDefault();
      searchInput.focus();
    }
  });
})();

// ---------- mobile sidebar ----------
const overlay = document.getElementById("overlay");
document.getElementById("hamburgerBtn").onclick = () => {
  sidebarEl.classList.toggle("open");
  overlay.classList.toggle("open");
};
overlay.onclick = closeMobileSidebar;
function closeMobileSidebar() {
  sidebarEl.classList.remove("open");
  overlay.classList.remove("open");
}

// ---------- init ----------
navigate();
