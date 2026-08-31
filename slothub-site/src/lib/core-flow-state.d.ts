export const COMPARE_STORAGE_KEY: 'slothub-compare';

export function currentCanonicalUrl(locationLike: Pick<Location, 'pathname' | 'search'>): string;
export function writeCanonicalHistory(
  browser: Pick<Window, 'history' | 'location'>,
  nextUrl: string,
  mode: 'push' | 'replace',
): boolean;
export function readSearchQuery(input: string | URLSearchParams): string;
export function searchStateUrl(query?: string): string;
export function normalizeCompareSlugs(values: unknown, validSlugs: string[]): string[];
export function readStoredCompare(raw: string | null | undefined, validSlugs: string[]): string[];
export function readCompareQuery(input: string | URLSearchParams, validSlugs: string[]): {
  hasGames: boolean;
  slugs: string[];
};
export function compareStateUrl(slugs: string[]): string;
