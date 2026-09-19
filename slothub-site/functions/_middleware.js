import { legacyRedirectTarget } from '../src/lib/legacy-wix-routes.mjs';

const PRODUCTION_HOST = 'www.slothub.com.tw';
const APEX_HOST = 'slothub.com.tw';
const EMPTY_SITEMAP = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n';

function withSharedHeaders(response, robots = null) {
  const result = new Response(response.body, response);
  result.headers.set('X-Content-Type-Options', 'nosniff');
  result.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  result.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (robots) result.headers.set('X-Robots-Tag', robots);
  return result;
}

function isPreviewHost(hostname) {
  return hostname.endsWith('.pages.dev') || hostname === 'localhost' || hostname === '127.0.0.1';
}

function canonicalOrigin(url) {
  return isPreviewHost(url.hostname) ? url.origin : `https://${PRODUCTION_HOST}`;
}

function redirectResponse(url, pathname) {
  const destination = new URL(canonicalOrigin(url));
  destination.pathname = pathname;
  destination.search = url.search;
  return withSharedHeaders(
    Response.redirect(destination.toString(), 301),
    isPreviewHost(url.hostname) ? 'noindex, nofollow' : null,
  );
}

function queryRobots(url) {
  if (isPreviewHost(url.hostname)) return 'noindex, nofollow';
  const pathname = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
  if (pathname === '/search/' || pathname === '/compare/') return 'noindex, follow';
  if (pathname === '/games/' && url.search) return 'noindex, follow';
  return null;
}

async function protectPreviewHtml(response, url, method) {
  if (!isPreviewHost(url.hostname) || method !== 'GET') return response;
  if (!response.headers.get('content-type')?.includes('text/html')) return response;

  let html = await response.text();
  html = html.replace(/<link\b(?=[^>]*\brel=(?:["']canonical["']|canonical))[^>]*>\s*/gi, '');
  const robotsPattern = /<meta\b(?=[^>]*\bname=(?:["']robots["']|robots))[^>]*>/i;
  if (robotsPattern.test(html)) {
    html = html.replace(robotsPattern, '<meta name="robots" content="noindex,nofollow">');
  } else {
    html = html.replace(/<\/head>/i, '<meta name="robots" content="noindex,nofollow"></head>');
  }

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const method = context.request.method.toUpperCase();
  const legacyTarget = method === 'GET' || method === 'HEAD'
    ? legacyRedirectTarget(url.pathname)
    : null;

  if (legacyTarget) return redirectResponse(url, legacyTarget);

  if (url.hostname === APEX_HOST) {
    return redirectResponse(url, url.pathname);
  }

  if (isPreviewHost(url.hostname) && url.pathname.replace(/\/+$/, '') === '/sitemap.xml') {
    return withSharedHeaders(new Response(method === 'HEAD' ? null : EMPTY_SITEMAP, {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    }), 'noindex, nofollow');
  }

  const page = await protectPreviewHtml(await context.next(), url, method);
  return withSharedHeaders(page, queryRobots(url));
}
