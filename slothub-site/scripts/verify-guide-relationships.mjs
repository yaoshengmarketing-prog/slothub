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

validateGuideDeclarations(guides, options);
const index = buildGuideRelationshipIndex(guides, games, options);
assert.equal(games.filter((game) => game.status === 'published').length, 30, 'Relationship fixture must cover 30 published games');

const expected = {
  'rtp-explained': { relatedDataTopics: ['rtp', 'rtp-variants'] },
  'volatility-explained': { relatedDataTopics: ['volatility'] },
  'slot-symbols-and-features': { relatedFeatures: ['free-spins', 'wild', 'scatter', 'jackpot'] },
  'slot-terms-glossary': { relatedFeatures: ['cascading', 'bonus-buy'] },
};
for (const [slug, relations] of Object.entries(expected)) {
  const guide = guides.find((item) => item.slug === slug);
  assert.ok(guide, `Required v1 Guide is missing or its slug changed: ${slug}`);
  assert.equal(guide.status, 'published', `${slug} must remain published`);
  for (const [field, values] of Object.entries(relations)) assert.deepEqual(guide[field], values, `${slug}: ${field}`);
}

assert.deepEqual(index.featureToGuides.wild.map((guide) => guide.slug), ['slot-symbols-and-features']);
assert.deepEqual(index.dataTopicToGuides.rtp.map((guide) => guide.slug), ['rtp-explained']);

const multiplierGuideSlug = 'slot-multiplier-explained';
const multiplierGuide = guides.find((guide) => guide.slug === multiplierGuideSlug);
assert.ok(multiplierGuide, 'Multiplier Guide is missing or its slug changed');
assert.equal(multiplierGuide.status, 'published', 'Multiplier Guide must remain published');
assert.deepEqual(multiplierGuide.relatedFeatures, ['multiplier'], 'Multiplier Guide must own only the multiplier Feature');
assert.deepEqual(index.featureToGuides.multiplier.map((guide) => guide.slug), [multiplierGuideSlug], 'multiplier must have exactly one published Guide owner');
assert.equal(index.guideToGames[multiplierGuideSlug].length, 25, 'Multiplier Guide must derive exactly the 25 Games tagged with multiplier');

const gamesWithoutMultiplier = ['greedy-for-gold-hold-and-win', 'hand-of-anubis', 'legacy-of-dead', 'rich-wilde-and-the-book-of-dead', 'starburst'];
for (const slug of gamesWithoutMultiplier) {
  assert.ok(!index.gameToGuides[slug].some(({ guide }) => guide.slug === multiplierGuideSlug), `${slug}: missing multiplier Feature must not create a Multiplier Guide relation`);
}
const multiplierVisibleInTopThree = index.guideToGames[multiplierGuideSlug]
  .filter((game) => index.gameToGuides[game.slug].slice(0, 3).some(({ guide }) => guide.slug === multiplierGuideSlug));
assert.equal(multiplierVisibleInTopThree.length, 8, 'Multiplier Guide must appear in the first three Guide matches for exactly 8 Games');
assert.equal(index.guideToGames[multiplierGuideSlug].length - multiplierVisibleInTopThree.length, 17, 'The remaining 17 Multiplier relations must stay valid outside the three-Guide display limit');

const maxWinGuideSlug = 'slot-max-win-explained';
const maxWinGuide = guides.find((guide) => guide.slug === maxWinGuideSlug);
assert.ok(maxWinGuide, 'Max Win Guide is missing or its slug changed');
assert.deepEqual(maxWinGuide.relatedDataTopics, ['max-win'], 'Max Win Guide must own only the max-win Data Topic');
const expectedMaxWinOwners = maxWinGuide.status === 'published' ? [maxWinGuideSlug] : [];
assert.deepEqual(index.dataTopicToGuides['max-win'].map((guide) => guide.slug), expectedMaxWinOwners, 'max-win ownership must follow the Guide status');
const maxWinPreviewGuides = guides.map((guide) => guide.slug === maxWinGuideSlug ? { ...guide, status: 'published' } : guide);
const maxWinPreviewIndex = buildGuideRelationshipIndex(maxWinPreviewGuides, games, options);
assert.deepEqual(maxWinPreviewIndex.dataTopicToGuides['max-win'].map((guide) => guide.slug), [maxWinGuideSlug]);
assert.equal(maxWinPreviewIndex.guideToGames[maxWinGuideSlug].length, 25, 'Max Win Guide must derive exactly the 25 Games with maxWinMultiplier');
for (const slug of ['big-bass-bonanza', 'gates-of-olympus', 'jump-high', 'legacy-of-dead', 'reactoonz']) {
  assert.ok(!maxWinPreviewIndex.gameToGuides[slug].some(({ guide }) => guide.slug === maxWinGuideSlug), `${slug}: missing maxWinMultiplier must not create a Max Win Guide relation`);
}

const payoutGuideSlug = 'slot-payout-mechanisms-explained';
const payoutMechanisms = ['paylines', 'ways-to-win', 'megaways', 'cluster-pays', 'pay-anywhere'];
const payoutGuide = guides.find((guide) => guide.slug === payoutGuideSlug);
assert.ok(payoutGuide, 'Payout Guide is missing or its slug changed');
const expectedPublishedOwners = payoutGuide.status === 'published' ? [payoutGuideSlug] : [];
for (const mechanism of payoutMechanisms) {
  assert.deepEqual(index.mechanismToGuides[mechanism].map((guide) => guide.slug), expectedPublishedOwners, `${mechanism}: public ownership must follow the payout Guide status`);
}
const previewGuides = guides.map((guide) => guide.slug === payoutGuideSlug ? { ...guide, status: 'published' } : guide);
const previewIndex = buildGuideRelationshipIndex(previewGuides, games, options);
for (const mechanism of payoutMechanisms) {
  assert.deepEqual(previewIndex.mechanismToGuides[mechanism].map((guide) => guide.slug), [payoutGuideSlug], `${mechanism}: ownership must transfer only to the payout Guide`);
}
assert.deepEqual(previewIndex.featureToGuides.cascading.map((guide) => guide.slug), ['slot-terms-glossary']);
assert.deepEqual(previewIndex.featureToGuides['bonus-buy'].map((guide) => guide.slug), ['slot-terms-glossary']);
assert.ok(!previewIndex.mechanismToGuides.paylines.some((guide) => guide.slug === 'slot-terms-glossary'), 'Glossary retained Paylines ownership');
assert.ok(!previewIndex.mechanismToGuides['ways-to-win'].some((guide) => guide.slug === 'slot-terms-glossary'), 'Glossary retained Ways ownership');

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
