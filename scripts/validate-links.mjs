import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const outputDirectory = path.join(root, 'dist');

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
    }),
  );
  return nested.flat();
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function outputPathFor(pathname) {
  const clean = decodeURIComponent(pathname).replace(/^\/+/, '');
  if (!clean) return path.join(outputDirectory, 'index.html');
  if (path.extname(clean)) return path.join(outputDirectory, clean);
  return path.join(outputDirectory, clean, 'index.html');
}

const htmlFiles = (await listFiles(outputDirectory)).filter((filePath) => filePath.endsWith('.html'));
const issues = [];
const htmlCache = new Map();

for (const filePath of htmlFiles) {
  const html = await readFile(filePath, 'utf8');
  htmlCache.set(filePath, html);
  const relative = path.relative(outputDirectory, filePath).replaceAll('\\', '/');
  if (/^yandex_[a-f0-9]+\.html$/.test(relative)) continue;
  const expectedPath = relative === 'index.html' ? '/' : `/${relative.replace(/index\.html$/, '')}`;
  const canonicalMatches = [...html.matchAll(/<link\s+rel="canonical"\s+href="([^"]+)"/g)];
  if (canonicalMatches.length !== 1) {
    issues.push(`${relative}: expected one canonical link, found ${canonicalMatches.length}`);
  } else {
    const canonical = new URL(canonicalMatches[0][1]);
    if (canonical.origin !== 'https://algods.ru' || canonical.pathname !== expectedPath) {
      issues.push(`${relative}: canonical ${canonical.href} does not match ${expectedPath}`);
    }
  }

  for (const anchorMatch of html.matchAll(/<a\b([^>]*)>/g)) {
    const attributes = anchorMatch[1];
    const href = attributes.match(/\bhref="([^"]+)"/)?.[1];
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) continue;

    if (/\btarget="_blank"/.test(attributes)) {
      const rel = attributes.match(/\brel="([^"]+)"/)?.[1]?.split(/\s+/) ?? [];
      if (!rel.includes('noopener') || !rel.includes('noreferrer')) {
        issues.push(`${relative}: target=_blank link lacks noopener noreferrer: ${href}`);
      }
    }

    const url = new URL(href, `https://algods.ru${expectedPath}`);
    if (url.origin !== 'https://algods.ru') continue;
    const targetPath = outputPathFor(url.pathname);
    if (!(await exists(targetPath))) {
      issues.push(`${relative}: broken internal link ${href}`);
      continue;
    }
    if (url.hash) {
      const targetHtml = htmlCache.get(targetPath) ?? (await readFile(targetPath, 'utf8'));
      htmlCache.set(targetPath, targetHtml);
      const id = decodeURIComponent(url.hash.slice(1));
      const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (!new RegExp(`\\bid="${escaped}"`).test(targetHtml)) {
        issues.push(`${relative}: missing fragment target ${href}`);
      }
    }
  }

  for (const linkMatch of html.matchAll(/<link\b([^>]*)>/g)) {
    const attributes = linkMatch[1];
    const rel = attributes.match(/\brel="([^"]+)"/)?.[1] ?? '';
    if (!/(?:^|\s)(?:icon|apple-touch-icon|manifest)(?:\s|$)/.test(rel)) continue;
    const href = attributes.match(/\bhref="([^"]+)"/)?.[1];
    if (!href) {
      issues.push(`${relative}: ${rel} link lacks href`);
      continue;
    }
    const url = new URL(href, `https://algods.ru${expectedPath}`);
    if (url.origin === 'https://algods.ru' && !(await exists(outputPathFor(url.pathname)))) {
      issues.push(`${relative}: missing ${rel} asset ${href}`);
    }
  }

  const socialImage = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/)?.[1];
  if (!socialImage) {
    issues.push(`${relative}: og:image is missing`);
  } else {
    const url = new URL(socialImage, `https://algods.ru${expectedPath}`);
    if (url.origin === 'https://algods.ru' && !(await exists(outputPathFor(url.pathname)))) {
      issues.push(`${relative}: missing og:image asset ${socialImage}`);
    }
  }
}

const cname = (await readFile(path.join(outputDirectory, 'CNAME'), 'utf8')).trim();
if (cname !== 'algods.ru') issues.push(`CNAME: expected algods.ru, found ${JSON.stringify(cname)}`);
if (!(await exists(path.join(outputDirectory, 'sitemap-index.xml')))) {
  issues.push('sitemap-index.xml is missing');
}
const manifest = JSON.parse(await readFile(path.join(outputDirectory, 'manifest.webmanifest'), 'utf8'));
for (const icon of manifest.icons ?? []) {
  const url = new URL(icon.src, 'https://algods.ru/');
  if (url.origin === 'https://algods.ru' && !(await exists(outputPathFor(url.pathname)))) {
    issues.push(`manifest.webmanifest: missing icon ${icon.src}`);
  }
}

if (issues.length > 0) {
  issues.forEach((issue) => console.error(issue));
  process.exitCode = 1;
} else {
  console.log(`Validated internal links, fragments, canonical URLs, and external-link safety across ${htmlFiles.length} HTML files.`);
}
