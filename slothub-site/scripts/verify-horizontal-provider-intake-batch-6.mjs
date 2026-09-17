import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['playson', 'flaming-bells-hold-and-win'],
  ['quickspin', 'spinions-game-day'],
  ['red-rake-gaming', '3-dragons-rake-it-in'],
  ['red-tiger-gaming', '777-super-strike'],
  ['rubyplay', 'book-of-8-riches'],
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

const flaming = (await readEntry('games', 'flaming-bells-hold-and-win')).data;
assert.equal(flaming.rtp, undefined, 'Grand Jackpot label must not become an RTP value');
assert.equal(flaming.maxWinMultiplier, undefined, 'Grand Jackpot label must not become the whole-game Max Win');
assert.equal(flaming.winCount, 5);
assert.equal(flaming.jackpotType, 'multiple');

const spinions = (await readEntry('games', 'spinions-game-day')).data;
assert.equal(spinions.rtp, undefined, 'RTP models must not be promoted to one primary value');
assert.deepEqual(spinions.rtpVariants, [96, 94, 87]);
assert.equal(spinions.winCount, 10);
assert.equal(spinions.bonusBuy, true);

const dragons = (await readEntry('games', '3-dragons-rake-it-in')).data;
assert.equal(dragons.rtp, undefined, 'unverified RTP must remain missing');
assert.equal(dragons.volatilityOriginal, undefined, 'unverified volatility must remain missing');
assert.equal(dragons.maxWinMultiplier, undefined, 'unverified Max Win must remain missing');
assert.equal(dragons.winCount, 10);

const strike = (await readEntry('games', '777-super-strike')).data;
assert.equal(strike.rtp, 95.72);
assert.equal(strike.rtpVariants, undefined, 'different jackpot configurations must not be flattened into variants');
assert.equal(strike.volatilityOriginal, '5/5 (High)');
assert.equal(strike.volatilityNormalized, 'high');
assert.equal(strike.maxWinMultiplier, 2649);
assert.equal(strike.winCount, 243);
assert.equal(strike.bonusBuy, true);

const riches = (await readEntry('games', 'book-of-8-riches')).data;
assert.equal(riches.rtp, 96.9);
assert.equal(riches.volatilityOriginal, 'Medium/High');
assert.equal(riches.volatilityNormalized, 'medium-high');
assert.equal(riches.maxWinMultiplier, 8000);
assert.equal(riches.winCount, 10);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Playson', 'Quickspin', 'Red Rake Gaming', 'Red Tiger Gaming', 'RubyPlay']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`), `${name}: candidate map status not updated`);
}
assert.match(map, /Playtech[^\n]+保留待補[^\n]+不以通用媒體圖代替/);
assert.match(map, /下一個主動接續品牌為 [^。]+/);

console.log('PASS: horizontal intake batch 6 published five previously unlisted slot Providers and one source-backed game per Provider while preserving missing values, original scales and configuration boundaries.');
