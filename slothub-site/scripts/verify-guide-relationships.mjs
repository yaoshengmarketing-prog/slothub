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
  'slot-terms-glossary': { relatedMechanisms: ['paylines', 'ways-to-win'], relatedFeatures: ['cascading', 'bonus-buy'] },
};
for (const [slug, relations] of Object.entries(expected)) {
  const guide = guides.find((item) => item.slug === slug);
  assert.ok(guide, `Required v1 Guide is missing or its slug changed: ${slug}`);
  assert.equal(guide.status, 'published', `${slug} must remain published`);
  for (const [field, values] of Object.entries(relations)) assert.deepEqual(guide[field], values, `${slug}: ${field}`);
}

assert.deepEqual(index.mechanismToGuides.paylines.map((guide) => guide.slug), ['slot-terms-glossary']);
assert.deepEqual(index.featureToGuides.wild.map((guide) => guide.slug), ['slot-symbols-and-features']);
assert.deepEqual(index.dataTopicToGuides.rtp.map((guide) => guide.slug), ['rtp-explained']);
for (const deferred of ['pay-anywhere', 'cluster-pays', 'megaways']) assert.deepEqual(index.mechanismToGuides[deferred], [], `${deferred} must remain valid without a Guide`);
for (const deferred of ['multiplier']) assert.deepEqual(index.featureToGuides[deferred], [], `${deferred} must remain valid without a Guide`);
assert.deepEqual(index.dataTopicToGuides['max-win'], [], 'max-win must remain valid without a Guide');

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
