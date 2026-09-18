import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['reflex-gaming', 'redbeards-ruby-fortune-map'],
  ['sega-sammy-creation', 'jolly-leprechaun'],
  ['ainsworth', 'eagle-bucks'],
  ['bang-bang-games', 'super-cash-drop-deluxe'],
  ['crucible-gaming', 'book-of-sevens'],
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

const reflex = (await readEntry('games', 'redbeards-ruby-fortune-map')).data;
assert.deepEqual(reflex.rtpVariants, [95.5, 94, 92]);
assert.equal(reflex.volatilityOriginal, 'Medium - High');
assert.equal(reflex.winMechanism, undefined);

const jolly = (await readEntry('games', 'jolly-leprechaun')).data;
assert.equal(jolly.rtp, 95.5);
assert.equal(jolly.volatilityNormalized, 'medium');
assert.deepEqual(jolly.features, ['wild', 'respins']);

const eagle = (await readEntry('games', 'eagle-bucks')).data;
assert.equal(eagle.rtp, undefined, 'unpublished Ainsworth RTP must remain missing');
assert.equal(eagle.paylines, '5 | 10 | 20');
assert.equal(eagle.winMechanism, 'paylines');

const cashDrop = (await readEntry('games', 'super-cash-drop-deluxe')).data;
assert.deepEqual(cashDrop.rtpVariants, [96, 94]);
assert.equal(cashDrop.rtp, undefined, 'variants must not be promoted to a primary RTP');
assert.equal(cashDrop.paylines, '120（Snapshot）／最多 502（擴展盤面）');
assert.equal(cashDrop.maxWinMultiplier, 9225);

const sevens = (await readEntry('games', 'book-of-sevens')).data;
assert.deepEqual(sevens.rtpVariants, [96, 94, 92]);
assert.equal(sevens.winCount, 5);
assert.equal(sevens.maxWinMultiplier, 5064);
assert.equal(sevens.bonusBuy, undefined, 'Bonus Play must not be silently normalized to Bonus Buy');

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Reflex Gaming', 'Sega Sammy Creation', 'Ainsworth', 'Bang Bang Games', 'Crucible Gaming']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`));
}
assert.match(map, /第十七批完成 Reflex Gaming、Sega Sammy Creation、Ainsworth、Bang Bang Games 與 Crucible Gaming/);

console.log('PASS: horizontal intake batch 17 published five identity-confirmed slot Providers with one first-party game each while preserving RTP versions, dynamic paylines and unsupported values without schema or taxonomy changes.');
