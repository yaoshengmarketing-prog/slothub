import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  compareStateUrl, normalizeCompareSlugs, readCompareQuery, readSearchQuery,
  readStoredCompare, searchStateUrl, writeCanonicalHistory,
} from '../src/lib/core-flow-state.mjs';

assert.equal(readSearchQuery('?q=%E6%AD%BB%E8%80%85%E4%B9%8B%E6%9B%B8'), '死者之書');
assert.equal(readSearchQuery('?q=&q=Starburst&unknown=x'), 'Starburst');
assert.equal(searchStateUrl('  Mahjong Ways  '), '/search/?q=Mahjong%20Ways');
assert.equal(searchStateUrl('  '), '/search/');

const calls = [];
const browser = {
  location: { pathname: '/search/', search: '?q=RTP' },
  history: {
    state: { test: true },
    pushState(state, _title, next) { calls.push(['push', state, next]); const url = new URL(next, 'https://example.test'); browser.location.pathname = url.pathname; browser.location.search = url.search; },
    replaceState(state, _title, next) { calls.push(['replace', state, next]); const url = new URL(next, 'https://example.test'); browser.location.pathname = url.pathname; browser.location.search = url.search; },
  },
};
assert.equal(writeCanonicalHistory(browser, '/search/?q=RTP', 'push'), false, 'Identical canonical URL must be a no-op');
assert.equal(calls.length, 0);
assert.equal(writeCanonicalHistory(browser, '/search/?q=Wild', 'replace'), true);
assert.deepEqual(calls[0], ['replace', { test: true }, '/search/?q=Wild']);
assert.equal(writeCanonicalHistory(browser, '/search/?q=Scatter', 'push'), true);
assert.deepEqual(calls[1], ['push', { test: true }, '/search/?q=Scatter']);

const valid = ['mahjong-ways', 'starburst', 'bonanza', 'fortune-tiger'];
assert.deepEqual(normalizeCompareSlugs(['starburst', 'bad', 'starburst', 'bonanza', 'fortune-tiger', 'mahjong-ways'], valid), ['starburst', 'bonanza', 'fortune-tiger']);
assert.deepEqual(readStoredCompare('{bad json', valid), []);
assert.deepEqual(readStoredCompare('["bad","mahjong-ways","mahjong-ways"]', valid), ['mahjong-ways']);
assert.deepEqual(readCompareQuery('?games=starburst,bad,starburst,bonanza,fortune-tiger,mahjong-ways', valid), { hasGames: true, slugs: ['starburst', 'bonanza', 'fortune-tiger'] });
assert.deepEqual(readCompareQuery('', valid), { hasGames: false, slugs: [] });
assert.deepEqual(readCompareQuery('?games=', valid), { hasGames: true, slugs: [] });
assert.equal(compareStateUrl(['starburst', 'bonanza']), '/compare/?games=starburst,bonanza');
assert.equal(compareStateUrl([]), '/compare/');

const source = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const search = source('../src/components/SearchHub.tsx');
const explorer = source('../src/components/GameExplorer.tsx');
const compare = source('../src/components/CompareWorkspace.tsx');
const header = source('../src/components/SiteHeader.astro');
const home = source('../src/pages/index.astro');
const gamesIndex = source('../src/pages/games/index.astro');
const slots = source('../src/pages/slots/index.astro');
const providerIndex = source('../src/pages/providers/index.astro');
const providerDetail = source('../src/pages/providers/[slug].astro');
const gameDetail = source('../src/pages/games/[slug].astro');
const fishing = source('../src/pages/fishing-games/index.astro');
const styles = source('../src/styles/global.css');

