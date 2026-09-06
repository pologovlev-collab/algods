import { describe, expect, it } from 'vitest';

import {
  assertValidLearningBlocks,
  evaluatePrediction,
  type PredictionLearningBlock,
} from '../src/lib/learning-blocks';
import { readLessonDocuments } from '../src/lib/content';

const lessonDirectory = new URL('../src/content/lessons/', import.meta.url);

describe('active-learning blocks', () => {
  it('evaluates a prediction with specific, non-shaming feedback', () => {
    const block: PredictionLearningBlock = {
      id: 'pointer-choice',
      type: 'prediction',
      placement: 'before-content',
      title: 'Какой указатель сдвинуть?',
      body: 'Сумма меньше цели.',
      question: 'Какой шаг сохраняет возможность найти ответ?',
      choices: [
        { id: 'left', label: 'Сдвинуть left', correct: true, feedback: 'Верно: сумма может только вырасти.' },
        { id: 'right', label: 'Сдвинуть right', correct: false, feedback: 'Так сумма уменьшится ещё сильнее.' },
      ],
    };

    expect(evaluatePrediction(block, 'left')).toEqual({
      correct: true,
      feedback: 'Верно: сумма может только вырасти.',
    });
    expect(evaluatePrediction(block, 'right')).toEqual({
      correct: false,
      feedback: 'Так сумма уменьшится ещё сильнее.',
    });
    expect(evaluatePrediction(block, 'missing')).toBeNull();
  });

  it('rejects ambiguous predictions and duplicate block IDs', () => {
    expect(() => assertValidLearningBlocks([
      {
        id: 'ambiguous',
        type: 'prediction',
        placement: 'after-content',
        title: 'Проверка',
        body: 'Выберите ответ.',
        question: 'Что произойдёт?',
        choices: [
          { id: 'a', label: 'A', correct: true, feedback: 'A' },
          { id: 'b', label: 'B', correct: true, feedback: 'B' },
        ],
      },
    ])).toThrow(/exactly one correct choice/);

    expect(() => assertValidLearningBlocks([
      { id: 'same', type: 'mental-model', placement: 'before-content', title: 'A', body: 'A', items: [{ label: 'A', detail: 'A' }] },
      { id: 'same', type: 'mental-model', placement: 'after-content', title: 'B', body: 'B', items: [{ label: 'B', detail: 'B' }] },
    ])).toThrow(/duplicate block same/);
  });

  it('uses the six-block vocabulary selectively across representative lessons', async () => {
    const lessons = await readLessonDocuments(lessonDirectory);
    const upgradedLessons = lessons.filter(({ data }) => (data.learningBlocks?.length ?? 0) > 0);
    const blocks = upgradedLessons.flatMap(({ data }) => data.learningBlocks ?? []);

    expect(upgradedLessons.length).toBeGreaterThanOrEqual(8);
    expect(upgradedLessons.length).toBeLessThanOrEqual(14);
    expect(new Set(blocks.map(({ type }) => type))).toEqual(new Set([
      'mental-model',
      'prediction',
      'trace',
      'complexity',
      'mistake',
      'choose',
    ]));
    for (const { data } of upgradedLessons) expect(() => assertValidLearningBlocks(data.learningBlocks ?? [])).not.toThrow();
  });
});
