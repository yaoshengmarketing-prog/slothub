import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['platipus-gaming', 'royal-lotus'],
  ['playnetic', 'ghostlight-manor'],
  ['reevo', 'blue-beards-buried-treasure'],
  ['smartsoft-gaming', 'power-of-tiger'],
  ['storm-gaming-technology', 'tickets-to-fortune'],
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
  assert.equal(String(game.lastVerifiedAt).slice(0, 10), '2026-09-19');
  assert.ok(game.sources.length >= 2, `${gameSlug}: page and image evidence are required`);
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

const lotus = (await readEntry('games', 'royal-lotus')).data;
assert.equal(lotus.rtp, 95);
assert.equal(lotus.volatilityOriginal, 'Medium/High');
assert.equal(lotus.winMechanism, 'ways-to-win');
assert.equal(lotus.winCount, 720);
assert.ok(lotus.features.includes('jackpot'));

const ghostlight = (await readEntry('games', 'ghostlight-manor')).data;
assert.equal(ghostlight.rtp, 96.5);
assert.equal(ghostlight.volatilityOriginal, 'Very High');
assert.equal(ghostlight.maxWinMultiplier, 16000);
assert.equal(ghostlight.winCount, 15);
assert.ok(ghostlight.features.includes('hold-and-spin'));

const blueBeard = (await readEntry('games', 'blue-beards-buried-treasure')).data;
assert.deepEqual(blueBeard.rtpVariants, [91.71, 93.83, 95.76]);
assert.equal(blueBeard.volatilityOriginal, 'Low-Medium');
assert.equal(blueBeard.volatilityNormalized, undefined, 'Low-Medium must not be forced into the shared scale');
assert.equal(blueBeard.maxWinMultiplier, 1274);
assert.equal(blueBeard.bonusBuy, true);

const tiger = (await readEntry('games', 'power-of-tiger')).data;
assert.equal(tiger.rtp, undefined);
assert.equal(tiger.volatilityOriginal, undefined);
assert.equal(tiger.maxWinMultiplier, 2500);
assert.equal(tiger.winCount, 5);
assert.ok(tiger.features.includes('respins'));

const tickets = (await readEntry('games', 'tickets-to-fortune')).data;
assert.equal(tickets.rtp, undefined);
assert.equal(tickets.volatilityOriginal, undefined);
assert.equal(tickets.maxWinMultiplier, undefined);
assert.equal(tickets.reels, '3');
assert.equal(tickets.rows, 3);
assert.equal(tickets.winCount, 9);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['Platipus Gaming', 'Playnetic', 'REEVO', 'SmartSoft Gaming', 'Storm Gaming Technology']) {
  assert.match(map, new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\r\n]*已收錄（1）`));
}
assert.match(map, /Spadegaming[^\r\n]*保留待補/);
assert.match(map, /第三十二批完成 Platipus Gaming[^\r\n]*Storm Gaming Technology[^\r\n]*第三十三批/);
assert.match(map, /第 32 批由 Platipus Gaming 接續，完成五家並保存 Spadegaming/);

console.log('PASS: horizontal intake batch 32 added five traceable provider/game pairs, preserved unsupported values as missing, recorded the Spadegaming evidence gap, and advanced the cursor.');
