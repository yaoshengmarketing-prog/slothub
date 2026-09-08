import { rankSearch } from './search.js';

export const RTP_THRESHOLDS = [96, 96.2, 96.5];
export const MAX_WIN_THRESHOLDS = [5000, 10000, 25000];
export const SORT_VALUES = ['relevance', 'name-asc', 'rtp-desc', 'rtp-asc', 'max-win-desc', 'max-win-asc'];

export function emptyExplorerState() {
  return {
    q: '', provider: '', primaryType: '', subtype: '', mechanism: '', features: [],
    rtpMin: undefined, volatility: '', maxWinMin: undefined, sort: 'name-asc',
  };
}

export function explorerOptions(games) {
  return {
    providers: new Set(games.map((game) => game.provider)),
    primaryTypes: new Set(games.map((game) => game.primaryType)),
    subtypes: new Set(games.flatMap((game) => game.subtypes)),
    mechanisms: new Set(games.map((game) => game.winMechanism).filter(Boolean)),
    features: new Set(games.flatMap((game) => game.features)),
    volatilities: new Set(games.map((game) => game.volatilityNormalized).filter(Boolean)),
  };
}

function firstValid(params, key, allowed) {
  return params.getAll(key).map((value) => value.trim()).find((value) => allowed.has(value)) ?? '';
}

function firstNumber(params, key, allowed) {
  for (const value of params.getAll(key)) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && allowed.includes(parsed)) return parsed;
  }
  return undefined;
}

export function parseExplorerState(input, games) {
  const params = input instanceof URLSearchParams ? input : new URLSearchParams(String(input).replace(/^\?/, ''));
  const options = explorerOptions(games);
  const q = params.getAll('q').map((value) => value.trim()).find(Boolean) ?? '';
  const rawFeatures = params.getAll('features').flatMap((value) => value.split(',')).map((value) => value.trim());
  const features = [...new Set(rawFeatures)].filter((feature) => options.features.has(feature));
  const requestedSort = params.getAll('sort').find((value) => SORT_VALUES.includes(value) && (value !== 'relevance' || q));
  const defaultSort = q ? 'relevance' : 'name-asc';

  return {
    q,
    provider: firstValid(params, 'provider', options.providers),
    primaryType: firstValid(params, 'type', options.primaryTypes),
    subtype: firstValid(params, 'subtype', options.subtypes),
    mechanism: firstValid(params, 'mechanism', options.mechanisms),
    features,
    rtpMin: firstNumber(params, 'rtp-min', RTP_THRESHOLDS),
    volatility: firstValid(params, 'volatility', options.volatilities),
    maxWinMin: firstNumber(params, 'max-win-min', MAX_WIN_THRESHOLDS),
    sort: requestedSort ?? defaultSort,
  };
}

export function serializeExplorerState(state) {
  const params = new URLSearchParams();
  const q = state.q?.trim() ?? '';
  if (q) params.set('q', q);
  if (state.provider) params.set('provider', state.provider);
  if (state.primaryType) params.set('type', state.primaryType);
  if (state.subtype) params.set('subtype', state.subtype);
  if (state.mechanism) params.set('mechanism', state.mechanism);
  if (state.features?.length) params.set('features', [...new Set(state.features)].sort().join(','));
  if (RTP_THRESHOLDS.includes(state.rtpMin)) params.set('rtp-min', String(state.rtpMin));
  if (state.volatility) params.set('volatility', state.volatility);
  if (MAX_WIN_THRESHOLDS.includes(state.maxWinMin)) params.set('max-win-min', String(state.maxWinMin));
  const defaultSort = q ? 'relevance' : 'name-asc';
  if (SORT_VALUES.includes(state.sort) && state.sort !== defaultSort) params.set('sort', state.sort);
  return params.toString();
}

const nameCompare = (a, b) => a.name.localeCompare(b.name, 'zh-Hant-TW') || a.originalName.localeCompare(b.originalName, 'en') || a.slug.localeCompare(b.slug, 'en');

