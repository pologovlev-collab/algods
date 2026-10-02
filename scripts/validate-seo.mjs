import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { analyzeSeoHtml, SITE_ORIGIN, validateSeoInventory } from './lib/seo-validation.mjs';

const outputDirectory = path.resolve('dist');
const files = await readdir(outputDirectory, { recursive: true });
const htmlFiles = files.filter((file) => file.endsWith('.html') && !/^yandex_[a-f0-9]+\.html$/i.test(file));
const pages = await Promise.all(htmlFiles.map(async (file) => {
  const relative = file.replaceAll('\\', '/');
  const route = relative === 'index.html' ? '/' : `/${relative.replace(/index\.html$/, '')}`;
  return { route, ...analyzeSeoHtml(await readFile(path.join(outputDirectory, file), 'utf8'), route) };
}));

const issues = pages.flatMap((page) => page.issues.map((issue) => `${page.route}: ${issue}`));
const sitemapUrls = [];
// Resolve sitemap index locations into local build files; never fetch the live site.
async function readSitemap(file, visited = new Set()) {
  if (visited.has(file)) return;
  visited.add(file);
  const xml = await readFile(path.join(outputDirectory, file), 'utf8');
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replaceAll('&amp;', '&'));
  if (/<sitemapindex\b/.test(xml)) {
    for (const location of locations) {
      const url = new URL(location);
      if (url.origin !== SITE_ORIGIN || !/^\/sitemap[^/]*\.xml$/.test(url.pathname)) {
        issues.push(`unexpected sitemap index destination: ${location}`);
        continue;
      }
      await readSitemap(url.pathname.slice(1), visited);
    }
  } else if (/<urlset\b/.test(xml)) sitemapUrls.push(...locations);
  else issues.push(`${file}: expected a sitemap index or URL set`);
}
try { await readSitemap('sitemap-index.xml'); }
catch (error) { issues.push(`sitemap could not be read: ${error.message}`); }
issues.push(...validateSeoInventory(pages, sitemapUrls));

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ pages, issues }, null, 2));
} else if (issues.length) {
  issues.forEach((issue) => console.error(issue));
} else {
  console.log(`SEO: ${pages.length} content pages; unique titles/descriptions/canonicals; one H1 each; no noindex.`);
  console.log(`SEO: ${pages.filter((page) => page.breadcrumbs.length).length} valid BreadcrumbLists; all content routes in sitemap; 4 new routes present.`);
  console.log('SEO: Yandex verification asset excluded; no artificial title/description length gates.');
}
if (issues.length) process.exitCode = 1;
