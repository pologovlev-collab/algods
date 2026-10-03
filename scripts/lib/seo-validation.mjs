export const SITE_ORIGIN = 'https://algods.ru';
export const NEW_SEO_ROUTES = ['/big-o/', '/algorithm-patterns/', '/coding-interview/', '/about/'];

// This scanner targets generated static HTML, not arbitrary or untrusted HTML input.
// Attribute order, quoting, escaped text, comments and script bodies are handled here.
function decode(value) {
  return value.replace(/&(?:#x([0-9a-f]+)|#(\d+)|amp|quot|apos|lt|gt);/gi, (entity, hex, decimal) => {
    if (hex || decimal) {
      const point = Number.parseInt(hex ?? decimal, hex ? 16 : 10);
      return point <= 0x10ffff ? String.fromCodePoint(point) : entity;
    }
    return { '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>' }[entity.toLowerCase()] ?? entity;
  });
}

function attributes(source) {
  return Object.fromEntries([...source.matchAll(/([^\s=]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
    .map((match) => [match[1].toLowerCase(), decode(match[2] ?? match[3] ?? match[4] ?? '')]));
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b((?:[^>"']|"[^"]*"|'[^']*')*)>`, 'gi'))]
    .map((match) => attributes(match[1]));
}

function isCanonicalUrl(value) {
  try {
    const url = new URL(value);
    return url.origin === SITE_ORIGIN && url.href === `${SITE_ORIGIN}${url.pathname}`;
  } catch { return false; }
}

function breadcrumbLists(value) {
  if (!value || typeof value !== 'object') return [];
  const own = value['@type'] === 'BreadcrumbList' ? [value] : [];
  return [...own, ...Object.values(value).flatMap(breadcrumbLists)];
}

export function analyzeSeoHtml(source, route) {
  const issues = [];
  const html = source.replace(/<!--[\s\S]*?-->/g, '');
  const markup = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  const titles = [...markup.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/gi)];
  const title = decode(titles[0]?.[1] ?? '').trim();
  if (titles.length !== 1 || !title) issues.push('expected one nonempty title');
  const meta = tags(markup, 'meta');
  const descriptions = meta.filter((tag) => tag.name?.toLowerCase() === 'description');
  const description = descriptions[0]?.content?.trim() ?? '';
  if (descriptions.length !== 1 || !description) issues.push('expected one nonempty meta description');
  const canonicals = tags(markup, 'link').filter((tag) => tag.rel?.toLowerCase().split(/\s+/).includes('canonical'));
  const canonical = canonicals[0]?.href ?? '';
  if (canonicals.length !== 1 || !isCanonicalUrl(canonical) || canonical !== `${SITE_ORIGIN}${route}`) {
    issues.push('expected one absolute canonical matching the route on https://algods.ru');
  }
  const h1Count = tags(markup, 'h1').length;
  if (h1Count !== 1) issues.push(`expected one H1, found ${h1Count}`);
  const noindex = meta.some((tag) => ['robots', 'googlebot', 'yandex'].includes(tag.name?.toLowerCase())
    && /(?:^|[\s,])(?:noindex|none)(?:$|[\s,])/i.test(tag.content ?? ''));
  if (noindex) issues.push('accidental noindex on a content page');

  for (const [property, expected] of [['og:title', title], ['og:description', description], ['og:url', canonical]]) {
    const values = meta.filter((tag) => tag.property === property);
    if (values.length && (values.length !== 1 || values[0].content !== expected)) issues.push(`${property} differs from page metadata`);
  }

  const structuredData = [];
  for (const match of html.matchAll(/<script\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (attributes(match[1]).type?.toLowerCase() !== 'application/ld+json') continue;
    try { structuredData.push(JSON.parse(match[2])); }
    catch { issues.push('JSON-LD is not parseable'); }
  }
  const breadcrumbs = structuredData.flatMap(breadcrumbLists);
  for (const trail of breadcrumbs) {
    const items = trail.itemListElement;
    if (trail['@context'] !== 'https://schema.org' || !Array.isArray(items) || items.length < 2) {
      issues.push('breadcrumb list requires schema context and at least two entries');
      continue;
    }
    if (items.some((item, index) => !item || item['@type'] !== 'ListItem'
      || item.position !== index + 1 || typeof item.name !== 'string' || !item.name.trim()
      || typeof item.item !== 'string' || !isCanonicalUrl(item.item))) {
      issues.push('breadcrumb entries require ordered positions, names and absolute canonical URLs');
    }
    if (items.at(-1)?.item !== canonical) issues.push('breadcrumb current page does not match canonical');
  }
  const needsBreadcrumbs = NEW_SEO_ROUTES.includes(route)
    || (route.startsWith('/course/') && route !== '/course/')
    || (route.startsWith('/reference/') && route !== '/reference/');
  if (needsBreadcrumbs && breadcrumbs.length !== 1) issues.push('expected one breadcrumb list for this content route');
  return { title, description, canonical, h1Count, noindex, structuredData, breadcrumbs, issues };
}

export function validateSeoInventory(pages, sitemapUrls) {
  const issues = [];
  const routes = new Set(pages.map((page) => page.route));
  for (const route of NEW_SEO_ROUTES) {
    if (!routes.has(route)) issues.push(`${route}: missing output`);
  }
  const sitemap = new Set(sitemapUrls);
  for (const page of pages) {
    if (!sitemap.has(`${SITE_ORIGIN}${page.route}`)) issues.push(`${page.route}: missing from sitemap`);
  }
  for (const field of ['canonical', 'title', 'description']) {
    const seen = new Map();
    for (const page of pages) {
      if (!page[field]) continue;
      if (seen.has(page[field])) issues.push(`${page.route}: duplicate ${field} with ${seen.get(page[field])}`);
      else seen.set(page[field], page.route);
    }
  }
  return issues;
}
