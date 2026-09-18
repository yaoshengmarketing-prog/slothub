import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['aristocrat-gaming', 'best-bet'],
  ['aruze-gaming-global', 'loaded-up-riches-pots'],
  ['bf-games', 'cave-of-fortune'],
  ['bluberi', 'shoot-for-the-loot'],
  ['ct-gaming', 'game-for-tuna'],
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
  assert.equal(String(game.lastVerifiedAt).slice(0, 10), '2026-09-17', `${gameSlug}: verification date mismatch`);
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

const bestBet = (await readEntry('games', 'best-bet')).data;
assert.equal(bestBet.rtp, undefined, 'land-based product page must not create an inferred RTP');
assert.equal(bestBet.volatilityOriginal, undefined, 'land-based product page must not create an inferred volatility');
assert.equal(bestBet.maxWinMultiplier, undefined, 'land-based product page must not create an inferred Max Win');
assert.deepEqual(bestBet.features, ['free-spins', 'hold-and-spin', 'jackpot']);

const pots = (await readEntry('games', 'loaded-up-riches-pots')).data;
assert.equal(pots.rtp, undefined);
assert.equal(pots.volatilityOriginal, undefined);
assert.equal(pots.maxWinMultiplier, undefined);
assert.deepEqual(pots.features, ['free-spins']);

const cave = (await readEntry('games', 'cave-of-fortune')).data;
assert.equal(cave.rtp, undefined, 'three configurations must not become one primary RTP');
assert.deepEqual(cave.rtpVariants, [92.13, 94.15, 96.04]);
assert.equal(cave.volatilityOriginal, 'High');
assert.equal(cave.volatilityNormalized, 'high');
assert.equal(cave.maxWinMultiplier, 525);
assert.equal(cave.winCount, 30);

const shoot = (await readEntry('games', 'shoot-for-the-loot')).data;
assert.equal(shoot.rtp, undefined);
assert.equal(shoot.volatilityOriginal, 'Medium');
assert.equal(shoot.volatilityNormalized, 'medium');
assert.equal(shoot.maxWinMultiplier, undefined);

const tuna = (await readEntry('games', 'game-for-tuna')).data;
assert.equal(tuna.rtp, undefined, 'two payout configurations must not become one primary RTP');
assert.deepEqual(tuna.rtpVariants, [96.58, 95.53]);
assert.equal(tuna.volatilityOriginal, '4/5');
assert.equal(tuna.volatilityNormalized, undefined, 'CT Gaming star scale must stay original-only');
assert.equal(tuna.maxWinMultiplier, undefined, 'Top Award without a stated basis must not become a bet multiplier');
assert.match(tuna.maxWinLabelOriginal, /basis not stated/);
assert.equal(tuna.winCount, 30);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Aristocrat Gaming', 'Aruze Gaming Global', 'BF Games', 'Bluberi', 'CT Gaming']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`), `${name}: candidate map status not updated`);
}
assert.match(map, /AGS、Amigo Gaming[^\n]+既有待補原因維持/);

console.log('PASS: horizontal intake batch 9 published five previously unlisted slot Providers and one source-backed game per Provider while preserving land-based product boundaries, RTP variants, original volatility scales and unstated Max Win bases.');
