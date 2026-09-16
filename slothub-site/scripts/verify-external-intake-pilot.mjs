import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const readFrontmatter = async (url) => {
  const source = await readFile(url, 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  assert.ok(frontmatter, `${url}: frontmatter missing`);
  return { source, data: parse(frontmatter) };
};

const manifest = JSON.parse(await readFile(new URL('../data/external-intake/relax-gaming-catalog.json', import.meta.url), 'utf8'));
assert.equal(manifest.provider, 'relax-gaming');
assert.equal(manifest.catalogSeenAt, '2026-09-16');
assert.match(manifest.catalogSeenAtMeaning, /不代表任何單款內容已重新核對/);
assert.equal(manifest.catalogEntryCount, 175);
assert.equal(manifest.eligibleGameCount, 173);
assert.equal(manifest.existingMatchCount, 4);
assert.equal(manifest.pendingDetailCount, 169);
assert.equal(new Set(manifest.entries.map((entry) => entry.officialUrl)).size, manifest.entries.length, 'duplicate official catalog URL');

for (const [name, slug] of [['Money Train 2', 'money-train-2'], ['Iron Bank', 'iron-bank']]) {
  const entry = manifest.entries.find((item) => item.officialName === name);
  assert.ok(entry, `${name}: catalog entry missing`);
  assert.equal(entry.existingSlug, slug);
  assert.equal(entry.detailStatus, 'verified');
  assert.equal(entry.verifiedAt, '2026-09-16');
  assert.equal(entry.importStatus, 'imported');
}

for (const [name, slug] of [['Temple Tumble', 'temple-tumble'], ['The Great Pigsby Megaways', 'the-great-pigsby-megaways']]) {
  const entry = manifest.entries.find((item) => item.officialName === name);
  assert.equal(entry?.existingSlug, slug, `${name}: existing-record dedupe failed`);
  assert.equal(entry?.detailStatus, 'existing-record-not-reverified');
  const game = await readFrontmatter(new URL(`../src/content/games/${slug}.md`, import.meta.url));
  assert.equal(String(game.data.lastVerifiedAt).slice(0, 10), '2026-09-03', `${slug}: catalog observation must not update lastVerifiedAt`);
}

const money = await readFrontmatter(new URL('../src/content/games/money-train-2.md', import.meta.url));
assert.equal(money.data.provider, 'relax-gaming');
assert.deepEqual(money.data.rtpVariants, [90]);
assert.equal(money.data.rtp, undefined, 'German RTP must not become a universal primary RTP');
assert.equal(money.data.winMechanism, 'paylines');
assert.equal(money.data.winCount, 40);
assert.equal(money.data.maxWinMultiplier, 50000);
assert.equal(money.data.bonusBuy, true);
assert.ok(money.data.features.includes('respins'));

const iron = await readFrontmatter(new URL('../src/content/games/iron-bank.md', import.meta.url));
assert.equal(iron.data.provider, 'relax-gaming');
assert.deepEqual(iron.data.rtpVariants, [90]);
assert.equal(iron.data.rtp, undefined, 'German RTP must not become a universal primary RTP');
assert.equal(iron.data.volatilityNormalized, 'high');
assert.equal(iron.data.winMechanism, 'ways-to-win');
assert.equal(iron.data.winCount, 4096);
assert.equal(iron.data.maxWinMultiplier, 49998.9);
assert.ok(!iron.data.features.includes('scatter'), 'Bonus symbols must not be inferred as Scatter');

for (const game of [money, iron]) {
  assert.equal(game.data.status, 'published');
  assert.equal(String(game.data.lastVerifiedAt).slice(0, 10), '2026-09-16');
  assert.ok(game.data.sources.length >= 4);
  assert.ok(game.data.sources.every((source) => /relax-gaming\.com/.test(source.url)), 'Pilot sources must remain first-party');
  const image = await stat(new URL(`../public${game.data.image.src}`, import.meta.url));
  assert.ok(image.size > 100_000, `${game.data.name}: official image asset is unexpectedly small`);
}

const [moneyHtml, ironHtml, providerHtml, gamesHtml, searchHtml, compareHtml] = await Promise.all([
  readFile(new URL('../dist/games/money-train-2/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/games/iron-bank/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/providers/relax-gaming/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/games/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/search/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/compare/index.html', import.meta.url), 'utf8'),
]);
for (const [slug, html] of [['money-train-2', moneyHtml], ['iron-bank', ironHtml]]) {
  assert.match(html, /content="noindex,nofollow"/);
  assert.ok(!html.includes('rel="canonical"'));
  assert.match(html, /Relax Gaming/);
  assert.match(providerHtml, new RegExp(`/games/${slug}/`), `${slug}: missing from Provider Hub`);
}
for (const [name, slug] of [['Money Train 2', 'money-train-2'], ['Iron Bank', 'iron-bank']]) {
  assert.match(gamesHtml, new RegExp(slug), `${name}: missing from Explorer catalog`);
  assert.match(searchHtml, new RegExp(slug), `${name}: missing from Search catalog`);
  assert.match(compareHtml, new RegExp(slug), `${name}: missing from Compare catalog`);
}

console.log('PASS: Relax Gaming pilot preserves catalog-vs-verification dates, dedupes existing records, and publishes two verified Games across Search, Explorer, Compare, Provider and Game detail.');
