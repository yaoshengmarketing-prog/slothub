import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gameDirectory = path.join(root, 'src', 'content', 'games');
const providerDirectory = path.join(root, 'src', 'content', 'providers');
const outputPath = path.join(root, 'data', 'game-demo-coverage.json');
const manualReviewPath = path.join(root, 'data', 'game-demo-manual-review.json');
const checkedAt = new Date().toISOString().slice(0, 10);
const timeoutMs = Number(process.env.DEMO_AUDIT_TIMEOUT_MS || 12_000);
const concurrency = Number(process.env.DEMO_AUDIT_CONCURRENCY || 8);
const manualReview = JSON.parse(await readFile(manualReviewPath, 'utf8'));

function frontmatter(raw, file) {
  const match = raw.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`${file}: missing YAML frontmatter`);
  return parse(match[1]);
}

async function loadCollection(directory) {
  const files = (await readdir(directory)).filter((file) => file.endsWith('.md')).sort();
  return Promise.all(files.map(async (file) => ({
    slug: file.slice(0, -3),
    data: frontmatter(await readFile(path.join(directory, file), 'utf8'), file),
  })));
}

function plainText(value = '') {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function demoSignal(value = '') {
  return /(play\s*(?:the\s*)?(?:game\s*)?(?:for\s*)?free|free\s*demo|play\s*demo|demo\s*play|try\s*(?:the\s*)?game|trial\s*game|plustrial|demo\s*mode|fun\s*mode)/i.test(value)
    || /(?:^|[./_-])demo(?:[./?_-]|$)/i.test(value);
}

function extractLinks(html, baseUrl) {
  const links = [];
  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = match[1].match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1]
      ?.replace(/&amp;/gi, '&')
      .replace(/&#0*38;?/gi, '&');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) continue;
    try {
      const url = new URL(href, baseUrl).href;
      const text = plainText(match[2]);
      if (demoSignal(`${text} ${url}`)) links.push({ url, text: text || 'Demo link' });
    } catch {}
  }
  return links;
}

function isGenericDestination(value = '') {
  try {
    const url = new URL(value);
    const pathname = url.pathname.replace(/\/+$/, '') || '/';
    return pathname === '/'
      || /^\/(?:games?|our-games|demos?|free-games?)$/i.test(pathname)
      || /^igaming-demo\.lnw\.com$/i.test(url.hostname);
  } catch {
    return true;
  }
}

function identifiesGame(value, game) {
  const haystack = decodeURIComponent(String(value ?? '')).toLowerCase().replace(/[^a-z0-9]+/g, ' ');
  const ignored = new Set(['slot', 'slots', 'game', 'games', 'hold', 'spin', 'wild', 'with', 'from', 'plus', 'super']);
  for (const token of String(game.data.provider ?? '').toLowerCase().split(/[^a-z0-9]+/)) {
    if (token.length >= 3) ignored.add(token);
  }
  // The canonical slug is the stable game identity. Display/original names may
  // include the provider brand and would make a provider-level page look exact.
  const tokens = String(game.slug).toLowerCase().split(/[^a-z0-9]+/)
    .filter((item) => item.length >= 4 && !ignored.has(item));
  return [...new Set(tokens)].some((token) => haystack.includes(token));
}

function iframeStatus(headers) {
  const xFrameOptions = headers.get('x-frame-options')?.toLowerCase() ?? '';
  const contentSecurityPolicy = headers.get('content-security-policy')?.toLowerCase() ?? '';
  if (/(deny|sameorigin)/.test(xFrameOptions)) return { status: 'blocked', reason: `X-Frame-Options: ${xFrameOptions}` };
  const ancestors = contentSecurityPolicy.match(/frame-ancestors\s+([^;]+)/)?.[1] ?? '';
  if (ancestors.includes("'none'") || (ancestors.includes("'self'") && !ancestors.includes('*'))) {
    return { status: 'blocked', reason: `CSP frame-ancestors: ${ancestors}` };
  }
  return { status: 'browser-test-required' };
}

