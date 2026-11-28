import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { parse } from 'yaml';
import {
  buildGuidedExplorerCounts,
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

const counts = buildGuidedExplorerCounts(games);
assert.equal(Object.values(counts).flatMap(Object.values).length, 25);

assert.ok(games.length > 0, 'Pilot requires published Games');
assert.deepEqual(GUIDED_EXPLORER_MECHANISMS, ['paylines', 'ways-to-win', 'megaways', 'cluster-pays', 'pay-anywhere']);
assert.deepEqual(GUIDED_EXPLORER_FEATURES, ['cascading', 'bonus-buy', 'multiplier', 'free-spins']);
assert.ok(!GUIDED_EXPLORER_MECHANISMS.includes('other'));

for (const mechanism of GUIDED_EXPLORER_MECHANISMS) {
  for (const feature of ['', ...GUIDED_EXPLORER_FEATURES]) {
    const result = buildGuidedExplorerResult(counts, mechanism, feature);
    assert.equal(result.complete, true);
    assert.equal(result.explorerState.features.length, feature ? 1 : 0, 'Pilot may apply at most one Feature');
    assert.equal(result.count, filterAndSortGames(games, result.explorerState).length, `${mechanism}/${feature || 'none'} count drifted from Explorer`);
  }
}
assert.equal(buildGuidedExplorerResult(counts).complete, false);
assert.equal(buildGuidedExplorerResult(counts, 'other').complete, false);
assert.deepEqual(buildGuidedExplorerResult(counts, 'paylines', 'other'), buildGuidedExplorerResult(counts, 'paylines'));

const positive = buildGuidedExplorerResult(counts, 'paylines', 'bonus-buy');
assert.ok(positive.count > 0, 'Pilot requires a truthful positive-result fixture');
const empty = buildGuidedExplorerResult(buildGuidedExplorerCounts([]), 'ways-to-win', 'bonus-buy');
assert.equal(empty.count, 0, 'Pilot requires a truthful zero-result fixture');

const [toolsHtml, gamesHtml] = await Promise.all([
  readFile(new URL('../dist/tools/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/games/index.html', import.meta.url), 'utf8'),
]);
assert.doesNotMatch(toolsHtml, /data-guided-explorer-pilot/, 'Tools must remain a simple index after the guided flow moves to Games');
for (const mechanism of GUIDED_EXPLORER_MECHANISMS) {
  assert.ok(gamesHtml.includes(`/games/?mechanism=${mechanism}`), `${mechanism} no-JS URL missing from Games`);
}
assert.doesNotMatch(gamesHtml, /guided-explorer[^\n]*\?q=/, 'Pilot must not use text search as a structured condition');
assert.match(gamesHtml, /data-guided-explorer-pilot/, 'Games owner must include the guided entry mode');
assert.match(gamesHtml, /id="full-explorer"/, 'Games owner must retain the full Explorer');
assert.match(gamesHtml, /id="game-results"/, 'Games owner must expose one shared result landing target');
const islands = gamesHtml.match(/<astro-island\b[^>]+>/g) ?? [];
const guidedIsland = islands.find((island) => /component-url="[^"]*\/GuidedExplorerPilot\./.test(island));
const explorerIsland = islands.find((island) => /component-url="[^"]*\/GameExplorer\./.test(island));
assert.ok(guidedIsland && explorerIsland, 'Games must hydrate both entry modes');
assert.match(guidedIsland, /props="[^"]*&quot;counts&quot;:/, 'Guided entry must receive its lookup data');
assert.doesNotMatch(guidedIsland, /props="[^"]*&quot;games&quot;:/, 'Guided entry must not serialize the full catalog again');
assert.match(explorerIsland, /props="[^"]*&quot;games&quot;:/, 'Full Explorer must still receive the game catalog');

const source = await readFile(new URL('../src/components/GuidedExplorerPilot.tsx', import.meta.url), 'utf8');
assert.match(source, /result\.count === 0/);
assert.match(source, /canOpen \? <a/);
assert.match(source, />清除條件<\/button>/, 'A zero-result selection must expose a reversible clear action');
assert.match(source, /resultAnchor/);
assert.match(source, /`\$\{explorerUrl\}#\$\{resultAnchor\}`/, 'Guided handoff must keep the canonical Explorer query and add only a result anchor');
assert.doesNotMatch(source, /推薦|適合你|最好|容易贏/);

console.log(`PASS: guided Explorer Pilot reuses ${games.length} published Games, exact one-Feature conditions, true counts and a no-CTA zero state.`);
