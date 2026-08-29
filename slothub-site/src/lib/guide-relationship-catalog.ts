import { getCollection, type CollectionEntry } from 'astro:content';
import { buildGuideRelationshipIndex, GUIDE_DATA_TOPICS, type GuideRelationshipIndex, type RelationshipType } from './guide-relationships.mjs';
import { loadPublishedGameCatalog, type GameCatalogItem } from './game-catalog';
import { dataTopicLabels, dataTopicSearchTerms, featureLabels, featureSearchTerms, winMechanismLabels, winMechanismSearchTerms } from './taxonomy';
import { gamesIndexUrl, guideUrl } from './urls';
import type { SearchItem } from './search.js';
export { buildGameDetailKnowledgePresentation } from './game-detail-knowledge-presentation';
export type { GameDetailFieldPlacement, GameDetailKnowledgePresentation } from './game-detail-knowledge-presentation';

export type ExplorerGuideLink = {
  type: 'mechanism' | 'feature';
  value: string;
  label: string;
  guideTitle: string;
  guideUrl: string;
};

const relationshipOptions = {
  mechanisms: Object.keys(winMechanismLabels),
  features: Object.keys(featureLabels),
  dataTopics: GUIDE_DATA_TOPICS,
};

function normalizeGuides(guides: CollectionEntry<'guides'>[]) {
  return guides.map((guide) => ({
    slug: guide.id,
    title: guide.data.title,
    description: guide.data.description,
    url: guideUrl(guide.id),
    status: guide.data.status,
    relatedMechanisms: guide.data.relatedMechanisms,
    relatedFeatures: guide.data.relatedFeatures,
    relatedDataTopics: guide.data.relatedDataTopics,
  }));
}

export function createGuideRelationshipIndex(guides: CollectionEntry<'guides'>[], games: GameCatalogItem[]) {
  return buildGuideRelationshipIndex(normalizeGuides(guides), games, relationshipOptions);
}

export async function loadGuideRelationshipIndex() {
  const [guides, catalog] = await Promise.all([getCollection('guides'), loadPublishedGameCatalog()]);
  return createGuideRelationshipIndex(guides, catalog.games);
}

function conceptLabel(type: RelationshipType, value: string) {
  if (type === 'mechanism') return winMechanismLabels[value] ?? value;
  if (type === 'feature') return featureLabels[value] ?? value;
  return dataTopicLabels[value] ?? value;
}

function conceptTerms(type: RelationshipType, value: string) {
  if (type === 'mechanism') return winMechanismSearchTerms[value] ?? [conceptLabel(type, value)];
  if (type === 'feature') return featureSearchTerms[value] ?? [conceptLabel(type, value)];
  return dataTopicSearchTerms[value] ?? [conceptLabel(type, value)];
}

export function conceptExplorerUrl(type: RelationshipType, value: string) {
  if (type === 'mechanism') return gamesIndexUrl({ mechanism: value });
  if (type === 'feature') return gamesIndexUrl({ features: [value] });
  return null;
}

export function guideConceptLinks(index: GuideRelationshipIndex, guideSlug: string) {
  const guide = index.guides.find((item) => item.slug === guideSlug);
  if (!guide) return [];
  return [
    ...(guide.relatedMechanisms ?? []).map((value) => ({ type: 'mechanism' as const, value })),
    ...(guide.relatedDataTopics ?? []).map((value) => ({ type: 'data-topic' as const, value })),
    ...(guide.relatedFeatures ?? []).map((value) => ({ type: 'feature' as const, value })),
  ].flatMap(({ type, value }) => {
    const href = conceptExplorerUrl(type, value);
    return href ? [{ type, value, label: conceptLabel(type, value), href }] : [];
  });
}

export function explorerGuideLinks(index: GuideRelationshipIndex): ExplorerGuideLink[] {
  return [
    ...Object.entries(index.mechanismToGuides).flatMap(([value, guides]) => guides.map((guide) => ({ type: 'mechanism' as const, value, label: conceptLabel('mechanism', value), guideTitle: guide.title, guideUrl: guide.url }))),
    ...Object.entries(index.featureToGuides).flatMap(([value, guides]) => guides.map((guide) => ({ type: 'feature' as const, value, label: conceptLabel('feature', value), guideTitle: guide.title, guideUrl: guide.url }))),
  ];
}

export function relationshipSearchItems(index: GuideRelationshipIndex): SearchItem[] {
  const concepts = [
    ...Object.entries(index.mechanismToGuides).flatMap(([value, guides]) => guides.map((guide) => ({ type: 'mechanism' as const, value, guide }))),
    ...Object.entries(index.featureToGuides).flatMap(([value, guides]) => guides.map((guide) => ({ type: 'feature' as const, value, guide }))),
    ...Object.entries(index.dataTopicToGuides).flatMap(([value, guides]) => guides.map((guide) => ({ type: 'data-topic' as const, value, guide }))),
  ];
  return concepts.flatMap(({ type, value, guide }) => {
    const label = conceptLabel(type, value);
    const aliases = conceptTerms(type, value);
    const learnItem = { slug: `learn-${type}-${value}-${guide.slug}`, title: label, description: guide.title, kind: '了解概念' as const, url: guide.url, aliases, searchText: [guide.description] };
    const explorerUrl = conceptExplorerUrl(type, value);
    return explorerUrl ? [
      learnItem,
      { slug: `explore-${type}-${value}-${guide.slug}`, title: label, description: `查看具有「${label}」資料的遊戲`, kind: '探索遊戲' as const, url: explorerUrl, aliases, searchText: [`${label} 遊戲`] },
    ] : [learnItem];
  });
}

export function relationshipLabel(type: RelationshipType, value: string) {
  return conceptLabel(type, value);
}
