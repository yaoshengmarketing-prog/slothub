import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const gameSlugs = ['fat-rabbit', 'wild-swarm', 'valley-of-the-gods', 'golden-fish-tank-2-gigablox'];

async function readEntry(slug) {
  const source = await readFile(new URL(`../src/content/games/${slug}.md`, import.meta.url), 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  assert.ok(frontmatter, `${slug}: missing frontmatter`);
  return { source, data: parse(frontmatter) };
}

const games = Object.fromEntries(await Promise.all(gameSlugs.map(async (slug) => [slug, await readEntry(slug)])));
const statuses = new Set(gameSlugs.map((slug) => games[slug].data.status));
assert.equal(statuses.size, 1, 'sixth batch must move between draft and published atomically');
assert.ok(['draft', 'published'].includes([...statuses][0]), 'unsupported sixth-batch status');

const fatRabbit = games['fat-rabbit'].data;
assert.equal(fatRabbit.provider, 'push-gaming');
assert.deepEqual(fatRabbit.rtpVariants, [94.15, 96.45]);
assert.equal(fatRabbit.volatilityNormalized, 'high');
assert.equal(fatRabbit.maxWinMultiplier, undefined, 'Highest Observed Win must not become theoretical Max Win');
assert.equal(fatRabbit.winMechanism, 'paylines');
assert.equal(fatRabbit.winCount, 50);
assert.equal(fatRabbit.bonusBuy, true);
assert.deepEqual(fatRabbit.features, ['free-spins', 'wild', 'bonus-buy']);

const wildSwarm = games['wild-swarm'].data;
assert.equal(wildSwarm.provider, 'push-gaming');
assert.deepEqual(wildSwarm.rtpVariants, [94.67, 97.03]);
assert.equal(wildSwarm.volatilityNormalized, 'medium-high');
assert.equal(wildSwarm.maxWinMultiplier, undefined, 'Highest Observed Win must not become theoretical Max Win');
assert.equal(wildSwarm.winMechanism, 'paylines');
assert.equal(wildSwarm.winCount, 20);
assert.deepEqual(wildSwarm.features, ['free-spins', 'wild', 'sticky-symbols']);

const valley = games['valley-of-the-gods'].data;
assert.equal(valley.provider, 'yggdrasil-gaming');
assert.equal(valley.rtp, 96.2);
assert.equal(valley.volatilityNormalized, 'high');
assert.equal(valley.maxWinMultiplier, undefined, 'currency Max Win must not become a bet multiplier');
assert.equal(valley.winMechanism, 'ways-to-win');
assert.equal(valley.winCount, undefined, 'dynamic ways must not become fixed winCount');
assert.deepEqual(valley.features, ['respins', 'multiplier']);

const fishTank = games['golden-fish-tank-2-gigablox'].data;
assert.equal(fishTank.provider, 'yggdrasil-gaming');
assert.equal(fishTank.rtp, 96);
assert.equal(fishTank.volatilityNormalized, 'medium-high');
assert.equal(fishTank.maxWinMultiplier, undefined, 'currency Max Win must not become a bet multiplier');
assert.equal(fishTank.winMechanism, 'paylines');
assert.equal(fishTank.winCount, undefined, 'payline range must not become a fixed winCount');
assert.deepEqual(fishTank.features, ['free-spins', 'wild', 'giant-symbols']);

for (const slug of gameSlugs) {
  const game = games[slug].data;
  assert.ok(game.sources.length >= 2, `${slug}: expected multiple first-party sources`);
  assert.equal(String(game.lastVerifiedAt).slice(0, 10), '2026-09-03');
  assert.ok(game.sources.every((source) => /pushgaming\.com|yggdrasilgaming\.com/.test(source.url)), `${slug}: non-first-party source found`);
}

for (const [relativePath, minimumSize] of [
  ['../public/assets/games/fat-rabbit.jpg', 80_000],
  ['../public/assets/games/wild-swarm.jpg', 250_000],
  ['../public/assets/games/valley-of-the-gods.png', 200_000],
  ['../public/assets/games/golden-fish-tank-2-gigablox.png', 40_000],
]) {
  const info = await stat(new URL(relativePath, import.meta.url));
  assert.ok(info.size >= minimumSize, `${relativePath}: unexpected asset size ${info.size}`);
}

const published = [...statuses][0] === 'published';
for (const slug of gameSlugs) {
  const builtPage = readFile(new URL(`../dist/games/${slug}/index.html`, import.meta.url), 'utf8');
  if (!published) {
    await assert.rejects(builtPage, { code: 'ENOENT' }, `${slug}: draft route entered the public build`);
    continue;
  }
  const html = await builtPage;
  assert.match(html, new RegExp(games[slug].data.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${slug}: published identity missing`);
  assert.match(html, /content="noindex,nofollow"/, `${slug}: Preview robots meta missing`);
  assert.ok(!html.includes('rel="canonical"'), `${slug}: Preview canonical must remain absent`);
}

console.log(`PASS: sixth batch is atomically ${[...statuses][0]}; 4 Games preserve first-party labels, dynamic counts and official media without Schema/taxonomy changes.`);

