(function () {
  "use strict";
  var saved = null;
  try { saved = window.localStorage.getItem("theme"); }
  catch (e) { /* opaque origin / storage blocked / private browsing */ }
  var theme = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
})();
