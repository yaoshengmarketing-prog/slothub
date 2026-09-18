import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['dyg', 'tale-of-anubis'],
  ['e-gaming', 'spinning-wild-6'],
  ['kendoo', 'diamond-and-jokers'],
  ['million-games', 'temple-treasure'],
  ['pateplay', '100-happy-seven'],
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
  assert.equal(String(game.lastVerifiedAt).slice(0, 10), '2026-09-18');
  assert.ok(game.sources.length >= 2, `${gameSlug}: source and image evidence are required`);
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

const dyg = (await readEntry('games', 'tale-of-anubis')).data;
assert.equal(dyg.winCount, 25);
assert.equal(dyg.rtp, undefined);
assert.equal(dyg.maxWinMultiplier, undefined);

const eGaming = (await readEntry('games', 'spinning-wild-6')).data;
assert.equal(eGaming.volatilityOriginal, 'Medium');
assert.equal(eGaming.rtp, undefined, 'an official RTP range must not become a primary value');
assert.equal(eGaming.maxWinMultiplier, undefined, 'a feature award must not become whole-game Max Win');
assert.match(eGaming.bonusFeatures.join(' '), /90\.00%–98\.00%/);

const kendoo = (await readEntry('games', 'diamond-and-jokers')).data;
assert.equal(kendoo.bonusBuy, true);
assert.equal(kendoo.maxWinMultiplier, undefined, 'Grand Jackpot basis must remain a scoped label');
assert.match(kendoo.maxWinLabelOriginal, /Grand Jackpot/);

const million = (await readEntry('games', 'temple-treasure')).data;
assert.equal(million.rtp, undefined, 'multiple official RTP values must not create an inferred primary value');
assert.deepEqual(million.rtpVariants, [94.36, 96.56]);
assert.equal(million.volatilityOriginal, 'Extreme');
assert.equal(million.maxWinMultiplier, 10000);

const pateplay = (await readEntry('games', '100-happy-seven')).data;
assert.equal(pateplay.rtp, 96.45);
assert.equal(pateplay.maxWinMultiplier, 1000);
assert.equal(pateplay.volatilityOriginal, undefined);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['DYG', 'e-gaming', 'Kendoo', 'Million Games', 'Pateplay']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`));
}
assert.match(map, /下一個主動接續品牌為 RichyPlay/);
assert.match(map, /REMAINING_RESEARCH_LEAD_COUNT: 0/);

console.log('PASS: horizontal intake batch 13 published five confirmed slot Providers and one evidence-backed game each while preserving RTP ranges, versions, scoped feature awards and unknown values without schema or taxonomy changes.');
