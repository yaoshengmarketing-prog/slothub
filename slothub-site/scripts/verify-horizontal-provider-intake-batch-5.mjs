import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['igt-playdigital', 'whitney-houston-slots'],
  ['kalamba-games', 'golden-kegs-50k'],
  ['light-and-wonder', 'hell-of-a-deal'],
  ['nolimit-city', 'space-arcade'],
  ['peter-and-sons', 'barbarossa-revenge'],
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

const whitney = (await readEntry('games', 'whitney-houston-slots')).data;
assert.equal(whitney.rtp, undefined, 'unpublished online-version RTP must remain missing');
assert.equal(whitney.volatilityOriginal, undefined, 'unpublished volatility must remain missing');
assert.equal(whitney.maxWinMultiplier, undefined, 'jackpot tiers must not become a whole-game max multiplier');
assert.equal(whitney.jackpotType, 'networked');

const kegs = (await readEntry('games', 'golden-kegs-50k')).data;
assert.equal(kegs.winMechanism, 'ways-to-win');
assert.equal(kegs.winCount, undefined, 'dynamic Ways without an exact published count must remain missing');
assert.equal(kegs.rtp, undefined, 'unpublished public-page RTP must remain missing');
assert.equal(kegs.bonusBuy, true);

const hell = (await readEntry('games', 'hell-of-a-deal')).data;
assert.equal(hell.rtp, undefined, 'RTP variants must not be promoted to a single primary value');
assert.deepEqual(hell.rtpVariants, [96, 94, 92, 90, 87]);
assert.equal(hell.winMechanism, 'paylines');
assert.equal(hell.winCount, 20);
assert.equal(hell.maxWinMultiplier, 500);

const space = (await readEntry('games', 'space-arcade')).data;
assert.equal(space.rtp, 96.47);
assert.equal(space.volatilityOriginal, '3/10');
assert.equal(space.volatilityNormalized, undefined, 'Nolimit City 3/10 must not be forced into the normalized label scale');
assert.equal(space.maxWinMultiplier, 535);
assert.equal(space.winCount, 9);

const barbarossa = (await readEntry('games', 'barbarossa-revenge')).data;
assert.equal(barbarossa.rtp, 96.43);
assert.equal(barbarossa.volatilityOriginal, 'VERY-HIGH');
assert.equal(barbarossa.volatilityNormalized, 'very-high');
assert.equal(barbarossa.maxWinMultiplier, 30000);
assert.equal(barbarossa.winCount, 243);
assert.equal(barbarossa.bonusBuy, true);
assert.match(barbarossa.summary, /現行官方頁記錄 96\.43% RTP/);
assert.equal(barbarossa.rtpVariants, undefined, 'no unsupported RTP variants may be inferred');
assert.ok(!barbarossa.sources.some((entry) => entry.url.includes('Barbarossa-Revenge_Game-sheet.pdf')), 'unreachable historical sheet must not remain published');

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['IGT PlayDigital', 'Kalamba Games', 'Light & Wonder', 'Nolimit City', 'Peter & Sons']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`), `${name}: candidate map status not updated`);
}
assert.match(map, /橫向未收錄 Provider 的這輪 20 家已由第十二至十五批完成/, 'candidate map must preserve progress beyond batch 5');

console.log('PASS: horizontal intake batch 5 published five previously unlisted slot Providers and one source-backed game per Provider while preserving missing values, original scales and source conflicts.');
