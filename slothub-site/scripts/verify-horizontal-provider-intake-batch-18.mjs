import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['digital-gaming-corp', '9-masks-of-fire'],
  ['dreamspin', 'buzz-thrills'],
  ['everi', 'double-ruby'],
  ['fantasma-games', 'prometheus-titan-of-fire'],
  ['hitsqwad', 'ragnar-first-strike'],
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

const masks = (await readEntry('games', '9-masks-of-fire')).data;
assert.equal(masks.rtp, undefined);
assert.equal(masks.winMechanism, undefined);
assert.deepEqual(masks.features, ['free-spins', 'scatter']);

const buzz = (await readEntry('games', 'buzz-thrills')).data;
assert.equal(buzz.rtp, undefined, 'conflicting first-party RTP labels must not be promoted to a primary value');
assert.deepEqual(buzz.rtpVariants, [95.43, 94.43]);
assert.equal(buzz.winMechanism, 'ways-to-win');
assert.equal(buzz.maxWinMultiplier, 5000);

const ruby = (await readEntry('games', 'double-ruby')).data;
assert.equal(ruby.rtp, undefined);
assert.equal(ruby.winMechanism, 'paylines');
assert.equal(ruby.winCount, 9);
assert.equal(ruby.maxWinMultiplier, undefined, 'credit payout must not be normalized to an x-bet Max Win');

const prometheus = (await readEntry('games', 'prometheus-titan-of-fire')).data;
assert.equal(prometheus.rtp, 94.26);
assert.equal(prometheus.winCount, 40);
assert.equal(prometheus.maxWinMultiplier, 1356);

const ragnar = (await readEntry('games', 'ragnar-first-strike')).data;
assert.deepEqual(ragnar.rtpVariants, [96, 94]);
assert.equal(ragnar.rtp, undefined);
assert.equal(ragnar.maxWinMultiplier, undefined, 'unqualified Top Prize must remain an original label');
assert.equal(ragnar.jackpotType, 'progressive');

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Digital Gaming Corp', 'DreamSpin', 'Everi', 'Fantasma Games', 'HITSqwad']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`));
}
assert.match(map, /第十八批完成 Digital Gaming Corp、DreamSpin、Everi、Fantasma Games 與 HITSqwad/);

console.log('PASS: horizontal intake batch 18 published five identity-confirmed slot Providers with one official-partner game each while preserving missing values, RTP conflicts and non-multiplier prize labels.');
