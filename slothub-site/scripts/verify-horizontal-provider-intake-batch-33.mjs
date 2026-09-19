import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['tom-horn-gaming', 'book-of-spells'],
  ['reelplay', '10000-bass-lightning-blitz'],
  ['synot-games', 'jewels-fortune'],
  ['bigpot-gaming', 'mega-sevens-2'],
  ['gamebeat', 'max-miner'],
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
  assert.equal(String(game.lastVerifiedAt).slice(0, 10), '2026-09-19');
  assert.ok(game.sources.length >= 2, `${gameSlug}: page and image evidence are required`);
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

const spells = (await readEntry('games', 'book-of-spells')).data;
assert.equal(spells.rtp, 96.13);
assert.equal(spells.volatilityOriginal, 'High');
assert.equal(spells.maxWinMultiplier, 5000);
assert.equal(spells.winCount, 9);

const bass = (await readEntry('games', '10000-bass-lightning-blitz')).data;
assert.deepEqual(bass.rtpVariants, [94.36, 96.11]);
assert.equal(bass.winMechanism, 'ways-to-win');
assert.equal(bass.winCount, 10000);
assert.equal(bass.maxWinMultiplier, 10000);

const jewels = (await readEntry('games', 'jewels-fortune')).data;
assert.equal(jewels.rtp, undefined, 'RTP configuration range must not become a primary RTP');
assert.equal(jewels.rtpVariants, undefined, 'A published RTP range must not become two enumerated variants');
assert.equal(jewels.winCount, 243);
assert.ok(jewels.features.includes('cascading'));

const sevens = (await readEntry('games', 'mega-sevens-2')).data;
assert.equal(sevens.rtp, undefined);
assert.equal(sevens.volatilityOriginal, undefined);
assert.equal(sevens.winCount, 1024);
assert.equal(sevens.maxWinMultiplier, 7777);

const miner = (await readEntry('games', 'max-miner')).data;
assert.equal(miner.rtp, 96.36);
assert.equal(miner.volatilityOriginal, 'Medium-High');
assert.equal(miner.winCount, 30);
assert.ok(miner.features.includes('hold-and-spin'));

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Tom Horn Gaming', 'ReelPlay', 'SYNOT Games', 'Bigpot Gaming', 'GameBeat']) {
  assert.match(map, new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\r\n]*已收錄（1）`));
}
assert.match(map, /Hotdog Gaming[^\r\n]*停放頁[^\r\n]*保留待補/);
assert.match(map, /網站目前為 237 款 published Game、179 家 published Provider/);
assert.match(map, /下一個橫向接續位置為主表第 197 項 Prag by PopOK/);

console.log('PASS: horizontal intake batch 33 added five traceable provider/game pairs, preserved unsupported values as missing, recorded the Hotdog domain gap, and advanced the cursor.');
