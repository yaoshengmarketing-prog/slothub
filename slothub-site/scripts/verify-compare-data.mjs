import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import {
  COMPARE_MISSING, COMPARE_NORMALIZED_MISSING, COMPARE_ORIGINAL_MISSING,
  bonusBuyLabel, compareGridLabel, compareWinCountLabel,
} from '../src/lib/compare-presentation.mjs';

const gamesDirectory = fileURLToPath(new URL('../src/content/games/', import.meta.url));
const files = (await readdir(gamesDirectory)).filter((file) => file.endsWith('.md')).sort();
const records = await Promise.all(files.map(async (file) => {
  const raw = await readFile(join(gamesDirectory, file), 'utf8');
  const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  if (!frontmatter) throw new Error(`${file}: missing frontmatter`);
  return { slug: basename(file, '.md'), ...parse(frontmatter) };
}));
const published = records.filter((game) => game.status === 'published');
const bySlug = new Map(published.map((game) => [game.slug, game]));
const has = (value) => value !== undefined && value !== null && value !== '' && (!Array.isArray(value) || value.length > 0);
const coverage = (field) => published.filter((game) => has(game[field])).length;

assert.ok(published.length > 0, 'Compare requires published Games');
const fieldCoverage = {
  releaseDate: coverage('releaseDate'), rtp: coverage('rtp'), rtpVariants: coverage('rtpVariants'),
  volatilityOriginal: coverage('volatilityOriginal'), volatilityNormalized: coverage('volatilityNormalized'),
  maxWinMultiplier: coverage('maxWinMultiplier'), maxWinLabelOriginal: coverage('maxWinLabelOriginal'),
  lastVerifiedAt: coverage('lastVerifiedAt'),
};
for (const [field, count] of Object.entries(fieldCoverage)) {
  assert.ok(count >= 0 && count <= published.length, `${field} coverage must remain within the published catalog`);
}
assert.equal(fieldCoverage.lastVerifiedAt, published.length, 'Every published Game must retain a field-level verification date');

assert.equal(bySlug.get('dead-or-alive-2').maxWinMultiplier, undefined);
assert.match(bySlug.get('dead-or-alive-2').maxWinLabelOriginal, /1,600 x bet/);
assert.match(bySlug.get('dead-or-alive-2').maxWinLabelOriginal, /100,000x of the original bet/);
assert.equal(bySlug.get('the-great-pigsby-megaways').volatilityNormalized, undefined);
assert.match(bySlug.get('the-great-pigsby-megaways').volatilityOriginal, /medium volatility/);
assert.match(bySlug.get('the-great-pigsby-megaways').volatilityOriginal, /high-volatility/);

assert.equal(bonusBuyLabel(bySlug.get('starburst').bonusBuy), '已確認不支援');
assert.equal(bonusBuyLabel(bySlug.get('bonanza').bonusBuy), '已確認支援');
assert.equal(bonusBuyLabel(bySlug.get('mahjong-ways').bonusBuy), COMPARE_MISSING);
assert.equal(bySlug.get('super-ace').volatilityOriginal, 'LOW-MED');
assert.equal(bySlug.get('super-ace').volatilityNormalized, undefined);
assert.equal(COMPARE_NORMALIZED_MISSING, '尚未建立統一值');
assert.equal(COMPARE_ORIGINAL_MISSING, '未取得原廠標示');
assert.equal(bySlug.get('storm-of-seth-2-awakening').maxWinLabelOriginal, 'Winning ratio');
assert.doesNotMatch(bySlug.get('storm-of-seth-2-awakening').maxWinLabelOriginal, /total bet/i);
assert.equal(bySlug.get('mahjong-ways').rtpVariants.length, 7);
assert.equal(bySlug.get('mahjong-ways-2').rtpVariants.length, 7);
assert.match(bySlug.get('mahjong-ways-2').maxWinLabelOriginal, /Advertised Max Win/);
assert.match(bySlug.get('mahjong-ways-2').maxWinLabelOriginal, /Max Exposure \(1 billion simulations\)/);
assert.equal(compareGridLabel(bySlug.get('bonanza').reels, bySlug.get('bonanza').rows), bySlug.get('bonanza').reels);
assert.equal(compareGridLabel('5x3', 3), '5 × 3');
assert.equal(compareGridLabel('5', 3), '5 × 3');
assert.equal(compareGridLabel(bySlug.get('book-of-8-riches').reels, bySlug.get('book-of-8-riches').rows), '5 × 3');
assert.equal(compareGridLabel(bySlug.get('gonzos-quest').reels, bySlug.get('gonzos-quest').rows), '5 × 3');
assert.equal(compareGridLabel(bySlug.get('the-great-pigsby-megaways').reels, bySlug.get('the-great-pigsby-megaways').rows), bySlug.get('the-great-pigsby-megaways').reels, 'preserve conflicting source descriptions verbatim');
assert.equal(compareGridLabel(undefined, undefined), COMPARE_MISSING);
assert.equal(compareGridLabel(undefined, 3), '3 列');
assert.equal(compareGridLabel('5', undefined), '5');
assert.equal(compareGridLabel('5x3', 7), '5 × 3', 'do not overwrite an explicit grid with a separate row value');
for (const reels of ['6 reels; 2–7 symbols per reel; carts above reels 2–5', 'Official source conflict: current product page 6x7; launch release 5x3']) {
  assert.equal(compareGridLabel(reels, 3), reels, 'descriptive or conflicting source text must not be parsed into a fixed grid');
}
assert.equal(compareWinCountLabel('paylines', 10), '10 條');
assert.equal(compareWinCountLabel('ways-to-win', 1024), '1,024 路');

