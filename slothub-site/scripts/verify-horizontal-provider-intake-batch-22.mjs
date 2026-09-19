import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['delulu-gaming', 'oh-my-gods'],
  ['enjoygaming', 'diamond-slam'],
  ['worldmatch', 'space-bar'],
  ['caleta-gaming', 'fate-of-olympus'],
  ['print-studios', 'uncle-profit'],
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

const gods = (await readEntry('games', 'oh-my-gods')).data;
assert.equal(gods.rtp, undefined);
assert.equal(gods.winMechanism, undefined);
assert.equal(gods.bonusBuy, true);
assert.deepEqual(gods.features, ['free-spins', 'multiplier', 'bonus-buy']);

const diamond = (await readEntry('games', 'diamond-slam')).data;
assert.equal(diamond.rtp, undefined);
assert.equal(diamond.winMechanism, 'paylines');
assert.equal(diamond.winCount, 5);
assert.equal(diamond.maxWinMultiplier, 1000);

const space = (await readEntry('games', 'space-bar')).data;
assert.equal(space.rtp, undefined);
assert.equal(space.maxWinMultiplier, undefined);
assert.equal(space.volatilityOriginal, 'Low');
assert.equal(space.volatilityNormalized, 'low');

const fate = (await readEntry('games', 'fate-of-olympus')).data;
assert.equal(fate.rtp, 97.73);
assert.deepEqual(fate.rtpVariants, [97.73]);
assert.equal(fate.volatilityOriginal, 'Very High');
assert.equal(fate.maxWinMultiplier, 42000);
assert.equal(fate.image.sourceUrl, 'https://framerusercontent.com/images/HH9CN8z3998mut0j9TC6BObII4.png?width=500&height=500');

const uncle = (await readEntry('games', 'uncle-profit')).data;
assert.equal(uncle.rtp, 96.08);
assert.deepEqual(uncle.rtpVariants, [96.08]);
assert.equal(uncle.volatilityOriginal, '8 out of 10');
assert.equal(uncle.volatilityNormalized, undefined, 'Provider-specific 8/10 scale must not be normalized without an approved mapping');
assert.equal(uncle.maxWinMultiplier, 50000);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['DELULU Gaming', 'ENJOY', 'WorldMatch', 'Caleta Gaming', 'Print Studios']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`));
}
assert.match(map, /Aurum Signature Studios .*已收錄（1）/);
assert.match(map, /Fastspin .*尚未建立可直接核對資料與圖片的單款官方入口，保留待補/);
assert.match(map, /第二十二批完成 DELULU Gaming、ENJOY、WorldMatch、Caleta Gaming 與 Print Studios/);

console.log('PASS: horizontal intake batch 22 published five official-source slot titles, corrected the Fate of Olympus asset, preserved unsupported values as missing, retained Fastspin as deferred and allows the later verified Aurum intake.');
