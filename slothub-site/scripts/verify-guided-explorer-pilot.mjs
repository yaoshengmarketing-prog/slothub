import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { parse } from 'yaml';
import {
  buildGuidedExplorerResult,
  GUIDED_EXPLORER_FEATURES,
  GUIDED_EXPLORER_MECHANISMS,
} from '../src/lib/guided-explorer-pilot.mjs';
import { filterAndSortGames } from '../src/lib/game-explorer-state.mjs';

const gameDirectory = new URL('../src/content/games/', import.meta.url);
const files = (await readdir(gameDirectory)).filter((file) => file.endsWith('.md'));
const records = await Promise.all(files.map(async (file) => {
  const source = await readFile(new URL(file, gameDirectory), 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  assert.ok(frontmatter, `${file} frontmatter missing`);
  const data = parse(frontmatter);
  return {
    slug: file.replace(/\.md$/, ''),
    name: data.displayNameZhHant ?? data.originalName ?? data.name,
    originalName: data.originalName ?? data.name,
    aliases: data.aliases ?? [],
    provider: data.provider,
    primaryType: data.primaryType,
    subtypes: data.subtypes ?? [],
    summary: data.summary,
    rtp: data.rtp,
    volatilityNormalized: data.volatilityNormalized ?? data.volatility,
    maxWinMultiplier: data.maxWinMultiplier,
    winMechanism: data.winMechanism,
    features: data.features ?? [],
    searchTerms: [data.summary],
    status: data.status,
  };
}));
const games = records.filter((game) => game.status === 'published');

assert.equal(games.length, 322, 'Pilot must use all 322 published Games');
assert.deepEqual(GUIDED_EXPLORER_MECHANISMS, ['paylines', 'ways-to-win', 'megaways', 'cluster-pays', 'pay-anywhere']);
assert.deepEqual(GUIDED_EXPLORER_FEATURES, ['cascading', 'bonus-buy', 'multiplier', 'free-spins']);
assert.ok(!GUIDED_EXPLORER_MECHANISMS.includes('other'));

for (const mechanism of GUIDED_EXPLORER_MECHANISMS) {
  for (const feature of ['', ...GUIDED_EXPLORER_FEATURES]) {
    const result = buildGuidedExplorerResult(games, mechanism, feature);
    assert.equal(result.complete, true);
    assert.equal(result.explorerState.features.length, feature ? 1 : 0, 'Pilot may apply at most one Feature');
    assert.equal(result.count, filterAndSortGames(games, result.explorerState).length, `${mechanism}/${feature || 'none'} count drifted from Explorer`);
  }
}
assert.equal(buildGuidedExplorerResult(games).complete, false);
assert.equal(buildGuidedExplorerResult(games, 'other').complete, false);

const positive = buildGuidedExplorerResult(games, 'paylines', 'bonus-buy');
assert.ok(positive.count > 0, 'Pilot requires a truthful positive-result fixture');
const empty = buildGuidedExplorerResult([], 'ways-to-win', 'bonus-buy');
assert.equal(empty.count, 0, 'Pilot requires a truthful zero-result fixture');

const [toolsHtml, positiveGamesHtml, emptyGamesHtml] = await Promise.all([
  readFile(new URL('../dist/tools/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/games/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/games/index.html', import.meta.url), 'utf8'),
]);
assert.doesNotMatch(toolsHtml, /data-guided-explorer-pilot/, 'Tools must remain a simple index after the guided flow moves to Games');
for (const mechanism of GUIDED_EXPLORER_MECHANISMS) {
  assert.ok(positiveGamesHtml.includes(`/games/?mechanism=${mechanism}`), `${mechanism} no-JS URL missing from Games`);
}
assert.doesNotMatch(positiveGamesHtml, /guided-explorer[^\n]*\?q=/, 'Pilot must not use text search as a structured condition');
assert.match(positiveGamesHtml, /data-guided-explorer-pilot/, 'Games owner must include the guided entry mode');
assert.match(positiveGamesHtml, /id="full-explorer"/, 'Games owner must retain the full Explorer');
assert.match(positiveGamesHtml, /id="game-results"/, 'Games owner must expose one shared result landing target');
assert.match(emptyGamesHtml, /data-react-props|遊戲庫/);

const source = await readFile(new URL('../src/components/GuidedExplorerPilot.tsx', import.meta.url), 'utf8');
assert.match(source, /result\.count === 0/);
assert.match(source, /canOpen \? <a/);
assert.match(source, />清除條件<\/button>/, 'A zero-result selection must expose a reversible clear action');
assert.match(source, /resultAnchor/);
assert.match(source, /`\$\{explorerUrl\}#\$\{resultAnchor\}`/, 'Guided handoff must keep the canonical Explorer query and add only a result anchor');
assert.doesNotMatch(source, /推薦|適合你|最好|容易贏/);

console.log('PASS: guided Explorer Pilot reuses 322 published Games, exact one-Feature conditions, true counts and a no-CTA zero state.');
