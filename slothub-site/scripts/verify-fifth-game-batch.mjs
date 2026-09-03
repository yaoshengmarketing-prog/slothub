import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const gameSlugs = ['extra-chilli', 'jammin-jars', 'razor-shark', 'vikings-go-berzerk'];
const providerSlugs = ['push-gaming', 'yggdrasil-gaming'];

async function readEntry(collection, slug) {
  const source = await readFile(new URL(`../src/content/${collection}/${slug}.md`, import.meta.url), 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  assert.ok(frontmatter, `${slug}: missing frontmatter`);
  return { source, data: parse(frontmatter) };
}

const games = Object.fromEntries(await Promise.all(gameSlugs.map(async (slug) => [slug, await readEntry('games', slug)])));
const providers = Object.fromEntries(await Promise.all(providerSlugs.map(async (slug) => [slug, await readEntry('providers', slug)])));
const statuses = new Set([
  ...gameSlugs.map((slug) => games[slug].data.status),
  ...providerSlugs.map((slug) => providers[slug].data.status),
]);
assert.equal(statuses.size, 1, 'fifth batch must move between draft and published atomically');
assert.ok(['draft', 'published'].includes([...statuses][0]), 'unsupported fifth-batch status');

const extra = games['extra-chilli'].data;
assert.equal(extra.provider, 'big-time-gaming');
assert.equal(extra.rtp, undefined);
assert.equal(extra.rtpVariants, undefined, 'official RTP ranges must not become false variants');
assert.equal(extra.maxWinMultiplier, 16877);
assert.match(extra.maxWinLabelOriginal, /16,877x Stake/);
assert.equal(extra.winMechanism, 'megaways');
assert.equal(extra.winCount, undefined, 'dynamic Megaways ceiling must not become fixed winCount');
assert.deepEqual(extra.features, ['free-spins', 'multiplier']);
assert.ok(!extra.features.includes('bonus-buy'), 'Feature Drop must not be inferred as bonus-buy');

const jammin = games['jammin-jars'].data;
assert.equal(jammin.provider, 'push-gaming');
assert.deepEqual(jammin.rtpVariants, [94.25, 96.83]);
assert.equal(jammin.volatilityNormalized, 'high');
assert.equal(jammin.maxWinMultiplier, undefined, 'Highest Observed Win must not become theoretical Max Win');
assert.match(jammin.maxWinLabelOriginal, /Highest Observed Win/);
assert.equal(jammin.winMechanism, 'cluster-pays');
assert.equal(jammin.bonusBuy, true);
assert.deepEqual(jammin.features, ['cascading', 'free-spins', 'wild', 'scatter', 'multiplier', 'bonus-buy']);

const razor = games['razor-shark'].data;
assert.equal(razor.provider, 'push-gaming');
assert.deepEqual(razor.rtpVariants, [94.06, 96.7]);
assert.equal(razor.winMechanism, 'paylines');
assert.equal(razor.winCount, 20);
assert.equal(razor.maxWinMultiplier, undefined, 'Razor Reveal local multiplier must not become Max Win');
assert.deepEqual(razor.features, ['free-spins', 'scatter', 'multiplier']);

const vikings = games['vikings-go-berzerk'].data;
assert.equal(vikings.provider, 'yggdrasil-gaming');
assert.equal(vikings.rtp, 96.1);
assert.equal(vikings.volatilityNormalized, 'medium-high');
assert.equal(vikings.maxWinMultiplier, undefined, 'currency Max Win must not become a bet multiplier');
assert.match(vikings.maxWinLabelOriginal, /€93,910/);
assert.equal(vikings.winMechanism, 'paylines');
assert.equal(vikings.winCount, 25);
assert.deepEqual(vikings.features, ['free-spins', 'wild', 'sticky-symbols']);

assert.deepEqual(providers['push-gaming'].data.roles, ['developer', 'publisher']);
assert.deepEqual(providers['yggdrasil-gaming'].data.roles, ['developer', 'publisher', 'platform']);

for (const slug of gameSlugs) {
  const game = games[slug].data;
  assert.ok(game.sources.length >= 2, `${slug}: expected multiple first-party sources`);
  assert.equal(String(game.lastVerifiedAt).slice(0, 10), '2026-09-03');
  assert.ok(game.sources.every((source) => String(source.checkedAt).slice(0, 10) === '2026-09-03'), `${slug}: stale source date`);
  assert.ok(game.sources.every((source) => /bigtimegaming\.com|squarespace-cdn\.com|pushgaming\.com|yggdrasilgaming\.com/.test(source.url)), `${slug}: non-first-party source found`);
}

const assets = [
  ['../public/assets/games/extra-chilli.webp', 100_000],
  ['../public/assets/games/jammin-jars.jpg', 150_000],
  ['../public/assets/games/razor-shark.jpg', 90_000],
  ['../public/assets/games/vikings-go-berzerk.png', 200_000],
  ['../public/assets/providers/push-gaming.png', 10_000],
  ['../public/assets/providers/yggdrasil-gaming.svg', 2_000],
];
for (const [relativePath, minimumSize] of assets) {
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

for (const slug of providerSlugs) {
  const providerPage = readFile(new URL(`../dist/providers/${slug}/index.html`, import.meta.url), 'utf8');
  if (!published) {
    await assert.rejects(providerPage, { code: 'ENOENT' }, `${slug}: draft Provider route entered the public build`);
    continue;
  }
  const html = await providerPage;
  assert.match(html, new RegExp(providers[slug].data.name));
  assert.match(html, new RegExp(`href="/games/\\?provider=${slug}"`));
}

if (published) {
  assert.match(await readFile(new URL('../dist/providers/push-gaming/index.html', import.meta.url), 'utf8'), /Slot Hub 收錄 2 款/);
  const yggHtml = await readFile(new URL('../dist/providers/yggdrasil-gaming/index.html', import.meta.url), 'utf8');
  assert.match(yggHtml, /Slot Hub 收錄 1 款/);
  assert.ok(!yggHtml.includes('樣本統計'), 'N=1 Provider must not claim aggregate statistics');
}

console.log(`PASS: fifth batch is atomically ${[...statuses][0]}; 4 Games and 2 Providers preserve first-party labels, ranges and media without Schema/taxonomy changes.`);
