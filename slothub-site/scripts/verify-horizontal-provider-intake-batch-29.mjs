import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['jinx-gaming', 'dead-headz'],
  ['pineapple-play', 'coconut-chaos'],
  ['foxhound-games', 'mortal-oath'],
  ['good-times-studios', 'avalanche-good-times'],
  ['aloha-gaming', 'tikitopia-boosterbelt'],
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

const deadHeadz = (await readEntry('games', 'dead-headz')).data;
assert.equal(deadHeadz.rtp, undefined);
assert.deepEqual(deadHeadz.rtpVariants, []);
assert.deepEqual(deadHeadz.bonusFeatures, ['Shoot & Loot Waves']);

const coconut = (await readEntry('games', 'coconut-chaos')).data;
assert.equal(coconut.rtp, undefined);
assert.equal(coconut.volatilityOriginal, '3/5');
assert.equal(coconut.volatilityNormalized, undefined, '3/5 must not be silently mapped to a cross-provider scale');

const mortalOath = (await readEntry('games', 'mortal-oath')).data;
assert.deepEqual(mortalOath.bonusFeatures, ['Corrupted Hunter', 'Night of the Hunt']);
assert.equal(mortalOath.maxWinMultiplier, undefined);

const avalanche = (await readEntry('games', 'avalanche-good-times')).data;
assert.equal(avalanche.rtp, undefined);
assert.equal(avalanche.volatilityOriginal, undefined);
assert.equal(avalanche.winMechanism, undefined);

const tikitopia = (await readEntry('games', 'tikitopia-boosterbelt')).data;
assert.equal(tikitopia.volatilityOriginal, 'Medium');
assert.equal(tikitopia.rtp, undefined);
assert.deepEqual(tikitopia.bonusFeatures, ['BoosterBelt']);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Jinx Gaming', 'Pineapple Play', 'Foxhound Games', 'Good Times Studios', 'Aloha Gaming']) {
  assert.match(map, new RegExp(`\\| \\d+ \\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}[^\\r\\n]*已收錄（1）`));
}
assert.match(map, /網站目前為 217 款 published Game、159 家 published Provider/);
assert.match(map, /下一個橫向接續位置.*第 211 項 Zerplaay Games/);

console.log('PASS: horizontal intake batch 29 added five traceable provider/game pairs, preserved unsupported math fields as missing, and advanced the candidate cursor.');
