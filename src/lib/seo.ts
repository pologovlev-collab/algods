export interface LessonSeoSource {
  title: string;
  summary: string;
  seoTitle?: string | undefined;
  seoDescription?: string | undefined;
}

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function getLessonSeo(lesson: LessonSeoSource) {
  return {
    title: lesson.seoTitle ?? `${lesson.title} — AlgoDS`,
    description: lesson.seoDescription ?? lesson.summary,
  };
}

export function buildBreadcrumbList(items: readonly BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(({ name, href }, index) => {
      const url = new URL(href, 'https://algods.ru');
      if (!href.startsWith('/') || href.startsWith('//') || url.origin !== 'https://algods.ru') {
        throw new Error(`Breadcrumb destination must be a local canonical path: ${href}`);
      }
      return { '@type': 'ListItem', position: index + 1, name, item: url.href };
    }),
  };
}

// JSON.stringify alone does not protect an inline script from a closing HTML tag.
export function serializeStructuredData(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e')
    .replaceAll('&', '\\u0026')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029');
}
