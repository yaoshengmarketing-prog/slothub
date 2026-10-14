import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { buildGuideRelationshipIndex, GUIDE_DATA_TOPICS, validateGuideDeclarations } from '../src/lib/guide-relationships.mjs';
import { emptyExplorerState, serializeExplorerState } from '../src/lib/game-explorer-state.mjs';

const root = fileURLToPath(new URL('../src/content/', import.meta.url));
const load = (collection) => readdirSync(join(root, collection))
  .filter((file) => file.endsWith('.md'))
  .map((file) => {
    const raw = readFileSync(join(root, collection, file), 'utf8');
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) throw new Error(`${file}: missing YAML frontmatter`);
    return { slug: basename(file, '.md'), ...parse(match[1]) };
  });

const guides = load('guides');
const games = load('games').map((game) => ({
  ...game,
  name: game.displayNameZhHant ?? game.originalName ?? game.name,
  originalName: game.originalName ?? game.name,
  url: `/games/${game.slug}/`,
}));
const mechanisms = ['paylines', 'ways-to-win', 'megaways', 'cluster-pays', 'pay-anywhere', 'other'];
const features = [
  'free-spins', 'wild', 'scatter', 'multiplier', 'hold-and-spin', 'cascading', 'bonus-buy',
  'respins', 'cash-collection', 'giant-symbols', 'symbol-splitting', 'sticky-symbols', 'jackpot', 'other',
];
const options = { mechanisms, features, dataTopics: GUIDE_DATA_TOPICS };
const bonusBuyGuideSlug = 'slot-bonus-buy-explained';
const bonusBuyGuide = guides.find((guide) => guide.slug === bonusBuyGuideSlug);
assert.ok(bonusBuyGuide, 'Bonus Buy Guide is missing or its slug changed');
assert.deepEqual(bonusBuyGuide.relatedFeatures, ['bonus-buy'], 'Bonus Buy Guide must own only the bonus-buy Feature');
const bonusBuyGuidePublished = bonusBuyGuide.status === 'published';
const bonusBuyOwnerSlug = bonusBuyGuidePublished ? bonusBuyGuideSlug : 'slot-terms-glossary';

validateGuideDeclarations(guides, options);
const index = buildGuideRelationshipIndex(guides, games, options);
assert.equal(games.filter((game) => game.status === 'published').length, 347, 'Relationship fixture must cover 347 published games');

const expected = {
  'rtp-explained': { relatedDataTopics: ['rtp', 'rtp-variants'] },
  'volatility-explained': { relatedDataTopics: ['volatility'] },
  'slot-symbols-and-features': { relatedFeatures: ['free-spins', 'wild', 'scatter', 'jackpot'] },
  ...(bonusBuyGuidePublished
    ? { [bonusBuyGuideSlug]: { relatedFeatures: ['bonus-buy'] } }
    : { 'slot-terms-glossary': { relatedFeatures: ['bonus-buy'] } }),
};
for (const [slug, relations] of Object.entries(expected)) {
  const guide = guides.find((item) => item.slug === slug);
  assert.ok(guide, `Required v1 Guide is missing or its slug changed: ${slug}`);
  assert.equal(guide.status, 'published', `${slug} must remain published`);
  for (const [field, values] of Object.entries(relations)) assert.deepEqual(guide[field], values, `${slug}: ${field}`);
}

