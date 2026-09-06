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

export const CODERUN_PROGRESS_IDS = practiceTasks
  .filter(({ provider }) => provider === 'coderun')
  .map(({ id }) => id);

/**
 * Codewars kata removed during curation can still occur in existing v2 saves.
 * They remain valid schema IDs even though the catalogue no longer renders them.
 */
export const RETIRED_CODEWARS_PROGRESS_IDS = [
  'codewars:5168bb5dfe9a00b126000018',
  'codewars:5715eaedb436cf5606000381',
  'codewars:55a2d7ebe362935a210000b2',
  'codewars:54edbc7200b811e956000556',
  'codewars:515e271a311df0350d00000f',
  'codewars:57a0e5c372292dd76d000d7e',
  'codewars:54ff3102c1bad923760001f3',
  'codewars:554b4ac871d6813a03000035',
  'codewars:56747fd5cb988479af000028',
  'codewars:56269eb78ad2e4ced1000013',
  'codewars:5467e4d82edf8bbf40000155',
  'codewars:57cebe1dc6fdc20c57000ac9',
  'codewars:563b662a59afc2b5120000c6',
  'codewars:578aa45ee9fd15ff4600090d',
  'codewars:545cedaa9943f7fe7b000048',
  'codewars:5541f58a944b85ce6d00006a',
  'codewars:541c8630095125aba6000c00',
  'codewars:55bf01e5a717a0d57e0000ec',
  'codewars:530e15517bc88ac656000716',
  'codewars:520b9d2ad5c005041100000f',
] as const;

export const CORE_LESSON_ID_SET: ReadonlySet<string> = new Set(CORE_LESSON_IDS);
export const LEETCODE_75_PROGRESS_ID_SET: ReadonlySet<string> = new Set(
  LEETCODE_75_PROGRESS_IDS,
);
export const CODERUN_PROGRESS_ID_SET: ReadonlySet<string> = new Set(
  CODERUN_PROGRESS_IDS,
);
export const KNOWN_PROBLEM_ID_SET: ReadonlySet<string> = new Set(
  [
    ...practiceTasks.map(({ id }) => id),
    ...RETIRED_CODEWARS_PROGRESS_IDS,
  ],
);
