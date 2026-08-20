import { describe, expect, it } from 'vitest';

import { getInitialTheme, getNextTheme, getThemeToggleCopy, isTheme } from '../src/lib/theme';

describe('theme preference', () => {
  it('uses an explicit saved theme over the operating-system preference', () => {
    expect(getInitialTheme('light', true)).toBe('light');
    expect(getInitialTheme('dark', false)).toBe('dark');
  });

  it('falls back to the operating-system preference for missing or malformed values', () => {
    expect(getInitialTheme(null, true)).toBe('dark');
    expect(getInitialTheme('sepia', false)).toBe('light');
  });

  it('accepts only the two supported theme values', () => {
    expect(isTheme('light')).toBe(true);
    expect(isTheme('dark')).toBe(true);
    expect(isTheme('auto')).toBe(false);
    expect(isTheme(null)).toBe(false);
  });

  it('switches between the supported themes', () => {
    expect(getNextTheme('light')).toBe('dark');
    expect(getNextTheme('dark')).toBe('light');
  });

  it('describes the action that will switch away from the resolved theme', () => {
    expect(getThemeToggleCopy('light')).toEqual({
      actionLabel: 'Включить тёмную тему',
      visibleLabel: 'Тёмная тема',
    });
    expect(getThemeToggleCopy('dark')).toEqual({
      actionLabel: 'Включить светлую тему',
      visibleLabel: 'Светлая тема',
    });
  });
});
