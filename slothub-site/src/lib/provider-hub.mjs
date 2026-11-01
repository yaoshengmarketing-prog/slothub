import { buildRecordedRtpPresentation } from './game-detail-presentation.mjs';

const hasRecordedValue = (value) => value !== undefined && value !== null;

const coverageDefinitions = [
  ['rtp', '有已收錄 RTP 數值', (game) => game.recordedRtp.hasRecordedValues],
  ['volatilityOriginal', '原廠波動度已記錄', (game) => hasRecordedValue(game.volatilityOriginal)],
  ['volatilityNormalized', 'Slot Hub 統一波動度已建立', (game) => hasRecordedValue(game.volatilityNormalized)],
  ['maxWinMultiplier', 'Max Win 已記錄', (game) => hasRecordedValue(game.maxWinMultiplier)],
  ['releaseDate', '發布日期已記錄', (game) => hasRecordedValue(game.releaseDate)],
  ['bonusBuy', 'Bonus Buy 狀態已核實', (game) => typeof game.bonusBuy === 'boolean'],
  ['sources', '至少一筆 Game 資料來源', (game) => Array.isArray(game.sources) && game.sources.length > 0],
  ['lastVerifiedAt', 'Game 資料核對日期已記錄', (game) => hasRecordedValue(game.lastVerifiedAt)],
];

const entryData = (entry) => entry?.data ?? entry;
const entryId = (entry) => entry?.id ?? entry?.slug;

const countByTaxonomyOrder = (games, taxonomyLabels, readValues, excluded = new Set()) =>
  Object.entries(taxonomyLabels)
    .filter(([value]) => !excluded.has(value))
    .map(([value, label]) => ({
      value,
      label,
      count: games.filter((game) => readValues(game).includes(value)).length,
    }))
    .filter((item) => item.count > 0);

export function buildProviderHubProjection(providerEntry, gameEntries, taxonomy) {
  const provider = entryData(providerEntry);
  const providerSlug = entryId(providerEntry);
  const games = gameEntries
    .filter((entry) => {
      const game = entryData(entry);
      return game.status === 'published' && game.provider === providerSlug;
    })
    .map((entry) => {
      const game = entryData(entry);
      return { slug: entryId(entry), ...game, recordedRtp: buildRecordedRtpPresentation(game) };
    })
    .sort((a, b) => {
      const left = a.displayNameZhHant ?? a.originalName ?? a.name;
      const right = b.displayNameZhHant ?? b.originalName ?? b.name;
      return left.localeCompare(right, 'zh-Hant-TW') || a.slug.localeCompare(b.slug, 'en');
    });

  const sampleSize = games.length;
  const showStatistics = sampleSize >= 2;
  const mechanisms = showStatistics
    ? countByTaxonomyOrder(games, taxonomy.mechanismLabels, (game) => game.winMechanism ? [game.winMechanism] : [], new Set(['other']))
    : [];
  const unclassifiedMechanismCount = showStatistics
    ? games.filter((game) => game.winMechanism === 'other').length
    : 0;
  const features = showStatistics
    ? countByTaxonomyOrder(games, taxonomy.featureLabels, (game) => game.features ?? [])
    : [];
  const coverage = showStatistics
    ? coverageDefinitions.map(([key, label, predicate]) => ({
        key,
        label,
        count: games.filter(predicate).length,
      }))
    : [];

  return {
    providerSlug,
    provider,
    games,
    sampleSize,
    hasGames: sampleSize > 0,
    showStatistics,
    mechanisms,
    unclassifiedMechanismCount,
    features,
    coverage,
  };
}

export function buildProviderHubIndex(providerEntries, gameEntries, taxonomy) {
  return providerEntries
    .filter((entry) => entryData(entry).status === 'published')
    .map((entry) => buildProviderHubProjection(entry, gameEntries, taxonomy))
    .sort((a, b) => a.provider.name.localeCompare(b.provider.name, 'zh-Hant-TW') || a.providerSlug.localeCompare(b.providerSlug, 'en'));
}

export const PROVIDER_COVERAGE_KEYS = coverageDefinitions.map(([key]) => key);
