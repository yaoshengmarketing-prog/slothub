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
assert.equal(games.length, 122, 'Explorer fixture must cover all 122 published games');

const state = (patch = {}) => ({ ...emptyExplorerState(), ...patch });
assert.equal(filterAndSortGames(games, state({ provider: 'pragmatic-play' })).length, 5);
assert.equal(filterAndSortGames(games, state({ mechanism: 'pay-anywhere' })).length, 4);
assert.equal(filterAndSortGames(games, state({ provider: 'relax-gaming' })).length, 16);
assert.equal(filterAndSortGames(games, state({ mechanism: 'megaways' })).length, 8);
const cascadingGames = filterAndSortGames(games, state({ features: ['cascading'] }));
assert.equal(cascadingGames.length, 28, 'Cascading Explorer must return exactly 28 structurally tagged Games');
assert.ok(!cascadingGames.some((game) => game.slug === 'super-ace'), 'Super Ace must not appear in the Cascading Explorer result');
assert.equal(serializeExplorerState(state({ features: ['cascading'] })), 'features=cascading', 'Cascading Explorer must keep the exact structured URL query');
assert.equal(filterAndSortGames(games, state({ features: ['free-spins', 'wild'] })).length, 49, 'Features must use AND');
assert.equal(filterAndSortGames(games, state({ features: ['free-spins', 'wild', 'scatter'] })).length, 21, 'Three Features must use AND');
assert.equal(filterAndSortGames(games, state({ provider: 'pg-soft', mechanism: 'ways-to-win', features: ['wild', 'cascading'], rtpMin: 96.5 })).length, 2, 'Cross-facet conditions must use AND');

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

const zeroState = state({ mechanism: 'ways-to-win', features: ['hold-and-spin'] });
assert.equal(filterAndSortGames(games, zeroState).length, 0, 'Recovery fixture must start from a truthful zero-result state');
const recoveryOptions = zeroResultRecoveryOptions(games, zeroState);
assert.deepEqual(recoveryOptions.map(({ field, value, count }) => ({ field, value, count })), [
  { field: 'mechanism', value: 'ways-to-win', count: 15 },
  { field: 'feature', value: 'hold-and-spin', count: 26 },
], 'Recovery options must remove exactly one condition and report the resulting real count');
assert.ok(recoveryOptions.every((option) => filterAndSortGames(games, option.state).length === option.count && option.count > 0), 'Every recovery option must lead to its reported non-zero result');
assert.deepEqual(zeroResultRecoveryOptions([], zeroState), [], 'A relaxation that remains at zero must not appear as a recovery option');
assert.equal(zeroResultRecoveryOptions(games, state({ q: '__no-such-game__' }))[0]?.state.q, '', 'Clearing a zero-result text query must be a reversible option');

console.log('Game Explorer v2 state, filtering, sorting, missing-value and search tests passed.');
