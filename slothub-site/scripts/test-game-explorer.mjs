import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { basename } from 'node:path';
import { parse } from 'yaml';
import {
  emptyExplorerState, filterAndSortGames, parseExplorerState, serializeExplorerState, zeroResultRecoveryOptions,
} from '../src/lib/game-explorer-state.mjs';

const gamesDirectory = new URL('../src/content/games/', import.meta.url);
const records = readdirSync(gamesDirectory)
  .filter((file) => file.endsWith('.md'))
  .map((file) => {
    const raw = readFileSync(new URL(file, gamesDirectory), 'utf8');
    const end = raw.indexOf('---', 3);
    const data = parse(raw.slice(3, end));
    return {
      slug: basename(file, '.md'), name: data.displayNameZhHant ?? data.originalName ?? data.name,
      originalName: data.originalName ?? data.name, displayNameZhHant: data.displayNameZhHant,
      aliases: data.aliases ?? [], seriesNameZhHant: data.seriesNameZhHant, provider: data.provider,
      providerName: data.provider, primaryType: data.primaryType, subtypes: data.subtypes ?? [],
      summary: data.summary, rtp: data.rtp, volatilityNormalized: data.volatilityNormalized ?? data.volatility,
      maxWinMultiplier: data.maxWinMultiplier, winMechanism: data.winMechanism,
      features: data.features ?? [], searchTerms: [data.summary], status: data.status,
    };
  });
const games = records.filter((game) => game.status === 'published');
assert.ok(games.length > 0, 'Explorer requires published games');

const state = (patch = {}) => ({ ...emptyExplorerState(), ...patch });
const expectedSlugs = (predicate) => games.filter(predicate).map((game) => game.slug).sort();
const assertExactFilter = (patch, predicate, message) => {
  const actual = filterAndSortGames(games, state(patch));
  assert.deepEqual(actual.map((game) => game.slug).sort(), expectedSlugs(predicate), message);
};
assertExactFilter({ provider: 'pragmatic-play' }, (game) => game.provider === 'pragmatic-play', 'Provider filtering must return every and only matching Game');
assertExactFilter({ mechanism: 'pay-anywhere' }, (game) => game.winMechanism === 'pay-anywhere', 'Mechanism filtering must return every and only matching Game');
assertExactFilter({ provider: 'relax-gaming' }, (game) => game.provider === 'relax-gaming', 'Provider filtering must remain data-derived');
assertExactFilter({ mechanism: 'megaways' }, (game) => game.winMechanism === 'megaways', 'Megaways filtering must remain data-derived');
const cascadingGames = filterAndSortGames(games, state({ features: ['cascading'] }));
assert.deepEqual(cascadingGames.map((game) => game.slug).sort(), expectedSlugs((game) => game.features.includes('cascading')), 'Cascading Explorer must return every and only structurally tagged Game');
assert.ok(!cascadingGames.some((game) => game.slug === 'super-ace'), 'Super Ace must not appear in the Cascading Explorer result');
assert.equal(serializeExplorerState(state({ features: ['cascading'] })), 'features=cascading', 'Cascading Explorer must keep the exact structured URL query');
assertExactFilter({ features: ['free-spins', 'wild'] }, (game) => ['free-spins', 'wild'].every((feature) => game.features.includes(feature)), 'Features must use AND');
assertExactFilter({ features: ['free-spins', 'wild', 'scatter'] }, (game) => ['free-spins', 'wild', 'scatter'].every((feature) => game.features.includes(feature)), 'Three Features must use AND');
assertExactFilter({ provider: 'pg-soft', mechanism: 'ways-to-win', features: ['wild', 'cascading'], rtpMin: 96.5 }, (game) => game.provider === 'pg-soft' && game.winMechanism === 'ways-to-win' && ['wild', 'cascading'].every((feature) => game.features.includes(feature)) && game.rtp >= 96.5, 'Cross-facet conditions must use AND');

for (const [field, patch, missingSlug] of [
  ['rtp', { rtpMin: 96 }, 'jump-high'],
  ['volatilityNormalized', { volatility: 'high' }, 'big-bass-bonanza'],
  ['maxWinMultiplier', { maxWinMin: 5000 }, 'reactoonz'],
]) {
  const results = filterAndSortGames(games, state(patch));
  assert.ok(results.every((game) => game[field] !== undefined), `${field} filter cannot treat missing values as zero`);
  assert.ok(!results.some((game) => game.slug === missingSlug), `${missingSlug} must be excluded when ${field} is filtered`);
}

