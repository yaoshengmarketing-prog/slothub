const punctuation = /[\p{P}\p{S}\s]+/gu;

export function normalizeSearch(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .toLocaleLowerCase('zh-Hant-TW')
    .replace(/[\p{P}\p{S}]+/gu, ' ')
    .split(/\s+/)
    .filter((token) => token && token !== 'of')
    .join('')
    .replace(punctuation, '');
}

function distance(a, b) {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[b.length];
}

function fuzzyMatch(query, candidate) {
  if (query.length < 5 || candidate.length < 5) return false;
  const latin = /^[a-z0-9]+$/.test(query);
  const allowance = latin && Math.max(query.length, candidate.length) >= 10 ? 2 : 1;
  return Math.abs(query.length - candidate.length) <= allowance && distance(query, candidate) <= allowance;
}

function scoreItem(item, query) {
  const names = [item.title, item.secondaryTitle].filter(Boolean).map(normalizeSearch);
  const aliases = (item.aliases ?? []).map(normalizeSearch);
  const supporting = [item.providerName, item.seriesName, ...(item.searchText ?? [])].filter(Boolean).map(normalizeSearch);
  if (names.includes(query)) return 0;
  if (aliases.includes(query)) return 1;
  if ([...names, ...aliases].some((value) => value.startsWith(query))) return 2;
  if ([...names, ...aliases].some((value) => value.includes(query))) return 3;
  if (supporting.some((value) => value.includes(query))) return 4;
  if ([...names, ...aliases].some((value) => fuzzyMatch(query, value))) return 5;
  return Number.POSITIVE_INFINITY;
}

export function rankSearch(items, rawQuery, limit = 8) {
  const query = normalizeSearch(rawQuery);
  if (!query) return [];
  return items
    .map((item, index) => ({ item, index, score: scoreItem(item, query) }))
    .filter(({ score }) => Number.isFinite(score))
    .sort((a, b) => a.score - b.score || normalizeSearch(a.item.title).length - normalizeSearch(b.item.title).length || a.index - b.index)
    .slice(0, limit)
    .map(({ item }) => item);
}
