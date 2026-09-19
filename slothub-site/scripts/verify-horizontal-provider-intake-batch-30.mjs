import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['betixon', 'great-india'],
  ['fugaso', 'almighty-hot-wins'],
  ['mobilots', 'voodoo-elixir'],
  ['godzislots', 'golden-sun-aztec'],
  ['bng', '3-fortune-trees'],
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

const greatIndia = (await readEntry('games', 'great-india')).data;
assert.equal(greatIndia.winMechanism, 'ways-to-win');
assert.equal(greatIndia.rtp, undefined);
assert.equal(greatIndia.volatilityOriginal, undefined);
assert.equal(greatIndia.maxWinMultiplier, undefined);

const almighty = (await readEntry('games', 'almighty-hot-wins')).data;
assert.equal(almighty.rtp, 96.5);
assert.equal(almighty.volatilityOriginal, 'Medium-High');
assert.equal(almighty.maxWinMultiplier, 1000);
assert.equal(almighty.winCount, 100);

const voodoo = (await readEntry('games', 'voodoo-elixir')).data;
assert.equal(voodoo.rtp, 98);
assert.equal(voodoo.volatilityOriginal, 'Low-Medium');
assert.equal(voodoo.volatilityNormalized, undefined, 'Low-Medium must not be forced into the shared scale');
assert.equal(voodoo.maxWinMultiplier, 2500);
assert.ok(voodoo.features.includes('cascading'));

const goldenSun = (await readEntry('games', 'golden-sun-aztec')).data;
assert.equal(goldenSun.rtp, 96);
assert.equal(goldenSun.maxWinLabelOriginal, '10000X+');
assert.equal(goldenSun.maxWinMultiplier, undefined, '10000X+ is not an exact upper bound');
assert.equal(goldenSun.bonusBuy, true);

const fortuneTrees = (await readEntry('games', '3-fortune-trees')).data;
assert.equal(fortuneTrees.winCount, 25);
assert.equal(fortuneTrees.rtp, undefined);
assert.equal(fortuneTrees.volatilityOriginal, undefined);
assert.equal(fortuneTrees.maxWinMultiplier, undefined);
assert.equal(fortuneTrees.maxWinLabelOriginal, 'Grand Jackpot 1000TB');

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Betixon', 'FUGASO', 'Mobilots', 'GodziSlots', 'BNG／Booongo']) {
  assert.match(map, new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\r\n]*已收錄（1）`));
}
for (const name of ['Zerplaay Games', 'Dragoon Soft', 'Leander Games']) {
  assert.match(map, new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\r\n]*保留待補`));
}
assert.match(map, /Clutch Gaming[^\r\n]*已收錄（1）/);
assert.match(map, /Spearhead Studios[^\r\n]*已收錄（1）/);
assert.match(map, /第一至三十批完成時的歷史基線為 222 款 published Game、164 家 published Provider/);
assert.match(map, /第 30 批已依序實跑到 BNG／Booongo，完成五家並保存五家跳過原因/);
assert.match(map, /第 31 批由 AGS 接續/);

console.log('PASS: horizontal intake batch 30 added five traceable provider/game pairs, preserved unsupported values as missing, recorded five skips, and advanced the cursor.');