for (const sort of ['rtp-desc', 'rtp-asc', 'max-win-desc', 'max-win-asc']) {
  const sorted = filterAndSortGames(games, state({ sort }));
  const field = sort.startsWith('rtp') ? 'rtp' : 'maxWinMultiplier';
  const firstMissing = sorted.findIndex((game) => game[field] === undefined);
  assert.ok(firstMissing > 0, `${sort} must contain known values first`);
  assert.ok(sorted.slice(firstMissing).every((game) => game[field] === undefined), `${sort} must keep all missing values last`);
}
const names = filterAndSortGames(games, state()).map((game) => game.name);
assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b, 'zh-Hant-TW')));

const discoveryFixtures = [
  { ...games[0], slug: 'pay-anywhere-free-spins', name: '示例一', originalName: 'Example One', searchTerms: ['任意位置賠付', 'Pay Anywhere', '免費旋轉', 'Free Spins'] },
  { ...games[1], slug: 'cluster-cascading', name: '示例二', originalName: 'Example Two', searchTerms: ['群集賠付', 'Cluster Pays', '連鎖消除', 'Cascading'] },
];
for (const query of ['任意位置賠付', 'Pay Anywhere', '免費旋轉', 'Free Spins']) {
  assert.equal(filterAndSortGames(discoveryFixtures, state({ q: query, sort: 'relevance' }))[0]?.slug, 'pay-anywhere-free-spins', query);
}
for (const query of ['群集賠付', 'Cluster Pays', '連鎖消除', 'Cascading']) {
  assert.equal(filterAndSortGames(discoveryFixtures, state({ q: query, sort: 'relevance' }))[0]?.slug, 'cluster-cascading', query);
}

const parsed = parseExplorerState('?q=%E8%B3%BD%E7%89%B9&provider=bad&provider=atg-games&type=slots&subtype=cluster-pays&mechanism=paylines&features=wild,wild,free-spins,invalid&rtp-min=oops&rtp-min=96.2&volatility=high&max-win-min=-1&max-win-min=10000&sort=max-win-desc&unknown=x', games);
assert.equal(parsed.q, '賽特');
assert.equal(parsed.provider, 'atg-games');
assert.deepEqual(parsed.features, ['wild', 'free-spins']);
assert.equal(parsed.rtpMin, 96.2);
assert.equal(parsed.maxWinMin, 10000);
assert.equal(parsed.sort, 'max-win-desc');
const query = serializeExplorerState(parsed);
assert.equal(query, 'q=%E8%B3%BD%E7%89%B9&provider=atg-games&type=slots&subtype=cluster-pays&mechanism=paylines&features=free-spins%2Cwild&rtp-min=96.2&volatility=high&max-win-min=10000&sort=max-win-desc');
assert.deepEqual(parseExplorerState(query, games), parseExplorerState(serializeExplorerState(parseExplorerState(query, games)), games), 'URL state must be idempotent');
assert.equal(serializeExplorerState(emptyExplorerState()), '', 'Clear state must produce a clean /games/ URL');
assert.equal(parseExplorerState('?sort=relevance&provider=unknown&features=unknown&rtp-min=99', games).sort, 'name-asc', 'Invalid query values must be ignored');

const zeroState = state({ mechanism: 'megaways', features: ['symbol-splitting'] });
assert.equal(filterAndSortGames(games, zeroState).length, 0, 'Recovery fixture must start from a truthful zero-result state');
const recoveryOptions = zeroResultRecoveryOptions(games, zeroState);
assert.deepEqual(recoveryOptions.map(({ field, value, count }) => ({ field, value, count })), [
  { field: 'mechanism', value: 'megaways', count: games.filter((game) => game.features.includes('symbol-splitting')).length },
  { field: 'feature', value: 'symbol-splitting', count: games.filter((game) => game.winMechanism === 'megaways').length },
], 'Recovery options must remove exactly one condition and report the resulting real count');
assert.ok(recoveryOptions.every((option) => filterAndSortGames(games, option.state).length === option.count && option.count > 0), 'Every recovery option must lead to its reported non-zero result');
assert.deepEqual(zeroResultRecoveryOptions([], zeroState), [], 'A relaxation that remains at zero must not appear as a recovery option');
assert.equal(zeroResultRecoveryOptions(games, state({ q: '__no-such-game__' }))[0]?.state.q, '', 'Clearing a zero-result text query must be a reversible option');

console.log('Game Explorer v2 state, filtering, sorting, missing-value and search tests passed.');
