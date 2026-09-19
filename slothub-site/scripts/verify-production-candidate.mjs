import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { parse } from 'yaml';

const root = new URL('../dist/', import.meta.url);
const guidesRoot = new URL('../src/content/guides/', import.meta.url);
const guideFiles = (await readdir(guidesRoot)).filter((file) => file.endsWith('.md'));
const publishedGuides = [];
const migratedGuideSlugs = [
  'slot-screen-beginners-guide',
  'slot-rng-explained',
  'slot-near-miss-explained',
  'slot-hold-and-win-explained',
  'slot-jackpot-explained',
  'slot-chasing-losses',
  'slot-gambling-harm-signs',
  'slot-gamble-feature-explained',
  'slot-demo-vs-real-money',
];
for (const file of guideFiles) {
  const source = await readFile(new URL(file, guidesRoot), 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  if (frontmatter && parse(frontmatter).status === 'published') publishedGuides.push(file.replace(/\.md$/, ''));
}

const [home, search, compare, games, sitemap, robots, headers] = await Promise.all([
  readFile(new URL('index.html', root), 'utf8'),
  readFile(new URL('search/index.html', root), 'utf8'),
  readFile(new URL('compare/index.html', root), 'utf8'),
  readFile(new URL('games/index.html', root), 'utf8'),
  readFile(new URL('sitemap.xml', root), 'utf8'),
  readFile(new URL('robots.txt', root), 'utf8'),
  readFile(new URL('_headers', root), 'utf8'),
]);

assert.match(home, /content="index,follow"/, 'production homepage must be indexable');
assert.match(home, /rel="canonical" href="https:\/\/www\.slothub\.com\.tw\/"/, 'production canonical missing');
assert.match(search, /content="noindex,follow"/, 'Search must remain noindex in production');
assert.match(compare, /content="noindex,follow"/, 'Compare must remain noindex in production');
assert.match(games, /content="index,follow"/, 'clean Games owner must remain indexable');
assert.ok(!headers.includes('X-Robots-Tag'), 'static production headers must not contain a global noindex');
assert.match(robots, /Sitemap: https:\/\/www\.slothub\.com\.tw\/sitemap\.xml/);
assert.match(sitemap, /<url><loc>https:\/\/www\.slothub\.com\.tw\/<\/loc><\/url>/);
for (const slug of publishedGuides) {
  assert.ok(sitemap.includes(`https://www.slothub.com.tw/guide/${slug}/`), `${slug}: missing from production sitemap`);
}
assert.ok(publishedGuides.length >= 23, 'production candidate must retain at least the approved 23 published Guides');
for (const slug of migratedGuideSlugs) {
  assert.ok(publishedGuides.includes(slug), `${slug}: approved migrated Guide missing from production candidate`);
}

console.log(`PASS: production candidate exposes canonical/indexable content, keeps Search and Compare noindex, and lists all ${publishedGuides.length} Guides in the sitemap.`);
