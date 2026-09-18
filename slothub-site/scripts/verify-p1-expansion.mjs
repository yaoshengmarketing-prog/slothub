import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { parse } from 'yaml';
import { GUIDE_READING_PATHS } from '../src/lib/guide-reading-path.mjs';
import { selectRecentlyVerifiedGames } from '../src/lib/recently-verified-games.mjs';

const contentRoot = new URL('../src/content/', import.meta.url);
const distRoot = new URL('../dist/', import.meta.url);

async function loadCollection(name) {
  const directory = new URL(`${name}/`, contentRoot);
  const files = (await readdir(directory)).filter((file) => file.endsWith('.md'));
  return Promise.all(files.map(async (file) => {
    const source = await readFile(new URL(file, directory), 'utf8');
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
    assert.ok(frontmatter, `${name}/${file}: frontmatter missing`);
    return { slug: file.replace(/\.md$/, ''), source, ...parse(frontmatter) };
  }));
}

const [games, guides, gamesIndexSource, payoutSource, gamesIndexHtml, guideIndexHtml, searchHtml, slotsHtml] = await Promise.all([
  loadCollection('games'),
  loadCollection('guides'),
  readFile(new URL('../src/pages/games/index.astro', import.meta.url), 'utf8'),
  readFile(new URL('../src/content/guides/slot-payout-mechanisms-explained.md', import.meta.url), 'utf8'),
  readFile(new URL('games/index.html', distRoot), 'utf8'),
  readFile(new URL('guide/index.html', distRoot), 'utf8'),
  readFile(new URL('search/index.html', distRoot), 'utf8'),
  readFile(new URL('slots/index.html', distRoot), 'utf8'),
]);

const publishedGames = games.filter((game) => game.status === 'published');
const publishedGuides = guides.filter((guide) => guide.status === 'published');
assert.equal(publishedGames.length, 157, 'P1 expansion must use the current 157 published Games');
assert.equal(publishedGuides.length, 14, 'P1 expansion must publish exactly two Guides, bringing the total to 14');

const waysGuide = guides.find((guide) => guide.slug === 'slot-ways-to-win-explained');
assert.ok(waysGuide, 'Ways to Win Guide missing');
assert.equal(waysGuide.status, 'published');
assert.deepEqual(waysGuide.relatedMechanisms, ['ways-to-win']);
assert.match(waysGuide.source, /\/games\/\?mechanism=ways-to-win/);
assert.ok(!waysGuide.relatedFeatures && !waysGuide.relatedDataTopics, 'Ways Guide must not claim unrelated owners');

const paytableGuide = guides.find((guide) => guide.slug === 'slot-paytable-and-betting-risk-explained');
assert.ok(paytableGuide, 'Paytable and betting risk Guide missing');
assert.equal(paytableGuide.status, 'published');
assert.ok(!paytableGuide.relatedMechanisms && !paytableGuide.relatedFeatures && !paytableGuide.relatedDataTopics, 'Paytable Guide must remain relationship-neutral');
assert.match(paytableGuide.source, /\/guide\/slot-bonus-buy-explained\//, 'Paytable Guide must link to the existing Bonus Buy owner');

const payoutGuide = guides.find((guide) => guide.slug === 'slot-payout-mechanisms-explained');
assert.deepEqual(payoutGuide.relatedMechanisms, ['paylines', 'megaways', 'cluster-pays', 'pay-anywhere']);
assert.match(payoutSource, /\/guide\/slot-ways-to-win-explained\//, 'Payout overview must link to the focused Ways Guide');

const readingPathSlugs = GUIDE_READING_PATHS.flatMap((section) => section.guideSlugs);
for (const slug of [waysGuide.slug, paytableGuide.slug]) {
  assert.equal(readingPathSlugs.filter((item) => item === slug).length, 1, `${slug}: reading-path placement must be unique`);
  assert.match(guideIndexHtml, new RegExp(`data-guide-reading-slug="${slug}"`), `${slug}: missing from Guide index`);
  assert.match(searchHtml, new RegExp(`/guide/${slug}/`), `${slug}: missing from Search index`);
}
assert.match(slotsHtml, /\/guide\/slot-ways-to-win-explained\//, 'Slots Hub must expose the new Ways owner');

const projectedGames = publishedGames.map((game) => ({
  ...game,
  name: game.displayNameZhHant ?? game.originalName ?? game.name,
  lastVerifiedAt: game.lastVerifiedAt instanceof Date
    ? game.lastVerifiedAt.toISOString().slice(0, 10)
    : game.lastVerifiedAt,
}));
const before = projectedGames.map((game) => game.slug);
const recent = selectRecentlyVerifiedGames(projectedGames);
assert.equal(recent.length, 6, 'Recently verified section must show six Games');
assert.deepEqual(projectedGames.map((game) => game.slug), before, 'Recently verified selector must not mutate the catalog');
assert.deepEqual(selectRecentlyVerifiedGames(projectedGames).map((game) => game.slug), recent.map((game) => game.slug), 'Recently verified ordering must be deterministic');
for (let index = 1; index < recent.length; index += 1) {
  assert.ok(recent[index - 1].lastVerifiedAt >= recent[index].lastVerifiedAt, 'Recently verified dates must sort descending');
}
assert.match(gamesIndexSource, /selectRecentlyVerifiedGames\(games\)/, 'Games page must derive recent entries from the shared selector');
assert.match(gamesIndexHtml, /最近核對的遊戲資料/);
assert.match(gamesIndexHtml, /不是新作、熱門或資料最完整排行/);
const renderedRecent = [...gamesIndexHtml.matchAll(/data-recently-verified-game="([^"]+)"/g)].map((match) => match[1]);
assert.deepEqual(renderedRecent, recent.map((game) => game.slug), 'Rendered recent entries must match the build-time projection');

const waysHtml = await readFile(new URL('guide/slot-ways-to-win-explained/index.html', distRoot), 'utf8');
const paytableHtml = await readFile(new URL('guide/slot-paytable-and-betting-risk-explained/index.html', distRoot), 'utf8');
for (const [name, html] of [['Ways', waysHtml], ['Paytable', paytableHtml]]) {
  assert.match(html, /content="noindex,nofollow"/, `${name}: Preview noindex missing`);
  assert.ok(!html.includes('rel="canonical"'), `${name}: Preview canonical must remain absent`);
}
assert.match(waysHtml, /href="\/games\/\?mechanism=ways-to-win"/);
assert.match(paytableHtml, /href="\/guide\/slot-bonus-buy-explained\/"/);

console.log('PASS: P1 expansion publishes two scoped Guides, migrates the Ways owner, and renders six deterministic recently verified Games from existing data.');
