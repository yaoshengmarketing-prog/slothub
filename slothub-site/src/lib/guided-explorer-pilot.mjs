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

export function buildGuidedExplorerResult(games, mechanism = '', feature = '') {
  if (!GUIDED_EXPLORER_MECHANISMS.includes(mechanism)) {
    return { complete: false, count: undefined, explorerState: undefined };
  }

  const normalizedFeature = GUIDED_EXPLORER_FEATURES.includes(feature) ? feature : '';
  const explorerState = {
    ...emptyExplorerState(),
    mechanism,
    features: normalizedFeature ? [normalizedFeature] : [],
  };

  return {
    complete: true,
    count: filterAndSortGames(games, explorerState).length,
    explorerState,
  };
}