assert.deepEqual(index.featureToGuides.wild.map((guide) => guide.slug), ['slot-symbols-and-features']);
assert.deepEqual(index.dataTopicToGuides.rtp.map((guide) => guide.slug), ['rtp-explained']);
assert.deepEqual(index.featureToGuides['bonus-buy'].map((guide) => guide.slug), [bonusBuyOwnerSlug], 'bonus-buy must have exactly one published Guide owner');
assert.equal(index.guideToGames[bonusBuyOwnerSlug].length, 103, 'Bonus Buy owner must derive exactly the 103 Games tagged with bonus-buy');
const gamesWithoutBonusBuy = games.filter((game) => game.status === 'published' && !game.features?.includes('bonus-buy'));
assert.equal(gamesWithoutBonusBuy.length, 244, 'Exactly 244 published Games must remain outside the bonus-buy Feature set');
for (const game of gamesWithoutBonusBuy) {
  assert.ok(!index.gameToGuides[game.slug].some(({ guide }) => guide.slug === bonusBuyOwnerSlug), `${game.slug}: missing bonus-buy Feature must not create a Bonus Buy Guide relation`);
}
if (bonusBuyGuidePublished) {
  const glossary = guides.find((guide) => guide.slug === 'slot-terms-glossary');
  assert.ok(!glossary.relatedFeatures?.includes('bonus-buy'), 'Glossary retained bonus-buy ownership after the new Guide was published');
} else {
  assert.ok(!index.guides.some((guide) => guide.slug === bonusBuyGuideSlug), 'Draft Bonus Buy Guide entered the public relationship index');
}

const symbolsGuideSlug = 'slot-symbols-and-features';
const expectedSymbolsFeatureCounts = { 'free-spins': 205, wild: 179, scatter: 96, jackpot: 56 };
for (const [feature, expectedCount] of Object.entries(expectedSymbolsFeatureCounts)) {
  const matchingGames = games.filter((game) => game.status === 'published' && game.features?.includes(feature));
  assert.equal(matchingGames.length, expectedCount, `${feature}: published Game Feature count changed`);
}
assert.equal(index.guideToGames[symbolsGuideSlug].length, 268, 'Symbols Guide must derive the 268 published Games with at least one owned Feature');
assert.ok(!index.gameToGuides['hand-of-anubis'].some(({ guide }) => guide.slug === symbolsGuideSlug), 'Hand of Anubis retained an unsupported Symbols Guide relation');

const cascadingGuideSlug = 'slot-cascading-tumble-avalanche-explained';
const cascadingGuide = guides.find((guide) => guide.slug === cascadingGuideSlug);
assert.ok(cascadingGuide, 'Cascading Guide is missing or its slug changed');
assert.deepEqual(cascadingGuide.relatedFeatures, ['cascading'], 'Cascading Guide must own only the cascading Feature');
const expectedCascadingOwners = cascadingGuide.status === 'published' ? [cascadingGuideSlug] : [];
assert.deepEqual(index.featureToGuides.cascading.map((guide) => guide.slug), expectedCascadingOwners, 'cascading ownership must follow the Cascading Guide status');

const cascadingPreviewGuides = guides.map((guide) => guide.slug === cascadingGuideSlug ? { ...guide, status: 'published' } : guide);
const cascadingPreviewIndex = buildGuideRelationshipIndex(cascadingPreviewGuides, games, options);
assert.deepEqual(cascadingPreviewIndex.featureToGuides.cascading.map((guide) => guide.slug), [cascadingGuideSlug], 'cascading must have exactly one published Guide owner');
assert.equal(cascadingPreviewIndex.guideToGames[cascadingGuideSlug].length, 57, 'Cascading Guide must derive exactly the 57 Games tagged with cascading');
const gamesWithoutCascading = games.filter((game) => game.status === 'published' && !game.features?.includes('cascading'));
assert.equal(gamesWithoutCascading.length, 290, 'Exactly 290 published Games must remain outside the cascading Feature set');
for (const game of gamesWithoutCascading) {
  assert.ok(!cascadingPreviewIndex.gameToGuides[game.slug].some(({ guide }) => guide.slug === cascadingGuideSlug), `${game.slug}: missing cascading Feature must not create a Cascading Guide relation`);
}
assert.ok(!cascadingPreviewIndex.gameToGuides['super-ace'].some(({ guide }) => guide.slug === cascadingGuideSlug), 'Super Ace must not create a Cascading Guide relation');
assert.ok(cascadingPreviewIndex.gameToGuides['hand-of-anubis'].some(({ guide }) => guide.slug === cascadingGuideSlug), 'Hand of Anubis must retain its verified Cascading Guide relation');
const cascadingVisibleInTopThree = cascadingPreviewIndex.guideToGames[cascadingGuideSlug]
  .filter((game) => cascadingPreviewIndex.gameToGuides[game.slug].slice(0, 3).some(({ guide }) => guide.slug === cascadingGuideSlug));
