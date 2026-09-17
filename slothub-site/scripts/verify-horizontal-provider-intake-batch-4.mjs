import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['elk-studios', 'nitropolis'],
  ['endorphina', 'gem-blast'],
  ['evoplay', 'inner-fire'],
  ['greentube', 'book-of-ra-deluxe-win-ways'],
  ['habanero', 'hot-hot-fruit'],
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
  assert.ok(image.size > 20_000, `${gameSlug}: official image asset is unexpectedly small`);

  const [gameHtml, providerHtml] = await Promise.all([
    readFile(new URL(`../dist/games/${gameSlug}/index.html`, import.meta.url), 'utf8'),
    readFile(new URL(`../dist/providers/${providerSlug}/index.html`, import.meta.url), 'utf8'),
  ]);
  assert.match(gameHtml, new RegExp(`/providers/${providerSlug}/`), `${gameSlug}: Provider link missing`);
  assert.match(providerHtml, new RegExp(`/games/${gameSlug}/`), `${providerSlug}: Game link missing`);
  assert.match(gameHtml, /content="noindex,nofollow"/, `${gameSlug}: Preview noindex missing`);
  assert.ok(!gameHtml.includes('rel="canonical"'), `${gameSlug}: Preview canonical must remain absent`);
}

const nitropolis = (await readEntry('games', 'nitropolis')).data;
assert.equal(nitropolis.winMechanism, 'ways-to-win');
assert.equal(nitropolis.winCount, undefined, 'dynamic Ways ceiling must not become a fixed winCount');
assert.equal(nitropolis.rtp, undefined, 'missing official RTP must remain missing');
assert.equal(nitropolis.bonusBuy, true);

const gemBlast = (await readEntry('games', 'gem-blast')).data;
assert.equal(gemBlast.rtp, 96.06);
assert.equal(gemBlast.volatilityOriginal, 'Medium-Low');
assert.equal(gemBlast.volatilityNormalized, undefined, 'Medium-Low must not be forced into the current normalized scale');
assert.equal(gemBlast.winCount, 10);
assert.equal(gemBlast.maxWinMultiplier, undefined, 'symbol payout must not become a whole-game max multiplier');

const innerFire = (await readEntry('games', 'inner-fire')).data;
assert.equal(innerFire.rtp, 96.01);
assert.equal(innerFire.volatilityOriginal, 'HIGH HIGH');
assert.equal(innerFire.volatilityNormalized, undefined, 'Evoplay original scale must remain distinct');
assert.equal(innerFire.maxWinMultiplier, undefined, 'currency-denominated max label must not become a stake multiplier');
assert.match(innerFire.maxWinLabelOriginal, /€761,100/);

const book = (await readEntry('games', 'book-of-ra-deluxe-win-ways')).data;
assert.equal(book.winMechanism, 'ways-to-win');
assert.equal(book.winCount, undefined, 'dynamic Win Ways ceiling must not become a fixed winCount');
assert.equal(book.rtp, undefined, 'RTP must remain missing without a version-matched source');
assert.equal(book.bonusBuy, true);

const fruit = (await readEntry('games', 'hot-hot-fruit')).data;
assert.equal(fruit.volatilityOriginal, 'VERY HIGH');
assert.equal(fruit.volatilityNormalized, 'very-high');
assert.equal(fruit.maxWinMultiplier, 5087);
assert.equal(fruit.rtp, undefined, 'approximate RTP options must not become exact schema values');
assert.deepEqual(fruit.rtpVariants, undefined, 'approximate RTP options must not become exact variants');
assert.equal(fruit.gameId, 'SGHotHotFruit');

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['ELK Studios', 'Endorphina', 'Evoplay', 'Greentube', 'Habanero']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`), `${name}: candidate map status not updated`);
}
assert.match(map, /橫向未收錄 Provider 隊列.*下一批從 IGT PlayDigital 接續/);
assert.match(map, /Evolution 因現有官方類型不屬 Slots 而跳過/);

console.log('PASS: horizontal intake batch 4 published five previously unlisted slot Providers and one source-backed game per Provider without manufacturing fixed counts, normalized scales, multipliers or exact RTP values.');
