import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['richyplay', 'cute-crush'],
  ['thunderspin', 'book-of-games'],
  ['vivid-gaming', 'kingdom-wardens'],
  ['wicked-games', 'astro-wicked-games'],
  ['winfinity-games', '5-amazing-hot'],
];

async function readEntry(collection, slug) {
  const source = await readFile(new URL(`../src/content/${collection}/${slug}.md`, import.meta.url), 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  assert.ok(frontmatter, `${collection}/${slug}: missing frontmatter`);
  return { source, data: parse(frontmatter) };
}

for (const [providerSlug, gameSlug] of batch) {
  const [{ data: provider }, { data: game }] = await Promise.all([
    readEntry('providers', providerSlug), readEntry('games', gameSlug),
  ]);
  assert.equal(provider.status, 'published', `${providerSlug}: Provider must be published`);
  assert.equal(game.status, 'published', `${gameSlug}: Game must be published`);
  assert.equal(game.provider, providerSlug, `${gameSlug}: Provider relation mismatch`);
  assert.equal(String(game.lastVerifiedAt).slice(0, 10), '2026-09-18');
  assert.ok(game.sources.length >= 2, `${gameSlug}: source and image/identity evidence are required`);
  assert.ok(game.image?.sourceUrl, `${gameSlug}: traceable image source missing`);
  const image = await stat(new URL(`../public${game.image.src}`, import.meta.url));
  assert.ok(image.size > 10_000, `${gameSlug}: image asset is unexpectedly small`);
  const [gameHtml, providerHtml] = await Promise.all([
    readFile(new URL(`../dist/games/${gameSlug}/index.html`, import.meta.url), 'utf8'),
    readFile(new URL(`../dist/providers/${providerSlug}/index.html`, import.meta.url), 'utf8'),
  ]);
  assert.match(gameHtml, new RegExp(`/providers/${providerSlug}/`));
  assert.match(providerHtml, new RegExp(`/games/${gameSlug}/`));
  assert.match(gameHtml, /content="noindex,nofollow"/);
  assert.ok(!gameHtml.includes('rel="canonical"'));
}

const richy = (await readEntry('games', 'cute-crush')).data;
assert.equal(richy.winMechanism, 'cluster-pays');
assert.ok(richy.features.includes('cascading'));
assert.equal(richy.bonusBuy, undefined, 'Coming soon must not become supported Bonus Buy');

const thunder = (await readEntry('games', 'book-of-games')).data;
assert.equal(thunder.rtp, 95.7);
assert.equal(thunder.winCount, 9);
assert.equal(thunder.maxWinMultiplier, 1000);

const vivid = (await readEntry('games', 'kingdom-wardens')).data;
assert.equal(vivid.bonusBuy, true);
assert.equal(vivid.rtp, undefined);
assert.equal(vivid.winMechanism, undefined);

const wicked = (await readEntry('games', 'astro-wicked-games')).data;
assert.equal(wicked.volatilityOriginal, '1/5');
assert.equal(wicked.maxWinMultiplier, 4000);

const winfinity = (await readEntry('games', '5-amazing-hot')).data;
assert.equal(winfinity.provider, 'winfinity-games');
assert.equal(winfinity.maxWinMultiplier, undefined, 'single-line top prize must not become whole-game Max Win');
assert.match(winfinity.maxWinLabelOriginal, /per line on single line/);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['RichyPlay', 'Thunderspin', 'Vivid Gaming', 'Wicked Games', 'Winfinity Games']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`));
}
assert.match(map, /下一個主動接續品牌為 [^。]+/);
assert.match(map, /REMAINING_RESEARCH_LEAD_COUNT: 0/);

console.log('PASS: horizontal intake batch 14 published five identity-confirmed slot Providers and one source-backed game each while preserving unknown fields, scoped prize bases and distinct same-name brands.');