assert.deepEqual(cascadingVisibleInTopThree.map((game) => game.slug), ['chilli-con-cash', 'paint-jam', 'moon-princess-100', 'reactoonz', 'rise-of-olympus'], 'Cascading legacy top-three snapshot changed unexpectedly');
assert.equal(cascadingPreviewIndex.guideToGames[cascadingGuideSlug].length - cascadingVisibleInTopThree.length, 52, 'The remaining 52 Cascading relations must stay valid outside the legacy three-Guide snapshot');

const multiplierGuideSlug = 'slot-multiplier-explained';
const multiplierGuide = guides.find((guide) => guide.slug === multiplierGuideSlug);
assert.ok(multiplierGuide, 'Multiplier Guide is missing or its slug changed');
assert.equal(multiplierGuide.status, 'published', 'Multiplier Guide must remain published');
assert.deepEqual(multiplierGuide.relatedFeatures, ['multiplier'], 'Multiplier Guide must own only the multiplier Feature');
assert.deepEqual(index.featureToGuides.multiplier.map((guide) => guide.slug), [multiplierGuideSlug], 'multiplier must have exactly one published Guide owner');
assert.equal(index.guideToGames[multiplierGuideSlug].length, 172, 'Multiplier Guide must derive exactly the 172 Games tagged with multiplier');

const gamesWithoutMultiplier = ['all-wilds', 'fat-rabbit', 'fortune-rabbit', 'golden-fish-tank-2-gigablox', 'greedy-for-gold-hold-and-win', 'hand-of-anubis', 'legacy-of-dead', 'lil-devil', 'money-coming', 'rich-wilde-and-the-book-of-dead', 'starburst', 'the-great-pigsby-megaways', 'vikings-go-berzerk', 'white-rabbit', 'wild-swarm'];
for (const slug of gamesWithoutMultiplier) {
  assert.ok(!index.gameToGuides[slug].some(({ guide }) => guide.slug === multiplierGuideSlug), `${slug}: missing multiplier Feature must not create a Multiplier Guide relation`);
}
const multiplierVisibleInTopThree = index.guideToGames[multiplierGuideSlug]
  .filter((game) => index.gameToGuides[game.slug].slice(0, 3).some(({ guide }) => guide.slug === multiplierGuideSlug));
const expectedMultiplierLegacyTopThree = bonusBuyGuidePublished ? 60 : 61;
assert.equal(multiplierVisibleInTopThree.length, expectedMultiplierLegacyTopThree, 'Multiplier Guide legacy top-three expectation must follow the legal Bonus Buy owner state');
assert.equal(index.guideToGames[multiplierGuideSlug].length - multiplierVisibleInTopThree.length, 172 - expectedMultiplierLegacyTopThree, 'All Multiplier relations must stay valid outside the legacy top-three snapshot');

