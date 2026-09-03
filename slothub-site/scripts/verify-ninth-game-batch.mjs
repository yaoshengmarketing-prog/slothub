import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const slugs = ['divine-fortune', 'divine-fortune-megaways', 'gold-gold-gold-hold-and-win', 'ultra-buffalo-hold-and-win'];
async function readEntry(slug) {
  const source = await readFile(new URL(`../src/content/games/${slug}.md`, import.meta.url), 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  assert.ok(frontmatter, `${slug}: missing frontmatter`);
  return { source, data: parse(frontmatter) };
}
const entries = Object.fromEntries(await Promise.all(slugs.map(async (slug) => [slug, await readEntry(slug)])));
const statuses = new Set(slugs.map((slug) => entries[slug].data.status));
assert.equal(statuses.size, 1, 'ninth batch must move atomically');
assert.ok(['draft', 'published'].includes([...statuses][0]));

const divine = entries['divine-fortune'].data;
assert.equal(divine.rtp, 96.59);
assert.equal(divine.volatilityOriginal, 'medium volatility');
assert.equal(divine.maxWinMultiplier, 1000);
assert.equal(divine.winCount, 20);
assert.ok(divine.features.includes('jackpot'));
assert.equal(divine.bonusBuy, undefined, 'Bonus mode must not be inferred as Bonus Buy');

const megaways = entries['divine-fortune-megaways'].data;
assert.equal(megaways.rtp, 96.09);
assert.equal(megaways.winMechanism, 'megaways');
assert.equal(megaways.winCount, 117649);
assert.equal(megaways.rows, undefined, 'dynamic rows must not become a fixed row count');
assert.equal(megaways.volatilityOriginal, undefined, 'missing official volatility label must stay unknown');

for (const slug of ['gold-gold-gold-hold-and-win', 'ultra-buffalo-hold-and-win']) {
  const game = entries[slug].data;
  assert.equal(game.provider, 'booming-games');
  assert.equal(game.rtp, undefined, `${slug}: missing RTP must stay unknown`);
  assert.equal(game.volatilityOriginal, undefined, `${slug}: missing volatility must stay unknown`);
  assert.ok(game.features.includes('hold-and-spin'));
  assert.ok(game.features.includes('respins'));
}

for (const slug of slugs) {
  const game = entries[slug].data;
  assert.ok(game.sources.length >= 2, `${slug}: insufficient first-party sources`);
  assert.ok(game.sources.every((source) => /netent\.com|nolimitcity\.com|booming-games\.com/.test(source.url)), `${slug}: non-first-party source`);
  assert.equal(String(game.lastVerifiedAt).slice(0, 10), '2026-09-03');
  const info = await stat(new URL(`../public${game.image.src}`, import.meta.url));
  assert.ok(info.size > 25_000, `${slug}: image asset is unexpectedly small`);
  const built = readFile(new URL(`../dist/games/${slug}/index.html`, import.meta.url), 'utf8');
  if (game.status === 'draft') await assert.rejects(built, { code: 'ENOENT' }, `${slug}: draft leaked into build`);
  else {
    const html = await built;
    assert.match(html, /content="noindex,nofollow"/);
    assert.ok(!html.includes('rel="canonical"'));
  }
}

console.log(`PASS: ninth batch is atomically ${[...statuses][0]}; first-party values, unknown fields, dynamic layout and media boundaries verified.`);
