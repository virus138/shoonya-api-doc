// ===== SIDEBAR NAVIGATION STRUCTURE =====
// This is the single source of truth for the sidebar. Add/remove/reorder
// items here — the sidebar, search index, breadcrumbs and prev/next footer
// links are all generated from this array automatically.

const NAV = [
  {
    id: "getting-started",
    label: "Getting Started",
    items: [
      { slug: "introduction", title: "Introduction" },
      { slug: "prerequisites", title: "Prerequisites" },
      { slug: "quick-start", title: "Quick Start (5 minutes)" },
      { slug: "auth-overview", title: "Authentication Overview" },
      { slug: "api-structure", title: "API Structure" },
      { slug: "error-handling", title: "Error Handling" },
      { slug: "rate-limits", title: "Rate Limits" },
      { slug: "changelog", title: "Changelog" },
    ],
  },
  {
    id: "authentication",
    label: "Authentication",
    items: [
      { slug: "login-flow-overview", title: "Login Flow Overview" },
      { slug: "totp-setup-guide", title: "TOTP Setup Guide"},
      // { slug: "auto-login-totp", title: "Auto Login (TOTP)", badge: "Coming Soon" },
      { slug: "ip-whitelisting", title: "IP Whitelisting Guide", badge: null },
      { slug: "manual-login-oauth", title: "Manual-Login-Oauth", badge: null },
      { slug: "python-login-selenium", title: "Python Login (Selenium)", badge: null },
      { slug: "token-renewal", title: "Token Renewal", badge: null },
      { slug: "vendors-partners", title: "For Vendors / Partners" },
      { slug: "logout", title: "Logout", badge: "POST" },
    ],
  },
  {
    id: "compliance",
    label: "Compliance & Risk",
    items: [
      { slug: "algo-compliance", title: "SEBI Algo ID Framework" },
      { slug: "risk-management", title: "Risk Management (RMS)" },
    ],
  },
  {
    id: "trading-apis",
    label: "Trading APIs",
    items: [
      { slug: "place-order", title: "Place Order", badge: "POST" },
      { slug: "modify-order", title: "Modify Order", badge: "POST" },
      { slug: "cancel-order", title: "Cancel Order", badge: "POST" },
      { slug: "order-book", title: "Order Book", badge: "POST" },
      { slug: "trade-book", title: "Trade Book", badge: "POST" },
      { slug: "order-history", title: "Order History", badge: "POST" },
      { slug: "product-conversion", title: "Product Conversion", badge: "POST" },
      { slug: "exit-order", title: "Exit Order", badge: "POST" },
      { slug: "positions", title: "Positions", badge: "POST" },
      { slug: "daily-mtm", title: "Daily MTM", badge: "POST" },
      { slug: "holdings", title: "Holdings", badge: "POST" },
      { slug: "funds-limits", title: "Funds & Limits", badge: "POST" },
    ],
  },
  {
    id: "market-data-apis",
    label: "Market Data APIs",
    items: [
      { slug: "market-quotes", title: "Market Quotes (LTP / OHLC)", badge: "POST" },
      { slug: "historical-data", title: "Historical-Data", badge: "POST" },
      { slug: "time-price-series", title: "Time-Price-Series", badge: "POST" },
      { slug: "option-chain", title: "Option Chain", badge: "POST" },
      { slug: "search-scrip", title: "Search Scrip", badge: "POST" },
      { slug: "security-info", title: "Security-Info", badge: "POST" },
      { slug: "Get-Quotes", title: "Get -Quotes", badge: "POST" },
    ],
  },
  {
    id: "streaming",
    label: "Streaming (WebSocket)",
    items: [
      { slug: "websocket-overview", title: "WebSocket Overview", badge: "WS" },
      { slug: "subscribe-market-feed", title: "Subscribe to Market Feed", badge: "WS" },
      { slug: "order-update-feed", title: "Order Update Feed", badge: "WS" },
      { slug: "postback-webhook", title: "Postback / Webhook", badge: "POST" },
      { slug: "streaming-code-examples", title: "Code Examples" },
    ],
  },
  {
    id: "sdk-reference",
    label: "SDK Reference",
    items: [
      { slug: "python-sdk", title: "Python SDK" },
      { slug: "javascript-sdk", title: "JavaScript SDK", badge: "Coming Soon" },
      { slug: "sdk-code-examples", title: "Code Examples" },
      { slug: "postman-collection", title: "Postman Collection" },
    ],
  },
  {
    id: "annexure",
    label: "Annexure",
    items: [
      { slug: "error-code-reference", title: "Error Code Reference" },
      { slug: "exchange-segment-codes", title: "Exchange Segment Codes" },
      { slug: "product-type-codes", title: "Product Type Codes" },
      { slug: "order-type-codes", title: "Order Type Codes" },
      { slug: "transaction-type-codes", title: "Transaction Type Codes" },
      { slug: "symbol-master", title: "Symbol Master" },
      { slug: "instrument-token-list", title: "Instrument Token List" },
      { slug: "glossary", title: "Glossary" },
    ],
  },
];

// Flat lookup maps built from NAV, used by app.js
//
// These use Object.create(null) instead of {} so they have no prototype
// chain. A plain {} would let a crafted URL like "#/__proto__" or
// "#/constructor" resolve to a truthy built-in object instead of
// undefined, which would slip past "is this a real slug?" checks and
// crash the renderer (or worse, on older/less careful code paths, enable
// prototype pollution). Object.create(null) makes bracket lookups of
// unknown keys reliably return undefined.
const SLUG_TO_ITEM = Object.create(null);
const SLUG_TO_SECTION = Object.create(null);
const FLAT_ORDER = [];

NAV.forEach(section => {
  section.items.forEach(item => {
    if (SLUG_TO_ITEM[item.slug]) {
      // Fail loudly in dev rather than silently shadowing a nav entry.
      console.error('[nav-data] Duplicate slug detected: "' + item.slug + '"');
    }
    SLUG_TO_ITEM[item.slug] = item;
    SLUG_TO_SECTION[item.slug] = section;
    FLAT_ORDER.push(item.slug);
  });
});

// Freeze so nothing downstream can accidentally mutate the nav model at
// runtime (e.g. a bug in search/render code doing SLUG_TO_ITEM[x] = y).
Object.freeze(FLAT_ORDER);
