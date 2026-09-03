import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const slugs = ['chaos-crew-2', 'densho', 'rise-of-olympus', 'moon-princess-100'];
async function readEntry(slug) {
  const source = await readFile(new URL(`../src/content/games/${slug}.md`, import.meta.url), 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  assert.ok(frontmatter, `${slug}: missing frontmatter`);
  return { source, data: parse(frontmatter) };
}
const entries = Object.fromEntries(await Promise.all(slugs.map(async (slug) => [slug, await readEntry(slug)])));
const statuses = new Set(slugs.map((slug) => entries[slug].data.status));
assert.equal(statuses.size, 1, 'eighth batch must move atomically');
assert.ok(['draft', 'published'].includes([...statuses][0]));

const chaos = entries['chaos-crew-2'].data;
assert.equal(chaos.provider, 'hacksaw-gaming');
assert.deepEqual(chaos.rtpVariants, [96.27, 94.22, 92.41, 88.28]);
assert.equal(chaos.winMechanism, 'paylines');
assert.equal(chaos.winCount, 19);
assert.equal(chaos.maxWinMultiplier, 20000);
assert.ok(!chaos.features.includes('free-spins'), 'Bonus round must not be inferred as Free Spins');

const densho = entries.densho.data;
assert.deepEqual(densho.rtpVariants, [96.4, 94.38, 92.33, 88.34]);
assert.equal(densho.volatilityOriginal, '4 / 5');
assert.equal(densho.winCount, 10);
assert.equal(densho.bonusBuy, true);

for (const slug of ['rise-of-olympus', 'moon-princess-100']) {
  const game = entries[slug].data;
  assert.equal(game.provider, 'play-n-go');
  assert.equal(game.winMechanism, 'cluster-pays');
  assert.ok(game.features.includes('cascading'));
  assert.ok(game.features.includes('free-spins'));
  assert.equal(game.rtp, undefined, `${slug}: missing official RTP must stay unknown`);
  assert.equal(game.maxWinMultiplier, undefined, `${slug}: Feature prize must not become whole-game Max Win`);
}

for (const slug of slugs) {
  const game = entries[slug].data;
  assert.ok(game.sources.length >= 2, `${slug}: insufficient first-party sources`);
  assert.ok(game.sources.every((source) => /hacksawgaming\.com|playngo\.com|wixstatic\.com/.test(source.url)), `${slug}: non-first-party source`);
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

console.log(`PASS: eighth batch is atomically ${[...statuses][0]}; exact first-party values, unknown fields and media boundaries verified.`);
