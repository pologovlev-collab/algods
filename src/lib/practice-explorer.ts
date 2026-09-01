import type { LeetCode75Group, PracticeMode } from '../data/leetcode75';
import type { SupplementaryProblem } from '../data/supplementary-practice';

export type PracticeProviderId = 'leetcode' | 'coderun';

export interface PracticeExplorerProblem {
  progressId: string;
  providerId: PracticeProviderId;
  provider: 'LeetCode' | 'CodeRun';
  id: string;
  title: string;
  url: string;
  verifiedAt: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  primaryPattern: string;
  secondaryPatterns: string[];
  prerequisiteLessonIds: string[];
  recommendedStage: number;
  practiceMode: PracticeMode;
  learningNoteRu: string;
  officialGroup: string;
  officialGroupOrder: number;
  officialOrder: number;
  searchText: string;
}

const searchableText = (
  id: string,
  title: string,
  primaryPattern: string,
  secondaryPatterns: readonly string[],
): string => `${id} ${title} ${primaryPattern} ${secondaryPatterns.join(' ')}`.toLocaleLowerCase('ru');

export function buildPracticeExplorerProblems(
  groups: readonly LeetCode75Group[],
  supplementary: readonly SupplementaryProblem[] = [],
): PracticeExplorerProblem[] {
  const leetcode = groups.flatMap(({ problems }) => problems).map((problem) => ({
    progressId: `leetcode:${problem.id}`,
    providerId: 'leetcode' as const,
    provider: problem.provider,
    id: problem.id,
    title: problem.title,
    url: problem.url,
    verifiedAt: problem.verifiedAt,
    difficulty: problem.difficulty,
    primaryPattern: problem.primaryPattern,
    secondaryPatterns: [...problem.secondaryPatterns],
    prerequisiteLessonIds: [...problem.prerequisiteLessonIds],
    recommendedStage: problem.recommendedStage,
    practiceMode: problem.practiceMode,
    learningNoteRu: problem.learningNoteRu,
    officialGroup: problem.officialGroup,
    officialGroupOrder: problem.officialGroupOrder,
    officialOrder: problem.officialOrder,
    searchText: searchableText(
      problem.id,
      problem.title,
      problem.primaryPattern,
      problem.secondaryPatterns,
    ),
  }));

  const coderun = supplementary.map((problem, index) => ({
    progressId: `coderun:${problem.id}`,
    providerId: 'coderun' as const,
    provider: problem.provider,
    id: String(problem.id),
    title: problem.title,
    url: problem.url,
    verifiedAt: problem.verifiedAt,
    difficulty: problem.difficulty,
    primaryPattern: problem.primaryPattern,
    secondaryPatterns: [],
    prerequisiteLessonIds: [...problem.prerequisiteLessonIds],
    recommendedStage: problem.recommendedStage,
    practiceMode: problem.practiceMode,
    learningNoteRu: problem.learningNoteRu,
    officialGroup: 'CodeRun',
    officialGroupOrder: Number.MAX_SAFE_INTEGER,
    officialOrder: leetcode.length + index + 1,
    searchText: searchableText(String(problem.id), problem.title, problem.primaryPattern, []),
  }));

  return [...leetcode, ...coderun];
}
