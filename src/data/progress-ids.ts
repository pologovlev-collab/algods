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

export const LEETCODE_75_PROGRESS_IDS = [
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

export const SUPPLEMENTARY_PROGRESS_IDS = [
  'coderun:20',
  'coderun:1',
  'coderun:8',
  'coderun:12',
  'coderun:10',
  'coderun:6',
] as const;

export const CORE_LESSON_ID_SET: ReadonlySet<string> = new Set(CORE_LESSON_IDS);
export const LEETCODE_75_PROGRESS_ID_SET: ReadonlySet<string> = new Set(
  LEETCODE_75_PROGRESS_IDS,
);
export const SUPPLEMENTARY_PROGRESS_ID_SET: ReadonlySet<string> = new Set(
  SUPPLEMENTARY_PROGRESS_IDS,
);
export const KNOWN_PROBLEM_ID_SET: ReadonlySet<string> = new Set([
  ...LEETCODE_75_PROGRESS_IDS,
  ...SUPPLEMENTARY_PROGRESS_IDS,
]);
