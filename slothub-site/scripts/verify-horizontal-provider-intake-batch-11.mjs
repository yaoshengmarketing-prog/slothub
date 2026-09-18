import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['goldenrace', 'sizzling-neon-jackpot'],
  ['kingmidas-games', 'leppy-loot'],
  ['mancala-gaming', 'golden-fruit-vegas-classic'],
  ['mascot-gaming', 'the-rite'],
  ['1spin4win', 'book-of-armour'],
];

async function readEntry(collection, slug) {
  const source = await readFile(new URL(`../src/content/${collection}/${slug}.md`, import.meta.url), 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  assert.ok(frontmatter, `${collection}/${slug}: missing frontmatter`);
  return { source, data: parse(frontmatter) };
}

for (const [providerSlug, gameSlug] of batch) {
  const [{ data: provider }, { data: game }] = await Promise.all([
    readEntry('providers', providerSlug),
    readEntry('games', gameSlug),
  ]);
  assert.equal(provider.status, 'published', `${providerSlug}: Provider must be published`);
  assert.equal(game.status, 'published', `${gameSlug}: Game must be published`);
  assert.equal(game.provider, providerSlug, `${gameSlug}: Provider relation mismatch`);
  assert.equal(String(game.lastVerifiedAt).slice(0, 10), '2026-09-18', `${gameSlug}: verification date mismatch`);
  assert.ok(game.sources.length >= 2, `${gameSlug}: source and image evidence are required`);
  assert.ok(game.image?.sourceUrl, `${gameSlug}: traceable image source missing`);
  const image = await stat(new URL(`../public${game.image.src}`, import.meta.url));
  assert.ok(image.size > 10_000, `${gameSlug}: source-backed image asset is unexpectedly small`);

  const [gameHtml, providerHtml] = await Promise.all([
    readFile(new URL(`../dist/games/${gameSlug}/index.html`, import.meta.url), 'utf8'),
    readFile(new URL(`../dist/providers/${providerSlug}/index.html`, import.meta.url), 'utf8'),
  ]);
  assert.match(gameHtml, new RegExp(`/providers/${providerSlug}/`), `${gameSlug}: Provider link missing`);
  assert.match(providerHtml, new RegExp(`/games/${gameSlug}/`), `${providerSlug}: Game link missing`);
  assert.match(gameHtml, /content="noindex,nofollow"/, `${gameSlug}: Preview noindex missing`);
  assert.ok(!gameHtml.includes('rel="canonical"'), `${gameSlug}: Preview canonical must remain absent`);
}

const neon = (await readEntry('games', 'sizzling-neon-jackpot')).data;
assert.equal(neon.rtp, 95.7);
assert.equal(neon.volatilityOriginal, '7');
assert.equal(neon.volatilityNormalized, undefined, 'GoldenRace scale 7 must not be normalized across Providers');
assert.equal(neon.winCount, 10);
assert.deepEqual(neon.features, ['scatter', 'jackpot']);

const leppy = (await readEntry('games', 'leppy-loot')).data;
assert.equal(leppy.rtp, 96);
assert.equal(leppy.maxWinMultiplier, 1000);
assert.equal(leppy.winCount, 20);
assert.ok(leppy.features.includes('sticky-symbols'));

const fruit = (await readEntry('games', 'golden-fruit-vegas-classic')).data;
assert.equal(fruit.rtp, 95);
assert.equal(fruit.volatilityOriginal, 'Very Low');
assert.equal(fruit.volatilityNormalized, undefined, 'Very Low must remain the Provider original label');
assert.equal(fruit.maxWinMultiplier, 200);
assert.equal(fruit.winMechanism, undefined, 'Mancala homepage does not publish the primary win mechanism');

const rite = (await readEntry('games', 'the-rite')).data;
assert.equal(rite.rtp, undefined, 'Mascot official page does not publish an RTP');
assert.equal(rite.volatilityOriginal, 'Med');
assert.equal(rite.winCount, 40);
assert.equal(rite.maxWinMultiplier, undefined);

const armour = (await readEntry('games', 'book-of-armour')).data;
assert.equal(armour.rtp, 97);
assert.equal(armour.winMechanism, 'ways-to-win');
assert.equal(armour.winCount, 243);
assert.equal(armour.gameId, 'BookOfKnights');
assert.match(armour.paylines, /official page labels 243 Paylines/i);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['KingMidas Games', 'Mancala Gaming', 'Mascot Gaming', '1spin4win']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`), `${name}: candidate map status not updated`);
}
for (const hold of ['JDB Gaming 因地區封鎖', 'KA Gaming 與 NetGame 因逐款官方資料不足']) {
  assert.match(map, new RegExp(hold), `${hold}: hold reason missing`);
}
assert.match(map, /下一個主動接續品牌為 7Mojos/);

console.log('PASS: horizontal intake batch 11 published five previously unlisted slot Providers and one source-backed game per Provider while preserving Provider-specific volatility scales, honest missing values and deferred access-limited candidates.');
