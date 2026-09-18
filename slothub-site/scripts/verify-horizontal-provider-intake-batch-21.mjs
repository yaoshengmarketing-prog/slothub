import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['wishbone', 'kingfisher'],
  ['fortune-factory-studios', 'ufc-gold-blitz-extreme'],
  ['gameburger-studios', 'carnaval-drums'],
  ['triple-edge-studios', 'goal-strike-rising-rewards'],
  ['spinplay-games', '3-lucky-rainbows-action-boost'],
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
  assert.equal(String(game.lastVerifiedAt).slice(0, 10), '2026-09-19');
  assert.ok(game.sources.length >= 1, `${gameSlug}: traceable source evidence is required`);
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

const kingfisher = (await readEntry('games', 'kingfisher')).data;
assert.equal(kingfisher.rtp, undefined);
assert.equal(kingfisher.rows, 4);
assert.equal(kingfisher.maxWinMultiplier, 5300);
assert.deepEqual(kingfisher.features, ['free-spins', 'multiplier', 'respins']);

const ufc = (await readEntry('games', 'ufc-gold-blitz-extreme')).data;
assert.equal(ufc.rtp, undefined);
assert.equal(ufc.winMechanism, undefined);
assert.equal(ufc.maxWinMultiplier, 5500);
assert.deepEqual(ufc.features, ['respins', 'cash-collection', 'jackpot']);

const carnaval = (await readEntry('games', 'carnaval-drums')).data;
assert.equal(carnaval.rtp, undefined);
assert.equal(carnaval.winMechanism, 'paylines');
assert.equal(carnaval.winCount, 20);
assert.equal(carnaval.maxWinMultiplier, undefined);

const goal = (await readEntry('games', 'goal-strike-rising-rewards')).data;
assert.equal(goal.rtp, undefined);
assert.equal(goal.rows, undefined, 'variable 3-4-5-4-3 layout must not become a fixed row count');
assert.equal(goal.winMechanism, undefined);
assert.deepEqual(goal.features, ['free-spins', 'wild', 'multiplier', 'jackpot']);

const rainbows = (await readEntry('games', '3-lucky-rainbows-action-boost')).data;
assert.equal(rainbows.rtp, undefined);
assert.equal(rainbows.volatilityOriginal, 'high volatility');
assert.equal(rainbows.volatilityNormalized, 'high');
assert.equal(rainbows.maxWinMultiplier, 5000);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Wishbone', 'Fortune Factory Studios', 'Gameburger Studios', 'Triple Edge Studios', 'SpinPlay Games']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`));
}
assert.match(map, /下一個橫向接續位置為候選地圖第 157 項 Aurum Signature Studios/);

console.log('PASS: horizontal intake batch 21 published five identity-confirmed slot studios with one official game each while preserving variable layouts, missing RTP and source boundaries.');
