import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['lightning-box', 'lightning-gorilla'],
  ['live-5', 'win-in-rome'],
  ['pariplay', 'wild-fruit-super-wheel'],
  ['rogue', 'wild-whopper'],
  ['wmg', 'fowl-play-gold'],
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

const lightning = (await readEntry('games', 'lightning-gorilla')).data;
assert.equal(lightning.rtp, 96.18);
assert.equal(lightning.winMechanism, 'ways-to-win');
assert.equal(lightning.winCount, 1024);
assert.equal(lightning.maxWinMultiplier, undefined, 'unqualified Top Prize must not become an x-bet Max Win');

const rome = (await readEntry('games', 'win-in-rome')).data;
assert.equal(rome.rtp, undefined);
assert.equal(rome.maxWinMultiplier, undefined, 'over 300x wording must remain an original label');
assert.deepEqual(rome.features, ['free-spins', 'wild', 'multiplier']);

const fruit = (await readEntry('games', 'wild-fruit-super-wheel')).data;
assert.equal(fruit.rtp, undefined);
assert.equal(fruit.winMechanism, undefined);
assert.deepEqual(fruit.features, ['wild', 'multiplier']);

const whopper = (await readEntry('games', 'wild-whopper')).data;
assert.equal(whopper.rtp, 94);
assert.equal(whopper.maxWinMultiplier, 16600);
assert.equal(whopper.winMechanism, undefined, 'ambiguous Lines/Ways label must not be normalized');
assert.deepEqual(whopper.features, ['free-spins', 'wild', 'multiplier', 'cascading']);

const fowl = (await readEntry('games', 'fowl-play-gold')).data;
assert.equal(fowl.rtp, undefined);
assert.equal(fowl.maxWinMultiplier, undefined);
assert.equal(fowl.features, undefined);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Lightning Box', 'Live 5', 'Pariplay', 'Rogue', 'WMG']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`));
}
assert.match(map, /第十九批完成 Lightning Box、Live 5、Pariplay、Rogue 與 WMG/);

console.log('PASS: horizontal intake batch 19 published five identity-confirmed slot Providers with one official game each while preserving hybrid, aggregation, ambiguous mechanism and missing-value boundaries.');
