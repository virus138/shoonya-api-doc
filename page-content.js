
const PAGE_CONTENT = {

  // ---------- A. GETTING STARTED ----------
  "introduction": {
    badge: null,
    desc: "What the Shoonya API is, who it's for, and how this documentation is organized.",
    sections: [
      { h: "Overview", body: `<p>The Shoonya API gives you programmatic access to trading, market data and account information on the Shoonya platform. It's the same API surface that powers the Shoonya web and mobile apps, exposed for algo trading, custom terminals, and vendor integrations.</p>` },
      { h: "Purpose", body: `<p>Use this documentation to authenticate a session, place and manage orders, stream live market data, and reconcile positions and holdings — whether you're building a retail strategy runner or a full vendor integration for other traders.</p>
      <div class="card-grid">
        <div class="mini-card"><div class="k">Base URL</div><div class="v">api.shoonya.com</div></div>
        <div class="mini-card"><div class="k">Protocols</div><div class="v">REST + WebSocket</div></div>
        <div class="mini-card"><div class="k">Auth</div><div class="v">TOTP / OAuth 2.0</div></div>
        <div class="mini-card"><div class="k">Formats</div><div class="v">JSON</div></div>
      </div>` },
      { h: "How this documentation is organized", body: `
      <ul>
        <li><b>Getting Started</b> — environment setup, first request, error and rate-limit conventions.</li>
        <li><b>Authentication</b> — TOTP login, OAuth for vendors, token renewal.</li>
        <li><b>Trading APIs</b> — order placement, modification, book and position endpoints.</li>
        <li><b>Market Data APIs</b> — quotes, depth, historical candles, option chain.</li>
        <li><b>Streaming</b> — WebSocket feeds for ticks and order updates.</li>
        <li><b>SDK Reference</b> — official Python SDK and code samples.</li>
        <li><b>Annexure</b> — every code and enum used across the API in one place.</li>
      </ul>` },
      { h: "Best practices", body: `<ul><li>Read <a href="#" data-nav="rate-limits">Rate Limits</a> before writing any polling loop.</li><li>Use the WebSocket feed for live prices — don't poll Market Quotes in a tight loop.</li><li>Store your session token securely and never commit it to source control.</li></ul>` },
      { h: "Notes", body: `<p>This page is the front door for new integrators. Every other page assumes you've completed <a href="#" data-nav="quick-start">Quick Start</a> first.</p>` },
    ],
  },

  "quick-start": {
    badge: null,
    desc: "Go from zero to your first authenticated API call in under five minutes.",
    sections: [
      { h: "Overview", body: `<p>This walkthrough gets a single-user script talking to Shoonya end to end: log in with TOTP, fetch a quote, and place one order. It assumes you already have a Shoonya trading account and API access enabled — if not, see <a href="#" data-nav="prerequisites">Prerequisites</a> first.</p>` },
      { h: "1. Install the SDK", body: `${codeBlock("bash", `pip install NorenRestApiOAuth`)}` },
      { h: "2. Install the Requirements", body: `${codeBlock("bash", `pip install -r requirements.txt`)}` },
      { h: "2. Authenticate", body: `<p>Retail scripts should use TOTP login, not OAuth — OAuth is for vendor apps with multiple end users. See <a href="#" data-nav="auto-login-totp">Auto Login (TOTP)</a> for the full parameter reference.</p>${codeBlock("python", `import os
from NorenRestApiPy.NorenApi import NorenApi

client = ShoonyaClient(
    CLIENT_ID   = os.environ["SHOONYA_CLIENT_ID"],
    USER_ID     = os.environ["SHOONYA_USER_ID"],
    PASSWORD    = os.environ["SHOONYA_PASSWORD"],
    TOTP_SECRET = os.environ["SHOONYA_TOTP_SECRET"],
    SECRET_CODE = os.environ["SHOONYA_SECRET_CODE"],
)
session = client.login()
print("Logged in:", session.Acesstoken)`)}` },
      { h: "3. Fetch a quote", body: `${codeBlock("python", `quote = client.get_quote(exchange="NSE", token="2885")
print(quote.tsym, quote.lp)`)}` },
      { h: "4. Place your first order", body: `${codeBlock("python", `order = client.place_order(
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
    desc: "The three ways to authenticate against Shoonya, and which one fits your use case.",
    sections: [
      { h: "Overview", body: `<p>Every Shoonya API call runs against an authenticated session. Shoonya issues a <code>Acesstoken</code> after a successful login, which you attach to every subsequent request. There is no separate long-lived API key model — the token itself is your credential for the trading day.</p>` },
      { h: "Which flow should I use?", body: `
      <div class="card-grid">
        <div class="mini-card"><div class="k">Personal script or bot</div><div class="v">Auto Login (TOTP) — see <a href="#" data-nav="auto-login-totp">guide</a></div></div>
        <div class="mini-card"><div class="k">Vendor app, many end users</div><div class="v">Manual Login (OAuth) — see <a href="#" data-nav="manual-login-oauth">guide</a></div></div>
        <div class="mini-card"><div class="k">Session refresh mid-day</div><div class="v"><a href="#" data-nav="token-renewal">Token Renewal</a></div></div>
        <div class="mini-card"><div class="k">Ending a session</div><div class="v"><a href="#" data-nav="logout">Logout</a></div></div>
      </div>` },
      { h: "Session lifetime", body: `<p>Sessions are valid for the trading day and are invalidated at the daily server reset, regardless of activity. Build your automation to re-authenticate once per day rather than assuming a persistent long-running token.</p>
      <div class="callout"><b>Convention</b>Every endpoint in this documentation that requires auth expects the token as a Bearer header: <code>Authorization: Bearer &lt;Acesstoken&gt;</code>.</div>` },
      { h: "Security notes", body: `<ul>
        <li>Never hardcode <code>password</code>, <code>totp_secret</code>, or <code>api_secret</code> in source control — load them from environment variables or a secrets manager.</li>
        <li>Treat <code>Acesstoken</code> as a bearer credential with the same sensitivity as a password: don't log it, don't put it in error messages sent to third-party monitoring tools.</li>
        <li>If you suspect a token has leaked, call <a href="#" data-nav="logout">Logout</a> immediately to invalidate the session rather than waiting for the daily reset.</li>
      </ul>` },
      { h: "Notes", body: `<p>OAuth-specific security considerations (state parameter, PKCE, redirect URI validation) are covered on <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a>.</p>` },
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
        <tr><td>Order placement / modify / cancel</td><td>~10 req/sec, burst-limited</td><td>Applies per user, across <a href="#" data-nav="place-order">Place</a>, <a href="#" data-nav="modify-order">Modify</a>, <a href="#" data-nav="cancel-order">Cancel</a>.</td></tr>
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

  // ---------- B. AUTHENTICATION ----------
  "totp-setup-guide": {
    badge: null,
    desc: "Enroll TOTP-based two-factor authentication on your account so scripts can log in without manual OTP entry.",
    sections: [
      { h: "Overview", body: `<p>Shoonya's programmatic login replaces the SMS/app OTP step with a TOTP (Time-based One-Time Password) secret, the same standard used by Google Authenticator. Once enrolled, your script generates the current OTP locally instead of waiting on an SMS.</p>` },
      { h: "Enrollment steps", body: `<ol>
        <li>Log in to the Shoonya web terminal and open <b>Profile → API & Automation → TOTP Setup</b>.</li>
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
    badge: { method: "POST", path: "/NorenWClientAPI/QuickAuth" },
    desc: "Log in programmatically using your password and a generated TOTP code — the standard flow for personal scripts, bots, and terminals.",
    sections: [
      { h: "Overview", body: `<p>Auto Login authenticates directly with your account credentials plus a live TOTP code, returning a <code>Acesstoken</code> valid for the trading day. This is the flow almost every single-user integration should use.</p>` },
      { h: "Purpose", body: `<p>Use this for anything running under your own identity — a strategy engine, a personal dashboard, a backtest runner that also trades live. If you're building a product that logs in <i>other</i> people's accounts, use <a href="#" data-nav="manual-login-oauth">Manual Login (OAuth)</a> instead.</p>` },
      { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td>uid</td><td>string</td><td><span class="req-tag">required</span></td><td>Your Shoonya user ID.</td></tr>
        <tr><td>pwd</td><td>string</td><td><span class="req-tag">required</span></td><td>SHA-256 hash of your account password.</td></tr>
        <tr><td>factor2</td><td>string</td><td><span class="req-tag">required</span></td><td>Current 6-digit TOTP code — see <a href="#" data-nav="totp-setup-guide">TOTP Setup Guide</a>.</td></tr>
        <tr><td>vc</td><td>string</td><td><span class="req-tag">required</span></td><td>Vendor code assigned at API onboarding.</td></tr>
        <tr><td>appkey</td><td>string</td><td><span class="req-tag">required</span></td><td>SHA-256 of <code>uid|api_secret</code>.</td></tr>
        <tr><td>imei</td><td>string</td><td><span class="req-tag">required</span></td><td>Any stable device identifier string for the session.</td></tr>
      </table>` },
      { h: "Request example", body: `${codeTabs("totp-req", {
        python: `import requests, hashlib, pyotp

pwd_hash = hashlib.sha256(PASSWORD.encode()).hexdigest()
appkey_hash = hashlib.sha256(f"{UID}|{API_SECRET}".encode()).hexdigest()
totp_code = pyotp.TOTP(TOTP_SECRET).now()

payload = {
    "uid": UID, "pwd": pwd_hash, "factor2": totp_code,
    "vc": VENDOR_CODE, "appkey": appkey_hash, "imei": "abc1234",
}
resp = requests.post("https://api.shoonya.com/NorenWClientAPI/QuickAuth", json=payload)
print(resp.json())`,
        javascript: `const crypto = require("crypto");
const { authenticator } = require("otplib");

const pwdHash = crypto.createHash("sha256").update(password).digest("hex");
const appkeyHash = crypto.createHash("sha256").update(\`\${uid}|\${apiSecret}\`).digest("hex");
const totpCode = authenticator.generate(totpSecret);

const res = await fetch("https://api.shoonya.com/NorenWClientAPI/QuickAuth", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ uid, pwd: pwdHash, factor2: totpCode, vc: vendorCode, appkey: appkeyHash, imei: "abc1234" }),
});
console.log(await res.json());`,
        curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/QuickAuth \\
  -H "Content-Type: application/json" \\
  -d '{"uid":"AB1234","pwd":"SHA256_PWD","factor2":"123456","vc":"AB1234_U","appkey":"SHA256_APPKEY","imei":"abc1234"}'`,
      })}` },
      { h: "Response example", body: `${codeBlock("json", `{
  "stat": "Ok",
  "Acesstoken": "e1b2c3d4e5f6...",
  "uid": "AB1234",
  "actid": "AB1234",
  "email": "user@example.com"
}`)}` },
      { h: "Error handling", body: `
      <div class="callout error"><b>Common failure</b>An invalid <code>factor2</code> is almost always a clock-drift issue between the machine generating the TOTP and the server, or a stale/reused code — always regenerate the code immediately before the request rather than caching it.</div>
      <table class="param-table">
        <tr><th>Code</th><th>Meaning</th></tr>
        <tr><td>Invalid_Input</td><td>Malformed hash or missing field.</td></tr>
        <tr><td>Invalid_Otp</td><td>TOTP code incorrect or expired — regenerate and retry.</td></tr>
      </table>` },
      { h: "Best practices", body: `<ul><li>Generate <code>factor2</code> immediately before sending the request — TOTP codes are only valid for a short window.</li><li>Run login once per day at process start rather than re-authenticating on every restart of a supervised process.</li></ul>` },
      { h: "Python example", body: `${codeBlock("python", `from shoonya_api import ShoonyaClient

client = ShoonyaClient(
    userid=UID, password=PASSWORD, totp_secret=TOTP_SECRET,
    vendor_code=VENDOR_CODE, api_secret=API_SECRET, imei="abc1234",
)
session = client.login()
print(session.Acesstoken)`)}` },
      { h: "Notes", body: `<p>Field names shown follow common NorenOMS conventions — confirm exact casing against your account's onboarding packet before going to production.</p>` },
    ],
  },

  "manual-login-oauth": {
    badge: { method: "POST", path: "/NorenWClientAPI/QuickAuth" },
    desc: "Exchange a partner OAuth authorization code for a Shoonya session token — the flow used by vendors and third-party apps.",
    sections: [
      { h: "Overview", body: `<p>Manual login via OAuth lets a partner application authenticate a user without ever handling their raw Shoonya password. The user authorizes your app on Shoonya's domain; your backend exchanges the resulting code for a session token.</p>` },
      { h: "Purpose", body: `<p>Use this flow for any vendor or partner integration where end users log in through your product. For your own single-user bot or terminal, prefer <a href="#" data-nav="auto-login-totp">Auto Login (TOTP)</a> instead — it's simpler and doesn't require a registered redirect URI.</p>` },
      { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td>apikey</td><td>string</td><td><span class="req-tag">required</span></td><td>Your registered vendor API key.</td></tr>
        <tr><td>request_code</td><td>string</td><td><span class="req-tag">required</span></td><td>Authorization code returned to your redirect URI after user consent.</td></tr>
        <tr><td>signature</td><td>string</td><td><span class="req-tag">required</span></td><td>SHA-256 of <code>apikey|request_code|api_secret</code>.</td></tr>
      </table>` },
      { h: "Request example", body: `${codeTabs("oauth-req", {
        python: `import requests, hashlib

payload = {
    "apikey": API_KEY,
    "request_code": request_code,
    "signature": hashlib.sha256(
        f"{API_KEY}|{request_code}|{API_SECRET}".encode()
    ).hexdigest(),
}

resp = requests.post(
    "https://api.shoonya.com/NorenWClientAPI/QuickAuth",
    json=payload,
)
print(resp.json())`,
        javascript: `const crypto = require("crypto");

const signature = crypto
  .createHash("sha256")
  .update(\`\${apiKey}|\${requestCode}|\${apiSecret}\`)
  .digest("hex");

const res = await fetch("https://api.shoonya.com/NorenWClientAPI/QuickAuth", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ apikey: apiKey, request_code: requestCode, signature }),
});
console.log(await res.json());`,
        curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/QuickAuth \\
  -H "Content-Type: application/json" \\
  -d '{"apikey":"YOUR_KEY","request_code":"CODE","signature":"SHA256_SIGNATURE"}'`,
      })}` },
      { h: "Response example", body: `${codeBlock("json", `{
  "stat": "Ok",
  "Acesstoken": "e1b2c3d4e5f6...",
  "actid": "AB1234",
  "uname": "Trader Name",
  "email": "user@example.com"
}`)}` },
      { h: "Error handling", body: `
      <div class="callout error"><b>Common failure</b>Signature mismatch — usually caused by hashing the fields in the wrong order or using a stale <code>request_code</code>, which expires within minutes of issuance.</div>
      <table class="param-table">
        <tr><th>Code</th><th>Meaning</th></tr>
        <tr><td>Invalid_Input</td><td>Missing or malformed field in the request body.</td></tr>
        <tr><td>Session_Expired</td><td>request_code was already used or has expired — restart the authorization flow.</td></tr>
      </table>` },
      { h: "Best practices", body: `<ul><li>Generate the signature server-side only — never expose <code>api_secret</code> to a browser or mobile client.</li><li>Treat <code>Acesstoken</code> as a bearer credential: store it encrypted, rotate it via <a href="#" data-nav="token-renewal">Token Renewal</a>, never log it.</li></ul>` },
      { h: "Python example", body: `${codeBlock("python", `from shoonya_oauth import ShoonyaOAuthClient

client = ShoonyaOAuthClient(api_key=API_KEY, api_secret=API_SECRET)
session = client.exchange_code(request_code)
print(session.Acesstoken)`)}` },
      { h: "Notes", body: `<p>This endpoint is specific to <a href="#" data-nav="vendors-partners">vendor / partner</a> integrations. Field names shown are illustrative — confirm exact parameter casing against your vendor onboarding packet.</p>` },
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
        <tr><td><b>Payload</b></td><td><code>jData=&lt;JSON payload&gt;&amp;jKey=&lt;AccessToken&gt;</code> — requires a valid <code>AccessToken</code> from <a href="#" data-nav="login">Login</a>.</td></tr>
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
          <td>Must exist in <a href="#" data-nav="instrument-master">Instrument Master</a></td>
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
      <li>Validate <code>tsym</code> against a freshly-fetched <a href="#" data-nav="instrument-master">Instrument Master</a> immediately before placing F&O orders — don't cache symbols across expiries.</li>
    </ul>` },

  ],
},





  "positions": {
    badge: { method: "POST", path: "/NorenWClientAPI/PositionBook" },
    desc: "Fetch net open positions across all products and exchanges for the logged-in account.",
    sections: [
      { h: "Overview", body: `<p>Positions returns your net quantity, average price, and realized/unrealized P&L for every instrument you currently hold or have traded intraday — the same view backing the Positions tab in the Shoonya terminal.</p>` },
      { h: "Purpose", body: `<p>Use this for reconciliation at strategy startup and for periodic risk checks (net exposure, live P&L). For a strategy that needs to react to fills in real time, drive state changes from <a href="#" data-nav="order-update-feed">Order Update Feed</a> and use this endpoint only to reconcile, not as your primary event source.</p>` },
      { h: "Parameters", body: `
      <table class="param-table">
        <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
        <tr><td>uid</td><td>string</td><td><span class="req-tag">required</span></td><td>User ID of the logged-in account.</td></tr>
        <tr><td>actid</td><td>string</td><td><span class="req-tag">required</span></td><td>Account ID to fetch positions for.</td></tr>
      </table>` },
      { h: "Request example", body: `${codeTabs("positions-req", {
        python: `import requests

headers = {"Authorization": f"Bearer {Acesstoken}"}
resp = requests.post("https://api.shoonya.com/NorenWClientAPI/PositionBook",
                      json={"uid": "AB1234", "actid": "AB1234"}, headers=headers)
print(resp.json())`,
        javascript: `const res = await fetch("https://api.shoonya.com/NorenWClientAPI/PositionBook", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: \`Bearer \${Acesstoken}\` },
  body: JSON.stringify({ uid: "AB1234", actid: "AB1234" }),
});
console.log(await res.json());`,
        curl: `curl -X POST https://api.shoonya.com/NorenWClientAPI/PositionBook \\
  -H "Authorization: Bearer $ACESSTOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"uid":"AB1234","actid":"AB1234"}'`,
      })}` },
      { h: "Response example", body: `${codeBlock("json", `[
  {
    "tsym": "RELIANCE-EQ",
    "netqty": "1",
    "netavgprc": "2934.60",
    "rpnl": "0.00",
    "urmtom": "12.40",
    "prd": "I"
  }
]`)}` },
      { h: "Error handling", body: `<table class="param-table">
        <tr><th>Code</th><th>Meaning</th></tr>
        <tr><td>Session_Expired</td><td>Token invalid or expired.</td></tr>
      </table>` },
      { h: "Best practices", body: `<ul><li>Sum <code>rpnl</code> + <code>urmtom</code> for total P&L per instrument — don't rely on either field alone.</li><li>Reconcile positions against your local strategy state at startup and after any reconnect; never assume in-memory state survived a restart.</li></ul>` },
      { h: "Python example", body: `${codeBlock("python", `from shoonya_api import ShoonyaClient

client = ShoonyaClient(session_token=Acesstoken)
positions = client.get_positions()
total_pnl = sum(float(p.rpnl) + float(p.urmtom) for p in positions)
print("Total P&L:", total_pnl)`)}` },
      { h: "Notes", body: `<p>Use <a href="#" data-nav="product-conversion">Product Conversion</a> to move a position between intraday and delivery products without squaring off and re-entering.</p>` },
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
        <tr><td>token</td><td>string</td><td><span class="req-tag">required</span></td><td>Instrument token from <a href="#" data-nav="instrument-master">Instrument Master</a>.</td></tr>
      </table>` },
      { h: "Request example", body: `${codeTabs("quotes-req", {
        python: `import requests

params = {"exch": "NSE", "token": "2885"}
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
      { h: "Best practices", body: `<ul><li>Cache the chain per underlying+expiry for the session — strikes and tokens don't change intraday, only prices do.</li><li>Use <a href="#" data-nav="expiry-data">Expiry Data</a> first to confirm the exact expiry string format before requesting the chain.</li></ul>` },
      { h: "Python example", body: `${codeBlock("python", `from shoonya_api import ShoonyaClient

client = ShoonyaClient(session_token=Acesstoken)
chain = client.get_option_chain(exchange="NFO", symbol="NIFTY", strike=24000, count=10)
atm_ce = next(c for c in chain if c.strprc == 24000 and c.optt == "CE")
print(atm_ce.tsym, atm_ce.lp, atm_ce.oi)`)}` },
      { h: "Notes", body: `<p><code>oi</code> (open interest) updates less frequently than <code>lp</code> — don't assume both fields refresh on the same cadence when building OI-based signals.</p>` },
    ],
  },

  // ---------- E. STREAMING ----------
  "websocket-overview": {
    badge: { method: "WS", path: "wss://api.shoonya.com/NorenWSAPI/" },
    desc: "How the Shoonya WebSocket feed is structured, and when to use it instead of REST polling.",
    sections: [
      { h: "Overview", body: `<p>The WebSocket gateway delivers two independent feed types over one connection: live market ticks and order-status updates. You subscribe to each separately after connecting and authenticating the socket.</p>` },
      { h: "Purpose", body: `<p>Use the WebSocket for anything that needs to react to price movement or fills in real time — strategy engines, live dashboards, risk monitors. It replaces polling <a href="#" data-nav="market-quotes">Market Quotes</a> or <a href="#" data-nav="order-book">Order Book</a> in a loop.</p>` },
      { h: "Connection flow", body: `<ol>
        <li>Open a WebSocket connection to <code>wss://api.shoonya.com/NorenWSAPI/</code>.</li>
        <li>Send a connect frame containing your <code>uid</code> and <code>Acesstoken</code>.</li>
        <li>On acknowledgment, send subscribe frames for the touchline (<a href="#" data-nav="subscribe-market-feed">market feed</a>) and/or order updates.</li>
        <li>Handle incoming ticks; respond to server pings to keep the session alive.</li>
      </ol>` },
      { h: "Request example", body: `${codeTabs("ws-req", {
        python: `import websocket, json

def on_open(ws):
    ws.send(json.dumps({"t": "c", "uid": UID, "Acesstoken": Acesstoken}))

def on_message(ws, message):
    print(json.loads(message))

ws = websocket.WebSocketApp(
    "wss://api.shoonya.com/NorenWSAPI/",
    on_open=on_open, on_message=on_message,
)
ws.run_forever()`,
        javascript: `const ws = new WebSocket("wss://api.shoonya.com/NorenWS/");

ws.onopen = () => ws.send(JSON.stringify({ t: "c", uid, Acesstoken }));
ws.onmessage = (event) => console.log(JSON.parse(event.data));`,
        curl: `# WebSocket connections aren't expressible in cURL —
# use \`websocat\` for a quick command-line test:
websocat wss://api.shoonya.com/NorenWSTP/`,
      })}` },
      { h: "Response example", body: `${codeBlock("json", `{ "t": "ck", "s": "OK" }`)}` },
      { h: "Error handling", body: `<div class="callout warn"><b>Disconnects</b>The gateway will drop idle connections. Implement exponential-backoff reconnect logic and re-send your subscriptions after every reconnect — subscriptions do not persist across a dropped socket.</div>` },
      { h: "Best practices", body: `<ul><li>Run one WebSocket connection per process; multiplex symbols over it rather than opening one socket per instrument.</li><li>Process incoming ticks on a separate thread/queue from your order-placement logic so a slow strategy calculation never blocks the read loop.</li></ul>` },
      { h: "Python example", body: `${codeBlock("python", `from shoonya_api import ShoonyaFeed

feed = ShoonyaFeed(uid=UID, session_token=Acesstoken)
feed.on_tick = lambda tick: print(tick.token, tick.ltp)
feed.connect()
feed.subscribe(["NSE|2885"])`)}` },
      { h: "Notes", body: `<p>See <a href="#" data-nav="subscribe-market-feed">Subscribe to Market Feed</a> and <a href="#" data-nav="order-update-feed">Order Update Feed</a> for the exact frame formats of each subscription type.</p>` },
    ],
  },

  // ---------- F. SDK REFERENCE ----------
  "python-sdk": {
    badge: null,
    desc: "Install and use the official Python SDK for authentication, trading, and streaming.",
    sections: [
      { h: "Overview", body: `<p>The Python SDK wraps the REST and WebSocket surface into a typed client, handling session headers, retries, and tick parsing so you don't hand-build raw HTTP requests.</p>` },
      { h: "Purpose", body: `<p>Recommended for anything beyond a quick script — production strategy engines, backtesting harnesses, and internal tools should build on the SDK rather than the raw endpoints directly.</p>` },
      { h: "Installation", body: `${codeBlock("bash", `pip install shoonya-api`)}` },
      { h: "Request example", body: `${codeTabs("sdk-req", {
        python: `from shoonya_api import ShoonyaClient

client = ShoonyaClient(session_token=Acesstoken)
positions = client.get_positions()
for p in positions:
    print(p.symbol, p.net_qty, p.pnl)`,
        javascript: `// JavaScript SDK is planned — see the
// JavaScript SDK (Planned) page for status.`,
        curl: `# The SDK wraps HTTP calls — see individual endpoint
# pages in Trading APIs / Market Data APIs for raw cURL equivalents.`,
      })}` },
      { h: "Response example", body: `${codeBlock("json", `[
  { "symbol": "RELIANCE-EQ", "net_qty": 1, "pnl": "12.40" }
]`)}` },
      { h: "Error handling", body: `<p>The SDK raises typed exceptions (<code>AuthError</code>, <code>RateLimitError</code>, <code>OrderRejectedError</code>) instead of returning raw <code>stat: Not_Ok</code> payloads — wrap calls in a <code>try/except</code> for the specific exception you expect.</p>` },
      { h: "Best practices", body: `<ul><li>Pin the SDK version in your <code>requirements.txt</code> — check <a href="#" data-nav="changelog">Changelog</a> before upgrading in production.</li><li>Reuse a single <code>ShoonyaClient</code> instance per process; it manages connection pooling internally.</li></ul>` },
      { h: "Python example", body: `${codeBlock("python", `from shoonya_api import ShoonyaClient

client = ShoonyaClient.from_env()  # reads SHOONYA_TOKEN from environment
order = client.place_order(exchange="NSE", symbol="RELIANCE-EQ", qty=1,
                            order_type="MKT", side="BUY", product="I")
print(order.order_id)`)}` },
      { h: "Notes", body: `<p>Source and issue tracker live on GitHub — see the link in the top bar.</p>` },
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

  // ---------- G. ANNEXURE ----------
  "error-code-reference": {
    badge: null,
    desc: "Every error code returned across the Shoonya API, what it means, and how to resolve it.",
    sections: [
      { h: "Overview", body: `<p>All REST endpoints return <code>stat: "Not_Ok"</code> on failure along with an <code>emsg</code> string. This page maps the common <code>emsg</code> patterns to their cause and fix.</p>` },
      { h: "Purpose", body: `<p>Use this as the single lookup table for error handling logic across every integration — link to a specific row instead of duplicating error explanations on each endpoint page.</p>` },
      { h: "Reference table", body: `
      <table class="param-table">
        <tr><th>Code</th><th>Category</th><th>Meaning</th><th>Resolution</th></tr>
        <tr><td>Session_Expired</td><td>Auth</td><td>Token invalid or timed out.</td><td>Re-authenticate.</td></tr>
        <tr><td>Invalid_Input</td><td>Validation</td><td>A required field is missing or malformed.</td><td>Check parameter table on the specific endpoint.</td></tr>
        <tr><td>Not_Ok</td><td>Business rule</td><td>Request reached the server but was rejected.</td><td>Read <code>emsg</code> for the exact reason (margin, RMS, circuit).</td></tr>
        <tr><td>Rate_Limited</td><td>Throttling</td><td>Too many requests in the current window.</td><td>Back off per Rate Limits and retry with jitter.</td></tr>
        <tr><td>Server_Error</td><td>Infra</td><td>Unexpected upstream failure.</td><td>Retry with exponential backoff; escalate if persistent.</td></tr>
      </table>` },
      { h: "Error handling", body: `<div class="callout"><b>Convention</b>Always branch on <code>stat</code> first, then use <code>emsg</code> for logging/telemetry — never string-match on <code>emsg</code> for control flow, as exact wording can change.</div>` },
      { h: "Best practices", body: `<ul><li>Log the full raw response for every non-Ok result — don't discard <code>emsg</code>.</li><li>Build one central error-mapping function shared across all endpoint calls instead of duplicating this table per call site.</li></ul>` },
      { h: "Python example", body: `${codeBlock("python", `resp = client.place_order(...)
if resp.stat != "Ok":
    logger.warning("Order rejected: %s", resp.emsg)
    raise OrderRejectedError(resp.emsg)`)}` },
      { h: "Notes", body: `<p>This table is illustrative — replace with the verified, complete code list from the live API before publishing.</p>` },
    ],
  },
};

// ---------- helpers used above ----------
function codeBlock(lang, code) {
  const id = "cb" + Math.random().toString(36).slice(2, 9);
  return `<div class="code-block">
    <div class="code-label">${lang}</div>
    <div class="code-body">
      <button class="copy-btn" onclick="copyCode('${id}', this)">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15V5a2 2 0 012-2h10" stroke="currentColor" stroke-width="2"/></svg>
        Copy
      </button>
      <pre><code id="${id}" class="language-${lang}">${escapeHtml(code)}</code></pre>
    </div>
  </div>`;
}

function codeTabs(groupId, langs) {
  const order = ["python", "javascript", "curl"];
  const label = { python: "Python", javascript: "JavaScript", curl: "cURL" };
  const hljsLang = { python: "python", javascript: "javascript", curl: "bash" };
  let tabs = "", panels = "";
  order.forEach((l, i) => {
    if (!langs[l]) return;
    const active = i === 0 || (i > 0 && !langs[order[0]]);
    tabs += `<div class="code-tab ${active ? "active" : ""}" data-group="${groupId}" data-lang="${l}" onclick="switchTab('${groupId}','${l}')">${label[l]}</div>`;
    const codeId = `${groupId}-${l}`;
    panels += `<div class="code-panel ${active ? "active" : ""}" data-group="${groupId}" data-lang="${l}">
      <div class="code-body">
        <button class="copy-btn" onclick="copyCode('${codeId}', this)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15V5a2 2 0 012-2h10" stroke="currentColor" stroke-width="2"/></svg>
          Copy
        </button>
        <pre><code id="${codeId}" class="language-${hljsLang[l]}">${escapeHtml(langs[l])}</code></pre>
      </div>
    </div>`;
  });
  return `<div class="code-block"><div class="code-tabs">${tabs}</div>${panels}</div>`;
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
