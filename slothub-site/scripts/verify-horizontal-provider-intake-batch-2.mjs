import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['1x2gaming', 'x-wild'],
  ['iron-dog-studio', '3-plucky-hens'],
  ['prospect-gaming', '3-dragon-pots'],
  ['3-oaks-gaming', 'sun-of-egypt-4'],
  ['4theplayer', '123-boom'],
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

const xWild = (await readEntry('games', 'x-wild')).data;
assert.equal(xWild.winMechanism, 'paylines');
assert.equal(xWild.winCount, 10);
assert.equal(xWild.volatilityOriginal, 'Medium');
assert.match(xWild.summary, /另稱 low/);

const hens = (await readEntry('games', '3-plucky-hens')).data;
assert.deepEqual(hens.rtpVariants, [95, 93, 91]);
assert.equal(hens.maxWinMultiplier, 5000);
assert.ok(hens.features.includes('hold-and-spin'));

const dragons = (await readEntry('games', '3-dragon-pots')).data;
assert.equal(dragons.volatilityNormalized, 'medium-high');
assert.equal(dragons.releaseDate, '2025-01-15');
assert.equal(dragons.bonusBuy, undefined, 'Image-only Buy Bonus evidence must not become a structured Bonus Buy fact');

const egypt = (await readEntry('games', 'sun-of-egypt-4')).data;
assert.equal(egypt.rtp, undefined, 'Missing official RTP must remain missing');
assert.equal(egypt.volatilityOriginal, undefined, 'Missing official volatility must remain missing');
assert.equal(egypt.maxWinMultiplier, undefined, 'A feature-specific Royal Jackpot must not become the whole-game max win');
assert.equal(egypt.winCount, 25);

const boom = (await readEntry('games', '123-boom')).data;
assert.equal(boom.rtp, 96.44);
assert.equal(boom.winCount, 1024);
assert.equal(boom.maxWinMultiplier, 14827);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['1X2gaming', 'Iron Dog Studio', 'Prospect Gaming', '3 Oaks Gaming', '4ThePlayer']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`), `${name}: candidate map status not updated`);
}
assert.match(map, /AD LUNAM.*待補老虎機作品證據/);

console.log('PASS: horizontal intake batch 2 published five traceable Providers and one verified slot per Provider while preserving conflicts and missing values.');
