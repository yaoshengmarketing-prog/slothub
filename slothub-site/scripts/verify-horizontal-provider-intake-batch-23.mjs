import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['stormcraft-studios', 'thunderstruck-stormchaser'],
  ['pearfiction-studios', 'cerberus-gold'],
  ['bulletproof-games', '7th-squadron-doublemax'],
  ['hungrybear-gaming', 'the-secret-of-amun-ra'],
  ['jade-rabbit-studio', 'reel-holidays'],
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

const stormchaser = (await readEntry('games', 'thunderstruck-stormchaser')).data;
assert.equal(stormchaser.rtp, 96.1);
assert.equal(stormchaser.winMechanism, 'ways-to-win');
assert.equal(stormchaser.winCount, 1024);
assert.equal(stormchaser.maxWinMultiplier, undefined, 'Unbased WIN UP TO value must not become a total-bet multiplier');
assert.deepEqual(stormchaser.features, ['cascading', 'free-spins', 'wild', 'multiplier', 'bonus-buy']);

const cerberus = (await readEntry('games', 'cerberus-gold')).data;
assert.equal(cerberus.rtp, 96.02);
assert.equal(cerberus.rows, undefined, 'Dynamic 3–6 rows must not become a fixed row count');
assert.equal(cerberus.winMechanism, 'ways-to-win');
assert.equal(cerberus.winCount, undefined, 'Dynamic 243–7,776 Payways must stay in the original label');

const squadron = (await readEntry('games', '7th-squadron-doublemax')).data;
assert.equal(squadron.rtp, undefined, 'Two published RTP configurations must not be collapsed into one primary value');
assert.deepEqual(squadron.rtpVariants, [94, 90.5]);
assert.equal(squadron.maxWinMultiplier, 15000);

const amunRa = (await readEntry('games', 'the-secret-of-amun-ra')).data;
assert.equal(amunRa.rtp, 96.01);
assert.equal(amunRa.winMechanism, undefined);
assert.equal(amunRa.maxWinMultiplier, undefined);

const holidays = (await readEntry('games', 'reel-holidays')).data;
assert.equal(holidays.rtp, 96.01);
assert.equal(holidays.volatilityOriginal, '5/10');
assert.equal(holidays.volatilityNormalized, undefined, 'Provider-specific 5/10 scale must not be normalized without an approved mapping');
assert.equal(holidays.maxWinMultiplier, undefined, 'Exposure wording must not be promoted to a unified Max Win');
assert.equal(holidays.bonusBuy, false);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Stormcraft Studios', 'PearFiction Studios', 'Bulletproof Games', 'HungryBear Gaming', 'Jade Rabbit Studio']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`));
}
assert.match(map, /KISS Gaming[^\r\n]*已收錄（1）/);
assert.match(map, /第二十三批完成 Stormcraft Studios、PearFiction Studios、Bulletproof Games、HungryBear Gaming 與 Jade Rabbit Studio/);

console.log('PASS: horizontal intake batch 23 published five official-source slot titles and preserved dynamic and multi-version source boundaries; the later KISS resolution remains recorded.');
