import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['ct-interactive', 'enchanted-woods'],
  ['fa-chai-gaming', 'chilihuahua'],
  ['gameart', '20-hot-super-fruits'],
  ['gamzix', '3x5-joker-hold-the-spin'],
  ['inspired-entertainment', 'slots-o-luck'],
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

const woods = (await readEntry('games', 'enchanted-woods')).data;
assert.equal(woods.winMechanism, 'other');
assert.equal(woods.maxWinMultiplier, undefined, 'unstated Maximum Win basis must not enter unified comparison');
assert.match(woods.maxWinLabelOriginal, /basis not stated/);

const chili = (await readEntry('games', 'chilihuahua')).data;
assert.equal(chili.rtp, 96.5);
assert.equal(chili.volatilityOriginal, 'Medium');
assert.equal(chili.maxWinMultiplier, 10000);
assert.equal(chili.winMechanism, 'megaways');
assert.equal(chili.bonusBuy, true);

const fruits = (await readEntry('games', '20-hot-super-fruits')).data;
assert.equal(fruits.rtp, undefined, 'official release does not supply an RTP');
assert.equal(fruits.winCount, 20);
assert.equal(fruits.maxWinMultiplier, 3000);
assert.deepEqual(fruits.features, ['wild', 'bonus-buy', 'respins']);

const joker = (await readEntry('games', '3x5-joker-hold-the-spin')).data;
assert.equal(joker.rtp, 96);
assert.deepEqual(joker.rtpVariants, [96, 92, 94, 95]);
assert.equal(joker.volatilityOriginal, 'Medium');
assert.equal(joker.maxWinMultiplier, 2000);
assert.equal(joker.winCount, 11);

const luck = (await readEntry('games', 'slots-o-luck')).data;
assert.equal(luck.rtp, 95);
assert.equal(luck.winCount, 40);
assert.equal(luck.volatilityOriginal, undefined);
assert.equal(luck.maxWinMultiplier, undefined);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['CT Interactive', 'FA CHAI Gaming', 'GameArt', 'Gamzix', 'Inspired Entertainment']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`), `${name}: candidate map status not updated`);
}
assert.match(map, /Galaxsys[^\n]+官方作品圖受存取限制/);
assert.match(map, /下一個主動接續品牌為 GoldenRace/);

console.log('PASS: horizontal intake batch 10 published five previously unlisted slot Providers and one source-backed game per Provider while preserving original RTP variants, unsupported Max Win bases and the Galaxsys image-access hold.');
