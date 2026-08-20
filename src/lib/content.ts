import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export interface LessonData {
  id: string;
  slug: string;
  title: string;
  stage: number;
  order: number;
  prerequisites: string[];
  core: true;
  patterns: string[];
  summary: string;
  outcomes: string[];
  practice: {
    miniChecks: number;
    guidedExercises: number;
    independentExercises: number;
  };
}

export interface LessonDocument {
  filePath: string;
  data: LessonData;
  body: string;
}

export function parseLessonSource(source: string, filePath = '<memory>'): LessonDocument {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`${filePath}: expected JSON frontmatter between --- lines`);

  const frontmatter = match[1];
  const body = match[2];
  if (frontmatter === undefined || body === undefined) {
    throw new Error(`${filePath}: incomplete frontmatter match`);
  }

  let data: LessonData;
  try {
    data = JSON.parse(frontmatter) as LessonData;
  } catch (error) {
    throw new Error(`${filePath}: invalid JSON frontmatter: ${(error as Error).message}`);
  }
  return { filePath, data, body };
}

export async function readLessonDocuments(directory: URL | string): Promise<LessonDocument[]> {
  const root = directory instanceof URL ? fileURLToPath(directory) : directory;
  const entries = await readdir(root, { withFileTypes: true, recursive: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => path.join(entry.parentPath ?? root, entry.name));

  return Promise.all(
    files.map(async (filePath) => parseLessonSource(await readFile(filePath, 'utf8'), filePath)),
  );
}

export function sortLessons<T extends { data: Pick<LessonData, 'stage' | 'order' | 'id'> }>(
  lessons: readonly T[],
): T[] {
  return [...lessons].sort(
    (a, b) => a.data.stage - b.data.stage || a.data.order - b.data.order || a.data.id.localeCompare(b.data.id),
  );
}

export function getReadyLessonIds(
  lessons: readonly LessonDocument[],
  completed: ReadonlySet<string>,
): string[] {
  return sortLessons(lessons)
    .filter(({ data }) => !completed.has(data.id) && data.prerequisites.every((id) => completed.has(id)))
    .map(({ data }) => data.id);
}
