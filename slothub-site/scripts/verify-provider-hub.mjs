import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { buildProviderHubIndex, buildProviderHubProjection, PROVIDER_COVERAGE_KEYS } from '../src/lib/provider-hub.mjs';
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
assert.equal(providers.length, 129, 'expected 129 published Providers');
assert.equal(games.length, 187, 'expected 187 published Games');
assert.equal(new Set(games.map((game) => game.id)).size, 187, 'duplicate published Game slug');
assert.ok(games.every((game) => providers.some((provider) => provider.id === game.data.provider)), 'orphan canonical Provider');

const index = buildProviderHubIndex(providerEntries, gameEntries, taxonomy);
assert.equal(index.length, 129);
assert.equal(index.reduce((total, provider) => total + provider.sampleSize, 0), 187, 'Provider N must sum to 187');
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

assert.equal((indexHtml.match(/href="\/providers\/[a-z0-9-]+\/"/g) ?? []).length, 129, 'Provider index must contain 129 detail links');
assert.equal((indexHtml.match(/<a(?![^>]*href=)/g) ?? []).length, 0, 'Provider index has fake anchors');

const providerCss = await readFile(fileURLToPath(new URL('../src/styles/global.css', import.meta.url)), 'utf8');
assert.match(providerCss, /\.provider-explorer-cta\{[^}]*text-align:center/, 'Provider CTA scoped CSS missing');
assert.match(providerCss, /\.provider-detail-v2 a:focus-visible\{[^}]*outline:/, 'Provider focus-visible treatment missing');
assert.ok(!providerTemplate.includes('client:'), 'Provider detail core content must not require client hydration');

console.log('PASS: Provider Hub v2 projected 129 Providers and 187 Games with honest N states, fixed taxonomy order, exact Explorer URLs, field-presence coverage and no ranking output.');
