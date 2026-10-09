import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['prag-by-popok', 'bon-bon-prag'],
  ['spearhead-studios', 'wild-reels'],
  ['barbara-bang', 'chinese-gold-hold-and-spin'],
  ['egt-digital', 'book-of-realm'],
  ['netgame-entertainment', 'ultimate-crown-40'],
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

const prag = (await readEntry('games', 'bon-bon-prag')).data;
assert.equal(prag.rtp, 96.88);
assert.equal(prag.volatilityOriginal, 'High');
assert.equal(prag.maxWinMultiplier, 15000);
assert.equal(prag.winMechanism, 'cluster-pays');
assert.equal(prag.bonusBuy, true);

const wildReels = (await readEntry('games', 'wild-reels')).data;
assert.equal(wildReels.rtp, 97);
assert.equal(wildReels.volatilityOriginal, 'Medium');
assert.equal(wildReels.winCount, 10);
assert.ok(wildReels.sources.some((source) => /歷史/.test(source.label) && /Low/.test(source.label)), 'historical volatility conflict must be preserved');

const chineseGold = (await readEntry('games', 'chinese-gold-hold-and-spin')).data;
assert.deepEqual(chineseGold.rtpVariants, [97.06, 98.23]);
assert.equal(chineseGold.volatilityOriginal, '14.10');
assert.equal(chineseGold.volatilityNormalized, undefined, 'numeric vendor volatility must not be force-mapped');
assert.equal(chineseGold.maxWinMultiplier, 10000);

const realm = (await readEntry('games', 'book-of-realm')).data;
assert.equal(realm.rtp, undefined);
assert.equal(realm.volatilityOriginal, undefined);
assert.equal(realm.maxWinMultiplier, undefined);
assert.equal(realm.winCount, 10);

const crown = (await readEntry('games', 'ultimate-crown-40')).data;
assert.equal(crown.rtp, 95.11);
assert.equal(crown.volatilityOriginal, 'Low');
assert.equal(crown.maxWinMultiplier, 5000);
assert.equal(crown.winCount, 40);
assert.equal(crown.jackpotType, 'progressive');

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Prag by PopOK', 'Spearhead Studios', 'Barbara Bang', 'EGT Digital', 'NetGame Entertainment']) {
  assert.match(map, new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\r\n]*已收錄（1）`));
}
assert.match(map, /Funky Games[^\r\n]*已收錄（1）/);
assert.match(map, /本批待發布資料納入建置時為 277 款 published Game、209 家 published Provider/);
assert.match(map, /下一個橫向接續位置為主表第 213 項 Dragoon Soft/);

console.log('PASS: horizontal intake batch 34 added five traceable provider/game pairs, preserved source conflicts and unsupported values, recorded three evidence gaps, and advanced the cursor.');
