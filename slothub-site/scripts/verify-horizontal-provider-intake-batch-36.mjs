import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['fastspin', 'frosty-and-flamy'],
  ['ka-gaming', 'bonus-mania'],
  ['realistic-games', 'destination-atlantis'],
  ['acewin-gaming', 'pirate-riches'],
  ['advantplay', 'dragon-chis-quest-2'],
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

const frosty = (await readEntry('games', 'frosty-and-flamy')).data;
assert.equal(frosty.rtp, 96.87);
assert.equal(frosty.volatilityOriginal, 'Medium');
assert.equal(frosty.winMechanism, 'ways-to-win');
assert.equal(frosty.winCount, 15625);
assert.equal(frosty.maxWinMultiplier, undefined);

const mania = (await readEntry('games', 'bonus-mania')).data;
assert.equal(mania.rtp, undefined);
assert.equal(mania.volatilityOriginal, undefined);
assert.equal(mania.maxWinMultiplier, undefined);
assert.equal(mania.reels, '3 + 1 Bonus Reel');
assert.deepEqual(mania.features, ['multiplier', 'respins']);

const atlantis = (await readEntry('games', 'destination-atlantis')).data;
assert.equal(atlantis.rtp, 96.09);
assert.equal(atlantis.volatilityOriginal, 'High');
assert.equal(atlantis.maxWinMultiplier, 22000);
assert.equal(atlantis.winCount, 21609);
assert.equal(atlantis.bonusBuy, true);

const pirate = (await readEntry('games', 'pirate-riches')).data;
assert.equal(pirate.gameId, '1024');
assert.equal(pirate.winMechanism, 'other');
assert.equal(pirate.rtp, undefined);
assert.equal(pirate.volatilityOriginal, undefined);
assert.equal(pirate.maxWinMultiplier, undefined);

const dragon = (await readEntry('games', 'dragon-chis-quest-2')).data;
assert.equal(dragon.rtp, 97.01);
assert.equal(dragon.reels, '6');
assert.equal(dragon.winMechanism, 'ways-to-win');
assert.deepEqual(dragon.features, ['scatter']);
assert.equal(dragon.volatilityOriginal, undefined);
assert.equal(dragon.maxWinMultiplier, undefined);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Fastspin', 'KA Gaming', 'Realistic Games', 'AceWin Gaming', 'AdvantPlay']) {
  assert.match(map, new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\r\n]*已收錄（1）`));
}
for (const name of ['Almond Gaming', 'Hotdog Gaming', 'Win Fast', 'Ace Roll', 'Zerplaay Games']) {
  assert.match(map, new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\r\n]*待補`));
}
assert.match(map, /本批待發布資料納入建置時為 277 款 published Game、209 家 published Provider/);
assert.match(map, /下一個橫向接續位置為主表第 213 項 Dragoon Soft/);

console.log('PASS: horizontal intake batch 36 added five traceable provider/game pairs, resolved four recorded evidence gaps, preserved unsupported values as missing, and advanced the cursor.');
