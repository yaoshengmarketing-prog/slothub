import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import {
  SIMILAR_PLAY_DISTINCTIVE_FEATURES,
  SIMILAR_PLAY_EXCLUDED_FEATURES,
  buildSimilarPlayPresentation,
} from '../src/lib/similar-play.mjs';

const gamesDirectory = fileURLToPath(new URL('../src/content/games/', import.meta.url));
const distGamesDirectory = fileURLToPath(new URL('../dist/games/', import.meta.url));
const files = (await readdir(gamesDirectory)).filter((file) => file.endsWith('.md')).sort();
const records = await Promise.all(files.map(async (file) => {
  const raw = await readFile(join(gamesDirectory, file), 'utf8');
  const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  if (!frontmatter) throw new Error(`${file}: missing frontmatter`);
  const data = parse(frontmatter);
  return {
    slug: basename(file, '.md'),
    status: data.status,
    name: data.displayNameZhHant ?? data.originalName ?? data.name,
    provider: data.provider,
    winMechanism: data.winMechanism,
    winCount: data.winCount,
    features: data.features ?? [],
    reels: data.reels,
    rows: data.rows,
  };
}));

const published = records.filter((game) => game.status === 'published');
assert.equal(published.length, 222, 'expected 222 published Games');
assert.deepEqual(SIMILAR_PLAY_DISTINCTIVE_FEATURES, [
  'cascading', 'bonus-buy', 'hold-and-spin', 'respins', 'cash-collection',
  'giant-symbols', 'sticky-symbols', 'symbol-splitting', 'jackpot',
]);
assert.deepEqual(SIMILAR_PLAY_EXCLUDED_FEATURES, ['wild', 'scatter', 'other']);

const presentations = new Map(published.map((game) => [game.slug, buildSimilarPlayPresentation(game.slug, records)]));
const withResults = [...presentations.values()].filter((presentation) => presentation.items.length > 0);
const zeroSlugs = [...presentations.entries()].filter(([, presentation]) => presentation.items.length === 0).map(([slug]) => slug).sort();
assert.equal(withResults.length, 166, '166 Games should have similar-play results');
assert.deepEqual(zeroSlugs, ['3-dragon-pots', '3-lucky-rainbows-action-boost', '3-plucky-hens', '3-wonders-luck-of-stallion', '9-masks-of-fire', 'atlantis-crush', 'avalanche-good-times', 'banana-town', 'banana-town-dream-drop', 'best-bet', 'bison-moon', 'book-of-aztec', 'coconut-chaos', 'dead-headz', 'enchanted-woods', 'fate-of-olympus', 'fire-stampede-dollars-and-dreams', 'fowl-play-gold', 'goal-strike-rising-rewards', 'golden-fruit-vegas-classic', 'golden-sun-aztec', 'golden-ticket', 'jolly-leprechaun', 'kingdom-wardens', 'kingfisher', 'kings-of-crystals-ii', 'loaded-up-riches-pots', 'lucky-zodiac', 'money-coming', 'money-tree-jackpot-hold-and-win', 'mortal-oath', 'oh-my-gods', 'precious-monkeys', 'push-the-button', 'pyramid-of-light', 'redbeards-ruby-fortune-map', 'rome-fight-for-gold-eternal-empire', 'shadow-of-dominion', 'shoot-for-the-loot', 'space-bar', 'storm-of-seth', 'storm-of-seth-2-awakening', 'the-book-beyond-2', 'the-library-kitsune', 'the-secret-of-amun-ra', 'tikitopia-boosterbelt', 'ufc-gold-blitz-extreme', 'uncle-profit', 'upshot-prosperity-rising', 'vegas-gold', 'werewolf-cp-games', 'whitney-houston-slots', 'wild-fruit-super-wheel', 'wild-hour-league', 'wild-whopper', 'win-in-rome']);

for (const [slug, presentation] of presentations) {
  assert.ok(presentation.items.length <= 4, `${slug}: rendered over four cards`);
  assert.equal(new Set(presentation.items.map((item) => item.game.slug)).size, presentation.items.length, `${slug}: duplicate slug`);
  for (const item of presentation.items) {
    assert.notEqual(item.game.slug, slug, `${slug}: included itself`);
    assert.equal(item.game.status, 'published', `${slug}: included a draft`);
    assert.equal(item.game.winMechanism, presentation.mechanism, `${slug}: mechanism mismatch`);
    assert.notEqual(item.game.winMechanism, 'other', `${slug}: included other mechanism`);
    assert.ok(item.reasons.length <= 2, `${slug}: rendered over two reasons`);
    for (const reason of item.reasons) {
      const current = published.find((game) => game.slug === slug);
      if (reason.type === 'feature') {
        assert.ok(!['wild', 'scatter'].includes(reason.value), `${slug}: rendered excluded ${reason.value} reason`);
        assert.ok(current.features.includes(reason.value) && item.game.features.includes(reason.value), `${slug}: unshared feature reason`);
      } else {
        assert.equal(reason.type, 'win-count');
        assert.equal(current.winCount, item.game.winCount, `${slug}: invalid winCount reason`);
      }
    }
  }
}

