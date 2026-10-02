import { describe, expect, it } from 'vitest';
import { analyzeSeoHtml, validateSeoInventory } from '../scripts/lib/seo-validation.mjs';

const page = (route = '/big-o/', extras = '') => `<!doctype html><html><head>
<title>Useful guide ${route}</title><meta content="Useful description ${route}" name="description">
<link href="https://algods.ru${route}" rel="canonical">${extras}</head>
<body><main><h1>One heading</h1></main></body></html>`;

describe('generated HTML SEO validation', () => {
  it('accepts reordered attributes and ignores title-like text in scripts and comments', () => {
    const html = page('/', '<script>const text = "<h1>ignored</h1>";</script><!-- <link rel="canonical" href="bad"> -->');
    expect(analyzeSeoHtml(html, '/').issues).toEqual([]);
  });
  it.each([
    ['<title>Useful guide /big-o/</title>', '<title> </title>', 'title'],
    ['name="description"', 'name="other"', 'description'],
    ['https://algods.ru/big-o/', '/big-o/', 'canonical'],
    ['https://algods.ru/big-o/', 'https://example.com/big-o/', 'canonical'],
    ['https://algods.ru/big-o/', 'https://algods.ru/wrong/', 'canonical'],
    ['<h1>One heading</h1>', '<h1>One</h1><h1>Two</h1>', 'H1'],
  ])('rejects broken %s', (before, after, message) => {
    expect(analyzeSeoHtml(page().replace(before, after), '/big-o/').issues.join(' ')).toContain(message);
  });
  it('rejects duplicate canonicals and accidental noindex even in googlebot metadata', () => {
    const result = analyzeSeoHtml(page('/big-o/', '<link rel="canonical" href="https://algods.ru/big-o/"><meta name="googlebot" content="noindex,follow">'), '/big-o/');
    expect(result.issues.join(' ')).toContain('canonical');
    expect(result.issues.join(' ')).toContain('noindex');
  });
  it('checks JSON-LD parsing and canonical breadcrumb URLs', () => {
    expect(analyzeSeoHtml(page('/big-o/', '<script type="application/ld+json">{broken}</script>'), '/big-o/').issues.join(' ')).toContain('JSON-LD');
    const data = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'AlgoDS', item: 'https://algods.ru/' },
      { '@type': 'ListItem', position: 2, name: 'Big O', item: '/big-o/' },
    ] };
    expect(analyzeSeoHtml(page('/big-o/', `<script type="application/ld+json">${JSON.stringify(data)}</script>`), '/big-o/').issues.join(' ')).toContain('breadcrumb');
    data.itemListElement[1]!.item = 'https://algods.ru/big-o/';
    expect(analyzeSeoHtml(page('/big-o/', `<script type="application/ld+json">${JSON.stringify(data)}</script>`), '/big-o/').issues).toEqual([]);
  });
  it('rejects missing output/sitemap routes and duplicate metadata across pages', () => {
    const routes = ['/big-o/', '/algorithm-patterns/', '/coding-interview/', '/about/'];
    const pages = routes.map((route) => ({ route, ...analyzeSeoHtml(page(route), route) }));
    const sitemap = routes.map((route) => `https://algods.ru${route}`);
    expect(validateSeoInventory(pages, sitemap)).toEqual([]);
    expect(validateSeoInventory(pages.slice(1), sitemap).join(' ')).toContain('missing output');
    expect(validateSeoInventory(pages, sitemap.slice(1)).join(' ')).toContain('sitemap');
    pages[1]!.title = pages[0]!.title;
    pages[1]!.description = pages[0]!.description;
    pages[1]!.canonical = pages[0]!.canonical;
    const issues = validateSeoInventory(pages, sitemap).join(' ');
    expect(issues).toContain('duplicate title');
    expect(issues).toContain('duplicate description');
    expect(issues).toContain('duplicate canonical');
  });
});