function numericCompare(field, direction) {
  return (a, b) => {
    const left = a[field], right = b[field];
    if (left === undefined && right === undefined) return nameCompare(a, b);
    if (left === undefined) return 1;
    if (right === undefined) return -1;
    return (left - right) * direction || nameCompare(a, b);
  };
}

export function filterAndSortGames(games, state) {
  const searched = state.q
    ? rankSearch(games.map((game) => ({
        ...game,
        title: game.name,
        secondaryTitle: game.displayNameZhHant ? game.originalName : undefined,
        description: game.summary,
        kind: '遊戲',
        aliases: game.aliases,
        seriesName: game.seriesNameZhHant,
        searchText: game.searchTerms,
      })), state.q, games.length)
    : [...games];

  const filtered = searched
    .filter((game) => !state.provider || game.provider === state.provider)
    .filter((game) => !state.primaryType || game.primaryType === state.primaryType)
    .filter((game) => !state.subtype || game.subtypes.includes(state.subtype))
    .filter((game) => !state.mechanism || game.winMechanism === state.mechanism)
    .filter((game) => !state.features.length || state.features.every((feature) => game.features.includes(feature)))
    .filter((game) => state.rtpMin === undefined || (game.rtp !== undefined && game.rtp >= state.rtpMin))
    .filter((game) => !state.volatility || game.volatilityNormalized === state.volatility)
    .filter((game) => state.maxWinMin === undefined || (game.maxWinMultiplier !== undefined && game.maxWinMultiplier >= state.maxWinMin));

  if (state.sort === 'relevance' && state.q) return filtered;
  const sorted = [...filtered];
  if (state.sort === 'rtp-desc') return sorted.sort(numericCompare('rtp', -1));
  if (state.sort === 'rtp-asc') return sorted.sort(numericCompare('rtp', 1));
  if (state.sort === 'max-win-desc') return sorted.sort(numericCompare('maxWinMultiplier', -1));
  if (state.sort === 'max-win-asc') return sorted.sort(numericCompare('maxWinMultiplier', 1));
  return sorted.sort(nameCompare);
}

export function hasExplorerFilters(state) {
  return Boolean(state.q || state.provider || state.primaryType || state.subtype || state.mechanism || state.features.length || state.rtpMin !== undefined || state.volatility || state.maxWinMin !== undefined || state.sort !== 'name-asc');
}

export function featureResultCount(games, state, feature) {
  const features = state.features.includes(feature) ? state.features : [...state.features, feature];
  return filterAndSortGames(games, { ...state, features }).length;
}

export function zeroResultRecoveryOptions(games, state, limit = 3) {
  const candidates = [];
  const add = (field, value, nextState) => {
    const count = filterAndSortGames(games, nextState).length;
    if (count > 0) candidates.push({ field, value, count, state: nextState, order: candidates.length });
  };

  if (state.q) add('q', state.q, { ...state, q: '', sort: state.sort === 'relevance' ? 'name-asc' : state.sort });
  if (state.provider) add('provider', state.provider, { ...state, provider: '' });
  if (state.primaryType) add('primaryType', state.primaryType, { ...state, primaryType: '' });
  if (state.subtype) add('subtype', state.subtype, { ...state, subtype: '' });
  if (state.mechanism) add('mechanism', state.mechanism, { ...state, mechanism: '' });
  for (const feature of state.features) {
    add('feature', feature, { ...state, features: state.features.filter((item) => item !== feature) });
  }
  if (state.rtpMin !== undefined) add('rtpMin', state.rtpMin, { ...state, rtpMin: undefined });
  if (state.volatility) add('volatility', state.volatility, { ...state, volatility: '' });
  if (state.maxWinMin !== undefined) add('maxWinMin', state.maxWinMin, { ...state, maxWinMin: undefined });

  return candidates
    .sort((left, right) => left.count - right.count || left.order - right.order)
    .slice(0, limit)
    .map(({ order: _order, ...candidate }) => candidate);
}
