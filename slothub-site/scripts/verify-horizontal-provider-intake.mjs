import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['thunderkick', 'zoom'],
  ['bgaming', 'adventures'],
  ['triple-cherry', 'dragons-heirs'],
  ['spinmatic', 'baby-blue'],
  ['ela-games', 'rabbit-winpot-deluxe'],
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
  assert.equal(String(game.lastVerifiedAt).slice(0, 10), '2026-09-16', `${gameSlug}: verification date mismatch`);
  assert.ok(game.sources.length >= 2, `${gameSlug}: source and image evidence are required`);
  assert.ok(game.image?.sourceUrl, `${gameSlug}: traceable image source missing`);
  const image = await stat(new URL(`../public${game.image.src}`, import.meta.url));
  assert.ok(image.size > 50_000, `${gameSlug}: official image asset is unexpectedly small`);

  const [gameHtml, providerHtml] = await Promise.all([
    readFile(new URL(`../dist/games/${gameSlug}/index.html`, import.meta.url), 'utf8'),
    readFile(new URL(`../dist/providers/${providerSlug}/index.html`, import.meta.url), 'utf8'),
  ]);
  assert.match(gameHtml, new RegExp(`/providers/${providerSlug}/`), `${gameSlug}: Provider link missing`);
  assert.match(providerHtml, new RegExp(`/games/${gameSlug}/`), `${providerSlug}: Game link missing`);
  assert.match(gameHtml, /content="noindex,nofollow"/, `${gameSlug}: Preview noindex missing`);
  assert.ok(!gameHtml.includes('rel="canonical"'), `${gameSlug}: Preview canonical must remain absent`);
}

const zoom = (await readEntry('games', 'zoom')).data;
assert.equal(zoom.winMechanism, 'ways-to-win');
assert.equal(zoom.winCount, 64);
assert.equal(zoom.maxWinMultiplier, undefined, 'Max exposure without an explicit multiplier basis must not become maxWinMultiplier');

const adventures = (await readEntry('games', 'adventures')).data;
assert.equal(adventures.volatilityOriginal, 'Medium Low');
assert.equal(adventures.volatilityNormalized, undefined, 'Medium Low must not be force-normalized');
assert.equal(adventures.winMechanism, 'cluster-pays');

const dragons = (await readEntry('games', 'dragons-heirs')).data;
assert.equal(dragons.rtp, 90.37);
assert.deepEqual(dragons.rtpVariants, [90.37, 97.48, 96.18, 94.35, 92.42, 88.19]);
assert.equal(dragons.volatilityOriginal, undefined, 'Missing official volatility must remain missing');

const baby = (await readEntry('games', 'baby-blue')).data;
assert.match(baby.paylines, /Paylines 81/);
assert.match(baby.paylines, /maximum ways to win/);
assert.equal(baby.winMechanism, 'ways-to-win');

const rabbit = (await readEntry('games', 'rabbit-winpot-deluxe')).data;
assert.equal(rabbit.rtp, undefined, 'An official RTP range must not become a guessed primary RTP');
assert.deepEqual(rabbit.rtpVariants ?? [], [], 'RTP range endpoints must not be presented as selectable variants');
assert.ok(rabbit.bonusFeatures.includes('Official RTP range 92%–97%'));
assert.equal(rabbit.bonusBuy, false);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
assert.match(map, /未收錄 Provider 優先、每家先一款/);
assert.ok(!map.includes('新增 Provider 時，同批原則上至少發布兩款'), 'Superseded two-game Provider rule remains active');
for (const name of ['Thunderkick', 'BGaming', 'Triple Cherry', 'Spinmatic', 'ELA Games']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`), `${name}: candidate map status not updated`);
}

const gamesIndexHtml = await readFile(new URL('../dist/games/index.html', import.meta.url), 'utf8');
assert.match(gamesIndexHtml, /<time datetime="2026-09-19">2026\/09\/19<\/time>/, 'Recently verified dates must not shift back one day in the build timezone');

console.log('PASS: horizontal intake published five traceable Providers and one verified Game per Provider without schema, taxonomy or inferred-value changes.');
