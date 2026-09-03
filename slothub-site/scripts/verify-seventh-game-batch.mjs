import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const slugs = ['white-rabbit', 'lil-devil', 'vegas-gold', 'drunken-sailors'];
async function readEntry(slug) {
  const source = await readFile(new URL(`../src/content/games/${slug}.md`, import.meta.url), 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  assert.ok(frontmatter, `${slug}: missing frontmatter`);
  return { source, data: parse(frontmatter) };
}
const entries = Object.fromEntries(await Promise.all(slugs.map(async (slug) => [slug, await readEntry(slug)])));
const statuses = new Set(slugs.map((slug) => entries[slug].data.status));
assert.equal(statuses.size, 1, 'seventh batch must move atomically');
assert.ok(['draft', 'published'].includes([...statuses][0]));

const white = entries['white-rabbit'].data;
assert.equal(white.provider, 'big-time-gaming');
assert.equal(white.winMechanism, 'megaways');
assert.equal(white.winCount, undefined, 'dynamic Megaways must not become fixed winCount');
assert.equal(white.maxWinMultiplier, 17420);
assert.equal(white.rtp, undefined, 'RTP range must not become a false primary value');
assert.equal(white.rtpVariants, undefined, 'RTP range endpoints must not become variants');
assert.equal(white.bonusBuy, true);

const lil = entries['lil-devil'].data;
assert.equal(lil.winMechanism, 'ways-to-win');
assert.equal(lil.winCount, 4096);
assert.equal(lil.maxWinMultiplier, 100504);
assert.equal(lil.volatilityOriginal, 'Extremely volatile');
assert.equal(lil.volatilityNormalized, undefined, 'provider wording must not be forced into a shared scale');
assert.equal(lil.rtpVariants, undefined, 'official RTP range is not a variants list');

const vegas = entries['vegas-gold'].data;
assert.equal(vegas.rtp, 96.36);
assert.equal(vegas.winMechanism, 'other');
assert.equal(vegas.bonusBuy, false);
assert.equal(vegas.maxWinMultiplier, 5000);

const sailors = entries['drunken-sailors'].data;
assert.deepEqual(sailors.rtpVariants, [96.14, 94.3]);
assert.equal(sailors.winMechanism, 'paylines');
assert.equal(sailors.winCount, 40);
assert.equal(sailors.bonusBuy, true);
assert.ok(sailors.features.includes('sticky-symbols'));

for (const slug of slugs) {
  const game = entries[slug].data;
  assert.ok(game.sources.length >= 3, `${slug}: insufficient first-party sources`);
  assert.ok(game.sources.every((source) => /bigtimegaming\.com|squarespace-cdn\.com|slotmill\.com/.test(source.url)), `${slug}: non-first-party source`);
  assert.equal(String(game.lastVerifiedAt).slice(0, 10), '2026-09-03');
  const info = await stat(new URL(`../public${game.image.src}`, import.meta.url));
  assert.ok(info.size > 40_000, `${slug}: image asset is unexpectedly small`);
  const built = readFile(new URL(`../dist/games/${slug}/index.html`, import.meta.url), 'utf8');
  if (game.status === 'draft') await assert.rejects(built, { code: 'ENOENT' }, `${slug}: draft leaked into build`);
  else {
    const html = await built;
    assert.match(html, /content="noindex,nofollow"/);
    assert.ok(!html.includes('rel="canonical"'));
  }
}

console.log(`PASS: seventh batch is atomically ${[...statuses][0]}; first-party ranges, versions, labels and media remain distinct.`);
