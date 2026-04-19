# Value Investor Stock Screener

A single-file browser app that screens stocks against a deterministic, pure-math value-investing rubric (Graham · Buffett · Lynch · Al Brooks) and generates an on-demand AI summary per ticker.

**Live:** https://hrishikeshpujari.github.io/screener-on-demand-ai-summary/

## Features

- **Deterministic scoring** — every ticker gets a Total /32 (Fundamentals /24 + Technicals /8). No randomness; same inputs always give the same score.
- **Live data** — price and fundamentals from Finnhub, historical prices (EMAs) from Twelve Data, options from MarketData.app.
- **On-demand AI summary** — per-ticker narrative analysis via the Anthropic API. Not called unless you click the button, so you control the spend.
- **Watchlist with localStorage** — tickers and scores persist across reloads on the same browser.
- **Zero build step** — one `index.html` file. Open it locally or host anywhere static.

## Getting started

### 1. Get API keys

All four providers have free tiers. Sign up and grab a key from each:

| Provider | What it's used for | Free tier |
|---|---|---|
| [Anthropic](https://console.anthropic.com) | AI summary | Pay-as-you-go (credits) |
| [Finnhub](https://finnhub.io/register) | Live price, fundamentals | Free, no card |
| [Twelve Data](https://twelvedata.com/register) | Historical prices / EMAs | 800 calls/day, no card |
| [MarketData.app](https://marketdata.app) | Options chain | 100 calls/day |

### 2. Open the app

- **Live site:** https://hrishikeshpujari.github.io/screener-on-demand-ai-summary/
- **Or locally:** clone this repo and open `index.html` in any modern browser. (CORS works fine for these APIs from `file://` and `localhost`.)

### 3. Paste your keys

Expand the **⚙️ API Key Overrides** section at the top of the page and paste each key. Keys are stored in your browser's `localStorage` only — they are never sent anywhere except the corresponding provider's API.

### 4. Screen a stock

Type a ticker (e.g. `AAPL`, `MSFT`, `KO`) and hit **Analyze**. The row populates with a deterministic score. Click the ticker to expand the detail view, and press **🧠 AI Summary** to get a narrative analysis.

## Optional: Cloudflare Worker proxy

Live options from MarketData.app work out-of-the-box on `localhost` and the GitHub Pages site. If you embed this app somewhere with stricter CORS (e.g. inside Claude.ai artifacts), deploy a tiny Cloudflare Worker as a proxy and paste its URL into the Worker field. Cloudflare Workers free tier = 100k requests/day.

## Security notes

- **Your keys stay in your browser.** There is no backend. The app writes each key to `localStorage` under `viss_key_*` and reads it directly when calling the provider API.
- **Clearing site data removes them.** If you clear browser storage for this site, you'll need to paste the keys again.
- **Don't commit keys.** The `BAKED` object at the top of `index.html` is intentionally empty — don't fill it in and push, since anyone visiting the deployed site would see your keys in the page source.

## Disclaimer

This tool is for educational and research purposes. The scores are generated from public financial data using a fixed formula; they are **not financial advice**. Do your own due diligence before making any investment decision.

## License

MIT
