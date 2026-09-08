import type { GameCatalogItem } from './game-catalog';

export type ExplorerSort = 'relevance' | 'name-asc' | 'rtp-desc' | 'rtp-asc' | 'max-win-desc' | 'max-win-asc';
export type ExplorerState = {
  q: string;
  provider: string;
  primaryType: string;
  subtype: string;
  mechanism: string;
  features: string[];
  rtpMin?: number;
  volatility: string;
  maxWinMin?: number;
  sort: ExplorerSort;
};

export const RTP_THRESHOLDS: number[];
export const MAX_WIN_THRESHOLDS: number[];
export const SORT_VALUES: ExplorerSort[];
export function emptyExplorerState(): ExplorerState;
export function explorerOptions(games: GameCatalogItem[]): {
  providers: Set<string>; primaryTypes: Set<string>; subtypes: Set<string>;
  mechanisms: Set<string>; features: Set<string>; volatilities: Set<string>;
};
export function parseExplorerState(input: string | URLSearchParams, games: GameCatalogItem[]): ExplorerState;
export function serializeExplorerState(state: ExplorerState): string;
export function filterAndSortGames(games: GameCatalogItem[], state: ExplorerState): GameCatalogItem[];
export function hasExplorerFilters(state: ExplorerState): boolean;
export function featureResultCount(games: GameCatalogItem[], state: ExplorerState, feature: string): number;
export type ZeroResultRecoveryOption = {
  field: 'q' | 'provider' | 'primaryType' | 'subtype' | 'mechanism' | 'feature' | 'rtpMin' | 'volatility' | 'maxWinMin';
  value: string | number;
  count: number;
  state: ExplorerState;
};
export function zeroResultRecoveryOptions(games: GameCatalogItem[], state: ExplorerState, limit?: number): ZeroResultRecoveryOption[];
