// Runs before first paint (loaded synchronously in <head>, no `defer`/`async`)
// to avoid a flash of the wrong theme. Kept as its own external file — not an
// inline <script> block — so it can execute under a script-src CSP that has
// no 'unsafe-inline'. See index.html for the policy and the audit report for
// why the inline version was a problem.
(function () {
  "use strict";
  var saved = null;
  try { saved = window.localStorage.getItem("theme"); }
  catch (e) { /* opaque origin / storage blocked / private browsing */ }
  var theme = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
})();
