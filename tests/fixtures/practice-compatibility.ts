/**
 * Frozen IDs from the progress schema that shipped before the normalized
 * practice catalogue. Keep this fixture independent from mutable task data so
 * accidental ID or collection-order changes cannot silently invalidate saves.
 */
export const LEGACY_LEETCODE_75_PROGRESS_IDS = [
  'leetcode:1768', 'leetcode:1071', 'leetcode:1431', 'leetcode:605',
  'leetcode:345', 'leetcode:151', 'leetcode:238', 'leetcode:334',
  'leetcode:443', 'leetcode:283', 'leetcode:392', 'leetcode:11',
  'leetcode:1679', 'leetcode:643', 'leetcode:1456', 'leetcode:1004',
  'leetcode:1493', 'leetcode:1732', 'leetcode:724', 'leetcode:2215',
  'leetcode:1207', 'leetcode:1657', 'leetcode:2352', 'leetcode:2390',
  'leetcode:735', 'leetcode:394', 'leetcode:933', 'leetcode:649',
  'leetcode:2095', 'leetcode:328', 'leetcode:206', 'leetcode:2130',
  'leetcode:104', 'leetcode:872', 'leetcode:1448', 'leetcode:437',
  'leetcode:1372', 'leetcode:236', 'leetcode:199', 'leetcode:1161',
  'leetcode:700', 'leetcode:450', 'leetcode:841', 'leetcode:547',
  'leetcode:1466', 'leetcode:399', 'leetcode:1926', 'leetcode:994',
  'leetcode:215', 'leetcode:2336', 'leetcode:2542', 'leetcode:2462',
  'leetcode:374', 'leetcode:2300', 'leetcode:162', 'leetcode:875',
  'leetcode:17', 'leetcode:216', 'leetcode:1137', 'leetcode:746',
  'leetcode:198', 'leetcode:790', 'leetcode:62', 'leetcode:1143',
  'leetcode:714', 'leetcode:72', 'leetcode:338', 'leetcode:136',
  'leetcode:1318', 'leetcode:208', 'leetcode:1268', 'leetcode:435',
  'leetcode:452', 'leetcode:739', 'leetcode:901',
] as const;

export const LEGACY_CODERUN_PROGRESS_IDS = [
  'coderun:20',
  'coderun:1',
  'coderun:8',
  'coderun:12',
  'coderun:10',
  'coderun:6',
] as const;

export const LEGACY_PRACTICE_PROGRESS_IDS = [
  ...LEGACY_LEETCODE_75_PROGRESS_IDS,
  ...LEGACY_CODERUN_PROGRESS_IDS,
] as const;