const component = await readFile(new URL('../src/components/CompareWorkspace.tsx', import.meta.url), 'utf8');
const catalog = await readFile(new URL('../src/lib/game-catalog.ts', import.meta.url), 'utf8');
const comparePage = await readFile(new URL('../src/pages/compare/index.astro', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');

for (const token of ['<table', '<caption>', '<thead>', '<tbody', 'scope="col"', 'scope="row"', 'scope="rowgroup"']) {
  assert.ok(component.includes(token), `semantic table token missing: ${token}`);
}
assert.doesNotMatch(component, /compare-section-row[^\n]*scope="colgroup"/);
assert.match(component, /aria-hidden="true"/);
assert.match(component, /compare-sticky-head/);
assert.match(component, /buildRecordedRtpPresentation\(game\)/);
assert.match(component, /compareGridLabel\(game\.reels, game\.rows\)/, 'Compare must retain the existing shared grid formatter');
assert.match(component, /本站記錄的主要值/);
assert.match(component, /個已收錄數值/);
assert.match(component, /未建立正式系列資料/);
const stickyMarkup = component.slice(component.indexOf('<div className="compare-sticky-bar"'), component.indexOf('<table className="compare-table"'));
assert.doesNotMatch(stickyMarkup, /<(?:a|button|input|select|textarea)\b|tabIndex=/);
assert.equal((component.match(/<table\b/g) ?? []).length, 1, 'Compare must keep one semantic data table');
for (const section of ['遊戲身份', '核心數據', '玩法結構', '功能與資料可信度']) {
  assert.ok(component.includes(section), `Compare section missing: ${section}`);
}
for (const field of ['maxWinLabelOriginal', 'lastVerifiedAt']) {
  assert.match(catalog, new RegExp(`${field}: game\\.data\\.${field}`), `${field} must be projected`);
}
assert.doesNotMatch(catalog, /sources:\s*game\.data\.sources/, 'full sources must not enter the client catalog');
assert.doesNotMatch(component, /Game ID/, 'Game ID must not enter the primary matrix');
assert.doesNotMatch(component, /winner|score|ranking|best|最容易贏|誰領先/i, 'ranking or winner language rendered');
assert.doesNotMatch(component, /未公開/, 'undefined must not be rendered as 未公開');
assert.match(component, /查看完整資料與來源/);
assert.match(component, /這款資料最後核對日期/);
assert.match(component, /本表不計算贏家、勝率或推薦排名/);
assert.match(comparePage, /<noscript>/);
assert.match(comparePage, /比較工具需要 JavaScript/);
assert.match(comparePage, /href="\/games\/"/);
assert.match(styles, /\.compare-details summary\{[^}]*min-height:44px/);
assert.match(styles, /@media\(forced-colors:active\)\{[^}]*\.compare-reading-note/);

console.log(`PASS: Compare v2 projected ${published.length} Games with data-derived coverage, explicit missing states, semantic sections and no ranking output.`);