const maxWinGuideSlug = 'slot-max-win-explained';
const maxWinGuide = guides.find((guide) => guide.slug === maxWinGuideSlug);
assert.ok(maxWinGuide, 'Max Win Guide is missing or its slug changed');
assert.deepEqual(maxWinGuide.relatedDataTopics, ['max-win'], 'Max Win Guide must own only the max-win Data Topic');
const expectedMaxWinOwners = maxWinGuide.status === 'published' ? [maxWinGuideSlug] : [];
assert.deepEqual(index.dataTopicToGuides['max-win'].map((guide) => guide.slug), expectedMaxWinOwners, 'max-win ownership must follow the Guide status');
const maxWinPreviewGuides = guides.map((guide) => guide.slug === maxWinGuideSlug ? { ...guide, status: 'published' } : guide);
const maxWinPreviewIndex = buildGuideRelationshipIndex(maxWinPreviewGuides, games, options);
assert.deepEqual(maxWinPreviewIndex.dataTopicToGuides['max-win'].map((guide) => guide.slug), [maxWinGuideSlug]);
assert.equal(maxWinPreviewIndex.guideToGames[maxWinGuideSlug].length, 189, 'Max Win Guide must derive exactly the 189 Games with maxWinMultiplier');
for (const slug of ['big-bass-bonanza', 'dead-or-alive-2', 'fat-rabbit', 'gates-of-olympus', 'golden-fish-tank-2-gigablox', 'jammin-jars', 'jump-high', 'legacy-of-dead', 'moon-princess-100', 'razor-shark', 'reactoonz', 'rise-of-olympus', 'temple-tumble', 'the-great-pigsby-megaways', 'valley-of-the-gods', 'vikings-go-berzerk', 'wild-swarm']) {
  assert.ok(!maxWinPreviewIndex.gameToGuides[slug].some(({ guide }) => guide.slug === maxWinGuideSlug), `${slug}: missing maxWinMultiplier must not create a Max Win Guide relation`);
}

const payoutGuideSlug = 'slot-payout-mechanisms-explained';
const payoutMechanisms = ['paylines', 'megaways', 'cluster-pays', 'pay-anywhere'];
const payoutGuide = guides.find((guide) => guide.slug === payoutGuideSlug);
assert.ok(payoutGuide, 'Payout Guide is missing or its slug changed');
assert.deepEqual(payoutGuide.relatedMechanisms, payoutMechanisms, 'Payout Guide must retain the four overview Mechanism owners');
const expectedPublishedOwners = payoutGuide.status === 'published' ? [payoutGuideSlug] : [];
for (const mechanism of payoutMechanisms) {
  assert.deepEqual(index.mechanismToGuides[mechanism].map((guide) => guide.slug), expectedPublishedOwners, `${mechanism}: public ownership must follow the payout Guide status`);
}
const waysGuideSlug = 'slot-ways-to-win-explained';
const waysGuide = guides.find((guide) => guide.slug === waysGuideSlug);
assert.ok(waysGuide, 'Ways to Win Guide is missing or its slug changed');
assert.equal(waysGuide.status, 'published', 'Ways to Win Guide must be published');
assert.deepEqual(waysGuide.relatedMechanisms, ['ways-to-win'], 'Ways to Win Guide must own only ways-to-win');
assert.deepEqual(index.mechanismToGuides['ways-to-win'].map((guide) => guide.slug), [waysGuideSlug], 'ways-to-win must have exactly one published Guide owner');
const waysGames = games.filter((game) => game.status === 'published' && game.winMechanism === 'ways-to-win');
assert.equal(waysGames.length, 67, 'ways-to-win coverage must include sixty-seven published Games');
assert.deepEqual(
  new Set(index.guideToGames[waysGuideSlug].map((game) => game.slug)),
  new Set(waysGames.map((game) => game.slug)),
  'Ways to Win Guide reverse relationships must derive from the 67 structured Games',
);
for (const game of games.filter((item) => item.status === 'published' && item.winMechanism !== 'ways-to-win')) {
  assert.ok(!index.gameToGuides[game.slug].some(({ guide }) => guide.slug === waysGuideSlug), `${game.slug}: non-Ways Game must not receive the Ways to Win Guide`);
}
assert.ok(!index.mechanismToGuides.paylines.some((guide) => guide.slug === 'slot-terms-glossary'), 'Glossary retained Paylines ownership');
assert.ok(!index.mechanismToGuides['ways-to-win'].some((guide) => guide.slug === payoutGuideSlug), 'Payout overview retained Ways ownership after migration');

