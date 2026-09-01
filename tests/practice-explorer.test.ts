import { describe, expect, it } from 'vitest';

import { leetcode75Groups } from '../src/data/leetcode75';
import { supplementaryProblems } from '../src/data/supplementary-practice';
import { buildPracticeExplorerProblems } from '../src/lib/practice-explorer';

describe('master practice explorer model', () => {
  it('normalizes LeetCode and CodeRun into one filterable collection', () => {
    const problems = buildPracticeExplorerProblems(leetcode75Groups, supplementaryProblems);

    expect(problems).toHaveLength(81);
    expect(problems.filter(({ providerId }) => providerId === 'leetcode')).toHaveLength(75);
    expect(problems.filter(({ providerId }) => providerId === 'coderun')).toHaveLength(6);
    expect(new Set(problems.map(({ progressId }) => progressId)).size).toBe(81);
    expect(problems.every(({ searchText }) => searchText.length > 0)).toBe(true);
  });

  it('keeps the curated LeetCode collection unchanged when no additional source is supplied', () => {
    const problems = buildPracticeExplorerProblems(leetcode75Groups);

    expect(problems).toHaveLength(75);
    expect(new Set(problems.map(({ providerId }) => providerId))).toEqual(new Set(['leetcode']));
  });
});
