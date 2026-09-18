import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['ags', 'imperial-fortunes'],
  ['nextspin', 'big-caishen'],
  ['novomatic-gaming', 'book-of-ra-magic-wheel'],
  ['octoplay', '2-lucky-fellas-hold-win'],
  ['onlyplay', 'tiger-jackpots'],
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

const imperial = (await readEntry('games', 'imperial-fortunes')).data;
assert.equal(imperial.rtp, undefined);
assert.equal(imperial.volatilityOriginal, undefined);
assert.equal(imperial.maxWinMultiplier, undefined);
assert.ok(imperial.features.includes('wild'));
assert.ok(imperial.features.includes('jackpot'));

const caishen = (await readEntry('games', 'big-caishen')).data;
assert.equal(caishen.rtp, 97.04);
assert.equal(caishen.volatilityOriginal, 'Medium');
assert.equal(caishen.winMechanism, 'ways-to-win');
assert.equal(caishen.winCount, 32400);
assert.equal(caishen.bonusBuy, true);

const book = (await readEntry('games', 'book-of-ra-magic-wheel')).data;
assert.equal(String(book.volatilityOriginal), '5');
assert.equal(book.volatilityNormalized, undefined, 'NOVOMATIC 5 must not be forced into a cross-provider label');
assert.equal(book.winMechanism, 'paylines');
assert.equal(book.winCount, 10);

const fellas = (await readEntry('games', '2-lucky-fellas-hold-win')).data;
assert.equal(fellas.maxWinMultiplier, 3810);
assert.equal(fellas.reels, '5x3');
assert.ok(fellas.features.includes('hold-and-spin'));
assert.ok(fellas.features.includes('cash-collection'));

const tiger = (await readEntry('games', 'tiger-jackpots')).data;
assert.equal(tiger.rtp, 95.66);
assert.equal(tiger.volatilityOriginal, 'Medium');
assert.equal(tiger.maxWinMultiplier, 5216);
assert.equal(tiger.winMechanism, undefined, 'Unknown mechanism must remain missing');

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['AGS', 'NextSpin', 'NOVOMATIC Gaming', 'Octoplay', 'Onlyplay']) {
  assert.match(map, new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\r\n]*已收錄（1）`));
}
for (const name of ['Amigo Gaming', 'JDB Gaming', 'Konami Gaming']) {
  assert.match(map, new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\r\n]*(保留待|待可直接)`));
}
assert.match(map, /第三十一批完成 AGS／Imperial Fortunes、NextSpin／Big CaiShen、NOVOMATIC Gaming／Book of Ra Magic Wheel、Octoplay／2 Lucky Fellas: Hold & Win 與 Onlyplay／Tiger Jackpots/);
assert.match(map, /第 31 批由 AGS 接續，完成五家並保存 Amigo Gaming、JDB Gaming 與 Konami Gaming 的圖片待補原因/);

console.log('PASS: horizontal intake batch 31 added five first-party provider/game pairs, preserved unsupported values as missing, recorded three skips, and advanced the cursor.');
