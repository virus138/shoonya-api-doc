(function () {
  "use strict";

  var missingGlobal = [];
  if (typeof NAV === "undefined") missingGlobal.push("NAV");
  if (typeof SLUG_TO_ITEM === "undefined") missingGlobal.push("SLUG_TO_ITEM");
  if (typeof SLUG_TO_SECTION === "undefined") missingGlobal.push("SLUG_TO_SECTION");
  if (typeof FLAT_ORDER === "undefined") missingGlobal.push("FLAT_ORDER");
  if (typeof PAGE_CONTENT === "undefined") missingGlobal.push("PAGE_CONTENT");
  if (missingGlobal.length) {
    console.error("[app.js] Missing required data: " + missingGlobal.join(", ") + ". Check script load order in index.html.");
    return;
  }

  function byId(id) {
    var el = document.getElementById(id);
    if (!el) console.error('[app.js] Expected element "#' + id + '" not found in DOM.');
    return el;
  }

  var sidebarEl = byId("sidebar");
  var mainEl = byId("main");
  var tocListEl = byId("tocList");
  var searchInput = byId("searchInput");
  var searchResults = byId("searchResults");
  var themeBtn = byId("themeBtn");
  var hamburgerBtn = byId("hamburgerBtn");
  var overlay = byId("overlay");

  // The app cannot function without these — bail out cleanly rather than
  // throwing halfway through initialization.
  if (!sidebarEl || !mainEl || !tocListEl || !searchInput || !searchResults || !themeBtn || !hamburgerBtn || !overlay) {
    console.error("[app.js] Aborting init: one or more required DOM nodes are missing.");
    return;
  }

  var COLLAPSE_KEY = "shoonya-docs-collapsed-sections";

  /* ---------------------------------------------------------------------
     Small utilities
     ------------------------------------------------------------------ */

  var storage = {
    get: function (key) {
      try { return window.localStorage.getItem(key); }
      catch (e) { return null; }
    },
    set: function (key, value) {
      try { window.localStorage.setItem(key, value); return true; }
      catch (e) { return false; }
    }
  };

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Debounce: search re-filters on every keystroke; on slower devices /
  // larger indexes this avoids doing wasted work on transient states.
  function debounce(fn, wait) {
    var t = null;
    return function () {
      var args = arguments;
      var ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  }

  // hasOwnProperty helper for the null-prototype nav maps (belt-and-braces
  // alongside the Object.create(null) change in nav-data.js).
  function has(obj, key) {
    return typeof key === "string" && key.length > 0 && Object.prototype.hasOwnProperty.call(obj, key);
  }

  /* ---------------------------------------------------------------------
     Sidebar
     ------------------------------------------------------------------ */
  function loadCollapsedState() {
    var raw = storage.get(COLLAPSE_KEY);
    if (!raw) return {};
    try {
      var parsed = JSON.parse(raw);
      return (parsed && typeof parsed === "object") ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function saveCollapsedState(state) {
    storage.set(COLLAPSE_KEY, JSON.stringify(state));
  }

  function renderSidebar(activeSlug) {
    var collapsed = loadCollapsedState();
    var html = "";
    NAV.forEach(function (section) {
      var isCollapsed = !!collapsed[section.id];
      html += '<div class="nav-section">';
      html += '<button type="button" class="nav-section-btn" data-section="' + escapeHtml(section.id) + '" aria-expanded="' + (!isCollapsed) + '" aria-controls="navitems-' + escapeHtml(section.id) + '">';
      html += "<span>" + escapeHtml(section.label) + "</span>";
      html += '<svg class="chev' + (isCollapsed ? " rot" : "") + '" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      html += "</button>";
      html += '<div class="nav-items' + (isCollapsed ? " collapsed" : "") + '" id="navitems-' + escapeHtml(section.id) + '" role="group">';
      section.items.forEach(function (item) {
        var active = item.slug === activeSlug;
        html += '<a href="#/' + encodeURIComponent(item.slug) + '" class="nav-item' + (active ? " active" : "") + '" data-nav="' + escapeHtml(item.slug) + '"' + (active ? ' aria-current="page"' : "") + ">";
        if (item.badge) {
          html += '<span class="badge-mini ' + escapeHtml(String(item.badge).toLowerCase()) + '">' + escapeHtml(item.badge) + "</span>";
        }
        html += "<span>" + escapeHtml(item.title) + "</span></a>";
      });
      html += "</div></div>";
    });
    sidebarEl.innerHTML = html;
  }

  sidebarEl.addEventListener("click", function (e) {
    var btn = e.target.closest(".nav-section-btn");
    if (btn) {
      var id = btn.getAttribute("data-section");
      var items = document.getElementById("navitems-" + id);
      if (!items) return;
      var collapsed = loadCollapsedState();
      var nowCollapsed = !items.classList.contains("collapsed");
      items.classList.toggle("collapsed", nowCollapsed);
      var chev = btn.querySelector(".chev");
      if (chev) chev.classList.toggle("rot", nowCollapsed);
      btn.setAttribute("aria-expanded", String(!nowCollapsed));
      collapsed[id] = nowCollapsed;
      saveCollapsedState(collapsed);
      return;
    }
    var link = e.target.closest("[data-nav]");
    if (link) {
      e.preventDefault();
      navigateTo(link.getAttribute("data-nav"));
      closeMobileSidebar();
    }
  });

  /* ---------------------------------------------------------------------
     Main content rendering
     ------------------------------------------------------------------ */
  function slugToTitle(slug) {
    var item = has(SLUG_TO_ITEM, slug) ? SLUG_TO_ITEM[slug] : null;
    return item ? item.title : slug;
  }

  function renderStub(slug) {
    var item = (has(SLUG_TO_ITEM, slug) && SLUG_TO_ITEM[slug]) || { title: slug };
    return (
      '<div class="page-header">' +
      '<h1 class="page-title">' + escapeHtml(item.title) + "</h1>" +
      '<p class="page-desc">This page hasn\u2019t been written yet.</p>' +
      "</div>" +
      '<div class="stub-box">' +
      '<div><span class="pulse" aria-hidden="true"></span><span class="stub-title">Coming soon</span></div>' +
      "<p>This section is being drafted. In the meantime, check the parameter and error conventions on nearby pages \u2014 they hold for this endpoint too.</p>" +
      '<ul class="stub-checklist"><li>Parameter table</li><li>Request / response examples</li><li>Error handling</li></ul>' +
      "</div>"
    );
  }

  function slugifyHeading(h) {
    return String(h).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function renderPage(slug) {
    var page = has(PAGE_CONTENT, slug) ? PAGE_CONTENT[slug] : null;
    var item = has(SLUG_TO_ITEM, slug) ? SLUG_TO_ITEM[slug] : null;
    var section = has(SLUG_TO_SECTION, slug) ? SLUG_TO_SECTION[slug] : null;

    var breadcrumb =
      '<nav class="breadcrumb" aria-label="Breadcrumb">' +
      '<a href="#/introduction" data-nav="introduction">Docs</a>' +
      '<span class="sep" aria-hidden="true">/</span>' +
      (section ? "<span>" + escapeHtml(section.label) + '</span><span class="sep" aria-hidden="true">/</span>' : "") +
      '<span class="current" aria-current="page">' + escapeHtml(item ? item.title : slug) + "</span>" +
      "</nav>";

    if (!page || !Array.isArray(page.sections)) {
      mainEl.innerHTML = breadcrumb + renderStub(slug);
      renderToc([]);
      return;
    }

    var badgeHtml = "";
    if (page.badge && page.badge.method && page.badge.path) {
      badgeHtml =
        '<div class="endpoint-badge"><span class="method-tag ' + escapeHtml(page.badge.method) + '">' + escapeHtml(page.badge.method) + "</span><span>" + escapeHtml(page.badge.path) + "</span></div>";
    }

    var toc = [];
    var seenHeadingIds = Object.create(null);
    var sectionsHtml = page.sections
      .map(function (sec, i) {
        var baseId = "s-" + slugifyHeading(sec.h) + "-" + i;
        // slugifyHeading + index should already be unique per page, but
        // guard against a future authoring mistake producing a dupe id,
        // which would silently break the TOC scroll-spy and #anchors.
        var id = baseId;
        var n = 1;
        while (seenHeadingIds[id]) { id = baseId + "-" + n; n += 1; }
        seenHeadingIds[id] = true;

        toc.push({ id: id, label: sec.h });
        // sec.body is developer-authored HTML (page-content.js), not
        // user input, so it is intentionally not escaped here.
        return '<section class="content-section"><h2 id="' + id + '">' + escapeHtml(sec.h) + "</h2>" + (sec.body || "") + "</section>";
      })
      .join("");

    var order = FLAT_ORDER;
    var idx = order.indexOf(slug);
    var prevSlug = idx > 0 ? order[idx - 1] : null;
    var nextSlug = idx >= 0 && idx < order.length - 1 ? order[idx + 1] : null;

    var pageNav = '<div class="page-nav">';
    pageNav += prevSlug
      ? '<a href="#/' + encodeURIComponent(prevSlug) + '" data-nav="' + escapeHtml(prevSlug) + '"><div class="lbl">\u2190 Previous</div>' + escapeHtml(slugToTitle(prevSlug)) + "</a>"
      : "<span></span>";
    pageNav += nextSlug
      ? '<a href="#/' + encodeURIComponent(nextSlug) + '" data-nav="' + escapeHtml(nextSlug) + '" class="nxt"><div class="lbl">Next \u2192</div>' + escapeHtml(slugToTitle(nextSlug)) + "</a>"
      : "<span></span>";
    pageNav += "</div>";

    var utilBar =
      '<div class="util-bar">' +
      '<a class="edit-link" href="https://github.com/Shoonya-API-OAuth-Python/Shoonya_API_OAuth" target="_blank" rel="noopener noreferrer">' +
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      "<span>Edit this page on GitHub</span></a>" +
      '<div class="feedback" data-feedback>' +
      "<span>Was this page helpful?</span>" +
      '<button type="button" data-feedback-btn="yes">Yes</button>' +
      '<button type="button" data-feedback-btn="no">No</button>' +
      "</div></div>";

    mainEl.innerHTML =
      breadcrumb +
      '<header class="page-header">' +
      badgeHtml +
      '<h1 class="page-title">' + escapeHtml(item ? item.title : slug) + "</h1>" +
      '<p class="page-desc">' + escapeHtml(page.desc || "") + "</p>" +
      "</header>" +
      sectionsHtml +
      utilBar +
      pageNav;

    renderToc(toc);
    highlightAll();
    setupTocObserver();
    mainEl.focus();
  }

  function renderToc(items) {
    if (!items.length) { tocListEl.innerHTML = ""; return; }
    tocListEl.innerHTML = items
      .map(function (t) { return '<a href="#' + t.id + '" data-toc="' + t.id + '">' + escapeHtml(t.label) + "</a>"; })
      .join("");
  }

  function highlightAll() {
    if (window.hljs) {
      mainEl.querySelectorAll("pre code").forEach(function (block) {
        try { window.hljs.highlightElement(block); }
        catch (err) { console.error("[app.js] highlight.js failed on a code block:", err); }
      });
    }
  }

  /* ---------------------------------------------------------------------
     Routing
     ------------------------------------------------------------------ */
  function currentSlugFromHash() {
    var raw = window.location.hash.replace(/^#\/?/, "");
    var h;
    try { h = decodeURIComponent(raw); } catch (e) { h = raw; }
    // `has()` guards against prototype-chain keys like "__proto__" or
    // "constructor" resolving to a truthy non-nav value and crashing
    // renderPage/renderStub further down the line.
    return has(SLUG_TO_ITEM, h) ? h : "introduction";
  }

  function navigateTo(slug) {
    if (!has(SLUG_TO_ITEM, slug)) {
      console.error('[app.js] navigateTo() called with unknown slug "' + slug + '".');
      slug = "introduction";
    }
    var target = "#/" + slug;
    if (window.location.hash === target) {
      render(slug);
    } else {
      window.location.hash = target;
    }
  }

  function render(slug) {
    renderSidebar(slug);
    renderPage(slug);
    document.title = slugToTitle(slug) + " \u2014 Shoonya API Docs";
  }

  window.addEventListener("hashchange", function () {
    render(currentSlugFromHash());
  });

  /* ---------------------------------------------------------------------
     Content-area delegated events: internal links, code tabs, copy
     ------------------------------------------------------------------ */
  mainEl.addEventListener("click", function (e) {
    var navLink = e.target.closest("[data-nav]");
    if (navLink) {
      e.preventDefault();
      navigateTo(navLink.getAttribute("data-nav"));
      return;
    }

    var tab = e.target.closest(".code-tab");
    if (tab) {
      var group = tab.getAttribute("data-group");
      var lang = tab.getAttribute("data-lang");
      if (!group || !lang) return;
      mainEl.querySelectorAll('.code-tab[data-group="' + CSS.escape(group) + '"]').forEach(function (t) {
        var on = t === tab;
        t.classList.toggle("active", on);
        t.setAttribute("aria-selected", String(on));
      });
      mainEl.querySelectorAll('.code-panel[data-group="' + CSS.escape(group) + '"]').forEach(function (p) {
        p.classList.toggle("active", p.getAttribute("data-lang") === lang);
      });
      return;
    }

    var copyBtn = e.target.closest(".copy-btn");
    if (copyBtn) {
      handleCopyClick(copyBtn);
      return;
    }

    var fbBtn = e.target.closest("[data-feedback-btn]");
    if (fbBtn) {
      var wrap = fbBtn.closest("[data-feedback]");
      if (wrap) wrap.innerHTML = '<span class="feedback-thanks">Thanks for the feedback!</span>';
      return;
    }
  });

  function setCopyButtonState(copyBtn, text, isCopied) {
    var label = copyBtn.querySelector("span");
    if (label) label.textContent = text;
    copyBtn.classList.toggle("copied", !!isCopied);
  }

  var COPY_RESET_MS = 1600;
  function handleCopyClick(copyBtn) {
    var targetId = copyBtn.getAttribute("data-copy-target");
    if (!targetId) {
      console.error("[app.js] Copy button is missing data-copy-target.");
      return;
    }
    var codeEl = document.getElementById(targetId);
    if (!codeEl) {
      console.error('[app.js] Copy target "#' + targetId + '" not found.');
      return;
    }

    var text = codeEl.textContent || "";
    var originalLabel = (copyBtn.querySelector("span") || {}).textContent || "Copy";

    // Debounce rapid double-clicks / re-clicks mid-animation.
    if (copyBtn.dataset.copyBusy === "1") return;
    copyBtn.dataset.copyBusy = "1";

    function finish(ok) {
      setCopyButtonState(copyBtn, ok ? "Copied" : "Failed", ok);
      setTimeout(function () {
        setCopyButtonState(copyBtn, originalLabel, false);
        copyBtn.dataset.copyBusy = "0";
      }, COPY_RESET_MS);
    }

    copyText(text).then(function () { finish(true); }, function (err) {
      console.error("[app.js] Copy failed:", err);
      finish(false);
    });
  }

  // Clipboard API needs a secure context (HTTPS or localhost) and isn't
  // available in every browser/embedded webview, so we fall back to the
  // classic hidden-textarea + execCommand("copy") trick.
  function copyText(text) {
    if (window.isSecureContext && navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      var ok = false;
      try { ok = document.execCommand("copy"); }
      catch (e) { ok = false; }
      document.body.removeChild(textarea);
      if (ok) resolve(); else reject(new Error("execCommand('copy') failed"));
    });
  }

  /* ---------------------------------------------------------------------
     Theme toggle
     ------------------------------------------------------------------ */
  function applyThemeButtonState() {
    var isDark = document.documentElement.getAttribute("data-theme") === "dark";
    themeBtn.setAttribute("aria-pressed", String(isDark));
    themeBtn.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  }
  themeBtn.addEventListener("click", function () {
    var current = document.documentElement.getAttribute("data-theme");
    var next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    storage.set("theme", next);
    applyThemeButtonState();
  });
  applyThemeButtonState();

  /* ---------------------------------------------------------------------
     Mobile sidebar
     ------------------------------------------------------------------ */
  function openMobileSidebar() {
    sidebarEl.classList.add("open");
    overlay.classList.add("open");
    hamburgerBtn.setAttribute("aria-expanded", "true");
  }
  function closeMobileSidebar() {
    sidebarEl.classList.remove("open");
    overlay.classList.remove("open");
    hamburgerBtn.setAttribute("aria-expanded", "false");
  }
  hamburgerBtn.addEventListener("click", function () {
    if (sidebarEl.classList.contains("open")) closeMobileSidebar();
    else openMobileSidebar();
  });
  overlay.addEventListener("click", closeMobileSidebar);
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMobileSidebar();
  });

  /* ---------------------------------------------------------------------
     Search
     ------------------------------------------------------------------ */
  var searchIndex = FLAT_ORDER.map(function (slug) {
    var item = SLUG_TO_ITEM[slug];
    var section = SLUG_TO_SECTION[slug];
    var page = has(PAGE_CONTENT, slug) ? PAGE_CONTENT[slug] : null;
    var body = (page && Array.isArray(page.sections))
      ? page.sections.map(function (s) { return s.h; }).join(" ")
      : "";
    return {
      slug: slug,
      title: item.title,
      section: section.label,
      haystack: (item.title + " " + section.label + " " + (page ? (page.desc || "") : "") + " " + body).toLowerCase()
    };
  });

  var MAX_SEARCH_RESULTS = 8;
  var activeResultIndex = -1;

  function runSearch(query) {
    var q = query.trim().toLowerCase();
    if (!q) { closeSearch(); return; }
    var matches = searchIndex.filter(function (r) { return r.haystack.indexOf(q) !== -1; }).slice(0, MAX_SEARCH_RESULTS);
    activeResultIndex = -1;
    if (!matches.length) {
      searchResults.innerHTML = '<div class="sr-item sr-empty">No results for "' + escapeHtml(query) + '"</div>';
    } else {
      searchResults.innerHTML = matches
        .map(function (m, i) {
          return (
            '<div class="sr-item" role="option" id="sr-opt-' + i + '" data-nav="' + escapeHtml(m.slug) + '">' +
            '<span class="sr-section">' + escapeHtml(m.section) + "</span>" +
            '<span class="sr-title">' + escapeHtml(m.title) + "</span>" +
            "</div>"
          );
        })
        .join("");
    }
    searchResults.classList.add("open");
    searchInput.setAttribute("aria-expanded", "true");
  }

  function closeSearch() {
    searchResults.classList.remove("open");
    searchResults.innerHTML = "";
    searchInput.setAttribute("aria-expanded", "false");
    activeResultIndex = -1;
  }

  var SEARCH_DEBOUNCE_MS = 120;
  var debouncedSearch = debounce(function () { runSearch(searchInput.value); }, SEARCH_DEBOUNCE_MS);
  searchInput.addEventListener("input", debouncedSearch);
  searchInput.addEventListener("focus", function () { if (searchInput.value) runSearch(searchInput.value); });

  searchResults.addEventListener("click", function (e) {
    var opt = e.target.closest("[data-nav]");
    if (opt) {
      navigateTo(opt.getAttribute("data-nav"));
      searchInput.value = "";
      closeSearch();
    }
  });

  searchInput.addEventListener("keydown", function (e) {
    var options = Array.prototype.slice.call(searchResults.querySelectorAll("[data-nav]"));
    if (!options.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeResultIndex = Math.min(activeResultIndex + 1, options.length - 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeResultIndex = Math.max(activeResultIndex - 1, 0);
    } else if (e.key === "Enter") {
      e.preventDefault();
      var chosen = options[activeResultIndex] || options[0];
      navigateTo(chosen.getAttribute("data-nav"));
      searchInput.value = "";
      closeSearch();
      return;
    } else if (e.key === "Escape") {
      closeSearch();
      return;
    } else {
      return;
    }
    options.forEach(function (o, i) { o.classList.toggle("active", i === activeResultIndex); });
    options[activeResultIndex].scrollIntoView({ block: "nearest" });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest("#searchWrap")) closeSearch();
  });

  document.addEventListener("keydown", function (e) {
    var isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
    if (isCmdK) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });
  

// GenAcsTok checksum calculator
    

(function () {
  "use strict";

  async function sha256Hex(message) {
    var enc = new TextEncoder().encode(message);
    var hashBuffer = await crypto.subtle.digest("SHA-256", enc);
    return Array.prototype.map
      .call(new Uint8Array(hashBuffer), function (b) { return b.toString(16).padStart(2, "0"); })
      .join("");
  }

  function clearSecretField() {
    var secretEl = document.getElementById("cc-secret");
    if (secretEl) secretEl.value = "";
  }

  function clearcodeField() {
    var secretE2 = document.getElementById("cc-code");
    if (secretE2) secretE2.value = "";
  }

   

  document.addEventListener("click", function (e) {
    if (!(e.target && e.target.id === "cc-calc-btn")) return;
    var btn = e.target;
    if (btn.disabled) return;

    var clientIdEl = document.getElementById("cc-client-id");
    var secretEl = document.getElementById("cc-secret");
    var codeEl = document.getElementById("cc-code");
    var output = document.getElementById("cc-output");
    if (!clientIdEl || !secretEl || !codeEl || !output) {
      console.error("[app.js] Checksum calculator markup is incomplete.");
      return;
    }

    if (!window.isSecureContext || !window.crypto || !window.crypto.subtle) {
      output.value = "Error: this page must be served over HTTPS (or localhost) for the checksum calculator to work";
      return;
    }

    var clientId = clientIdEl.value.trim();
    var secret = secretEl.value.trim();
    var code = codeEl.value.trim();

    if (!clientId || !secret || !code) {
      output.value = "Fill in all three fields first";
      return;
    }

    btn.disabled = true;
    output.value = "Calculating\u2026";

    var payload = clientId + secret + code;
    secret = null; // drop our own reference immediately; payload still needed below

    sha256Hex(payload)
      .then(function (hash) { output.value = hash; })
      .catch(function () {
        output.value = "Error: could not compute checksum (see console)";
      })
      .finally(function () {
        btn.disabled = false;
        payload = "";
        clearSecretField();
        clearcodeField();

      });
  });

  // Clear on tab hide / navigation-away / close — covers someone
 
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") clearSecretField();
  });
  window.addEventListener("pagehide", clearSecretField);

  // Clear if the field loses focus without the button being pressed
  // (user typed it in, then changed their mind / clicked away).
  // NOTE: this previously only checked for the empty-value case and
  // returned without ever calling clearSecretField() when the field
  // actually had a value — the secret was left sitting in the DOM
  // after blur. Fixed to actually clear it.
  document.addEventListener(
    "blur",
    function (e) {
      if (e.target && e.target.id === "cc-secret" && e.target.value) {
        clearSecretField();
      }
    },
    true
  );
})();




  /* ---------------------------------------------------------------------
     Postman collection download
     ------------------------------------------------------------------ */
  function pcItem(name, endpoint, opts) {
    opts = opts || {};
    var auth = opts.auth !== false;
    var body = opts.body || '{"uid":"{{USER_ID}}"}';
    return {
      name: name,
      request: {
        method: "POST",
        header: [
          { key: "Content-Type", value: "application/x-www-form-urlencoded", type: "text" }
        ],
        auth: auth
          ? { type: "bearer", bearer: [{ key: "token", value: "{{access_token}}", type: "string" }] }
          : { type: "noauth" },
        body: {
          mode: "raw",
          raw: "jData=" + body,
          options: { raw: { language: "text" } }
        },
        url: {
          raw: "https://{{Domain_Name}}/NorenWClientTP/" + endpoint,
          protocol: "https",
          host: ["{{Domain_Name}}"],
          path: ["NorenWClientTP", endpoint]
        }
      },
      response: []
    };
  }

  function buildPostmanCollection() {
    var folders = [
      {
        name: "Auth & Account",
        item: [
          pcItem("GenAccessToken", "GenAcsTok", {
            auth: false,
            body: '{"uid":"{{USER_ID}}","code":"<auth_code>","appkey":"<checksum>","apikey":"<vendor_api_key>"}'
          }),
          pcItem("Forgot Password", "ForgotPassword", { auth: false }),
          pcItem("Forgot Password OTP", "FgtPwdOTP", { auth: false }),
          pcItem("Change Password", "Changepwd"),
          pcItem("User Detail", "UserDetails"),
          pcItem("ClientDetails", "ClientDetails")
        ]
      },
      {
        name: "Watchlist",
        item: [
          pcItem("Get Watchlist Names", "MWList"),
          pcItem("Get Watchlist Scrips", "MarketWatch"),
          pcItem("Search Scrip", "SearchScrip"),
          pcItem("Add Scrip To Watchlist", "AddMultiScripsToMW"),
          pcItem("ReorderMWScrips", "ReorderMWScrips"),
          pcItem("Delete Scrip to Watch List", "DeleteMultiMWScrips"),
          pcItem("PreDefinedMW", "PreDefinedMW"),
          pcItem("PreDefinedMWList", "PreDefinedMWList"),
          pcItem("RenameMW", "RenameMW")
        ]
      },
      {
        name: "Orders & Trades",
        item: [
          pcItem("Place Order", "PlaceOrder"),
          pcItem("Modify Order", "ModifyOrder", { body: '{"uid":"{{USER_ID}}","norenordno":"<order_number>"}' }),
          pcItem("Cancel Order", "CancelOrder", { body: '{"uid":"{{USER_ID}}","norenordno":"<order_number>"}' }),
          pcItem("ExitSNOOrder", "ExitSNOOrder", { body: '{"uid":"{{USER_ID}}","norenordno":"<order_number>"}' }),
          pcItem("GetOrderMargin", "GetOrderMargin"),
          pcItem("GetBasketMargin", "GetBasketMargin"),
          pcItem("OrderBook", "OrderBook"),
          pcItem("MultiLegOrderBook", "MultiLegOrderBook"),
          pcItem("Single order Hist", "SingleOrdHist", { body: '{"uid":"{{USER_ID}}","norenordno":"<order_number>"}' }),
          pcItem("single ord status", "SingleOrdStatus", { body: '{"uid":"{{USER_ID}}","norenordno":"<order_number>"}' }),
          pcItem("TradeBook", "TradeBook", { body: '{"uid":"{{USER_ID}}","actid":"{{ACCT_ID}}"}' }),
          pcItem("Product Conversion", "ProductConversion"),
          pcItem("SpanCalc", "SpanCalc")
        ]
      },
      {
        name: "Positions, Holdings & Funds",
        item: [
          pcItem("PositionBook", "PositionBook", { body: '{"uid":"{{USER_ID}}","actid":"{{ACCT_ID}}"}' }),
          pcItem("InteropPosition book", "InteropPositionBook"),
          pcItem("Holdings", "Holdings", { body: '{"uid":"{{USER_ID}}","actid":"{{ACCT_ID}}"}' }),
          pcItem("Holdings Conversion", "HoldingsConv"),
          pcItem("Limits", "Limits", { body: '{"uid":"{{USER_ID}}","actid":"{{ACCT_ID}}"}' }),
          pcItem("GetSubLimits", "GetSubLimits"),
          pcItem("GetMaxPayoutAmount", "GetMaxPayoutAmount")
        ]
      },
      {
        name: "Reports",
        item: [
          pcItem("GetOrderReport", "GetOrderReport", { body: '{"uid":"{{USER_ID}}","actid":"{{ACCT_ID}}"}' }),
          pcItem("GetTradeReport", "GetTradeReport", { body: '{"uid":"{{USER_ID}}","actid":"{{ACCT_ID}}"}' })
        ]
      },
      {
        name: "Market Data & Reference",
        item: [
          pcItem("Get SecurityInfo", "GetSecurityInfo"),
          pcItem("GetQuotes", "GetQuotes"),
          pcItem("EODChartData", "EODChartData"),
          pcItem("GetIndexList", "GetIndexList"),
          pcItem("GetOptionChain", "GetOptionChain"),
          pcItem("GetOptionGreek", "GetOptionGreek", {
            body: '{"uid":"{{USER_ID}}","exch":"NFO","tsym":"<symbol>","strprc":"<strike_price>","expd":"<expiry>","optt":"CE","ltp":"0"}'
          }),
          pcItem("GetLinkedScrips", "GetLinkedScrips"),
          pcItem("GetUnderlyingExchToken", "GetUnderlyingExchToken"),
          pcItem("ExchMsg", "ExchMsg"),
          pcItem("GetBrokerMsg", "GetBrokerMsg"),
          pcItem("ExchStatus", "ExchStatus"),
          pcItem("AMOStatusFlag", "AMOStatusFlag"),
          pcItem("TPSeries", "TPSeries")
        ]
      }
    ];

    return {
      info: {
        _postman_id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : "noren-restapi-oauth-collection",
        name: "NorenRESTAPI_oAuth",
        description: "Shoonya NorenRESTAPI OAuth collection \u2014 every documented endpoint pre-built as a ready-to-run request.",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      item: folders,
      variable: [
        { key: "Domain_Name", value: "api.shoonya.com", type: "string" },
        { key: "USER_ID", value: "", type: "string" },
        { key: "ACCT_ID", value: "", type: "string" },
        { key: "PAN", value: "", type: "string" },
        { key: "access_token", value: "", type: "string" }
      ]
    };
  }

  function downloadPostmanCollection() {
    var url = null;
    var a = null;
    try {
      var collection = buildPostmanCollection();
      var blob = new Blob([JSON.stringify(collection, null, 2)], { type: "application/json" });
      url = URL.createObjectURL(blob);

      a = document.createElement("a");
      a.href = url;
      a.download = "NorenRESTAPI_oAuth.postman_collection.json";
      document.body.appendChild(a);
      a.click();
    } catch (err) {
      console.error("[app.js] Failed to generate/download the Postman collection:", err);
    } finally {
      if (a && a.parentNode) a.parentNode.removeChild(a);
      if (url) URL.revokeObjectURL(url);
    }
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest("#pc-download-btn")) {
      downloadPostmanCollection();
    }
  });

  /* ---------------------------------------------------------------------
     TOC scroll-spy
     ------------------------------------------------------------------ */
  var tocObserver = null;
  function setupTocObserver() {
    if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }
    var headings = Array.prototype.slice.call(mainEl.querySelectorAll("h2[id]"));
    if (!headings.length) return;
    tocObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = tocListEl.querySelector('[data-toc="' + CSS.escape(entry.target.id) + '"]');
          if (!link) return;
          if (entry.isIntersecting) {
            tocListEl.querySelectorAll("a").forEach(function (a) { a.classList.remove("active"); });
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );
    headings.forEach(function (h) { tocObserver.observe(h); });
  }

  /* ---------------------------------------------------------------------
     Init
     ------------------------------------------------------------------ */
  render(currentSlugFromHash());
})();
