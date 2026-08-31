export const COMPARE_STORAGE_KEY = 'slothub-compare';

export function currentCanonicalUrl(locationLike) {
  return `${locationLike.pathname}${locationLike.search}`;
}

export function writeCanonicalHistory(browser, nextUrl, mode) {
  if (currentCanonicalUrl(browser.location) === nextUrl) return false;
  browser.history[mode === 'push' ? 'pushState' : 'replaceState'](browser.history.state, '', nextUrl);
  return true;
}

export function readSearchQuery(input) {
  const params = input instanceof URLSearchParams ? input : new URLSearchParams(String(input).replace(/^\?/, ''));
  return params.getAll('q').map((value) => value.trim()).find(Boolean) ?? '';
}

export function searchStateUrl(query) {
  const clean = String(query ?? '').trim();
  return clean ? `/search/?q=${encodeURIComponent(clean)}` : '/search/';
}

export function normalizeCompareSlugs(values, validSlugs) {
  const valid = new Set(validSlugs);
  return [...new Set(Array.isArray(values) ? values.map((value) => String(value).trim()).filter(Boolean) : [])]
    .filter((slug) => valid.has(slug))
    .slice(0, 3);
}

export function readStoredCompare(raw, validSlugs) {
  try {
    return normalizeCompareSlugs(JSON.parse(raw || '[]'), validSlugs);
  } catch {
    return [];
  }
}

export function readCompareQuery(input, validSlugs) {
  const params = input instanceof URLSearchParams ? input : new URLSearchParams(String(input).replace(/^\?/, ''));
  return {
    hasGames: params.has('games'),
    slugs: normalizeCompareSlugs(params.getAll('games').flatMap((value) => value.split(',')), validSlugs),
  };
}

export function compareStateUrl(slugs) {
  return slugs.length ? `/compare/?games=${slugs.join(',')}` : '/compare/';
}
