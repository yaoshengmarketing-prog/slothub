import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { parse } from 'yaml';

const slugs = ['jump-high-2', 'all-wilds', 'golden-empire', 'money-coming'];
async function readEntry(slug) {
  const source = await readFile(new URL(`../src/content/games/${slug}.md`, import.meta.url), 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  assert.ok(frontmatter, `${slug}: missing frontmatter`);
  return { source, data: parse(frontmatter) };
}
const entries = Object.fromEntries(await Promise.all(slugs.map(async (slug) => [slug, await readEntry(slug)])));
const statuses = new Set(slugs.map((slug) => entries[slug].data.status));
assert.equal(statuses.size, 1, 'tenth batch must move atomically');
assert.ok(['draft', 'published'].includes([...statuses][0]));

const jump = entries['jump-high-2'].data;
assert.equal(jump.provider, 'cq9-gaming');
assert.equal(jump.rtp, 96.07);
assert.equal(jump.volatilityOriginal, 'High');
assert.equal(jump.winMechanism, 'ways-to-win');
assert.equal(jump.winCount, 243);
assert.deepEqual(jump.features, ['free-spins', 'multiplier']);
assert.match(jump.maxWinLabelOriginal, /maximum_win: 5000/);

const wilds = entries['all-wilds'].data;
assert.equal(wilds.provider, 'cq9-gaming');
assert.equal(wilds.rtp, 96.03);
assert.equal(wilds.winMechanism, 'paylines');
assert.equal(wilds.winCount, 40);
assert.deepEqual(wilds.features, ['free-spins', 'wild']);
assert.ok(!wilds.features.includes('multiplier'), 'All Wilds name must not infer multiplier');

const golden = entries['golden-empire'].data;
assert.equal(golden.provider, 'jili-games');
assert.equal(golden.volatilityOriginal, 'LOW-MED');
assert.equal(golden.volatilityNormalized, undefined, 'LOW-MED must not be force-normalized');
assert.equal(golden.winMechanism, 'megaways');
assert.equal(golden.winCount, 32400);
assert.equal(golden.rows, undefined, 'dynamic layout must not become fixed rows');
assert.ok(golden.features.includes('cascading'));

const money = entries['money-coming'].data;
assert.equal(money.provider, 'jili-games');
assert.equal(money.volatilityOriginal, 'LOW-MED');
assert.equal(money.winMechanism, undefined, 'conflicting one-line and no-connection wording must not be normalized');
assert.equal(money.winCount, undefined);
assert.deepEqual(money.features, []);
assert.match(money.paylines, /1 line/);
assert.match(money.paylines, /do not require connecting lines/);

for (const slug of slugs) {
  const game = entries[slug].data;
  assert.ok(game.sources.length >= 2, `${slug}: insufficient first-party sources`);
  assert.ok(game.sources.every((source) => /cq9gaming\.com|hfyali\.com|jiligames\.com|storage\.googleapis\.com/.test(source.url)), `${slug}: non-first-party source`);
  assert.equal(String(game.lastVerifiedAt).slice(0, 10), '2026-09-03');
  const info = await stat(new URL(`../public${game.image.src}`, import.meta.url));
  assert.ok(info.size > 4_000, `${slug}: image asset is unexpectedly small`);
  const built = readFile(new URL(`../dist/games/${slug}/index.html`, import.meta.url), 'utf8');
  if (game.status === 'draft') await assert.rejects(built, { code: 'ENOENT' }, `${slug}: draft leaked into build`);
  else {
    const html = await built;
    assert.match(html, /content="noindex,nofollow"/);
    assert.ok(!html.includes('rel="canonical"'));
  }
}

console.log(`PASS: tenth batch is atomically ${[...statuses][0]}; first-party terminology, conflict preservation, unknown fields and media boundaries verified.`);
