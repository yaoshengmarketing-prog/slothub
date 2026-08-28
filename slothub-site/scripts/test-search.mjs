import assert from 'node:assert/strict';
import { normalizeSearch, rankSearch } from '../src/lib/search.js';

const games = [
  { slug: 'storm-of-seth', title: '戰神賽特', secondaryTitle: 'Storm of Seth', aliases: ['Storm Seth', '戰神 賽特', '賽特'], description: 'ATG Games 遊戲', kind: '遊戲', url: '/games/storm-of-seth/', providerName: 'ATG Games', seriesName: '戰神賽特系列', installment: 1 },
  { slug: 'storm-of-seth-2-awakening', title: '戰神賽特2－覺醒之力', secondaryTitle: 'Storm of Seth 2: Awakening', aliases: ['戰神賽特2', '戰神賽特 2', '覺醒之力', 'Storm Seth 2', '戰神賽特二代'], description: 'ATG Games 遊戲', kind: '遊戲', url: '/games/storm-of-seth-2-awakening/', providerName: 'ATG Games', seriesName: '戰神賽特系列', installment: 2 },
];

const cases = [
  ['戰神賽特', ['storm-of-seth', 'storm-of-seth-2-awakening']],
  ['戰神賽特2', ['storm-of-seth-2-awakening']],
  ['覺醒之力', ['storm-of-seth-2-awakening']],
  ['Storm of Seth', ['storm-of-seth', 'storm-of-seth-2-awakening']],
  ['Storm Seth 2', ['storm-of-seth-2-awakening']],
  ['戰神 賽特', ['storm-of-seth', 'storm-of-seth-2-awakening']],
  ['賽特', ['storm-of-seth', 'storm-of-seth-2-awakening']],
];

assert.equal(normalizeSearch('Ｓｔｏｒｍ－ｏｆ　Ｓｅｔｈ'), 'stormseth');
for (const [query, expectedOrder] of cases) {
  const actual = rankSearch(games, query).map((game) => game.slug);
  assert.deepEqual(actual.slice(0, expectedOrder.length), expectedOrder, `${query}: ${actual.join(', ')}`);
  console.log(`✓ ${query} → ${actual.join(' > ')}`);
}
