import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['koala-games', 'voltage-blitz-vortex'],
  ['slotopia', 'reel-hit'],
  ['raw-igaming', 'precious-monkeys'],
  ['g-games', '10p-slots'],
  ['trusty-gaming', 'lucky-multifruit'],
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

const vortex = (await readEntry('games', 'voltage-blitz-vortex')).data;
assert.deepEqual(vortex.rtpVariants, [96.36, 94.26, 90.31]);
assert.equal(vortex.volatilityOriginal, 'Medium/High');
assert.equal(vortex.winCount, 5);
assert.equal(vortex.maxWinMultiplier, 6051);

const reelHit = (await readEntry('games', 'reel-hit')).data;
assert.equal(reelHit.rtp, 96);
assert.equal(reelHit.winCount, 10);
assert.equal(reelHit.maxWinMultiplier, undefined, 'Reel Hit unqualified MAX WIN must not be converted into a bet multiplier');
assert.equal(reelHit.maxWinLabelOriginal, 'MAX WIN 761100');

const monkeys = (await readEntry('games', 'precious-monkeys')).data;
assert.deepEqual(monkeys.rtpVariants, [94.51, 95.53]);
assert.equal(monkeys.winMechanism, 'other', 'Scatter Magnets must not be forced into an unsupported canonical mechanism');
assert.equal(monkeys.maxWinMultiplier, 6955);

const tenP = (await readEntry('games', '10p-slots')).data;
assert.equal(tenP.rtp, 96.5);
assert.equal(tenP.winCount, 1);
assert.equal(tenP.maxWinMultiplier, undefined, '10P Slots win 100K label must not be guessed as a multiplier');

const lucky = (await readEntry('games', 'lucky-multifruit')).data;
assert.deepEqual(lucky.rtpVariants, [96.23, 94.26]);
assert.equal(lucky.rows, 4, 'current official detail-page row count must remain distinct from the historical launch copy');
assert.equal(lucky.sources.length, 2, 'the first-party grid conflict must retain both source records');

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Koala Games', 'Trusty Gaming', 'RAW iGaming', 'G.Games']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*已收錄（1）`));
}
assert.match(map, /Slotopia.*Reel Hit.*已收錄（1）/);
assert.match(map, /Bullshark Games.*已收錄（1）/);
assert.match(map, /第十六至二十八批的完成與待補原因維持原紀錄/);

console.log('PASS: horizontal intake batch 27 published five first-party-source slot titles, preserved version and source conflicts, and avoided unsupported multiplier or mechanism guesses.');
