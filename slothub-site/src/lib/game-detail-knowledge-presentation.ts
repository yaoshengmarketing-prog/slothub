import type { RelatedGuideMatch, RelationshipReason } from './guide-relationships.mjs';

export const GAME_DETAIL_DIRECT_FEATURE_GUIDE_LIMIT = 3;

export type GameDetailKnowledgeFacts = {
  hasPrimaryRtp: boolean;
  hasRtpVariants: boolean;
  hasNormalizedVolatility: boolean;
  hasOriginalVolatility: boolean;
  hasMaxWin: boolean;
};

export type GameDetailFieldPlacement =
  | 'core-mechanism'
  | 'core-rtp'
  | 'core-volatility'
  | 'core-max-win'
  | 'full-rtp-variants'
  | 'full-volatility';

export type GameDetailKnowledgeItem = RelatedGuideMatch & {
  displayReasons: RelationshipReason[];
};

export type GameDetailKnowledgePresentation = {
  fieldGuides: Partial<Record<GameDetailFieldPlacement, GameDetailKnowledgeItem[]>>;
  featureGuides: {
    direct: GameDetailKnowledgeItem[];
    overflow: GameDetailKnowledgeItem[];
  };
  allGuideSlugs: string[];
};

const reasonPriority = ['mechanism', 'data-topic', 'feature'] as const;

function fieldPlacementForReason(
  reason: RelationshipReason,
  facts: GameDetailKnowledgeFacts,
): GameDetailFieldPlacement | undefined {
  if (reason.type === 'mechanism') return 'core-mechanism';
  if (reason.type !== 'data-topic') return undefined;
  if ((reason.value === 'rtp' || reason.value === 'rtp-variants') && facts.hasPrimaryRtp) return 'core-rtp';
  if (reason.value === 'rtp-variants' && !facts.hasPrimaryRtp && facts.hasRtpVariants) return 'full-rtp-variants';
  if (reason.value === 'volatility' && facts.hasNormalizedVolatility) return 'core-volatility';
  if (reason.value === 'volatility' && !facts.hasNormalizedVolatility && facts.hasOriginalVolatility) return 'full-volatility';
  if (reason.value === 'max-win' && facts.hasMaxWin) return 'core-max-win';
  return undefined;
}

export function buildGameDetailKnowledgePresentation(
  matches: RelatedGuideMatch[],
  facts: GameDetailKnowledgeFacts,
): GameDetailKnowledgePresentation {
  const fieldGuides: GameDetailKnowledgePresentation['fieldGuides'] = {};
  const featureGuides: GameDetailKnowledgeItem[] = [];
  const usedGuideSlugs = new Set<string>();

  for (const match of matches) {
    if (usedGuideSlugs.has(match.guide.slug)) continue;

    let placed = false;
    for (const type of reasonPriority) {
      const reasons = match.reasons.filter((reason) => reason.type === type);
      if (reasons.length === 0) continue;

      if (type === 'feature') {
        featureGuides.push({ ...match, displayReasons: reasons });
        placed = true;
        break;
      }

      const placement = reasons
        .map((reason) => fieldPlacementForReason(reason, facts))
        .find((value): value is GameDetailFieldPlacement => Boolean(value));
      if (!placement) continue;

      (fieldGuides[placement] ??= []).push({ ...match, displayReasons: reasons });
      placed = true;
      break;
    }

    if (placed) usedGuideSlugs.add(match.guide.slug);
  }

  return {
    fieldGuides,
    featureGuides: {
      direct: featureGuides.slice(0, GAME_DETAIL_DIRECT_FEATURE_GUIDE_LIMIT),
      overflow: featureGuides.slice(GAME_DETAIL_DIRECT_FEATURE_GUIDE_LIMIT),
    },
    allGuideSlugs: [...usedGuideSlugs],
  };
}
