// Cloudflare Worker — CORS proxy for MarketData.app options chain
//
// The screener calls this worker at:   GET <worker-url>/?url=<encoded MarketData URL>
// The worker validates the target host, fetches it, and returns the response
// with permissive CORS headers so the browser app can read it.
//
// Host allowlist keeps this from being used as an open proxy. Add hosts here
// only if you know what you're doing.

const ALLOWED_HOSTS = ['api.marketdata.app'];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const incoming = new URL(request.url);
    const target = incoming.searchParams.get('url');
    if (!target) {
      return new Response('Missing ?url= parameter', { status: 400, headers: CORS_HEADERS });
    }

    let targetUrl;
    try {
      targetUrl = new URL(target);
    } catch {
      return new Response('Invalid target URL', { status: 400, headers: CORS_HEADERS });
    }

    if (!ALLOWED_HOSTS.includes(targetUrl.hostname)) {
      return new Response(`Host not allowed: ${targetUrl.hostname}`, {
        status: 403,
        headers: CORS_HEADERS,
      });
    }

    const upstream = await fetch(targetUrl.toString(), {
      headers: { 'User-Agent': 'screener-on-demand-ai-summary/1.0' },
    });
    const body = await upstream.text();

    return new Response(body, {
      status: upstream.status,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
      },
    });
  },
};
