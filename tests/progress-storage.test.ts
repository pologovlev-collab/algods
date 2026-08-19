import { describe, expect, it } from 'vitest';

import { createDefaultProgress, recordLessonStatus } from '../src/lib/progress';
import {
  PROGRESS_STORAGE_KEY,
  importAndSaveProgress,
  loadProgress,
  resetProgress,
  saveProgress,
  type StorageLike,
} from '../src/lib/progress-storage';

class MemoryStorage implements StorageLike {
  readonly values = new Map<string, string>();
  readonly writes: Array<[string, string]> = [];

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
    this.writes.push([key, value]);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

const now = '2026-08-20T10:00:00.000Z';

describe('progress storage boundary', () => {
  it('returns a fresh default without writing when no saved state exists', () => {
    const storage = new MemoryStorage();

    expect(loadProgress(storage, now)).toEqual(createDefaultProgress());
    expect(storage.writes).toEqual([]);
  });

  it('migrates v1 and writes the current schema back once', () => {
    const storage = new MemoryStorage();
    storage.values.set(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({ version: 1, completedLessonIds: ['s00-l01'] }),
    );

    const loaded = loadProgress(storage, now);

    expect(loaded.lessons['s00-l01']).toEqual({ status: 'completed', updatedAt: now });
    expect(storage.writes).toHaveLength(1);
    const migrationWrite = storage.writes[0];
    expect(migrationWrite).toBeDefined();
    expect(JSON.parse(migrationWrite?.[1] ?? '{}').version).toBe(2);
  });

  it('recovers from malformed JSON without throwing or overwriting it', () => {
    const storage = new MemoryStorage();
    storage.values.set(PROGRESS_STORAGE_KEY, '{broken');

    expect(loadProgress(storage, now)).toEqual(createDefaultProgress());
    expect(storage.writes).toEqual([]);
  });

  it('preserves an invalid v1 payload instead of overwriting possible recovery data', () => {
    const storage = new MemoryStorage();
    storage.values.set(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({ version: 1, completedLessonIds: [42] }),
    );

    expect(loadProgress(storage, now)).toEqual(createDefaultProgress());
    expect(storage.writes).toEqual([]);
    expect(storage.values.get(PROGRESS_STORAGE_KEY)).toBe(
      JSON.stringify({ version: 1, completedLessonIds: [42] }),
    );
  });

  it('reports write failures and removes only the namespaced state on reset', () => {
    const storage = new MemoryStorage();
    storage.values.set(PROGRESS_STORAGE_KEY, '{}');
    storage.values.set('unrelated', 'keep');

    expect(saveProgress(storage, createDefaultProgress())).toBe(true);
    expect(resetProgress(storage)).toBe(true);
    expect(storage.values.has(PROGRESS_STORAGE_KEY)).toBe(false);
    expect(storage.values.get('unrelated')).toBe('keep');

    const failing: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota');
      },
      removeItem: () => {
        throw new Error('blocked');
      },
    };
    expect(saveProgress(failing, createDefaultProgress())).toBe(false);
    expect(resetProgress(failing)).toBe(false);
  });

  it('persists a valid import and refuses an invalid file', () => {
    const storage = new MemoryStorage();
    const completed = recordLessonStatus(
      createDefaultProgress(),
      's00-l01',
      'completed',
      now,
    );

    expect(importAndSaveProgress(storage, JSON.stringify(completed), now)).toEqual({
      ok: true,
      value: completed,
    });
    expect(storage.values.has(PROGRESS_STORAGE_KEY)).toBe(true);

    const before = storage.values.get(PROGRESS_STORAGE_KEY);
    expect(importAndSaveProgress(storage, '{broken', now)).toEqual({
      ok: false,
      error: 'Файл не содержит корректный JSON.',
    });
    expect(storage.values.get(PROGRESS_STORAGE_KEY)).toBe(before);
  });
});
