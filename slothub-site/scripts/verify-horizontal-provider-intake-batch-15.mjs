import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['atomic-slot-lab', 'argos-quest'],
  ['indigo-magic', 'wild-hour-league'],
  ['wild-streak-gaming', 'fire-stampede-dollars-and-dreams'],
  ['spin-games', 'triple-jewels'],
  ['oryx-gaming', 'golden-ticket'],
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
  assert.ok(game.sources.length >= 1, `${gameSlug}: first-party source evidence is required`);
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

const argos = (await readEntry('games', 'argos-quest')).data;
assert.equal(argos.winMechanism, 'ways-to-win');
assert.equal(argos.winCount, 243);
assert.ok(argos.features.includes('hold-and-spin'));
assert.equal(argos.bonusBuy, true);

const wildHour = (await readEntry('games', 'wild-hour-league')).data;
assert.deepEqual(wildHour.rtpVariants, [96.47, 94.18, 92.23]);
assert.equal(wildHour.winMechanism, undefined, 'layout must not be converted into an inferred mechanism');

const stampede = (await readEntry('games', 'fire-stampede-dollars-and-dreams')).data;
assert.equal(stampede.reels, '5x5x3x5x5');
assert.equal(stampede.rows, undefined, 'irregular layout must not become a fabricated row count');
assert.equal(stampede.maxWinMultiplier, undefined);

const jewels = (await readEntry('games', 'triple-jewels')).data;
assert.equal(jewels.winMechanism, 'paylines');
assert.equal(jewels.winCount, 5);
assert.equal(jewels.rtp, undefined, 'unverified RTP must remain missing');
assert.equal(jewels.jackpotType, 'multiple');

const ticket = (await readEntry('games', 'golden-ticket')).data;
for (const field of ['rtp', 'volatilityOriginal', 'volatilityNormalized', 'maxWinMultiplier', 'winMechanism']) {
  assert.equal(ticket[field], undefined, `Golden Ticket ${field} must remain missing`);
}
const oryx = (await readEntry('providers', 'oryx-gaming')).data;
assert.ok(oryx.roles.includes('aggregator'));
assert.match(oryx.summary, /不把第三方聚合內容誤署名/);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Atomic Slot Lab', 'Indigo Magic', 'Wild Streak Gaming', 'Spin Games', 'ORYX Gaming']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`));
}
assert.match(map, /REMAINING_RESEARCH_LEAD_COUNT: 0/);

console.log('PASS: horizontal intake batch 15 published five identity-confirmed Bragg studio brands with one traceable game each, while keeping unsupported metrics and aggregated attribution explicitly missing.');