assert.equal(presentations.get('reactoonz').items.length, 4, 'Reactoonz should exercise the stable 4-card limit with the current published catalog');
assert.ok([3, 4].includes(presentations.get('mahjong-ways').items.length), 'Mahjong Ways should exercise a populated 3–4-card state');
assert.equal(presentations.get('big-bass-bonanza').items.length, 4, 'Big Bass Bonanza should exercise the 4-card limit');
assert.ok(!presentations.get('super-ace').items.some((item) => item.reasons.some((reason) => reason.value === 'cascading')), 'Super Ace must not receive Cascading');

const mutatedStructure = records.map((game) => ({ ...game, reels: `synthetic-${game.slug}`, rows: 999 }));
const comparablePresentation = (presentation) => ({
  mechanism: presentation.mechanism,
  items: presentation.items.map((item) => ({ slug: item.game.slug, reasons: item.reasons })),
});
for (const game of published) {
  const before = comparablePresentation(buildSimilarPlayPresentation(game.slug, records));
  const after = comparablePresentation(buildSimilarPlayPresentation(game.slug, mutatedStructure));
  assert.deepEqual(after, before, `${game.slug}: reels/rows affected qualification, sorting or reasons`);
  assert.deepEqual(
    comparablePresentation(buildSimilarPlayPresentation(game.slug, [...records].reverse())),
    before,
    `${game.slug}: collection order affected sorting`,
  );
}

const duplicateFixture = [...records, { ...records.find((game) => game.slug === 'mahjong-ways-2') }];
assert.equal(
  new Set(buildSimilarPlayPresentation('mahjong-ways', duplicateFixture).items.map((item) => item.game.slug)).size,
  presentations.get('mahjong-ways').items.length,
  'duplicate fixture was not deduplicated',
);
const draftFixture = records.map((game) => game.slug === 'mahjong-ways-2' ? { ...game, status: 'draft' } : game);
assert.ok(!buildSimilarPlayPresentation('mahjong-ways', draftFixture).items.some((item) => item.game.slug === 'mahjong-ways-2'), 'draft candidate was included');
const oneResultFixture = records.filter((game) => ['mahjong-ways', 'mahjong-ways-2'].includes(game.slug));
assert.equal(buildSimilarPlayPresentation('mahjong-ways', oneResultFixture).items.length, 1, 'one-card state was not preserved');

let renderedModules = 0;
for (const game of published) {
  const html = await readFile(join(distGamesDirectory, game.slug, 'index.html'), 'utf8');
  const hasModule = html.includes('class="game-similar-play"');
  if (hasModule) renderedModules += 1;
  assert.equal(hasModule, presentations.get(game.slug).items.length > 0, `${game.slug}: module visibility mismatch`);
  if (!hasModule) continue;
  assert.ok(html.includes('依主要賠付機制整理，功能與規則可能不同。'), `${game.slug}: explanation missing`);
  assert.ok(html.includes(`/games/?mechanism=${presentations.get(game.slug).mechanism}`), `${game.slug}: exact mechanism Explore URL missing`);
  assert.equal((html.match(/data-similar-play-slug=/g) ?? []).length, presentations.get(game.slug).items.length, `${game.slug}: rendered card count mismatch`);
  assert.ok(!html.includes('similarity-score'), `${game.slug}: similarity score rendered`);
}
assert.equal(renderedModules, 166, 'expected 166 rendered similar-play modules');

const representativeHtml = await readFile(join(distGamesDirectory, 'big-bass-bonanza', 'index.html'), 'utf8');
assert.ok(representativeHtml.indexOf('class="game-next-explore"') < representativeHtml.indexOf('class="game-similar-play"'), 'similar-play must belong to the shared next-explore section');
assert.ok(representativeHtml.indexOf('class="game-similar-play"') < representativeHtml.indexOf('class="game-guide-rail"'), 'similar-play must precede the related Guide section');
const styles = await readFile(fileURLToPath(new URL('../src/styles/global.css', import.meta.url)), 'utf8');
assert.match(styles, /\.similar-play-explore\{[^}]*min-height:44px/, 'Explore CTA must preserve a 44px touch target');
assert.match(styles, /\.similar-play-grid>li>a:focus-visible[^}]*outline:/, 'similar-play links need a visible keyboard focus style');

console.log('PASS: Similar play computed for 222 Games with stable sorting, exact reasons and mechanism URLs verified.');
