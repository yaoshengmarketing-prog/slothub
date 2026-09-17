import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['amatic-industries', 'book-of-aztec'],
  ['amusnet', '40-golden-coins'],
  ['avatarux', 'poprocks'],
  ['betsoft-gaming', 'the-game-show'],
  ['blueprint-gaming', 'eye-of-horus'],
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

const book = (await readEntry('games', 'book-of-aztec')).data;
assert.equal(book.rtp, undefined, 'AMATIC catalog does not publish an RTP for Book Of Aztec');
assert.equal(book.winMechanism, undefined, 'AMATIC catalog does not publish a mechanism for Book Of Aztec');

const coins = (await readEntry('games', '40-golden-coins')).data;
assert.equal(coins.rtp, 96.52);
assert.equal(coins.winCount, 40);
assert.equal(coins.maxWinMultiplier, undefined, 'Per-line max label must not become a whole-game max multiplier');
assert.match(coins.maxWinLabelOriginal, /per line/);

const poprocks = (await readEntry('games', 'poprocks')).data;
assert.equal(poprocks.rtp, 96.4);
assert.equal(poprocks.volatilityOriginal, 'Super High');
assert.equal(poprocks.winCount, 33614);

const gameShow = (await readEntry('games', 'the-game-show')).data;
assert.equal(gameShow.rtp, 96.18);
assert.equal(gameShow.winCount, 1024);
assert.ok(gameShow.features.includes('free-spins'));

const horus = (await readEntry('games', 'eye-of-horus')).data;
assert.deepEqual(horus.rtpVariants, [96.31, 94, 93, 92.04, 90.25]);
assert.equal(horus.volatilityOriginal, undefined, 'Missing official volatility must remain missing');
assert.equal(horus.maxWinMultiplier, undefined, 'Missing official whole-game max win must remain missing');

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Amatic Industries', 'Amusnet', 'AvatarUX', 'Betsoft Gaming', 'Blueprint Gaming']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`), `${name}: candidate map status not updated`);
}
assert.match(map, /橫向未收錄 Provider 隊列.*從 ELK Studios 接續/);

console.log('PASS: horizontal intake batch 3 published five previously unlisted Providers and one source-backed slot per Provider while preserving missing and differently-scoped values.');
