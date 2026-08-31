export const SIMILAR_PLAY_DISTINCTIVE_FEATURES = Object.freeze([
  'cascading',
  'bonus-buy',
  'hold-and-spin',
  'respins',
  'cash-collection',
  'giant-symbols',
  'sticky-symbols',
  'symbol-splitting',
  'jackpot',
]);

export const SIMILAR_PLAY_EXCLUDED_FEATURES = Object.freeze(['wild', 'scatter', 'other']);

const distinctiveFeatureSet = new Set(SIMILAR_PLAY_DISTINCTIVE_FEATURES);
const excludedFeatureSet = new Set(SIMILAR_PLAY_EXCLUDED_FEATURES);

const displayName = (game) => game.name?.trim() || game.slug;
const usableFeatures = (game) => [...new Set((game.features ?? []).filter((feature) => !excludedFeatureSet.has(feature)))];
const sharedFeatures = (current, candidate) => {
  const candidateFeatures = new Set(usableFeatures(candidate));
  return usableFeatures(current).filter((feature) => candidateFeatures.has(feature));
};

const compareNames = (left, right) =>
  displayName(left).localeCompare(displayName(right), 'zh-Hant-TW') || left.slug.localeCompare(right.slug);

const buildReasons = (current, candidate, shared) => {
  const distinctive = shared.filter((feature) => distinctiveFeatureSet.has(feature));
  const general = shared.filter((feature) => !distinctiveFeatureSet.has(feature));
  const reasons = distinctive.map((value) => ({ type: 'feature', value }));

  if (
    reasons.length < 2
    && current.winCount !== undefined
    && candidate.winCount !== undefined
    && current.winCount === candidate.winCount
  ) {
    reasons.push({ type: 'win-count', value: current.winCount });
  }

  for (const value of general) {
    if (reasons.length >= 2) break;
    reasons.push({ type: 'feature', value });
  }

  return reasons.slice(0, 2);
};

export function buildSimilarPlayPresentation(currentSlug, games, limit = 4) {
  const current = games.find((game) => game.slug === currentSlug && game.status === 'published');
  if (!current?.winMechanism || current.winMechanism === 'other') {
    return { mechanism: undefined, items: [] };
  }

  const uniqueCandidates = new Map();
  for (const candidate of games) {
    if (
      candidate.status !== 'published'
      || candidate.slug === current.slug
      || candidate.winMechanism !== current.winMechanism
      || uniqueCandidates.has(candidate.slug)
    ) continue;

    const shared = sharedFeatures(current, candidate);
    uniqueCandidates.set(candidate.slug, {
      game: candidate,
      distinctiveCount: shared.filter((feature) => distinctiveFeatureSet.has(feature)).length,
      sharedCount: shared.length,
      sameWinCount: current.winCount !== undefined && candidate.winCount !== undefined && current.winCount === candidate.winCount,
      reasons: buildReasons(current, candidate, shared),
    });
  }

  const items = [...uniqueCandidates.values()]
    .sort((left, right) =>
      right.distinctiveCount - left.distinctiveCount
      || right.sharedCount - left.sharedCount
      || Number(right.sameWinCount) - Number(left.sameWinCount)
      || compareNames(left.game, right.game))
    .slice(0, Math.max(0, limit))
    .map(({ game, reasons }) => ({ game, reasons }));

  return { mechanism: current.winMechanism, items };
}
