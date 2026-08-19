import {
  createDefaultProgress,
  exportProgress,
  importProgress,
  type ProgressImportResult,
  type ProgressState,
} from './progress';

export const PROGRESS_STORAGE_KEY = 'algods:progress:v2';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function loadProgress(
  storage: StorageLike,
  timestamp = new Date().toISOString(),
): ProgressState {
  let serialized: string | null;
  try {
    serialized = storage.getItem(PROGRESS_STORAGE_KEY);
  } catch {
    return createDefaultProgress();
  }

  if (serialized === null) return createDefaultProgress();

  const imported = importProgress(serialized, timestamp);
  if (!imported.ok) return createDefaultProgress();

  const parsed = JSON.parse(serialized) as { version?: unknown };
  const state = imported.value;
  if (
    typeof parsed === 'object' &&
    parsed !== null &&
    'version' in parsed &&
    parsed.version === 1
  ) {
    saveProgress(storage, state);
  }
  return state;
}

export function saveProgress(storage: StorageLike, state: ProgressState): boolean {
  try {
    storage.setItem(PROGRESS_STORAGE_KEY, exportProgress(state));
    return true;
  } catch {
    return false;
  }
}

export function resetProgress(storage: StorageLike): boolean {
  try {
    storage.removeItem(PROGRESS_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function importAndSaveProgress(
  storage: StorageLike,
  serialized: string,
  timestamp = new Date().toISOString(),
): ProgressImportResult {
  const result = importProgress(serialized, timestamp);
  if (!result.ok) return result;
  if (!saveProgress(storage, result.value)) {
    return {
      ok: false,
      error: 'Не удалось сохранить прогресс в этом браузере.',
    };
  }
  return result;
}
