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

export const LEGACY_CODEWARS_PROGRESS_IDS = [
  'codewars:5168bb5dfe9a00b126000018', 'codewars:5715eaedb436cf5606000381',
  'codewars:55a2d7ebe362935a210000b2', 'codewars:54edbc7200b811e956000556',
  'codewars:515e271a311df0350d00000f', 'codewars:57a0e5c372292dd76d000d7e',
  'codewars:54ff3102c1bad923760001f3', 'codewars:554b4ac871d6813a03000035',
  'codewars:56747fd5cb988479af000028', 'codewars:54ba84be607a92aa900000f1',
  'codewars:529eef7a9194e0cbc1000255', 'codewars:558fc85d8fd1938afb000014',
  'codewars:5656b6906de340bd1b0000ac', 'codewars:56269eb78ad2e4ced1000013',
  'codewars:5467e4d82edf8bbf40000155', 'codewars:57cebe1dc6fdc20c57000ac9',
  'codewars:563b662a59afc2b5120000c6', 'codewars:54da5a58ea159efa38000836',
  'codewars:54bf1c2cd5b56cc47f0007a1', 'codewars:54b42f9314d9229fd6000d9c',
  'codewars:578aa45ee9fd15ff4600090d', 'codewars:5277c8a221e209d3f6000b56',
  'codewars:54e6533c92449cc251001667', 'codewars:545cedaa9943f7fe7b000048',
  'codewars:52597aa56021e91c93000cb0', 'codewars:550f22f4d758534c1100025a',
  'codewars:5541f58a944b85ce6d00006a', 'codewars:541c8630095125aba6000c00',
  'codewars:55bf01e5a717a0d57e0000ec', 'codewars:530e15517bc88ac656000716',
  'codewars:520b9d2ad5c005041100000f', 'codewars:51ba717bb08c1cd60f00002f',
  'codewars:521c2db8ddc89b9b7a0000c1', 'codewars:5324945e2ece5e1f32000370',
] as const;

export const LEGACY_PRACTICE_PROGRESS_IDS = [
  ...LEGACY_LEETCODE_75_PROGRESS_IDS,
  ...LEGACY_CODERUN_PROGRESS_IDS,
  ...LEGACY_CODEWARS_PROGRESS_IDS,
] as const;
