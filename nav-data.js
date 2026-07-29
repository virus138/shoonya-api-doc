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
      { slug: "totp-setup-guide", title: "TOTP Setup Guide" },
      { slug: "auto-login-totp", title: "Auto Login (TOTP)" },
      { slug: "manual-login-oauth", title: "Manual Login (OAuth)", badge: "POST" },
      { slug: "token-renewal", title: "Token Renewal", badge: "POST" },
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
      { slug: "holdings", title: "Holdings", badge: "POST" },
      { slug: "funds-limits", title: "Funds & Limits", badge: "POST" },
    ],
  },
  {
    id: "market-data-apis",
    label: "Market Data APIs",
    items: [
      { slug: "market-quotes", title: "Market Quotes (LTP / OHLC)", badge: "POST" },
      { slug: "full-market-depth", title: "Full Market Depth", badge: "POST" },
      { slug: "historical-data", title: "Historical Data", badge: "POST" },
      { slug: "option-chain", title: "Option Chain", badge: "POST" },
      { slug: "search-scrip", title: "Search Scrip", badge: "POST" },
      { slug: "instrument-master", title: "Symbol Master", badge: "POST" },
      // { slug: "expiry-data", title: "Expiry Data", badge: "POST" },
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
      { slug: "javascript-sdk", title: "JavaScript SDK (Comming Soon )" },
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
      { slug: "instrument-token-list", title: "Instrument Token List" },
      { slug: "glossary", title: "Glossary" },
    ],
  },
];

// Flat lookup maps built from NAV, used by app.js
const SLUG_TO_ITEM = {};
const SLUG_TO_SECTION = {};
const FLAT_ORDER = [];
NAV.forEach(section => {
  section.items.forEach(item => {
    SLUG_TO_ITEM[item.slug] = item;
    SLUG_TO_SECTION[item.slug] = section;
    FLAT_ORDER.push(item.slug);
  });
});
