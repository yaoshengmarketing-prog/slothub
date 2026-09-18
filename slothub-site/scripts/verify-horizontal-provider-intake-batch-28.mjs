import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['bullshark-games', 'joker-never-retires'],
  ['backseat-gaming', 'radiate'],
  ['kitsune-gaming-studios', 'the-library-kitsune'],
  ['nownow-gaming', 'shadow-treasure'],
  ['playzido', 'chilli-con-cash'],
];

async function readEntry(collection, slug) {
  const source = await readFile(new URL(`../src/content/${collection}/${slug}.md`, import.meta.url), 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  assert.ok(frontmatter, `${collection}/${slug}: missing frontmatter`);
  return { source, data: parse(frontmatter) };
}

for (const [providerSlug, gameSlug] of batch) {
  const [{ data: provider }, { data: game }] = await Promise.all([
    readEntry('providers', providerSlug), readEntry('games', gameSlug),
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

const joker = (await readEntry('games', 'joker-never-retires')).data;
assert.deepEqual(joker.rtpVariants, [96.27, 94.31]);
assert.equal(joker.volatilityOriginal, '4/5');
assert.equal(joker.winMechanism, 'paylines');
assert.equal(joker.winCount, 20);
assert.equal(joker.maxWinMultiplier, 12000);
assert.deepEqual(joker.features, ['cascading', 'free-spins', 'wild', 'multiplier']);

const radiate = (await readEntry('games', 'radiate')).data;
assert.deepEqual(radiate.rtpVariants, [96.01, 94.01, 92.01, 90.01]);
assert.equal(radiate.volatilityOriginal, 'High');
assert.equal(radiate.winMechanism, 'paylines');
assert.equal(radiate.winCount, undefined, 'Radiate must not guess an unpublished payline count');
assert.equal(radiate.maxWinMultiplier, 25000);

const library = (await readEntry('games', 'the-library-kitsune')).data;
assert.equal(library.rtp, undefined);
assert.equal(library.volatilityOriginal, undefined);
assert.equal(library.maxWinMultiplier, undefined);
assert.equal(library.winMechanism, undefined);

const shadow = (await readEntry('games', 'shadow-treasure')).data;
assert.equal(shadow.rtp, undefined);
assert.equal(shadow.reels, '5 reels');
assert.equal(shadow.rows, 4);
assert.equal(shadow.winMechanism, 'paylines');
assert.equal(shadow.maxWinMultiplier, 12000);

const chilli = (await readEntry('games', 'chilli-con-cash')).data;
assert.deepEqual(chilli.rtpVariants, [92.9]);
assert.equal(chilli.winMechanism, 'paylines');
assert.equal(chilli.winCount, 20);
assert.equal(chilli.maxWinMultiplier, undefined, 'feature-scoped 50x must not become the overall max win');
assert.equal(chilli.jackpotType, 'none');

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Playzido', 'Bullshark Games', 'Backseat Gaming', 'Kitsune Gaming Studios', 'NowNow Gaming']) {
  assert.match(map, new RegExp(`\\| \\d+ \\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}[^\\r\\n]*已收錄（1）`));
}
assert.match(map, /Ace Roll.*第 28 批記錄後跳過.*未收錄/);
assert.match(map, /下一個橫向接續位置.*第 205 項 Jinx Gaming/);

console.log('PASS: horizontal intake batch 28 published five first-party-evidenced titles, preserved unknown math fields, and advanced the candidate cursor without guessing or duplication.');