async function inspectUrl(url) {
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(timeoutMs),
      headers: { 'user-agent': 'SlotHubDemoCoverage/1.0 (+official demo verification)' },
    });
    const contentType = response.headers.get('content-type') ?? '';
    const html = contentType.includes('text/html') ? await response.text() : '';
    const finalUrl = response.url || url;
    const text = plainText(html).slice(0, 150_000);
    const links = extractLinks(html, finalUrl);
    const loginRequired = /(?:sign\s*in|log\s*in|登入|password)/i.test(text.slice(0, 12_000))
      && /(?:login|signin|auth)/i.test(finalUrl);
    return {
      requestedUrl: url,
      finalUrl,
      ok: response.ok,
      httpStatus: response.status,
      contentType,
      loginRequired,
      iframe: iframeStatus(response.headers),
      demoLinks: [...new Map(links.map((item) => [item.url, item])).values()].slice(0, 12),
      pageSignals: demoSignal(text),
    };
  } catch (error) {
    return { requestedUrl: url, ok: false, error: error.message };
  }
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await mapper(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

const [gameRecords, providerRecords] = await Promise.all([
  loadCollection(gameDirectory),
  loadCollection(providerDirectory),
]);
const providers = new Map(providerRecords.map((item) => [item.slug, item.data]));
const games = gameRecords.filter((item) => item.data.status === 'published');

const urlJobs = new Map();
for (const game of games) {
  const provider = providers.get(game.data.provider);
  const sources = [...(game.data.sources ?? []), game.data.source].filter(Boolean);
  const exactFirst = sources.sort((left, right) => {
    const score = (source) => /(?:遊戲|game|demo|trial|rules|paytable|help)/i.test(source.label ?? '') ? 1 : 0;
    return score(right) - score(left);
  });
  const urls = [...new Set(exactFirst.map((source) => source.url).filter(Boolean))].slice(0, 3);
  if (provider?.officialUrl && urls.length === 0) urls.push(provider.officialUrl);
  for (const url of urls) if (!urlJobs.has(url)) urlJobs.set(url, null);
  game.auditUrls = urls;
}

const uniqueUrls = [...urlJobs.keys()];
let completed = 0;
const inspections = await mapLimit(uniqueUrls, concurrency, async (url) => {
  const result = await inspectUrl(url);
  completed += 1;
  if (completed % 25 === 0 || completed === uniqueUrls.length) console.log(`Inspected ${completed}/${uniqueUrls.length} source pages`);
  return result;
});
const inspectionByUrl = new Map(uniqueUrls.map((url, index) => [url, inspections[index]]));

const entries = games.map((game) => {
  const inspected = game.auditUrls.map((url) => inspectionByUrl.get(url)).filter(Boolean);
  const directLinks = inspected.flatMap((item) => item.demoLinks ?? []);
  const direct = directLinks.find((item) => {
    try {
      const target = new URL(item.url);
      return !/youtube\.com|youtu\.be|facebook\.com|instagram\.com/i.test(target.hostname);
    } catch { return false; }
  });
  const directSource = direct
    ? inspected.find((item) => item.demoLinks?.some((link) => link.url === direct.url))
    : undefined;
  const exactDirect = direct && identifiesGame(`${direct.url} ${direct.text}`, game) ? direct : undefined;
  const exactSourceForDirect = directSource && identifiesGame(directSource.finalUrl, game) ? directSource : undefined;
  const pageWithDemo = inspected.find((item) => item.ok
    && item.pageSignals
    && !isGenericDestination(item.finalUrl)
    && identifiesGame(item.finalUrl, game));
  const login = inspected.find((item) => item.loginRequired);
  const blocked = inspected.find((item) => item.httpStatus === 401 || item.httpStatus === 403);
  const failedCount = inspected.filter((item) => !item.ok).length;

  let status = 'not-verified';
  let url;
  let evidence;
  let accessType;
  let iframe = { status: 'not-tested' };
  if (exactDirect) {
    status = 'available';
    url = exactDirect.url;
    evidence = exactDirect.text;
    accessType = 'direct-demo';
    iframe = directSource?.iframe ?? iframe;
  } else if (exactSourceForDirect) {
    status = 'available';
    url = exactSourceForDirect.finalUrl;
    evidence = 'Official game page exposes a Demo action; link opens the official game page.';
    accessType = 'official-game-page';
    iframe = exactSourceForDirect.iframe;
  } else if (pageWithDemo) {
    status = 'available';
    url = pageWithDemo.finalUrl;
    evidence = 'Official game/source page exposes a free demo action';
    accessType = 'official-game-page';
    iframe = pageWithDemo.iframe;
  } else if (login) {
    status = 'login-required';
    url = login.finalUrl;
    evidence = 'Official page redirects to authentication';
    iframe = login.iframe;
  } else if (blocked && failedCount === inspected.length) {
    status = 'access-restricted';
    url = blocked.finalUrl ?? blocked.requestedUrl;
    evidence = `HTTP ${blocked.httpStatus}`;
    iframe = blocked.iframe ?? iframe;
  }

  return {
    slug: game.slug,
    name: game.data.displayNameZhHant ?? game.data.originalName ?? game.data.name,
    provider: game.data.provider,
    status,
    url,
    accessType,
    presentation: status === 'available' ? 'external' : undefined,
    iframeStatus: iframe.status,
    iframeReason: iframe.reason,
    checkedAt,
    evidence,
    inspectedUrls: inspected.map((item) => ({
      requestedUrl: item.requestedUrl,
      finalUrl: item.finalUrl,
      httpStatus: item.httpStatus,
      error: item.error,
    })),
  };
});

// One exact Demo URL cannot honestly identify several unrelated games. Provider
// demo lobbies remain useful research leads, but they are not publishable game
// links until the collector resolves a game-specific destination.
const availableUrlCounts = new Map();
for (const entry of entries) {
  if (entry.status !== 'available' || !entry.url) continue;
  availableUrlCounts.set(entry.url, (availableUrlCounts.get(entry.url) ?? 0) + 1);
}
for (const entry of entries) {
  const sharedDestination = entry.url && (availableUrlCounts.get(entry.url) ?? 0) > 1;
  if (entry.status === 'available' && (sharedDestination || isGenericDestination(entry.url))) {
    entry.status = 'not-verified';
    entry.accessType = undefined;
    entry.presentation = undefined;
    entry.evidence = sharedDestination
      ? 'Provider-level Demo destination is shared by multiple games; exact game URL is not verified.'
      : 'Provider-level Demo or game catalog found; exact game URL is not verified.';
    entry.iframeStatus = 'not-tested';
    entry.iframeReason = undefined;
    entry.url = undefined;
  }
}

const availableTargets = [...new Set(entries
  .filter((entry) => entry.status === 'available' && entry.url)
  .map((entry) => entry.url))];
const uncheckedTargets = availableTargets.filter((url) => !inspectionByUrl.has(url));
const targetResults = await mapLimit(uncheckedTargets, concurrency, inspectUrl);
for (let index = 0; index < uncheckedTargets.length; index += 1) {
  inspectionByUrl.set(uncheckedTargets[index], targetResults[index]);
}
for (const entry of entries) {
  if (entry.status !== 'available' || !entry.url) continue;
  const target = inspectionByUrl.get(entry.url);
  if (!target?.ok) {
    entry.status = target?.loginRequired
      ? 'login-required'
      : [401, 403, 429].includes(target?.httpStatus) ? 'access-restricted' : 'not-verified';
    entry.presentation = undefined;
    entry.evidence = target?.httpStatus
      ? `Exact destination returned HTTP ${target.httpStatus} during verification.`
      : `Exact destination could not be opened during verification: ${target?.error ?? 'unknown error'}`;
    entry.iframeStatus = target?.iframe?.status === 'blocked' ? 'blocked' : 'not-tested';
    if (entry.status === 'not-verified') entry.url = undefined;
    continue;
  }
  entry.iframeStatus = target.iframe?.status === 'blocked' ? 'blocked' : 'not-tested';
  entry.iframeReason = target.iframe?.reason;
}

// A browser review is deliberately separate from URL discovery. These saved
// decisions are applied last so a future crawl cannot silently overwrite a
// verified iframe result or promote a provider-wide lobby to a game Demo.
for (const [slug, review] of Object.entries(manualReview.entries ?? {})) {
  const entry = entries.find((item) => item.slug === slug);
  if (!entry) throw new Error(`Manual Demo review references unknown Game: ${slug}`);
  Object.assign(entry, review, { browserReviewedAt: manualReview.reviewedAt });
  if (entry.status === 'not-verified') {
    entry.url = undefined;
    entry.accessType = undefined;
    entry.presentation = undefined;
  }
  if (entry.status !== 'available') entry.presentation = undefined;
}

const counts = Object.fromEntries([...new Set(entries.map((entry) => entry.status))].sort().map((status) => [status, entries.filter((entry) => entry.status === status).length]));
const report = {
  version: 1,
  generatedAt: new Date().toISOString(),
  checkedAt,
  gameCount: entries.length,
  providerCount: new Set(entries.map((entry) => entry.provider)).size,
  sourcePageCount: uniqueUrls.length,
  counts,
  rules: {
    owner: 'Each Game record owns its public demo state; this report is operational QA only.',
    defaultPresentation: 'external',
    iframePromotion: 'Only after a real browser confirms the exact official game URL loads cross-origin without authentication or breakage.',
    unknownLabel: '尚未核實官方 Demo',
  },
  entries,
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ outputPath, games: entries.length, providers: report.providerCount, sourcePages: uniqueUrls.length, counts }, null, 2));
