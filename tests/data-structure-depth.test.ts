import { describe, expect, it } from 'vitest';

import { readLessonDocuments } from '../src/lib/content';

const lessonDirectory = new URL('../src/content/lessons/', import.meta.url);

async function lessonBody(id: string): Promise<string> {
  const lesson = (await readLessonDocuments(lessonDirectory)).find(({ data }) => data.id === id);
  expect(lesson, `missing lesson ${id}`).toBeDefined();
  return lesson?.body ?? '';
}

describe('zero-to-pro data structure depth', () => {
  it('teaches the physical tree model before traversal templates', async () => {
    const body = await lessonBody('s10-l01');

    expect(body).toMatch(/корень/is);
    expect(body).toMatch(/родител/is);
    expect(body).toMatch(/реб[её]н/is);
    expect(body).toMatch(/лист/is);
    expect(body).toMatch(/глубин/is);
    expect(body).toMatch(/высот/is);
    expect(body).toMatch(/поддерев/is);
    expect(body).toMatch(/preorder.*inorder.*postorder/is);
  });

  it('covers the full BST update model and its non-logarithmic failure mode', async () => {
    const body = await lessonBody('s10-l04');

    expect(body).toMatch(/вставк.*удален/is);
    expect(body).toMatch(/преемник.*предшественник/is);
    expect(body).toMatch(/вырожден.*O\(n\).*сбалансирован/is);
  });

  it('derives heap mechanics from the array representation', async () => {
    const body = await lessonBody('s11-l01');

    expect(body).toMatch(/полно.*бинарн.*дерев/is);
    expect(body).toContain('2 * i + 1');
    expect(body).toContain('2 * i + 2');
    expect(body).toMatch(/sift-up.*sift-down/is);
    expect(body).toMatch(/priority_queue.*max-heap.*heapq.*min-heap/is);
  });

  it('compares all common graph representations before traversal choice', async () => {
    const body = await lessonBody('s13-l01');

    expect(body).toMatch(/список смежности.*матриц.*список р[её]бер/is);
    expect(body).toMatch(/разреженн.*плотн/is);
    expect(body).toMatch(/ориентирован/is);
    expect(body).toMatch(/неориентирован/is);
    expect(body).toMatch(/взвешенн/is);
    expect(body).toMatch(/невзвешенн/is);
  });

  it('connects optimized DSU mechanics to their capabilities and limits', async () => {
    const body = await lessonBody('s13-l05');

    expect(body).toMatch(/лес/is);
    expect(body).toMatch(/parent/is);
    expect(body).toMatch(/представител/is);
    expect(body).toMatch(/сжати.*пут.*размер/is);
    expect(body).toMatch(/Краскал.*цикл/is);
    expect(body).toMatch(/не.*удал.*р[её]б/is);
  });

  it('makes the Trie storage trade-off explicit', async () => {
    const body = await lessonBody('s17-l01');

    expect(body).toMatch(/фиксирован.*массив.*словар/is);
    expect(body).toMatch(/terminal.*префикс.*полное слово/is);
    expect(body).toMatch(/хеш-множеств/is);
    expect(body).toMatch(/памят/is);
  });
});
