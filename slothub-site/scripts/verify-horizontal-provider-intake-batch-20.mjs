import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['all-for-one-studios', 'kings-of-crystals-ii'],
  ['foxium', 'rome-fight-for-gold-eternal-empire'],
  ['just-for-the-win-studios', 'trojan-kingdom'],
  ['northern-lights-gaming', 'bison-moon'],
  ['snowborn-games', 'pile-em-up'],
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

const crystals = (await readEntry('games', 'kings-of-crystals-ii')).data;
assert.equal(crystals.rtp, undefined);
assert.equal(crystals.rows, 4);
assert.equal(crystals.maxWinMultiplier, 10000);
assert.deepEqual(crystals.features, ['free-spins', 'wild', 'multiplier', 'jackpot']);

const rome = (await readEntry('games', 'rome-fight-for-gold-eternal-empire')).data;
assert.equal(rome.rtp, undefined);
assert.equal(rome.rows, 4);
assert.equal(rome.maxWinMultiplier, 25000);
assert.deepEqual(rome.features, ['respins', 'cash-collection', 'multiplier', 'jackpot']);

const trojan = (await readEntry('games', 'trojan-kingdom')).data;
assert.equal(trojan.rtp, undefined);
assert.equal(trojan.volatilityOriginal, 'High');
assert.equal(trojan.winMechanism, 'paylines');
assert.equal(trojan.winCount, 30);
assert.equal(trojan.maxWinMultiplier, 10000);

const bison = (await readEntry('games', 'bison-moon')).data;
assert.equal(bison.rtp, undefined);
assert.equal(bison.winMechanism, undefined);
assert.equal(bison.maxWinMultiplier, 12500);
assert.deepEqual(bison.features, ['free-spins', 'wild', 'hold-and-spin', 'jackpot']);

const pile = (await readEntry('games', 'pile-em-up')).data;
assert.equal(pile.rtp, 96.22);
assert.equal(pile.volatilityOriginal, 'High');
assert.equal(pile.winMechanism, 'paylines');
assert.equal(pile.winCount, 20);
assert.equal(pile.maxWinMultiplier, 7500);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['All For One Studios', 'Foxium', 'Just For The Win Studios', 'Northern Lights Gaming', 'Snowborn Games']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`));
}
assert.match(map, /第二十批完成 ALL FOR ONE Studios、Foxium、Just For The Win Studios、Northern Lights Gaming 與 Snowborn Games/);

console.log('PASS: horizontal intake batch 20 published five identity-confirmed slot studios with one official game each while preserving missing RTP, source boundaries and deferred image evidence.');
