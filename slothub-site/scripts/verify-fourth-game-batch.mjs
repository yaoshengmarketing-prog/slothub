import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const gameSlugs = [
  'fortune-rabbit',
  'dead-or-alive-2',
  'temple-tumble',
  'the-great-pigsby-megaways',
];

async function readEntry(collection, slug) {
  const source = await readFile(new URL(`../src/content/${collection}/${slug}.md`, import.meta.url), 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  assert.ok(frontmatter, `${slug}: missing frontmatter`);
  return { source, data: parse(frontmatter) };
}

const entries = Object.fromEntries(await Promise.all(gameSlugs.map(async (slug) => [slug, await readEntry('games', slug)])));
const provider = await readEntry('providers', 'relax-gaming');
const statuses = new Set([...gameSlugs.map((slug) => entries[slug].data.status), provider.data.status]);
assert.equal(statuses.size, 1, 'fourth batch must move between draft and published atomically');
assert.ok(['draft', 'published'].includes([...statuses][0]), 'unsupported fourth-batch status');

const fortune = entries['fortune-rabbit'].data;
assert.equal(fortune.provider, 'pg-soft');
assert.equal(fortune.displayNameZhHant, '金錢兔');
assert.equal(fortune.rtp, 96.75);
assert.deepEqual(fortune.rtpVariants, [94, 95, 96.75, 97, 98, 99, 100]);
assert.equal(fortune.volatilityOriginal, 'Session Volatility: Medium');
assert.equal(fortune.volatilityNormalized, 'medium');
assert.equal(fortune.maxWinMultiplier, 5000);
assert.equal(fortune.winMechanism, 'paylines');
assert.equal(fortune.winCount, 10);
assert.deepEqual(fortune.features, ['wild']);
assert.ok(!fortune.features.includes('free-spins'), 'Fortune Spins must not be inferred as Free Spins');

const dead = entries['dead-or-alive-2'].data;
assert.equal(dead.provider, 'netent');
assert.equal(dead.rtp, 96.8);
assert.equal(dead.winMechanism, 'paylines');
assert.equal(dead.winCount, 9);
assert.equal(dead.bonusBuy, true);
assert.equal(dead.maxWinMultiplier, undefined, 'conflicting Dead or Alive 2 max-win contexts must stay unnormalized');
assert.match(dead.maxWinLabelOriginal, /1,600 x bet/);
assert.match(dead.maxWinLabelOriginal, /100,000x of the original bet/);
assert.deepEqual(dead.features, ['free-spins', 'wild', 'scatter', 'multiplier', 'sticky-symbols', 'bonus-buy']);

const temple = entries['temple-tumble'].data;
assert.equal(temple.provider, 'relax-gaming');
assert.equal(temple.rtp, undefined);
assert.deepEqual(temple.rtpVariants, [90]);
assert.equal(temple.winMechanism, 'megaways');
assert.equal(temple.winCount, 46656);
assert.deepEqual(temple.features, ['cascading', 'free-spins', 'multiplier']);
assert.ok(temple.bonusFeatures.includes('Alternative UK GameID: templetumble_92'));

const pigsby = entries['the-great-pigsby-megaways'].data;
assert.equal(pigsby.provider, 'relax-gaming');
assert.equal(pigsby.rtp, undefined);
assert.deepEqual(pigsby.rtpVariants, [90, 94]);
assert.equal(pigsby.volatilityNormalized, undefined);
assert.match(pigsby.volatilityOriginal, /medium volatility/);
assert.match(pigsby.volatilityOriginal, /high-volatility/);
assert.equal(pigsby.maxWinMultiplier, undefined);
assert.match(pigsby.maxWinLabelOriginal, /20,000x/);
assert.match(pigsby.reels, /6x7/);
assert.match(pigsby.reels, /5x3/);
assert.equal(pigsby.winMechanism, 'megaways');
assert.equal(pigsby.winCount, undefined, 'up to 117,649 ways must not become a fixed winCount');
assert.deepEqual(pigsby.features, ['free-spins', 'wild', 'respins']);

assert.equal(provider.data.name, 'Relax Gaming');
assert.deepEqual(provider.data.roles, ['developer', 'aggregator', 'platform']);
assert.deepEqual(provider.data.gameTypes, ['slots', 'poker', 'bingo']);
assert.equal(provider.data.officialUrl, 'https://www.relax-gaming.com/');

for (const slug of gameSlugs) {
  const game = entries[slug].data;
  assert.ok(game.sources.length >= 2, `${slug}: expected multiple first-party sources`);
  assert.equal(String(game.lastVerifiedAt).slice(0, 10), '2026-09-03');
  assert.ok(game.sources.every((source) => String(source.checkedAt).slice(0, 10) === '2026-09-03'), `${slug}: stale source date`);
  assert.ok(game.sources.every((source) => /pgsoft\.com|netent\.com|nolimitcity\.com|relax-gaming\.com/.test(source.url)), `${slug}: non-first-party source found`);
}

const assets = [
  ['../public/assets/games/fortune-rabbit.png', 2_000_000],
  ['../public/assets/games/dead-or-alive-2.jpg', 250_000],
  ['../public/assets/games/temple-tumble.png', 500_000],
  ['../public/assets/games/the-great-pigsby-megaways.png', 700_000],
  ['../public/assets/providers/relax-gaming.svg', 4_000],
];
for (const [relativePath, minimumSize] of assets) {
  const info = await stat(new URL(relativePath, import.meta.url));
  assert.ok(info.size >= minimumSize, `${relativePath}: unexpected asset size ${info.size}`);
}

await assert.rejects(readFile(new URL('../src/content/games/money-train-4.md', import.meta.url), 'utf8'), { code: 'ENOENT' }, 'Money Train 4 must not enter this batch');

const published = [...statuses][0] === 'published';
for (const slug of gameSlugs) {
  const builtPage = readFile(new URL(`../dist/games/${slug}/index.html`, import.meta.url), 'utf8');
  if (!published) {
    await assert.rejects(builtPage, { code: 'ENOENT' }, `${slug}: draft route entered the public build`);
    continue;
  }
  const html = await builtPage;
  assert.match(html, new RegExp(entries[slug].data.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${slug}: published identity missing`);
  assert.match(html, /content="noindex,nofollow"/, `${slug}: Preview robots meta missing`);
  assert.ok(!html.includes('rel="canonical"'), `${slug}: Preview canonical must remain absent`);
}

const providerPage = readFile(new URL('../dist/providers/relax-gaming/index.html', import.meta.url), 'utf8');
if (!published) await assert.rejects(providerPage, { code: 'ENOENT' }, 'Relax Gaming draft route entered the public build');
else {
  const html = await providerPage;
  assert.match(html, /Relax Gaming/);
  assert.match(html, /Slot Hub 收錄 11 款/);
  assert.match(html, /href="\/games\/\?provider=relax-gaming"/);
}

console.log(`PASS: fourth batch is atomically ${[...statuses][0]}; 4 verified Games and Relax Gaming use current Schema/taxonomy, preserve official conflicts, and include first-party media.`);
