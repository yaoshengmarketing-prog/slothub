import { readFile, stat } from 'node:fs/promises';

const root = new URL('../dist/', import.meta.url);
const expectedPages = [
  'index.html',
  '404.html',
  'guide/index.html',
  'games/index.html',
  'providers/index.html',
  'tools/index.html',
  'slots/index.html',
  'fishing-games/index.html',
  'search/index.html',
  'compare/index.html',
  'sitemap.xml',
  'robots.txt',
  '_headers',
];

const failures = [];

for (const path of expectedPages) {
  try {
    await stat(new URL(path, root));
  } catch {
    failures.push(`Missing build output: ${path}`);
  }
}

const home = await readFile(new URL('index.html', root), 'utf8');
const sitemap = await readFile(new URL('sitemap.xml', root), 'utf8');
const robots = await readFile(new URL('robots.txt', root), 'utf8');
const headers = await readFile(new URL('_headers', root), 'utf8');

const checks = [
  [home.includes('content="noindex,nofollow"'), 'Homepage meta robots is not noindex,nofollow'],
  [!home.includes('rel="canonical"'), 'Preview must omit canonical'],
  [home.includes('property="og:title"'), 'Open Graph title is missing'],
  [home.includes('application/ld+json'), 'Structured data is missing'],
  [home.includes('GAME EXPLORER'), 'Game explorer is missing'],
  [!sitemap.includes('<url><loc>'), 'Preview sitemap must not publish formal URLs'],
  [robots.includes('Allow: /') && !robots.includes('Disallow: /'), 'robots.txt must allow crawling for noindex discovery'],
  [headers.includes('X-Robots-Tag: noindex, nofollow'), 'Cloudflare X-Robots-Tag safeguard is missing'],
];

for (const [passed, message] of checks) {
  if (!passed) failures.push(message);
}

if (failures.length) {
  console.error(failures.map((item) => `FAIL: ${item}`).join('\n'));
  process.exit(1);
}

console.log(`PASS: ${expectedPages.length} outputs and ${checks.length} SEO safeguards verified.`);
