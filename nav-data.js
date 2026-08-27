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
      { slug: "manual-login-oauth", title: "Manual Login (OAuth)", badge: null },
      { slug: "python-login-selenium", title: "Python Login (Selenium)", badge: null },
      { slug: "token-renewal", title: "Token Renewal", badge: null },
      { slug: "validate-hs-token", title: "Validate HS Token", badge: "POST" },
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
    id: "gtt-orders",
    label: "GTT Orders",
    items: [
      { slug: "place-gtt-order", title: "Place GTT Order", badge: "POST" },
      { slug: "cancel-gtt-order", title: "Cancel GTT Order", badge: "POST" },
      { slug: "pending-gtt-orders", title: "Get Pending GTT Orders", badge: "POST" },
      { slug: "enabled-gtt-orders", title: "Get Enabled GTT Orders", badge: "POST" },
      { slug: "unsettled-trading-date", title: "Get Unsettled Trading Date", badge: "POST" },
    ],
  },
  {
    id: "alerts",
    label: "Alerts",
    items: [
      { slug: "set-alert", title: "Set Alert", badge: "POST" },
      { slug: "cancel-alert", title: "Cancel Alert", badge: "POST" },
      { slug: "modify-alert", title: "Modify Alert", badge: "POST" },
    ],
  },
  {
    id: "market-data-apis",
    label: "Market Data APIs",
    items: [
      { slug: "market-quotes", title: "Market Quotes (LTP / OHLC)", badge: "POST" },
      { slug: "historical-data", title: "Historical Data", badge: "POST" },
      { slug: "time-price-series", title: "Time/Price Series", badge: "POST" },
      { slug: "option-chain", title: "Option Chain", badge: "POST" },
      { slug: "search-scrip", title: "Search Scrip", badge: "POST" },
      { slug: "security-info", title: "Security Info", badge: "POST" },
      { slug: "Get-Quotes", title: "Get Quotes", badge: "POST" },
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
      { slug: "dotnet-sdk", title: ".NET SDK" },
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
Object.freeze(FLAT_ORDER);
