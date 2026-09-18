import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['gamomat', 'the-book-beyond-2'],
  ['incredible-technologies', 'upshot-prosperity-rising'],
  ['king-show-games', 'fishing-bob-1024-ways-hot-roll-jackpots'],
  ['boomerang-studios', '3-wonders-luck-of-stallion'],
  ['four-leaf-gaming', 'push-the-button'],
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
  assert.ok(game.sources.length >= 1, `${gameSlug}: first-party source evidence is required`);
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

const book = (await readEntry('games', 'the-book-beyond-2')).data;
assert.equal(book.rtp, 96.13);
assert.equal(book.volatilityOriginal, 'Very High');
assert.equal(book.winMechanism, undefined, 'unsupported mechanism must remain missing');

const upshot = (await readEntry('games', 'upshot-prosperity-rising')).data;
assert.equal(upshot.rtp, 90.08);
assert.equal(upshot.reels, '3x5', 'official layout order must be preserved');
assert.equal(upshot.maxWinMultiplier, undefined);

const fishingBob = (await readEntry('games', 'fishing-bob-1024-ways-hot-roll-jackpots')).data;
assert.deepEqual(fishingBob.rtpVariants, [96, 95.01, 94.03, 91.99, 88.02]);
assert.equal(fishingBob.winMechanism, 'ways-to-win');
assert.equal(fishingBob.winCount, 1024);

const wonders = (await readEntry('games', '3-wonders-luck-of-stallion')).data;
assert.deepEqual(wonders.rtpVariants, [96, 94, 92.02]);
assert.equal(wonders.winMechanism, undefined);

const button = (await readEntry('games', 'push-the-button')).data;
assert.deepEqual(button.rtpVariants, [96.1, 94.07, 92.07]);
assert.equal(button.volatilityOriginal, 'Medium/High');
assert.equal(button.winMechanism, undefined);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['GAMOMAT', 'Incredible Technologies', 'King Show Games', 'Boomerang Studios', 'Four Leaf Gaming']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`));
}
assert.match(map, /Win Fast .*缺少可直接歸屬的具名作品證據.*\| 未收錄 \|/);
console.log('PASS: horizontal intake batch 16 published five identity-confirmed slot brands with one traceable official game each, while preserving Win Fast as a documented skip and unsupported fields as missing.');