assert.match(search, /<form className="search-field" action="\/search\/" method="get"/);
assert.match(search, /addEventListener\('popstate', restore\)/);
assert.match(search, /writeCanonicalHistory\(window, searchStateUrl\(value\), 'replace'\)/);
assert.match(search, /onClick=\{flushPendingQuery\}/, 'Search results must flush pending text state before navigation');
assert.match(search, /onKeyDown=\{submitFromInput\}/, 'Search text input must forward an explicit Enter to the shared form submission');
assert.match(search, /nativeEvent\.isComposing/, 'Search Enter must ignore active IME composition');
assert.match(search, /nativeEvent\.keyCode === 229/, 'Search Enter must ignore IME process-key events');
assert.match(search, /currentTarget\.form\?\.requestSubmit\(\)/, 'Search Enter and the submit button must share one form owner');
assert.match(explorer, /writeCanonicalHistory\(window, nextUrl, 'push'\)/);
assert.match(explorer, /'replace-debounced'/);
assert.match(explorer, /addEventListener\('popstate', readUrl\)/);
assert.match(explorer, /<form className="filter-search-v2" onSubmit=\{submitQuery\}>/, 'Explorer text input must support explicit submission');
const explorerKeyHandler = explorer.match(/onKeyDown=\{\(event\) => \{[^}]+\}\}/)?.[0];
if (explorerKeyHandler) {
  assert.match(explorerKeyHandler, /nativeEvent\.isComposing/, 'Optional Explorer key handler must ignore active IME composition');
  assert.match(explorerKeyHandler, /keyCode !== 229/, 'Optional Explorer key handler must ignore IME process-key Enter');
}
assert.match(explorer, /writeCanonicalHistory\(window, gamesIndexUrl\(state\), 'push'\)/, 'Explorer explicit submission must push a changed canonical URL');
assert.match(explorer, /onClick=\{flushPendingQuery\}/, 'Explorer detail links must flush pending text state before navigation');
assert.match(explorer, /resultAnchor/, 'Explorer must accept a result landing target without creating another state owner');
assert.match(explorer, /location\.hash !== `#\$\{resultAnchor\}`/, 'Explorer must only focus the requested result landing target');
assert.match(explorer, /explorer-active-filters/, 'Explorer must expose a readable summary of active conditions');
assert.match(explorer, /handoffDefaults\.primaryType/);
assert.match(gamesIndex, /<GuidedExplorerPilot games=\{games\} resultAnchor="game-results" client:load \/>/, 'Games must hand the guided mode to the shared result target');
assert.match(gamesIndex, /<GameExplorer games=\{games\} relationshipLinks=\{relationshipLinks\} resultAnchor="game-results" urlState client:load\/>/, 'Games must keep the existing full Explorer as the only state owner');
assert.match(slots, /handoffDefaults=\{\{ primaryType: 'slots' \}\}/);
assert.match(slots, /item\.exploreHref && <a href=\{item\.exploreHref\}>探索遊戲/);
assert.match(compare, /query\.hasGames \? query\.slugs : \[\]/, 'Popstate bare Compare must restore an explicit empty state');
assert.match(compare, /writeCanonicalHistory\(window, compareStateUrl\(clean\), mode\)/);
assert.ok(
  compare.indexOf("writeCanonicalHistory(window, compareStateUrl(clean), mode)") < compare.indexOf("dispatchEvent(new Event('slothub:compare'))"),
  'Compare must finish its canonical URL update before notifying the Header',
);
assert.match(header, /readStoredCompare/);
assert.match(header, /link\.href = compareStateUrl\(selected\)/);
assert.match(header, /\['找遊戲', gamesIndexUrl\(\), false\]/, 'The shared primary navigation must expose the Games owner');
assert.match(header, /\['玩法與資料', slotsUrl\(\), false\]/);
assert.match(header, /\['遊戲廠商', providersIndexUrl\(\), false\]/);
assert.match(header, /\['教學', guideIndexUrl\(\), false\]/);
assert.match(header, /\['工具', toolsIndexUrl\(\), true\]/, 'Tools must remain a mobile secondary destination');
assert.match(header, /class="header-search" href=\{searchUrl\(\)\}>搜尋<\/a>/, 'Search must remain directly reachable outside the content navigation');
assert.match(styles, /\.site-header nav a\.mobile-nav-only\{display:none\}/, 'Desktop must keep Tools out of the primary navigation');
assert.match(styles, /@media\(max-width:960px\)[\s\S]*?\.site-header nav a\.mobile-nav-only\{display:flex\}/, 'The mobile menu must expose Tools');
assert.match(header, /aria-controls="site-primary-nav"/, 'The mobile navigation control must own the existing primary navigation');
assert.match(header, /aria-expanded="false"/, 'The mobile navigation must expose its collapsed state');
assert.match(header, /event\.key !== 'Escape'/, 'The mobile navigation must support keyboard dismissal');
assert.match(gameDetail, /href="\/games\/">前往遊戲庫 →<\/a>/, 'The fixed game-library link must not imply filter-state restoration');
assert.equal((home.match(/data-home-intent-route=/g) ?? []).length, 1, 'Astro source must project the four homepage routes from one definition');
assert.match(home, /data-home-beginner-guide/, 'Homepage must link first-time visitors to the existing Beginners Guide owner');
assert.doesNotMatch(home, /<GameExplorer\b/, 'Homepage must not duplicate the full Explorer owner');
assert.match(compare, /<table className="compare-table"/, 'Compare v2 must use a semantic table');
assert.match(compare, /scope="col"/, 'Compare game identities must be column headers');
assert.match(compare, /scope="row"/, 'Compare fields must be row headers');
assert.match(compare, /scope="rowgroup"/, 'Compare sections must have semantic row-group headers');
assert.doesNotMatch(compare, /compare-section-row[^\n]*scope="colgroup"/, 'Compare section headers must not claim column-group scope');
assert.match(compare, /CORE_FEATURES\.filter/, 'Compare must preserve the existing core Feature projection');
assert.doesNotMatch(compare, /Game ID/, 'Game ID must remain outside the primary comparison matrix');
assert.match(styles, /\.topic-grid a,\.knowledge-grid>a,\.tool-grid>a\{/, 'Knowledge card dimensions must only apply to direct child cards');

for (const [name, text] of [['home', home], ['provider index', providerIndex], ['provider detail', providerDetail], ['fishing', fishing]]) {
  assert.doesNotMatch(text, /首批|第一批|第一版公開四家|Seed Data/, `${name} still contains stale batch copy`);
}

console.log('Core Search, Explorer, Compare, Header, CTA and stale-copy contracts passed.');
