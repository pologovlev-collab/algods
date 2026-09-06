export type SearchEntryType = 'section' | 'stage' | 'lesson' | 'reference' | 'practice';

export interface SearchEntry {
  id: string;
  type: SearchEntryType;
  href: string;
  title: string;
  aliases: string[];
  topics: string[];
  context: string;
  sourceOrder: number;
}

export const normalizeSearchText = (value: string): string =>
  value
    .toLocaleLowerCase('ru')
    .replaceAll('ё', 'е')
    .replace(/[^\p{L}\p{N}+#]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const includesEveryToken = (value: string, tokens: readonly string[]): boolean =>
  tokens.every((token) => value.includes(token));

function getSearchScore(entry: SearchEntry, query: string, tokens: readonly string[]): number | undefined {
  const title = normalizeSearchText(entry.title);
  const aliases = entry.aliases.map(normalizeSearchText);
  const topics = entry.topics.map(normalizeSearchText);
  const titleAndAliases = [title, ...aliases].join(' ');
  const topicText = topics.join(' ');
  const context = normalizeSearchText(entry.context);

  if (title === query) return 0;
  if (aliases.includes(query)) return 1;
  if (title.startsWith(query)) return 2;
  if (aliases.some((alias) => alias.startsWith(query))) return 3;
  if (includesEveryToken(titleAndAliases, tokens)) return 4;
  if (includesEveryToken(topicText, tokens)) return entry.type === 'practice' ? 16 : 10;
  if (includesEveryToken(`${titleAndAliases} ${topicText}`, tokens)) return entry.type === 'practice' ? 17 : 11;
  if (includesEveryToken(context, tokens)) return entry.type === 'practice' ? 20 : 12;
  return undefined;
}

const typePriority: Record<SearchEntryType, number> = {
  reference: 0,
  lesson: 1,
  stage: 2,
  section: 3,
  practice: 4,
};

export function rankSearchEntries<T extends SearchEntry>(
  entries: readonly T[],
  rawQuery: string,
  limit = 8,
): T[] {
  const query = normalizeSearchText(rawQuery);
  const tokens = query.split(' ').filter(Boolean);
  if (tokens.length === 0 || limit < 1) return [];

  return entries
    .map((entry) => ({ entry, score: getSearchScore(entry, query, tokens) }))
    .filter((result): result is { entry: T; score: number } => result.score !== undefined)
    .sort((left, right) =>
      left.score - right.score
      || typePriority[left.entry.type] - typePriority[right.entry.type]
      || left.entry.sourceOrder - right.entry.sourceOrder
      || left.entry.id.localeCompare(right.entry.id, 'ru'))
    .slice(0, limit)
    .map(({ entry }) => entry);
}

export const filterSearchEntries = rankSearchEntries;
