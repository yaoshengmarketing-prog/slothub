import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['zitro', 'king-fu-frog'],
  ['gaming-realms', 'slingo-sweet-bonanza'],
  ['nailed-it-games', 'big-buzz'],
  ['aurum-signature-studios', 'gold-factory-jackpots-maple-moolah'],
  ['deep-stake-games', 'texas-joker-em'],
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
  assert.equal(String(game.lastVerifiedAt).slice(0, 10), '2026-09-19');
  assert.ok(game.sources.length >= 2, `${gameSlug}: page and image evidence are required`);
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

const frog = (await readEntry('games', 'king-fu-frog')).data;
assert.equal(frog.rtp, undefined);
assert.equal(frog.volatilityOriginal, undefined);
assert.equal(frog.maxWinMultiplier, undefined);
assert.equal(frog.reels, '5');
assert.equal(frog.rows, 3);
assert.equal(frog.winMechanism, 'other');
assert.deepEqual(frog.features, ['multiplier', 'jackpot']);

const slingo = (await readEntry('games', 'slingo-sweet-bonanza')).data;
assert.equal(slingo.gameId, '1530065');
assert.equal(slingo.winMechanism, 'other');
assert.equal(slingo.rtp, undefined);
assert.equal(slingo.volatilityOriginal, undefined);
assert.equal(slingo.maxWinMultiplier, undefined);

const buzz = (await readEntry('games', 'big-buzz')).data;
assert.equal(buzz.maxWinMultiplier, 5000);
assert.deepEqual(buzz.features, ['respins', 'free-spins', 'sticky-symbols']);
assert.equal(buzz.rtp, undefined);
assert.equal(buzz.volatilityOriginal, undefined);

const factory = (await readEntry('games', 'gold-factory-jackpots-maple-moolah')).data;
assert.equal(factory.jackpotType, 'networked');
assert.deepEqual(factory.features, ['jackpot']);
assert.equal(factory.rtp, undefined);
assert.equal(factory.maxWinMultiplier, undefined);

const joker = (await readEntry('games', 'texas-joker-em')).data;
assert.equal(joker.winMechanism, 'other');
assert.equal(joker.jackpotType, 'multiple');
assert.equal(joker.maxWinMultiplier, undefined, 'single hand and jackpot values must not become Max Win');
assert.equal(joker.rtp, undefined);
assert.equal(joker.volatilityOriginal, undefined);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Zitro', 'Gaming Realms', 'Nailed It! Games', 'Aurum Signature Studios', 'Deep Stake Games']) {
  assert.match(map, new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\r\n]*已收錄（1）`));
}
assert.match(map, /網站目前為 272 款 published Game、204 家 published Provider/);
assert.match(map, /下一個橫向接續位置為主表第 213 項 Dragoon Soft/);

console.log('PASS: horizontal intake batch 35 added five traceable provider/game pairs, preserved unsupported values as missing, and advanced the cursor.');
