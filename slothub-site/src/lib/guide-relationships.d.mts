import type { GameCatalogItem } from './game-catalog';

export type RelationshipType = 'mechanism' | 'feature' | 'data-topic';
export type GuideRelationshipDeclaration = {
  slug: string;
  title: string;
  description: string;
  url: string;
  status?: 'draft' | 'published';
  relatedMechanisms?: string[];
  relatedFeatures?: string[];
  relatedDataTopics?: string[];
};
export type RelationshipReason = { type: RelationshipType; value: string };
export type RelatedGuideMatch = { guide: GuideRelationshipDeclaration; priority: number; reasons: RelationshipReason[] };
export type GuideRelationshipIndex = {
  guides: GuideRelationshipDeclaration[];
  mechanismToGuides: Record<string, GuideRelationshipDeclaration[]>;
  featureToGuides: Record<string, GuideRelationshipDeclaration[]>;
  dataTopicToGuides: Record<string, GuideRelationshipDeclaration[]>;
  gameToGuides: Record<string, RelatedGuideMatch[]>;
  guideToGames: Record<string, GameCatalogItem[]>;
};

export const GUIDE_DATA_TOPICS: readonly ['rtp', 'rtp-variants', 'volatility', 'max-win'];
export function dataTopicsForGame(game: GameCatalogItem): string[];
export function validateGuideDeclarations(guides: GuideRelationshipDeclaration[], options: { mechanisms: string[]; features: string[]; dataTopics?: readonly string[] }): true;
export function buildGuideRelationshipIndex(guides: GuideRelationshipDeclaration[], games: GameCatalogItem[], options: { mechanisms: string[]; features: string[]; dataTopics?: readonly string[] }): GuideRelationshipIndex;
