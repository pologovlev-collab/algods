import { practiceTasks } from './practice';
import { getPracticeCollection } from '../lib/practice';

export const CORE_LESSON_IDS = [
  's00-l01', 's00-l02', 's00-l03', 's01-l01', 's01-l02',
  's02-l01', 's02-l02', 's02-l03', 's03-l01', 's03-l02',
  's04-l01', 's04-l02', 's05-l01', 's05-l02', 's06-l01',
  's06-l02', 's06-l03', 's07-l01', 's07-l02', 's07-l03',
  's08-l01', 's08-l02', 's08-l03', 's09-l01', 's09-l02',
  's10-l01', 's10-l02', 's10-l03', 's10-l04', 's11-l01',
  's11-l02', 's12-l01', 's12-l02', 's13-l01', 's13-l02',
  's13-l03', 's13-l04', 's13-l05', 's13-l06', 's14-l01',
  's14-l02', 's15-l01', 's15-l02', 's15-l03', 's15-l04',
  's16-l01', 's16-l02', 's17-l01', 's18-l01', 's18-l02',
  's19-l01', 's19-l02', 's20-l01', 's20-l02',
] as const;

export const LEETCODE_75_PROGRESS_IDS = getPracticeCollection(practiceTasks, 'leetcode75')
  .map(({ id }) => id);

export const SUPPLEMENTARY_PROGRESS_IDS = practiceTasks
  .filter(({ provider }) => provider === 'coderun')
  .map(({ id }) => id);

export const CORE_LESSON_ID_SET: ReadonlySet<string> = new Set(CORE_LESSON_IDS);
export const LEETCODE_75_PROGRESS_ID_SET: ReadonlySet<string> = new Set(
  LEETCODE_75_PROGRESS_IDS,
);
export const SUPPLEMENTARY_PROGRESS_ID_SET: ReadonlySet<string> = new Set(
  SUPPLEMENTARY_PROGRESS_IDS,
);
export const KNOWN_PROBLEM_ID_SET: ReadonlySet<string> = new Set(
  practiceTasks.map(({ id }) => id),
);
