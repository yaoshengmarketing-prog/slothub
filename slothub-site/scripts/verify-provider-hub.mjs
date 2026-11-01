import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { buildProviderHubIndex, buildProviderHubProjection, PROVIDER_COVERAGE_KEYS } from '../src/lib/provider-hub.mjs';
import { buildRecordedRtpPresentation, formatRecordedRtp } from '../src/lib/game-detail-presentation.mjs';
import { emptyExplorerState, filterAndSortGames, parseExplorerState } from '../src/lib/game-explorer-state.mjs';

const providersDirectory = fileURLToPath(new URL('../src/content/providers/', import.meta.url));
const gamesDirectory = fileURLToPath(new URL('../src/content/games/', import.meta.url));
const distProvidersDirectory = fileURLToPath(new URL('../dist/providers/', import.meta.url));

async function readCollection(directory) {
  const files = (await readdir(directory)).filter((file) => file.endsWith('.md')).sort();
  return Promise.all(files.map(async (file) => {
    const raw = await readFile(join(directory, file), 'utf8');
    const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
    if (!frontmatter) throw new Error(`${file}: missing frontmatter`);
    return { id: basename(file, '.md'), data: parse(frontmatter), raw };
  }));
}

const mechanismLabels = {
  paylines: '賠線', 'ways-to-win': '多路贏法', megaways: 'Megaways',
  'cluster-pays': '群集賠付', 'pay-anywhere': '任意位置賠付', other: '其他',
};
const featureLabels = {
  'free-spins': '免費旋轉', wild: '百搭符號', scatter: '散佈符號', multiplier: '倍數',
  'hold-and-spin': 'Hold & Spin', cascading: '連鎖消除', 'bonus-buy': 'Bonus Buy', respins: '重轉',
  'cash-collection': '獎金收集', 'giant-symbols': '巨型符號', 'symbol-splitting': '符號分裂',
  'sticky-symbols': '黏著符號', jackpot: 'Jackpot 功能', other: '其他功能',
};
const taxonomy = { mechanismLabels, featureLabels };

const [providerEntries, gameEntries] = await Promise.all([
  readCollection(providersDirectory),
  readCollection(gamesDirectory),
]);
const providers = providerEntries.filter((entry) => entry.data.status === 'published');
const games = gameEntries.filter((entry) => entry.data.status === 'published');
assert.ok(providers.length > 0, 'Provider Hub requires published Providers');
assert.ok(games.length > 0, 'Provider Hub requires published Games');
assert.equal(new Set(games.map((game) => game.id)).size, games.length, 'duplicate published Game slug');
assert.ok(games.every((game) => providers.some((provider) => provider.id === game.data.provider)), 'orphan canonical Provider');

const index = buildProviderHubIndex(providerEntries, gameEntries, taxonomy);
assert.equal(index.length, providers.length, 'Provider index must cover every published Provider');
assert.equal(index.reduce((total, provider) => total + provider.sampleSize, 0), games.length, 'Provider N must sum to the published Game catalog');
assert.deepEqual(index.map((item) => item.provider.name), [...index.map((item) => item.provider.name)].sort((a, b) => a.localeCompare(b, 'zh-Hant-TW')), 'Provider index must use neutral name ordering');

const expectedCounts = Object.fromEntries(providers.map((provider) => [
  provider.id,
  games.filter((game) => game.data.provider === provider.id).length,
]));
assert.deepEqual(Object.fromEntries(index.map((item) => [item.providerSlug, item.sampleSize])), expectedCounts);
assert.deepEqual(PROVIDER_COVERAGE_KEYS, ['rtp', 'volatilityOriginal', 'volatilityNormalized', 'maxWinMultiplier', 'releaseDate', 'bonusBuy', 'sources', 'lastVerifiedAt']);

const explorerGames = games.map((entry) => ({
  slug: entry.id,
  name: entry.data.displayNameZhHant ?? entry.data.originalName ?? entry.data.name,
  originalName: entry.data.originalName ?? entry.data.name,
  aliases: entry.data.aliases ?? [],
  provider: entry.data.provider,
  primaryType: entry.data.primaryType,
  subtypes: entry.data.subtypes ?? [],
  summary: entry.data.summary,
  rtp: entry.data.rtp,
  volatilityNormalized: entry.data.volatilityNormalized ?? entry.data.volatility,
  maxWinMultiplier: entry.data.maxWinMultiplier,
  winMechanism: entry.data.winMechanism,
  features: entry.data.features ?? [],
  searchTerms: [entry.data.summary],
}));

