import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['popok-gaming', 'incredible-genie'],
  ['phoenix-7', 'pachincup'],
  ['naga-games', 'god-of-fortune-naga'],
  ['gaming-corps', 'raging-zeus'],
  ['gaming1', 'the-wall-gaming1'],
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

const genie = (await readEntry('games', 'incredible-genie')).data;
assert.equal(genie.rtp, 96.2);
assert.equal(genie.winMechanism, 'ways-to-win');
assert.equal(genie.winCount, 243);
assert.equal(genie.maxWinMultiplier, 2502.1);
assert.equal(genie.bonusBuy, true);

const pachincup = (await readEntry('games', 'pachincup')).data;
assert.equal(pachincup.rtp, 96);
assert.equal(pachincup.volatilityOriginal, '3 of 5');
assert.equal(pachincup.winCount, 1);
assert.equal(pachincup.maxWinMultiplier, 6253);

const fortune = (await readEntry('games', 'god-of-fortune-naga')).data;
assert.equal(fortune.rtp, 96.41);
assert.equal(fortune.winMechanism, 'ways-to-win');
assert.equal(fortune.winCount, 243);
assert.equal(fortune.maxWinMultiplier, undefined, 'God of Fortune max win must stay missing without evidence');

const zeus = (await readEntry('games', 'raging-zeus')).data;
assert.equal(zeus.rtp, 95.72);
assert.deepEqual(zeus.rtpVariants, [95.72, 96.35, 94.21, 94.35, 89.47, 89.35]);
assert.equal(zeus.winCount, 4096);
assert.equal(zeus.bonusBuy, true);

const wall = (await readEntry('games', 'the-wall-gaming1')).data;
assert.equal(wall.rtp, 95.55);
assert.equal(wall.volatilityOriginal, 'Medium');
assert.equal(wall.winCount, 243);
assert.equal(wall.jackpotType, 'none');

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['PopOK Gaming', 'PHOENIX 7', 'Naga Games', 'Gaming Corps', 'GAMING1']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`));
}
assert.match(map, /SYNOT Games.*圖片端點.*522.*保留待補/);
assert.match(map, /AdvantPlay.*區域.*封鎖.*保留待補/);
assert.match(map, /下一個橫向接續位置.*SYNOT Games/);

console.log('PASS: horizontal intake batch 26 published five first-party-source slot titles, preserved missing and multi-version values, and recorded deferred candidates without guessing.');
