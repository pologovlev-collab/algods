import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

import { practiceTasks } from '../data/practice';
import { stages } from '../data/stages';
import { sortLessons } from '../lib/content';
import { buildReferenceEntries } from '../lib/reference';
import { buildSearchIndex } from '../lib/search-index';

export const GET: APIRoute = async () => {
  const lessons = sortLessons(await getCollection('lessons')).map(({ data }) => data);
  const references = buildReferenceEntries(lessons);
  const entries = buildSearchIndex({
    lessons,
    stages,
    references,
    practiceTasks,
  });

  return new Response(JSON.stringify(entries), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
