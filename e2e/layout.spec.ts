import { readdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { inspectLayout } from './helpers/layout';

const release = process.env.ALGODS_LAYOUT_AUDIT === '1' || process.env.npm_lifecycle_event === 'test:layout';
const widths = release ? [360, 390, 430, 768, 1024, 1440] : [390];
const directories = (parent: string) => readdirSync(`dist/${parent}`, { withFileTypes: true })
  .filter((entry) => entry.isDirectory()).map((entry) => `/${parent}/${entry.name}/`);

for (const width of widths) {
  test(`rendered content remains accessible at ${width}px ${release ? '@release-layout' : '@smoke'}`, async ({ page }, testInfo) => {
    test.setTimeout(release ? 180_000 : 30_000);
    await page.setViewportSize({ width, height: 900 });
    const lessons = release && width <= 430 ? directories('course') : ['/course/graph-representation-and-grids/'];
    const routes = release
      ? [...lessons, '/', '/course/', '/roadmap/', '/practice/', '/leetcode-75/', '/reference/', ...directories('reference')]
      : [...lessons, '/course/interview-containers-and-costs/', '/reference/range-query-trees/'];
    const report = [];
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const result = await page.evaluate(inspectLayout);
      report.push({ route, width, ...result });
      if (result.issues.length) {
        await page.screenshot({ path: testInfo.outputPath(`${route.replaceAll('/', '_')}.png`), fullPage: true });
      }
    }
    await testInfo.attach('layout-report', { body: JSON.stringify(report, null, 2), contentType: 'application/json' });
    expect(report.filter(({ issues }) => issues.length), 'inaccessible rendered geometry').toEqual([]);
  });
}
