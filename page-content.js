const PAGE_CONTENT = {



  // ---------- A. GETTING STARTED ----------
  "introduction": {
  badge: null,
  desc: "What the Shoonya API is, who it's for, and how this documentation is organized.",
  sections: [
    {
      h: "Overview",
      body: `<p>The Shoonya API, powered by Finvasia, gives developers and traders a secure, reliable,
      and high-performance interface to automate trades, access live market data, and manage
      portfolios programmatically.</p>
      <p>Manual trading doesn't scale, and it doesn't fail gracefully. Automate the workflow instead:
      fewer operational errors, consistent execution, and a system you can actually test. Noren OMS
      was built for the scale of the Indian broking market and is under continuous testing for
      stability, throughput, and latency.</p>` },

    {
      h: "Who this is for",
      body: `<ul>
        <li><b>Retail algo traders</b> — running a strategy against your own account. Start with
        <a href="#" data-nav="quick-start">Quick Start</a> and the Python SDK.</li>
        <li><b>Platform &amp; vendor integrators</b> — onboarding multiple clients under one app.
        You'll spend most of your time in <a href="#" data-nav="vendors-partners">OAuth for vendors</a> and the
        rate-limit conventions under Getting Started.</li>
        <li><b>Fintechs &amp; quant desks</b> — need market data at low latency and at scale. Go
        straight to <a href="#" data-nav="websocket-overview">Streaming</a> for tick and order-update feeds.</li>
      </ul>` },

    {
      h: "Quick look",
      body: `<div class="card-grid">
        <div class="mini-card"><div class="k">Base URL</div><div class="v">api.shoonya.com</div></div>
        <div class="mini-card"><div class="k">Protocols</div><div class="v">REST + WebSocket</div></div>
        <div class="mini-card"><div class="k">Auth</div><div class="v">OAuth 2.0</div></div>
        <div class="mini-card"><div class="k">Formats</div><div class="v">JSON</div></div>
      </div>` },

      {
      h: "Before you write any code",
      body: `<ul>
        <li>Read <a href="#" data-nav="rate-limits">Rate Limits</a> first. It'll save you a
        rewrite later.</li>
        <li>Use the WebSocket feed for live prices. Don't poll Market Quotes in a loop — it's
        slower for you and it costs everyone else headroom.</li>
        <li>Treat your session token like a password: store it securely, never commit it, rotate
        it on renewal.</li>
      </ul>` },

    {
      h: "How this documentation is organized",
      body: `<ul>
        <li><b>Getting Started</b> — environment setup, first request, error and rate-limit conventions.</li>
        <li><b>Authentication</b> — OAuth 2.0 login flow, vendor onboarding, token renewal.</li>
        <li><b>Trading APIs</b> — order placement, modification, book and position endpoints.</li>
        <li><b>Market Data APIs</b> — quotes, depth, historical candles, option chain.</li>
        <li><b>Streaming</b> — WebSocket feeds for ticks and order updates.</li>
        <li><b>SDK Reference</b> — official Python SDK and code samples.</li>
        <li><b>Annexure</b> — every code and enum used across the API in one place.</li>
      </ul>` },

    {
      h: "Best practices",
      body: `<ul>
        <li>Read <a href="#" data-nav="rate-limits">Rate Limits</a> before writing any polling loop.</li>
        <li>Use the WebSocket feed for live prices — don't poll Market Quotes in a tight loop.</li>
        <li>Store your session token securely and never commit it to source control.</li>
      </ul>` },
     {
      h: "Next",
      body: `<p>This page is the front door. Everything after it assumes you've completed
      <a href="#" data-nav="quick-start">Quick Start</a> — that's where to go next.</p>` },  
  ],
},

  "prerequisites": {
    desc: "Everything you need in place — account, credentials, environment, compliance, and security — before making your first API call.",
    sections: [
      { h: "Overview", body: `<p>This page is a complete pre-integration checklist. Skipping any one of these categories is the single biggest source of "the API doesn't work" support tickets — most turn out to be setup gaps (unenabled API access, unsynced TOTP clock, missing Algo ID tagging) rather than actual API issues. Work through each section before you write your first line of integration code.</p>` },

      { h: "1. Account & Access Prerequisites", body: `
      <table class="param-table">
        <tr><th>Requirement</th><th>Details</th></tr>
        <tr><td>Active Shoonya trading account</td><td>Fully KYC-verified. Your <code>uid</code> (client ID) is tied to this account and appears in every request body.</td></tr>
        <tr><td>API access explicitly enabled</td><td>Opt-in, separate from having a trading account. Confirm this in account settings — a disabled flag here produces a login failure that looks identical to a credentials error.</td></tr>
        <tr><td>Segment-level exchange enablement</td><td>NSE, NFO, BSE, MCX, CDS are enabled independently. A <code>SearchScrip</code> or <code>PlaceOrder</code> call against a segment you're not enabled for fails even with valid credentials — check this before assuming a code bug.</td></tr>
        <tr><td>Sufficient account funding/margin</td><td>Not an API concern directly, but order-placement testing against a zero-margin account returns rejection responses that are easy to misdiagnose as an API integration error.</td></tr>
      </table>` },

      { h: "2. Authentication Prerequisites", body: `
      <table class="param-table">
        <tr><th>Requirement</th><th>Details</th></tr>
        <tr><td>TOTP 2FA configured</td><td>Mandatory for both manual and automated login. See <a href="#" data-nav="totp-setup-guide">TOTP Setup Guide</a>.</td></tr>
        <tr><td>TOTP secret stored securely</td><td>Needed to generate OTPs programmatically for <a href="#" data-nav="auto-login-totp">Auto Login</a>. Treat it as a credential, not a config value.</td></tr>
        <tr><td>System clock synced (NTP)</td><td>TOTP is time-based — a server clock drifted by more than ~30s produces intermittent, hard-to-reproduce login failures. Verify NTP sync on any server running automated login, especially cloud VMs.</td></tr>
        <tr><td>Understanding of session lifecycle</td><td>Read <a href="#" data-nav="login-flow-overview">Login Flow Overview</a> and <a href="#" data-nav="token-renewal">Token Renewal</a> — know when your <code>AccessToken</code> expires and how renewal works before building anything that runs unattended overnight.</td></tr>
        <tr><td>Vendor/App credentials (if applicable)</td><td>Only if integrating as a registered vendor rather than a single account holder. See <a href="#" data-nav="vendors-partners">For Vendors / Partners</a>.</td></tr>
      </table>` },

      { h: "3. Technical / Environment Prerequisites", body: `
      <table class="param-table">
        <tr><th>Item</th><th>Notes</th></tr>
        <tr><td>HTTPS-capable HTTP client</td><td>All REST endpoints are HTTPS-only, form-urlencoded (<code>jData</code>/<code>jKey</code>) — see <a href="#" data-nav="api-structure">API Structure</a> before assuming raw JSON bodies work.</td></tr>
        <tr><td>Python SDK (recommended)</td><td><code>NorenRestApiPy</code> wraps auth, order, quote, and search calls. See <a href="#" data-nav="python-sdk">Python SDK</a>.</td></tr>
        <tr><td>WebSocket client library</td><td>Required only for live feeds (order updates, market data). See <a href="#" data-nav="websocket-overview">WebSocket Overview</a>. Not needed for REST-only, poll-based integrations.</td></tr>
        <tr><td>Reconnect/retry handling capability</td><td>WebSocket connections drop — plan reconnect logic (exponential backoff, resubscribe-on-reconnect) as a first-class design concern, not an afterthought bolted on after production issues surface.</td></tr>
        <tr><td>Reliable outbound network path</td><td>If running on a corporate network or restrictive cloud VPC, confirm outbound HTTPS/WSS to <code>api.shoonya.com</code> isn't blocked by firewall/proxy rules before debugging "connection refused" as an SDK issue.</td></tr>
        <tr><td>Logging in place</td><td>Structured logging (request payload, response, latency) from day one — this is what actually lets you tell "no data" (normal) apart from "session expired" (needs re-auth) apart from "network failure" (needs retry) at 2am when something breaks unattended.</td></tr>
      </table>` },

      { h: "4. Security Prerequisites", body: `
      <table class="param-table">
        <tr><th>Item</th><th>Notes</th></tr>
        <tr><td>Secrets management</td><td>Env vars, a secrets manager, or encrypted config — never commit <code>uid</code>, password, or TOTP secret to source control, including private repos.</td></tr>
        <tr><td>AccessToken handling</td><td>Store tokens encrypted at rest if persisted between runs. Treat a leaked <code>AccessToken</code> as equivalent to a leaked password — it grants full account access until it expires or is invalidated.</td></tr>
        <tr><td>IP allowlisting awareness (if enforced on your account)</td><td>Some account configurations restrict API calls to specific IPs. If you plan to run from a dynamic-IP environment (e.g. home broadband, ephemeral cloud instances), confirm this isn't enabled or plan for a static egress IP.</td></tr>
        <tr><td>Least-privilege deployment</td><td>If multiple services touch the same account (e.g. a quote poller and a separate order engine), consider whether they need to share one token/session or should be isolated — a bug in one shouldn't be able to silently place orders via the other.</td></tr>
      </table>` },

      { h: "5. Compliance Prerequisites (if running an algo)", body: `<p>If you're building an automated/algorithmic strategy — as opposed to a manual-trigger tool a human approves before each order — read <a href="#" data-nav="algo-compliance">SEBI Algo ID Framework</a> before writing any order-placement code.</p>
      <ul>
        <li>Determine whether your strategy is white-box or black-box under SEBI's Feb 2025 circular — this determines your disclosure obligations.</li>
        <li>Confirm NNF ID / Algo ID tagging requirements and build them into your order payload structure from the start — retrofitting tagging after orders are already flowing is significantly more error-prone than designing for it up front.</li>
        <li>If distributing your strategy to other users (vendor model), confirm empanelment status and NDA terms are in place before onboarding external clients.</li>
        <li>Track the enforcement deadline for your compliance category — see <a href="#" data-nav="algo-compliance">SEBI Algo ID Framework</a> for current dates.</li>
      </ul>` },

      { h: "6. Operational Readiness", body: `
      <table class="param-table">
        <tr><th>Item</th><th>Why it matters</th></tr>
        <tr><td>Rate limit awareness</td><td>Review <a href="#" data-nav="rate-limits">Rate Limits</a> before designing polling logic. Code that works fine in light testing can silently start failing near production load if it wasn't designed against the actual limits.</td></tr>
        <tr><td>Error handling strategy</td><td>Read <a href="#" data-nav="error-handling">Error Handling</a> — know the difference between a retryable error (session expired, transient network) and a non-retryable one (invalid input, insufficient margin) before your retry logic accidentally loops on something it can never fix.</td></tr>
        <tr><td>Idempotency plan for order placement</td><td>Network retries on a timed-out <code>PlaceOrder</code> call can result in duplicate orders if you don't have a way to check "did this actually go through" before retrying.</td></tr>
        <tr><td>Monitoring / alerting</td><td>For anything running unattended (algo strategies, scheduled quote pollers), have alerting on auth failures and WebSocket disconnects — silent failure in a trading system is worse than a loud one.</td></tr>
      </table>` },

      { h: "Pre-flight Checklist", body: `<ul>
        <li>☐ Shoonya trading account active, KYC complete, sufficiently funded</li>
        <li>☐ API access enabled on the account</li>
        <li>☐ Required exchange segments enabled (NSE/NFO/BSE/MCX/CDS as needed)</li>
        <li>☐ TOTP 2FA configured, secret stored securely, server clock NTP-synced</li>
        <li>☐ Read <a href="#" data-nav="auth-overview">Authentication Overview</a> and <a href="#" data-nav="token-renewal">Token Renewal</a></li>
        <li>☐ HTTP client / SDK chosen and installed</li>
        <li>☐ Reconnect/retry strategy planned for WebSocket use (if applicable)</li>
        <li>☐ Secrets management in place — no credentials in source control</li>
        <li>☐ Read <a href="#" data-nav="rate-limits">Rate Limits</a> and <a href="#" data-nav="error-handling">Error Handling</a></li>
        <li>☐ Idempotency plan for order placement retries</li>
        <li>☐ If running an algo: reviewed <a href="#" data-nav="algo-compliance">SEBI Algo ID Framework</a>, Algo ID tagging designed in</li>
        <li>☐ Monitoring/alerting plan for unattended processes</li>
      </ul>` },

      { h: "Notes", body: `<p>Treat this list as gating, not optional — most production incidents in trading integrations trace back to one of these being skipped rather than a defect in the API itself. Once every box is checked, continue to <a href="#" data-nav="quick-start">Quick Start (5 minutes)</a> for your first authenticated call.</p>` },
    ],
  },
 

  "quick-start": {
  badge: null,
  desc: "Go from zero to your first authenticated API call in under five minutes.",
  sections: [
    { h: "Overview", body: `<p>This walkthrough gets a single-user script talking to Shoonya end to end: log in via OAuth, fetch a quote, and place one order. It assumes you already have a Shoonya trading account and API access enabled — if not, see <a href="#" data-nav="prerequisites">Prerequisites</a> first.</p>` },
    { h: "1. Install the SDK", body: `${codeBlock("bash", `pip install NorenRestApiOAuth`)}` },
    { h: "2. Install the Requirements", body: `${codeBlock("bash", `pip install -r requirements.txt`)}` },
    { h: "2. Authenticate", body: `<p>Shoonya currently supports OAuth-based login only — there's no TOTP auto-login flow. You'll need the <code>code</code> returned from the OAuth authorize redirect and a SHA256 checksum of <code>client_id + secret_code + auth_code</code> to exchange for a session token. See <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a> for the full authorize URL, redirect handling, and checksum reference.</p>${codeBlock("python", `import os
import hashlib
from NorenRestApiPy.NorenApi import NorenApi

CLIENT_ID   = os.environ["SHOONYA_CLIENT_ID"]
USER_ID     = os.environ["SHOONYA_USER_ID"]
SECRET_CODE = os.environ["SHOONYA_SECRET_CODE"]

# 1. Send the user to the OAuth authorize URL and capture the
#    "code" query param from the redirect back to your app.
#    https://api.shoonya.com/OAuthlogin/authorize/oauth?client_id=Your_Client_id
auth_code = os.environ["SHOONYA_AUTH_CODE"]  # obtained from the redirect

# 2. Compute the checksum GenAcsTok expects.
checksum = hashlib.sha256(
    (CLIENT_ID + SECRET_CODE + auth_code).encode()
).hexdigest()

# 3. Exchange for a session token.
api = NorenApi(host="https://api.shoonya.com/NorenWClientAPI/", websocket="wss://api.shoonya.com/NorenWSAPI/")
session = api.gen_access_token(
    uid=USER_ID,
    code=auth_code,
    appkey=checksum,
)
print("Logged in:", session["susertoken"])`)}` },
    { h: "3. Fetch a quote", body: `${codeBlock("python", `quote = api.get_quotes(exchange="NSE", token="2885")
print(quote["tsym"], quote["lp"])`)}` },
    { h: "4. Place your first order", body: `${codeBlock("python", `order = api.place_order(
    buy_or_sell='B', product_type='C',
    exchange='NSE', tradingsymbol='CANBK-EQ',
    quantity=1, discloseqty=0, price_type='SL-LMT', price=200.00, trigger_price=199.50,
    retention='DAY', remarks='my_order_001',
)
print("Order placed:", order)`)}
    <div class="callout warn"><b>Before you run this</b>The snippet above sends a live market order if pointed at production credentials. Confirm you're on a paper/test account, or set <code>quantity</code> to a size you're comfortable with, before executing.</div>` },
    { h: "What's next", body: `<ul>
      <li>Read <a href="#" data-nav="error-handling">Error Handling</a> and <a href="#" data-nav="rate-limits">Rate Limits</a> before writing anything that runs unattended.</li>
      <li>Move from REST polling to <a href="#" data-nav="websocket-overview">WebSocket streaming</a> for live prices and order updates.</li>
      <li>If you're building for other traders (not just yourself), read <a href="#" data-nav="vendors-partners">For Vendors / Partners</a> and <a href="#" data-nav="algo-compliance">SEBI Algo ID Framework</a> — both are mandatory for multi-user or algo deployments.</li>
    </ul>` },
  ],
},

  "auth-overview": {
  badge: null,
  desc: "How to authenticate against Shoonya, and what to know before you start.",
  sections: [
    { h: "Overview", body: `<p>Every Shoonya API call runs against an authenticated session. Shoonya issues a <code>Acesstoken</code> after a successful login, which you attach to every subsequent request. There is no separate long-lived API key model — the token itself is your credential for the trading day.</p>` },
    { h: "How to authenticate", body: `
    <div class="card-grid">
      <div class="mini-card"><div class="k">All integrations</div><div class="v">Manual Login (OAuth) — see <a href="#" data-nav="manual-login-oauth">guide</a></div></div>
      <div class="mini-card"><div class="k">Ending a session</div><div class="v"><a href="#" data-nav="logout">Logout</a></div></div>
    </div>
    <p>OAuth is currently the only supported login flow — there is no TOTP auto-login and no separate token-renewal endpoint. See <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a> for the full authorize URL, redirect handling, and checksum reference.</p>` },
    { h: "Session lifetime", body: `<p>Sessions are valid for the trading day and are invalidated at the daily server reset, regardless of activity. Since there's no renewal call, build your automation to re-run the full OAuth login flow once per day rather than assuming a persistent long-running token — see <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a> for how to automate this.</p>
    <div class="callout"><b>Convention</b>Every endpoint in this documentation that requires auth expects the token as a Bearer header: <code>Authorization: Bearer &lt;Acesstoken&gt;</code>.</div>` },
    { h: "Security notes", body: `<ul>
      <li>Never hardcode <code>client_id</code>, <code>secret_code</code>, or the OAuth <code>code</code>/checksum in source control — load them from environment variables or a secrets manager.</li>
      <li>Treat <code>Acesstoken</code> as a bearer credential with the same sensitivity as a password: don't log it, don't put it in error messages sent to third-party monitoring tools.</li>
      <li>If you suspect a token has leaked, call <a href="#" data-nav="logout">Logout</a> immediately to invalidate the session rather than waiting for the daily reset.</li>
    </ul>` },
    { h: "Notes", body: `<p>OAuth-specific security considerations (state parameter, PKCE, redirect URI validation) are covered on <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a>.</p>` },
  ],
},

  "api-structure": {
  badge: null,
  desc: "Common conventions shared across every Shoonya API endpoint — base URL, request format, authentication, and response shape.",
  sections: [
    { h: "Overview", body: `<p>Every REST endpoint in this documentation follows the same structural conventions. Understanding them once here means you won't need them repeated on every individual API page — only the endpoint-specific <code>jData</code> fields differ.</p>` },
    { h: "Base URL", body: `
    <table class="param-table">
      <tr><td><b>REST base</b></td><td><code>https://api.shoonya.com/NorenWClientAPI/</code></td></tr>
      <tr><td><b>WebSocket base</b></td><td><code>wss://api.shoonya.com/NorenWSAPI/</code></td></tr>
      <tr><td><b>EOD/historical data base</b></td><td><code>https://api.shoonya.com/chartapi/getdata/</code></td></tr>
    </table>
    <p>All endpoint paths in this documentation are given relative to the REST base — e.g. <code>Logout</code> resolves to <code>https://api.shoonya.com/NorenWClientAPI/Logout</code>.</p>` },
    { h: "Authentication", body: `<p>Every authenticated call carries the access token as a <code>Bearer</code> token in the <code>Authorization</code> header, obtained via the <a href="#" data-nav="manual-login-oauth">OAuth login flow</a>:</p>
    ${codeBlock("text", `Authorization: Bearer <AccessToken>`)}
    <p>Unlike some other Noren-based gateways, the token is <strong>not</strong> repeated inside the request body — only in the header.</p>` },
    { h: "Request format", body: `<p>All requests use <code>Content-Type: text/plain</code> with a single URL-encoded-style field, <code>jData</code>, carrying the JSON-encoded payload as the request body:</p>
    ${codeBlock("text", `jData=<JSON payload>`)}
    <p>Example — placing an order:</p>
    ${codeBlock("bash", `curl -X POST https://api.shoonya.com/NorenWClientAPI/PlaceOrder \\
  -H "Content-Type: text/plain" \\
  -H "Authorization: Bearer <AccessToken>" \\
  -d 'jData={"exch":"NSE","tsym":"CANBK-EQ","qty":"1","buy_or_sell":"B"}'`)}` },
    { h: "Response format", body: `<p>Every response is a JSON object carrying at minimum a <code>stat</code> field:</p>
    <table class="param-table">
      <tr><th>Field</th><th>Values</th><th>Description</th></tr>
      <tr><td><code>stat</code></td><td><code>Ok</code> / <code>Not_Ok</code></td><td>Present on every response — check this first before reading any other field.</td></tr>
      <tr><td><code>emsg</code></td><td>string</td><td>Present only when <code>stat</code> is <code>Not_Ok</code> — human-readable error detail. See <a href="#" data-nav="error-handling">Error Handling</a>.</td></tr>
    </table>
    <p>Successful responses add endpoint-specific fields alongside <code>stat</code> — these are documented individually on each API's Response section.</p>` },
    { h: "Field naming conventions", body: `<ul>
      <li>Request/response field names are short, lowercase, and often abbreviated (<code>tsym</code>, <code>qty</code>, <code>prc</code>, <code>trgprc</code>) — see the <a href="#" data-nav="glossary">Glossary</a> for the full list.</li>
      <li>Coded fields (<code>exch</code>, <code>buy_or_sell</code>, <code>price_type</code>, <code>product_type</code>) take fixed short codes, not free text — see <a href="#" data-nav="exchange-segment-codes">Exchange Segment Codes</a>, <a href="#" data-nav="transaction-type-codes">Transaction Type Codes</a>, and <a href="#" data-nav="order-type-codes">Order Type Codes</a>.</li>
      <li>Numeric values (quantity, price) are typically sent as strings within the JSON payload, not native JSON numbers — follow the exact type shown in each endpoint's Request example.</li>
    </ul>` },
    { h: "Related", body: `<p>See <a href="#" data-nav="auth-overview">Authentication Overview</a> for the full OAuth login sequence, <a href="#" data-nav="error-handling">Error Handling</a> for the complete error response taxonomy, and <a href="#" data-nav="rate-limits">Rate Limits</a> for request quotas.</p>` },
  ],
},
 

"error-handling": {
  badge: null,
  desc: "How errors are surfaced across the API, common emsg values, and recommended retry behavior.",
  sections: [
    { h: "Overview", body: `<p>Shoonya APIs do not use HTTP status codes to signal application-level failures — a request can return <code>HTTP 200</code> and still represent a failed operation. Always check the <code>stat</code> field in the response body first, per <a href="#" data-nav="api-structure">API Structure</a>, before treating a response as successful.</p>` },
    { h: "Response shape", body: `
    <table class="param-table">
      <tr><th>Field</th><th>Values</th><th>Description</th></tr>
      <tr><td><code>stat</code></td><td><code>Ok</code> / <code>Not_Ok</code></td><td>Present on every response. <code>Not_Ok</code> means the call failed at the application level, regardless of HTTP status.</td></tr>
      <tr><td><code>emsg</code></td><td>string</td><td>Present only when <code>stat</code> is <code>Not_Ok</code>. Human-readable, not a stable error code — match on substring, not exact string, since wording can vary slightly by cause.</td></tr>
    </table>
    ${codeBlock("json", `{
  "stat": "Not_Ok",
  "emsg": "Invalid Session Key"
}`)}` },
    { h: "Common error categories", body: `
    <table class="param-table">
      <tr><th>emsg contains</th><th>Meaning</th><th>Typical fix</th></tr>
      <tr><td><code>Invalid Session Key</code> / <code>Session Expired</code></td><td>The access token is missing, malformed, or has been invalidated (including by an explicit <a href="#" data-nav="logout">Logout</a>).</td><td>Re-run the <a href="#" data-nav="manual-login-oauth">OAuth login flow</a> to obtain a fresh token.</td></tr>
      <tr><td><code>User Not enabled on : API</code></td><td>The account isn't provisioned for API access at all.</td><td>Contact support/onboarding to enable API access on the account before calling any endpoint.</td></tr>
      <tr><td><code>Invalid IP</code> / IP-related</td><td>The request originated from an IP address not whitelisted for this account.</td><td>Confirm your outbound IP is registered — this is coordinated with the internal team (Akshay handles IP whitelisting) before API access will accept traffic from a new address. Not retryable until the IP is added.</td></tr>
      <tr><td><code>Invalid Input : INVALID_VERIFIER</code></td><td>The OAuth code verifier (PKCE) sent during token exchange doesn't match the one used to generate the original auth code/challenge.</td><td>Regenerate the code verifier/challenge pair and restart the <a href="#" data-nav="manual-login-oauth">OAuth login flow</a> from the beginning — a stale or reused verifier from a previous login attempt cannot be reused.</td></tr>
      <tr><td><code>Rate_Limited</code></td><td>Request rate exceeded the limits in <a href="#" data-nav="rate-limits">Rate Limits</a>.</td><td>Back off and retry — see Retry Guidance below. Do not retry immediately in a tight loop.</td></tr>
      <tr><td><code>Server Timeout</code></td><td>The backend didn't respond within its internal timeout window — transient, not caused by the request itself.</td><td>Safe to retry once after a short delay; if it persists, treat as a service issue rather than a client bug.</td></tr>
      <tr><td><code>Invalid Input</code> (general)</td><td>A required field is missing, malformed, or fails validation (bad <code>exch</code>/<code>tsym</code>, wrong type, out-of-range price, etc.).</td><td>Check the field list and coded values on the specific endpoint's page — see <a href="#" data-nav="exchange-segment-codes">Exchange Segment Codes</a>, <a href="#" data-nav="order-type-codes">Order Type Codes</a>. Not retryable without changing the request.</td></tr>
      <tr><td><code>Insufficient Funds</code> / margin-related</td><td>The order fails RMS margin checks.</td><td>Check available margin via <a href="#" data-nav="funds-limits">Funds & Limits</a> before resubmitting. See <a href="#" data-nav="risk-management">Risk Management (RMS)</a>.</td></tr>
    </table>` },
    { h: "Related", body: `<p>See <a href="#" data-nav="rate-limits">Rate Limits</a> for quota-specific throttling details and <a href="#" data-nav="glossary">Glossary</a> for term definitions used in error messages.</p>` },
  ],
},











  "rate-limits": {
    badge: null,
    desc: "Request quotas per endpoint category, throttling behavior, and how to design around them.",
    sections: [
      { h: "Overview", body: `<p>Shoonya enforces per-second and per-day request quotas, scoped separately for order APIs, data APIs, and the WebSocket connect handshake. Limits exist to protect exchange connectivity shared across all users, not to discourage automation — design for them from the start rather than retrofitting backoff logic later.</p>` },
      { h: "Limits", body: `
      <table class="param-table">
        <tr><th>Category</th><th>Limit</th><th>Notes</th></tr>
        <tr><td>Order placement / modify / cancel</td><td>~10 req/sec, burst-limited</td><td>Applies per user, across <a href="#" data-nav="place-order">Place</a>, <a href="#" data-nav="modify-order">Modify</a>, <a href="#" data-nav="cancel-order">Cancel</a>. To register for a higher rate you must have an approved <a href="#" data-nav="algo-compliance">SEBI Algo ID</a> and check the corresponding box on the <a href="#" data-nav="ip-whitelisting">IP Whitelisting Guide</a> screen.</td></tr>
        <tr><td>Market data (REST)</td><td>~1 req/sec per instrument</td><td>Use <a href="#" data-nav="websocket-overview">WebSocket</a> instead of polling for anything continuous.</td></tr>
        <tr><td>WebSocket connect</td><td>1 connection per session</td><td>Multiplex all symbol subscriptions over the single socket.</td></tr>
        <tr><td>Historical Data</td><td>Lower burst allowance</td><td>Batch date ranges instead of looping day-by-day.</td></tr>
      </table>
      <p>Exact numeric ceilings are enforced server-side and may be tuned without notice — treat the table above as design guidance, not a contract, and always handle <code>Rate_Limited</code> defensively.</p>` },
      { h: "How throttling responds", body: `${codeBlock("json", `{
  "stat": "Not_Ok",
  "emsg": "Rate_Limited: too many requests, retry after backoff"
}`)}` },
      { h: "Best practices", body: `<ul>
        <li>Batch symbol lookups and quote checks; don't issue one REST call per instrument in a loop.</li>
        <li>Implement exponential backoff with jitter on <code>Rate_Limited</code> responses — a fixed retry interval synchronizes retries across your own threads and makes bursts worse.</li>
        <li>Separate your order-management traffic from your market-data traffic so a data-heavy loop never starves order placement of its share of the quota.</li>
        <li>Prefer the WebSocket feed for anything that needs to observe more than a handful of instruments continuously.</li>
      </ul>` },
      { h: "Python example", body: `${codeBlock("python", `import time

def call_with_backoff(fn, *args, max_retries=5, **kwargs):
    delay = 0.5
    for attempt in range(max_retries):
        resp = fn(*args, **kwargs)
        if resp.get("stat") != "Not_Ok" or "Rate_Limited" not in resp.get("emsg", ""):
            return resp
        time.sleep(delay)
        delay *= 2
    raise RuntimeError("Exceeded retries after repeated Rate_Limited responses")`)}` },
      { h: "Notes", body: `<p>Vendor/partner integrations with higher aggregate volume should discuss dedicated quota tiers during onboarding — see <a href="#" data-nav="vendors-partners">For Vendors / Partners</a>.</p>` },
    ],
  },

  //Changelogs
  "changelog": {
  badge: null,
  desc: "A running history of API changes — new endpoints, breaking changes, deprecations, and compliance updates.",
  sections: [
    { h: "Overview", body: `<p>This page tracks changes to the Shoonya API surface over time. Breaking changes are called out explicitly. Subscribe to the <a href="#" data-nav="vendors-partners">Vendors / Partners</a> notification list if you need advance notice before a breaking change ships.</p>` },
    { h: "2026", body: `
    <div class="changelog-entry">
      <div class="changelog-date">April 1, 2026 <span class="changelog-tag changelog-tag--breaking">Breaking</span></div>
      <ul>
        <li>Static IP whitelisting is now mandatory for order placement APIs, per SEBI's retail algo framework. Orders from unregistered IPs are rejected. See <a href="#" data-nav="auth-overview">Authentication Overview</a>.</li>
        <li>SEBI Algo ID tagging is now required on every order — placements, modifications, and cancellations all carry a unique exchange-issued identifier. See <a href="#" data-nav="algo-compliance">SEBI Algo ID Framework</a>.</li>
      </ul>
    </div>
    <div class="changelog-entry">
      <div class="changelog-date">March 2026 <span class="changelog-tag changelog-tag--docs">Docs</span></div>
      <ul>
        <li>Clarified WebSocket token subscription limit (500 tokens/connection) and market quotes rate limit (15 req/sec) on the <a href="#" data-nav="rate-limits">Rate Limits</a> page — previously stated only as approximate.</li>
        <li>Added a dedicated SEBI Algo ID threshold explainer to the Rate Limits page, clarifying the 10 OPS boundary between regular API use and mandatory algo registration.</li>
      </ul>
    </div>
    ` },
    { h: "2025", body: `
    <div class="changelog-entry">
      <div class="changelog-date">August 1, 2025 <span class="changelog-tag changelog-tag--breaking">Breaking</span></div>
      <ul>
        <li>Order-side rate limiting introduced: 10 requests/sec across Place, Modify, Cancel, and GTT order APIs, aligned to the SEBI OPS threshold.</li>
        <li>Multiple static IP support added — up to 2 IPs can now be linked to a single API key.</li>
      </ul>
    </div>
    ` },
    { h: "Notes", body: `<p>Entries are listed newest-first within each year. For endpoint-level parameter changes not significant enough to warrant a changelog entry, check the individual API reference page — request/response schemas are versioned inline.</p>` },
  ],
},

  // ---------- B. AUTHENTICATION ----------
  "login-flow-overview": {
  badge: null,
  desc: "The end-to-end OAuth handshake — redirect, authorization code, checksum-verified token exchange.",
  sections: [
    { h: "Overview", body: `<p>Shoonya's OAuth login is a 4-step redirect-and-exchange flow. Your application never sees the user's password — Noren's own hosted login page collects credentials, and your backend only ever handles a short-lived authorization code and the resulting access token.</p>` },
    { h: "Flow diagram", body: `
    <svg width="100%" viewBox="0 0 680 400" role="img" style="max-width:680px;">
      <title>Shoonya OAuth login flow</title>
      <desc>Four-step diagram: the third-party app redirects to Noren login, receives an auth code, exchanges it for an access token via a checksum-protected POST, and gets the access token back.</desc>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </marker>
      </defs>
      <g fill="#E6F1FB" stroke="#185FA5" stroke-width="0.5">
        <rect x="50" y="40" width="190" height="56" rx="8"/>
      </g>
      <text x="145" y="60" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="500" fill="#0C447C">Third-party app</text>
      <text x="145" y="78" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#185FA5">Client</text>

      <g fill="#E1F5EE" stroke="#0F6E56" stroke-width="0.5">
        <rect x="440" y="40" width="190" height="56" rx="8"/>
      </g>
      <text x="535" y="60" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="500" fill="#085041">Noren login</text>
      <text x="535" y="78" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#0F6E56">OAuth screen</text>

      <g fill="#E6F1FB" stroke="#185FA5" stroke-width="0.5">
        <rect x="50" y="280" width="190" height="80" rx="8"/>
      </g>
      <text x="145" y="300" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="500" fill="#0C447C">Third-party app server</text>
      <text x="145" y="318" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#185FA5">Backend</text>

      <g fill="#E1F5EE" stroke="#0F6E56" stroke-width="0.5">
        <rect x="440" y="280" width="190" height="80" rx="8"/>
      </g>
      <text x="535" y="300" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="500" fill="#085041">Noren server</text>
      <text x="535" y="318" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#0F6E56">GenAcsTok</text>

      <text x="340" y="54" text-anchor="middle" font-size="12" fill="#555">1. Redirect · client_id</text>
      <line x1="240" y1="68" x2="440" y2="68" stroke="#555" stroke-width="1" marker-end="url(#arrow)"/>

      <text x="340" y="178" text-anchor="middle" font-size="12" fill="#555">2. Redirect back · code</text>
      <path d="M535 96 L535 190 L145 190 L145 280" fill="none" stroke="#555" stroke-width="1" marker-end="url(#arrow)"/>

      <text x="340" y="284" text-anchor="middle" font-size="12" fill="#555">3. POST · code, checksum</text>
      <line x1="240" y1="298" x2="440" y2="298" stroke="#555" stroke-width="1" marker-end="url(#arrow)"/>

      <text x="340" y="346" text-anchor="middle" font-size="12" fill="#555">4. access_token</text>
      <line x1="440" y1="330" x2="240" y2="330" stroke="#555" stroke-width="1" marker-end="url(#arrow)"/>
    </svg>
    ` },
    { h: "Step-by-step", body: `
    <table class="param-table">
      <tr><th>Step</th><th>Direction</th><th>Params</th><th>Details</th></tr>
      <tr><td>1</td><td>Third-party app → Noren login</td><td><code>client_id</code></td><td>Redirect the user's browser to the OAuth authorize URL.</td></tr>
      <tr><td>2</td><td>Noren login → Third-party app</td><td><code>code</code></td><td>After the user logs in, Noren redirects back with a short-lived authorization code.</td></tr>
      <tr><td>3</td><td>Third-party app server → Noren server</td><td><code>code</code>, <code>checksum</code></td><td>Server-to-server POST to <code>GenAcsTok</code>, exchanging the code for an access token.</td></tr>
      <tr><td>4</td><td>Noren server → Third-party app server</td><td><code>access_token</code></td><td>The access token is returned and used as the <code>Bearer</code> token for all subsequent API calls.</td></tr>
    </table>` },
    { h: "Related", body: `<p>See <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a> for the full request/response payloads and the checksum calculator, and <a href="#" data-nav="vendors-partners">For Vendors / Partners</a> for the vendor-specific variant of step 1.</p>` },
  ],
},


  "totp-setup-guide": {
    desc: "Enroll TOTP-based two-factor authentication on your account so scripts can log in without manual OTP entry.",
    sections: [
      { h: "Overview", body: `<p>Shoonya's programmatic login replaces the SMS/app OTP step with a TOTP (Time-based One-Time Password) secret, the same standard used by Google Authenticator. Once enrolled, your script generates the current OTP locally instead of waiting on an SMS.</p>` },
      { h: "Enrollment steps", body: `<ol>
        <li>Log in to the Shoonya web terminal and open <b>Profile → Security → TOTP Setup</b>.</li>
        <li>Scan the displayed QR code with an authenticator app, or copy the raw base32 secret shown below it.</li>
        <li>Enter the 6-digit code your app generates to confirm enrollment.</li>
        <li>Store the base32 secret — this is what your code uses to generate OTPs programmatically. It is shown only once.</li>
      </ol>
      <div class="callout warn"><b>One secret, two purposes</b>The same TOTP secret can drive both your phone's authenticator app and your script. If you lose it, you'll need to re-enroll from the web terminal — Shoonya cannot recover a lost secret.</div>` },
      { h: "Generating OTPs in code", body: `${codeBlock("python", `import pyotp

totp = pyotp.TOTP("YOUR_BASE32_SECRET")
current_otp = totp.now()
print(current_otp)  # 6-digit code, valid ~30 seconds`)}` },
      { h: "Best practices", body: `<ul>
        <li>Store the TOTP secret with the same care as a password — anyone with it can generate valid login codes for your account.</li>
        <li>Keep the host machine's clock synced (NTP) — TOTP codes are time-window based and drift causes login failures.</li>
        <li>Re-enroll immediately if you ever suspect the secret has been exposed; the old secret is invalidated the moment a new one is generated.</li>
      </ul>` },
      { h: "Notes", body: `<p>Continue to <a href="#" data-nav="auto-login-totp">Auto Login (TOTP)</a> to use this secret in an authenticated request.</p>` },
    ],
  },

  "auto-login-totp": {
  badge: "Coming Soon",
  desc: "Automated login using Time-based One-Time Password (TOTP) — eliminates manual OTP entry during the OAuth login flow.",
  sections: [
    { h: "Overview", body: `<p>The Auto Login (TOTP) endpoint is planned to allow developers to programmatically generate and submit time-based OTPs during the login flow, removing the need to manually fetch and enter OTPs sent via SMS/Email during automation or headless login scripts.</p>
    <p>This feature is currently <strong>under development</strong> and not yet available. This page will be updated with endpoint details, request/response formats, and usage examples once released.</p>` },
    { h: "What to Expect", body: `<ul>
      <li>A dedicated endpoint to submit a TOTP secret instead of manual OTP entry</li>
      <li>Compatibility with the existing OAuth login flow (<code>GenAcsTok</code> checksum-based token exchange)</li>
      <li>Support for headless/automated login scripts without SMS/Email OTP dependency</li>
      <li>Standard <code>x-www-form-urlencoded</code> request format, consistent with other Shoonya endpoints</li>
    </ul>` },
    { h: "Related", body: `<p>See <a href="#" data-nav="totp-setup-guide">TOTP Setup Guide</a> for instructions on generating and registering your TOTP secret once this feature is released, and <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a> for the current login flow.</p>` },
    { h: "Current Alternative", body: `<p>Until this endpoint is released, continue using the standard OAuth login flow with manual OTP entry, or Selenium-based automated login scripts that handle OTP retrieval externally.</p>
    <div class="note-box"><strong>Note:</strong> Have a use case for TOTP-based login? Reach out to the API support team to share your requirements.</div>` },
  ],
},



  "ip-whitelisting": {
  badge: null,
  desc: "Register the static IP address(es) your API requests will originate from — required before the OAuth login flow will work.",
  sections: [
    { h: "Overview", body: `<p>Shoonya only accepts authenticated API requests from IP addresses you've explicitly registered against your Client ID. Before you can complete the <a href="#" data-nav="manual-login-oauth">OAuth login flow</a> or call any endpoint, you need to whitelist the static IP (or IPs) your requests will come from, using the API Key Generation screen inside the trading account.</p>` },
    { h: "Purpose", body: `<p>This is a one-time (or occasional, if your server IP changes) setup step — do this before writing any integration code, not while debugging a mysterious auth failure. It's also where you'll find your <code>Client ID</code> and <code>Secret Code</code>, both required inputs for the <a href="#" data-nav="manual-login-oauth">GenAcsTok checksum</a>.</p>` },
    { h: "Steps", body: `<ol>
      <li>Log in to your Shoonya trading account (web).</li>
      <li>Click your profile icon, then open <strong>API Key Generation</strong>.</li>
      <li>Confirm the <strong>Client ID</strong> shown matches the account you intend to trade through.</li>
      <li>Reveal (eye icon) and copy the <strong>Secret Code</strong> — this is the <code>secret_code</code> input to the <a href="#" data-nav="manual-login-oauth">GenAcsTok checksum</a>. Treat it like a password; never commit it to source control.</li>
      <li>Confirm the <strong>URL</strong> field reads <code>https://api.shoonya.com/OAuthlogin/authorize/oauth</code> — this is the OAuth authorize endpoint your login flow redirects to.</li>
      <li>Enter your <strong>Primary IP Address</strong> — the static public IPv4 address your requests will originate from (your server/VPS IP, not your laptop's home/office IP unless that's genuinely static).</li>
      <li>Optionally set a <strong>Backup IP Address</strong> if you run a failover server.</li>
      <li>If you expect to exceed 10 orders/second, check <strong>"Applicable for more than 10 orders per second"</strong> — see the callout below before enabling this.</li>
      <li>Click <strong>Update</strong> to save.</li>
    </ol>` },
    { h: "IP address format", body: `<p>Only <strong>IPv4 and IPv6 are supported</strong>for the primary/backup IP fields. Both full and compressed IPv6 formats are accepted. For example, <code>2001:0db8:0000:0000:0000:ff00:0042:8329</code> and the compressed format <code>2001:db8::ff00:42:8329</code> are valid IPv6 addresses.</p>
    <div class="callout warn"><b>Static IP required</b>The registered IP must be static. If you're running from a residential/dynamic-IP connection, requests will start failing with an auth/IP error whenever your ISP reassigns your address — host your integration on a server or VPS with a fixed IP instead.</div>` },
    { h: "Order-rate checkbox and Algo ID", body: `<p>The <strong>"Applicable for more than 10 orders per second"</strong> checkbox is not a self-service performance toggle — ~10 orders/sec is the standard per-user order-placement ceiling described on <a href="#" data-nav="rate-limits">Rate Limits</a>. To legitimately exceed it, you must first submit your strategy to the exchange and obtain a SEBI Algo ID; see <a href="#" data-nav="algo-compliance">SEBI Algo ID Framework</a> for the approval process. Checking this box without a corresponding exchange-approved Algo ID does not raise your actual throughput — it only tells Shoonya to expect Algo ID-tagged traffic.</p>` },
    { h: "After whitelisting", body: `<p>Once your IP is registered, continue to <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a> to run the authorize → code → checksum → access-token exchange using the Client ID and Secret Code from this screen.</p>` },
    { h: "Troubleshooting", body: `
    <table class="param-table">
      <tr><th>Symptom</th><th>Likely cause</th></tr>
      <tr><td>OAuth/API calls fail immediately, even with a valid checksum</td><td>Requests are originating from an IP that isn't whitelisted — confirm the IP your server actually egresses on (it may differ from the IP you think it has, especially behind NAT/a load balancer) matches what's registered here.</td></tr>
      <tr><td>Worked yesterday, failing today with no code changes</td><td>Your "static" IP was reassigned by your ISP/cloud provider. Re-check and update the Primary IP Address field.</td></tr>
      <tr><td>Works from your laptop, fails from your server</td><td>You whitelisted your laptop's IP during testing instead of your production server's IP — update the field to the server's egress IP before deploying.</td></tr>
    </table>` },
    { h: "Notes", body: `<p>See <a href="#" data-nav="vendors-partners">For Vendors / Partners</a> if you're integrating on behalf of multiple end users rather than trading a single account — vendor platforms generally handle IP whitelisting differently than a standalone OAuth user.</p>` },
  ],
},

 // Python Login (Selenium)
  "python-login-selenium": {
  badge: null,
  desc: "Headless, unattended OAuth login for scheduled jobs — drives the Shoonya login page with Selenium, captures the redirect code automatically, and exchanges it for an access token.",
  sections: [
    { h: "Overview", body: `<p>This automates the same 3-step OAuth flow described in <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a>, but without a human clicking through it. A headless Chrome session fills in the login form (User ID, Password, TOTP), submits it, and sniffs the network log for the redirect <code>code</code> — then exchanges it for an access token via <code>NorenRestApiPy</code>.</p>
    <div class="callout"><b>When to use this</b>Scheduled jobs, cron/systemd timers, or CI environments that need a fresh token before market open with nobody present to complete the OAuth redirect by hand. If a person is present, use <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a> instead — it's simpler and doesn't depend on the login page's DOM.</div>
    <div class="callout"><b>Fragility warning</b>This drives the login page's UI, not a documented API — it depends on the current markup of Shoonya's hosted login screen and can break silently if that page changes. See the Notes section below.</div>` },

    { h: "Prerequisites", body: `<table class="param-table">
      <tr><th>Requirement</th><th>Notes</th></tr>
      <tr><td>Python 3.9+</td><td>Tested against <code>selenium</code> ≥ 4.x</td></tr>
      <tr><td>Chrome + matching chromedriver</td><td>Must resolve on <code>PATH</code>, or pass <code>webdriver.Chrome(service=...)</code></td></tr>
      <tr><td><code>selenium</code>, <code>pyotp</code></td><td><code>pip install selenium pyotp</code></td></tr>
      <tr><td><code>NorenRestApiPy</code></td><td>Used only for the final <code>getAccessToken</code> exchange</td></tr>
      <tr><td>IP whitelisting</td><td>Same requirement as manual OAuth — see <a href="#" data-nav="ip-whitelisting">IP Whitelisting Guide</a></td></tr>
    </table>
    <table class="param-table">
      <tr><th>Environment variable</th><th>Description</th></tr>
      <tr><td><code>SHOONYA_CLIENT_ID</code></td><td>Your app's client/API key (e.g. <code>AB1234_U</code>)</td></tr>
      <tr><td><code>SHOONYA_USER_ID</code></td><td>Login/user ID routed to (e.g. <code>AB1234</code>)</td></tr>
      <tr><td><code>SHOONYA_PASSWORD</code></td><td>Account password</td></tr>
      <tr><td><code>SHOONYA_TOTP_SECRET</code></td><td>32-char base32 TOTP seed used to generate the 6-digit OTP</td></tr>
      <tr><td><code>SHOONYA_API_SECRET</code></td><td>App secret used in the code → token exchange</td></tr>
    </table>
    <div class="callout"><b>Never hard-code these</b>Load all five values from environment variables or a git-ignored secrets file — never commit them to source.</div>` },

    { h: "How it works", body: `<p>Step by step:</p>
    <ol>
      <li>Launches headless Chrome with performance logging enabled.</li>
      <li>Opens the OAuth login URL and waits for the password field to render.</li>
      <li>Fills the first three visible, non-hidden inputs on the page — in order — with User ID, Password, then a freshly generated TOTP code.</li>
      <li>Clicks <b>LOGIN</b>, then polls Chrome's performance log for an outgoing request containing a <code>code=</code> query param — the same redirect described in <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a> Step 2.</li>
      <li>If no code appears within 60 seconds, regenerates the TOTP (in case the 30-second window rolled over) and retries once.</li>
      <li>Tears down the browser, then exchanges the captured code for an access token via <code>NorenApiPy.getAccessToken(...)</code> — equivalent to the <code>GenAcsTok</code> call in Step 3 of the manual flow.</li>
    </ol>` },

    { h: "Full example", body: `${codeBlock("python", `from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import InvalidSessionIdException, WebDriverException
from urllib.parse import urlparse, parse_qs
import pyotp
import time
import json
import os

# ─── CONFIG ───────────────────────────────────────────────────────────
# Load from environment variables (or a git-ignored .env / cred.yml) —
# never hard-code these directly in the script.
CLIENT_ID    = os.environ["SHOONYA_CLIENT_ID"]     # e.g. "AB1234_U"
USER_ID      = os.environ["SHOONYA_USER_ID"]       # e.g. "AB1234"
PASSWORD     = os.environ["SHOONYA_PASSWORD"]
TOTP_SECRET  = os.environ["SHOONYA_TOTP_SECRET"]   # 32-char base32 string
SECRET_CODE  = os.environ["SHOONYA_API_SECRET"]

LOGIN_URL = (
    "https://api.shoonya.com/OAuthlogin/investor-entry-level/login"
    f"?api_key={CLIENT_ID}&route_to={USER_ID}"
)
TOKEN_URL = "https://api.shoonya.com/NorenWClientAPI/GenAcsTok"


def scan_network_for_code(driver):
    try:
        logs = driver.get_log("performance")
        for entry in logs:
            try:
                message = json.loads(entry["message"])["message"]
                if message.get("method") == "Network.requestWillBeSent":
                    url = message.get("params", {}).get("request", {}).get("url", "")
                    if "code=" in url and "shoonya" in url.lower():
                        parsed = urlparse(url)
                        code = parse_qs(parsed.query).get("code", [None])[0]
                        if code:
                            return code
            except Exception:
                continue
    except Exception:
        pass
    return None


def fast_fill(driver, element, value):
    element.click()
    time.sleep(0.1)
    element.clear()
    element.send_keys(value)
    time.sleep(0.1)


# ── Chrome, headless ────────────────────────────────────────────────
options = webdriver.ChromeOptions()
options.add_argument("--headless=new")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--window-size=1920,1080")
options.set_capability("goog:loggingPrefs", {"performance": "ALL"})

driver = webdriver.Chrome(options=options)
wait = WebDriverWait(driver, 30)

auth_code = None

try:
    print("Logging in to Shoonya (background)...")
    driver.get(LOGIN_URL)

    wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "input[type='password']")))
    time.sleep(1)

    all_inputs = driver.find_elements(
        By.CSS_SELECTOR,
        "input:not([type='hidden']):not([type='checkbox']):not([type='radio'])"
    )
    visible_inputs = [inp for inp in all_inputs if inp.is_displayed()]

    fast_fill(driver, visible_inputs[0], USER_ID)
    fast_fill(driver, visible_inputs[1], PASSWORD)

    otp_value = pyotp.TOTP(TOTP_SECRET).now()
    fast_fill(driver, visible_inputs[2], otp_value)

    wait.until(EC.element_to_be_clickable((By.XPATH, "//button[normalize-space()='LOGIN']"))).click()
    print("Credentials submitted. Capturing auth code...")

    start = time.time()
    while True:
        auth_code = scan_network_for_code(driver)
        if auth_code:
            print("Auth code captured.")
            break

        if time.time() - start > 60:
            new_otp = pyotp.TOTP(TOTP_SECRET).now()
            if new_otp != otp_value:
                fast_fill(driver, visible_inputs[2], new_otp)
                wait.until(EC.element_to_be_clickable((By.XPATH, "//button[normalize-space()='LOGIN']"))).click()
                start = time.time()
                otp_value = new_otp
                continue
            print("[TIMEOUT] Could not capture auth code.")
            break

        time.sleep(0.5)

except (InvalidSessionIdException, WebDriverException) as e:
    print(f"[ERROR] Browser issue: {e}")
except Exception as e:
    print(f"[ERROR] {e}")
finally:
    try:
        driver.quit()
    except Exception:
        pass

if not auth_code:
    raise SystemExit("No auth code captured — aborting before token exchange.")

# ── Exchange auth code for an access token ─────────────────────────
from api_helper import NorenApiPy  # noqa: E402

api = NorenApiPy()
result = api.getAccessToken(auth_code, SECRET_CODE, CLIENT_ID, USER_ID)

if result is not None:
    acc_tok, usrid, ref_tok, actid = result
    print(f"Access token retrieved for account: {actid}")
    # Store acc_tok / ref_tok wherever your app reads them from
    # (e.g. write back to the same git-ignored cred file) — avoid
    # printing full tokens to logs in anything but local debugging.
else:
    print("Failed to retrieve access token.")
`)}` },

    { h: "Best practices", body: `<ul>
      <li>Never hard-code <code>CLIENT_ID</code>, <code>PASSWORD</code>, <code>TOTP_SECRET</code>, or <code>API_SECRET</code> — load them from environment variables or a git-ignored secrets file.</li>
      <li>Don't log or print <code>acc_tok</code> / <code>ref_tok</code> in production; the sample only prints the account ID.</li>
      <li>Cache the resulting access token (e.g. in a git-ignored cred file) instead of re-running the full Selenium flow on every process start — tokens are typically valid for the trading day.</li>
      <li>Pin your chromedriver version to your installed Chrome version to avoid silent breakage after browser auto-updates.</li>
      <li>Wrap this in a retry/alerting wrapper if it runs unattended — headless UI automation is inherently more brittle than a documented API call and can break on any login-page redesign.</li>
    </ul>` },

    { h: "Notes", body: `<ul>
      <li>This script drives the login <i>page</i>, not a documented API endpoint — it depends on the current DOM structure of the OAuth login screen and will break if that markup changes.</li>
      <li>Field targeting is positional: it assumes the first three visible, non-hidden <code>&lt;input&gt;</code> elements on the page are, in order, User ID → Password → OTP. If the page adds or reorders fields, this fills the wrong inputs silently rather than erroring — prefer targeting by <code>name</code>/<code>id</code>/<code>placeholder</code> if the login page exposes stable attributes.</li>
      <li><code>NorenApiPy</code> is imported after the <code>try/finally</code> block, deliberately after the browser has already quit — the Selenium portion only needs to produce <code>auth_code</code>; the token exchange itself is a plain HTTPS call, same as Step 3 in <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a>.</li>
      <li>If the TOTP window rolls over mid-submit, the script regenerates the code once and resubmits automatically; it does not retry indefinitely.</li>
    </ul>` },

    { h: "Related", body: `<p>See <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a> for the interactive flow this automates, and <a href="#" data-nav="token-renewal">Token Renewal</a> for refreshing a token without a full re-login.</p>` },
  ],
},




// MAnual Login 
  "manual-login-oauth": {
  badge: null,
  desc: "Interactive OAuth login flow — redirect the user to Shoonya, capture the authorization code, and exchange it for an access token.",
  sections: [
    { h: "Overview", body: `<p>This is the standard 3-step OAuth flow for individual users logging in interactively (as opposed to a headless/vendor integration — see <a href="#" data-nav="vendors-partners">For Vendors / Partners</a> for that variant). The user authenticates directly on Shoonya's own login page — your application never sees their password.</p>
    <div class="callout"><b>Prerequisite</b>Your Client ID's IP address must already be whitelisted and you'll need the Secret Code before step 3 below works — see <a href="#" data-nav="ip-whitelisting">IP Whitelisting Guide</a> if you haven't done this yet.</div>` },
    { h: "Step 1 — Redirect to OAuth URL", body: `<p>Send the user's browser to the authorize endpoint with your app's <code>client_id</code>:</p>
    ${codeBlock("text", `https://api.shoonya.com/OAuthlogin/authorize/oauth?client_id=Your_Client_id`)}
    <p>Replace <code>Your_Client_id</code> with your client id . The user lands on Shoonya's hosted login page and enters their <strong>User ID</strong>, <strong>Password</strong>, and <strong>OTP/TOTP</strong>.</p>` },
    { h: "Step 2 — Receive the authorization code", body: `<p>After successful login, Shoonya redirects back to your registered redirect URL with an authorization <code>code</code> appended as a query parameter. Capture this code — it's short-lived and can only be exchanged once.</p>` },
    { h: "Step 3 — Exchange code for access token", body: `<p>Call <code>GenAcsTok</code> with the authorization code and a checksum, to receive the access token used for all subsequent API calls.</p>
    <table class="param-table">
      <tr><td><b>Method</b></td><td><code>POST</code></td></tr>
      <tr><td><b>URL</b></td><td><code>https://api.shoonya.com/NorenWClientAPI/GenAcsTok</code></td></tr>
      <tr><td><b>Content-Type</b></td><td><code>text/plain</code></td></tr>
      <tr><td><b>Payload</b></td><td><code>jData=&lt;JSON payload&gt;</code></td></tr>
    </table>
    <table class="param-table">
      <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
      <tr><td><code>code</code></td><td>string</td><td>Yes</td><td>The authorization code received in Step 2.</td></tr>
      <tr><td><code>checksum</code></td><td>string</td><td>Yes</td><td><code>SHA256(client_id + secret_key + auth_code)</code> — see calculator below.</td></tr>
    </table>
    ${codeBlock("bash", `curl -X POST https://api.shoonya.com/NorenWClientAPI/GenAcsTok \\
  -H "Content-Type: text/plain" \\
  -d 'jData={"code":"<auth_code>","checksum":"<sha256_hex>"}'`)}` },
    { h: "Response", body: `${codeBlock("json", `{
  "stat": "Ok",
  "susertoken": "<AccessToken>",
  "uid": "ABC1234",
  "actid": "ABC1234"
}`)}
    <p>Use <code>AccessToken</code> as the <code>Bearer</code> token in the <code>Authorization</code> header for all subsequent calls — see <a href="#" data-nav="api-structure">API Structure</a>.</p>` },
    { h: "Checksum calculator", body: `
<div id="checksum-calc" style="border:1px solid #ddd;border-radius:8px;padding:16px;max-width:520px;">
  <div style="margin-bottom:10px;">
    <label style="display:block;font-size:13px;font-weight:600;margin-bottom:4px;">Client ID</label>
    <input id="cc-client-id" type="text" placeholder="Your_Client_id" style="width:100%;padding:8px;box-sizing:border-box;border:1px solid #ccc;border-radius:4px;">
  </div>
  <div style="margin-bottom:10px;">
    <label style="display:block;font-size:13px;font-weight:600;margin-bottom:4px;">Secret Key</label>
    <input id="cc-secret" type="password" placeholder="Your app secret" style="width:100%;padding:8px;box-sizing:border-box;border:1px solid #ccc;border-radius:4px;">
  </div>
  <div style="margin-bottom:10px;">
    <label style="display:block;font-size:13px;font-weight:600;margin-bottom:4px;">Auth Code</label>
    <input id="cc-code" type="text" placeholder="Code from redirect URL" style="width:100%;padding:8px;box-sizing:border-box;border:1px solid #ccc;border-radius:4px;">
  </div>
  <button id="cc-calc-btn" style="padding:8px 16px;border:none;border-radius:4px;background:#c9971e;color:#fff;font-weight:600;cursor:pointer;">Calculate SHA256 Checksum</button>
  <div style="margin-top:12px;">
    <label style="display:block;font-size:13px;font-weight:600;margin-bottom:4px;">Checksum (client_id + secret + auth_code)</label>
    <input id="cc-output" type="text" readonly style="width:100%;padding:8px;box-sizing:border-box;border:1px solid #ccc;border-radius:4px;background:#f7f7f7;font-family:monospace;">
  </div>
</div>
<p style="font-size:13px;color:#666;margin-top:8px;">This calculator runs entirely in the browser — nothing is sent to a server.</p>
` },
 { h: "Related", body: `<p>See <a href="#" data-nav="token-renewal">Token Renewal</a> for refreshing an expired token without a full re-login, and <a href="#" data-nav="logout">Logout</a> for invalidating the token when done.</p>` },
  ],
},


// Python login






 




// Token Renewal 

"token-renewal": {
  badge: "Comming Soon",
  desc: "Extending or refreshing an access token without a full re-login. Not currently offered — see what to do instead below.",
  sections: [
    { h: "Not currently available", body: `<div class="stub-box">
      <div><span class="stub-title">Not supported yet</span></div>
      <p>There's no refresh-token or token-renewal endpoint in the Shoonya API — you cannot extend or silently refresh a <code>susertoken</code> before it expires. Once a session token expires or is invalidated, the only way to get a new one is to repeat the full login flow.</p>
    </div>` },

    { h: "What to do instead", body: `<table class="param-table">
      <tr><th>Situation</th><th>What to do</th></tr>
      <tr><td>Token has expired / API calls start returning auth errors</td><td>Re-run the full <a href="#" data-nav="manual-login-oauth">OAuth login flow</a> (authorize → <code>code</code> → <code>GenAcsTok</code> checksum → new <code>susertoken</code>) to get a fresh token.</td></tr>
      <tr><td>Automating login so you don't do this by hand daily</td><td>Use a scheduled headless login (e.g. Selenium-based) to fetch a new token on a timer or at market open, and store it wherever your app reads credentials from.</td></tr>
      <tr><td>Long-running processes (bots, dashboards)</td><td>Handle auth-error responses defensively — catch them, re-run the login flow, and retry the failed request rather than assuming the token stays valid indefinitely.</td></tr>
    </table>` },

    { h: "Token lifetime", body: `<p><!-- TODO: confirm and state the actual expiry window here (e.g. "tokens are valid until end of trading day" / "expire after N hours") once confirmed with the API team, so users know how often to re-login. --></p>` },

    { h: "Planning around this?", body: `<p>If you're building something that needs a session to stay alive unattended for long periods, plan for scheduled re-login rather than a renewal call — the login flow itself is quick to automate (see the <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a> page and the checksum calculator on that page).</p>` },
  ],
},

// Validate-hs-token


  "validate-hs-token": {
  badge: { method: "POST", path: "/NorenWClientAPI/ValidateHsToken" },

  desc: "Server-to-server check that confirms a LoginId/token pair issued at login is still valid — used to gate access before handing a user off to an external integration such as Back Office.",

  sections: [

    // ---------------------------------------------------------------
    { h: "API Endpoint", body: `
      <table class="param-table">
        <tr><td><b>Method</b></td><td><code>POST</code></td></tr>
        <tr><td><b>URL</b></td><td><code>https://api.shoonya.com/NorenWClientAPI/ValidateHsToken</code></td></tr>
        <tr><td><b>Content-Type</b></td><td><code>application/x-www-form-urlencoded</code></td></tr>
        <tr><td><b>Payload</b></td><td><code>LoginId=&lt;sLoginId&gt;&amp;token=&lt;token&gt;</code> — plain form fields, not a <code>jData</code>/<code>jKey</code> envelope.</td></tr>
      </table>
    ` },

    // ---------------------------------------------------------------
    { h: "Overview", body: `
      <p>Validate HS Token lets a third-party server confirm that a <code>LoginId</code> and <code>token</code> pair, handed to it by the trading site on redirect, is genuine and still active — before it grants that user access on its own end. This is the check step in an external integration flow: trading site → redirect with credentials → third party validates server-side → third party grants access.</p>
      <div class="callout warn"><b>Server-to-server only</b>Call this from your backend, never from a browser or a client-side APK. The <code>token</code> is a live session credential — sending this request from the client would expose it in the same request meant to validate it.</div>
    ` },

    // ---------------------------------------------------------------
    { h: "Parameters", body: `
      <table class="param-table">
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Required</th>
          <th>Description</th>
          <th>Allowed Values</th>
        </tr>

        <tr>
          <td>LoginId</td>
          <td>string</td>
          <td><span class="req-tag">Required</span></td>
          <td>The <code>sLoginId</code> value received from the Initiator site at login.</td>
          <td>Account-specific</td>
        </tr>

        <tr>
          <td>token</td>
          <td>string</td>
          <td><span class="req-tag">Required</span></td>
          <td>The key obtained on successful login, passed along with <code>LoginId</code> to the third-party URL.</td>
          <td>Session-specific</td>
        </tr>
      </table>
    ` },

    // ---------------------------------------------------------------
    { h: "Request Examples", body: `${codeTabs("validate-hs-token-req", {
      python: `import requests

payload = {
    "LoginId": "FA12345",
    "token": "6f1a2c9e-8b3d-4a11-9e77-example-token",
}

response = requests.post(
    "https://api.shoonya.com/NorenWClientAPI/ValidateHsToken",
    data=payload,
)

# response body is plain text — "TRUE" or "FALSE", not JSON
is_valid = response.text.strip() == "TRUE"
print("Token valid:", is_valid)`,

      javascript: `const payload = new URLSearchParams({
  LoginId: "FA12345",
  token: "6f1a2c9e-8b3d-4a11-9e77-example-token",
});

try {
  const res = await fetch("https://api.shoonya.com/NorenWClientAPI/ValidateHsToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload,
  });

  // plain text response — "TRUE" or "FALSE"
  const text = await res.text();
  const isValid = text.trim() === "TRUE";
  console.log("Token valid:", isValid);
} catch (err) {
  console.error("Network/timeout error validating token:", err);
}`,

      curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/ValidateHsToken \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode "LoginId=FA12345" \\
  --data-urlencode "token=6f1a2c9e-8b3d-4a11-9e77-example-token"`,

      java: `String body = "LoginId=" + URLEncoder.encode("FA12345", StandardCharsets.UTF_8)
    + "&token=" + URLEncoder.encode(token, StandardCharsets.UTF_8);

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.shoonya.com/NorenWClientAPI/ValidateHsToken"))
    .header("Content-Type", "application/x-www-form-urlencoded")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

// plain text — "TRUE" or "FALSE"
boolean isValid = response.body().trim().equals("TRUE");
System.out.println("Token valid: " + isValid);`,

      csharp: `using var client = new HttpClient();
var content = new FormUrlEncodedContent(new[]
{
    new KeyValuePair<string, string>("LoginId", "FA12345"),
    new KeyValuePair<string, string>("token", accessToken),
});

var response = await client.PostAsync(
    "https://api.shoonya.com/NorenWClientAPI/ValidateHsToken", content);

// plain text — "TRUE" or "FALSE"
var text = (await response.Content.ReadAsStringAsync()).Trim();
bool isValid = text == "TRUE";
Console.WriteLine($"Token valid: {isValid}");`,
    })}` },

    // ---------------------------------------------------------------
    { h: "Response", body: `
      ${codeBlock("text", `// Valid — HTTP 200
TRUE

// Invalid LoginId or token — HTTP 200
FALSE`)}
      <div class="callout warn"><b>Plain text, not JSON</b>The response body is the literal string <code>TRUE</code> or <code>FALSE</code> — there is no <code>stat</code>/<code>emsg</code> envelope here, unlike most other endpoints. Compare the trimmed response body directly; don't attempt to JSON-parse it.</div>
      <table class="param-table">
        <tr><th>Value</th><th>Meaning</th></tr>
        <tr><td><code>TRUE</code></td><td>Token is valid for the given LoginId.</td></tr>
        <tr><td><code>FALSE</code></td><td>Invalid User Id or Token — treat identically to a failed auth check; don't try to distinguish the two causes from the response alone.</td></tr>
      </table>
    ` },

    // ---------------------------------------------------------------
    { h: "External Integration Flow", body: `
      <div class="flow-diagram" style="font-weight:700; font-size:1.05em; letter-spacing:0.02em; line-height:2.4; padding:20px 24px; border:2px solid currentColor; border-radius:8px; font-family:monospace; white-space:normal; word-break:break-word;">
        User&nbsp;clicks&nbsp;link → Trading&nbsp;site&nbsp;passes&nbsp;UserId/Token/ClientId → Third-party&nbsp;server&nbsp;calls&nbsp;Validate&nbsp;HS&nbsp;Token → Trading&nbsp;site&nbsp;confirms&nbsp;TRUE/FALSE → Access&nbsp;granted&nbsp;or&nbsp;denied
      </div>
      <table class="param-table">
        <tr><th>Step</th><th>Detail</th></tr>
        <tr><td>1. User action</td><td>User clicks a link on the trading site — e.g. "Back Office login".</td></tr>
        <tr><td>2. Handoff</td><td>Trading site passes <code>User Id</code>, <code>Token</code>, and <code>Client ID</code> to the third-party URL, typically as query params on the redirect.</td></tr>
        <tr><td>3. Server-side validation</td><td>The third party's own server — not its front end — calls Validate HS Token against the trading site's web server.</td></tr>
        <tr><td>4. Access decision</td><td>If the trading site returns <code>TRUE</code>, the third-party application grants the user access; on <code>FALSE</code>, it denies it.</td></tr>
      </table>
    ` },

    // ---------------------------------------------------------------
    { h: "Best Practices", body: `<ul>
      <li>Always validate server-side on receipt of a redirect, even if the trading site's front end already appeared to authenticate the user — the client-side handoff isn't trustworthy on its own.</li>
      <li>Compare the response body as trimmed plain text (<code>"TRUE"</code>/<code>"FALSE"</code>), not as JSON — this endpoint doesn't follow the <code>stat</code>/<code>emsg</code> convention used elsewhere in the API.</li>
      <li>Treat <code>FALSE</code> as a hard deny. Don't retry automatically — an expired or invalid token needs the user to re-authenticate from the trading site, not a repeated validation call.</li>
      <li>Don't cache a <code>TRUE</code> result past the immediate access decision — re-validate on each new redirect rather than trusting a previously-validated token indefinitely, since the underlying session can expire or be invalidated independently. See <a href="#" data-nav="token-renewal">Token Renewal</a>.</li>
      <li>Confirm your server's egress IP is whitelisted before going live — see <a href="#" data-nav="ip-whitelisting">IP Whitelisting Guide</a>.</li>
      <li>If you're integrating as a registered vendor rather than a single account holder, coordinate this flow as part of onboarding — see <a href="#" data-nav="vendors-partners">For Vendors / Partners</a> and <a href="#" data-nav="manual-login-oauth">Manual-Login-Oauth</a> for the login handoff that precedes it.</li>
    </ul>` },

  ],
},


  "vendors-partners": {
  badge: null,
  desc: "Integration path for vendors and platform partners building on Shoonya's API on behalf of their own users.",
  sections: [
    { h: "Overview", body: `<p>Vendors and algo platforms integrating with Shoonya connect via a dedicated OAuth partner flow, separate from an individual user's own <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a>. A vendor integration lets your platform's users authenticate against their own Shoonya account without your platform ever handling their raw credentials.</p>` },
    { h: "Currently integrated vendors", body: `
    <table class="param-table">
      <tr><th>Vendor</th><th>Status</th><th>Static IP required for end users?</th></tr>
      <tr><td>AlgoTest</td><td>Integrated</td><td>No</td></tr>
      <tr><td>Quantman</td><td>Integrated</td><td>No</td></tr>
      <tr><td>Quantiply</td><td>Integrated</td><td>No</td></tr>
      <tr><td>GoCharting</td><td>In progress</td><td>No (once live)</td></tr>
      <tr><td>Tradetron</td><td>Integrated</td><td><strong>Yes — mandatory</strong></td></tr>
    </table>
    <p>For AlgoTest, Quantman, Quantiply, and (once live) GoCharting, the vendor's own integration handles connectivity at the platform level — individual end users of these platforms do <strong>not</strong> need to submit a static IP address to trade through Shoonya. Tradetron is the exception: its integration model requires every end user to register a static IP before their orders will be accepted, same as a standalone <a href="#" data-nav="manual-login-oauth">OAuth</a> user.</p>` },
    { h: "OAuth authorize URL", body: `<p>Vendors initiate the login flow by directing their users to Shoonya's OAuth authorize endpoint:</p>
    ${codeBlock("text", `https://api.shoonya.com/OAuthlogin/authorize/oauth?client_id=Your_app_key`)}
    <p>Replace <code>Your_app_key</code> with the app key issued to your vendor integration. After the user authenticates, Shoonya redirects back to your registered redirect URL with an authorization code, which your backend then exchanges for an access token — see <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a> for the full code-exchange sequence.</p>` },
    { h: "Getting integrated", body: `<ul>
      <li>New vendor integrations require coordination with the API support team before going live — reach out to get an <code>app_key</code> issued and your redirect URL registered.</li>
      <li>Confirm with the team whether your platform's user base falls into the static-IP-required category (like Tradetron) or the exempt category (like AlgoTest/Quantman/Quantiply) — this depends on the specific integration model agreed during onboarding, not solely on request volume.</li>
      <li>If your platform expects order volume near or above the <a href="#" data-nav="rate-limits">10 OPS threshold</a>, that needs to be flagged during onboarding as well, since it affects Algo ID classification per user.</li>
    </ul>` },
    { h: "Related", body: `<p>See <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a> for the token exchange steps following redirect, and <a href="#" data-nav="rate-limits">Rate Limits</a> for the quota/compliance context relevant to high-volume vendor traffic.</p>` },
  ],
},


  

  "logout": {
   badge: { method: "POST", path: "/NorenWClientAPI/Logout"},
  desc: "Terminate the current session with the server.",
  sections: [
    { h: "Overview", body: `<p>Call this endpoint to explicitly invalidate the active session token before your application exits or restarts. Shoonya session tokens are otherwise flushed automatically during the daily Beginning of Day (BOD) process, but an explicit logout is recommended whenever your app controls its own lifecycle — it immediately revokes the token server-side and frees up any WebSocket subscriptions tied to that session.</p>` },
    { h: "API Endpoint", body: `
      <table class="param-table">
        <tr><td><b>Method</b></td><td><code>POST</code></td></tr>
        <tr><td><b>URL</b></td><td><code>https://api.shoonya.com/NorenWClientAPI/Logout</code></td></tr>
        <tr><td><b>Content-Type</b></td><td><code>text/plain</code></td></tr>
        <tr><td><b>Authorization</b></td><td><code>Bearer &lt;AccessToken&gt;</code> — requires a valid <code>AccessToken</code> from <a href="#" data-nav="manual-login-oauth">Login</a>.</td></tr>
        <tr><td><b>Payload</b></td><td><code>jData=&lt;JSON payload&gt;</code></td></tr>
      </table>
    ` },
    { h: "Request", body: `<p>The <code>jData</code> payload:</p>
    <table class="param-table">
      <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
      <tr><td><code>uid</code></td><td>string</td><td>Yes</td><td>User ID of the logged-in session.</td></tr>
    </table>
    ${codeBlock("bash", `curl -X POST https://api.shoonya.com/NorenWClientAPI/Logout \\
  -H "Content-Type: text/plain" \\
  -H "Authorization: Bearer <AccessToken>" \\
  -d 'jData={"uid": "FA12345"}'`)}` },
    { h: "Response", body: `<table class="param-table">
      <tr><th>Field</th><th>Possible value</th><th>Description</th></tr>
      <tr><td><code>stat</code></td><td>Ok or Not_Ok</td><td>Logout success or failure status.</td></tr>
      <tr><td><code>request_time</code></td><td></td><td>Present only on successful logout.</td></tr>
      <tr><td><code>emsg</code></td><td></td><td>Present only if logout fails.</td></tr>
    </table>
    ${codeBlock("json", `{
  "stat": "Ok",
  "request_time": "10:43:41 28-05-2026"
}`)}
    <p>On failure:</p>
    ${codeBlock("json", `{
  "stat": "Not_Ok",
  "emsg": "Server Timeout : "
}`)}` },
    { h: "Python example", body: `${codeBlock("python", `ret = api.logout()
print(ret)`)}` },
    { h: "JavaScript example", body: `${codeBlock("javascript", `const data = { uid: "FA12345" };

const response = await fetch("https://api.shoonya.com/NorenWClientAPI/Logout", {
  method: "POST",
  headers: {
    "Content-Type": "text/plain",
    "Authorization": \`Bearer \${accessToken}\`,
  },
  body: "jData=" + JSON.stringify(data),
});

const result = await response.text();
console.log(result);`)}` },
    { h: "Behavior notes", body: `<ul>
      <li>Once invalidated, the access token cannot be reused — any subsequent API call returns <code>Session Expired</code> and requires a fresh <a href="#" data-nav="manual-login-oauth">OAuth login</a>.</li>
      <li>Logging out does <strong>not</strong> cancel open orders or close positions — it only terminates the API session. Use <a href="#" data-nav="cancel-order">Cancel Order</a> or <a href="#" data-nav="exit-order">Exit Order</a> explicitly if that's the intent.</li>
      <li>Any active WebSocket connection tied to the session is disconnected once the token is invalidated — reconnect with a fresh token rather than reusing the old socket.</li>
    </ul>` },
  ],
},
  

  // ---------- C. TRADING APIs ----------
  "place-order": {
  badge: { method: "POST", path: "/NorenWClientAPI/PlaceOrder" },

  desc: "Submit a new order for execution on the exchange — limit and stop-loss-limit orders only, across equity, F&O, currency, and commodity segments.",

  sections: [

    // ---------------------------------------------------------------
    { h: "API Endpoint", body: `
      <table class="param-table">
        <tr><td><b>Method</b></td><td><code>POST</code></td></tr>
        <tr><td><b>URL</b></td><td><code>https://api.shoonya.com/NorenWClientAPI/PlaceOrder</code></td></tr>
        <tr><td><b>Content-Type</b></td><td><code>application/x-www-form-urlencoded</code></td></tr>
        <tr><td><b>Payload</b></td><td><code>jData=&lt;JSON payload&gt;&amp;jKey=&lt;AccessToken&gt;</code> — requires a valid <code>AccessToken</code> from <a href="#" data-nav="login-flow-overview">Login</a>.</td></tr>
      </table>
    ` },

    // ---------------------------------------------------------------
    { h: "Overview", body: `
      <p>Place Order is the core trading endpoint: every supported order type (<code>LMT</code>, <code>SL-LMT</code>) and every product (intraday, delivery, margin) routes through this one call, differentiated by parameters. Call it from your strategy engine whenever a signal needs to hit the exchange, and pair it with <a href="#" data-nav="order-book">Order Book</a> and the <a href="#" data-nav="order-update-feed">Order Update Feed</a> to track state.</p>
      <div class="callout warn"><b>Not supported</b><code>MKT</code> orders are rejected — only <code>LMT</code> and <code>SL-LMT</code> are accepted. Cover Order (<code>CO</code>) and Bracket Order (<code>BO</code>) are also not available as <code>prd</code> values.</div>
    ` },

    // ---------------------------------------------------------------
    { h: "Rate Limits", body: `
      <p>10 orders/second (OPS) per client, enforced at the OMS layer per SEBI's algo-trading OPS threshold framework.</p>
      <div class="callout warn"><b>Need more than 10 OPS?</b>Submit your strategy to the exchange for approval and obtain an Algo ID. Once empanelled, higher OPS thresholds apply under the exchange's Algo ID framework.</div>
    ` },

    // ---------------------------------------------------------------
    { h: "Parameters", body: `
      <table class="param-table">
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Required</th>
          <th>Description</th>
          <th>Allowed Values</th>
        </tr>

        <tr>
          <td>uid</td>
          <td>string</td>
          <td><span class="req-tag">Required</span></td>
          <td>User ID of the authenticated account.</td>
          <td>Account-specific</td>
        </tr>

        <tr>
          <td>actid</td>
          <td>string</td>
          <td><span class="req-tag">Required</span></td>
          <td>User ID of the authenticated account.</td>
          <td>Account-specific</td>
        </tr>

        <tr>
          <td>exch</td>
          <td>string</td>
          <td><span class="req-tag">Required</span></td>
          <td>Exchange segment. Refer to <a href="#" data-nav="exchange-segment-codes">Exchange Segment Codes</a>.</td>
          <td><code>NSE</code>, <code>BSE</code>, <code>NFO</code>, <code>BFO</code>, <code>CDS</code>, <code>MCX</code></td>
        </tr>

        <tr>
          <td>tsym</td>
          <td>string</td>
          <td><span class="req-tag">Required</span></td>
          <td>Unique id of contract on which order to be placed. (Use the results from Search Script to get the trading symbol &amp; use URL encoding to avoid special-char errors for symbols like <code>M&amp;M</code>.)</td>
          <td>Must exist in <a href="#" data-nav="symbol-master">Symbol Master</a></td>
        </tr>

        <tr>
          <td>qty</td>
          <td>integer</td>
          <td><span class="req-tag">Required</span></td>
          <td>Order quantity. For derivatives, quantity must be in multiples of the exchange lot size.</td>
          <td>&gt; 0, lot-size multiple for derivatives</td>
        </tr>

        <tr>
          <td>prc</td>
          <td>number</td>
          <td><span class="req-tag">Required</span></td>
          <td>Order price. Mandatory for both <code>LMT</code> and <code>SL-LMT</code> orders.</td>
          <td>&gt; 0, within exchange circuit band</td>
        </tr>

        <tr>
          <td>prd</td>
          <td>string</td>
          <td><span class="req-tag">Required</span></td>
          <td>Product type. <code>CO</code> and <code>BO</code> are not supported.</td>
          <td><code>C</code> (CNC), <code>M</code> (NRML), <code>I</code> (MIS)</td>
        </tr>

        <tr>
          <td>prctyp</td>
          <td>string</td>
          <td><span class="req-tag">Required</span></td>
          <td>Order type. <code>MKT</code> orders are not supported.</td>
          <td><code>LMT</code>, <code>SL-LMT</code></td>
        </tr>

        <tr>
          <td>trantype</td>
          <td>string</td>
          <td><span class="req-tag">Required</span></td>
          <td>Transaction type. Refer to <a href="#" data-nav="transaction-type-codes">Transaction Type Codes</a>.</td>
          <td><code>B</code> (Buy), <code>S</code> (Sell)</td>
        </tr>

        <tr>
          <td>ret</td>
          <td>string</td>
          <td><span class="req-tag">Required</span></td>
          <td>Order validity.</td>
          <td><code>DAY</code>, <code>IOC</code></td>
        </tr>

        <tr>
          <td>trgprc</td>
          <td>number</td>
          <td><span class="cond-tag">Conditional</span></td>
          <td>Trigger price. Mandatory when <code>prctyp</code> is set to <code>SL-LMT</code>.</td>
          <td>&gt; 0; omit when <code>prctyp = LMT</code></td>
        </tr>

        <tr>
          <td>dscqty</td>
          <td>integer</td>
          <td><span class="opt-tag">Optional</span></td>
          <td>Disclosed quantity visible to the market.</td>
          <td>0 to <code>qty</code></td>
        </tr>

        <tr>
          <td>remarks</td>
          <td>string</td>
          <td><span class="opt-tag">Optional</span></td>
          <td>User-defined remarks for order tracking and identification.</td>
          <td>Free text</td>
        </tr>

        <tr>
          <td>ordersource</td>
          <td>string</td>
          <td><span class="req-tag">Required</span></td>
          <td>Order source identifier.</td>
          <td><code>API</code></td>
        </tr>

        <tr>
          <td>algo_id</td>
          <td>string</td>
          <td><span class="cond-tag">Conditional</span></td>
          <td>Exchange-approved Algo ID. Mandatory for orders placed under a registered algo strategy per SEBI's algo trading framework; omit for manual/non-algo orders.</td>
          <td>Exchange-issued</td>
        </tr>
      </table>
    ` },

    // ---------------------------------------------------------------
    { h: "Request Examples", body: `${codeTabs("place-order-req", {
      python: `import requests
import json

payload = {
    "uid": "AB1234",
    "actid": "AB1234",
    "exch": "NSE",
    "tsym": "RELIANCE-EQ",
    "qty": "1",
    "dscqty": "0",
    "prc": "180.0",
    "prd": "C",          # C, M, I only — CO/BO not accepted
    "trantype": "B",
    "prctyp": "LMT",      # LMT or SL-LMT only — MKT is rejected
    "ret": "DAY",
    "ordersource": "API",
}
data = f"jData={json.dumps(payload)}&jKey={accessToken}"

response = requests.post(
    "https://api.shoonya.com/NorenWClientAPI/PlaceOrder",
    data=data,
)
result = response.json()

if result.get("stat") == "Ok":
    print("Order placed:", result["norenordno"])
else:
    print("Order rejected:", result.get("emsg"))`,

      javascript: `const payload = {
  uid: "AB1234",
  actid: "AB1234",
  exch: "NSE",
  tsym: "RELIANCE-EQ",
  qty: "1",
  dscqty: "0",
  prc: "180.0",
  prd: "C",          // C, M, I only — CO/BO not accepted
  trantype: "B",
  prctyp: "LMT",      // LMT or SL-LMT only — MKT is rejected
  ret: "DAY",
  ordersource: "API",
};

const data = \`jData=\${JSON.stringify(payload)}&jKey=\${accessToken}\`;

try {
  const res = await fetch("https://api.shoonya.com/NorenWClientAPI/PlaceOrder", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data,
  });
  const result = await res.json();

  if (result.stat === "Ok") {
    console.log("Order placed:", result.norenordno);
  } else {
    console.error("Order rejected:", result.emsg);
  }
} catch (err) {
  console.error("Network/timeout error placing order:", err);
}`,

      curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/PlaceOrder \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode 'jData={"uid":"AB1234","actid":"AB1234","exch":"NSE","tsym":"RELIANCE-EQ","qty":"1","dscqty":"0","prc":"180.0","prd":"C","trantype":"B","prctyp":"LMT","ret":"DAY","ordersource":"API"}' \\
  --data-urlencode "jKey=$ACCESS_TOKEN"`,

      java: `String jData = "{\\"uid\\":\\"AB1234\\",\\"actid\\":\\"AB1234\\",\\"exch\\":\\"NSE\\","
    + "\\"tsym\\":\\"RELIANCE-EQ\\",\\"qty\\":\\"1\\",\\"dscqty\\":\\"0\\","
    + "\\"prc\\":\\"180.0\\",\\"prd\\":\\"C\\",\\"trantype\\":\\"B\\","
    + "\\"prctyp\\":\\"LMT\\",\\"ret\\":\\"DAY\\",\\"ordersource\\":\\"API\\"}";

String body = "jData=" + URLEncoder.encode(jData, StandardCharsets.UTF_8)
    + "&jKey=" + URLEncoder.encode(accessToken, StandardCharsets.UTF_8);

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.shoonya.com/NorenWClientAPI/PlaceOrder"))
    .header("Content-Type", "application/x-www-form-urlencoded")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,

      csharp: `var payload = "{\\"uid\\":\\"AB1234\\",\\"actid\\":\\"AB1234\\",\\"exch\\":\\"NSE\\"," +
    "\\"tsym\\":\\"RELIANCE-EQ\\",\\"qty\\":\\"1\\",\\"dscqty\\":\\"0\\"," +
    "\\"prc\\":\\"180.0\\",\\"prd\\":\\"C\\",\\"trantype\\":\\"B\\"," +
    "\\"prctyp\\":\\"LMT\\",\\"ret\\":\\"DAY\\",\\"ordersource\\":\\"API\\"}";

using var client = new HttpClient();
var content = new StringContent(
    $"jData={Uri.EscapeDataString(payload)}&jKey={Uri.EscapeDataString(accessToken)}",
    Encoding.UTF8,
    "application/x-www-form-urlencoded");

var response = await client.PostAsync(
    "https://api.shoonya.com/NorenWClientAPI/PlaceOrder", content);
Console.WriteLine(await response.Content.ReadAsStringAsync());`,
    })}` },

    // ---------------------------------------------------------------
    { h: "Response", body: `
      ${codeBlock("json", `// Success — HTTP 200
{ "stat": "Ok", "norenordno": "24121500001234" }

// Rejection — HTTP 200
{ "stat": "Not_Ok", "emsg": "RMS:Margin Exceeds" }`)}
      <div class="callout warn"><b>HTTP status alone isn't enough</b>The OMS returns <code>HTTP 200</code> for both accepted and rejected orders — rejection is signalled in the JSON body via <code>stat</code>, not the HTTP status code. Always parse <code>stat</code>; never treat a 200 as confirmation of order placement. Track via <a href="#" data-nav="order-book">Order Book</a> and the <a href="#" data-nav="order-update-feed">Order Update Feed</a>.</div>
      <table class="param-table">
        <tr><th>Field</th><th>Description</th></tr>
        <tr><td>stat</td><td><code>Ok</code> or <code>Not_Ok</code> — always check before trusting <code>norenordno</code>.</td></tr>
        <tr><td>norenordno</td><td>Order number, present only on success. Track via <a href="#" data-nav="order-book">Order Book</a> and the <a href="#" data-nav="order-update-feed">Order Update Feed</a>.</td></tr>
        <tr><td>emsg</td><td>Rejection reason, present only on failure — see below.</td></tr>
      </table>
    ` },

    // ---------------------------------------------------------------
    { h: "Common Error Responses", body: `
      <table class="param-table">
        <tr><th>Error</th><th>Reason</th><th>Fix</th></tr>
        <tr><td>Invalid Symbol</td><td><code>tsym</code> not found in Instrument Master, or malformed expiry/option suffix.</td><td>Re-fetch symbol from Instrument Master before ordering.</td></tr>
        <tr><td>Invalid Quantity</td><td><code>qty</code> is zero, negative, or not a lot-size multiple.</td><td>Round to nearest valid lot multiple.</td></tr>
        <tr><td>Price Outside Circuit Limit</td><td><code>prc</code> outside the exchange circuit band.</td><td>Fetch current circuit band before pricing.</td></tr>
        <tr><td>Freeze Quantity Exceeded</td><td><code>qty</code> exceeds the per-order freeze limit.</td><td>Split into multiple orders under the limit.</td></tr>
        <tr><td>Session Expired</td><td><code>jKey</code>/<code>AccessToken</code> invalid or expired.</td><td>Re-authenticate via <a href="#" data-nav="token-renewal">Token Renewal</a>.</td></tr>
        <tr><td>Exchange Rejection</td><td>Reached exchange but rejected there (no liquidity for IOC, halted, etc).</td><td>Inspect the exchange-side reason in <code>emsg</code>.</td></tr>
      </table>
    ` },

    // ---------------------------------------------------------------
    { h: "Order Lifecycle", body: `
      <div class="flow-diagram" style="font-weight:700; font-size:1.05em; letter-spacing:0.02em; line-height:2.4; padding:20px 24px; border:2px solid currentColor; border-radius:8px; font-family:monospace; white-space:normal; word-break:break-word;">
        Strategy → Place&nbsp;Order&nbsp;API → Shoonya&nbsp;OMS → RMS&nbsp;Check → Exchange → Order&nbsp;Update&nbsp;WebSocket → Filled&nbsp;/&nbsp;Rejected&nbsp;/&nbsp;Cancelled
      </div>
      <table class="param-table">
        <tr><th>State</th><th>Meaning</th></tr>
        <tr><td>Pending Validation → Open</td><td>Order validated, passed RMS, resting at the exchange.</td></tr>
        <tr><td>Trigger Pending</td><td><code>SL-LMT</code> waiting for <code>trgprc</code> to be touched.</td></tr>
        <tr><td>Partially Filled → Complete</td><td>Quantity matching in progress, then fully filled.</td></tr>
        <tr><td>Rejected</td><td>Failed validation, RMS, or exchange check — see <code>emsg</code>.</td></tr>
        <tr><td>Cancelled</td><td>Cancelled by client, session logout, or EOD (for DAY orders).</td></tr>
      </table>
    ` },

    // ---------------------------------------------------------------
    { h: "Best Practices", body: `<ul>
      <li>Always check <code>stat</code> before trusting <code>norenordno</code> — the OMS returns <code>HTTP 200</code> for both accepted and rejected orders, so a successful HTTP call is not confirmation of a placed order.</li>
      <li>Since <code>MKT</code> isn't supported, price <code>LMT</code> orders with a small buffer beyond the current LTP for reliable fills on liquid symbols.</li>
      <li>On a network timeout, don't assume the order failed. Shoonya has no dedicated idempotency/client-order-ID field, so tag every order with a unique <code>remarks</code> value at send time, then reconcile against <a href="#" data-nav="order-book">Order Book</a> by matching <code>tsym</code> + <code>qty</code> + <code>remarks</code> before deciding whether to resend.</li>
      <li>Enforce your own client-side risk checks (max qty, max notional per order) — don't rely on RMS as your only guardrail, since RMS rejections happen after the order has already left your system.</li>
      <li>Respect the 10 OPS rate limit with a client-side token-bucket limiter; if a strategy needs sustained throughput above that, get it registered for an Algo ID rather than working around the limit.</li>
      <li>Validate <code>tsym</code> against a freshly-fetched <a href="#" data-nav="symbol-master">Symbol Master</a> immediately before placing F&O orders — don't cache symbols across expiries.</li>
    </ul>` },

  ],
},
 // ---------- C. TRADING APIs ----------
  "modify-order": {
  badge: { method: "POST", path: "/NorenWClientAPI/ModifyOrder" },

  desc: "Modify the price, quantity, order type, or trigger price of an existing open or trigger-pending order. The exchange, trading symbol, and transaction type of the original order cannot be changed.",

  sections: [

    // ---------------------------------------------------------------
    { h: "API Endpoint", body: `
      <table class="param-table">
        <tr><td><b>Method</b></td><td><code>POST</code></td></tr>
        <tr><td><b>URL</b></td><td><code>https://api.shoonya.com/NorenWClientAPI/ModifyOrder</code></td></tr>
        <tr><td><b>Content-Type</b></td><td><code>application/x-www-form-urlencoded</code></td></tr>
        <tr><td><b>Payload</b></td><td><code>jData=&lt;JSON payload&gt;&amp;jKey=&lt;AccessToken&gt;</code> — requires a valid <code>AccessToken</code> from <a href="#" data-nav="login-flow-overview">Login</a>.</td></tr>
      </table>
    ` },

    // ---------------------------------------------------------------
    { h: "Overview", body: `
      <p>Modify Order changes an order that is still resting on the exchange — <code>Open</code> or <code>Trigger Pending</code> state — without cancelling and re-placing it. Use it to reprice a stale limit order, resize a partially-adjusted position, or move a stop-loss trigger as the market moves. Always confirm current order state via <a href="#" data-nav="order-book">Order Book</a> before modifying — an order that has already completed, been cancelled, or been rejected cannot be modified.</p>
      <div class="callout warn"><b>Identity fields are fixed</b><code>exch</code> and <code>tsym</code> identify the original order and cannot be changed by a modify request. To trade a different symbol or exchange, cancel the order and place a new one.</div>
      <div class="callout warn"><b>MKT is still not supported</b>Shoonya's <a href="#" data-nav="place-order">Place Order</a> only accepts <code>LMT</code> and <code>SL-LMT</code>, and that restriction carries through to Modify Order — you cannot convert an order to <code>MKT</code> via modification, even though some generic Noren API references elsewhere show a <code>newprice_type='MKT'</code> example.</div>
    ` },

    // ---------------------------------------------------------------
    { h: "Rate Limits", body: `
      <p>Shares the same 10 orders/second (OPS) per-client throttle as <a href="#" data-nav="place-order">Place Order</a>, enforced at the OMS layer per SEBI's algo-trading OPS threshold framework — modify and cancel calls count against the same bucket as new order placements.</p>
      <div class="callout warn"><b>Need more than 10 OPS?</b>Submit your strategy to the exchange for approval and obtain an Algo ID. Once empanelled, higher OPS thresholds apply under the exchange's Algo ID framework.</div>
    ` },

    // ---------------------------------------------------------------
    { h: "Parameters", body: `
      <table class="param-table">
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Required</th>
          <th>Description</th>
          <th>Allowed Values</th>
        </tr>

        <tr>
          <td>uid</td>
          <td>string</td>
          <td><span class="req-tag">Required</span></td>
          <td>User ID of the authenticated account.</td>
          <td>Account-specific</td>
        </tr>

        <tr>
          <td>norenordno</td>
          <td>string</td>
          <td><span class="req-tag">Required</span></td>
          <td>Noren order number of the order to modify, as returned by <a href="#" data-nav="place-order">Place Order</a> or <a href="#" data-nav="order-book">Order Book</a>.</td>
          <td>Existing open / trigger-pending order</td>
        </tr>

        <tr>
          <td>exch</td>
          <td>string</td>
          <td><span class="req-tag">Required</span></td>
          <td>Exchange segment of the original order. Cannot differ from the order being modified.</td>
          <td><code>NSE</code>, <code>BSE</code>, <code>NFO</code>, <code>BFO</code>, <code>CDS</code>, <code>MCX</code></td>
        </tr>

        <tr>
          <td>tsym</td>
          <td>string</td>
          <td><span class="req-tag">Required</span></td>
          <td>Trading symbol of the original order. Cannot differ from the order being modified (use URL encoding for symbols like <code>M&amp;M</code>).</td>
          <td>Must match original order</td>
        </tr>

        <tr>
          <td>qty</td>
          <td>integer</td>
          <td><span class="req-tag">Required</span></td>
          <td>New order quantity. For derivatives, must be a multiple of the exchange lot size.</td>
          <td>&gt; 0, lot-size multiple for derivatives</td>
        </tr>

        <tr>
          <td>prc</td>
          <td>number</td>
          <td><span class="req-tag">Required</span></td>
          <td>New order price.</td>
          <td>&gt; 0, within exchange circuit band</td>
        </tr>

        <tr>
          <td>prctyp</td>
          <td>string</td>
          <td><span class="req-tag">Required</span></td>
          <td>New order type. <code>MKT</code> is not supported — see warning above.</td>
          <td><code>LMT</code>, <code>SL-LMT</code></td>
        </tr>

        <tr>
          <td>trgprc</td>
          <td>number</td>
          <td><span class="cond-tag">Conditional</span></td>
          <td>New trigger price. Mandatory when <code>prctyp</code> is <code>SL-LMT</code>, or when converting an existing order to/from <code>SL-LMT</code>.</td>
          <td>&gt; 0; omit when <code>prctyp = LMT</code></td>
        </tr>

        <tr>
          <td>ret</td>
          <td>string</td>
          <td><span class="req-tag">Required</span></td>
          <td>Order validity.</td>
          <td><code>DAY</code>, <code>IOC</code></td>
        </tr>

        <tr>
          <td>dscqty</td>
          <td>integer</td>
          <td><span class="opt-tag">Optional</span></td>
          <td>Disclosed quantity visible to the market.</td>
          <td>0 to <code>qty</code></td>
        </tr>

        <tr>
          <td>ordersource</td>
          <td>string</td>
          <td><span class="req-tag">Required</span></td>
          <td>Order source identifier.</td>
          <td><code>API</code></td>
        </tr>
      </table>
    ` },

    // ---------------------------------------------------------------
    { h: "Request Examples", body: `${codeTabs("modify-order-req", {
      python: `import requests
import json

payload = {
    "uid": "AB1234",
    "norenordno": orderNumber,   # from PlaceOrder response
    "exch": "NSE",
    "tsym": "RELIANCE-EQ",
    "qty": "2",
    "prc": "182.50",
    "prctyp": "LMT",             # LMT or SL-LMT only — MKT is rejected
    "ret": "DAY",
    "ordersource": "API",
}
data = f"jData={json.dumps(payload)}&jKey={accessToken}"

response = requests.post(
    "https://api.shoonya.com/NorenWClientAPI/ModifyOrder",
    data=data,
)
result = response.json()

if result.get("stat") == "Ok":
    print("Order modified:", result["result"])   # note: field is "result", not "norenordno"
else:
    print("Modification rejected:", result.get("emsg"))`,

      javascript: `const payload = {
  uid: "AB1234",
  norenordno: orderNumber,   // from PlaceOrder response
  exch: "NSE",
  tsym: "RELIANCE-EQ",
  qty: "2",
  prc: "182.50",
  prctyp: "LMT",              // LMT or SL-LMT only — MKT is rejected
  ret: "DAY",
  ordersource: "API",
};

const data = \`jData=\${JSON.stringify(payload)}&jKey=\${accessToken}\`;

try {
  const res = await fetch("https://api.shoonya.com/NorenWClientAPI/ModifyOrder", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data,
  });
  const result = await res.json();

  if (result.stat === "Ok") {
    console.log("Order modified:", result.result); // note: field is "result", not "norenordno"
  } else {
    console.error("Modification rejected:", result.emsg);
  }
} catch (err) {
  console.error("Network/timeout error modifying order:", err);
}`,

      curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/ModifyOrder \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode 'jData={"uid":"AB1234","norenordno":"24121500001234","exch":"NSE","tsym":"RELIANCE-EQ","qty":"2","prc":"182.50","prctyp":"LMT","ret":"DAY","ordersource":"API"}' \\
  --data-urlencode "jKey=$ACCESS_TOKEN"`,

      java: `String jData = "{\\"uid\\":\\"AB1234\\",\\"norenordno\\":\\"" + orderNumber + "\\","
    + "\\"exch\\":\\"NSE\\",\\"tsym\\":\\"RELIANCE-EQ\\",\\"qty\\":\\"2\\","
    + "\\"prc\\":\\"182.50\\",\\"prctyp\\":\\"LMT\\",\\"ret\\":\\"DAY\\","
    + "\\"ordersource\\":\\"API\\"}";

String body = "jData=" + URLEncoder.encode(jData, StandardCharsets.UTF_8)
    + "&jKey=" + URLEncoder.encode(accessToken, StandardCharsets.UTF_8);

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.shoonya.com/NorenWClientAPI/ModifyOrder"))
    .header("Content-Type", "application/x-www-form-urlencoded")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,

      csharp: `var payload = "{\\"uid\\":\\"AB1234\\",\\"norenordno\\":\\"" + orderNumber + "\\"," +
    "\\"exch\\":\\"NSE\\",\\"tsym\\":\\"RELIANCE-EQ\\",\\"qty\\":\\"2\\"," +
    "\\"prc\\":\\"182.50\\",\\"prctyp\\":\\"LMT\\",\\"ret\\":\\"DAY\\"," +
    "\\"ordersource\\":\\"API\\"}";

using var client = new HttpClient();
var content = new StringContent(
    $"jData={Uri.EscapeDataString(payload)}&jKey={Uri.EscapeDataString(accessToken)}",
    Encoding.UTF8,
    "application/x-www-form-urlencoded");

var response = await client.PostAsync(
    "https://api.shoonya.com/NorenWClientAPI/ModifyOrder", content);
Console.WriteLine(await response.Content.ReadAsStringAsync());`,
    })}` },

    // ---------------------------------------------------------------
    { h: "Response", body: `
      ${codeBlock("json", `// Success — HTTP 200
{ "stat": "Ok", "result": "24121500001234", "request_time": "14:48:28 24-05-2024" }

// Rejection — HTTP 200
{ "stat": "Not_Ok", "emsg": "Rejected : ORA:Order not found" }`)}
      <div class="callout warn"><b>Field name differs from Place Order</b>On success, the modified order number is returned in <code>result</code>, not <code>norenordno</code> — a common source of silent bugs when reusing Place Order's response-parsing code. As with Place Order, <code>HTTP 200</code> is returned for both success and failure; always check <code>stat</code>.</div>
      <table class="param-table">
        <tr><th>Field</th><th>Description</th></tr>
        <tr><td>stat</td><td><code>Ok</code> or <code>Not_Ok</code>.</td></tr>
        <tr><td>result</td><td>Noren order number of the modified order, present only on success.</td></tr>
        <tr><td>request_time</td><td>Timestamp the response was generated, present only on success.</td></tr>
        <tr><td>emsg</td><td>Rejection reason, present only on failure — see below.</td></tr>
      </table>
    ` },

    // ---------------------------------------------------------------
    { h: "Common Error Responses", body: `
      <table class="param-table">
        <tr><th>Error</th><th>Reason</th><th>Fix</th></tr>
        <tr><td>Order not found</td><td><code>norenordno</code> doesn't exist, belongs to another user, or has already completed/been cancelled.</td><td>Re-check current state via <a href="#" data-nav="order-book">Order Book</a> before modifying.</td></tr>
        <tr><td>Invalid Quantity</td><td>New <code>qty</code> is zero, negative, or not a lot-size multiple.</td><td>Round to nearest valid lot multiple.</td></tr>
        <tr><td>Price Outside Circuit Limit</td><td>New <code>prc</code> outside the exchange circuit band.</td><td>Fetch current circuit band before repricing.</td></tr>
        <tr><td>Symbol/Exchange Mismatch</td><td><code>exch</code> or <code>tsym</code> doesn't match the original order.</td><td>These fields identify, not modify, the order — copy them unchanged from the original.</td></tr>
        <tr><td>Session Expired</td><td><code>jKey</code>/<code>AccessToken</code> invalid or expired.</td><td>Re-authenticate via <a href="#" data-nav="token-renewal">Token Renewal</a>.</td></tr>
        <tr><td>Exchange Rejection</td><td>Order already partially/fully filled at the exchange before the modify reached it (a fill/modify race).</td><td>Inspect <code>emsg</code>; reconcile actual state via <a href="#" data-nav="order-book">Order Book</a> rather than assuming the modify applied.</td></tr>
      </table>
    ` },

    // ---------------------------------------------------------------
    { h: "Best Practices", body: `<ul>
      <li>Fetch the order's current state from <a href="#" data-nav="order-book">Order Book</a> immediately before modifying — a fill can race your modify request, and the OMS will reject a modify against an already-completed order.</li>
      <li>Always send the full parameter set (<code>qty</code>, <code>prc</code>, <code>prctyp</code>, <code>ret</code>, etc.), not just the field you're changing — Modify Order replaces the order's terms rather than patching a single field.</li>
      <li>Parse the success order number from <code>result</code>, not <code>norenordno</code> — reusing Place Order's response-parsing logic unmodified is a common bug.</li>
      <li>Since <code>MKT</code> isn't supported here either, reprice <code>LMT</code> modifications with a small buffer beyond current LTP for reliable fills.</li>
      <li>Respect the shared 10 OPS rate limit — modify and cancel calls draw from the same per-client bucket as Place Order.</li>
      <li>Track the outcome via the <a href="#" data-nav="order-update-feed">Order Update Feed</a> rather than assuming a <code>stat: "Ok"</code> response means the new terms are live at the exchange.</li>
    </ul>` },

  ],
},
 // ---------- C. TRADING APIs ----------
  "cancel-order": {
  badge: { method: "POST", path: "/NorenWClientAPI/CancelOrder" },

  desc: "Cancel an existing open or trigger-pending order before it is filled at the exchange.",

  sections: [

    // ---------------------------------------------------------------
    { h: "API Endpoint", body: `
      <table class="param-table">
        <tr><td><b>Method</b></td><td><code>POST</code></td></tr>
        <tr><td><b>URL</b></td><td><code>https://api.shoonya.com/NorenWClientAPI/CancelOrder</code></td></tr>
        <tr><td><b>Content-Type</b></td><td><code>application/x-www-form-urlencoded</code></td></tr>
        <tr><td><b>Payload</b></td><td><code>jData=&lt;JSON payload&gt;&amp;jKey=&lt;AccessToken&gt;</code> — requires a valid <code>AccessToken</code> from <a href="#" data-nav="login-flow-overview">Login</a>.</td></tr>
      </table>
    ` },

    // ---------------------------------------------------------------
    { h: "Overview", body: `
      <p>Cancel Order pulls an order that is still <code>Open</code> or <code>Trigger Pending</code> off the exchange. Unlike <a href="#" data-nav="modify-order">Modify Order</a>, it takes only the order identifier — there's no order state to resend. Call it whenever a signal invalidates a resting order, at end-of-strategy cleanup, or as part of a modify-then-fail fallback path.</p>
      <div class="callout warn"><b>Cancel can lose the race to a fill</b>If the order fills at the exchange before your cancel request arrives, the cancel will be rejected with an exchange-side reason rather than silently succeeding. Always confirm the final state via <a href="#" data-nav="order-book">Order Book</a> or the <a href="#" data-nav="order-update-feed">Order Update Feed</a> rather than assuming <code>stat: "Ok"</code> means nothing filled.</div>
    ` },

    // ---------------------------------------------------------------
    { h: "Rate Limits", body: `
      <p>Shares the same 10 orders/second (OPS) per-client throttle as <a href="#" data-nav="place-order">Place Order</a> and <a href="#" data-nav="modify-order">Modify Order</a>, enforced at the OMS layer per SEBI's algo-trading OPS threshold framework.</p>
      <div class="callout warn"><b>Need more than 10 OPS?</b>Submit your strategy to the exchange for approval and obtain an Algo ID. Once empanelled, higher OPS thresholds apply under the exchange's Algo ID framework.</div>
    ` },

    // ---------------------------------------------------------------
    { h: "Parameters", body: `
      <table class="param-table">
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Required</th>
          <th>Description</th>
          <th>Allowed Values</th>
        </tr>

        <tr>
          <td>uid</td>
          <td>string</td>
          <td><span class="req-tag">Required</span></td>
          <td>User ID of the authenticated account.</td>
          <td>Account-specific</td>
        </tr>

        <tr>
          <td>norenordno</td>
          <td>string</td>
          <td><span class="req-tag">Required</span></td>
          <td>Noren order number of the order to cancel, as returned by <a href="#" data-nav="place-order">Place Order</a> or <a href="#" data-nav="order-book">Order Book</a>.</td>
          <td>Existing open / trigger-pending order</td>
        </tr>

        <tr>
          <td>ordersource</td>
          <td>string</td>
          <td><span class="req-tag">Required</span></td>
          <td>Order source identifier.</td>
          <td><code>API</code></td>
        </tr>
      </table>
    ` },

    // ---------------------------------------------------------------
    { h: "Request Examples", body: `${codeTabs("cancel-order-req", {
      python: `import requests
import json

payload = {
    "uid": "AB1234",
    "norenordno": orderNumber,   # from PlaceOrder response
    "ordersource": "API",
}
data = f"jData={json.dumps(payload)}&jKey={accessToken}"

response = requests.post(
    "https://api.shoonya.com/NorenWClientAPI/CancelOrder",
    data=data,
)
result = response.json()

if result.get("stat") == "Ok":
    print("Order cancelled:", result["result"])   # note: field is "result", not "norenordno"
else:
    print("Cancellation rejected:", result.get("emsg"))`,

      javascript: `const payload = {
  uid: "AB1234",
  norenordno: orderNumber,   // from PlaceOrder response
  ordersource: "API",
};

const data = \`jData=\${JSON.stringify(payload)}&jKey=\${accessToken}\`;

try {
  const res = await fetch("https://api.shoonya.com/NorenWClientAPI/CancelOrder", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data,
  });
  const result = await res.json();

  if (result.stat === "Ok") {
    console.log("Order cancelled:", result.result); // note: field is "result", not "norenordno"
  } else {
    console.error("Cancellation rejected:", result.emsg);
  }
} catch (err) {
  console.error("Network/timeout error cancelling order:", err);
}`,

      curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/CancelOrder \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode 'jData={"uid":"AB1234","norenordno":"24121500001234","ordersource":"API"}' \\
  --data-urlencode "jKey=$ACCESS_TOKEN"`,

      java: `String jData = "{\\"uid\\":\\"AB1234\\",\\"norenordno\\":\\"" + orderNumber + "\\","
    + "\\"ordersource\\":\\"API\\"}";

String body = "jData=" + URLEncoder.encode(jData, StandardCharsets.UTF_8)
    + "&jKey=" + URLEncoder.encode(accessToken, StandardCharsets.UTF_8);

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.shoonya.com/NorenWClientAPI/CancelOrder"))
    .header("Content-Type", "application/x-www-form-urlencoded")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,

      csharp: `var payload = "{\\"uid\\":\\"AB1234\\",\\"norenordno\\":\\"" + orderNumber + "\\"," +
    "\\"ordersource\\":\\"API\\"}";

using var client = new HttpClient();
var content = new StringContent(
    $"jData={Uri.EscapeDataString(payload)}&jKey={Uri.EscapeDataString(accessToken)}",
    Encoding.UTF8,
    "application/x-www-form-urlencoded");

var response = await client.PostAsync(
    "https://api.shoonya.com/NorenWClientAPI/CancelOrder", content);
Console.WriteLine(await response.Content.ReadAsStringAsync());`,
    })}` },

    // ---------------------------------------------------------------
    { h: "Response", body: `
      ${codeBlock("json", `// Success — HTTP 200
{ "stat": "Ok", "result": "24121500001234" }

// Rejection — HTTP 200
{ "stat": "Not_Ok", "emsg": "Rejected : ORA:Order not found" }`)}
      <div class="callout warn"><b>Field name differs from Place Order</b>On success, the cancelled order number is returned in <code>result</code>, not <code>norenordno</code>. As with Place Order and Modify Order, <code>HTTP 200</code> is returned for both success and failure; always check <code>stat</code>, never the HTTP status alone.</div>
      <table class="param-table">
        <tr><th>Field</th><th>Description</th></tr>
        <tr><td>stat</td><td><code>Ok</code> or <code>Not_Ok</code>.</td></tr>
        <tr><td>result</td><td>Noren order number of the cancelled order, present only on success.</td></tr>
        <tr><td>emsg</td><td>Rejection reason, present only on failure — see below.</td></tr>
      </table>
    ` },

    // ---------------------------------------------------------------
    { h: "Common Error Responses", body: `
      <table class="param-table">
        <tr><th>Error</th><th>Reason</th><th>Fix</th></tr>
        <tr><td>Order not found</td><td><code>norenordno</code> doesn't exist, belongs to another user, or is not in a cancellable state.</td><td>Re-check current state via <a href="#" data-nav="order-book">Order Book</a> before cancelling.</td></tr>
        <tr><td>Already Complete</td><td>Order filled (fully or partially, then completed) before the cancel reached the exchange.</td><td>Reconcile via <a href="#" data-nav="order-book">Order Book</a>; a cancel racing a fill is expected behavior, not a bug.</td></tr>
        <tr><td>Already Cancelled</td><td>Order was already cancelled — by a prior call, session logout, or EOD.</td><td>Treat as a benign no-op if your own reconciliation shows the order is gone.</td></tr>
        <tr><td>Session Expired</td><td><code>jKey</code>/<code>AccessToken</code> invalid or expired.</td><td>Re-authenticate via <a href="#" data-nav="token-renewal">Token Renewal</a>.</td></tr>
        <tr><td>Exchange Rejection</td><td>Cancel reached the exchange but was rejected there.</td><td>Inspect the exchange-side reason in <code>emsg</code>.</td></tr>
      </table>
    ` },

    // ---------------------------------------------------------------
    { h: "Best Practices", body: `<ul>
      <li>Treat a cancel rejection due to "already complete" or "already cancelled" as informational, not exceptional — reconcile against <a href="#" data-nav="order-book">Order Book</a> to find the order's true final state rather than retrying blindly.</li>
      <li>Parse the success order number from <code>result</code>, not <code>norenordno</code> — the same field-naming difference applies here as with Modify Order.</li>
      <li>On a network timeout, don't assume the cancel failed or succeeded — re-fetch the order's state from <a href="#" data-nav="order-book">Order Book</a> before deciding whether to resend.</li>
      <li>Confirm cancellation via the <a href="#" data-nav="order-update-feed">Order Update Feed</a> rather than the HTTP response alone, since a fill can complete moments after you receive <code>stat: "Ok"</code> for an in-flight race.</li>
      <li>Respect the shared 10 OPS rate limit — cancel calls draw from the same per-client bucket as Place Order and Modify Order.</li>
      <li>For bulk cleanup (e.g. end-of-day flatten), iterate <a href="#" data-nav="order-book">Order Book</a> for all open/trigger-pending orders rather than tracking order numbers client-side, so you don't miss orders placed outside the current session.</li>
    </ul>` },

  ],
},

  "order-book": {
    badge: { method: "POST", path: "/NorenWClientAPI/OrderBook" },
    desc: "Fetch every order placed today for the account, across all products, exchanges, and states.",
    sections: [
      { h: "Overview", body: `<p>Order Book returns the full list of orders for the logged-in account for the current trading day — <code>Open</code>, <code>Trigger Pending</code>, <code>Complete</code>, <code>Rejected</code>, and <code>Cancelled</code> orders all come back in the same array, differentiated by <code>status</code>. There's no separate "list open orders" call — filter client-side.</p>
      <p>This is the endpoint to reconcile against after every <a href="#" data-nav="place-order">Place Order</a>, <a href="#" data-nav="modify-order">Modify</a>, or <a href="#" data-nav="cancel-order">Cancel</a> call whose HTTP response was ambiguous (timeout, network error) — never assume an order's fate from a failed request alone.</p>` },
      { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td>uid</td><td>string</td><td><span class="req-tag">Required</span></td><td>Logged-in user ID. Handled by the SDK if you're using it.</td></tr>
      </table>` },
      { h: "Request example", body: `${codeTabs("orderbook-req", {
        python: `import requests, json
 
payload = {"uid": "AB1234"}
data = f"jData={json.dumps(payload)}&jKey={accessToken}"
 
resp = requests.post("https://api.shoonya.com/NorenWClientAPI/OrderBook", data=data)
orders = resp.json()
 
open_orders = [o for o in orders if o.get("status") in ("OPEN", "TRIGGER_PENDING")]
print(f"{len(open_orders)} open/trigger-pending orders")`,
        javascript: `const payload = { uid: "AB1234" };
const data = \`jData=\${JSON.stringify(payload)}&jKey=\${accessToken}\`;
 
const res = await fetch("https://api.shoonya.com/NorenWClientAPI/OrderBook", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: data,
});
const orders = await res.json();
const openOrders = orders.filter(o => ["OPEN", "TRIGGER_PENDING"].includes(o.status));
console.log(\`\${openOrders.length} open/trigger-pending orders\`);`,
        curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/OrderBook \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode 'jData={"uid":"AB1234"}' \\
  --data-urlencode "jKey=$ACCESS_TOKEN"`,
      })}` },
      { h: "Response", body: `${codeBlock("json", `[
  {
    "stat": "Ok",
    "exch": "NSE",
    "tsym": "ACC-EQ",
    "norenordno": "24121500001223",
    "prc": "1272.30",
    "qty": "100",
    "prd": "C",
    "status": "OPEN",
    "trantype": "B",
    "prctyp": "LMT",
    "fillshares": "0",
    "avgprc": "0",
    "exchordid": "250620000000343421",
    "ret": "DAY",
    "remarks": "my_order_001"
  },
  {
    "stat": "Ok",
    "exch": "NSE",
    "tsym": "ABB-EQ",
    "norenordno": "24121500002543",
    "prc": "1278.30",
    "qty": "50",
    "prd": "C",
    "status": "REJECTED",
    "trantype": "B",
    "prctyp": "LMT",
    "fillshares": "0",
    "avgprc": "0",
    "rejreason": "Insufficient funds"
  }
]`)}
      <table class="param-table">
        <tr><th>Field</th><th>Description</th></tr>
        <tr><td>norenordno</td><td>Noren order number — the key to pass to Modify/Cancel/Exit.</td></tr>
        <tr><td>status</td><td>See <a href="#" data-nav="order-type-codes">Order Status values</a> — <code>OPEN</code>, <code>TRIGGER_PENDING</code>, <code>COMPLETE</code>, <code>REJECTED</code>, <code>CANCELED</code>, <code>PENDING</code>.</td></tr>
        <tr><td>fillshares / avgprc</td><td>Cumulative filled quantity and average fill price so far — non-zero even for a partial fill on an otherwise <code>OPEN</code> order.</td></tr>
        <tr><td>rejreason</td><td>Present only when <code>status</code> is <code>REJECTED</code>.</td></tr>
        <tr><td>exchordid</td><td>Exchange-side order ID, distinct from <code>norenordno</code>.</td></tr>
      </table>
      <div class="callout warn"><b>Every row carries its own stat</b>Order Book returns an array where each element repeats <code>"stat": "Ok"</code> — this reflects each individual record having rendered correctly, not per-order success. A failed order shows up as a normal array element with <code>status: "REJECTED"</code>, not as an error.</div>` },
      { h: "Error handling", body: `${codeBlock("json", `{
  "stat": "Not_Ok",
  "emsg": "Session Expired : Invalid Session Key"
}`)}` },
      { h: "Best practices", body: `<ul>
        <li>Poll sparingly — Order Book is a REST snapshot, not a stream. For real-time state, drive your strategy off the <a href="#" data-nav="order-update-feed">Order Update Feed</a> and use this endpoint only for startup reconciliation and periodic sanity checks.</li>
        <li>Match on <code>remarks</code> + <code>tsym</code> + <code>qty</code> when reconciling after a timeout, since Shoonya has no client-order-ID field — tag every order with a unique <code>remarks</code> value at send time (see <a href="#" data-nav="place-order">Place Order</a> best practices).</li>
        <li>Don't assume array order is chronological or stable — sort by <code>norentm</code>/<code>ordenttm</code> client-side if you need order sequencing.</li>
      </ul>` },
      { h: "Notes", body: `<p>Field names shown follow standard NorenOMS conventions used across this documentation — confirm exact casing against your onboarding packet before going to production.</p>` },
    ],
  },
 
  "trade-book": {
    badge: { method: "POST", path: "/NorenWClientAPI/TradeBook" },
    desc: "Fetch every executed fill (trade) for the account today — distinct from Order Book, which lists orders, not fills.",
    sections: [
      { h: "Overview", body: `<p>Trade Book returns one row per fill, not per order. A single order that fills in three exchange-side matches produces three rows here, each carrying its own <code>flid</code> (fill ID), <code>flqty</code>, and <code>flprc</code> — while <a href="#" data-nav="order-book">Order Book</a> would still show that order as one row with an aggregated <code>fillshares</code>/<code>avgprc</code>.</p>` },
      { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td>uid</td><td>string</td><td><span class="req-tag">Required</span></td><td>Logged-in user ID.</td></tr>
        <tr><td>actid</td><td>string</td><td><span class="req-tag">Required</span></td><td>Account ID of the logged-in user.</td></tr>
      </table>` },
      { h: "Request example", body: `${codeTabs("tradebook-req", {
        python: `import requests, json
 
payload = {"uid": "AB1234", "actid": "AB1234"}
data = f"jData={json.dumps(payload)}&jKey={accessToken}"
 
resp = requests.post("https://api.shoonya.com/NorenWClientAPI/TradeBook", data=data)
for t in resp.json():
    print(t["tsym"], t["trantype"], t["flqty"], "@", t["flprc"])`,
        javascript: `const payload = { uid: "AB1234", actid: "AB1234" };
const data = \`jData=\${JSON.stringify(payload)}&jKey=\${accessToken}\`;
 
const res = await fetch("https://api.shoonya.com/NorenWClientAPI/TradeBook", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: data,
});
console.log(await res.json());`,
        curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/TradeBook \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode 'jData={"uid":"AB1234","actid":"AB1234"}' \\
  --data-urlencode "jKey=$ACCESS_TOKEN"`,
      })}` },
      { h: "Response", body: `${codeBlock("json", `[
  {
    "stat": "Ok",
    "norenordno": "20121300065715",
    "exch": "NSE",
    "tsym": "ACCELYA-EQ",
    "trantype": "S",
    "qty": "180",
    "prd": "M",
    "prctyp": "LMT",
    "flid": "102",
    "fltm": "01-01-1980 00:00:00",
    "flqty": "180",
    "flprc": "800.00",
    "fillshares": "180",
    "avgprc": "800.00",
    "exchordid": "6857",
    "remarks": "WC TEST Order"
  }
]`)}
      <table class="param-table">
        <tr><th>Field</th><th>Description</th></tr>
        <tr><td>flid</td><td>Fill ID — unique per execution, not per order.</td></tr>
        <tr><td>flqty / flprc</td><td>Quantity and price of this specific fill.</td></tr>
        <tr><td>fillshares / avgprc</td><td>Cumulative totals for the parent order, same fields as Order Book.</td></tr>
      </table>` },
      { h: "Error handling", body: `${codeBlock("json", `{
  "stat": "Not_Ok",
  "emsg": "Session Expired : Invalid Session Key"
}`)}` },
      { h: "Best practices", body: `<ul>
        <li>Group rows by <code>norenordno</code> when you need per-order fill history; group by <code>flid</code> only when you need individual execution-level detail (e.g. for slippage analysis against each fill's timestamp).</li>
        <li>Use this for trade-level P&L reconstruction and audit trails — <a href="#" data-nav="positions">Positions</a> gives you the current net state, Trade Book gives you how it got there.</li>
      </ul>` },
      { h: "Notes", body: `<p><code>fltm</code>/<code>exch_tm</code> timestamps have shown placeholder epoch values (<code>01-01-1980</code>) in some environments for older fills — don't rely on them for latency measurement without validating against your own environment first.</p>` },
    ],
  },
 
  "order-history": {
    badge: { method: "POST", path: "/NorenWClientAPI/SingleOrdHist" },
    desc: "Fetch the full lifecycle history of a single order by its Noren order number.",
    sections: [
      { h: "Overview", body: `<p>Order History returns every state transition a single order has gone through — from <code>PendingNew</code> through fills, modifications, or rejection — as an ordered array. Use it when Order Book's current-state snapshot isn't enough and you need to know <i>how</i> an order got to its current state (e.g. debugging why a modify was rejected, or confirming the exact sequence of partial fills).</p>` },
      { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td>uid</td><td>string</td><td><span class="req-tag">Required</span></td><td>Logged-in user ID.</td></tr>
        <tr><td>norenordno</td><td>string</td><td><span class="req-tag">Required</span></td><td>Noren order number to fetch history for, as returned by <a href="#" data-nav="place-order">Place Order</a> or <a href="#" data-nav="order-book">Order Book</a>.</td></tr>
      </table>` },
      { h: "Request example", body: `${codeTabs("orderhist-req", {
        python: `import requests, json
 
payload = {"uid": "AB1234", "norenordno": orderNumber}
data = f"jData={json.dumps(payload)}&jKey={accessToken}"
 
resp = requests.post("https://api.shoonya.com/NorenWClientAPI/SingleOrdHist", data=data)
for event in resp.json():
    print(event["status"], event.get("reporttype"), event.get("norentm"))`,
        javascript: `const payload = { uid: "AB1234", norenordno: orderNumber };
const data = \`jData=\${JSON.stringify(payload)}&jKey=\${accessToken}\`;
 
const res = await fetch("https://api.shoonya.com/NorenWClientAPI/SingleOrdHist", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: data,
});
console.log(await res.json());`,
        curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/SingleOrdHist \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode 'jData={"uid":"AB1234","norenordno":"24121500001234"}' \\
  --data-urlencode "jKey=$ACCESS_TOKEN"`,
      })}` },
      { h: "Response", body: `${codeBlock("json", `[
  { "stat": "Ok", "norenordno": "24121500001234", "status": "OPEN", "reporttype": "NewAck", "norentm": "09:15:03 15-12-2024" },
  { "stat": "Ok", "norenordno": "24121500001234", "status": "COMPLETE", "reporttype": "Fill", "fillshares": "100", "avgprc": "1272.30", "norentm": "09:15:41 15-12-2024" }
]`)}
      <p>Fields mirror <a href="#" data-nav="order-book">Order Book</a>, with <code>reporttype</code> identifying the specific lifecycle event — see <a href="#" data-nav="order-type-codes">Report Type values</a> (<code>NewAck</code>, <code>Fill</code>, <code>Rejected</code>, <code>Replaced</code>, <code>Canceled</code>, and their pending/rejected variants).</p>` },
      { h: "Error handling", body: `${codeBlock("json", `{
  "stat": "Not_Ok",
  "emsg": "Rejected : ORA:Order not found"
}`)}` },
      { h: "Best practices", body: `<ul>
        <li>Reach for this endpoint only when debugging a specific order — for bulk state, <a href="#" data-nav="order-book">Order Book</a> is far cheaper against your rate limit.</li>
        <li>Cross-reference <code>reporttype</code> against the <a href="#" data-nav="order-update-feed">Order Update Feed</a>'s <code>reporttype</code> values — they use the same enum, so logic written for one transfers to the other.</li>
      </ul>` },
      { h: "Notes", body: `<p>This is a REST pull of the same event stream the <a href="#" data-nav="order-update-feed">Order Update Feed</a> pushes over WebSocket in real time — prefer the feed for anything live, and this endpoint for after-the-fact debugging.</p>` },
    ],
  },
   "product-conversion": {
    badge: { method: "POST", path: "/NorenWClientAPI/ProductConversion" },
    desc: "Convert an existing position from one product type to another (e.g. Intraday to Delivery) without squaring off and re-entering.",
    sections: [
      { h: "Overview", body: `<p>Product Conversion changes the product tag on a quantity you already hold — moving MIS to CNC before end-of-day auto square-off, or converting a carry-forward F&O position to intraday — without an offsetting trade. It only relabels an existing position; it does not place a new order.</p>
      <div class="callout warn"><b>Match against the actual position first</b><code>previous_product_type</code> must match the product the position is currently held under, and <code>quantity</code> can't exceed what's actually held — fetch the position from <a href="#" data-nav="positions">Positions</a> immediately before converting rather than assuming your local state is current.</div>` },
      { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td>uid / actid</td><td>string</td><td><span class="req-tag">Required</span></td><td>User and account ID of the logged-in account.</td></tr>
        <tr><td>exch</td><td>string</td><td><span class="req-tag">Required</span></td><td>Exchange segment of the position.</td></tr>
        <tr><td>tsym</td><td>string</td><td><span class="req-tag">Required</span></td><td>Trading symbol of the position. Must match exactly — URL-encode symbols with special characters like <code>M&amp;M</code>.</td></tr>
        <tr><td>qty</td><td>integer</td><td><span class="req-tag">Required</span></td><td>Quantity to convert. Can be less than the full position for a partial conversion.</td></tr>
        <tr><td>prd</td><td>string</td><td><span class="req-tag">Required</span></td><td>Product to convert <b>to</b>. See <a href="#" data-nav="product-type-codes">Product Type Codes</a>.</td></tr>
        <tr><td>prevprd</td><td>string</td><td><span class="req-tag">Required</span></td><td>The position's current product — must match what's actually held.</td></tr>
        <tr><td>trantype</td><td>string</td><td><span class="req-tag">Required</span></td><td>Transaction type of the position being converted — <code>B</code> or <code>S</code>.</td></tr>
        <tr><td>postype</td><td>string</td><td><span class="req-tag">Required</span></td><td>Whether converting a <code>Day</code> or carry-forward (<code>CF</code>) position.</td></tr>
      </table>` },
      { h: "Request example", body: `${codeTabs("prdconv-req", {
        python: `import requests, json
 
# Fetch the position first, then convert it — don't guess prevprd/qty
positions = requests.post("https://api.shoonya.com/NorenWClientAPI/PositionBook",
                           data=f"jData={json.dumps({'uid':'AB1234','actid':'AB1234'})}&jKey={accessToken}").json()
p = positions[0]
 
payload = {
    "uid": "AB1234", "actid": "AB1234",
    "exch": p["exch"], "tsym": p["tsym"], "qty": p["netqty"],
    "prd": "I", "prevprd": p["prd"],
    "trantype": "B", "postype": "Day",
}
data = f"jData={json.dumps(payload)}&jKey={accessToken}"
resp = requests.post("https://api.shoonya.com/NorenWClientAPI/ProductConversion", data=data)
print(resp.json())`,
        javascript: `const payload = {
  uid: "AB1234", actid: "AB1234",
  exch: "NSE", tsym: "RELIANCE-EQ", qty: "1",
  prd: "I", prevprd: "C",
  trantype: "B", postype: "Day",
};
const data = \`jData=\${JSON.stringify(payload)}&jKey=\${accessToken}\`;
 
const res = await fetch("https://api.shoonya.com/NorenWClientAPI/ProductConversion", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: data,
});
console.log(await res.json());`,
        curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/ProductConversion \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode 'jData={"uid":"AB1234","actid":"AB1234","exch":"NSE","tsym":"RELIANCE-EQ","qty":"1","prd":"I","prevprd":"C","trantype":"B","postype":"Day"}' \\
  --data-urlencode "jKey=$ACCESS_TOKEN"`,
      })}` },
      { h: "Response", body: `${codeBlock("json", `// Success
{ "stat": "Ok", "request_time": "10:52:12 02-06-2024" }
 
// Failure
{ "stat": "Not_Ok", "emsg": "Invalid Input : Invalid Position Type" }`)}` },
      { h: "Error handling", body: `<table class="param-table">
        <tr><th>Error</th><th>Cause</th></tr>
        <tr><td>Invalid Input : Invalid Position Type</td><td><code>prevprd</code> doesn't match the position's actual current product.</td></tr>
        <tr><td>Invalid Quantity</td><td><code>qty</code> exceeds the held position quantity.</td></tr>
        <tr><td>Session Expired</td><td>Token invalid or expired — re-authenticate.</td></tr>
      </table>` },
      { h: "Best practices", body: `<ul>
        <li>Always re-fetch <a href="#" data-nav="positions">Positions</a> right before converting — a fill or partial square-off between your last read and the conversion request will cause a mismatch.</li>
        <li>For intraday-to-delivery conversions ahead of auto square-off, build in a time buffer — don't run this at the exact square-off cutoff.</li>
      </ul>` },
      { h: "Notes", body: `<p>This does not create a new order or trade — it only relabels the product tag on an existing position. It has no effect on average price or realized P&L.</p>` },
    ],
  },
 
  "exit-order": {
    badge: { method: "POST", path: "/NorenWClientAPI/ExitSNOOrder" },
    desc: "Exit a Cover Order (CO) or Bracket Order (BO) leg — the dedicated exit path for these product types, distinct from a plain cancel.",
    sections: [
      { h: "Overview", body: `<p>Cover and Bracket orders carry attached stop-loss (and, for BO, profit-target) legs managed server-side. Exit Order is the correct way to close out of one of these — it unwinds the parent order and its child legs together. A plain <a href="#" data-nav="cancel-order">Cancel Order</a> call is not equivalent for these product types.</p>
      <div class="callout warn"><b>Scope</b>This endpoint applies only to <code>prd</code> values <code>H</code> (Cover Order) and <code>B</code> (Bracket Order). Note that elsewhere in this documentation — see <a href="#" data-nav="place-order">Place Order</a> — CO and BO are called out as <b>not accepted</b> as <code>prd</code> values on new order placement. If your account has legacy CO/BO positions or your onboarding enables them, this is the corresponding exit endpoint; if you can't place CO/BO orders in the first place, you won't have a use for this page.</div>` },
      { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td>uid</td><td>string</td><td><span class="req-tag">Required</span></td><td>Logged-in user ID.</td></tr>
        <tr><td>norenordno</td><td>string</td><td><span class="req-tag">Required</span></td><td>Noren order number of the parent CO/BO order to exit.</td></tr>
        <tr><td>prd</td><td>string</td><td><span class="req-tag">Required</span></td><td>Product type — only <code>H</code> or <code>B</code> are accepted.</td></tr>
      </table>` },
      { h: "Request example", body: `${codeTabs("exitorder-req", {
        python: `import requests, json
 
payload = {"uid": "AB1234", "norenordno": orderNumber, "prd": "B"}
data = f"jData={json.dumps(payload)}&jKey={accessToken}"
 
resp = requests.post("https://api.shoonya.com/NorenWClientAPI/ExitSNOOrder", data=data)
result = resp.json()
if result.get("stat") == "Ok":
    print("Exited:", result.get("dmsg"))
else:
    print("Exit failed:", result.get("emsg"))`,
        javascript: `const payload = { uid: "AB1234", norenordno: orderNumber, prd: "B" };
const data = \`jData=\${JSON.stringify(payload)}&jKey=\${accessToken}\`;
 
const res = await fetch("https://api.shoonya.com/NorenWClientAPI/ExitSNOOrder", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: data,
});
console.log(await res.json());`,
        curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/ExitSNOOrder \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode 'jData={"uid":"AB1234","norenordno":"24121500001234","prd":"B"}' \\
  --data-urlencode "jKey=$ACCESS_TOKEN"`,
      })}` },
      { h: "Response", body: `${codeBlock("json", `// Success
{ "stat": "Ok", "dmsg": "Order Exited Successfully", "request_time": "11:02:44 15-12-2024" }
 
// Failure
{ "stat": "Not_Ok", "emsg": "Rejected : ORA:Order not found" }`)}
      <table class="param-table">
        <tr><th>Field</th><th>Description</th></tr>
        <tr><td>dmsg</td><td>Display message confirming the exit — present only on success.</td></tr>
        <tr><td>emsg</td><td>Present only on failure.</td></tr>
      </table>` },
      { h: "Best practices", body: `<ul>
        <li>Confirm the parent order's current state via <a href="#" data-nav="order-book">Order Book</a> before calling Exit — an already-completed or already-exited CO/BO will reject.</li>
        <li>Track the outcome via the <a href="#" data-nav="order-update-feed">Order Update Feed</a> rather than the HTTP response alone, consistent with every other order-management endpoint on this API.</li>
      </ul>` },
      { h: "Notes", body: `<p>See <a href="#" data-nav="product-type-codes">Product Type Codes</a> for how <code>H</code> and <code>B</code> map to Cover and Bracket orders.</p>` },
    ],
  },

  //Daily-MTM
   "daily-mtm": {
    badge: null,
    desc: "There's no dedicated Daily MTM endpoint — this page shows how to derive it from Positions.",
    sections: [
      { h: "Overview", body: `<p>Shoonya doesn't expose a standalone "Daily MTM" API. Your day's mark-to-market is derived by summing <code>rpnl</code> (realized P&L) and <code>urmtom</code> (unrealized mark-to-market) across every row returned by <a href="#" data-nav="positions">Positions</a>. This page documents that derivation so it doesn't have to be rediscovered per integration.</p>` },
      { h: "Derivation", body: `${codeBlock("python", `positions = client.get_positions()
 
mtm = 0.0
pnl = 0.0
for p in positions:
    mtm += float(p["urmtom"])
    pnl += float(p["rpnl"])
 
day_mtm = mtm + pnl
print(f"{day_mtm} is your Daily MTM")`)}
      <table class="param-table">
        <tr><th>Field</th><th>Source</th><th>Meaning</th></tr>
        <tr><td>rpnl</td><td><a href="#" data-nav="positions">Positions</a></td><td>Realized P&L — profit/loss already booked from squared-off quantity today.</td></tr>
        <tr><td>urmtom</td><td><a href="#" data-nav="positions">Positions</a></td><td>Unrealized mark-to-market on the remaining open net quantity, marked at last traded price.</td></tr>
      </table>` },
      { h: "Best practices", body: `<ul>
        <li>Recompute on every <a href="#" data-nav="subscribe-market-feed">tick</a> or <a href="#" data-nav="order-update-feed">order update</a> if you need a live-updating MTM figure — Positions itself is a REST snapshot, not a stream. A common pattern is to hold local position state, update <code>urmtom</code> from tick LTPs directly (<code>netqty × (ltp − netavgprc) × prcftr</code>), and reconcile the full snapshot from Positions periodically.</li>
        <li>Don't confuse this with the segment/product-level realized/unrealized breakdown in <a href="#" data-nav="funds-limits">Funds & Limits</a> (<code>rzpnl_*</code>, <code>uzpnl_*</code>) — that's a margin-engine view and may not sum identically to the Positions-derived figure due to rounding and timing differences. Use one source consistently rather than cross-checking the two as if they must always agree to the paisa.</li>
      </ul>` },
      { h: "Notes", body: `<p>If your use case is a dashboard rather than a trading decision, recomputing this once every few seconds from <a href="#" data-nav="positions">Positions</a> is usually sufficient — there's rarely a need to recompute on every single tick.</p>` },
    ],
  },

  "holdings": {
    badge: { method: "POST", path: "/NorenWClientAPI/Holdings" },
    desc: "Fetch demat holdings (delivery-settled equity) for the account, including collateral and pledge quantities.",
    sections: [
      { h: "Overview", body: `<p>Holdings returns settled, delivery-held equity — distinct from <a href="#" data-nav="positions">Positions</a>, which covers same-day and carry-forward trading positions. A share bought under CNC today shows up in Positions until settlement, then moves here.</p>` },
      { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td>uid / actid</td><td>string</td><td><span class="req-tag">Required</span></td><td>User and account ID.</td></tr>
        <tr><td>prd</td><td>string</td><td><span class="opt-tag">Optional</span></td><td>Filter holdings by product.</td></tr>
      </table>` },
      { h: "Request example", body: `${codeTabs("holdings-req", {
        python: `import requests, json
 
payload = {"uid": "AB1234", "actid": "AB1234"}
data = f"jData={json.dumps(payload)}&jKey={accessToken}"
 
resp = requests.post("https://api.shoonya.com/NorenWClientAPI/Holdings", data=data)
for h in resp.json():
    tsym = h["exch_tsym"][0]["tsym"]
    print(tsym, "holdqty:", h["holdqty"], "avg cost:", h["upldprc"])`,
        javascript: `const payload = { uid: "AB1234", actid: "AB1234" };
const data = \`jData=\${JSON.stringify(payload)}&jKey=\${accessToken}\`;
 
const res = await fetch("https://api.shoonya.com/NorenWClientAPI/Holdings", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: data,
});
console.log(await res.json());`,
        curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/Holdings \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode 'jData={"uid":"AB1234","actid":"AB1234"}' \\
  --data-urlencode "jKey=$ACCESS_TOKEN"`,
      })}` },
      { h: "Response", body: `${codeBlock("json", `[
  {
    "stat": "Ok",
    "exch_tsym": [{ "exch": "NSE", "token": "22", "tsym": "ABB-EQ" }],
    "holdqty": "20",
    "colqty": "0",
    "btstqty": "0",
    "btstcolqty": "0",
    "usedqty": "0",
    "upldprc": "1800.00"
  }
]`)}
      <table class="param-table">
        <tr><th>Field</th><th>Description</th></tr>
        <tr><td>exch_tsym</td><td>Array — a holding can map to more than one exchange/token pair for dually-listed scrips.</td></tr>
        <tr><td>holdqty</td><td>Core demat holding quantity.</td></tr>
        <tr><td>dpqty / npoadqty</td><td>DP holding quantity and non-POA display quantity — relevant when POA isn't set up on the account.</td></tr>
        <tr><td>colqty / brkcolqty / unplgdqty</td><td>Pledged/collateral and unpledged quantities.</td></tr>
        <tr><td>btstqty / btstcolqty</td><td>BTST (buy-today-sell-tomorrow) quantity and its collateral portion.</td></tr>
        <tr><td>usedqty</td><td>Quantity already used/sold today — subtract this before computing what's still sellable.</td></tr>
        <tr><td>upldprc</td><td>Average cost price uploaded with the holding.</td></tr>
      </table>
      <div class="callout"><b>Computing valuation vs. sellable quantity</b>
      <code>Valuation = btstqty + holdqty + brkcolqty + unplgdqty + benqty + max(npoadqty, dpqty) − usedqty</code><br>
      <code>Salable = btstqty + holdqty + unplgdqty + benqty + dpqty − usedqty</code></div>` },
      { h: "Error handling", body: `${codeBlock("json", `{ "stat": "Not_Ok", "emsg": "Invalid Input : Missing uid or actid or prd." }`)}` },
      { h: "Best practices", body: `<ul>
        <li>Use the salable-quantity formula above before placing a sell order against holdings — don't sell against raw <code>holdqty</code>, since pledged/used portions aren't available to trade.</li>
        <li>Cache holdings for the session; they change on settlement (T+1), not intraday, unlike Positions.</li>
      </ul>` },
      { h: "Notes", body: `<p>For same-day and carry-forward trading exposure, see <a href="#" data-nav="positions">Positions</a> instead — Holdings only reflects settled demat stock.</p>` },
    ],
  },
 
  "funds-limits": {
    badge: { method: "POST", path: "/NorenWClientAPI/Limits" },
    desc: "Fetch available margin, cash balance, and a full breakdown of margin utilization across segments and products.",
    sections: [
      { h: "Overview", body: `<p>Funds & Limits returns your account's current cash and margin picture — what's available, what's been used, and a detailed breakdown of exactly what's consuming margin (SPAN, exposure, premium, brokerage) segmented by equity/derivative/FX/commodity and by intraday/margin/carry-forward. Check this before sizing any order rather than discovering insufficient margin via a rejection from <a href="#" data-nav="risk-management">RMS</a>.</p>` },
      { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td>uid / actid</td><td>string</td><td><span class="req-tag">Required</span></td><td>User and account ID.</td></tr>
        <tr><td>product_type</td><td>string</td><td><span class="opt-tag">Optional</span></td><td>Restrict the response to a single product.</td></tr>
        <tr><td>segment</td><td>string</td><td><span class="opt-tag">Optional</span></td><td><code>CM</code> (equity), <code>FO</code> (derivatives), or <code>FX</code> (currency).</td></tr>
        <tr><td>exchange</td><td>string</td><td><span class="opt-tag">Optional</span></td><td>Restrict to a single exchange.</td></tr>
      </table>` },
      { h: "Request example", body: `${codeTabs("limits-req", {
        python: `import requests, json
 
payload = {"uid": "AB1234", "actid": "AB1234"}
data = f"jData={json.dumps(payload)}&jKey={accessToken}"
 
resp = requests.post("https://api.shoonya.com/NorenWClientAPI/Limits", data=data)
limits = resp.json()
available = float(limits["cash"]) - float(limits["marginused"])
print("Available margin:", available)`,
        javascript: `const payload = { uid: "AB1234", actid: "AB1234" };
const data = \`jData=\${JSON.stringify(payload)}&jKey=\${accessToken}\`;
 
const res = await fetch("https://api.shoonya.com/NorenWClientAPI/Limits", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: data,
});
const limits = await res.json();
console.log("Available margin:", Number(limits.cash) - Number(limits.marginused));`,
        curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/Limits \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode 'jData={"uid":"AB1234","actid":"AB1234"}' \\
  --data-urlencode "jKey=$ACCESS_TOKEN"`,
      })}` },
      { h: "Response", body: `${codeBlock("json", `{
  "stat": "Ok",
  "request_time": "18:07:31 15-12-2024",
  "cash": "1500000.00",
  "payin": "0.00",
  "payout": "0.00",
  "brkcollamt": "0.00",
  "marginused": "394554.00",
  "span": "210300.00",
  "expo": "48200.00",
  "premium": "0.00",
  "brokerage": "412.50",
  "collateral": "0.00",
  "turnoverlmt": "50000000.00",
  "pendordvallmt": "20000000.00",
  "turnover": "391500.00",
  "pendordval": "287100.00",
  "rpnl": "1200.00",
  "unmtom": "3054.00"
}`)}
      <table class="param-table">
        <tr><th>Field group</th><th>Key fields</th><th>Meaning</th></tr>
        <tr><td>Cash</td><td><code>cash</code>, <code>payin</code>, <code>payout</code>, <code>unclearedcash</code>, <code>daycash</code></td><td>Core margin available and today's fund movements.</td></tr>
        <tr><td>Margin utilized</td><td><code>marginused</code>, <code>mtomcurper</code></td><td>Total margin/funds consumed today and current MTM percentage.</td></tr>
        <tr><td>Margin components</td><td><code>span</code>, <code>expo</code>, <code>premium</code>, <code>varelm</code>, <code>marprt</code>, <code>brokerage</code>, <code>collateral</code></td><td>What's actually consuming the used margin — SPAN, exposure, option premium, VaR/ELM, covered-product margin, brokerage, and pledged collateral value.</td></tr>
        <tr><td>Risk limits</td><td><code>turnoverlmt</code>, <code>pendordvallmt</code>, <code>turnover</code>, <code>pendordval</code></td><td>Configured ceilings vs. current usage for turnover and pending order value.</td></tr>
        <tr><td>Segment/product breakup</td><td><code>rzpnl_e_i</code>, <code>uzpnl_d_m</code>, <code>span_c_i</code>, <code>brkage_f_h</code>, etc.</td><td>Every core figure above also comes broken out by segment (<code>e</code>=equity, <code>d</code>=derivative, <code>f</code>=FX, <code>c</code>=commodity) and product (<code>i</code>=intraday, <code>m</code>=margin/carry-forward, <code>c</code>=CNC, <code>h</code>=cover, <code>b</code>=bracket).</td></tr>
      </table>
      <div class="callout"><b>Segment/product suffix convention</b>Fields ending in <code>_&lt;segment&gt;_&lt;product&gt;</code> (e.g. <code>rzpnl_d_i</code> = realized P&L, derivatives, intraday) repeat the same handful of metrics per bucket. Parse them generically with a suffix split rather than hardcoding every field name.</div>` },
      { h: "Error handling", body: `${codeBlock("json", `{ "stat": "Not_Ok", "emsg": "Server Timeout :  " }`)}` },
      { h: "Best practices", body: `<ul>
        <li>Check available margin here before every order that materially changes exposure — don't rely on RMS rejection as your sizing feedback loop, since that rejection happens after the order has already left your system.</li>
        <li>For a strategy running across multiple segments, use the segment-suffixed fields to see per-segment margin consumption rather than only the aggregate.</li>
        <li>Not every field is populated on every account — treat undocumented/missing fields as <code>0</code> or absent rather than erroring.</li>
      </ul>` },
      { h: "Notes", body: `<p>This is the same underlying data as the Limits/Margin view in the Shoonya terminal. Field names shown follow standard NorenOMS convention — confirm the exact set returned for your account type before building alerting logic on top of it.</p>` },
    ],
  },


  //positions

  "positions": {
  badge: { method: "POST", path: "/NorenWClientAPI/PositionBook" },
  desc: "Fetch net open positions across all products and exchanges for the logged-in account.",
  sections: [
    { h: "Overview", body: `<p>Returns the current position book for the logged-in account — day and carry-forward buy/sell quantities, average prices, last traded price, and realized/unrealized P&L for every open or squared-off position for the trading day.</p>` },
    { h: "Purpose", body: `<p>Use this to build a live positions dashboard, compute portfolio-level MTM, or check net exposure per symbol before placing further orders.</p>` },
    { h: "Parameters", body: `
    <table class="param-table">
      <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
      <tr><td>uid</td><td>string</td><td><span class="req-tag">required</span></td><td>User ID of the logged-in account.</td></tr>
      <tr><td>actid</td><td>string</td><td><span class="req-tag">required</span></td><td>Account ID to fetch positions for (usually same as uid).</td></tr>
    </table>` },
    { h: "Request example", body: `${codeTabs("positions-req", {
      python: `positions = api.get_positions()`,
      javascript: `const res = await fetch("https://api.shoonya.com/NorenWClientAPI/PositionBook", {
  method: "POST",
  body: \`jData=\${JSON.stringify({ uid, actid })}&jKey=\${token}\`,
});
console.log(await res.json());`,
      curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/PositionBook \\
  -d 'jData={"uid":"ABC123","actid":"ABC123"}&jKey=<token>'`,
    })}` },
    { h: "Response example", body: `${codeBlock("json", `[
  {
    "stat": "Ok",
    "uid": "ABC123",
    "actid": "ABC123",
    "exch": "NSE",
    "tsym": "EMIL-EQ",
    "s_prdt_ali": "MIS",
    "prd": "I",
    "token": "11530",
    "symname": "EMIL",
    "instname": "EQ",
    "cname": "ELECTRONICS MART IND LTD",
    "frzqty": "552883",
    "pp": "2",
    "ls": "1",
    "ti": "0.01",
    "mult": "1",
    "prcftr": "1.000000",
    "daybuyqty": "200",
    "daysellqty": "200",
    "daybuyamt": "37060.00",
    "daybuyavgprc": "185.30",
    "daysellamt": "36740.00",
    "daysellavgprc": "183.70",
    "cfbuyqty": "0",
    "cfsellqty": "0",
    "netqty": "0",
    "netavgprc": "0.00",
    "upldprc": "0.00",
    "netupldprc": "0.00",
    "lp": "184.75",
    "urmtom": "0.00",
    "bep": "0.00",
    "totbuyamt": "37060.00",
    "totsellamt": "36740.00",
    "totbuyavgprc": "185.30",
    "totsellavgprc": "183.70",
    "rpnl": "-320.00"
  }
]`)}` },
    { h: "Error handling", body: `<table class="param-table">
      <tr><th>Code</th><th>Meaning</th></tr>
      <tr><td>Not_Ok</td><td>Session expired or invalid session key — re-authenticate via OAuth.</td></tr>
      <tr><td>[]</td><td>No open or day positions. An empty array is a valid response, not an error.</td></tr>
    </table>` },
    { h: "Best practices", body: `<ul>
      <li>Poll on a reasonable interval — this is a snapshot endpoint, not a stream. Use WebSocket order/position updates for real-time changes.</li>
      <li><code>netqty</code> of <code>"0"</code> with non-zero <code>rpnl</code> means the position was fully squared off during the day — don't filter these out if you're computing realized P&L.</li>
      <li><code>urmtom</code> (unrealized MTM) only reflects open positions; combine with <code>rpnl</code> for total day P&L.</li>
    </ul>` },
    { h: "Python example", body: `${codeBlock("python", `positions = api.get_positions()
for p in positions:
    print(p['tsym'], p['netqty'], p['rpnl'])`)}` },
    { h: "Notes", body: `<p>Field names are abbreviated per the Noren protocol (<code>rpnl</code> = realized P&L, <code>urmtom</code> = unrealized MTM, <code>cf</code> = carry-forward). Use <a href="#" data-nav="product-conversion">Product Conversion</a> to move a position between intraday and delivery products without squaring off and re-entering.</p>` },
  ],
},
  
  // ---------------------------------------------------------------
// GTT ORDERS SECTION
// ---------------------------------------------------------------

"place-gtt-order": {
  badge: { method: "POST", path: "/NorenWClientAPI/PlaceGTTOrder" },

  desc: "Register a Good-Till-Triggered order: an order that stays dormant until the specified LTP condition is met, at which point it's submitted to the exchange with the given order parameters.",

  sections: [

    { h: "API Endpoint", body: `
      <table class="param-table">
        <tr><td><b>Method</b></td><td><code>POST</code></td></tr>
        <tr><td><b>URL</b></td><td><code>https://api.shoonya.com/NorenWClientAPI/PlaceGTTOrder</code></td></tr>
        <tr><td><b>Content-Type</b></td><td><code>application/x-www-form-urlencoded</code></td></tr>
        <tr><td><b>Payload</b></td><td><code>jData=&lt;JSON payload&gt;&amp;jKey=&lt;AccessToken&gt;</code> — requires a valid <code>AccessToken</code> from <a href="#" data-nav="login-flow-overview">Login</a>.</td></tr>
      </table>
    ` },

    { h: "Overview", body: `
      <p>Place GTT Order is a superset of <a href="#" data-nav="set-alert">Set Alert</a>: it carries the same trigger-condition fields (<code>ai_t</code>, <code>d</code>, <code>validity</code>) plus the full order payload (<code>trantype</code>, <code>prctyp</code>, <code>prd</code>, <code>qty</code>, <code>prc</code>, etc.) that gets submitted once the condition fires. Unlike <a href="#" data-nav="place-order">Place Order</a>, <code>prctyp</code> here also allows <code>MKT</code>, <code>DS</code>, <code>2L</code>, and <code>3L</code>.</p>
    ` },

    { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th><th>Allowed Values</th></tr>
        <tr><td>uid</td><td>string</td><td><span class="req-tag">Required</span></td><td>User ID of the logged-in user.</td><td>Account-specific</td></tr>
        <tr><td>actid</td><td>string</td><td><span class="req-tag">Required</span></td><td>Login user's account ID.</td><td>Account-specific</td></tr>
        <tr><td>tsym</td><td>string</td><td><span class="req-tag">Required</span></td><td>Trading symbol.</td><td>Must exist in <a href="#" data-nav="symbol-master">Symbol Master</a></td></tr>
        <tr><td>exch</td><td>string</td><td><span class="req-tag">Required</span></td><td>Exchange segment.</td><td>See <a href="#" data-nav="exchange-segment-codes">Exchange Segment Codes</a></td></tr>
        <tr><td>ai_t</td><td>string</td><td><span class="req-tag">Required</span></td><td>Alert type the trigger condition is evaluated against.</td><td>See <a href="#" data-nav="enabled-gtt-orders">Get Enabled GTT Orders</a></td></tr>
        <tr><td>validity</td><td>string</td><td><span class="req-tag">Required</span></td><td>Validity of the trigger.</td><td><code>DAY</code>, <code>GTT</code></td></tr>
        <tr><td>d</td><td>string</td><td><span class="opt-tag">Optional</span></td><td>Value compared against LTP to decide when the order fires.</td><td>Numeric string</td></tr>
        <tr><td>remarks</td><td>string</td><td><span class="req-tag">Required</span></td><td>Free-text message for identification.</td><td>Free text</td></tr>
        <tr><td>trantype</td><td>string</td><td><span class="req-tag">Required</span></td><td>Transaction type.</td><td><code>B</code> (Buy), <code>S</code> (Sell)</td></tr>
        <tr><td>prctyp</td><td>string</td><td><span class="req-tag">Required</span></td><td>Order type submitted on trigger.</td><td><code>LMT</code>, <code>MKT</code>, <code>SL-LMT</code>, <code>SL-MKT</code>, <code>DS</code>, <code>2L</code>, <code>3L</code></td></tr>
        <tr><td>prd</td><td>string</td><td><span class="req-tag">Required</span></td><td>Product type.</td><td><code>C</code>, <code>M</code>, <code>H</code></td></tr>
        <tr><td>ret</td><td>string</td><td><span class="req-tag">Required</span></td><td>Retention type of the resulting order (options depend on exchange).</td><td><code>DAY</code>, <code>EOS</code>, <code>IOC</code></td></tr>
        <tr><td>qty</td><td>integer</td><td><span class="req-tag">Required</span></td><td>Order quantity.</td><td>&gt; 0, lot-size multiple for derivatives</td></tr>
        <tr><td>prc</td><td>number</td><td><span class="req-tag">Required</span></td><td>Order price submitted on trigger.</td><td>&gt; 0</td></tr>
        <tr><td>dscqty</td><td>integer</td><td><span class="opt-tag">Optional</span></td><td>Disclosed quantity.</td><td>Max 10% (NSE), 50% (MCX)</td></tr>
      </table>
    ` },

    { h: "Request Examples", body: `${codeTabs("place-gtt-order-req", {
      python: `import requests, json

payload = {
    "uid": "AB1234",
    "actid": "AB1234",
    "tsym": "RELIANCE-EQ",
    "exch": "NSE",
    "ai_t": "LTP",
    "validity": "GTT",
    "d": "2500",
    "remarks": "gtt-breakout-buy",
    "trantype": "B",
    "prctyp": "LMT",
    "prd": "C",
    "ret": "DAY",
    "qty": "1",
    "prc": "2505.0",
}
data = f"jData={json.dumps(payload)}&jKey={accessToken}"

response = requests.post(
    "https://api.shoonya.com/NorenWClientAPI/PlaceGTTOrder",
    data=data,
)
result = response.json()

if result.get("al_id"):
    print("GTT order placed:", result["al_id"])
else:
    print("GTT order rejected:", result.get("emsg"))`,

      javascript: `const payload = {
  uid: "AB1234",
  actid: "AB1234",
  tsym: "RELIANCE-EQ",
  exch: "NSE",
  ai_t: "LTP",
  validity: "GTT",
  d: "2500",
  remarks: "gtt-breakout-buy",
  trantype: "B",
  prctyp: "LMT",
  prd: "C",
  ret: "DAY",
  qty: "1",
  prc: "2505.0",
};
const data = \`jData=\${JSON.stringify(payload)}&jKey=\${accessToken}\`;

const res = await fetch("https://api.shoonya.com/NorenWClientAPI/PlaceGTTOrder", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: data,
});
const result = await res.json();
console.log(result.al_id ? \`GTT order placed: \${result.al_id}\` : \`Rejected: \${result.emsg}\`);`,

      curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/PlaceGTTOrder \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode 'jData={"uid":"AB1234","actid":"AB1234","tsym":"RELIANCE-EQ","exch":"NSE","ai_t":"LTP","validity":"GTT","d":"2500","remarks":"gtt-breakout-buy","trantype":"B","prctyp":"LMT","prd":"C","ret":"DAY","qty":"1","prc":"2505.0"}' \\
  --data-urlencode "jKey=$ACCESS_TOKEN"`,
    })}` },

    { h: "Response", body: `
      ${codeBlock("json", `// Success
{
  "request_time": "10:02:06 15-04-2021",
  "stat": "Oi created",
  "al_id": "210415000000010"
}

// Failure
{
  "stat": "Not_Ok",
  "emsg": "Session Expired : Invalid Session Key"
}`)}
      <table class="param-table">
        <tr><th>Field</th><th>Description</th></tr>
        <tr><td>stat</td><td>Success/failure indication (a status string on success, not a plain <code>Ok</code> flag).</td></tr>
        <tr><td>request_time</td><td>Present only on success.</td></tr>
        <tr><td>al_id</td><td>Alert ID for this GTT order — needed for <a href="#" data-nav="cancel-gtt-order">Cancel GTT Order</a> and appears in <a href="#" data-nav="pending-gtt-orders">Get Pending GTT Order</a>.</td></tr>
        <tr><td>emsg</td><td>Present only on failure — e.g. Invalid Input, Session Expired.</td></tr>
      </table>
    ` },

    { h: "Best Practices", body: `<ul>
      <li>Check for <code>al_id</code> in the response before trusting the order is registered — <code>stat</code> is a free-form status string here, not a plain <code>Ok</code>/<code>Not_Ok</code> flag.</li>
      <li>Confirm the <code>ai_t</code> value against <a href="#" data-nav="enabled-gtt-orders">Get Enabled GTT Orders</a> before every placement — an unsupported alert type fails at request time, not silently.</li>
      <li>Reconcile with <a href="#" data-nav="pending-gtt-orders">Get Pending GTT Order</a> after placing, the same way you'd reconcile a regular order against <a href="#" data-nav="order-book">Order Book</a> — a GTT order sits dormant for potentially a long time, so don't assume it's still there without checking.</li>
      <li>Because the resulting order fires whenever the market later crosses your trigger, re-validate <code>prc</code> against the live circuit band and lot size at trigger time in your own monitoring — a GTT order placed weeks earlier can go stale relative to corporate actions, splits, or circuit changes.</li>
      <li><code>MKT</code> is allowed here even though it's rejected on <a href="#" data-nav="place-order">Place Order</a> — decide deliberately whether you want price protection (<code>LMT</code>) or fill certainty (<code>MKT</code>) once triggered.</li>
    </ul>` },
  ],
},

// ---------------------------------------------------------------

"cancel-gtt-order": {
  badge: { method: "POST", path: "/NorenWClientAPI/CancelGTTOrder" },

  desc: "Cancel a pending GTT order by its Alert ID before its trigger condition fires.",

  sections: [

    { h: "API Endpoint", body: `
      <table class="param-table">
        <tr><td><b>Method</b></td><td><code>POST</code></td></tr>
        <tr><td><b>URL</b></td><td><code>https://api.shoonya.com/NorenWClientAPI/CancelGTTOrder</code></td></tr>
        <tr><td><b>Content-Type</b></td><td><code>application/x-www-form-urlencoded</code></td></tr>
        <tr><td><b>Payload</b></td><td><code>jData=&lt;JSON payload&gt;&amp;jKey=&lt;AccessToken&gt;</code></td></tr>
      </table>
    ` },

    { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td>uid</td><td>string</td><td><span class="req-tag">Required</span></td><td>User ID of the logged-in user.</td></tr>
        <tr><td>al_id</td><td>string</td><td><span class="req-tag">Required</span></td><td>Alert ID returned by <a href="#" data-nav="place-gtt-order">Place GTT Order</a>.</td></tr>
      </table>
    ` },

    { h: "Request Examples", body: `${codeTabs("cancel-gtt-order-req", {
      python: `import requests, json

payload = {"uid": "AB1234", "al_id": "210415000000010"}
data = f"jData={json.dumps(payload)}&jKey={accessToken}"

response = requests.post(
    "https://api.shoonya.com/NorenWClientAPI/CancelGTTOrder",
    data=data,
)
print(response.json())`,

      javascript: `const payload = { uid: "AB1234", al_id: "210415000000010" };
const data = \`jData=\${JSON.stringify(payload)}&jKey=\${accessToken}\`;

const res = await fetch("https://api.shoonya.com/NorenWClientAPI/CancelGTTOrder", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: data,
});
console.log(await res.json());`,

      curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/CancelGTTOrder \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode 'jData={"uid":"AB1234","al_id":"210415000000010"}' \\
  --data-urlencode "jKey=$ACCESS_TOKEN"`,
    })}` },

    { h: "Response", body: `
      ${codeBlock("json", `// Success
{
  "request_time": "12:20:01 15-04-2021",
  "stat": "Oi delete success",
  "al_id": "210415000000013"
}

// Failure
{
  "stat": "Not_Ok",
  "emsg": "Session Expired : Invalid Session Key"
}`)}
      <table class="param-table">
        <tr><th>Field</th><th>Description</th></tr>
        <tr><td>stat</td><td>Success/failure indication (status string on success).</td></tr>
        <tr><td>al_id</td><td>The cancelled Alert ID, echoed back on success.</td></tr>
        <tr><td>emsg</td><td>Present only on failure.</td></tr>
      </table>
    ` },

    { h: "Best Practices", body: `<ul>
      <li>Fetch <code>al_id</code> from <a href="#" data-nav="pending-gtt-orders">Get Pending GTT Order</a> right before cancelling if you didn't keep the ID from placement — it's the only key this endpoint accepts.</li>
      <li>A cancel call on an <code>al_id</code> that has already triggered (and become a live order) will fail — check <a href="#" data-nav="pending-gtt-orders">Get Pending GTT Order</a> first if there's any chance the trigger condition was recently met.</li>
      <li>Treat <code>stat</code> as a free-form string ("Oi delete success") rather than pattern-matching on an exact value — check for the absence of <code>emsg</code>, or that the returned <code>al_id</code> matches what you sent.</li>
    </ul>` },
  ],
},

// ---------------------------------------------------------------

"pending-gtt-orders": {
  badge: { method: "POST", path: "/NorenWClientAPI/GetPendingGTTOrder" },

  desc: "Fetch GTT orders that have been placed but whose trigger condition hasn't fired yet.",

  sections: [

    { h: "API Endpoint", body: `
      <table class="param-table">
        <tr><td><b>Method</b></td><td><code>POST</code></td></tr>
        <tr><td><b>URL</b></td><td><code>https://api.shoonya.com/NorenWClientAPI/GetPendingGTTOrder</code></td></tr>
        <tr><td><b>Content-Type</b></td><td><code>application/x-www-form-urlencoded</code></td></tr>
        <tr><td><b>Payload</b></td><td><code>jData=&lt;JSON payload&gt;&amp;jKey=&lt;AccessToken&gt;</code></td></tr>
      </table>
      <div class="callout warn"><b>Response shape unconfirmed for multiple orders</b>The sample response is a single order object, not an array. Confirm with a live call whether multiple pending GTT orders come back as a list — don't assume the array shape shown for <a href="#" data-nav="enabled-gtt-orders">Get Enabled GTT Orders</a> applies here.</div>
    ` },

    { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td>uid</td><td>string</td><td><span class="req-tag">Required</span></td><td>User ID of the logged-in user.</td></tr>
      </table>
    ` },

    { h: "Request Examples", body: `${codeTabs("pending-gtt-orders-req", {
      python: `import requests, json

payload = {"uid": "AB1234"}
data = f"jData={json.dumps(payload)}&jKey={accessToken}"

response = requests.post(
    "https://api.shoonya.com/NorenWClientAPI/GetPendingGTTOrder",
    data=data,
)
print(response.json())`,

      javascript: `const payload = { uid: "AB1234" };
const data = \`jData=\${JSON.stringify(payload)}&jKey=\${accessToken}\`;

const res = await fetch("https://api.shoonya.com/NorenWClientAPI/GetPendingGTTOrder", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: data,
});
console.log(await res.json());`,

      curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/GetPendingGTTOrder \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode 'jData={"uid":"AB1234"}' \\
  --data-urlencode "jKey=$ACCESS_TOKEN"`,
    })}` },

    { h: "Response", body: `
      ${codeBlock("json", `// Success
{
  "stat": "OK",
  "ai_t": "LTP_A",
  "al_id": "210415000000002",
  "tsym": "ACC-EQ",
  "exch": "NSE",
  "token": "22",
  "Remarks": "test",
  "validity": "DAY",
  "actid": "MDHINIT",
  "trantype": "B",
  "prctyp": "LMT",
  "qty": 1,
  "prc": "1305.00",
  "prd": "C",
  "ordersource": "MOB",
  "d": "1900.00"
}

// Failure
{
  "stat": "Not_Ok",
  "emsg": "Session Expired : Invalid Session Key"
}`)}
      <table class="param-table">
        <tr><th>Field</th><th>Description</th></tr>
        <tr><td>stat</td><td>Success/failure indication.</td></tr>
        <tr><td>al_id</td><td>Alert ID of this pending GTT order.</td></tr>
        <tr><td>ai_t</td><td>Alert type the trigger is evaluated against.</td></tr>
        <tr><td>tsym / exch / token</td><td>Symbol, exchange segment, and contract token.</td></tr>
        <tr><td>validity / d</td><td>Trigger validity and the LTP comparison value.</td></tr>
        <tr><td>trantype / prctyp / prd / qty / prc</td><td>The order parameters that will be submitted once triggered — same meanings as in <a href="#" data-nav="place-gtt-order">Place GTT Order</a>.</td></tr>
        <tr><td>emsg</td><td>Present only on failure.</td></tr>
      </table>
    ` },

    { h: "Best Practices", body: `<ul>
      <li>Poll this endpoint periodically (or on reconnect) rather than relying purely on local state — it's your source of truth for which GTT orders are still dormant versus already triggered or cancelled.</li>
      <li>Confirm the exact response shape with a live account holding 2+ pending GTT orders before writing parsing code — the documented sample shows only a single order object, and this doc doesn't confirm whether multiple orders come back as an array or as repeated top-level fields.</li>
      <li>Cross-reference <code>al_id</code> values here against your own local record of orders you placed via <a href="#" data-nav="place-gtt-order">Place GTT Order</a> to detect any GTT orders that triggered (and therefore disappeared from this list) since your last check.</li>
    </ul>` },
  ],
},

// ---------------------------------------------------------------

"enabled-gtt-orders": {
  badge: { method: "POST", path: "/NorenWClientAPI/GetEnabledGTTs" },

  desc: "Fetch the alert types (ai_t values) enabled for your account — call this before Place GTT Order / Set Alert so you send a supported ai_t.",

  sections: [

    { h: "API Endpoint", body: `
      <table class="param-table">
        <tr><td><b>Method</b></td><td><code>POST</code></td></tr>
        <tr><td><b>URL</b></td><td><code>https://api.shoonya.com/NorenWClientAPI/GetEnabledGTTs</code></td></tr>
        <tr><td><b>Content-Type</b></td><td><code>application/x-www-form-urlencoded</code></td></tr>
        <tr><td><b>Payload</b></td><td><code>jData=&lt;JSON payload&gt;&amp;jKey=&lt;AccessToken&gt;</code></td></tr>
      </table>
      <div class="callout warn"><b>Naming vs. behavior</b>The endpoint name says "GTTs" but the response is a list of enabled <i>alert types</i> (<code>ai_t</code> values), used by both <a href="#" data-nav="place-gtt-order">Place GTT Order</a> and <a href="#" data-nav="set-alert">Set Alert</a> — it does not return your pending GTT orders (that's <a href="#" data-nav="pending-gtt-orders">Get Pending GTT Order</a>). This same endpoint is what "Get Enabled Alert Types" refers to in the Alerts section.</div>
    ` },

    { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td>uid</td><td>string</td><td><span class="req-tag">Required</span></td><td>User ID of the logged-in user.</td></tr>
      </table>
    ` },

    { h: "Request Examples", body: `${codeTabs("enabled-gtt-orders-req", {
      python: `import requests, json

payload = {"uid": "AB1234"}
data = f"jData={json.dumps(payload)}&jKey={accessToken}"

response = requests.post(
    "https://api.shoonya.com/NorenWClientAPI/GetEnabledGTTs",
    data=data,
)
result = response.json()
alert_types = [row["ai_t"] for row in result.get("ai_ts", [])]
print("Enabled alert types:", alert_types)`,

      javascript: `const payload = { uid: "AB1234" };
const data = \`jData=\${JSON.stringify(payload)}&jKey=\${accessToken}\`;

const res = await fetch("https://api.shoonya.com/NorenWClientAPI/GetEnabledGTTs", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: data,
});
const result = await res.json();
console.log("Enabled alert types:", (result.ai_ts || []).map(r => r.ai_t));`,

      curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/GetEnabledGTTs \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode 'jData={"uid":"AB1234"}' \\
  --data-urlencode "jKey=$ACCESS_TOKEN"`,
    })}` },

    { h: "Response", body: `
      ${codeBlock("json", `// Success
{
  "stat": "OK",
  "request_time": "04062021121503",
  "ai_ts": [
    { "ai_t": "ATP" },
    { "ai_t": "LTP" }
  ]
}

// Failure
{
  "stat": "Not_Ok",
  "emsg": "Session Expired : Invalid Session Key"
}`)}
      <table class="param-table">
        <tr><th>Field</th><th>Description</th></tr>
        <tr><td>stat</td><td><code>OK</code> or <code>Not_Ok</code>.</td></tr>
        <tr><td>ai_ts</td><td>Array of <code>{ ai_t }</code> objects — the alert types your account can use in <a href="#" data-nav="place-gtt-order">Place GTT Order</a> and <a href="#" data-nav="set-alert">Set Alert</a>.</td></tr>
        <tr><td>emsg</td><td>Present only on failure.</td></tr>
      </table>
    ` },

    { h: "Best Practices", body: `<ul>
      <li>Cache the result rather than calling this before every <a href="#" data-nav="place-gtt-order">Place GTT Order</a> / <a href="#" data-nav="set-alert">Set Alert</a> call — enabled alert types change rarely, if ever, for a given account.</li>
      <li>Validate any hardcoded <code>ai_t</code> constant (like <code>"LTP"</code>) against this endpoint at startup rather than assuming it's always enabled — account-level differences are the whole reason this call exists.</li>
      <li>Don't confuse this with a list of your own live GTT orders — for that, use <a href="#" data-nav="pending-gtt-orders">Get Pending GTT Order</a> instead.</li>
    </ul>` },
  ],
},

// ---------------------------------------------------------------

"unsettled-trading-date": {
  badge: { method: "POST", path: "/NorenWClientAPI/GetUnSttledTradingDate" },

  desc: "Fetch upcoming trading dates that haven't settled yet — useful for scheduling GTT validity windows and settlement-aware logic.",

  sections: [

    { h: "API Endpoint", body: `
      <table class="param-table">
        <tr><td><b>Method</b></td><td><code>POST</code></td></tr>
        <tr><td><b>URL</b></td><td><code>https://api.shoonya.com/NorenWClientAPI/GetUnSttledTradingDate</code></td></tr>
        <tr><td><b>Content-Type</b></td><td><code>application/x-www-form-urlencoded</code></td></tr>
        <tr><td><b>Payload</b></td><td><code>jData=&lt;JSON payload&gt;&amp;jKey=&lt;AccessToken&gt;</code></td></tr>
      </table>
      <div class="callout warn"><b>Path spelling</b><code>UnSttledTradingDate</code> (missing the second "e" in "Settled") is exactly how the endpoint is spelled server-side — don't "fix" the typo in client code or it will 404.</div>
    ` },

    { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td>uid</td><td>string</td><td><span class="req-tag">Required</span></td><td>User ID of the logged-in user.</td></tr>
      </table>
    ` },

    { h: "Request Examples", body: `${codeTabs("unsettled-trading-date-req", {
      python: `import requests, json

payload = {"uid": "AB1234"}
data = f"jData={json.dumps(payload)}&jKey={accessToken}"

response = requests.post(
    "https://api.shoonya.com/NorenWClientAPI/GetUnSttledTradingDate",
    data=data,
)
result = response.json()
dates = [row["trd_date"] for row in result.get("trd_date", [])]
print("Unsettled trading dates:", dates)`,

      javascript: `const payload = { uid: "AB1234" };
const data = \`jData=\${JSON.stringify(payload)}&jKey=\${accessToken}\`;

const res = await fetch("https://api.shoonya.com/NorenWClientAPI/GetUnSttledTradingDate", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: data,
});
const result = await res.json();
console.log("Unsettled trading dates:", (result.trd_date || []).map(r => r.trd_date));`,

      curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/GetUnSttledTradingDate \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode 'jData={"uid":"AB1234"}' \\
  --data-urlencode "jKey=$ACCESS_TOKEN"`,
    })}` },

    { h: "Response", body: `
      ${codeBlock("json", `// Success
{
  "stat": "OK",
  "request_time": "10052021152900",
  "trd_date": [
    { "trd_date": "28-04-2021" },
    { "trd_date": "29-04-2021" },
    { "trd_date": "30-04-2021" }
  ]
}

// Failure
{
  "stat": "Not_Ok",
  "emsg": "Session Expired : Invalid Session Key"
}`)}
      <table class="param-table">
        <tr><th>Field</th><th>Description</th></tr>
        <tr><td>stat</td><td><code>OK</code> or <code>Not_Ok</code>.</td></tr>
        <tr><td>request_time</td><td>Present only on success.</td></tr>
        <tr><td>trd_date</td><td>Array of <code>{ trd_date }</code> objects listing unsettled trading dates.</td></tr>
        <tr><td>emsg</td><td>Present only on failure.</td></tr>
      </table>
    ` },

    { h: "Best Practices", body: `<ul>
      <li>Parse <code>trd_date</code> strings as <code>DD-MM-YYYY</code>, not <code>MM-DD-YYYY</code> — a naive date parser in a US-locale environment will silently misread the month and day for any date past the 12th.</li>
      <li>Refresh this list once per session rather than hardcoding a settlement calendar — exchange holidays and settlement cycles shift.</li>
      <li>Use it to gate any settlement-dependent logic (e.g. deciding when a delivery-based position becomes eligible for further action) rather than computing T+1/T+2 manually from the current date.</li>
    </ul>` },
  ],
},

 // ---------------------------------------------------------------
// ALERTS SECTION
// ---------------------------------------------------------------
 
"set-alert": {
  badge: { method: "POST", path: "/NorenWClientAPI/SetAlert" },
 
  desc: "Create a price/condition-based alert on a symbol. A plain notification-only condition — GTT orders use the dedicated Place GTT Order endpoint instead.",
 
  sections: [
 
    { h: "API Endpoint", body: `
      <table class="param-table">
        <tr><td><b>Method</b></td><td><code>POST</code></td></tr>
        <tr><td><b>URL</b></td><td><code>https://api.shoonya.com/NorenWClientAPI/SetAlert</code></td></tr>
        <tr><td><b>Content-Type</b></td><td><code>application/x-www-form-urlencoded</code></td></tr>
        <tr><td><b>Payload</b></td><td><code>jData=&lt;JSON payload&gt;&amp;jKey=&lt;AccessToken&gt;</code> — requires a valid <code>AccessToken</code> from <a href="#" data-nav="login-flow-overview">Login</a>.</td></tr>
      </table>
    ` },
 
    { h: "Overview", body: `
      <p>Set Alert registers a condition evaluated against the live LTP feed. Use <a href="#" data-nav="enabled-gtt-orders">Get Enabled GTT Orders</a> to see which <code>ai_t</code> values your account supports before setting one. For an order that should fire automatically on trigger, use <a href="#" data-nav="place-gtt-order">Place GTT Order</a> instead — that's a separate endpoint, not this one with a different <code>validity</code>.</p>
    ` },
 
    { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th><th>Allowed Values</th></tr>
        <tr><td>uid</td><td>string</td><td><span class="req-tag">Required</span></td><td>User ID of the logged-in user.</td><td>Account-specific</td></tr>
        <tr><td>tsym</td><td>string</td><td><span class="req-tag">Required</span></td><td>Trading symbol the alert is set on.</td><td>Must exist in <a href="#" data-nav="symbol-master">Symbol Master</a></td></tr>
        <tr><td>exch</td><td>string</td><td><span class="req-tag">Required</span></td><td>Exchange segment.</td><td>See <a href="#" data-nav="exchange-segment-codes">Exchange Segment Codes</a></td></tr>
        <tr><td>ai_t</td><td>string</td><td><span class="req-tag">Required</span></td><td>Alert type — what the condition is evaluated against.</td><td>See <a href="#" data-nav="enabled-gtt-orders">Get Enabled GTT Orders</a></td></tr>
        <tr><td>validity</td><td>string</td><td><span class="req-tag">Required</span></td><td>Alert validity.</td><td><code>DAY</code>, <code>GTT</code></td></tr>
        <tr><td>d</td><td>string</td><td><span class="opt-tag">Optional</span></td><td>Value to compare against LTP to decide when the alert fires.</td><td>Numeric string</td></tr>
        <tr><td>remarks</td><td>string</td><td><span class="req-tag">Required</span></td><td>Free-text message stored with the alert for identification.</td><td>Free text</td></tr>
      </table>
    ` },
 
    { h: "Request Examples", body: `${codeTabs("set-alert-req", {
      python: `import requests
import json
 
payload = {
    "uid": "AB1234",
    "tsym": "RELIANCE-EQ",
    "exch": "NSE",
    "ai_t": "LTP",
    "validity": "DAY",
    "d": "2500",
    "remarks": "breakout-watch",
}
data = f"jData={json.dumps(payload)}&jKey={accessToken}"
 
response = requests.post(
    "https://api.shoonya.com/NorenWClientAPI/SetAlert",
    data=data,
)
result = response.json()
 
if result.get("al_id"):
    print("Alert created:", result["al_id"])
else:
    print("Alert rejected:", result.get("emsg"))`,
 
      javascript: `const payload = {
  uid: "AB1234",
  tsym: "RELIANCE-EQ",
  exch: "NSE",
  ai_t: "LTP",
  validity: "DAY",
  d: "2500",
  remarks: "breakout-watch",
};
 
const data = \`jData=\${JSON.stringify(payload)}&jKey=\${accessToken}\`;
 
const res = await fetch("https://api.shoonya.com/NorenWClientAPI/SetAlert", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: data,
});
const result = await res.json();
console.log(result.al_id ? \`Alert created: \${result.al_id}\` : \`Rejected: \${result.emsg}\`);`,
 
      curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/SetAlert \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode 'jData={"uid":"AB1234","tsym":"RELIANCE-EQ","exch":"NSE","ai_t":"LTP","validity":"DAY","d":"2500","remarks":"breakout-watch"}' \\
  --data-urlencode "jKey=$ACCESS_TOKEN"`,
    })}` },
 
    { h: "Response", body: `
      ${codeBlock("json", `// Success
{
  "request_time": "11:22:26 08-04-2021",
  "stat": "OI created",
  "al_id": "210408000000004"
}
 
// Failure
{
  "stat": "Not_Ok",
  "emsg": "Session Expired : Invalid Session Key"
}`)}
      <table class="param-table">
        <tr><th>Field</th><th>Description</th></tr>
        <tr><td>stat</td><td>Success/failure indication. On success this is a status message rather than a plain <code>Ok</code> flag — check for <code>al_id</code> being present as the reliable success signal.</td></tr>
        <tr><td>request_time</td><td>Present only on success.</td></tr>
        <tr><td>al_id</td><td>Alert ID, needed for <a href="#" data-nav="cancel-alert">Cancel Alert</a> / <a href="#" data-nav="modify-alert">Modify Alert</a>.</td></tr>
        <tr><td>emsg</td><td>Present only on failure — e.g. Invalid Input, Session Expired.</td></tr>
      </table>
    ` },
 
    { h: "Best Practices", body: `<ul>
      <li>Store the returned <code>al_id</code> immediately — there's no idempotency key on this call, so a network timeout leaves you unable to tell whether the alert was created without listing your alerts and matching on <code>tsym</code> + <code>remarks</code>.</li>
      <li>Validate <code>ai_t</code> against <a href="#" data-nav="enabled-gtt-orders">Get Enabled GTT Orders</a> before calling this, rather than discovering an unsupported type from <code>emsg</code>.</li>
      <li>Use a distinct, greppable <code>remarks</code> value per alert so you can reconcile alerts against your own system after the fact, the same way <a href="#" data-nav="place-order">Place Order</a> recommends for orders.</li>
    </ul>` },
  ],
},
 
// ---------------------------------------------------------------
 
"cancel-alert": {
  badge: { method: "POST", path: "/NorenWClientAPI/CancelAlert" },
 
  desc: "Cancel a previously set alert by its Alert ID.",
 
  sections: [
 
    { h: "API Endpoint", body: `
      <table class="param-table">
        <tr><td><b>Method</b></td><td><code>POST</code></td></tr>
        <tr><td><b>URL</b></td><td><code>https://api.shoonya.com/NorenWClientAPI/CancelAlert</code></td></tr>
        <tr><td><b>Content-Type</b></td><td><code>application/x-www-form-urlencoded</code></td></tr>
        <tr><td><b>Payload</b></td><td><code>jData=&lt;JSON payload&gt;&amp;jKey=&lt;AccessToken&gt;</code></td></tr>
      </table>
    ` },
 
    { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td>uid</td><td>string</td><td><span class="req-tag">Required</span></td><td>User ID of the logged-in user.</td></tr>
        <tr><td>al_id</td><td>string</td><td><span class="req-tag">Required</span></td><td>Alert ID returned by <a href="#" data-nav="set-alert">Set Alert</a>.</td></tr>
      </table>
      <div class="callout warn"><b>Field name in source docs</b>Vendor documentation lists this field as <code>ai_t</code> under Cancel Alert, but that conflicts with <code>ai_t</code> meaning "alert type" everywhere else. This is almost certainly a documentation typo for <code>al_id</code> — verify against a live call before shipping.</div>
    ` },
 
    { h: "Request Examples", body: `${codeTabs("cancel-alert-req", {
      python: `import requests, json
 
payload = {"uid": "AB1234", "al_id": "210408000000004"}
data = f"jData={json.dumps(payload)}&jKey={accessToken}"
 
response = requests.post(
    "https://api.shoonya.com/NorenWClientAPI/CancelAlert",
    data=data,
)
print(response.json())`,
 
      javascript: `const payload = { uid: "AB1234", al_id: "210408000000004" };
const data = \`jData=\${JSON.stringify(payload)}&jKey=\${accessToken}\`;
 
const res = await fetch("https://api.shoonya.com/NorenWClientAPI/CancelAlert", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: data,
});
console.log(await res.json());`,
 
      curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/CancelAlert \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode 'jData={"uid":"AB1234","al_id":"210408000000004"}' \\
  --data-urlencode "jKey=$ACCESS_TOKEN"`,
    })}` },
 
    { h: "Response", body: `
      ${codeBlock("json", `// Success
{
  "request_time": "15:03:33 08-04-2021",
  "stat": "O! delete success",
  "al_id": "210408000000008"
}
 
// Failure
{
  "stat": "Not_Ok",
  "emsg": "Session Expired : Invalid Session Key"
}`)}
      <table class="param-table">
        <tr><th>Field</th><th>Description</th></tr>
        <tr><td>stat</td><td>Success/failure indication (a status string on success, not a plain <code>Ok</code> flag).</td></tr>
        <tr><td>al_id</td><td>The cancelled Alert ID, echoed back on success.</td></tr>
        <tr><td>emsg</td><td>Present only on failure.</td></tr>
      </table>
    ` },
 
    { h: "Best Practices", body: `<ul>
      <li>Verify the <code>al_id</code>/<code>ai_t</code> field-name discrepancy above against a live sandbox call before shipping — send whichever field name actually works and note it in your own code comments, since the vendor docs disagree with themselves on this endpoint.</li>
      <li>Confirm an alert is still pending (via a list/pending endpoint) before cancelling if it's been a while since you set it — cancelling an alert that already fired will fail.</li>
    </ul>` },
  ],
},
 
// ---------------------------------------------------------------
 
"modify-alert": {
  badge: { method: "POST", path: "/NorenWClientAPI/ModifyAlert" },
 
  desc: "Update the trigger value, validity, or remarks on an existing alert. The alert type itself cannot be changed.",
 
  sections: [
 
    { h: "API Endpoint", body: `
      <table class="param-table">
        <tr><td><b>Method</b></td><td><code>POST</code></td></tr>
        <tr><td><b>URL</b></td><td><code>https://api.shoonya.com/NorenWClientAPI/ModifyAlert</code></td></tr>
        <tr><td><b>Content-Type</b></td><td><code>application/x-www-form-urlencoded</code></td></tr>
        <tr><td><b>Payload</b></td><td><code>jData=&lt;JSON payload&gt;&amp;jKey=&lt;AccessToken&gt;</code></td></tr>
      </table>
    ` },
 
    { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th><th>Allowed Values</th></tr>
        <tr><td>uid</td><td>string</td><td><span class="req-tag">Required</span></td><td>User ID of the logged-in user.</td><td>Account-specific</td></tr>
        <tr><td>al_id</td><td>string</td><td><span class="req-tag">Required</span></td><td>Alert ID of the alert to modify.</td><td>From <a href="#" data-nav="set-alert">Set Alert</a></td></tr>
        <tr><td>tsym</td><td>string</td><td><span class="req-tag">Required</span></td><td>Trading symbol.</td><td>Must exist in <a href="#" data-nav="symbol-master">Symbol Master</a></td></tr>
        <tr><td>exch</td><td>string</td><td><span class="req-tag">Required</span></td><td>Exchange segment.</td><td>See <a href="#" data-nav="exchange-segment-codes">Exchange Segment Codes</a></td></tr>
        <tr><td>ai_t</td><td>string</td><td><span class="req-tag">Required</span></td><td>Original alert type. Immutable — must match the value the alert was created with.</td><td>Cannot be changed</td></tr>
        <tr><td>validity</td><td>string</td><td><span class="req-tag">Required</span></td><td>Validity of the alert.</td><td><code>DAY</code>, <code>GTT</code></td></tr>
        <tr><td>d</td><td>string</td><td><span class="opt-tag">Optional</span></td><td>New value to compare against LTP.</td><td>Numeric string</td></tr>
        <tr><td>remarks</td><td>string</td><td><span class="req-tag">Required</span></td><td>Free-text message.</td><td>Free text</td></tr>
      </table>
      <div class="callout warn"><b>Alert type is fixed</b><code>ai_t</code> must be resent unchanged with every modify call — there is no way to convert an <code>LTP</code> alert into an <code>ATP</code> alert in place. Cancel and re-create instead.</div>
    ` },
 
    { h: "Request Examples", body: `${codeTabs("modify-alert-req", {
      python: `import requests, json
 
payload = {
    "uid": "AB1234",
    "al_id": "210408000000004",
    "tsym": "RELIANCE-EQ",
    "exch": "NSE",
    "ai_t": "LTP",       # must match the original alert's type
    "validity": "DAY",
    "d": "2550",
    "remarks": "breakout-watch-revised",
}
data = f"jData={json.dumps(payload)}&jKey={accessToken}"
 
response = requests.post(
    "https://api.shoonya.com/NorenWClientAPI/ModifyAlert",
    data=data,
)
print(response.json())`,
 
      javascript: `const payload = {
  uid: "AB1234",
  al_id: "210408000000004",
  tsym: "RELIANCE-EQ",
  exch: "NSE",
  ai_t: "LTP",
  validity: "DAY",
  d: "2550",
  remarks: "breakout-watch-revised",
};
const data = \`jData=\${JSON.stringify(payload)}&jKey=\${accessToken}\`;
 
const res = await fetch("https://api.shoonya.com/NorenWClientAPI/ModifyAlert", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: data,
});
console.log(await res.json());`,
 
      curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/ModifyAlert \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode 'jData={"uid":"AB1234","al_id":"210408000000004","tsym":"RELIANCE-EQ","exch":"NSE","ai_t":"LTP","validity":"DAY","d":"2550","remarks":"breakout-watch-revised"}' \\
  --data-urlencode "jKey=$ACCESS_TOKEN"`,
    })}` },
 
    { h: "Response", body: `
      ${codeBlock("json", `// Success
{
  "request_time": "16:36:42 08-04-2021",
  "stat": "Oi Replaced",
  "al_id": "210408000000013"
}
 
// Failure
{
  "stat": "Not_Ok",
  "emsg": "Session Expired : Invalid Session Key"
}`)}
      <table class="param-table">
        <tr><th>Field</th><th>Description</th></tr>
        <tr><td>stat</td><td>Success/failure indication (status string on success).</td></tr>
        <tr><td>al_id</td><td>The modified Alert ID, echoed back on success.</td></tr>
        <tr><td>emsg</td><td>Present only on failure.</td></tr>
      </table>
    ` },
 
    { h: "Best Practices", body: `<ul>
      <li>Always resend the full set of required fields (<code>tsym</code>, <code>exch</code>, <code>ai_t</code>, <code>validity</code>, <code>remarks</code>), not just the field you're changing — this looks like a full replace of the alert, not a partial patch.</li>
      <li>Fetch the alert's current values before modifying if you don't have them cached locally, so you don't accidentally overwrite <code>remarks</code> or <code>validity</code> with stale data.</li>
      <li>To change the alert type itself, cancel and re-create via <a href="#" data-nav="set-alert">Set Alert</a> instead of trying to force it through here.</li>
    </ul>` },
  ],
},
  

 
 

 

 

 


  



  

 
  // ---------- D. MARKET DATA APIs ----------
  "market-quotes": {
    badge: { method: "POST", path: "/NorenWClientAPI/GetQuotes" },
    desc: "Fetch the latest traded price, OHLC, and best bid/ask for one or more instruments.",
    sections: [
      { h: "Overview", body: `<p>Market Quotes returns a snapshot of the current LTP (last traded price), the day's OHLC, and top-of-book bid/ask for a given instrument — a single-shot read, not a stream.</p>` },
      { h: "Purpose", body: `<p>Use this for on-demand price checks — displaying a quote in a UI, or a strategy's initial price read at startup. For continuous prices, subscribe to <a href="#" data-nav="subscribe-market-feed">Subscribe to Market Feed</a> over WebSocket instead; polling this endpoint in a loop will burn through your <a href="#" data-nav="rate-limits">rate limit</a>.</p>` },
      { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td>exch</td><td>string</td><td><span class="req-tag">required</span></td><td>Exchange segment code.</td></tr>
        <tr><td>token</td><td>string</td><td><span class="req-tag">required</span></td><td>Instrument token from <a href="#" data-nav="symbol-master">Instrument Master</a>.</td></tr>
      </table>` },
      { h: "Request example", body: `${codeTabs("quotes-req", {
        python: `import requests

params = {"uid":"ABC123"exch": "NSE", "token": "2885"}
headers = {"Authorization": f"Bearer {Acesstoken}"}

resp = requests.get(
    "https://api.shoonya.com/NorenWClientAPI/GetQuotes",
    params=params, headers=headers,
)
print(resp.json())`,
        javascript: `const res = await fetch(
  "https://api.shoonya.com/NorenWClientAPI/GetQuotes?exch=NSE&token=2885",
  { headers: { Authorization: \`Bearer \${Acesstoken}\` } }
);
console.log(await res.json());`,
        curl: `curl "https://api.shoonya.com/NorenWClientAPI/GetQuotes?exch=NSE&token=2885" \\
  -H "Authorization: Bearer $Acesstoken"`,
      })}` },
      { h: "Response example", body: `${codeBlock("json", `{
  "stat": "Ok",
  "tsym": "RELIANCE-EQ",
  "lp": "2934.60",
  "o": "2910.00",
  "h": "2941.80",
  "l": "2905.15",
  "c": "2918.25",
  "bp1": "2934.55",
  "sp1": "2934.65",
  "v": "8423110"
}`)}` },
      { h: "Error handling", body: `<table class="param-table">
        <tr><th>Code</th><th>Meaning</th></tr>
        <tr><td>Invalid_Input</td><td>Unrecognized <code>token</code>/<code>exch</code> pair — re-check against Instrument Master.</td></tr>
      </table>` },
      { h: "Best practices", body: `<ul><li>Cache the instrument token lookup locally — don't re-resolve symbol → token on every quote request.</li><li>For more than a handful of symbols, batch via the WebSocket feed rather than issuing parallel REST calls.</li></ul>` },
      { h: "Python example", body: `${codeBlock("python", `from shoonya_api import ShoonyaClient

client = ShoonyaClient(session_token=Acesstoken)
quote = client.get_quote(exchange="NSE", token="2885")
print(quote.ltp, quote.open, quote.high, quote.low)`)}` },
      { h: "Notes", body: `<p>Prices are strings in the raw API response (to preserve exchange-precision formatting) — cast to <code>Decimal</code> rather than <code>float</code> in Python to avoid rounding drift.</p>` },
    ],
  },


  //Daily price series

  "historical-data": {
    badge: { method: "POST", path: "/NorenWClientAPI/EODChartData" },
    desc: "Fetch end-of-day OHLCV candles over a date range, for multi-day/multi-week backtesting and charting.",
    sections: [
      { h: "Overview", body: `<p>Daily Price Series (EODChartData) returns one candle per trading day for a single instrument across a date range. It's the endpoint to reach for when you need history spanning weeks, months, or years — <a href="#" data-nav="time-price-series">Time Price Series</a> covers intraday granularity but only a shallow lookback window.</p>` },
      { h: "Purpose", body: `<p>Use this to backtest swing/positional strategies, compute daily indicators (SMA/EMA over N days, ATR, etc.), or render a daily candlestick chart. Do not use it for intraday signals — the exchange doesn't publish partial-day EOD candles, so the current day's bar won't be finalized until after close.</p>` },
      { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td>uid</td><td>string</td><td><span class="req-tag">required</span></td><td>Your logged-in client/user ID.</td></tr>
        <tr><td>sym</td><td>string</td><td><span class="req-tag">required</span></td><td>Combined <code>exchange:tradingsymbol</code>, e.g. <code>NSE:ACC-EQ</code>.</td></tr>
        <tr><td>from</td><td>string (epoch seconds)</td><td><span class="req-tag">required</span></td><td>Range start.</td></tr>
        <tr><td>to</td><td>string (epoch seconds)</td><td><span class="req-tag">required</span></td><td>Range end.</td></tr>
      </table>` },
      { h: "Request example", body: `${codeTabs("eod-req", {
        python: `import requests

params = {"uid":"ABC123",sym": "NSE:ACC-EQ","from": "1667297289","to": "1670231374"}
headers = {"Authorization": f"Bearer {Acesstoken}"}

resp = requests.post(
    "https://api.shoonya.com/NorenWClientAPI/EODChartData",
    json=params, headers=headers,
)
print(resp.json())`,
        javascript: `const res = await fetch("https://api.shoonya.com/NorenWClientAPI/EODChartData", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: \`Bearer \${Acesstoken}\` },
  body: JSON.stringify({ sym: "NSE:ACC-EQ", from: "1667297289", to: "1670231374" }),
});
console.log(await res.json());`,
        curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/EODChartData \\
  -H "Authorization: Bearer $Acesstoken" \\
  -H "Content-Type: application/json" \\
  -d '{"sym":"NSE:ACC-EQ","from":"1667297289","to":"1670231374"}'`,
      })}` },
      { h: "Response example", body: `${codeBlock("json", `[
  {
    "time": "05-DEC-2022",
    "into": "2145.00",
    "inth": "2168.90",
    "intl": "2130.25",
    "intc": "2160.10",
    "v": "412300",
    "oi": "0"
  },
  {
    "time": "06-DEC-2022",
    "into": "2160.10",
    "inth": "2175.55",
    "intl": "2148.00",
    "intc": "2152.75",
    "v": "389750",
    "oi": "0"
  }
]`)} <div class="callout warn"><b>Unverified against a live capture</b>Same caveat as Time Price Series — schema is inferred from the standard Noren candle convention, not diffed against a fresh EODChartData debug log. Confirm field names before publishing.</div>` },
      { h: "Error handling", body: `<table class="param-table">
        <tr><th>Code</th><th>Meaning</th></tr>
        <tr><td>HTTP non-200</td><td>The SDK returns <code>None</code> on any non-200 status — check network/auth before assuming an empty result.</td></tr>
        <tr><td>Empty body</td><td>A zero-length response body is treated as no data, not an error — typically means no trading days exist in the given range (e.g. range entirely on holidays/weekends).</td></tr>
        <tr><td>(non-list response)</td><td>Non-list JSON is treated as an error payload — inspect <code>stat</code>/<code>emsg</code> directly if bypassing the SDK.</td></tr>
      </table>` },
      { h: "Best practices", body: `<ul><li>Request the full date range you need in one call rather than paging day-by-day — this endpoint isn't rate-sensitive the way tick-level polling is, but unnecessary calls still count against your quota.</li><li>Store <code>from</code>/<code>to</code> as epoch seconds, not milliseconds — a common source of empty results is passing millisecond timestamps by mistake.</li></ul>` },
      { h: "Python example", body: `${codeBlock("python", `from api_helper import NorenApiPy

api = NorenApiPy()
api.injectOAuthHeader(cred["Access_token"], cred["UID"], cred["Account_ID"])

ret = api.get_daily_price_series(
    exchange="NSE",
    tradingsymbol="ACC-EQ",
    startdate="1667297289",
    enddate="1670231374",
)
print(ret)`)}` },
      { h: "Notes", body: `<p>Unlike most other endpoints in this API, <code>get_daily_price_series</code> combines exchange and symbol into a single <code>sym</code> field server-side (<code>exchange:tradingsymbol</code>) rather than sending them as separate parameters — the Python SDK does this concatenation for you, but replicate it manually if calling the REST endpoint directly.</p>` },
    ],
  },


  // Time_Price-Series

  "time-price-series": {
    badge: { method: "POST", path: "/NorenWClientAPI/TPSeries" },
    desc: "Fetch intraday OHLCV candle data at a configurable interval, for charting and short-lookback backtesting.",
    sections: [
      { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td>uid</td><td>string</td><td><span class="req-tag">required</span></td><td>Your logged-in client/user ID.</td></tr>
        <tr><td>exch</td><td>string</td><td><span class="req-tag">required</span></td><td>Exchange segment code, e.g. <code>NSE</code>.</td></tr>
        <tr><td>token</td><td>string</td><td><span class="req-tag">required</span></td><td>Instrument token from <a href="#" data-nav="symbol-master">Instrument Master</a>.</td></tr>
        <tr><td>st</td><td>string (epoch seconds)</td><td><span class="req-tag">required</span></td><td>Start time.</td></tr>
        <tr><td>et</td><td>string (epoch seconds)</td><td><span class="req-tag">required</span></td><td>End time.</td></tr>
        <tr><td>intrv</td><td>string</td><td><span class="opt-tag">optional</span></td><td>Candle interval in minutes: one of <code>1, 3, 5, 10, 15, 30, 60, 120, 240</code>. Defaults to <code>1</code>.</td></tr>
      </table>` },
      { h: "Request example", body: `${codeTabs("tpseries-req", {
        python: `import requests

params = {"uid":"ABC123",exch": "NSE", "token": "2885", "st":"" ,"et":"" "intrv": 5}
headers = {"Authorization": f"Bearer {Acesstoken}"}

resp = requests.post(
    "https://api.shoonya.com/NorenWClientAPI/TPSeries",
    json=params, headers=headers,
)
print(resp.json())`,
        javascript: `const res = await fetch("https://api.shoonya.com/NorenWClientAPI/TPSeries", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: \`Bearer \${Acesstoken}\` },
  body: JSON.stringify({ exch: "NSE", token: "2885", intrv: 5 }),
});
console.log(await res.json());`,
        curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/TPSeries \\
  -H "Authorization: Bearer $Acesstoken" \\
  -H "Content-Type: application/json" \\
  -d '{"uid":"ABC123","exch":"NSE","token":"2885","intrv":5}'`,
      })}` },
      { h: "Response example", body: `${codeBlock("json", `[
  {
    "time": "07-12-2022 09:15:00",
    "into": "255.00",
    "inth": "255.65",
    "intl": "254.65",
    "intc": "255.65",
    "intv": "146",
    "v": "146",
    "oi": "0"
  },
  {
    "time": "07-12-2022 09:20:00",
    "into": "255.65",
    "inth": "256.40",
    "intl": "255.10",
    "intc": "256.05",
    "intv": "212",
    "v": "358",
    "oi": "0"
  }
]`)} <div class="callout warn"><b>Unverified against a live capture</b>Field names above follow the standard Noren candle schema (into/inth/intl/intc = open/high/low/close, v = cumulative volume) but haven't been diffed against a fresh debug log for this specific endpoint. Confirm before publishing.</div>` },
      { h: "Error handling", body: `<table class="param-table">
        <tr><th>Code</th><th>Meaning</th></tr>
        <tr><td>Invalid_Input</td><td>Unrecognized <code>token</code>/<code>exch</code> pair, or <code>st</code> is later than <code>et</code>.</td></tr>
        <tr><td>(non-list response)</td><td>The SDK treats any non-list JSON body as an error and returns <code>None</code> — check <code>stat</code>/<code>emsg</code> on the raw response if you're not using the SDK.</td></tr>
      </table>` },
      { h: "Best practices", body: `<ul><li>Request the widest interval that still satisfies your strategy — a 1-minute pull over a full session is a lot heavier than a 5-minute one for the same lookback.</li><li>Cache the response locally within the trading day; re-requesting the same <code>st</code>–<code>et</code> window repeatedly wastes your <a href="#" data-nav="rate-limits">rate limit</a>.</li></ul>` },
      { h: "Python example", body: `${codeBlock("python", `from api_helper import NorenApiPy

api = NorenApiPy()
api.injectOAuthHeader(cred["Access_token"], cred["UID"], cred["Account_ID"])

# 5-minute candles for the current session, from session start
ret = api.get_time_price_series(exchange="NSE", token="2885")
print(len(ret))
print(ret[0])   # earliest candle
print(ret[-1])  # latest candle`)}` },
      { h: "Notes", body: `<p>Candles are returned in a flat list, not wrapped in a <code>values</code> key like some other market-data endpoints — index into it directly. If the SDK call returns <code>None</code>, the response body wasn't a JSON list (i.e. an error payload), not an empty result set.</p>` },
    ],
  },


  
  

  "option-chain": {
    badge: { method: "POST", path: "/NorenWClientAPI/GetOptionChain" },
    desc: "Fetch the full strike-wise option chain for an underlying and expiry, with LTP and OI per strike.",
    sections: [
      { h: "Overview", body: `<p>Option Chain returns calls and puts across a strike range for a given underlying and expiry in one call, instead of requiring a separate quote lookup per strike.</p>` },
      { h: "Purpose", body: `<p>Use this to build strike selection logic (e.g. nearest-to-ATM, delta-based) at strategy startup or on each expiry rollover. For live-updating chains, resolve the token list here once, then subscribe to those tokens on <a href="#" data-nav="subscribe-market-feed">Subscribe to Market Feed</a> rather than re-calling this endpoint in a loop.</p>` },
      { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td>exch</td><td>string</td><td><span class="req-tag">required</span></td><td>Exchange segment, e.g. <code>NFO</code>.</td></tr>
        <tr><td>tsym</td><td>string</td><td><span class="req-tag">required</span></td><td>Underlying trading symbol, e.g. <code>NIFTY</code>.</td></tr>
        <tr><td>strprc</td><td>number</td><td><span class="req-tag">required</span></td><td>Center strike price for the returned range.</td></tr>
        <tr><td>cnt</td><td>integer</td><td><span class="opt-tag">optional</span></td><td>Number of strikes above/below center to return. Default 10.</td></tr>
      </table>` },
      { h: "Request example", body: `${codeTabs("optchain-req", {
        python: `import requests

params = {"exch": "NFO", "tsym": "NIFTY", "strprc": "24000", "cnt": "10"}
headers = {"Authorization": f"Bearer {Acesstoken}"}
resp = requests.post("https://api.shoonya.com/NorenWClientAPI/GetOptionChain",
                      json=params, headers=headers)
print(resp.json())`,
        javascript: `const res = await fetch("https://api.shoonya.com/NorenWClientAPI/GetOptionChain", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: \`Bearer \${Acesstoken}\` },
  body: JSON.stringify({ exch: "NFO", tsym: "NIFTY", strprc: "24000", cnt: "10" }),
});
console.log(await res.json());`,
        curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/GetOptionChain \\
  -H "Authorization: Bearer $Acesstoken" \\
  -H "Content-Type: application/json" \\
  -d '{"exch":"NFO","tsym":"NIFTY","strprc":"24000","cnt":"10"}'`,
      })}` },
      { h: "Response example", body: `${codeBlock("json", `{
  "stat": "Ok",
  "values": [
    { "tsym": "NIFTY24DEC24000CE", "strprc": "24000", "optt": "CE", "token": "48291", "lp": "182.35", "oi": "1245600" },
    { "tsym": "NIFTY24DEC24000PE", "strprc": "24000", "optt": "PE", "token": "48292", "lp": "97.10",  "oi": "980200" }
  ]
}`)}` },
      { h: "Error handling", body: `<table class="param-table">
        <tr><th>Code</th><th>Meaning</th></tr>
        <tr><td>Invalid_Input</td><td>Underlying symbol not found, or no contracts exist near the given strike.</td></tr>
      </table>` },
      { h: "Best practices", body: `<ul><li>Cache the chain per underlying+expiry for the session — strikes and tokens don't change intraday, only prices do.</li><li>Use <a href="#" data-nav="symbol-master">Expiry Data</a> first to confirm the exact expiry string format before requesting the chain.</li></ul>` },
      { h: "Python example", body: `${codeBlock("python", `from shoonya_api import ShoonyaClient

client = ShoonyaClient(session_token=Acesstoken)
chain = client.get_option_chain(exchange="NFO", symbol="NIFTY", strike=24000, count=10)
atm_ce = next(c for c in chain if c.strprc == 24000 and c.optt == "CE")
print(atm_ce.tsym, atm_ce.lp, atm_ce.oi)`)}` },
      { h: "Notes", body: `<p><code>oi</code> (open interest) updates less frequently than <code>lp</code> — don't assume both fields refresh on the same cadence when building OI-based signals.</p>` },
    ],
  },
  //Security-Info
  "security-info": {
    badge: { method: "POST", path: "/NorenWClientAPI/GetSecurityInfo" },
    desc: "Fetch contract master details for a single instrument — tick size, lot size, price bands, margin percentages, and identifiers — given its exchange and token.",
    sections: [
      { h: "API Endpoint", body: `
      <table class="param-table">
        <tr><td><b>Method</b></td><td><code>POST</code></td></tr>
        <tr><td><b>URL</b></td><td><code>https://api.shoonya.com/NorenWClientAPI/GetSecurityInfo</code></td></tr>
        <tr><td><b>Content-Type</b></td><td><code>application/x-www-form-urlencoded</code></td></tr>
        <tr><td><b>Payload</b></td><td><code>jData=&lt;JSON payload&gt;&amp;jKey=&lt;AccessToken&gt;</code> — requires a valid <code>AccessToken</code> from <a href="#" data-nav="login-flow-overview">Login</a>.</td></tr>
      </table>
    ` },
      { h: "Overview", body: `<p>GetSecurityInfo returns the static contract master record for a single <code>token</code> on a given <code>exch</code> — the same reference data (tick size, lot size, price bands, margin rates) that backs order validation and margin calculation. It's a lookup by token, not by name; resolve a symbol to its token first via <a href="#" data-nav="search-scrip">Search Scrip</a> or the Symbol Master.</p>` },
      { h: "Purpose", body: `<p>Use this to validate price/quantity inputs before placing an order (tick size <code>ti</code>, lot size <code>ls</code>, freeze quantity <code>frzqty</code>), to read the day's circuit limits (<code>uc</code>/<code>lc</code>), or to pull margin parameters (<code>delmrg</code>, <code>varmrg</code>, <code>elmmrg</code>, <code>hair_cut</code>) for a pre-trade risk check. Because this is per-token reference data rather than a live quote, cache it for the session instead of calling it on every order.</p>` },
      { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td>uid</td><td>string</td><td><span class="req-tag">required</span></td><td>Your account/client ID.</td></tr>
        <tr><td>exch</td><td>string</td><td><span class="req-tag">required</span></td><td>Exchange segment, e.g. <code>NSE</code>, <code>NFO</code>, <code>BSE</code>, <code>MCX</code>.</td></tr>
        <tr><td>token</td><td>string</td><td><span class="req-tag">required</span></td><td>Numeric instrument token, as returned by <a href="#" data-nav="search-scrip">Search Scrip</a> or the Symbol Master.</td></tr>
      </table>` },
      { h: "Request example", body: `${codeTabs("getsecurityinfo-req", {
        python: `import requests
import json

jdata = {"uid": "ABC1234", "exch": "NSE", "token": "22"}
payload = "jData=" + json.dumps(jdata) + "&jKey=" + Acesstoken

headers = {"Content-Type": "application/x-www-form-urlencoded"}
resp = requests.post("https://api.shoonya.com/NorenWClientAPI/GetSecurityInfo",
                      data=payload, headers=headers)
print(resp.json())`,
        javascript: `const jdata = { uid: "ABC1234", exch: "NSE", token: "22" };
const payload = "jData=" + JSON.stringify(jdata) + "&jKey=" + Acesstoken;

const res = await fetch("https://api.shoonya.com/NorenWClientAPI/GetSecurityInfo", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: payload,
});
console.log(await res.json());`,
        curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/GetSecurityInfo \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode 'jData={"uid":"ABC1234","exch":"NSE","token":"22"}' \\
  --data-urlencode "jKey=$Acesstoken"`,
      })}` },
      { h: "Response example", body: `${codeBlock("json", `{
  "request_time": "17:58:21 11-08-2026",
  "stat": "Ok",
  "exch": "NSE",
  "tsym": "ACC-EQ",
  "cname": "ACC LIMITED",
  "symname": "ACC",
  "seg": "EQT",
  "instname": "EQ",
  "isin": "INE012A01025",
  "pp": "2",
  "prcftr": "1.000000",
  "ls": "1",
  "ti": "0.10",
  "mult": "1",
  "issue_d": "24-10-1994",
  "uc": "1607.70",
  "lc": "1071.90",
  "prcftr_d": "(1 / 1 ) * (1 / 1)",
  "token": "22",
  "frzqty": "73612",
  "delmrg": "75.00",
  "varmrg": "20.00",
  "elmmrg": "0.00",
  "hair_cut": "9.70",
  "sip_ind": "2"
}`)}` },
      { h: "Error handling", body: `<table class="param-table">
        <tr><th>Response</th><th>Meaning</th></tr>
        <tr><td><code>{"stat":"Not_Ok","emsg":"..."}</code></td><td>Token not found on the given <code>exch</code> — usually a stale or wrong token; re-resolve it via Search Scrip rather than assuming the token is permanent.</td></tr>
        <tr><td>Session_Expired</td><td>Access token expired or invalid — re-authenticate via <a href="#" data-nav="token-renewal">Token Renewal</a>.</td></tr>
      </table>` },
      { h: "Best practices", body: `<ul><li>Cache the response per token for the trading session — this is contract master data, not a live quote, and won't change intraday.</li><li>Read <code>uc</code>/<code>lc</code> (upper/lower circuit) and <code>ti</code>/<code>ls</code> (tick/lot size) before submitting an order for that token to avoid a preventable rejection.</li><li>Margin fields (<code>delmrg</code>, <code>varmrg</code>, <code>elmmrg</code>, <code>hair_cut</code>) are percentages, not absolute values — combine with the current price for an actual margin figure.</li></ul>` },
      { h: "Python example", body: `${codeBlock("python", `from shoonya_api import ShoonyaClient

client = ShoonyaClient(session_token=Acesstoken)
info = client.get_security_info(exchange="NSE", token="22")
print(info.tsym, info.tick_size, info.lot_size, info.upper_circuit, info.lower_circuit)`)}` },
      { h: "Notes", body: `<p>Prefer resolving <code>token</code> from Search Scrip or the Symbol Master rather than hardcoding it — tokens are exchange-assigned and can be reused or reassigned across corporate actions over long time horizons, so a token cached from a previous session should be revalidated periodically rather than treated as permanent.</p>` },
    ],
  },



  "Get-Quotes": {
    badge: { method: "POST", path: "/NorenWClientAPI/GetQuotes" },
    desc: "Fetch a single, current snapshot of price, OHLC, circuit limits and top-of-book for one instrument by exchange + token.",
    sections: [
      { h: "API Endpoint", body: `
      <table class="param-table">
        <tr><td><b>Method</b></td><td><code>POST</code></td></tr>
        <tr><td><b>URL</b></td><td><code>https://api.shoonya.com/NorenWClientAPI/GetQuotes</code></td></tr>
        <tr><td><b>Content-Type</b></td><td><code>application/x-www-form-urlencoded</code></td></tr>
        <tr><td><b>Payload</b></td><td><code>jData=&lt;JSON payload&gt;&amp;jKey=&lt;AccessToken&gt;</code> — requires a valid <code>AccessToken</code> from <a href="#" data-nav="login-flow-overview">Login</a>.</td></tr>
      </table>
    ` },
      { h: "Overview", body: `<p>GetQuotes returns a one-shot snapshot for a single scrip — last traded price, today's OHLC, upper/lower circuit, 52-week range, and best bid/offer (depth level 1 only). It does not stream; each call returns the state at that instant.</p>` },
      { h: "Purpose", body: `<p>Use this for on-demand lookups — e.g. showing a quote before order placement, or a periodic poll for a watchlist row. For anything that needs continuous updates (option chains, live tickers, tick-by-tick charts), subscribe via <a href="#" data-nav="subscribe-market-feed">Subscribe to Market Feed</a> instead of polling this endpoint in a loop — polling at low intervals will burn into your <a href="#" data-nav="rate-limits">rate limits</a> fast.</p>` },
      { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td>uid</td><td>string</td><td><span class="req-tag">required</span></td><td>Your account/client ID.</td></tr>
        <tr><td>exch</td><td>string</td><td><span class="req-tag">required</span></td><td>Exchange segment, e.g. <code>NSE</code>, <code>NFO</code>, <code>BSE</code>, <code>MCX</code>.</td></tr>
        <tr><td>token</td><td>string</td><td><span class="req-tag">required</span></td><td>Numeric instrument token for the scrip. Look this up via <a href="#" data-nav="search-scrip">Search Scrip</a> or the <a href="#" data-nav="symbol-master">Symbol Master</a> — don't hardcode tokens, they can change on contract rollover.</td></tr>
      </table>` },
      { h: "Request example", body: `${codeTabs("getquotes-req", {
        python: `import requests
import json

jdata = {"uid": "ABC1234", "exch": "NSE", "token": "22"}
payload = "jData=" + json.dumps(jdata) + "&jKey=" + Acesstoken

headers = {"Content-Type": "application/x-www-form-urlencoded"}
resp = requests.post("https://api.shoonya.com/NorenWClientAPI/GetQuotes",
                      data=payload, headers=headers)
print(resp.json())`,
        javascript: `const jdata = { uid: "ABC1234", exch: "NSE", token: "22" };
const payload = "jData=" + JSON.stringify(jdata) + "&jKey=" + Acesstoken;

const res = await fetch("https://api.shoonya.com/NorenWClientAPI/GetQuotes", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: payload,
});
console.log(await res.json());`,
        curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/GetQuotes \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode 'jData={"uid":"ABC1234","exch":"NSE","token":"22"}' \\
  --data-urlencode "jKey=$Acesstoken"`,
      })}` },
      { h: "Response example", body: `${codeBlock("json", `{
  "stat": "Ok",
  "exch": "NSE",
  "tsym": "ACC-EQ",
  "cname": "ACC LIMITED",
  "token": "22",
  "lp": "1362.80",
  "c": "1378.40",
  "o": "1370.00",
  "h": "1373.90",
  "l": "1360.00",
  "ap": "1366.64",
  "v": "160343",
  "uc": "1635.30",
  "lc": "1090.30",
  "wk52_h": "1987.00",
  "wk52_l": "1251.70",
  "bp1": "1362.80", "sp1": "0.00",
  "bq1": "2",       "sq1": "0",
  "ltt": "15:29:55",
  "ltd": "07-08-2026"
}`)}` },
      { h: "Error handling", body: `<table class="param-table">
        <tr><th>Code</th><th>Meaning</th></tr>
        <tr><td>Invalid_Input</td><td>Token doesn't exist on the given exchange segment — usually a stale token after a contract rollover or corporate action.</td></tr>
        <tr><td>Session_Expired</td><td>Access token expired or invalid — re-authenticate via <a href="#" data-nav="token-renewal">Token Renewal</a>.</td></tr>
      </table>` },
      { h: "Best practices", body: `<ul><li>Fields are all strings, including numeric ones (<code>lp</code>, <code>v</code>, etc.) — cast explicitly before doing arithmetic.</li><li><code>bp1</code>/<code>sp1</code> and <code>bq1</code>/<code>sq1</code> are level-1 depth only.</li><li>A <code>sp1</code>/<code>bp1</code> of <code>0.00</code> means no resting order at that side, not a zero price — don't treat it as tradeable.</li></ul>` },
      { h: "Python example", body: `${codeBlock("python", `from shoonya_api import ShoonyaClient

client = ShoonyaClient(session_token=Acesstoken)
q = client.get_quotes(exchange="NSE", token="22")
print(f"{q.tsym}: LTP {q.lp}  Day range {q.l}-{q.h}")`)}` },
      { h: "Notes", body: `<p><code>ltt</code>/<code>ltd</code> reflect the last trade time/date on the exchange, which can lag behind <code>request_time</code> during low-liquidity periods — a stale <code>ltt</code> doesn't mean the call failed, it means the scrip simply hasn't traded recently.</p>` },
    ],
  },

  "search-scrip": {
    badge: { method: "POST", path: "/NorenWClientAPI/SearchScrip" },
    desc: "Search for tradable symbols by name or partial text on a given exchange, returning matching tokens and trading symbols.",
    sections: [
      { h: "API Endpoint", body: `
      <table class="param-table">
        <tr><td><b>Method</b></td><td><code>POST</code></td></tr>
        <tr><td><b>URL</b></td><td><code>https://api.shoonya.com/NorenWClientAPI/SearchScrip</code></td></tr>
        <tr><td><b>Content-Type</b></td><td><code>application/x-www-form-urlencoded</code></td></tr>
        <tr><td><b>Payload</b></td><td><code>jData=&lt;JSON payload&gt;&amp;jKey=&lt;AccessToken&gt;</code> — requires a valid <code>AccessToken</code> from <a href="#" data-nav="login-flow-overview">Login</a>.</td></tr>
      </table>
    ` },
      { h: "Overview", body: `<p>SearchScrip resolves a free-text search string (<code>stext</code>) into one or more matching contracts on an exchange, each with its numeric <code>token</code>. This is the standard way to go from a human-readable symbol to the token required by <a href="#" data-nav="Get-Quotes">Get Quotes</a>, <a href="#" data-nav="place-order">Place Order</a>, and the streaming APIs.</p>` },
      { h: "Purpose", body: `<p>Use this for building a symbol search/autocomplete UI, or programmatically resolving an option/future symbol (e.g. a specific strike and expiry) before placing an order or subscribing to its feed. For bulk/offline lookups across the whole instrument universe, prefer downloading the <a href="#" data-nav="symbol-master">Symbol Master</a> file instead of calling this endpoint per symbol.</p>` },
      { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td>uid</td><td>string</td><td><span class="req-tag">required</span></td><td>Your account/client ID.</td></tr>
        <tr><td>exch</td><td>string</td><td><span class="req-tag">required</span></td><td>Exchange segment to search within, e.g. <code>NSE</code>, <code>NFO</code>, <code>BSE</code>, <code>MCX</code>.</td></tr>
        <tr><td>stext</td><td>string</td><td><span class="req-tag">required</span></td><td>Search text — full or partial trading symbol. For derivatives, the exact contract string (e.g. <code>NIFTY28JUL26C24100</code>) must match the exchange's naming convention precisely.</td></tr>
      </table>` },
      { h: "Request example", body: `${codeTabs("searchscrip-req", {
        python: `import requests
import json

jdata = {"uid": "ABC1234", "exch": "NFO", "stext": "NIFTY28JUL26C24100"}
payload = "jData=" + json.dumps(jdata) + "&jKey=" + Acesstoken

headers = {"Content-Type": "application/x-www-form-urlencoded"}
resp = requests.post("https://api.shoonya.com/NorenWClientAPI/SearchScrip",
                      data=payload, headers=headers)
print(resp.json())`,
        javascript: `const jdata = { uid: "ABC1234", exch: "NFO", stext: "NIFTY28JUL26C24100" };
const payload = "jData=" + JSON.stringify(jdata) + "&jKey=" + Acesstoken;

const res = await fetch("https://api.shoonya.com/NorenWClientAPI/SearchScrip", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: payload,
});
console.log(await res.json());`,
        curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/SearchScrip \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data-urlencode 'jData={"uid":"ABC1234","exch":"NFO","stext":"NIFTY28JUL26C24100"}' \\
  --data-urlencode "jKey=$Acesstoken"`,
      })}` },
      { h: "Response example", body: `${codeBlock("json", `{
  "stat": "Ok",
  "values": [
    {
      "exch": "NFO",
      "token": "48291",
      "tsym": "NIFTY28JUL26C24100",
      "cname": "NIFTY",
      "instname": "OPTIDX",
      "optt": "CE",
      "strprc": "24100.00",
      "pp": "2",
      "ls": "75",
      "ti": "0.05"
    }
  ]
}`)}` },
      { h: "Error handling", body: `<table class="param-table">
        <tr><th>Response</th><th>Meaning</th></tr>
        <tr><td><code>{"stat":"Not_Ok","emsg":"No Data :   "}</code></td><td>No contract matched <code>stext</code> on the given <code>exch</code> — usually means the symbol/expiry string doesn't match exchange naming, or the contract hasn't been listed for that expiry yet. This is a normal "no results" response, not a transport error — the HTTP status is 404 but the body is well-formed.</td></tr>
        <tr><td>Session_Expired</td><td>Access token expired or invalid — re-authenticate via <a href="#" data-nav="token-renewal">Token Renewal</a>.</td></tr>
      </table>` },
      { h: "Best practices", body: `<ul><li>Always check <code>stat</code> before reading <code>values</code> — a "no match" response still returns HTTP 404 with a JSON body, so don't assume a non-200 means the request itself failed.</li><li>For option contracts, get the exact <code>tsym</code> format from <a href="#" data-nav="option-chain">Option Chain</a> or the Symbol Master rather than hand-building the string — a one-character mismatch in date/strike format returns zero matches.</li><li>Cache resolved tokens for the trading session; tokens are stable intraday.</li></ul>` },
      { h: "Python example", body: `${codeBlock("python", `from shoonya_api import ShoonyaClient

client = ShoonyaClient(session_token=Acesstoken)
matches = client.search_scrip(exchange="NFO", search_text="NIFTY28JUL26C24100")
if not matches:
    print("No contract found — check expiry/strike format")
else:
    print(matches[0].token, matches[0].tsym)`)}` },
      { h: "Notes", body: `<p>Your debug log's 404 for <code>NIFTY28JUL26C24100</code> on NFO is a <strong>no-match</strong> response, not a service error — worth double-checking the expiry date/strike format against a symbol you know is currently listed (e.g. via Option Chain) before assuming the API itself is broken.</p>` },
    ],
  },




  

  // ---------- E. STREAMING ----------
 
  "websocket-overview": {
    badge: { method: "WS", path: "wss://api.shoonya.com/NorenWSAPI/" },
    desc: "How the Shoonya WebSocket feed is structured, and when to use it instead of REST polling.",
    sections: [
      { h: "Overview", body: `<p>The WebSocket gateway delivers independent feed types over one connection: live touchline ticks, market depth, and order-status updates. You connect once, then subscribe to each feed type separately.</p>` },
      { h: "Purpose", body: `<p>Use the WebSocket for anything that needs to react to price movement or fills in real time — strategy engines, live dashboards, risk monitors. It replaces polling <a href="#" data-nav="market-quotes">Market Quotes</a> or <a href="#" data-nav="order-book">Order Book</a> in a loop.</p>` },
      { h: "Connection flow", body: `<ol>
        <li>Open a WebSocket connection to <code>wss://api.shoonya.com/NorenWSAPI/</code>.</li>
        <li>Send a connect frame (<code>t: "a"</code>) with <code>uid</code>, <code>actid</code>, <code>source</code>, and <code>accesstoken</code>.</li>
        <li>Wait for the connect acknowledgment (<code>t: "ak"</code>) and check <code>s</code> is <code>"Ok"</code> before subscribing to anything.</li>
        <li>Send subscribe frames for <a href="#" data-nav="subscribe-market-feed">touchline</a> and/or <a href="#" data-nav="order-update-feed">order updates</a>.</li>
        <li>Handle incoming ticks; respond to server pings to keep the session alive.</li>
      </ol>` },
      { h: "Connect request (t: 'a')", body: `${codeBlock("json", `{
  "t": "a",
  "uid": "AB1234",
  "actid": "AB1234",
  "source": "API",
  "accesstoken": "Acesstoken"
}`)}
      <table class="param-table">
        <tr><th>Field</th><th>Possible value</th><th>Description</th></tr>
        <tr><td>t</td><td><code>a</code></td><td>Represents the connect task.</td></tr>
        <tr><td>uid</td><td>—</td><td>User ID.</td></tr>
        <tr><td>actid</td><td>—</td><td>Account ID.</td></tr>
        <tr><td>source</td><td><code>WEB</code> / <code>MOB</code> / <code>API</code></td><td>Must match the source used at login.</td></tr>
        <tr><td>accesstoken</td><td>—</td><td>User access token from login/OAuth.</td></tr>
      </table>` },
      { h: "Connect acknowledgment (t: 'ak')", body: `${codeBlock("json", `{ "t": "ak", "uid": "AB1234", "s": "Ok" }`)}
      <table class="param-table">
        <tr><th>Field</th><th>Possible value</th><th>Description</th></tr>
        <tr><td>t</td><td><code>ak</code></td><td>Represents the connect acknowledgment.</td></tr>
        <tr><td>uid</td><td>—</td><td>User ID.</td></tr>
        <tr><td>s</td><td><code>Ok</code> / <code>Not_Ok</code></td><td><code>Not_Ok</code> means an invalid user ID or session/access token — do not proceed to subscribe.</td></tr>
      </table>
      <div class="callout warn"><b>Don't confuse this with the touchline ack</b><code>t: "ak"</code> is the connect handshake response only. The touchline subscribe acknowledgment is a different message with <code>t: "tk"</code> — see <a href="#" data-nav="subscribe-market-feed">Subscribe to Market Feed</a>. Mixing the two up is a common source of parsing bugs since both arrive as JSON with a <code>t</code> field early in the connection.</div>` },
      { h: "Request example", body: `${codeTabs("ws-req", {
        python: `import websocket, json

def on_open(ws):
    ws.send(json.dumps({
        "t": "a",
        "uid": UID,
        "actid": ACTID,
        "source": "API",
        "accesstoken": Acesstoken,
    }))

def on_message(ws, message):
    print(json.loads(message))

ws = websocket.WebSocketApp(
    "wss://api.shoonya.com/NorenWSAPI/",
    on_open=on_open, on_message=on_message,
)
ws.run_forever()`,
        javascript: `const ws = new WebSocket("wss://api.shoonya.com/NorenWSAPI/");

ws.onopen = () => ws.send(JSON.stringify({
  t: "a", uid, actid, source: "API", accesstoken: Acesstoken,
}));
ws.onmessage = (event) => console.log(JSON.parse(event.data));`,
        curl: `# WebSocket connections aren't expressible in cURL —
# use \`websocat\` for a quick command-line test:
websocat wss://api.shoonya.com/NorenWSAPI/`,
      })}` },
      { h: "Error handling", body: `<div class="callout warn"><b>Disconnects</b>The gateway will drop idle connections. Implement exponential-backoff reconnect logic, re-send the connect frame, and re-send every subscription after every reconnect — nothing persists across a dropped socket.</div>` },
      { h: "Best practices", body: `<ul><li>Run one WebSocket connection per process; multiplex symbols over it rather than opening one socket per instrument.</li><li>Process incoming ticks on a separate thread/queue from your order-placement logic so a slow strategy calculation never blocks the read loop.</li><li>Always check <code>s: "Ok"</code> on the connect ack before subscribing — subscribing on a failed connect silently produces no data.</li></ul>` },
      { h: "Python example", body: `${codeBlock("python", `from shoonya_api import ShoonyaFeed

feed = ShoonyaFeed(uid=UID, actid=ACTID, session_token=Acesstoken)
feed.on_tick = lambda tick: print(tick.token, tick.ltp)
feed.connect()
feed.subscribe(["NSE|2885"])`)}` },
      { h: "Notes", body: `<p>See <a href="#" data-nav="subscribe-market-feed">Subscribe to Market Feed</a> and <a href="#" data-nav="order-update-feed">Order Update Feed</a> for the exact frame formats of each subscription type.</p>` },
    ],
  },


  // ---------- STREAMING ----------
 
  "subscribe-market-feed": {
    badge: { method: "WS", path: "t: 't' (subscribe) / 'u' (unsubscribe)" },
    desc: "Subscribe to live touchline ticks for one or more instruments over the WebSocket connection established in WebSocket Overview.",
    sections: [
      { h: "Overview", body: `<p>After connecting and receiving <code>s: "Ok"</code> per <a href="#" data-nav="websocket-overview">WebSocket Overview</a>, send a subscribe frame listing the instruments (as <code>EXCHANGE|TOKEN</code> pairs) you want ticks for. The gateway sends one full-snapshot acknowledgment per subscribed instrument — the number of <code>tk</code> acks you receive equals the number of scrips in your <code>k</code> field — then streams incremental updates as fields change.</p>` },
      { h: "Subscribe frame (t: 't')", body: `${codeBlock("json", `{ "t": "t", "k": "NSE|22#BSE|508123#NSE|NIFTY" }`)}
      <table class="param-table">
        <tr><th>Field</th><th>Possible value</th><th>Description</th></tr>
        <tr><td>t</td><td><code>t</code></td><td>Represents the touchline subscribe task.</td></tr>
        <tr><td>k</td><td>—</td><td>One or more <code>#</code>-delimited <code>EXCHANGE|TOKEN</code> pairs, e.g. <code>NSE|22#BSE|508123#NSE|NIFTY</code>.</td></tr>
      </table>` },
      { h: "Acknowledgment (t: 'tk')", body: `<p>Sent once per subscribed instrument, carrying every field currently known. Aside from <code>t</code>, <code>e</code>, and <code>tk</code>, any other field may or may not be present depending on instrument type:</p>
      ${codeBlock("json", `{
  "t": "tk", "e": "NSE", "tk": "22", "ts": "ACC-EQ",
  "pp": "2", "ti": "0.05", "ls": "1",
  "lp": "1287.30", "pc": "0.45",
  "o": "1280.00", "h": "1291.80", "l": "1278.50", "c": "1275.20",
  "ap": "1286.10", "v": "980515",
  "oi": "0", "poi": "0", "toi": "0",
  "bq1": "26", "bp1": "1287.25", "sq1": "6325", "sp1": "1287.35",
  "ft": "1670231374"
}`)}
      <table class="param-table">
        <tr><th>Field</th><th>Description</th></tr>
        <tr><td>t</td><td><code>tk</code> — represents the touchline acknowledgment.</td></tr>
        <tr><td>e</td><td>Exchange name (NSE, BSE, NFO, etc.).</td></tr>
        <tr><td>tk</td><td>Scrip token.</td></tr>
        <tr><td>pp</td><td>Price precision — 2 for NSE/BSE, 4 for CDS USDINR.</td></tr>
        <tr><td>ts</td><td>Trading symbol.</td></tr>
        <tr><td>ti</td><td>Tick size.</td></tr>
        <tr><td>ls</td><td>Lot size.</td></tr>
        <tr><td>lp</td><td>Last traded price.</td></tr>
        <tr><td>pc</td><td>Percentage change.</td></tr>
        <tr><td>v</td><td>Volume.</td></tr>
        <tr><td>o / h / l / c</td><td>Open / high / low / close price.</td></tr>
        <tr><td>ap</td><td>Average trade price.</td></tr>
        <tr><td>oi / poi / toi</td><td>Open interest, previous day closing OI, total OI for the underlying.</td></tr>
        <tr><td>bq1 / bp1</td><td>Best buy quantity / price (level 1).</td></tr>
        <tr><td>sq1 / sp1</td><td>Best sell quantity / price (level 1).</td></tr>
        <tr><td>ft</td><td>Feed time.</td></tr>
        <tr><td>ord_msg</td><td>Order message (present in some feed variants).</td></tr>
      </table>` },
      { h: "Incremental updates (t: 'tf')", body: `<p>Except for <code>t</code>, <code>e</code>, and <code>tk</code>, other fields are only sent when they change since the last message — everything else is implicitly unchanged from the state you've already built up client-side:</p>
      ${codeBlock("json", `// t:'tk' — full snapshot on subscribe
{"t":"tk","e":"NSE","tk":"11630","ts":"NTPC-EQ","pp":"2","ls":"1","ti":"0.05","lp":"118.55","pc":"0.12","h":"118.65","l":"118.10","ap":"118.39","v":"162220","bp1":"118.45","sp1":"118.50","bq1":"26","sq1":"6325","ft":"1670231200"}

// t:'tf' — only lp, pc, ap, v, sp1, bq1, sq1, ft changed
{"t":"tf","e":"NSE","tk":"11630","lp":"118.45","pc":"0.08","ap":"118.40","v":"166637","sp1":"118.55","bq1":"3135","sq1":"30","ft":"1670231245"}

// t:'tf' — only lp and ft changed this time
{"t":"tf","e":"NSE","tk":"11630","lp":"118.60","ft":"1670231260"}`)}
      <div class="callout warn"><b>You must maintain state client-side</b>The feed is a diff stream after the initial <code>tk</code>. Maintain a local dictionary keyed by token and merge each <code>tf</code> message into it — don't treat any single message after subscription as a complete quote.</div>` },
      { h: "Unsubscribe (t: 'u')", body: `<p>Request:</p>
      ${codeBlock("json", `{ "t": "u", "k": "NSE|22#BSE|508123" }`)}
      <p>Acknowledgment:</p>
      ${codeBlock("json", `{ "t": "uk", "k": "NSE|22#BSE|508123" }`)}
      <table class="param-table">
        <tr><th>Field</th><th>Possible value</th><th>Description</th></tr>
        <tr><td>t</td><td><code>u</code> (request) / <code>uk</code> (ack)</td><td>Unsubscribe touchline / unsubscribe acknowledgment.</td></tr>
        <tr><td>k</td><td>—</td><td>Same <code>#</code>-delimited scrip list that was unsubscribed.</td></tr>
      </table>` },
      { h: "Best practices", body: `<ul>
        <li>Subscribe to everything you need over the single connection from <a href="#" data-nav="websocket-overview">WebSocket Overview</a> — don't open a second socket per instrument group.</li>
        <li>Re-send all subscriptions after every reconnect; the gateway does not persist them across a dropped connection.</li>
        <li>This feed's <code>bp1</code>/<code>sp1</code> pair is touchline (level-1) only.</li>
      </ul>` },
      { h: "Notes", body: `<p>Field presence varies by instrument type — index tokens won't carry <code>bp1</code>/<code>sp1</code>, and equity tokens won't carry <code>oi</code>/<code>poi</code>/<code>toi</code>. Check for field presence rather than assuming a fixed shape.</p>` },
    ],
  },
 
  "order-update-feed": {
    badge: { method: "WS", path: "t: 'om' (automatic on connect)" },
    desc: "Real-time order and fill events pushed automatically over the WebSocket connection — the live counterpart to polling Order Book. No separate subscribe step is required.",
    sections: [
      { h: "Overview", body: `<p>Once the connect handshake in <a href="#" data-nav="websocket-overview">WebSocket Overview</a> succeeds, order-lifecycle events for the logged-in account — acknowledgments, fills, rejections, cancellations — start arriving automatically as <code>t: "om"</code> messages. This should be the primary source of truth for order state in any live strategy; <a href="#" data-nav="order-book">Order Book</a> and <a href="#" data-nav="order-history">Order History</a> are for reconciliation, not the live path.</p>
      <div class="callout warn"><b>No subscribe frame needed</b>Unlike touchline or depth, order updates aren't opt-in per instrument — there's nothing to send here beyond the initial connect. If you don't want to handle these messages, filter them client-side by checking <code>t === "om"</code> on incoming frames.</div>` },
      { h: "Update messages (t: 'om')", body: `${codeBlock("json", `{
  "t": "om",
  "norenordno": "24121500001234",
  "uid": "AB1234", "actid": "AB1234",
  "exch": "NSE", "tsym": "RELIANCE-EQ",
  "qty": "1", "prc": "1272.30", "pcode": "C",
  "status": "COMPLETE",
  "reporttype": "Fill",
  "trantype": "B", "prctyp": "LMT", "ret": "DAY",
  "fillshares": "1", "avgprc": "1272.30",
  "fltm": "09:20:41 15-12-2024", "flid": "8841",
  "flqty": "1", "flprc": "1272.30",
  "exchordid": "250620000000343421",
  "remarks": "my_order_001"
}`)}
      <table class="param-table">
        <tr><th>Field</th><th>Description</th></tr>
        <tr><td>t</td><td><code>om</code> — represents an order update.</td></tr>
        <tr><td>norenordno</td><td>Noren order number.</td></tr>
        <tr><td>uid / actid</td><td>User ID / Account ID.</td></tr>
        <tr><td>exch / tsym</td><td>Exchange and trading symbol.</td></tr>
        <tr><td>qty / prc</td><td>Order quantity / order price.</td></tr>
        <tr><td>pcode</td><td>Product code (e.g. <code>C</code> for CNC, <code>M</code> for margin/NRML, <code>I</code> for intraday — see <a href="#" data-nav="order-type-codes">Product Type values</a>).</td></tr>
        <tr><td>status</td><td>Order status: <code>New</code>, <code>Replaced</code>, <code>Complete</code>, <code>Rejected</code>, etc.</td></tr>
        <tr><td>reporttype</td><td>The specific lifecycle event this message represents — see <a href="#" data-nav="order-type-codes">Report Type values</a> (<code>Fill</code>, <code>Rejected</code>, <code>Canceled</code>, and others).</td></tr>
        <tr><td>trantype</td><td>Buy or sell.</td></tr>
        <tr><td>prctyp</td><td>Order price type: <code>LMT</code>, <code>MKT</code>, <code>SL-LMT</code>, <code>SL-MKT</code>.</td></tr>
        <tr><td>ret</td><td>Retention type: <code>DAY</code>, <code>EOS</code>, <code>IOC</code>, etc.</td></tr>
        <tr><td>fillshares</td><td>Total filled shares for this order.</td></tr>
        <tr><td>avgprc</td><td>Average fill price.</td></tr>
        <tr><td>fltm / flid / flqty / flprc</td><td>Fill time / fill ID / fill quantity / fill price — present only when <code>reporttype</code> is <code>Fill</code>.</td></tr>
      </table>` },
      { h: "Best practices", body: `<ul>
        <li>Drive strategy state transitions off <code>reporttype</code>, not just <code>status</code> — two different events can leave an order in the same <code>status</code> while meaning very different things for your position tracking.</li>
        <li>Process messages on a dedicated queue/thread separate from your order-placement logic, per the general <a href="#" data-nav="websocket-overview">WebSocket Overview</a> guidance — a slow handler here should never block new order submissions.</li>
        <li>Reconcile against <a href="#" data-nav="order-book">Order Book</a> on every reconnect — events that occurred while disconnected are not replayed, and there's no subscribe step to "catch up" with.</li>
      </ul>` },
      { h: "Notes", body: `<p>This is the same event history exposed via REST on <a href="#" data-nav="order-history">Order History</a>, pushed live instead of pulled — build primary logic on this feed and use the REST endpoint only for after-the-fact debugging.</p>` },
    ],
  },


  "postback-webhook": {
  badge: null,
  desc: "Server-pushed order and trade updates delivered to your own URL. Not currently offered — see alternatives below.",
  sections: [
    { h: "Not currently available", body: `<div class="stub-box">
      <div><span class="stub-title">Not supported yet</span></div>
      <p>Shoonya's API does not currently offer a postback/webhook mechanism — there's no way to register a callback URL that the server pushes order or trade events to. If your integration needs real-time updates, use one of the alternatives below instead.</p>
    </div>` },

    { h: "Alternatives", body: `<table class="param-table">
      <tr><th>Option</th><th>Use when</th></tr>
      <tr><td><a href="#" data-nav="order-update-feed">WebSocket order feed</a></td><td>You can hold a persistent connection open. Gives real-time order/trade updates pushed to your client as they happen — the closest equivalent to a webhook today.</td></tr>
      <tr><td><a href="#" data-nav="order-book">OrderBook</a> / <a href="#" data-nav="trade-book">TradeBook</a> polling</td><td>You need a simple server-side integration and can tolerate polling on an interval rather than instant push updates.</td></tr>
    </table>` },

    { h: "Planning a webhook integration?", body: `<p>If you're building something that assumes an HTTP callback (e.g. a serverless function or a system that can't easily hold a WebSocket open), reach out to the API team before committing to that architecture — the WebSocket feed may still be workable with a lightweight always-on relay in front of it, or let us know your use case so it can be considered for a future postback feature.</p>` },
  ],
},

  "streaming-code-examples": {
  badge: { method: "WS", path: "start_websocket(...)" },
  desc: "How the official example scripts wire up order-update and quote callbacks against the WebSocket feed — the real callback pattern, not the raw frame format.",
  sections: [

    { h: "Overview", body: `<p>The raw <code>t</code>/<code>tk</code>/<code>tf</code> frame format on <a href="#" data-nav="subscribe-market-feed">Subscribe to Market Feed</a> and <a href="#" data-nav="order-update-feed">Order Update Feed</a> is what travels over the wire. The Python SDK hides that behind three callbacks passed to a single <code>start_websocket</code> call, as used in both <code>example_orders.py</code> and <code>example_market.py</code>.</p>` },

    { h: "The three callbacks", body: `${codeBlock("python", `socket_opened = False

def event_handler_order_update(message):
    print("order event: " + str(message))

def event_handler_quote_update(message):
    # e   Exchange
    # tk  Token
    # lp  LTP
    # pc  Percentage change
    # v   Volume
    # o   Open price
    # h   High price
    # l   Low price
    # c   Close price
    # ap  Average trade price
    print("quote event: {0}".format(time.strftime('%d-%m-%Y %H:%M:%S')) + str(message))

def open_callback():
    global socket_opened
    socket_opened = True
    print('app is connected')
    api.subscribe('NSE|11630')
    # api.subscribe(['NSE|22', 'BSE|522032'])  # subscribe to several tokens in one call

ret = api.start_websocket(
    order_update_callback=event_handler_order_update,
    subscribe_callback=event_handler_quote_update,
    socket_open_callback=open_callback,
)`)}
    <table class="param-table">
      <tr><th>Callback</th><th>Fires on</th><th>Corresponds to (raw frame)</th></tr>
      <tr><td>socket_open_callback</td><td>Successful connection handshake</td><td><code>{"t":"ck","s":"OK"}</code> on <a href="#" data-nav="websocket-overview">WebSocket Overview</a></td></tr>
      <tr><td>subscribe_callback</td><td>Every tick — both the initial full snapshot and subsequent diffs</td><td><code>t:'tk'</code> and <code>t:'tf'</code> on <a href="#" data-nav="subscribe-market-feed">Subscribe to Market Feed</a></td></tr>
      <tr><td>order_update_callback</td><td>Every order lifecycle event for the logged-in account</td><td><code>t:'om'</code> on <a href="#" data-nav="order-update-feed">Order Update Feed</a></td></tr>
    </table>
    <div class="callout warn"><b>The wrapper doesn't merge tick diffs for you</b>Per <a href="#" data-nav="subscribe-market-feed">Subscribe to Market Feed</a>, the raw feed sends a full snapshot once, then only-changed-fields after that. <code>subscribe_callback</code> hands you each message exactly as received — if you need a complete, always-current quote object, merge <code>message</code> into your own dict keyed by token; the example script's <code>print(message)</code> is not doing that for you.</div>` },

    { h: "Why subscribe happens inside open_callback", body: `<p>Both example scripts call <code>api.subscribe(...)</code> from <i>inside</i> <code>open_callback</code> — never immediately after calling <code>start_websocket</code>. <code>start_websocket</code> returns before the connection handshake necessarily completes; subscribing before <code>open_callback</code> fires risks sending a subscribe frame down a socket that isn't confirmed open yet. The <code>socket_opened</code> global flag exists purely so the rest of the program (e.g. a menu option to start the socket) can check connection state without re-entering <code>start_websocket</code>:</p>
    ${codeBlock("python", `elif prompt1 == 's':
    if socket_opened:
        print('websocket already opened')
        continue
    ret = api.start_websocket(
        order_update_callback=event_handler_order_update,
        subscribe_callback=event_handler_quote_update,
        socket_open_callback=open_callback,
    )
    print(ret)`)}` },

    { h: "Subscribing to more than one token", body: `<p>Both scripts show the single-token call live and the multi-token call commented out directly beneath it:</p>
    ${codeBlock("python", `api.subscribe('NSE|11630')
# api.subscribe(['NSE|22', 'BSE|522032'])`)}
    <p>Passing a list subscribes to every token in one call — this is the wrapper-level equivalent of the <code>#</code>-delimited <code>k</code> field documented on <a href="#" data-nav="subscribe-market-feed">Subscribe to Market Feed</a> (<code>"NSE|22#BSE|522032"</code>). Prefer batching into one <code>subscribe</code> call over looping single-token calls, for the same reasons documented there.</p>` },

    { h: "Best practices", body: `<ul>
      <li>Keep <code>event_handler_quote_update</code> and <code>event_handler_order_update</code> fast — per <a href="#" data-nav="websocket-overview">WebSocket Overview</a>, slow handlers block the read loop for every other message on the same socket. The example's <code>print()</code> calls are fine for a demo; route to a queue in production.</li>
      <li>Re-issue every <code>api.subscribe(...)</code> call from inside a fresh <code>open_callback</code> after a reconnect — subscriptions are not remembered across a dropped socket by the server, and the wrapper doesn't replay them for you either.</li>
      <li>Don't call <code>api.subscribe(...)</code> before <code>socket_opened</code> is <code>True</code> — mirror the example's pattern of putting the subscribe calls inside <code>open_callback</code>, not right after invoking <code>start_websocket</code>.</li>
    </ul>` },

    { h: "Notes", body: `<p>Field comments in <code>event_handler_quote_update</code> (<code>e</code>, <code>tk</code>, <code>lp</code>, <code>pc</code>, <code>v</code>, <code>o</code>, <code>h</code>, <code>l</code>, <code>c</code>, <code>ap</code>) match the raw tick fields on <a href="#" data-nav="subscribe-market-feed">Subscribe to Market Feed</a> — cross-reference that page for the full field table, since the example script only comments the handful it expects to see most often.</p>` },
  ],
},

 
  // ---------- F. SDK REFERENCE ----------
  "sdk-code-examples": {
  badge: null,
  desc: "Annotated walkthrough of the official example_orders.py and example_market.py scripts shipped in the Shoonya_API_OAuth repo — the real reference implementation behind the Python SDK, not illustrative pseudocode.",
  sections: [

    { h: "Overview", body: `<p>The <a href="https://github.com/Shoonya-API-OAuth-Python/Shoonya_API_OAuth" target="_blank" rel="noopener">Shoonya_API_OAuth</a> repo ships two runnable CLI scripts — <code>example_orders.py</code> and <code>example_market.py</code> — that exercise every major call through a simple <code>input()</code>-driven menu loop. They're the fastest way to confirm your credentials and see real request/response shapes before wiring anything into a strategy. Both scripts import the same wrapper class, <code>ShoonyaApiPy</code>, from <code>api_helper.py</code>.</p>
    <div class="callout"><b>This is the actual SDK surface</b>Earlier pages on this site show a simplified/illustrative <code>ShoonyaClient</code> for readability. The real class is <code>ShoonyaApiPy</code> (also aliased <code>NorenApiPy</code> in some forks), and its method names — <code>place_order</code>, <code>get_quotes</code>, <code>searchscrip</code>, <code>start_websocket</code> — are what you'll actually import and call.</div>` },

    { h: "Shared setup: OAuth login", body: `<p>Unlike the password/TOTP-based fork, this repo authenticates via the OAuth flow documented on <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a> — redirect to the authorize URL, capture the <code>code</code>, then exchange it for a token:</p>
    ${codeBlock("python", `from api_helper import NorenApiPy

import logging

logging.basicConfig(level=logging.DEBUG)

api = NorenApiPy()

uid = "ABC123"          # your Shoonya user ID
client_id = "ABC123_U"
secret_key = ""     #your Secret_Code

# Step 1 — get the OAuth login URL, visit it, log in, capture 'code' from the redirect
oauth_url = api.getOAuthURL(client_id)
print("Visit and login:", oauth_url)
auth_code = input("Paste the 'code' from the redirect URL: ")

# Step 2 — exchange the auth code for an access token
acc_tok, usrid, ref_tok, actid = api.getAccessToken(auth_code, secret_key, client_id, uid)

print("Access Token:", acc_tok)
print("User ID:", usrid)
print("Refresh Token:", ref_tok)
print("Account ID:", actid)

# Step 3 — inject the token into the session, along with UID and AID
api.injectOAuthHeader(acc_tok, usrid, actid)

print("Login successful, session ready.")`)}
    <div class="callout warn"><b>No cred.yml in this fork</b>The password/TOTP fork stores credentials in a <code>cred.yml</code> file loaded at startup. This OAuth fork has no equivalent file — the only long-lived secret is <code>secret_key</code>, which should be loaded from an environment variable or secrets manager, never hardcoded as shown above. Treat it exactly like the checksum inputs on the <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a> calculator.</div>` },

    { h: "example_orders.py — full script", body: `<p>A menu-driven loop covering the full order lifecycle. Reproduced with the OAuth login block collapsed (see above):</p>
    ${codeBlock("python", `socket_opened = False

def event_handler_order_update(message):
    print("order event: " + str(message))

def event_handler_quote_update(message):
    print("quote event: " + str(message))

def open_callback():
    global socket_opened
    socket_opened = True
    print('app is connected')
    api.subscribe('NSE|22')
    # api.subscribe(['NSE|22', 'BSE|522032'])   # multiple tokens at once

# ... api = ShoonyaApiPy(); OAuth login via getOAuthURL/getAccessToken/injectOAuthHeader (see Setup section) ...

if ret != None:
    while True:
        print('p => place order')
        print('m => modify order')
        print('c => cancel order')
        print('y => order history')
        print('o => get order book')
        print('h => get holdings')
        print('l => get limits')
        print('k => get positions')
        print('d => get daily mtm')
        print('s => start_websocket')
        print('q => quit')
        prompt1 = input('what shall we do? ').lower()

        if prompt1 == 'p':
            ret = api.place_order(
                buy_or_sell='B', product_type='C',
                exchange='NSE', tradingsymbol='INFY-EQ',
                quantity=1, discloseqty=0,
                price_type='LMT', price=1500.00, trigger_price=None,
                retention='DAY', remarks='my_order_001',
            )
            print(ret)

        elif prompt1 == 'm':
            orderno = input('Enter orderno:').lower()
            ret = api.modify_order(
                exchange='NSE', tradingsymbol='INFY-EQ', orderno=orderno,
                newquantity=2, newprice_type='LMT', newprice=1505.00,
            )
            print(ret)

        elif prompt1 == 'c':
            orderno = input('Enter orderno:').lower()
            ret = api.cancel_order(orderno=orderno)
            print(ret)

        elif prompt1 == 'y':
            orderno = input('Enter orderno:').lower()
            ret = api.single_order_history(orderno=orderno)
            print(ret)

        elif prompt1 == 'o':
            ret = api.get_order_book()
            print(ret)

        elif prompt1 == 'h':
            ret = api.get_holdings()
            print(ret)

        elif prompt1 == 'l':
            ret = api.get_limits()
            print(ret)

        elif prompt1 == 'k':
            ret = api.get_positions()
            print(ret)

        elif prompt1 == 'd':
            # contributed by Aromal P Nair
            while True:
                ret = api.get_positions()
                mtm, pnl = 0, 0
                for i in ret:
                    mtm += float(i['urmtom'])
                    pnl += float(i['rpnl'])
                    day_m2m = mtm + pnl
                print(day_m2m)

        elif prompt1 == 's':
            if socket_opened:
                print('websocket already opened')
                continue
            ret = api.start_websocket(
                order_update_callback=event_handler_order_update,
                subscribe_callback=event_handler_quote_update,
                socket_open_callback=open_callback,
            )
            print(ret)

        else:
            print('Fin')
            break`)}
    <div class="callout warn"><b>Two things worth noticing</b>
    <ul style="margin:0.4em 0 0 1.1em;">
      <li>The <code>'d'</code> (Daily MTM) branch is an infinite loop with no sleep or break condition — it's a quick-and-dirty demo, not something to run unmodified. Add a poll interval and an exit condition (see <a href="#" data-nav="daily-mtm">Daily MTM</a>) before reusing it.</li>
      <li><code>modify_order</code>'s success payload returns the order number under <code>result</code>, not <code>norenordno</code> — the same field-naming quirk documented on <a href="#" data-nav="modify-order">Modify Order</a>. The example script just prints the raw dict, so this is easy to miss until you try to parse it.</li>
    </ul></div>` },

    { h: "place_order — real parameter mapping", body: `<p>The wrapper's Python keyword arguments don't share names with the raw JSON fields documented on <a href="#" data-nav="place-order">Place Order</a>. This is the actual mapping used by <code>api_helper.py</code>:</p>
    <table class="param-table">
      <tr><th>Python kwarg</th><th>Raw JSON field</th><th>Notes</th></tr>
      <tr><td>buy_or_sell</td><td>trantype</td><td><code>B</code> / <code>S</code></td></tr>
      <tr><td>product_type</td><td>prd</td><td><code>C</code> / <code>M</code> / <code>I</code> / <code>H</code> / <code>B</code></td></tr>
      <tr><td>exchange</td><td>exch</td><td>—</td></tr>
      <tr><td>tradingsymbol</td><td>tsym</td><td>URL-encode symbols with <code>&amp;</code>, e.g. <code>M&amp;M</code></td></tr>
      <tr><td>quantity</td><td>qty</td><td>—</td></tr>
      <tr><td>discloseqty</td><td>dscqty</td><td>—</td></tr>
      <tr><td>price_type</td><td>prctyp</td><td>Wrapper-level enum includes <code>MKT</code>/<code>SL-MKT</code>; whether the broker's OMS actually accepts them is a separate, account-level restriction — see the warning on <a href="#" data-nav="place-order">Place Order</a>.</td></tr>
      <tr><td>price</td><td>prc</td><td>0.00 is valid only for <code>MKT</code></td></tr>
      <tr><td>trigger_price</td><td>trgprc</td><td><code>None</code> unless <code>price_type</code> is an SL variant</td></tr>
      <tr><td>retention</td><td>ret</td><td><code>DAY</code> / <code>IOC</code> / <code>EOS</code></td></tr>
      <tr><td>remarks</td><td>remarks</td><td>Free text — tag every order uniquely here for reconciliation, per <a href="#" data-nav="place-order">Place Order</a> best practices</td></tr>
      <tr><td>uid, actid, ordersource</td><td>uid, actid, ordersource</td><td>Filled in automatically by the wrapper from the logged-in session — you never pass these yourself</td></tr>
    </table>` },

    { h: "example_market.py — full script", body: `<p>The market-data counterpart, covering symbol search, quotes, contract info, historical candles, and the option chain:</p>
    ${codeBlock("python", `def get_time(time_string):
    data = time.strptime(time_string, '%d-%m-%Y %H:%M:%S')
    return time.mktime(data)

# ... api = ShoonyaApiPy(); OAuth login via getOAuthURL/getAccessToken/injectOAuthHeader ...

if ret != None:
    while True:
        print('f => find symbol')
        print('m => get quotes')
        print('p => contract info n properties')
        print('v => get 1 min market data')
        print('t => get today 1 min market data')
        print('d => get daily data')
        print('o => get option chain')
        print('s => start_websocket')
        print('q => quit')
        prompt1 = input('what shall we do? ').lower()

        if prompt1 == 'v':
            ret = api.get_time_price_series(
                exchange='NSE', token='22',
                starttime=1642265814, endtime=1642438794, interval=240,
            )
            df = pd.DataFrame.from_dict(ret)
            print(df)

        elif prompt1 == 't':
            ret = api.get_time_price_series(exchange='NFO', token='71321')
            df = pd.DataFrame.from_dict(ret)
            print(df)

        elif prompt1 == 'f':
            exch, query = 'MCX', 'CRUDEOIL FEB'
            ret = api.searchscrip(exchange=exch, searchtext=query)
            print(ret)
            if ret != None:
                for symbol in ret['values']:
                    print('{0} token is {1}'.format(symbol['tsym'], symbol['token']))

        elif prompt1 == 'd':
            ret = api.get_daily_price_series(
                exchange='NSE', tradingsymbol='RELIANCE-EQ', startdate=0,
            )
            print(ret)

        elif prompt1 == 'p':
            ret = api.get_security_info(exchange='NSE', token='22')
            print(ret)

        elif prompt1 == 'm':
            ret = api.get_quotes(exchange='NSE', token='22')
            print(ret)

        elif prompt1 == 'o':
            exch, tsym = 'MCX', 'CRUDEOIL18FEB22'
            chain = api.get_option_chain(exchange=exch, tradingsymbol=tsym, strikeprice=4150, count=2)
            chainscrips = []
            for scrip in chain['values']:
                scripdata = api.get_quotes(exchange=scrip['exch'], token=scrip['token'])
                chainscrips.append(scripdata)
            print(chainscrips)

        elif prompt1 == 's':
            if socket_opened:
                print('websocket already opened')
                continue
            ret = api.start_websocket(
                order_update_callback=event_handler_order_update,
                subscribe_callback=event_handler_quote_update,
                socket_open_callback=open_callback,
            )
            print(ret)

        else:
            ret = api.logout()
            print(ret)
            print('Fin')
            break`)}
    <div class="callout warn"><b>The option chain branch makes N+1 calls</b>The <code>'o'</code> handler fetches the chain once via <code>get_option_chain</code>, then loops and calls <code>get_quotes</code> per strike returned. For a chain with a real strike count (10–20+ per side), that's 10–20+ sequential REST calls purely for a live price refresh — exactly the polling pattern <a href="#" data-nav="rate-limits">Rate Limits</a> warns against. Resolve tokens once with <code>get_option_chain</code>, then subscribe to those tokens on the <a href="#" data-nav="subscribe-market-feed">WebSocket feed</a> instead of re-polling quotes per strike.</div>` },

    { h: "get_time_price_series — the two calling patterns", body: `<p>The script shows both an explicit-range call and a defaults-only call, and the difference matters:</p>
    <table class="param-table">
      <tr><th>Call</th><th>Behavior</th></tr>
      <tr><td><code>get_time_price_series(exchange, token, starttime, endtime, interval)</code></td><td>Explicit epoch-second window and candle size in minutes — used by the <code>'v'</code> branch above.</td></tr>
      <tr><td><code>get_time_price_series(exchange, token)</code></td><td>Omitting <code>starttime</code>/<code>endtime</code>/<code>interval</code> falls back to wrapper defaults (effectively "today, 1-minute candles") — used by the <code>'t'</code> branch.</td></tr>
    </table>
    <p>The included helper <code>get_time(time_string)</code> converts a <code>'%d-%m-%Y %H:%M:%S'</code> string to epoch seconds via <code>time.mktime</code> — useful for building <code>starttime</code>/<code>endtime</code> without hand-computing timestamps. Note this uses local system time, not UTC/IST explicitly, so keep the host clock's timezone in mind (see the NTP note on <a href="#" data-nav="totp-setup-guide">TOTP Setup</a> for a related clock-drift issue elsewhere in this API).</p>` },

    { h: "Best practices", body: `<ul>
      <li>Run these scripts against a small, disposable order (1 share, a liquid large-cap) before pointing any automation at your real strategy — they're unmodified from the repo and will place a live order the moment you hit <code>p</code>.</li>
      <li><code>logging.basicConfig(level=logging.DEBUG)</code> at the top of both scripts prints every raw HTTP request/response — keep this on while debugging, but turn it off (or route to a file) in anything long-running, since it will log your access token on every call.</li>
      <li>The <code>'d'</code> Daily MTM branch's unbounded <code>while True</code> loop is illustrative only — see <a href="#" data-nav="daily-mtm">Daily MTM</a> for a bounded version with a recompute interval.</li>
      <li>Both scripts call <code>api.subscribe(...)</code> from inside <code>open_callback</code>, never before — the socket has to confirm open before a subscribe frame is meaningful. Structure your own WebSocket code the same way; see <a href="#" data-nav="streaming-code-examples">Streaming Code Examples</a>.</li>
      <li>Never hardcode <code>secret_key</code> in the login block as shown for readability above — load it from an environment variable, matching the pattern warned about on <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a>.</li>
    </ul>` },

    { h: "Notes", body: `<p>Source: <a href="https://github.com/Shoonya-API-OAuth-Python/Shoonya_API_OAuth/blob/main/example_orders.py" target="_blank" rel="noopener">example_orders.py</a> and <a href="https://github.com/Shoonya-API-OAuth-Python/Shoonya_API_OAuth/blob/main/example_market.py" target="_blank" rel="noopener">example_market.py</a> on GitHub. This fork swaps the TOTP/password login block used by other Shoonya SDK forks for <code>getOAuthURL</code> → <code>getAccessToken</code> → <code>injectOAuthHeader</code> — see <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a> for the underlying HTTP flow this wraps.</p>` },
  ],
},


// Python SDK

  

 




  
  "python-sdk": {
  badge: null,

  desc: "Official Python wrapper for the Shoonya OAuth API — handles the OAuth handshake, and gives typed methods for orders, market data, positions, and the WebSocket feed.",

  sections: [

    // ---------------------------------------------------------------
    { h: "Overview", body: `
      <p>The Python SDK (package name <code>NorenRestApiOAuth</code>, class <code>NorenApi</code>) wraps every REST endpoint covered elsewhere in this documentation — orders, market data, positions, holdings, calculators — plus the OAuth login handshake and the WebSocket feed, behind typed Python methods. Use it instead of hand-rolling <code>requests</code> calls against <code>jData</code>/<code>jKey</code> payloads directly.</p>
      <div class="callout warn"><b>OAuth build, not password login</b>This SDK is built around the <a href="#" data-nav="manual-login-oauth">OAuth login flow</a> — <code>getOAuthURL</code> → <code>getAccessToken</code> → <code>injectOAuthHeader</code>. It is a separate build from the password/TOTP-based <code>NorenApiPy</code> wrapper; don't mix credential styles between the two.</div>
    ` },

    // ---------------------------------------------------------------
    { h: "Installation", body: `
      ${codeBlock("bash", `pip install -r requirements.txt`)}
      <table class="param-table">
        <tr><td><b>Repository</b></td><td><a href="https://github.com/Shoonya-API-OAuth-Python/Shoonya_API_OAuth" target="_blank" rel="noopener">github.com/Shoonya-API-OAuth-Python/Shoonya_API_OAuth</a></td></tr>
        <tr><td><b>Package</b></td><td><code>NorenRestApiOAuth</code></td></tr>
        <tr><td><b>Primary class</b></td><td><code>NorenApi</code></td></tr>
        <tr><td><b>Config file</b></td><td><code>cred.yml</code> — holds <code>oauth_url</code>, <code>API_KEY</code>, <code>SECRET_KEY</code>, <code>client_id</code>, <code>UID</code>; <code>Access_token</code> and <code>Account_ID</code> are written back to it after login.</td></tr>
      </table>
      <p><b>Dependencies</b> (from <code>requirements.txt</code>):</p>
      <table class="param-table">
        <tr><th>Package</th><th>Version</th><th>Purpose</th></tr>
        <tr><td><code>NorenRestApiOAuth</code></td><td>—</td><td>The core API wrapper — the <code>NorenApi</code> class itself.</td></tr>
        <tr><td><code>selenium</code></td><td><code>&gt;=4.15.0</code></td><td>Browser automation, used for scripting the OAuth login step rather than requiring a manual browser visit each time.</td></tr>
        <tr><td><code>webdriver-manager</code></td><td><code>&gt;=4.0.0</code></td><td>Automatically downloads and manages the correct browser driver binary for Selenium.</td></tr>
        <tr><td><code>pyotp</code></td><td><code>&gt;=2.9.0</code></td><td>Generates TOTP codes programmatically for the 2FA step of an automated login.</td></tr>
      </table>
      <div class="callout warn"><b>Selenium is for the login step, not the API calls</b>The <code>NorenApi</code> class itself only needs <code>NorenRestApiOAuth</code>. <code>selenium</code>, <code>webdriver-manager</code>, and <code>pyotp</code> exist to automate the browser-based OAuth handshake (<code>getOAuthURL</code> → login → <code>auth_code</code>) end-to-end — skip them if you're completing that step manually and only need the REST wrapper.</div>
    ` },

    // ---------------------------------------------------------------
    { h: "OAuth & Session Methods", body: `
      <table class="param-table">
        <tr>
          <th>Method</th>
          <th>Description</th>
        </tr>
        <tr><td><code>getOAuthURL(oauth_url, API_KEY)</code></td><td>Builds the login URL from <code>cred.yml</code>. Open it in a browser; after login, the redirect URL carries the <code>auth_code</code>.</td></tr>
        <tr><td><code>getAccessToken(auth_code, SECRET_KEY, client_id, UID)</code></td><td>Exchanges <code>auth_code</code> for an access token. Returns <code>(access_token, userid, refresh_token, account_id)</code> and writes <code>Access_token</code>/<code>Account_ID</code> back into <code>cred.yml</code>.</td></tr>
        <tr><td><code>injectOAuthHeader(Access_token, UID, Account_ID)</code></td><td>Attaches the access token to the HTTP headers used by every subsequent call in the session.</td></tr>
        <tr><td><code>logout()</code></td><td>Terminates the session. Returns <code>{"stat": "Ok", "request_time": ...}</code> on success.</td></tr>
        <tr><td><code>forgot_passwordOTP(userid, pan)</code></td><td>Triggers OTP-based password reset for the given user.</td></tr>
      </table>
    ` },

    // ---------------------------------------------------------------
    { h: "Available Functionality", body: `
      <table class="param-table">
        <tr><th>Category</th><th>Methods</th></tr>
        <tr><td>Symbols</td><td><code>searchscrip</code>, <code>get_security_info</code>, <code>get_quotes</code>, <code>get_time_price_series</code>, <code>get_daily_price_series</code>, <code>get_option_chain</code></td></tr>
        <tr><td>Orders & Trades</td><td><code>place_order</code>, <code>modify_order</code>, <code>cancel_order</code>, <code>exit_order</code>, <code>position_product_conversion</code>, <code>get_orderbook</code>, <code>get_tradebook</code>, <code>single_order_history</code></td></tr>
        <tr><td>Holdings & Limits</td><td><code>get_holdings</code>, <code>get_positions</code>, <code>get_limits</code></td></tr>
        <tr><td>Calculators</td><td><code>span_calculator</code>, <code>get_option_greek</code></td></tr>
        <tr><td>WebSocket</td><td><code>start_websocket</code>, <code>subscribe</code>, <code>unsubscribe</code></td></tr>
      </table>
      <p>Every method mirrors the field-level request/response contract documented on this site's individual API pages — e.g. <code>place_order</code>'s <code>price_type</code> argument maps to the <code>prctyp</code> field on <a href="#" data-nav="place-order">Place Order</a>. Refer to those pages for allowed values and error responses; the SDK doesn't change the underlying validation rules.</p>
    ` },

    // ---------------------------------------------------------------
    { h: "Quick Start Example", body: `${codeTabs("python-sdk-quickstart", {
      python: `import yaml
from api_helper import NorenApi

with open("cred.yml") as f:
    cred = yaml.safe_load(f)

api = NorenApi(host="https://api.shoonya.com/NorenWClientAPI/")

# 1. Get the OAuth login URL, open it, complete login in browser
login_url = api.getOAuthURL(cred["oauth_url"], cred["API_KEY"])
print("Login here:", login_url)

# 2. Paste the auth_code from the redirect URL
auth_code = input("Enter auth_code: ")

# 3. Exchange auth_code for an access token
acc_tok, uid, ref_tok, actid = api.getAccessToken(
    auth_code, cred["SECRET_KEY"], cred["client_id"], cred["UID"]
)

# 4. Inject the token into subsequent requests
api.injectOAuthHeader(acc_tok, uid, actid)

# 5. Use any wrapped method
ret = api.get_limits()
print(ret)`,
    })}` },

    // ---------------------------------------------------------------
    { h: "Best Practices", body: `<ul>
      <li>Treat <code>cred.yml</code> as a secrets file — <code>SECRET_KEY</code>, <code>Access_token</code>, and <code>Account_ID</code> live in it once populated. Never commit it to source control.</li>
      <li><code>getAccessToken</code> rewrites <code>Access_token</code>/<code>Account_ID</code> in <code>cred.yml</code> on every successful login — build your credential loading to read the file fresh rather than caching it across runs.</li>
      <li>Call <code>injectOAuthHeader</code> once per session immediately after obtaining the token; every wrapped method depends on it being set first.</li>
      <li>The SDK's error model mirrors the raw API's <code>stat</code>/<code>emsg</code> convention — always check <code>stat == "Ok"</code> before trusting a response field, the same as with raw REST calls. See <a href="#" data-nav="error-handling">Error Handling</a>.</li>
      <li>For anything running unattended, pair this with <a href="#" data-nav="token-renewal">Token Renewal</a> — the SDK doesn't auto-refresh an expired access token for you.</li>
    </ul>` },

  ],
},


"dotnet-sdk": {
  badge: null,

  desc: ".NET wrapper (NorenRestApiWrapper) for the Shoonya OAuth API — combines REST calls and a WebSocket client behind a callback-based NorenRestApi class.",

  sections: [

    // ---------------------------------------------------------------
    { h: "Overview", body: `
      <p>The .NET SDK is a wrapper of the Noren API combining REST calls and WebSocket streaming for trading. It targets <b>.NET Standard 2.0</b>, built on Visual Studio 2019, with a dependency on <b>Newtonsoft.Json 9.0.1</b>. The namespace is <code>NorenRestApiWrapper</code>; the primary class is <code>NorenRestApi</code>.</p>
      <div class="callout warn"><b>Callback-based, not async/await</b>Every request method takes a delegate — <code>public delegate void OnResponse(NorenResponseMsg Response, bool ok)</code> — rather than returning a <code>Task</code>. Structure your calling code around callbacks, not <code>await</code>, when integrating this SDK.</div>
    ` },

    // ---------------------------------------------------------------
    { h: "Installation", body: `
      <table class="param-table">
        <tr><td><b>Repository</b></td><td><a href="https://github.com/Shoonya-API-OAuth-Python/ShoonyaApidotNet" target="_blank" rel="noopener">github.com/Shoonya-API-OAuth-Python/ShoonyaApidotNet</a></td></tr>
        <tr><td><b>Target framework</b></td><td>.NET Standard 2.0</td></tr>
        <tr><td><b>Dependency</b></td><td>Newtonsoft.Json 9.0.1</td></tr>
        <tr><td><b>Namespace</b></td><td><code>NorenRestApiWrapper</code></td></tr>
        <tr><td><b>Primary class</b></td><td><code>NorenRestApi</code></td></tr>
      </table>
      <p>Clone the repository and reference the project directly, or pull the compiled dependency from the <code>Deps</code> folder — there's no NuGet package as of this writing. Example projects are included: <code>Example1</code>, <code>Example2_InlineHandler</code>, <code>Example3_Websocket</code>, and <code>Example4_oauth</code> for the OAuth flow specifically.</p>
    ` },

    // ---------------------------------------------------------------
    { h: "Initialization", body: `
      <table class="param-table">
        <tr><th>Parameter</th><th>Description</th></tr>
        <tr><td><code>endPoint</code></td><td> https://api.shoonya.com/OAuthlogin/authorize/oauth.</td></tr>
        <tr><td><code>Appkey</code></td><td>The secret key issued to you — do not append the user ID to it.</td></tr>
      </table>
      <p>Create an instance of <code>NorenRestApi</code> to make requests. Every request method takes an <code>OnResponse</code> callback delegate as its first argument.</p>
    ` },

    // ---------------------------------------------------------------
    { h: "OAuth & Session Methods", body: `
      <table class="param-table">
        <tr><th>Method</th><th>Description</th></tr>
        <tr><td><code>SendgetOAuthURL(oauth_url, client_id)</code></td><td>Requests the OAuth provider to initiate verification with the end user. Returns a URL to open in a browser; on success, the redirect provides <code>auth_code</code>.</td></tr>
        <tr><td><code>SendgetAccessToken(response, endPoint, authCode, secretcode, client_id, uid)</code></td><td>Exchanges <code>auth_code</code> for an access token via the <code>OnResponse</code> callback, returning a <code>GetAccessTokenResponse</code> with <code>access_token</code>, <code>susertoken</code>, <code>refresh_token</code>, and <code>actid</code>.</td></tr>
        <tr><td><code>SendGetUserDetails(response)</code></td><td>Fetches enabled exchanges, order types, and product types for the logged-in user.</td></tr>
        <tr><td><code>SendLogout(response)</code></td><td>Terminates the current session.</td></tr>
        <tr><td><code>SetSession(endpoint, uid, pwd, usertoken)</code></td><td>Initializes the API with an existing session instead of creating a new one via login.</td></tr>
      </table>
    ` },

    // ---------------------------------------------------------------
    { h: "Available Functionality", body: `
      <table class="param-table">
        <tr><th>Category</th><th>Methods</th></tr>
        <tr><td>WatchLists</td><td><code>SendGetMWList</code>, <code>SendGetMarketWatch</code>, <code>SendAddMultiScripsToMW</code>, <code>SendDeleteMultiMWScrips</code></td></tr>
        <tr><td>Market</td><td><code>SendSearchScrip</code>, <code>SendGetSecurityInfo</code>, <code>GetQuote</code>, time/daily price series, <code>GetOptionChain</code>, <code>GetIndexList</code>, <code>ExchMsg</code>, top-list methods</td></tr>
        <tr><td>Calculators</td><td><code>span_calculator</code>, <code>get_option_greek</code>, <code>GetBrokerage</code></td></tr>
        <tr><td>Orders & Trades</td><td><code>SendPlaceOrder</code>, <code>SendModifyOrder</code>, <code>SendCancelOrder</code>, <code>SendExitSNOOrder</code>, <code>SendProductConversion</code>, <code>SendGetOrderMargin</code>, <code>SendGetOrderBook</code>, <code>SendGetTradeBook</code>, <code>SendGetOrderHistory</code>, <code>SendGetMultiLegOrderBook</code>, <code>SendGetPositionBook</code>, <code>SendGetHoldings</code>, <code>SendGetLimits</code></td></tr>
        <tr><td>Streaming</td><td><code>Connect</code>, <code>SubscribeMarketData</code>, <code>UnSubscribeMarketData</code>, <code>SubscribeOrderUpdate</code></td></tr>
      </table>
      <p>Order types beyond a plain <code>LMT</code>/<code>SL-LMT</code> buy/sell are supported here — <code>PlaceOrder</code> covers Cover Orders (<code>prd = H</code>) and Bracket Orders (<code>prd = B</code>) with <code>blprc</code>/<code>bpprc</code>/<code>trailprc</code> fields, unlike the REST <a href="#" data-nav="place-order">Place Order</a> endpoint documented elsewhere on this site, which rejects <code>CO</code>/<code>BO</code>. Confirm which product types your account is enabled for before relying on this.</p>
    ` },

    // ---------------------------------------------------------------
    { h: "Quick Start Example", body: `${codeTabs("dotnet-sdk-quickstart", {
      csharp: `using NorenRestApiWrapper;

// 1. Initialize
var nApi = new NorenRestApi(endPoint, appKey);

// 2. Get the OAuth login URL, open it, complete login in browser
string loginUrl = nApi.SendgetOAuthURL(oauth_url, client_id);
Console.WriteLine("Login here: " + loginUrl);

// 3. Paste the auth_code from the redirect URL, then exchange it
nApi.SendgetAccessToken(Handlers.OnAppLoginResponse, endPoint, authCode, secretcode, client_id, uid);

// 4. Handle the callback
public static void OnAppLoginResponse(NorenResponseMsg response, bool ok)
{
    var accessTokenRsp = (GetAccessTokenResponse)response;
    if (accessTokenRsp.stat == "Ok")
    {
        string accessToken = accessTokenRsp.access_token;
        string actid = accessTokenRsp.actid;
        // Store and use accessToken for subsequent calls
    }
}

// 5. Place an order once authenticated
var order = new PlaceOrder
{
    uid = uid,
    actid = actid,
    exch = "NSE",
    tsym = "RELIANCE-EQ",
    qty = "1",
    dscqty = "0",
    prc = "180.5",
    prd = "C",
    trantype = "B",
    prctyp = "LMT",
    ret = "DAY",
    ordersource = "API",
};

nApi.SendPlaceOrder(Handlers.OnResponseNOP, order);`,
    })}` },

    // ---------------------------------------------------------------
    { h: "Best Practices", body: `<ul>
      <li>Design around the callback signature (<code>OnResponse</code>) from the start — retrofitting async/await over a callback-based SDK later is more work than structuring for it up front.</li>
      <li>Cast the <code>NorenResponseMsg</code> in your callback to the specific response type documented for that call (e.g. <code>GetAccessTokenResponse</code>, <code>PlaceOrderResponse</code>) and check <code>stat == "Ok"</code> before reading any other field.</li>
      <li>Cover Orders and Bracket Orders (<code>prd = H</code> / <code>B</code>) are supported here but not on the plain REST <a href="#" data-nav="place-order">Place Order</a> endpoint — don't assume feature parity between this SDK and the raw HTTP API when porting code between platforms.</li>
      <li>Reference the <code>Example4_oauth</code> project in the repository for a complete working OAuth handshake — it's the fastest way to confirm your <code>endPoint</code> and <code>Appkey</code> are configured correctly before writing your own integration.</li>
      <li>Same as the Python SDK, this wrapper doesn't auto-refresh an expired token — pair it with <a href="#" data-nav="token-renewal">Token Renewal</a> for unattended processes.</li>
    </ul>` },

  ],
},
  // ---------- COMPLIANCE & RISK ----------
  "algo-compliance": {
    badge: null,
    desc: "How SEBI's algo trading framework applies to Shoonya API orders, and what your integration must do to stay compliant.",
    sections: [
      { h: "Overview", body: `<p>SEBI's algo trading circular (SEBI/HO/MIRSD/MIRSD-PoD/P/CIR/2025/0000013) requires every order placed through an API — not just orders from registered algo strategies — to carry a broker-empanelled Algo ID. This applies whether you're running a formally registered strategy or a personal script hitting the same order endpoints.</p>
      <div class="callout warn"><b>Applicability</b>Full enforcement applies from April 1, 2026. Orders placed via the API without a valid, empanelled Algo ID after that date are expected to be rejected at the exchange level, not just flagged after the fact.</div>` },
      { h: "What you need to do", body: `<ol>
        <li><b>Register your strategy</b> with Shoonya's compliance desk before going live — even a single-user script that trades algorithmically falls under this requirement.</li>
        <li><b>Receive an Algo ID</b> once your strategy is empanelled with the exchange through Shoonya as the broker.</li>
        <li><b>Attach the Algo ID</b> to every order placed via <a href="#" data-nav="place-order">Place Order</a>, typically as an additional field in the order payload — confirm the exact field name with your onboarding contact, as it is being finalized across the industry ahead of the deadline.</li>
        <li><b>Keep static strategies static.</b> Any change to an already-registered strategy's logic may require re-registration — check with compliance before deploying a materially changed version under an existing Algo ID.</li>
      </ol>` },
      { h: "Who this affects", body: `
      <table class="param-table">
        <tr><th>Integration type</th><th>Algo ID required?</th></tr>
        <tr><td>Manual orders via the Shoonya app/terminal</td><td>No</td></tr>
        <tr><td>Personal script placing orders via the API</td><td>Yes</td></tr>
        <tr><td>Vendor platform placing orders on behalf of clients</td><td>Yes, per registered strategy</td></tr>
        <tr><td>Read-only integrations (quotes, positions, order book)</td><td>No — Algo ID only applies to order placement</td></tr>
      </table>` },
      { h: "Best practices", body: `<ul>
        <li>Start the registration conversation with compliance well before you plan to go live — empanelment is not instant.</li>
        <li>Log the Algo ID alongside every order in your own audit trail; SEBI's framework expects strategy-level traceability, not just account-level.</li>
        <li>If you run multiple distinct strategies from the same account, register and tag each one separately rather than reusing a single Algo ID across unrelated logic.</li>
      </ul>` },
      { h: "Notes", body: `<p>This page summarizes the framework as it applies to API integrators; it is not a substitute for the full circular text or Finvasia's own compliance guidance. Confirm current requirements with your API onboarding contact — this is a fast-moving regulatory area ahead of the April 2026 deadline.</p>` },
    ],
  },

  "risk-management": {
    badge: null,
    desc: "How Shoonya's Risk Management System (RMS) evaluates orders before they reach the exchange, and how to design around it.",
    sections: [
      { h: "Overview", body: `<p>Every order placed via the API — the same as one placed manually — passes through Shoonya's RMS before reaching the exchange. RMS checks margin availability, position limits, and price sanity (circuit bands) in real time. A rejected order most often means an RMS check failed, not an API-level error.</p>` },
      { h: "Common rejection reasons", body: `
      <table class="param-table">
        <tr><th>Reason</th><th>Typical cause</th></tr>
        <tr><td>Insufficient margin</td><td>Available funds/margin don't cover the order at current pricing.</td></tr>
        <tr><td>Price out of circuit band</td><td>Limit price is outside the exchange-permitted range for the instrument.</td></tr>
        <tr><td>Exposure limit breached</td><td>Order would push net exposure past your account's configured RMS limit.</td></tr>
        <tr><td>Square-off window</td><td>Intraday product order placed outside permitted market hours for that product type.</td></tr>
      </table>` },
      { h: "Best practices", body: `<ul>
        <li>Don't treat server-side RMS as your only safeguard — enforce your own pre-trade checks (max order size, max daily loss) in your strategy code so failures are caught before they even reach the API.</li>
        <li>Check <a href="#" data-nav="funds-limits">Funds & Limits</a> before sizing an order rather than discovering insufficient margin via a rejection.</li>
        <li>Always branch on <code>stat</code> and read <code>emsg</code> from <a href="#" data-nav="place-order">Place Order</a>'s response — don't assume a rejection is a bug in your code before checking the reason.</li>
      </ul>` },
      { h: "Notes", body: `<p>RMS limits are configured per account and can be adjusted by request — contact your relationship desk if your strategy's legitimate exposure needs exceed the defaults.</p>` },
    ],
  },
  // Postman Collection 
  "postman-collection": {
  badge: null,
  desc: "Import the full NorenRESTAPI OAuth Postman collection — every endpoint pre-built as a ready-to-run request.",
  sections: [
    { h: "Overview", body: `<p>The <code>NorenRESTAPI_oAuth</code> Postman collection covers every documented endpoint as a pre-configured request, using collection variables for your domain and credentials so you're not retyping URLs and payloads for each test call.</p>` },
    { h: "Download", body: `
      <div style="border:1px solid #e2e2e2;border-radius:10px;padding:20px 24px;max-width:460px;display:flex;align-items:center;justify-content:space-between;gap:24px;background:#fff;">
        <div style="min-width:0;">
          <div style="font-weight:600;font-size:14px;color:#1a1a1a;line-height:1.4;word-break:break-word;">NorenRESTAPI_oAuth.postman_collection.json</div>
          <div style="font-size:12.5px;color:#8a8a8a;margin-top:4px;">Postman Collection v2.1 — 40 endpoints</div>
        </div>
        <button id="pc-download-btn"
           style="flex-shrink:0;padding:10px 20px;border-radius:6px;background:#c9971e;color:#fff;font-weight:600;font-size:14px;border:none;cursor:pointer;white-space:nowrap;line-height:1;">
          Download
        </button>
      </div>
    ` },
    { h: "Import", body: `<ol>
      <li>Click <b>Download</b> above to save the collection JSON.</li>
      <li>In Postman: <b>File → Import</b>, then select the downloaded file.</li>
      <li>Set up the collection variables (below) before running any request.</li>
    </ol>` },
    { h: "Collection variables", body: `<p>Set these under the collection's <b>Variables</b> tab so every endpoint picks them up automatically:</p>
    <table class="param-table">
      <tr><th>Variable</th><th>Description</th></tr>
      <tr><td><code>Domain_Name</code></td><td>API host — defaults to <code>api.shoonya.com</code>, used as <code>{{Domain_Name}}</code> in every request URL.</td></tr>
      <tr><td><code>USER_ID</code></td><td>Your Shoonya user ID, used as <code>uid</code> in most request bodies.</td></tr>
      <tr><td><code>ACCT_ID</code></td><td>Your account ID, used as <code>actid</code> where required (orders, holdings, reports).</td></tr>
      <tr><td><code>PAN</code></td><td>Used only by the Forgot Password requests.</td></tr>
      <tr><td><code>access_token</code></td><td>Your <code>susertoken</code> from <a href="#" data-nav="manual-login-oauth">GenAcsTok</a> — every authenticated request reads this variable for its Bearer token, so set it once after logging in rather than editing 40 requests individually.</td></tr>
    </table>` },
    { h: "Authentication", body: `<p>Every request except <b>GenAccessToken</b> uses Postman's per-request <b>Bearer Token</b> auth, sourced from the <code>{{access_token}}</code> collection variable. Get that token first by running <b>GenAccessToken</b> — see <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a> for how to obtain <code>code</code> and compute the <code>checksum</code> it needs — then paste the returned <code>susertoken</code> into the <code>access_token</code> variable.</p>` },
    { h: "Auth & account", body: `
    <table class="param-table">
      <tr><th>Request</th><th>Endpoint</th></tr>
      <tr><td>GenAccessToken</td><td><code>POST GenAcsTok</code></td></tr>
      <tr><td>Forgot Password</td><td><code>POST ForgotPassword</code></td></tr>
      <tr><td>Forgot Password OTP</td><td><code>POST FgtPwdOTP</code></td></tr>
      <tr><td>Change Password</td><td><code>POST Changepwd</code></td></tr>
      <tr><td>User Detail</td><td><code>POST UserDetails</code></td></tr>
      <tr><td>ClientDetails</td><td><code>POST ClientDetails</code></td></tr>
    </table>` },
    { h: "Watchlist", body: `
    <table class="param-table">
      <tr><th>Request</th><th>Endpoint</th></tr>
      <tr><td>Get Watchlist Names</td><td><code>POST MWList</code></td></tr>
      <tr><td>Get Watchlist Scrips</td><td><code>POST MarketWatch</code></td></tr>
      <tr><td>Search Scrip</td><td><code>POST SearchScrip</code></td></tr>
      <tr><td>Add Scrip To Watchlist</td><td><code>POST AddMultiScripsToMW</code></td></tr>
      <tr><td>ReorderMWScrips</td><td><code>POST ReorderMWScrips</code></td></tr>
      <tr><td>Delete Scrip to Watch List</td><td><code>POST DeleteMultiMWScrips</code></td></tr>
      <tr><td>PreDefinedMW</td><td><code>POST PreDefinedMW</code></td></tr>
      <tr><td>PreDefinedMWList</td><td><code>POST PreDefinedMWList</code></td></tr>
      <tr><td>RenameMW</td><td><code>POST RenameMW</code></td></tr>
    </table>` },
    { h: "Orders & trades", body: `
    <table class="param-table">
      <tr><th>Request</th><th>Endpoint</th></tr>
      <tr><td>Place Order</td><td><code>POST PlaceOrder</code></td></tr>
      <tr><td>Modify Order</td><td><code>POST ModifyOrder</code></td></tr>
      <tr><td>Cancel Order</td><td><code>POST CancelOrder</code></td></tr>
      <tr><td>ExitSNOOrder</td><td><code>POST ExitSNOOrder</code></td></tr>
      <tr><td>GetOrderMargin</td><td><code>POST GetOrderMargin</code></td></tr>
      <tr><td>GetBasketMargin</td><td><code>POST GetBasketMargin</code></td></tr>
      <tr><td>OrderBook</td><td><code>POST OrderBook</code></td></tr>
      <tr><td>MultiLegOrderBook</td><td><code>POST MultiLegOrderBook</code></td></tr>
      <tr><td>Single order Hist</td><td><code>POST SingleOrdHist</code></td></tr>
      <tr><td>single ord status</td><td><code>POST SingleOrdStatus</code></td></tr>
      <tr><td>TradeBook</td><td><code>POST TradeBook</code></td></tr>
      <tr><td>Product Conversion</td><td><code>POST ProductConversion</code></td></tr>
      <tr><td>SpanCalc</td><td><code>POST SpanCalc</code></td></tr>
    </table>` },
    { h: "Positions, holdings & funds", body: `
    <table class="param-table">
      <tr><th>Request</th><th>Endpoint</th></tr>
      <tr><td>PositionBook</td><td><code>POST PositionBook</code></td></tr>
      <tr><td>InteropPosition book</td><td><code>POST InteropPositionBook</code></td></tr>
      <tr><td>Holdings</td><td><code>POST Holdings</code></td></tr>
      <tr><td>Holdings Conversion</td><td><code>POST HoldingsConv</code></td></tr>
      <tr><td>Limits</td><td><code>POST Limits</code></td></tr>
      <tr><td>GetSubLimits</td><td><code>POST GetSubLimits</code></td></tr>
      <tr><td>GetMaxPayoutAmount</td><td><code>POST GetMaxPayoutAmount</code></td></tr>
    </table>` },
    { h: "Reports", body: `
    <table class="param-table">
      <tr><th>Request</th><th>Endpoint</th></tr>
      <tr><td>GetOrderReport</td><td><code>POST GetOrderReport</code></td></tr>
      <tr><td>GetTradeReport</td><td><code>POST GetTradeReport</code></td></tr>
    </table>` },
    { h: "Market data & reference", body: `
    <table class="param-table">
      <tr><th>Request</th><th>Endpoint</th></tr>
      <tr><td>Get SecurityInfo</td><td><code>POST GetSecurityInfo</code></td></tr>
      <tr><td>GetQuotes</td><td><code>POST GetQuotes</code></td></tr>
      <tr><td>EODChartData</td><td><code>POST EODChartData</code></td></tr>
      <tr><td>GetIndexList</td><td><code>POST GetIndexList</code></td></tr>
      <tr><td>GetOptionChain</td><td><code>POST GetOptionChain</code></td></tr>
      <tr><td>GetOptionGreek</td><td><code>POST GetOptionGreek</code></td></tr>
      <tr><td>GetLinkedScrips</td><td><code>POST GetLinkedScrips</code></td></tr>
      <tr><td>GetUnderlyingExchToken</td><td><code>POST GetUnderlyingExchToken</code></td></tr>
      <tr><td>ExchMsg</td><td><code>POST ExchMsg</code></td></tr>
      <tr><td>GetBrokerMsg</td><td><code>POST GetBrokerMsg</code></td></tr>
      <tr><td>ExchStatus</td><td><code>POST ExchStatus</code></td></tr>
      <tr><td>AMOStatusFlag</td><td><code>POST AMOStatusFlag</code></td></tr>
      <tr><td>TPSeries</td><td><code>POST TPSeries</code></td></tr>
    </table>` },
    { h: "Notes", body: `<ul>
      <li>All request bodies use <code>jData=&lt;JSON&gt;</code> as raw text, per <a href="#" data-nav="api-structure">API Structure</a> — every request's body tab is set to <b>raw / text</b>; don't switch it to JSON mode or the <code>jData=</code> prefix will be dropped from the send.</li>
      <li><code>GetOptionGreek</code>'s sample body uses placeholder values (<code>&lt;expiry&gt;</code>, <code>&lt;strike_price&gt;</code>, etc.) — fill these in before sending, it won't return anything meaningful as-is.</li>
      <li>Order-referencing requests (Modify/Cancel/ExitSNOOrder/order history/status) use a <code>&lt;order_number&gt;</code> placeholder for <code>norenordno</code> — replace with a real order number from <a href="#" data-nav="order-book">Order Book</a> before testing.</li>
    </ul>` },
  ],
},
  

  // ---------- G. ANNEXURE ----------
  "error-code-reference": {
    badge: null,
    desc: "Common HTTP error codes returned by the Shoonya API — what each means and how to resolve it.",
    sections: [
      { h: "Overview", body: `<p>The table below lists the common HTTP status codes you may receive while calling the Shoonya API, along with the recommended resolution for each.</p>` },
      { h: "Purpose", body: `<p>Use this as the single lookup table for HTTP-level error handling (retries, re-auth, escalation) across every integration — link to a specific row instead of duplicating error explanations on each endpoint page.</p>` },
      { h: "Reference table", body: `
      <table class="param-table">
        <tr><th>Code</th><th>Error Description</th><th>Resolution</th></tr>
        <tr><td>400</td><td>Missing or bad request parameters or values.</td><td>Validate the payload against the endpoint's parameter table — check for missing required fields or incorrect types/values.</td></tr>
        <tr><td>403</td><td>Session expired or invalidated. Must relogin.</td><td>Re-authenticate via the login/OAuth flow and obtain a fresh session token; do not retry the same request with the old token.</td></tr>
        <tr><td>404</td><td>Requested resource was not found.</td><td>Confirm the endpoint path and any identifiers used (order ID, symbol, token, etc.) are correct.</td></tr>
        <tr><td>405</td><td>Request method (GET, POST, etc.) is not allowed on the requested endpoint.</td><td>Check the endpoint's documented HTTP method and correct the client call.</td></tr>
        <tr><td>410</td><td>The requested resource is gone permanently.</td><td>Stop calling this endpoint/resource; check the changelog for its replacement.</td></tr>
        <tr><td>429</td><td>Too many requests to the API (rate limiting).</td><td>Back off per the Rate Limits page and retry with exponential backoff and jitter.</td></tr>
        <tr><td>500</td><td>Something unexpected went wrong.</td><td>Retry with backoff; if persistent, capture the request/response and escalate to support.</td></tr>
        <tr><td>502</td><td>The backend OMS is down and the API is unable to communicate with it.</td><td>Please check the host or WebSocket URL you're connecting to, and confirm you're going through the OAuth login flow correctly before retrying — a 502 here often traces back to a misconfigured host/socket endpoint or an invalid/incomplete auth handshake rather than a transient outage.</td></tr>
        <tr><td>503</td><td>Service unavailable; the API is down.</td><td>Retry with backoff; check the status page before escalating.</td></tr>
        <tr><td>504</td><td>Gateway timeout; the API is unreachable.</td><td>Retry with backoff. For order placement/modification calls, reconcile via a status GET before retrying, to avoid duplicate orders.</td></tr>
      </table>` },
    ],
  },


  "exchange-segment-codes": {
  badge: null,
  desc: "Exchange segment codes used across request and response payloads for order placement, market data, and symbol lookups.",
  sections: [
    { h: "Overview", body: `<p>Every API call that references an instrument — <a href="#" data-nav="place-order">Place Order</a>, <a href="#" data-nav="market-quotes">Market Quotes</a>, <a href="#" data-nav="search-scrip">Search Scrip</a>, and others — requires an <code>exch</code> field identifying the exchange segment. Use the exact code from the table below; values are case-sensitive.</p>` },
    { h: "Segment codes", body: `
    <table class="param-table">
      <tr><th>Code</th><th>Exchange / Segment</th><th>Description</th></tr>
      <tr><td><code>NSE</code></td><td>NSE Cash</td><td>National Stock Exchange, equity segment.</td></tr>
      <tr><td><code>BSE</code></td><td>BSE Cash</td><td>Bombay Stock Exchange, equity segment.</td></tr>
      <tr><td><code>NFO</code></td><td>NSE F&O</td><td>NSE Futures & Options — index and stock derivatives.</td></tr>
      <tr><td><code>BFO</code></td><td>BSE F&O</td><td>BSE Futures & Options — index and stock derivatives. Note: <code>prd: "I"</code> (MIS) is not accepted on this segment — use <code>prd: "M"</code> (NRML) instead. See <a href="#" data-nav="product-type-codes">Product Type Codes</a>.</td></tr>
      <tr><td><code>CDS</code></td><td>NSE Currency</td><td>NSE currency derivatives segment.</td></tr>
      <tr><td><code>BCD</code></td><td>BSE Currency</td><td>BSE currency derivatives segment.</td></tr>
      <tr><td><code>MCX</code></td><td>MCX Commodity</td><td>Multi Commodity Exchange — commodity futures & options.</td></tr>
    </table>
    <p>Not every segment is enabled for every account by default — commodity and currency segments in particular often require separate activation. Check the <code>prarr</code> array in your <a href="#" data-nav="funds-limits">Funds & Limits</a> or Client Details response to confirm which segments and product types are enabled for a given user ID.</p>` },
    { h: "Usage example", body: `<p>The <code>exch</code> field appears identically across order, data, and lookup APIs:</p>
    ${codeBlock("json", `{
  "exch": "NFO",
  "tsym": "NIFTY28AUG26F",
  "buy_or_sell": "B",
  "qty": "50"
}`)}` },
    { h: "Related", body: `<p>See <a href="#" data-nav="product-type-codes">Product Type Codes</a> and <a href="#" data-nav="order-type-codes">Order Type Codes</a> for the other coded fields commonly paired with <code>exch</code> in a request payload.</p>` },
  ],
},


  "product-type-codes": {
    badge: null,
    desc: "The prd values used to tag every order, position, and holding by product.",
    sections: [
      { h: "Reference table", body: `
      <table class="param-table">
        <tr><th>Value</th><th>Product</th><th>Accepted on Place/Modify Order?</th></tr>
        <tr><td>C</td><td>CNC — Cash and Carry / Delivery</td><td>Yes</td></tr>
        <tr><td>M</td><td>NRML — Carry Forward (margin, F&O overnight)</td><td>Yes</td></tr>
        <tr><td>I</td><td>MIS — Intraday</td><td>Yes<sup>*</sup></td></tr>
        <tr><td>H</td><td>CO — Cover Order</td><td><b>No</b> — not accepted as a <code>prd</code> value on new orders; see <a href="#" data-nav="exit-order">Exit Order</a> for exiting legacy CO positions.</td></tr>
        <tr><td>B</td><td>BO — Bracket Order</td><td><b>No</b> — same as above.</td></tr>
      </table>
      <div class="callout"><b>Where each value shows up</b>Used as <code>prd</code> on <a href="#" data-nav="place-order">Place Order</a>/<a href="#" data-nav="modify-order">Modify Order</a>, as <code>prd</code>/<code>prevprd</code> on <a href="#" data-nav="product-conversion">Product Conversion</a>, and as <code>prd</code> filtering on <a href="#" data-nav="positions">Positions</a> and <a href="#" data-nav="holdings">Holdings</a>.</div>
      <p><sup>*</sup><code>I</code> (MIS) is not accepted on the <b>BFO</b> segment — BSE F&O orders must use <code>M</code> (NRML) instead. Sending <code>prd: "I"</code> with <code>exch: "BFO"</code> is rejected; see <a href="#" data-nav="exchange-segment-codes">Exchange Segment Codes</a>.</p>` },
      { h: "Notes", body: `<p>H and B remain valid values you may encounter on older positions or on accounts where they were separately enabled — the restriction documented here is specifically about placing <b>new</b> orders through this API's Place/Modify Order endpoints.</p>` },
    ],
  },
  "order-type-codes": {
  badge: null,
  desc: "Values for the price_type field, controlling how an order is priced and triggered.",
  sections: [
    { h: "Overview", body: `<p>The <code>price_type</code> field appears in <a href="#" data-nav="place-order">Place Order</a> and <a href="#" data-nav="modify-order">Modify Order</a> payloads. It determines whether an order rests at a fixed price, follows the market, or waits for a trigger.</p>` },
    { h: "Codes", body: `
    <table class="param-table">
      <tr><th>Code</th><th>Order Type</th><th>Description</th></tr>
      <tr><td><code>LMT</code></td><td>Limit</td><td>Order rests at the specified <code>prc</code> or better. Requires <code>prc</code>.</td></tr>
      <tr><td><code>MKT</code></td><td>Market</td><td>Executes immediately at the best available price. <code>prc</code> is ignored.</td></tr>
      <tr><td><code>SL-LMT</code></td><td>Stop Loss Limit</td><td>Converts to a limit order at <code>prc</code> once the market touches <code>trgprc</code>. Requires both <code>prc</code> and <code>trgprc</code>.</td></tr>
      <tr><td><code>SL-MKT</code></td><td>Stop Loss Market</td><td>Converts to a market order once the market touches <code>trgprc</code>. Requires <code>trgprc</code>; <code>prc</code> is ignored.</td></tr>
    </table>` },
    { h: "Usage example", body: `${codeBlock("json", `{
  "price_type": "SL-LMT",
  "prc": "200.00",
  "trgprc": "199.50"
}`)}` },
    { h: "Related", body: `<p>See <a href="#" data-nav="transaction-type-codes">Transaction Type Codes</a> for the paired <code>buy_or_sell</code> field, and <a href="#" data-nav="product-type-codes">Product Type Codes</a> for <code>product_type</code> (MIS / CNC / NRML).</p>` },
  ],
},

"transaction-type-codes": {
  badge: null,
  desc: "Values for the buy_or_sell field, indicating order direction.",
  sections: [
    { h: "Overview", body: `<p>The <code>buy_or_sell</code> field appears in <a href="#" data-nav="place-order">Place Order</a>, <a href="#" data-nav="modify-order">Modify Order</a>, and order/trade book responses. It's a single-character code — not a full word.</p>` },
    { h: "Codes", body: `
    <table class="param-table">
      <tr><th>Code</th><th>Transaction Type</th><th>Description</th></tr>
      <tr><td><code>B</code></td><td>Buy</td><td>Buy order — opens or adds to a long position, or closes a short.</td></tr>
      <tr><td><code>S</code></td><td>Sell</td><td>Sell order — opens or adds to a short position, or closes a long.</td></tr>
    </table>
    <p>For <a href="#" data-nav="exit-order">Exit Order</a>, the direction is inferred from the existing position, not passed explicitly.</p>` },
    { h: "Usage example", body: `${codeBlock("json", `{
  "buy_or_sell": "B",
  "exch": "NSE",
  "tsym": "CANBK-EQ",
  "qty": "1"
}`)}` },
    { h: "Related", body: `<p>See <a href="#" data-nav="order-type-codes">Order Type Codes</a> for the paired <code>price_type</code> field, and <a href="#" data-nav="product-type-codes">Product Type Codes</a> for <code>product_type</code>.</p>` },
  ],
},
"instrument-token-list": {
  badge: null,
  desc: "Downloadable master files mapping every tradable instrument to its token, exchange, and contract details.",
  sections: [
    { h: "Overview", body: `<p>Rather than looking up instruments one at a time via <a href="#" data-nav="search-scrip">Search Scrip</a>, Shoonya publishes a full instrument master as a downloadable file per exchange segment. Use these for local caching, symbol-to-token mapping, and bulk lookups — polling <a href="#" data-nav="search-scrip">Search Scrip</a> in a loop for a large symbol universe will run into the limits described in <a href="#" data-nav="rate-limits">Rate Limits</a>.</p>` },
    { h: "File format", body: `<p>Each master file is a compressed, delimited text file — one row per instrument — refreshed daily before market open to reflect new listings, expiries, and corporate actions. Typical columns include:</p>
    <table class="param-table">
      <tr><th>Column</th><th>Description</th></tr>
      <tr><td><code>Exchange</code></td><td>Segment code — see <a href="#" data-nav="exchange-segment-codes">Exchange Segment Codes</a>.</td></tr>
      <tr><td><code>Token</code></td><td>Unique numeric instrument identifier, used in <a href="#" data-nav="subscribe-market-feed">WebSocket subscriptions</a> in place of the trading symbol.</td></tr>
      <tr><td><code>Symbol</code> / <code>TradingSymbol</code></td><td>Human-readable symbol used in order and quote payloads (<code>tsym</code>).</td></tr>
      <tr><td><code>Instrument</code></td><td>Instrument type — equity, futures, options, index.</td></tr>
      <tr><td><code>Expiry</code></td><td>Contract expiry date, for derivatives only.</td></tr>
      <tr><td><code>StrikePrice</code></td><td>Option strike, for options only.</td></tr>
      <tr><td><code>LotSize</code></td><td>Minimum tradable quantity for derivatives contracts.</td></tr>
      <tr><td><code>TickSize</code></td><td>Minimum price increment for the instrument.</td></tr>
    </table>` },
    { h: "Best practices", body: `<ul>
      <li>Re-download the master file at the start of each trading day — tokens can be reassigned across expiries, especially for weekly options.</li>
      <li>Build a local symbol-to-token index at startup rather than re-parsing the file on every lookup.</li>
      <li>Always subscribe to <a href="#" data-nav="subscribe-market-feed">market data</a> using <code>Token</code>, not <code>Symbol</code> — the WebSocket feed keys off the numeric token.</li>
      <li>Cross-check <code>LotSize</code> from the master file rather than hardcoding it, since exchange-mandated lot sizes change periodically for F&O contracts.</li>
    </ul>` },
    { h: "Related", body: `<p>See <a href="#" data-nav="search-scrip">Search Scrip</a> for on-demand single-instrument lookups, and <a href="#" data-nav="subscribe-market-feed">Subscribe to Market Feed</a> for how tokens are used once resolved.</p>` },
  ],
},


// symbol master


  "symbol-master": {
  badge: null,
  desc: "Downloadable symbol master files for every exchange segment — the reference list of tradable instruments, tokens, and contract details used to resolve symbols before placing orders.",
  sections: [
    { h: "Overview", body: `<p>Symbol master files are periodically updated <code>.zip</code> archives containing a plain-text list of all tradable instruments for a given exchange segment — trading symbol, token, lot size, tick size, expiry, strike, and other contract metadata. Download and parse the relevant file(s) for the segments you trade on, and refresh them regularly (at minimum daily, and always after a expiry/contract rollover) since tokens and available contracts change over time.</p>
    <p>All files are served from the API root: <code>https://api.shoonya.com</code></p>` },
    { h: "Available symbol masters", body: `
    <table class="param-table">
      <tr><th>Segment</th><th>Download</th></tr>
      <tr><td>NSE - Capital Market</td><td><a href="https://api.shoonya.com/NSE_symbols.txt.zip" target="_blank" rel="noopener">NSE_symbols.txt.zip</a></td></tr>
      <tr><td>NSE - Equity Derivatives</td><td><a href="https://api.shoonya.com/NFO_symbols.txt.zip" target="_blank" rel="noopener">NFO_symbols.txt.zip</a></td></tr>
      <tr><td>NSE - Currency Derivatives</td><td><a href="https://api.shoonya.com/CDS_symbols.txt.zip" target="_blank" rel="noopener">CDS_symbols.txt.zip</a></td></tr>
      <tr><td>MCX - Commodity</td><td><a href="https://api.shoonya.com/MCX_symbols.txt.zip" target="_blank" rel="noopener">MCX_symbols.txt.zip</a></td></tr>
      <tr><td>BSE - Capital Market</td><td><a href="https://api.shoonya.com/BSE_symbols.txt.zip" target="_blank" rel="noopener">BSE_symbols.txt.zip</a></td></tr>
      <tr><td>BSE - Equity Derivative Segment</td><td><a href="https://api.shoonya.com/BFO_symbols.txt.zip" target="_blank" rel="noopener">BFO_symbols.txt.zip</a></td></tr>
      </table>` },
    { h: "Usage notes", body: `<ul>
      <li>Each archive extracts to a pipe/comma-delimited <code>.txt</code> file — check the header row of the extracted file for the exact column order per segment, as it can vary slightly between segments.</li>
      <li>Cache the parsed symbol master locally (e.g. in a local DB or in-memory map keyed by token) rather than re-downloading on every request.</li>
      <li>Re-download at the start of each trading day, and additionally whenever you hit an unknown-token or invalid-symbol error mid-session.</li>
      <li>Only download the segment(s) you actually trade — the derivatives files (NFO/BFO/CDS) are significantly larger than the cash-market files.</li>
    </ul>` },
  ],
},

// Glossary
"glossary": {
  badge: null,
  desc: "Definitions for terms and field names used throughout the Shoonya API documentation.",
  sections: [
    { h: "A–J", body: `
    <table class="param-table">
      <tr><th>Term</th><th>Definition</th></tr>
      <tr><td>Algo ID</td><td>Exchange-issued identifier tagged to every order placed via an algorithmic strategy, per SEBI's Algo ID framework. See <a href="#" data-nav="algo-compliance">SEBI Algo ID Framework</a>.</td></tr>
      <tr><td>AMO</td><td>After Market Order — an order placed outside trading hours, queued for submission at the next session open.</td></tr>
      <tr><td>BOD</td><td>Beginning of Day — the daily system reset during which session tokens are flushed and the instrument master is refreshed.</td></tr>
      <tr><td>CNC</td><td>Cash and Carry — a delivery-based product type for equity holdings taken beyond the trading day.</td></tr>
      <tr><td>Disclosed Quantity</td><td>The portion of a large order's quantity shown publicly in the order book, while the remainder stays hidden.</td></tr>
      <tr><td>EOD</td><td>End of Day — historical daily-bar data, as opposed to intraday tick or candle data.</td></tr>
      <tr><td>GTT</td><td>Good Till Triggered — a conditional order that remains dormant until a specified trigger price is reached.</td></tr>
      <tr><td>jData</td><td>The single JSON-encoded form field used to carry the request payload for most Shoonya REST endpoints (see <a href="#" data-nav="api-structure">API Structure</a>).</td></tr>
      <tr><td>OAuth</td><td>The token-based authentication flow used for all Shoonya API access — see <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a>. Requests are authenticated via an <code>Authorization: Bearer</code> header rather than a <code>jKey</code> field.</td></tr>
    </table>` },
    { h: "K–R", body: `
    <table class="param-table">
      <tr><th>Term</th><th>Definition</th></tr>
      <tr><td>LTP</td><td>Last Traded Price — the most recent execution price for an instrument.</td></tr>
      <tr><td>MIS</td><td>Margin Intraday Square-off — a leveraged intraday product type, auto-squared-off before close.</td></tr>
      <tr><td>NRML</td><td>Normal — the standard carry-forward product type for F&O positions.</td></tr>
      <tr><td>OHLC</td><td>Open, High, Low, Close — the four core price points for a given period.</td></tr>
      <tr><td>OPS</td><td>Orders Per Second — the SEBI-defined threshold (10/sec) separating regular API use from mandatory algo registration. See <a href="#" data-nav="rate-limits">Rate Limits</a>.</td></tr>
      <tr><td>Postback</td><td>A server-initiated HTTP callback notifying your endpoint of an order status change. See <a href="#" data-nav="postback-webhook">Postback / Webhook</a>.</td></tr>
      <tr><td>RMS</td><td>Risk Management System — the exchange/broker-side engine enforcing margin, exposure, and fat-finger checks. See <a href="#" data-nav="risk-management">Risk Management (RMS)</a>.</td></tr>
    </table>` },
    { h: "S–Z", body: `
    <table class="param-table">
      <tr><th>Term</th><th>Definition</th></tr>
      <tr><td>SL-LMT / SL-MKT</td><td>Stop Loss Limit / Stop Loss Market — trigger-based order types. See <a href="#" data-nav="order-type-codes">Order Type Codes</a>.</td></tr>
      <tr><td>tsym</td><td>Trading symbol — the human-readable instrument identifier used in order and quote payloads.</td></tr>
      <tr><td>Token</td><td>The numeric instrument identifier used for WebSocket subscriptions in place of <code>tsym</code>. See <a href="#" data-nav="instrument-token-list">Instrument Token List</a>.</td></tr>
      <tr><td>WSAPI</td><td>The WebSocket gateway prefix used for the OAuth flow (<code>wss://api.shoonya.com/NorenWSAPI/</code>), paired with <code>NorenWClientAPI</code> for REST calls. See <a href="#" data-nav="websocket-overview">WebSocket Overview</a>.</td></tr>
    </table>` },
  ],
},



};

// ---------- helpers used above ----------
//
// NOTE: these blocks are rendered via innerHTML, so `<script>` tags and
// inline `onclick="..."` attributes never execute in a browser (they're
// inert once parsed out of an innerHTML string, and the referenced global
// functions — copyCode/switchTab — don't exist anywhere in app.js).
// All interactivity is wired up in app.js via event delegation on
// `data-copy-target` (copy) and `data-group`/`data-lang` (tabs) instead.
// Do NOT reintroduce onclick="..." here — it will silently no-op.

function nextCodeBlockId() {
  // State lives on the function object itself (not a separate top-level
  // `var`) because `codeBlock()`/`codeTabs()` are invoked while the
  // `PAGE_CONTENT` object literal above is still being evaluated — at
  // that point a `var` declared further down the file would be hoisted
  // but NOT yet initialized (classic var-hoisting trap), producing
  // "cbNaN" ids. Function declarations, by contrast, are hoisted whole,
  // so attaching the counter here works regardless of where in the file
  // this runs relative to its first call.
  nextCodeBlockId._seq = (nextCodeBlockId._seq || 0) + 1;
  return "cb" + nextCodeBlockId._seq.toString(36);
}

function copyButtonHtml(targetId) {
  return `<button type="button" class="copy-btn" data-copy-target="${targetId}" aria-label="Copy code to clipboard">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15V5a2 2 0 012-2h10" stroke="currentColor" stroke-width="2"/></svg>
        <span>Copy</span>
      </button>`;
}

function codeBlock(lang, code) {
  const id = nextCodeBlockId();
  return `<div class="code-block">
    <div class="code-label">${escapeHtml(lang)}</div>
    <div class="code-body">
      ${copyButtonHtml(id)}
      <pre><code id="${id}" class="language-${escapeHtml(lang)}">${escapeHtml(code)}</code></pre>
    </div>
  </div>`;
}

function codeTabs(groupId, langs) {
  const order = ["python", "javascript", "curl"];
  const label = { python: "Python", javascript: "JavaScript", curl: "cURL" };
  const hljsLang = { python: "python", javascript: "javascript", curl: "bash" };
  let tabs = "", panels = "";
  let firstActiveSet = false;
  order.forEach((l) => {
    if (!langs[l]) return;
    const active = !firstActiveSet;
    firstActiveSet = true;
    tabs += `<button type="button" class="code-tab ${active ? "active" : ""}" data-group="${groupId}" data-lang="${l}" role="tab" aria-selected="${active}">${label[l]}</button>`;
    const codeId = `${groupId}-${l}`;
    panels += `<div class="code-panel ${active ? "active" : ""}" data-group="${groupId}" data-lang="${l}">
      <div class="code-body">
        ${copyButtonHtml(codeId)}
        <pre><code id="${codeId}" class="language-${hljsLang[l]}">${escapeHtml(langs[l])}</code></pre>
      </div>
    </div>`;
  });
  return `<div class="code-block"><div class="code-tabs" role="tablist">${tabs}</div>${panels}</div>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
