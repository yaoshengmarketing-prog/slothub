import { emptyExplorerState, filterAndSortGames } from './game-explorer-state.mjs';

export const GUIDED_EXPLORER_MECHANISMS = Object.freeze([
  'paylines',
  'ways-to-win',
  'megaways',
  'cluster-pays',
  'pay-anywhere',
]);

export const GUIDED_EXPLORER_FEATURES = Object.freeze([
  'cascading',
  'bonus-buy',
  'multiplier',
  'free-spins',
]);

const featureChoices = ['', ...GUIDED_EXPLORER_FEATURES];

function guidedExplorerState(mechanism, feature) {
  return {
    ...emptyExplorerState(),
    mechanism,
    features: feature ? [feature] : [],
  };
}

export function buildGuidedExplorerCounts(games) {
  return Object.fromEntries(GUIDED_EXPLORER_MECHANISMS.map((mechanism) => [
    mechanism,
    Object.fromEntries(featureChoices.map((feature) => [
      feature,
      filterAndSortGames(games, guidedExplorerState(mechanism, feature)).length,
    ])),
  ]));
}

export function buildGuidedExplorerResult(counts, mechanism = '', feature = '') {
  if (!GUIDED_EXPLORER_MECHANISMS.includes(mechanism)) {
    return { complete: false, count: undefined, explorerState: undefined };
  }

  const normalizedFeature = GUIDED_EXPLORER_FEATURES.includes(feature) ? feature : '';
  return {
    complete: true,
    count: counts[mechanism][normalizedFeature],
    explorerState: guidedExplorerState(mechanism, normalizedFeature),
  };
}
