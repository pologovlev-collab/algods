import type { KnowledgeMapGroupDefinition } from '../lib/knowledge-map';

export const knowledgeMapGroups: KnowledgeMapGroupDefinition[] = [
  {
    id: 'foundations',
    title: 'Основа',
    description: 'Сформировать способ рассуждения и рабочий набор языка.',
    stageIds: [0, 1],
  },
  {
    id: 'sequences',
    title: 'Массивы и последовательности',
    description: 'Научиться поддерживать состояние линейного фрагмента.',
    stageIds: [2, 3, 4, 5],
  },
  {
    id: 'order-and-linear-structures',
    title: 'Порядок и линейные структуры',
    description: 'Использовать порядок данных и ограничения интерфейса.',
    stageIds: [6, 7, 8, 9],
  },
  {
    id: 'trees-and-priority',
    title: 'Деревья и приоритет',
    description: 'Работать с иерархией и текущим экстремумом.',
    stageIds: [10, 11],
  },
  {
    id: 'search-and-choice',
    title: 'Перебор, графы и выбор',
    description: 'Исследовать пространство решений и доказывать выбор.',
    stageIds: [12, 13, 14],
  },
  {
    id: 'states-and-specialized-structures',
    title: 'Состояния и специальные структуры',
    description: 'Строить переходы и выбирать специализированное представление.',
    stageIds: [15, 16, 17, 18],
  },
  {
    id: 'synthesis',
    title: 'Синтез',
    description: 'Распознавать форму новой задачи и объяснять решение.',
    stageIds: [19, 20],
  },
];
