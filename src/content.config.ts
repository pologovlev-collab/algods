import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const learningBlockBase = {
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  placement: z.enum(['before-content', 'after-content']),
  title: z.string().min(4),
  body: z.string().min(12),
};

const learningBlockSchema = z.discriminatedUnion('type', [
  z.object({
    ...learningBlockBase,
    type: z.literal('mental-model'),
    items: z.array(z.object({ label: z.string().min(1), detail: z.string().min(4) })).min(2),
  }),
  z.object({
    ...learningBlockBase,
    type: z.literal('prediction'),
    question: z.string().min(8),
    choices: z.array(z.object({
      id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      label: z.string().min(1),
      correct: z.boolean(),
      feedback: z.string().min(8),
    })).min(2),
  }).refine(
    ({ choices }) => choices.filter(({ correct }) => correct).length === 1,
    { message: 'Prediction blocks require exactly one correct choice.', path: ['choices'] },
  ),
  z.object({
    ...learningBlockBase,
    type: z.literal('trace'),
    steps: z.array(z.object({
      label: z.string().min(1),
      state: z.string().min(1),
      explanation: z.string().min(8),
    })).min(2),
  }),
  z.object({
    ...learningBlockBase,
    type: z.literal('complexity'),
    steps: z.array(z.object({ label: z.string().min(1), detail: z.string().min(8) })).min(2),
    result: z.string().min(4),
  }),
  z.object({
    ...learningBlockBase,
    type: z.literal('mistake'),
    wrong: z.string().min(4),
    why: z.string().min(8),
    fix: z.string().min(8),
  }),
  z.object({
    ...learningBlockBase,
    type: z.literal('choose'),
    useWhen: z.array(z.string().min(6)).min(1),
    avoidWhen: z.array(z.string().min(6)).min(1),
  }),
]);

const lessons = defineCollection({
  loader: glob({ base: './src/content/lessons', pattern: '**/*.md' }),
  schema: z.object({
    id: z.string().regex(/^s\d{2}-l\d{2}$/),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(5),
    stage: z.number().int().min(0).max(20),
    order: z.number().int().positive(),
    prerequisites: z.array(z.string()),
    core: z.literal(true),
    patterns: z.array(z.string()).min(1),
    summary: z.string().min(20),
    outcomes: z.array(z.string().min(8)).min(2),
    practice: z.object({
      miniChecks: z.number().int().min(2),
      guidedExercises: z.number().int().min(1),
      independentExercises: z.number().int().min(0),
    }),
    learningBlocks: z.array(learningBlockSchema).max(4).optional(),
  }),
});

export const collections = { lessons };
