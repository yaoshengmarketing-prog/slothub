import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['funky-games', 'happy-hour-fruit-slot'],
  ['kiss-gaming', 'jungle-treasure'],
  ['aspect-gaming', 'doggone-lucky'],
  ['ricochet', 'stairway-to-cash'],
  ['clutch-gaming', 'deadeye'],
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

const funky = (await readEntry('games', 'happy-hour-fruit-slot')).data;
assert.equal(funky.winMechanism, 'other');
assert.equal(funky.rtp, undefined);
assert.equal(funky.volatilityOriginal, undefined);
assert.equal(funky.maxWinMultiplier, undefined);

const jungle = (await readEntry('games', 'jungle-treasure')).data;
assert.equal(jungle.rtp, 97.29);
assert.equal(jungle.maxWinMultiplier, 2000);
assert.equal(jungle.reels, '4');
assert.equal(jungle.winMechanism, 'other');
assert.deepEqual(jungle.features, ['respins', 'jackpot']);

const doggone = (await readEntry('games', 'doggone-lucky')).data;
assert.equal(doggone.rtp, 94.01);
assert.equal(doggone.volatilityOriginal, 'Medium');
assert.equal(doggone.maxWinMultiplier, 1000);
assert.equal(doggone.winCount, 30);

const stairway = (await readEntry('games', 'stairway-to-cash')).data;
assert.deepEqual(stairway.rtpVariants, [96, 94, 92, 90]);
assert.equal(stairway.rtp, undefined);
assert.equal(stairway.maxWinMultiplier, 16500);
assert.equal(stairway.rows, undefined);
assert.equal(stairway.winCount, 20);
assert.equal(stairway.bonusBuy, true);

const deadeye = (await readEntry('games', 'deadeye')).data;
assert.equal(deadeye.rtp, 96.33);
assert.equal(deadeye.volatilityOriginal, 'Very High');
assert.equal(deadeye.maxWinMultiplier, 20000);
assert.deepEqual(deadeye.features, ['wild', 'multiplier', 'sticky-symbols']);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Funky Games', 'KISS Gaming', 'Aspect Gaming', 'Ricochet', 'Clutch Gaming']) {
  assert.match(map, new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\r\n]*已收錄（1）`));
}
assert.match(map, /本批待發布資料納入建置時為 277 款 published Game、209 家 published Provider/);
assert.match(map, /下一個橫向接續位置為主表第 213 項 Dragoon Soft/);

console.log('PASS: horizontal intake batch 37 added five traceable provider/game pairs, preserved unsupported values as missing, and advanced the cursor.');
