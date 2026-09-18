import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['atlantic-digital', 'friends-the-one-with-the-multi-drop'],
  ['design-works-gaming', '10x-fortune'],
  ['high-5-games', 'a-visit-from-st-nick'],
  ['hot-rise-games', '98-bounty-hot-1'],
  ['pixiu-gaming', 'lucky-8-golden-dragon'],
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

const friends = (await readEntry('games', 'friends-the-one-with-the-multi-drop')).data;
assert.equal(friends.rtp, 94.25);
assert.equal(friends.volatilityNormalized, 'medium-high');
assert.equal(friends.maxWinMultiplier, 5000);
assert.equal(friends.winMechanism, 'cluster-pays');
assert.deepEqual(friends.features, ['free-spins', 'multiplier']);

const fortune = (await readEntry('games', '10x-fortune')).data;
assert.equal(fortune.winMechanism, 'paylines');
assert.equal(fortune.winCount, 5);
assert.equal(fortune.rtp, undefined, 'Unpublished RTP must stay missing');
assert.deepEqual(fortune.features, ['free-spins', 'wild', 'multiplier']);

const nick = (await readEntry('games', 'a-visit-from-st-nick')).data;
assert.equal(nick.reels, '5 reels');
assert.equal(nick.rows, 3);
assert.equal(nick.winMechanism, 'ways-to-win');
assert.equal(nick.winCount, 243);
assert.equal(nick.rtp, undefined, 'Unpublished RTP must stay missing');

const bounty = (await readEntry('games', '98-bounty-hot-1')).data;
assert.equal(bounty.reels, 'Variable reel set');
assert.equal(bounty.winMechanism, 'ways-to-win');
assert.equal(bounty.winCount, undefined, 'A variable maximum Ways label must not become a fixed winCount');
assert.equal(bounty.rtp, undefined, 'Unpublished RTP must stay missing');

const dragon = (await readEntry('games', 'lucky-8-golden-dragon')).data;
assert.equal(dragon.rtp, 95.63);
assert.deepEqual(dragon.rtpVariants, [95.63, 94.71]);
assert.equal(dragon.maxWinMultiplier, 4108);
assert.equal(dragon.winMechanism, 'paylines');
assert.equal(dragon.winCount, 20);
assert.equal(dragon.jackpotType, 'none');

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Atlantic Digital', 'Design Works Gaming', 'High 5 Games', 'Hot Rise Games', 'Pixiu Gaming']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`));
}
assert.match(map, /Nazionale Elettronica .*保留待補 .*未收錄/);
assert.match(map, /第二十四批完成 Atlantic Digital、Design Works Gaming、High 5 Games、Hot Rise Games 與 Pixiu Gaming/);

console.log('PASS: horizontal intake batch 24 published five first-party-source slot titles, preserved conditional and missing values, and deferred incompatible AWP-only evidence without guessing.');