for (const [slug, matches] of Object.entries(index.gameToGuides)) {
  const game = games.find((item) => item.slug === slug);
  for (const match of matches) {
    assert.ok(match.reasons.every(({ type, value }) => {
      if (type === 'mechanism') return match.guide.relatedMechanisms?.includes(value) && game.winMechanism === value;
      if (type === 'feature') return match.guide.relatedFeatures?.includes(value) && game.features?.includes(value);
      return match.guide.relatedDataTopics?.includes(value);
    }), `${slug}: Game → Guide must be reconstructed only from Guide frontmatter`);
  }
}

const fixtureGuides = [
  { slug: 'mechanism', title: 'Mechanism', status: 'published', relatedMechanisms: ['paylines'] },
  { slug: 'data', title: 'Data', status: 'published', relatedDataTopics: ['rtp'] },
  { slug: 'feature', title: 'Feature', status: 'published', relatedFeatures: ['scatter'] },
  { slug: 'draft', title: 'Draft', status: 'draft', relatedFeatures: ['wild'] },
];
const fixtureGames = [
  { slug: 'zero', name: 'Zero', status: 'published', features: [] },
  { slug: 'one', name: 'One', status: 'published', winMechanism: 'paylines', features: [] },
  { slug: 'two', name: 'Two', status: 'published', winMechanism: 'paylines', rtp: 96, features: [] },
  { slug: 'three', name: 'Three', status: 'published', winMechanism: 'paylines', rtp: 96, features: ['scatter'] },
  { slug: 'scatter-only', name: 'Scatter', status: 'published', features: ['scatter'] },
];
const fixtureIndex = buildGuideRelationshipIndex(fixtureGuides, fixtureGames, options);
assert.deepEqual(['zero', 'one', 'two', 'three'].map((slug) => fixtureIndex.gameToGuides[slug].length), [0, 1, 2, 3], 'Game detail must support 0/1/2/3 Guide matches');
assert.ok(!fixtureIndex.guides.some((guide) => guide.slug === 'draft'), 'Draft Guide entered the public index');
assert.ok(fixtureIndex.gameToGuides['scatter-only'][0].reasons.every((reason) => reason.type === 'feature'), 'Scatter Feature was treated as a Mechanism');
assert.deepEqual(buildGuideRelationshipIndex(fixtureGuides, fixtureGames, options).guideToGames, fixtureIndex.guideToGames, 'Representative ordering must be stable');

assert.throws(() => validateGuideDeclarations([{ slug: 'bad', relatedFeatures: ['unknown'] }], options), /unknown feature/);
assert.throws(() => validateGuideDeclarations([{ slug: 'bad', relatedDataTopics: ['rtp', 'rtp'] }], options), /duplicates/);
assert.throws(() => validateGuideDeclarations([{ slug: 'bad', relatedMechanisms: [''] }], options), /empty value/);

const mechanismQuery = serializeExplorerState({ ...emptyExplorerState(), mechanism: 'paylines' });
const featureQuery = serializeExplorerState({ ...emptyExplorerState(), features: ['wild'] });
assert.equal(mechanismQuery, 'mechanism=paylines');
assert.equal(featureQuery, 'features=wild');

const gameGuideDistribution = Object.values(index.gameToGuides).reduce((counts, matches) => {
  counts[matches.length] = (counts[matches.length] ?? 0) + 1;
  return counts;
}, {});
const guideDerivedGameCounts = Object.fromEntries(
  Object.entries(index.guideToGames).map(([slug, relatedGames]) => [slug, relatedGames.length]),
);

console.log(`Guide relationship foundation verified: ${index.guides.length} published Guides, ${Object.keys(index.gameToGuides).length} published Games.`);
console.log(`Game → Guide distribution: ${JSON.stringify(gameGuideDistribution)}.`);
console.log(`Guide → derived Games: ${JSON.stringify(guideDerivedGameCounts)}.`);
