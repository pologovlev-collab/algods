import { describe, expect, it } from 'vitest';
import { buildBreadcrumbList, getLessonSeo, serializeStructuredData } from '../src/lib/seo';

describe('lesson search metadata', () => {
  const lesson = { title: 'Учебное название', summary: 'Учебное описание' };
  it('keeps the existing title suffix and summary when overrides are absent', () => {
    expect(getLessonSeo(lesson)).toEqual({ title: 'Учебное название — AlgoDS', description: lesson.summary });
  });
  it('uses a full curated title without duplicating the brand', () => {
    expect(getLessonSeo({ ...lesson, seoTitle: 'Поисковое название — AlgoDS' }).title)
      .toBe('Поисковое название — AlgoDS');
  });
  it('overrides description independently from title', () => {
    expect(getLessonSeo({ ...lesson, seoDescription: 'Поисковое описание' }))
      .toEqual({ title: 'Учебное название — AlgoDS', description: 'Поисковое описание' });
  });
});

describe('structured navigation', () => {
  it('represents the visible trail in order with canonical absolute URLs', () => {
    const items = [{ name: 'AlgoDS', href: '/' }, { name: 'Курс', href: '/course/' }, { name: 'Урок', href: '/course/example/' }];
    expect(buildBreadcrumbList(items)).toEqual({
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem', position: index + 1, name: item.name,
        item: `https://algods.ru${item.href}`,
      })),
    });
  });
  it('rejects off-site and protocol-relative breadcrumb destinations', () => {
    for (const href of ['https://example.com/', '//example.com/', 'javascript:alert(1)']) {
      expect(() => buildBreadcrumbList([{ name: 'Bad', href }])).toThrow();
    }
  });
  it('round trips script-breaking content without allowing a closing script tag', () => {
    const value = { name: '</script><script>alert("x")</script>&\u2028\u2029' };
    const serialized = serializeStructuredData(value);
    expect(serialized).not.toContain('<');
    expect(serialized).not.toContain('&');
    expect(JSON.parse(serialized)).toEqual(value);
  });
});
