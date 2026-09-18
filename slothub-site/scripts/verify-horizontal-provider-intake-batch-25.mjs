import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['red-desert-games', 'lucky-zodiac'],
  ['fazi', 'power-of-the-great'],
  ['18peaches', 'money-tree-jackpot-hold-and-win'],
  ['apparat-gaming', '1024-sevens'],
  ['pascal-gaming', 'franken-alive'],
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

const lucky = (await readEntry('games', 'lucky-zodiac')).data;
for (const field of ['rtp', 'volatilityNormalized', 'maxWinMultiplier', 'winMechanism']) {
  assert.equal(lucky[field], undefined, `Lucky Zodiac ${field} must stay missing without first-party evidence`);
}

const power = (await readEntry('games', 'power-of-the-great')).data;
assert.equal(power.rtp, 95.95);
assert.equal(power.winMechanism, 'paylines');
assert.equal(power.winCount, 20);
assert.deepEqual(power.features, ['free-spins', 'wild', 'multiplier', 'cascading']);

const moneyTree = (await readEntry('games', 'money-tree-jackpot-hold-and-win')).data;
assert.equal(moneyTree.rtp, 96.16);
assert.equal(moneyTree.winMechanism, undefined, 'N/A paylines must not become a guessed mechanism');
assert.equal(moneyTree.bonusBuy, true);

const sevens = (await readEntry('games', '1024-sevens')).data;
assert.equal(sevens.rtp, 96.2);
assert.deepEqual(sevens.rtpVariants, [96.2, 84.21]);
assert.equal(sevens.winMechanism, 'ways-to-win');
assert.equal(sevens.winCount, 1024);

const franken = (await readEntry('games', 'franken-alive')).data;
assert.equal(franken.rtp, 96.5);
assert.equal(franken.winCount, 20);
assert.equal(franken.maxWinMultiplier, 10000);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Red Desert Games', 'FAZI', '18Peaches', 'Apparat Gaming', 'Pascal Gaming']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`));
}
assert.match(map, /Realistic Games .*官方網域目前無法解析.*保留待補.*未收錄/);
assert.match(map, /下一個橫向接續位置為候選地圖第 184 項 PopOK Gaming/);

console.log('PASS: horizontal intake batch 25 published five first-party-source slot titles, preserved missing and multi-version values, and deferred inaccessible or non-slot candidates without guessing.');
