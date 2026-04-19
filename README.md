# Value Investor Stock Screener

A single-file browser app that screens stocks against a deterministic, pure-math value-investing rubric (Graham · Buffett · Lynch · Al Brooks) and generates an on-demand AI summary per ticker.

**Live:** https://hrishikeshpujari.github.io/screener-on-demand-ai-summary/

## Features

- **Deterministic scoring** — every ticker gets a Total /32 (Fundamentals /24 + Technicals /8). No randomness; same inputs always give the same score.
- **Live data** — price and fundamentals from Finnhub, historical prices (EMAs) from Twelve Data, options from MarketData.app.
- **On-demand AI summary** — per-ticker narrative analysis via the Anthropic API. Not called unless you click the button, so you control the spend.
- **Watchlist with localStorage** — tickers and scores persist across reloads on the same browser.
- **Zero build step** — one `index.html` file. Open it locally or host anywhere static.

## Quick start

1. Grab the four API keys (all have free tiers — see detailed steps below).
2. Open https://hrishikeshpujari.github.io/screener-on-demand-ai-summary/ (or `index.html` locally).
3. Expand the **⚙️ API Key Overrides** panel at the top, paste each key, click **Save**.
4. Type a ticker → **Analyze** → click the row to expand → **🧠 AI Summary**.

## Getting the API keys

All four have free tiers. Get them in any order.

### 1. Anthropic (for the AI summary)

1. Go to https://console.anthropic.com and sign up (Google or email).
2. **Billing** → add a payment method and buy credits. $5 is plenty to try it out; summaries are ~1–3¢ each.
3. **Limits** → set a **Monthly spend limit** (e.g. $5–$10). This is your safety net — if the key ever leaks, the most that can be drained is whatever you cap it at.
4. **API keys** → **Create key** → name it (e.g. `screener`) → **Copy**. The key starts with `sk-ant-api03-…` and is only shown once.
5. Paste into the **Anthropic API Key** field in the screener.

### 2. Finnhub (for live price + fundamentals)

1. Go to https://finnhub.io/register and sign up. No credit card required.
2. After verifying your email, the dashboard shows your API key at the top of the page.
3. Copy it and paste into the **Finnhub API Key** field.
4. Free tier: 60 calls/minute. Plenty for personal screening.

### 3. Twelve Data (for historical prices / EMAs)

1. Go to https://twelvedata.com/register and sign up. No credit card required.
2. Dashboard → **API Keys** → copy the default key.
3. Paste into the **Twelve Data API Key** field.
4. Free tier: 800 calls/day, 8 calls/minute. Each ticker uses 1 call per refresh.

### 4. MarketData.app (for live options chain)

1. Go to https://www.marketdata.app/ → **Sign up**.
2. Verify email, then go to **Dashboard → Settings → API Token** (or the page labeled "Tokens").
3. Copy the token and paste into the **MarketData.app Key** field.
4. Free tier: 100 calls/day. Each ticker with an expanded options view uses 1 call.

## Optional: Cloudflare Worker (live options anywhere)

MarketData.app doesn't send CORS headers, so the browser blocks direct calls from most origins. The app handles this in two ways:

- **On `localhost` and the GitHub Pages site** — the app falls back to direct calls, which browsers allow for some origins. You do **not** need the Worker for personal use.
- **Anywhere else** (Claude.ai artifacts, other static hosts, your own domain) — you need a tiny CORS proxy. That's what `worker.js` is for.

### Deploying the Worker

One-time setup, ~3 minutes:

1. Go to https://dash.cloudflare.com and sign up (free).
2. In the sidebar, click **Workers & Pages** → **Create** → **Create Worker**.
3. Give it a name like `screener-options-proxy` → **Deploy** (accept the default hello-world for now).
4. Click **Edit code**.
5. Delete everything in the editor, paste the contents of [`worker.js`](worker.js) from this repo, and click **Deploy**.
6. At the top of the page you'll see the worker URL, something like:
   `https://screener-options-proxy.<your-subdomain>.workers.dev`
   Copy that URL.
7. Back in the screener app: **⚙️ API Key Overrides → Cloudflare Worker URL** → paste the URL → **Save**.

That's it. The app will now route MarketData.app calls through your Worker and CORS will work everywhere.

### What the Worker does (and doesn't do)

- It only accepts requests like `?url=<encoded MarketData.app URL>`.
- It **allowlists `api.marketdata.app`** as the only host it will proxy — so it's not an open proxy that strangers can abuse.
- It adds CORS headers to the response.
- It does **not** see or store your MarketData token — the token is part of the query string and passes straight through to MarketData.

### Free-tier limits

Cloudflare Workers free plan: **100,000 requests/day**. Each screened ticker uses at most 1 Worker request, so you'd have to screen ~100k tickers a day to exceed this.

## Running locally

Clone this repo and open `index.html` directly — the simplest way:

```bash
git clone https://github.com/hrishikeshpujari/screener-on-demand-ai-summary.git
cd screener-on-demand-ai-summary
# Open index.html in your browser
```

Or serve it over `localhost` if you prefer:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Security notes

- **Keys are stored in your browser's `localStorage`.** No backend, no server logs. Each key is sent only to its own provider's API.
- **Anyone with access to DevTools on your browser can read the keys.** This is fine for personal use. If you plan to host this publicly under your own keys: (a) set a monthly spend cap on the Anthropic key, and (b) route Anthropic through a Worker with auth instead of baking the key into the page.
- **The `BAKED` object in `index.html` is intentionally empty.** Don't commit real keys into it — the page source is visible to anyone who loads the site.
- **Clearing your browser's site data removes the keys.** You'll need to paste them again.

## Disclaimer

Educational tool. Scores are generated from public financial data using a fixed formula; they are **not financial advice**. Do your own due diligence before making any investment decision.

## License

MIT
