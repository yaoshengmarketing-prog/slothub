import { SITE } from '../consts';
import { compareStateUrl, searchStateUrl } from './core-flow-state.mjs';
import { emptyExplorerState, serializeExplorerState } from './game-explorer-state.mjs';
import type { ExplorerState } from './game-explorer-state.mjs';

const slugSegment = (slug: string) => {
  const value = slug.trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    throw new Error(`Invalid slug: ${slug}`);
  }
  return value;
};

export const homeUrl = () => '/';
export const guideIndexUrl = () => '/guide/';
export const guideUrl = (slug: string) => `/guide/${slugSegment(slug)}/`;
export const gamesIndexUrl = (filters?: Partial<ExplorerState>) => {
  if (!filters) return '/games/';
  const query = serializeExplorerState({ ...emptyExplorerState(), ...filters });
  return query ? `/games/?${query}` : '/games/';
};
export const gameUrl = (slug: string) => `/games/${slugSegment(slug)}/`;
export const providersIndexUrl = () => '/providers/';
export const providerUrl = (slug: string) => `/providers/${slugSegment(slug)}/`;
export const toolsIndexUrl = () => '/tools/';
export const toolUrl = (slug: string) => `/tools/${slugSegment(slug)}/`;
export const slotsUrl = () => '/slots/';
export const fishingGamesUrl = () => '/fishing-games/';
export const rouletteUrl = () => '/roulette/';
export const rankingsUrl = () => '/rankings/';
export const searchUrl = (query?: string) => searchStateUrl(query);
export const compareUrl = (slugs: string[] = []) => {
  const clean = [...new Set(slugs.map(slugSegment))].slice(0, 3);
  return compareStateUrl(clean);
};

export const absoluteUrl = (path: string) => new URL(path, SITE.origin).href;
