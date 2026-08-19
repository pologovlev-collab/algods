import { describe, expect, it } from 'vitest';

import {
  LEETCODE_75_PROVENANCE,
  leetcode75Groups,
  leetcode75Problems,
} from '../src/data/leetcode75';

const expectedLessonIds = new Set([
  's00-l01',
  's00-l02',
  's00-l03',
  's01-l01',
  's01-l02',
  's02-l01',
  's02-l02',
  's02-l03',
  's03-l01',
  's03-l02',
  's04-l01',
  's04-l02',
  's05-l01',
  's05-l02',
  's06-l01',
  's06-l02',
  's06-l03',
  's07-l01',
  's07-l02',
  's07-l03',
  's08-l01',
  's08-l02',
  's08-l03',
  's09-l01',
  's09-l02',
  's10-l01',
  's10-l02',
  's10-l03',
  's10-l04',
  's11-l01',
  's11-l02',
  's12-l01',
  's12-l02',
  's13-l01',
  's13-l02',
  's13-l03',
  's13-l04',
  's13-l05',
  's13-l06',
  's14-l01',
  's14-l02',
  's15-l01',
  's15-l02',
  's15-l03',
  's15-l04',
  's16-l01',
  's16-l02',
  's17-l01',
  's18-l01',
  's18-l02',
  's19-l01',
  's19-l02',
  's20-l01',
  's20-l02',
]);

const expectedGroups = [
  ['Array / String', 9],
  ['Two Pointers', 4],
  ['Sliding Window', 4],
  ['Prefix Sum', 2],
  ['Hash Map / Set', 4],
  ['Stack', 3],
  ['Queue', 2],
  ['Linked List', 4],
  ['Binary Tree - DFS', 6],
  ['Binary Tree - BFS', 2],
  ['Binary Search Tree', 2],
  ['Graphs - DFS', 4],
  ['Graphs - BFS', 2],
  ['Heap / Priority Queue', 4],
  ['Binary Search', 4],
  ['Backtracking', 2],
  ['DP - 1D', 4],
  ['DP - Multidimensional', 4],
  ['Bit Manipulation', 3],
  ['Trie', 2],
  ['Intervals', 2],
  ['Monotonic Stack', 2],
] as const;

describe('LeetCode 75 provenance', () => {
  it('records the live verification date and official source URLs', () => {
    expect(LEETCODE_75_PROVENANCE).toEqual({
      verifiedAt: '2026-08-20',
      sourceUrls: [
        'https://leetcode.com/studyplan/leetcode-75/',
        'https://leetcode.com/graphql/',
      ],
    });
  });
});

describe('LeetCode 75 official dataset', () => {
  it('contains exactly 75 unique frontend IDs and slugs', () => {
    expect(leetcode75Problems).toHaveLength(75);
    expect(new Set(leetcode75Problems.map(({ id }) => id)).size).toBe(75);
    expect(new Set(leetcode75Problems.map(({ slug }) => slug)).size).toBe(75);
  });

  it('derives every canonical URL from the official slug', () => {
    for (const problem of leetcode75Problems) {
      expect(problem.url).toBe(`https://leetcode.com/problems/${problem.slug}/`);
    }
  });

  it('preserves the exact official group order and problem counts', () => {
    expect(leetcode75Groups).toHaveLength(22);
    expect(leetcode75Groups.map(({ name, problems }) => [name, problems.length])).toEqual(
      expectedGroups,
    );
    expect(leetcode75Groups.map(({ order }) => order)).toEqual(
      Array.from({ length: 22 }, (_, index) => index + 1),
    );
  });

  it('preserves global and within-group official order metadata', () => {
    let expectedGlobalOrder = 1;

    leetcode75Groups.forEach((group, groupIndex) => {
      group.problems.forEach((problem, problemIndex) => {
        expect(problem.officialGroup).toBe(group.name);
        expect(problem.officialGroupOrder).toBe(groupIndex + 1);
        expect(problem.officialOrderInGroup).toBe(problemIndex + 1);
        expect(problem.officialOrder).toBe(expectedGlobalOrder);
        expectedGlobalOrder += 1;
      });
    });
  });

  it('contains the official difficulty distribution', () => {
    const counts = leetcode75Problems.reduce<Record<string, number>>((result, problem) => {
      result[problem.difficulty] = (result[problem.difficulty] ?? 0) + 1;
      return result;
    }, {});

    expect(counts).toEqual({ Easy: 22, Medium: 53 });
    expect(counts.Hard ?? 0).toBe(0);
  });

  it('starts and ends with the official first and last problems', () => {
    expect(leetcode75Problems[0]?.id).toBe('1768');
    expect(leetcode75Problems.at(-1)?.id).toBe('901');
  });

  it('uses valid course stages, practice modes, patterns, and lesson references', () => {
    const practiceModes = new Set(['guided', 'transfer', 'independent']);

    for (const problem of leetcode75Problems) {
      expect(problem.recommendedStage).toBeGreaterThanOrEqual(0);
      expect(problem.recommendedStage).toBeLessThanOrEqual(20);
      expect(practiceModes.has(problem.practiceMode)).toBe(true);
      expect(problem.primaryPattern.trim().length).toBeGreaterThan(0);
      expect(new Set(problem.secondaryPatterns).size).toBe(problem.secondaryPatterns.length);
      expect(problem.prerequisiteLessonIds.length).toBeGreaterThan(0);

      for (const lessonId of problem.prerequisiteLessonIds) {
        expect(lessonId).toMatch(/^s(?:0\d|1\d|20)-l\d{2}$/);
        expect(expectedLessonIds.has(lessonId)).toBe(true);
      }
    }
  });

  it('provides an original concise Russian learning note without company metadata', () => {
    for (const problem of leetcode75Problems) {
      expect(problem.learningNoteRu).toMatch(/[А-Яа-яЁё]/);
      expect(problem.learningNoteRu.length).toBeGreaterThanOrEqual(20);
      expect(problem.learningNoteRu.length).toBeLessThanOrEqual(180);
      expect('company' in problem).toBe(false);
      expect('companies' in problem).toBe(false);
    }
  });
});
