import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['spinomenal', 'spinning-beers'],
  ['stakelogic', 'origins'],
  ['swintt', 'pyramid-of-light'],
  ['tada-gaming', 'lucky-jaguar-500'],
  ['wazdan', 'spectrum'],
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

const beers = (await readEntry('games', 'spinning-beers')).data;
assert.equal(beers.rtp, undefined, 'multiple RTP configurations must not become one primary value');
assert.deepEqual(beers.rtpVariants, [88.94, 92.06, 93.51, 96.04]);
assert.equal(beers.winCount, undefined, 'selectable 10-100 paylines must not become one fixed winCount');
assert.equal(beers.maxWinMultiplier, 3000);

const origins = (await readEntry('games', 'origins')).data;
assert.equal(origins.rtp, 96.01);
assert.equal(origins.volatilityOriginal, '5/5');
assert.equal(origins.maxWinMultiplier, 20000);
assert.equal(origins.winCount, 243);
assert.equal(origins.bonusBuy, true);

const pyramid = (await readEntry('games', 'pyramid-of-light')).data;
assert.equal(pyramid.winMechanism, undefined, 'conflicting 5 fixed paylines / 5 Ways labels must not be normalized');
assert.equal(pyramid.winCount, undefined, 'conflicting payout-mechanic labels must not produce a fixed count');
assert.match(pyramid.paylines, /5 fixed paylines.*5 Ways/);
assert.deepEqual(pyramid.rtpVariants, [85.15, 90.07, 92.1, 95.06]);

const jaguar = (await readEntry('games', 'lucky-jaguar-500')).data;
assert.equal(jaguar.rtp, 97);
assert.equal(jaguar.volatilityOriginal, 'Med');
assert.equal(jaguar.maxWinMultiplier, 20000);
assert.equal(jaguar.winCount, 5);

const spectrum = (await readEntry('games', 'spectrum')).data;
assert.equal(spectrum.rtp, 96.53);
assert.equal(spectrum.volatilityOriginal, 'Low-Medium');
assert.equal(spectrum.volatilityNormalized, undefined, 'Low-Medium must remain an original label without forced normalization');
assert.equal(spectrum.maxWinMultiplier, 500);
assert.equal(spectrum.winCount, 10);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Spinomenal', 'Stakelogic', 'Swintt', 'TaDa Gaming', 'Wazdan']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`), `${name}: candidate map status not updated`);
}
assert.match(map, /SPRIBE 目前的確認類型為 Crash／Table／Casual/);
assert.match(map, /Playtech 因缺少可辨識的作品圖持續保留待補/);
assert.match(map, /下一個主動接續品牌為 Wizard Games/);

console.log('PASS: horizontal intake batch 7 published five previously unlisted slot Providers and one source-backed game per Provider while preserving selectable configurations, source conflicts and original scales.');
