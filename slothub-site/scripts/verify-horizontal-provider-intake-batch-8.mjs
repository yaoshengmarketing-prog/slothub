import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['wizard-games', 'sizzling-mystery'],
  ['7777-gaming', 'cash-transporter'],
  ['air-dice', 'one-shot-star'],
  ['apollo-games', 'jewel-fruit'],
  ['belatra-games', 'tortuga-codex'],
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
  assert.equal(String(game.lastVerifiedAt).slice(0, 10), '2026-09-17', `${gameSlug}: verification date mismatch`);
  assert.ok(game.sources.length >= 2, `${gameSlug}: source and image evidence are required`);
  assert.ok(game.image?.sourceUrl, `${gameSlug}: traceable image source missing`);
  const image = await stat(new URL(`../public${game.image.src}`, import.meta.url));
  assert.ok(image.size > 10_000, `${gameSlug}: source-backed image asset is unexpectedly small`);

  const [gameHtml, providerHtml] = await Promise.all([
    readFile(new URL(`../dist/games/${gameSlug}/index.html`, import.meta.url), 'utf8'),
    readFile(new URL(`../dist/providers/${providerSlug}/index.html`, import.meta.url), 'utf8'),
  ]);
  assert.match(gameHtml, new RegExp(`/providers/${providerSlug}/`), `${gameSlug}: Provider link missing`);
  assert.match(providerHtml, new RegExp(`/games/${gameSlug}/`), `${providerSlug}: Game link missing`);
  assert.match(gameHtml, /content="noindex,nofollow"/, `${gameSlug}: Preview noindex missing`);
  assert.ok(!gameHtml.includes('rel="canonical"'), `${gameSlug}: Preview canonical must remain absent`);
}

const sizzling = (await readEntry('games', 'sizzling-mystery')).data;
assert.equal(sizzling.rtp, undefined, 'three RTP configurations must not become one primary RTP');
assert.deepEqual(sizzling.rtpVariants, [96.01, 94.01, 91.04]);
assert.equal(sizzling.volatilityOriginal, 'Low to Medium');
assert.equal(sizzling.volatilityNormalized, undefined, 'Low to Medium must preserve the official scale');
assert.equal(sizzling.maxWinMultiplier, 2500);
assert.equal(sizzling.winCount, 243);
assert.equal(sizzling.bonusBuy, true);

const cash = (await readEntry('games', 'cash-transporter')).data;
assert.equal(cash.rtp, undefined, 'conflicting visible and structured RTP values must remain unresolved');
assert.equal(cash.volatilityOriginal, 'MEDIUM-HIGH');
assert.equal(cash.volatilityNormalized, 'medium-high');
assert.equal(cash.maxWinMultiplier, 5000);
assert.equal(cash.winCount, 40);
assert.equal(cash.jackpotType, 'multiple');

const star = (await readEntry('games', 'one-shot-star')).data;
assert.equal(star.rtp, 96.35);
assert.equal(star.volatilityOriginal, 'Medium');
assert.equal(star.maxWinMultiplier, undefined, 'Max Exposure and currency-free Max Win labels must not become whole-game bet multiples');
assert.equal(star.winCount, 5);
assert.equal(star.bonusBuy, undefined, 'Buy-in wording must not be promoted to the Bonus Buy taxonomy without an explicit official label');

const jewel = (await readEntry('games', 'jewel-fruit')).data;
assert.equal(jewel.rtp, undefined, 'an 85–99% range must not become one primary RTP');
assert.equal(jewel.rtpVariants, undefined, 'an RTP range must not be represented as selectable variants');
assert.equal(jewel.volatilityOriginal, 'Medium');
assert.equal(jewel.maxWinMultiplier, 135);
assert.equal(jewel.winCount, 27);

const tortuga = (await readEntry('games', 'tortuga-codex')).data;
assert.equal(tortuga.rtp, 96.06);
assert.equal(tortuga.volatilityOriginal, 'Very high');
assert.equal(tortuga.volatilityNormalized, 'very-high');
assert.equal(tortuga.maxWinMultiplier, 59049);
assert.equal(tortuga.winCount, 25);
assert.equal(tortuga.bonusBuy, true);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Wizard Games', '7777 Gaming', 'Air Dice', 'Apollo Games', 'Belatra Games']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`), `${name}: candidate map status not updated`);
}
assert.match(map, /AGS、Amigo Gaming[^\n]+既有待補原因維持/);
assert.match(map, /下一個主動接續品牌為 DYG/);

console.log('PASS: horizontal intake batch 8 published five previously unlisted slot Providers and one source-backed game per Provider while preserving RTP conflicts, ranges, original scales and Max Win boundaries.');
