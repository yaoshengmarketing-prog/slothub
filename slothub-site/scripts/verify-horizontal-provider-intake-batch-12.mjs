import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const batch = [
  ['7mojos', 'fruit-dash'],
  ['spinoro', 'honor-of-egypt'],
  ['apexwin', 'thiefs-plan'],
  ['bulgames', 'winter-hills'],
  ['cp-games', 'werewolf-cp-games'],
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
  assert.equal(String(game.lastVerifiedAt).slice(0, 10), '2026-09-18', `${gameSlug}: verification date mismatch`);
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

const fruit = (await readEntry('games', 'fruit-dash')).data;
assert.equal(fruit.rtp, 96.746);
assert.equal(fruit.volatilityOriginal, 'Low-Med');
assert.equal(fruit.volatilityNormalized, undefined, '7Mojos Low-Med label must not be forced into a shared scale');
assert.equal(fruit.winCount, 40);

const egypt = (await readEntry('games', 'honor-of-egypt')).data;
assert.equal(egypt.rtp, 94);
assert.equal(egypt.volatilityNormalized, 'medium-high');
assert.equal(egypt.maxWinMultiplier, 12204);
assert.equal(egypt.bonusBuy, true);

const thief = (await readEntry('games', 'thiefs-plan')).data;
assert.equal(thief.rtp, 98.5);
assert.equal(thief.volatilityOriginal, 'LOW-MEDIUM');
assert.equal(thief.volatilityNormalized, undefined, 'ApexWin original label must remain distinct from the editorial scale');
assert.equal(thief.maxWinMultiplier, 9000);
assert.equal(thief.winCount, 40);

const winter = (await readEntry('games', 'winter-hills')).data;
assert.equal(winter.rtp, undefined, 'Bulgames catalog does not publish an RTP');
assert.equal(winter.volatilityOriginal, undefined, 'Bulgames catalog does not publish volatility');
assert.equal(winter.maxWinMultiplier, undefined, 'Bulgames catalog does not publish a max win');
assert.equal(winter.winCount, 10);

const wolf = (await readEntry('games', 'werewolf-cp-games')).data;
assert.equal(wolf.maxWinMultiplier, 1500);
assert.equal(wolf.rtp, undefined, 'CP.GAMES public Werewolf copy does not publish an RTP');
assert.equal(wolf.winMechanism, undefined, '3x3 grid alone must not be used to infer a win mechanism');
assert.deepEqual(wolf.features, ['wild', 'multiplier', 'respins']);

const map = await readFile(new URL('../docs/provider-candidate-map-v1.md', import.meta.url), 'utf8');
for (const name of ['7Mojos', 'SpinOro／Anakatech', 'ApexWin', 'Bulgames', 'CP.GAMES']) {
  assert.match(map, new RegExp(`\\| ${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} .*\\| 已收錄（1） \\|`), `${name}: candidate map status not updated`);
}
assert.match(map, /下一個主動接續品牌為 DYG/);
assert.match(map, /REMAINING_RESEARCH_LEAD_COUNT: 0/);

console.log('PASS: horizontal intake batch 12 published five confirmed slot Providers and one source-backed game per Provider, kept missing values honest, and closed all previously pending provider-identity leads without changing schema or taxonomy.');