const indexHtml = await readFile(join(distProvidersDirectory, 'index.html'), 'utf8');
let previousIndex = -1;
const pageTitles = new Set();
const pageDescriptions = new Set();
const pageHeadings = new Set();
for (const item of index) {
  const detailHtml = await readFile(join(distProvidersDirectory, item.providerSlug, 'index.html'), 'utf8');
  const currentIndex = indexHtml.indexOf(`href="/providers/${item.providerSlug}/"`);
  assert.ok(currentIndex > previousIndex, `${item.providerSlug}: index order mismatch`);
  previousIndex = currentIndex;

  const query = `provider=${item.providerSlug}`;
  const parsed = parseExplorerState(query, explorerGames);
  const results = filterAndSortGames(explorerGames, { ...emptyExplorerState(), ...parsed });
  assert.equal(parsed.provider, item.providerSlug, `${item.providerSlug}: Explorer hydration mismatch`);
  assert.equal(results.length, item.sampleSize, `${item.providerSlug}: Explorer result mismatch`);
  assert.ok(detailHtml.includes(`Slot Hub 收錄 ${item.sampleSize} 款`), `${item.providerSlug}: detail N missing`);
  assert.ok(detailHtml.includes(`以下只整理 Slot Hub 目前收錄、歸類於此 Provider 的 ${item.sampleSize} 款遊戲`), `${item.providerSlug}: disclosure missing`);
  assert.ok(detailHtml.includes(`/games/?provider=${item.providerSlug}`), `${item.providerSlug}: exact Provider CTA missing`);
  assert.ok(detailHtml.includes('Provider 資料更新：'), `${item.providerSlug}: update label missing`);
  assert.ok(detailHtml.includes(item.provider.source.url.replaceAll('&', '&amp;')), `${item.providerSlug}: Provider source missing`);
  assert.ok(!detailHtml.includes('PP 王者電子'), `${item.providerSlug}: search alias leaked into public identity`);
  assert.equal((detailHtml.match(/<a\b(?![^>]*\bhref=)[^>]*>/g) ?? []).length, 0, `${item.providerSlug}: detail has fake anchors`);

  const title = detailHtml.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = detailHtml.match(/<meta name="description" content="([^"]+)"/)?.[1];
  const heading = detailHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, '').trim();
  assert.ok(title && description && heading, `${item.providerSlug}: title, description or H1 missing`);
  assert.ok(!pageTitles.has(title), `${item.providerSlug}: duplicate detail title`);
  assert.ok(!pageDescriptions.has(description), `${item.providerSlug}: duplicate detail description`);
  assert.ok(!pageHeadings.has(heading), `${item.providerSlug}: duplicate detail H1`);
  pageTitles.add(title);
  pageDescriptions.add(description);
  pageHeadings.add(heading);

  const hasStatistics = detailHtml.includes('class="provider-sample-stats"');
  assert.equal(hasStatistics, item.sampleSize >= 2, `${item.providerSlug}: N threshold mismatch`);
  const listHtml = detailHtml.match(/<section\b[^>]*class="section provider-games"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? '';
  let previousGameIndex = -1;
  for (const game of item.games) {
    const href = `href="/games/${game.slug}/"`;
    const gameIndex = listHtml.indexOf(href);
    assert.ok(gameIndex > previousGameIndex, `${game.slug}: Provider list name ordering or link changed`);
    previousGameIndex = gameIndex;
    const rowHtml = listHtml.slice(gameIndex, listHtml.indexOf('</a>', gameIndex));
    const rowText = rowHtml.replace(/<[^>]+>/g, '').replace(/\s+/g, '');
    const rtp = buildRecordedRtpPresentation(game);
    assert.deepEqual(game.recordedRtp, rtp, `${game.slug}: Provider RTP projection diverged from the shared helper`);
    const expectedRtp = !rtp.hasRecordedValues ? '尚未收錄 RTP 數值'
      : rtp.valueCount <= 2 ? `已收錄 RTP｜${rtp.values.map(formatRecordedRtp).join('／')}`
      : `已收錄 ${rtp.valueCount} 個 RTP 數值`;
    assert.ok(rowText.includes(expectedRtp.replace(/\s+/g, '')), `${game.slug}: Provider row recorded RTP output mismatch`);
    assert.ok(!rowText.includes('RTP尚未核實'), `${game.slug}: old primary-only missing label remains`);
  }
  if (item.showStatistics) {
    const rtpCoverage = item.coverage.find((field) => field.key === 'rtp');
    const expectedRtpCount = item.games.filter((game) => game.recordedRtp.hasRecordedValues).length;
    assert.equal(rtpCoverage.label, '有已收錄 RTP 數值');
    assert.equal(rtpCoverage.count, expectedRtpCount, `${item.providerSlug}: RTP coverage must count games, not values`);
    const coverageHtml = detailHtml.match(/<section\b[^>]*class="provider-coverage"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? '';
    assert.match(coverageHtml, new RegExp(`<dt[^>]*>${rtpCoverage.label}</dt>\\s*<dd[^>]*>${expectedRtpCount}/${item.sampleSize}</dd>`), `${item.providerSlug}: built RTP coverage mismatch`);
  }
  if (item.sampleSize === 1) {
    assert.ok(!detailHtml.includes('class="provider-coverage"'), `${item.providerSlug}: N=1 coverage must be hidden`);
  }
  if (item.unclassifiedMechanismCount > 0) {
    assert.ok(detailHtml.includes(`主要機制尚未細分：${item.unclassifiedMechanismCount}/${item.sampleSize} 款`), `${item.providerSlug}: other status missing`);
  }
  assert.ok(!detailHtml.includes('>其他</strong><span>'), `${item.providerSlug}: other rendered as a Mechanism chip`);
}

const syntheticProvider = { id: 'synthetic-provider', data: { name: 'Synthetic Provider', status: 'published' } };
const n0 = buildProviderHubProjection(syntheticProvider, [], taxonomy);
assert.equal(n0.sampleSize, 0);
assert.equal(n0.hasGames, false);
assert.equal(n0.showStatistics, false);
assert.deepEqual(n0.mechanisms, []);
assert.deepEqual(n0.features, []);
assert.deepEqual(n0.coverage, []);

const n1 = buildProviderHubProjection(syntheticProvider, [{
  id: 'one-game',
  data: { status: 'published', provider: 'synthetic-provider', name: 'One Game', winMechanism: 'paylines', features: ['wild'], bonusBuy: false },
}], taxonomy);
assert.equal(n1.sampleSize, 1);
assert.equal(n1.hasGames, true);
assert.equal(n1.showStatistics, false);

const semantics = buildProviderHubProjection(syntheticProvider, [
  { id: 'true', data: { status: 'published', provider: 'synthetic-provider', name: 'True', winMechanism: 'other', features: ['free-spins', 'wild'], bonusBuy: true } },
  { id: 'false', data: { status: 'published', provider: 'synthetic-provider', name: 'False', winMechanism: 'paylines', features: ['free-spins'], bonusBuy: false } },
  { id: 'unknown', data: { status: 'published', provider: 'synthetic-provider', name: 'Unknown', winMechanism: 'paylines', features: [] } },
], taxonomy);
assert.equal(semantics.coverage.find((item) => item.key === 'bonusBuy').count, 2, 'Bonus Buy known must be true + false, excluding undefined');
assert.equal(semantics.features.find((item) => item.value === 'free-spins').count, 2, 'Feature counts may overlap');
assert.ok(!semantics.mechanisms.some((item) => item.value === 'other'), 'other must not be a shared Mechanism chip');
assert.equal(semantics.unclassifiedMechanismCount, 1);

// Isolated values include inputs forbidden by the Game Schema. They never enter content or dist.
const rtpCases = [
  { id: 'primary', input: { rtp: 96.4 }, expected: [96.4] },
  { id: 'variant-single', input: { rtpVariants: [96.7] }, expected: [96.7] },
  { id: 'variant-multiple', input: { rtpVariants: [94.06, 96.7] }, expected: [94.06, 96.7] },
  { id: 'duplicates', input: { rtp: 96.4, rtpVariants: [96.4, 94.38, 94.38] }, expected: [96.4, 94.38] },
  { id: 'missing', input: { rtpVariants: [] }, expected: [] },
  { id: 'zero-primary', input: { rtp: 0 }, expected: [0] },
  { id: 'zero-variant', input: { rtpVariants: [0, 0] }, expected: [0] },
  { id: 'non-finite', input: { rtp: NaN, rtpVariants: [Infinity, -Infinity] }, expected: [] },
  { id: 'invalid', input: { rtp: null, rtpVariants: ['', '96.7', null, undefined, NaN] }, expected: [] },
  { id: 'precision', input: { rtp: 96.1234, rtpVariants: [96.12340001] }, expected: [96.1234, 96.12340001] },
];
const rtpEntries = rtpCases.map(({ id, input }) => ({ id, data: {
  status: 'published', provider: syntheticProvider.id, name: id, ...input,
  sources: [{ url: 'https://example.test/rules', checkedAt: '2026-01-01' }],
} }));
rtpEntries.push(
  { id: 'other-provider', data: { status: 'published', provider: 'different-provider', name: 'Other', rtp: 99 } },
  { id: 'not-published', data: { status: 'draft', provider: syntheticProvider.id, name: 'Draft', rtpVariants: [99] } },
);
const beforeRtpEntries = structuredClone(rtpEntries);
const freezeDeep = (value) => {
  if (value && typeof value === 'object') { Object.values(value).forEach(freezeDeep); Object.freeze(value); }
  return value;
};
freezeDeep(rtpEntries);
const recorded = buildProviderHubProjection(syntheticProvider, rtpEntries, taxonomy);
assert.equal(recorded.sampleSize, rtpCases.length, 'exclude other Provider and unpublished Games');
assert.deepEqual(recorded.games.map((game) => game.slug), rtpCases.map((test) => test.id).sort((a, b) => a.localeCompare(b, 'zh-Hant-TW')), 'RTP must not change game name ordering');
for (const test of rtpCases) {
  const game = recorded.games.find((entry) => entry.slug === test.id);
  assert.deepEqual(game.recordedRtp.values, test.expected, `${test.id}: stable finite recorded values`);
  assert.equal(game.recordedRtp.hasRecordedValues, test.expected.length > 0, `${test.id}: list availability`);
  assert.equal(game.recordedRtp.valueCount, test.expected.length, `${test.id}: distinct value count`);
}
assert.equal(recorded.coverage.find((field) => field.key === 'rtp').count, rtpCases.filter((test) => test.expected.length > 0).length, 'count each recorded Game once, including zero and variants-only');
assert.equal(recorded.coverage.find((field) => field.key === 'sources').count, rtpCases.length, 'other coverage semantics preserved');
assert.deepEqual(rtpEntries, beforeRtpEntries, 'original values, order and source records must remain unchanged');
const onlyOneRecorded = buildProviderHubProjection(syntheticProvider, [rtpEntries[1], rtpEntries.at(-1), rtpEntries.at(-2)], taxonomy);
assert.equal(onlyOneRecorded.sampleSize, 1);
assert.equal(onlyOneRecorded.games[0].recordedRtp.hasRecordedValues, true);
assert.equal(onlyOneRecorded.showStatistics, false, 'variants-only must not change N=1 presentation gate');
assert.deepEqual(onlyOneRecorded.coverage, []);

const providerTemplate = await readFile(fileURLToPath(new URL('../src/pages/providers/[slug].astro', import.meta.url)), 'utf8');
assert.ok(providerTemplate.includes('Slot Hub 目前尚未收錄此廠商已公開的遊戲'), 'N=0 empty-state copy missing');
assert.match(providerTemplate, /\{hasGames && \([\s\S]*provider-games/, 'N=0 game-list gate missing');
assert.match(providerTemplate, /\{showStatistics && \([\s\S]*provider-sample-stats/, 'statistics gate missing');
assert.match(providerTemplate, /\{hasGames && \([\s\S]*provider-explorer-callout/, 'N=0 CTA gate missing');

for (const provider of providerEntries.filter((entry) => ['cq9-gaming', 'jili-games', 'netent'].includes(entry.id))) {
  assert.ok(!provider.raw.includes('可追溯廠商草稿'), `${provider.id}: public draft language remains`);
}
const publicProviderText = `${providerEntries.map((entry) => entry.data.summary).join('\n')}\n${providerTemplate}\n${indexHtml}`;
for (const residue of ['可追溯廠商草稿', '首批', 'Seed Data', '暫存', 'TODO']) {
  assert.ok(!publicProviderText.includes(residue), `public Provider production residue: ${residue}`);
}
for (const forbidden of ['平均 RTP', '平均 Max Win', '平均波動度', '勝率', 'Provider 排名', '資料完整度分數']) {
  assert.ok(!providerTemplate.includes(forbidden), `forbidden Provider ranking output: ${forbidden}`);
}

assert.equal((indexHtml.match(/href="\/providers\/[a-z0-9-]+\/"/g) ?? []).length, providers.length, 'Provider index must contain one detail link per published Provider');
assert.equal((indexHtml.match(/<a(?![^>]*href=)/g) ?? []).length, 0, 'Provider index has fake anchors');

const providerCss = await readFile(fileURLToPath(new URL('../src/styles/global.css', import.meta.url)), 'utf8');
assert.match(providerCss, /\.provider-explorer-cta\{[^}]*text-align:center/, 'Provider CTA scoped CSS missing');
assert.match(providerCss, /\.provider-detail-v2 a:focus-visible\{[^}]*outline:/, 'Provider focus-visible treatment missing');
assert.ok(!providerTemplate.includes('client:'), 'Provider detail core content must not require client hydration');
assert.ok(providerTemplate.includes('game.recordedRtp'), 'Provider list must use the same recorded RTP projection as coverage');
assert.ok(!providerTemplate.includes('game.rtp !== undefined'), 'Provider list must not use primary-only availability');

console.log(`PASS: Provider Hub v2 projected ${providers.length} Providers and ${games.length} Games with honest N states, fixed taxonomy order, exact Explorer URLs, recorded RTP lists/coverage, isolated RTP states/non-mutation and no ranking output.`);
