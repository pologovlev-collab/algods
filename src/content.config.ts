import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

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
  }),
});

export const collections = { lessons };
