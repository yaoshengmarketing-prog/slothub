import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import {
  LEGACY_WIX_REDIRECTS,
  LEGACY_WIX_UNMAPPED_PUBLIC_PATHS,
  LEGACY_WIX_UNPUBLISHED_DRAFT_IDS,
  legacyRedirectTarget,
} from '../src/lib/legacy-wix-routes.mjs';
import { onRequest } from '../functions/_middleware.js';

const distRoot = new URL('../dist/', import.meta.url);
const entries = Object.entries(LEGACY_WIX_REDIRECTS);
const wranglerConfig = JSON.parse(await readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8'));

assert.equal(wranglerConfig.vars?.PUBLIC_SITE_ENV, 'production', 'Pages production build must remain indexable after custom-domain cutover');
assert.equal(wranglerConfig.env?.preview?.vars?.PUBLIC_SITE_ENV, 'preview', 'Pages preview branches must retain Preview safeguards');

assert.equal(entries.length, 24, 'migration must preserve the 24 approved one-to-one redirects');
assert.equal(LEGACY_WIX_UNMAPPED_PUBLIC_PATHS.length, 40, 'all 40 published URLs without an equivalent page must remain recorded');
assert.equal(LEGACY_WIX_UNPUBLISHED_DRAFT_IDS.length, 11, 'all 11 unpublished Wix draft IDs must remain recorded');
assert.equal(new Set([...Object.keys(LEGACY_WIX_REDIRECTS), ...LEGACY_WIX_UNMAPPED_PUBLIC_PATHS]).size, 64, 'the 64 known public Wix paths must be unique');

for (const [source, target] of entries) {
  assert.match(source, /^\/post\/[a-z0-9-]+$/, `${source}: invalid legacy path`);
  assert.match(target, /^(?:\/guide\/[a-z0-9-]+\/|\/slots\/)$/, `${source}: redirect target must be a permanent content URL`);
  assert.notEqual(source, target, `${source}: self redirect`);
  assert.equal(legacyRedirectTarget(`${source}/`), target, `${source}: trailing-slash input must normalize`);
  assert.ok(!LEGACY_WIX_REDIRECTS[target], `${source}: redirect chains are not allowed`);
  await access(new URL(`${target.slice(1)}index.html`, distRoot));
}

for (const path of LEGACY_WIX_UNMAPPED_PUBLIC_PATHS) {
  assert.equal(legacyRedirectTarget(path), null, `${path}: unrelated legacy content must not be mass-redirected`);
}

async function request(url, status = 200, body = 'page', headers = undefined) {
  return onRequest({
    request: new Request(url),
    next: async () => new Response(body, { status, headers }),
  });
}

const previewRedirect = await request('https://slot-hub.pages.dev/post/rng-random-number-generator-explained/?utm_source=wix');
assert.equal(previewRedirect.status, 301);
assert.equal(previewRedirect.headers.get('location'), 'https://slot-hub.pages.dev/guide/slot-rng-explained/?utm_source=wix');
assert.equal(previewRedirect.headers.get('x-robots-tag'), 'noindex, nofollow');

const productionRedirect = await request('https://www.slothub.com.tw/post/jackpot-explained');
assert.equal(productionRedirect.headers.get('location'), 'https://www.slothub.com.tw/guide/slot-jackpot-explained/');
const apexLegacyRedirect = await request('https://slothub.com.tw/post/jackpot-explained?from=wix');
assert.equal(apexLegacyRedirect.status, 301);
assert.equal(apexLegacyRedirect.headers.get('location'), 'https://www.slothub.com.tw/guide/slot-jackpot-explained/?from=wix');

const apexRedirect = await request('https://slothub.com.tw/guide/?from=apex');
assert.equal(apexRedirect.status, 301);
assert.equal(apexRedirect.headers.get('location'), 'https://www.slothub.com.tw/guide/?from=apex');

const hostileApexPath = await request('https://slothub.com.tw//evil.example/path?from=apex');
assert.equal(hostileApexPath.status, 301);
assert.equal(hostileApexPath.headers.get('location'), 'https://www.slothub.com.tw//evil.example/path?from=apex');

const previewPage = await request('https://slot-hub.pages.dev/guide/');
assert.equal(previewPage.headers.get('x-robots-tag'), 'noindex, nofollow');
const previewProductionHtml = await request(
  'https://slot-hub.pages.dev/guide/',
  200,
  '<!doctype html><html><head><meta name="robots" content="index,follow"><link rel="canonical" href="https://www.slothub.com.tw/guide/"></head><body>Guide</body></html>',
  { 'Content-Type': 'text/html; charset=utf-8' },
);
const protectedPreviewHtml = await previewProductionHtml.text();
assert.match(protectedPreviewHtml, /<meta name="robots" content="noindex,nofollow">/);
assert.ok(!protectedPreviewHtml.includes('rel="canonical"'), 'pages.dev must strip the production canonical at the edge');
const previewSitemap = await request('https://slot-hub.pages.dev/sitemap.xml');
assert.equal(previewSitemap.headers.get('x-robots-tag'), 'noindex, nofollow');
assert.ok(!(await previewSitemap.text()).includes('<url>'), 'pages.dev sitemap must remain empty');
const filteredGames = await request('https://www.slothub.com.tw/games/?mechanism=paylines');
assert.equal(filteredGames.headers.get('x-robots-tag'), 'noindex, follow');
const slashlessFilteredGames = await request('https://www.slothub.com.tw/games?mechanism=paylines');
assert.equal(slashlessFilteredGames.headers.get('x-robots-tag'), 'noindex, follow');
const cleanGames = await request('https://www.slothub.com.tw/games/');
assert.equal(cleanGames.headers.get('x-robots-tag'), null);

const retired = await request('https://www.slothub.com.tw/post/roulette-hot-cold-numbers-explained', 404);
assert.equal(retired.status, 404, 'legacy content without a genuine equivalent must remain a normal 404');
assert.equal(retired.headers.get('location'), null);

const headers = await readFile(new URL('_headers', distRoot), 'utf8');
assert.ok(!headers.includes('X-Robots-Tag'), 'static _headers must not accidentally noindex the future production host');

console.log('PASS: 24 exact redirects, 40 intentional unmapped public URLs and 11 unpublished drafts are accounted for without chains or mass redirects.');
