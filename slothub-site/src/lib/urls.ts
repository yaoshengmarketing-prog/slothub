import { SITE } from '../consts';

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
export const gamesIndexUrl = () => '/games/';
export const gameUrl = (slug: string) => `/games/${slugSegment(slug)}/`;
export const providersIndexUrl = () => '/providers/';
export const providerUrl = (slug: string) => `/providers/${slugSegment(slug)}/`;
export const toolsIndexUrl = () => '/tools/';
export const toolUrl = (slug: string) => `/tools/${slugSegment(slug)}/`;
export const slotsUrl = () => '/slots/';
export const fishingGamesUrl = () => '/fishing-games/';
export const rouletteUrl = () => '/roulette/';
export const rankingsUrl = () => '/rankings/';
export const searchUrl = (query?: string) =>
  query ? `/search/?q=${encodeURIComponent(query)}` : '/search/';
export const compareUrl = (slugs: string[] = []) => {
  const clean = [...new Set(slugs.map(slugSegment))].slice(0, 3);
  return clean.length ? `/compare/?games=${clean.join(',')}` : '/compare/';
};

export const absoluteUrl = (path: string) => new URL(path, SITE.origin).href;
