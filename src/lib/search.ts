export interface SearchEntry {
  href: string;
  title: string;
  context: string;
}

const normalizeSearchText = (value: string): string =>
  value
    .toLocaleLowerCase('ru')
    .replaceAll('ё', 'е')
    .replace(/\s+/g, ' ')
    .trim();

export function filterSearchEntries<T extends SearchEntry>(
  entries: readonly T[],
  query: string,
  limit = 8,
): T[] {
  const tokens = normalizeSearchText(query).split(' ').filter(Boolean);
  if (tokens.length === 0 || limit < 1) return [];

  return entries
    .filter((entry) => {
      const haystack = normalizeSearchText(`${entry.title} ${entry.context}`);
      return tokens.every((token) => haystack.includes(token));
    })
    .slice(0, limit);
}
