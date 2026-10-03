import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { buildReferenceEntries } from '../src/lib/reference';
import { readLessonDocuments } from '../src/lib/content';

const pythonChecks: Record<string, string> = {
  'binary-search': `
from bisect import bisect_left
from itertools import combinations_with_replacement
for n in range(6):
    for a in combinations_with_replacement(range(-2, 3), n):
        for target in range(-3, 4):
            assert first_not_less(a, target) == bisect_left(a, target)
`,
  'two-pointers': `
from itertools import combinations_with_replacement
for n in range(6):
    for a in combinations_with_replacement(range(-2, 3), n):
        for target in range(-5, 6):
            expected = any(a[i] + a[j] == target for i in range(n) for j in range(i + 1, n))
            assert has_pair(a, target) == expected
`,
  'sliding-window': `
from itertools import product
for n in range(6):
    for a in product(range(-2, 3), repeat=n):
        for k in range(-1, n + 2):
            expected = None if not 1 <= k <= n else max(sum(a[i:i+k]) for i in range(n-k+1))
            assert max_window_sum(a, k) == expected
`,
};

const cppChecks: Record<string, string> = {
  'binary-search': `
#include <algorithm>
#include <cassert>
int main() {
    for (int n = 0; n <= 5; ++n) {
        int count = 1;
        for (int i = 0; i < n; ++i) count *= 5;
        for (int mask = 0; mask < count; ++mask) {
            std::vector<int> a(n);
            int x = mask;
            for (int& v : a) { v = x % 5 - 2; x /= 5; }
            std::sort(a.begin(), a.end());
            for (int t = -3; t <= 3; ++t)
                assert(first_not_less(a, t) == static_cast<int>(std::lower_bound(a.begin(), a.end(), t) - a.begin()));
        }
    }
}`,
  'two-pointers': `
#include <algorithm>
#include <cassert>
int main() {
    for (int n = 0; n <= 5; ++n) {
        int count = 1;
        for (int i = 0; i < n; ++i) count *= 5;
        for (int mask = 0; mask < count; ++mask) {
            std::vector<int> a(n);
            int x = mask;
            for (int& v : a) { v = x % 5 - 2; x /= 5; }
            std::sort(a.begin(), a.end());
            for (int t = -5; t <= 5; ++t) {
                bool expected = false;
                for (int i = 0; i < n; ++i)
                    for (int j = i + 1; j < n; ++j) expected |= a[i] + a[j] == t;
                assert(has_pair(a, t) == expected);
            }
        }
    }
    assert(has_pair({2147483647, 2147483647}, 4294967294LL));
}`,
  'sliding-window': `
#include <cassert>
#include <limits>
int main() {
    for (int n = 0; n <= 5; ++n) {
        int count = 1;
        for (int i = 0; i < n; ++i) count *= 5;
        for (int mask = 0; mask < count; ++mask) {
            std::vector<int> a(n);
            int x = mask;
            for (int& v : a) { v = x % 5 - 2; x /= 5; }
            for (int k = -1; k <= n + 1; ++k) {
                auto actual = max_window_sum(a, k);
                if (k < 1 || k > n) { assert(!actual); continue; }
                long long expected = std::numeric_limits<long long>::min();
                for (int i = 0; i + k <= n; ++i) {
                    long long sum = 0;
                    for (int j = i; j < i + k; ++j) sum += a[j];
                    expected = std::max(expected, sum);
                }
                assert(actual && *actual == expected);
            }
        }
    }
    assert(max_window_sum({2147483647, 2147483647}, 2) == 4294967294LL);
}`,
};

describe('priority reference quick answers', () => {
  it('executes both languages against independent small-input oracles, including empty and invalid windows', async () => {
    const lessons = (await readLessonDocuments('src/content/lessons')).map(({ data }) => data);
    const entries = buildReferenceEntries(lessons);
    const temporaryDirectory = mkdtempSync(join(tmpdir(), 'algods-growth-code-'));
    try {
      for (const slug of Object.keys(pythonChecks)) {
        const quick = entries.find((entry) => entry.slug === slug)?.quickAnswer;
        expect(quick, slug).toBeDefined();
        if (!quick) continue;
        expect(quick.codeExamples.map(({ language }) => language)).toEqual(['cpp', 'python']);
        for (const example of quick.codeExamples) {
          const cpp = example.language === 'cpp';
          const source = join(temporaryDirectory, `${slug}.${cpp ? 'cpp' : 'py'}`);
          writeFileSync(source, example.code + (cpp ? cppChecks[slug] : pythonChecks[slug]), 'utf8');
          const executable = join(temporaryDirectory, `${slug}.exe`);
          if (cpp) {
            const compile = spawnSync('g++', ['-std=c++17', '-Wall', '-Wextra', '-pedantic', source, '-o', executable], { encoding: 'utf8' });
            expect(compile.status, compile.stderr || compile.error?.message).toBe(0);
          }
          const run = spawnSync(cpp ? executable : 'python', cpp ? [] : [source], { encoding: 'utf8', timeout: 10000 });
          expect(run.status, `${slug}/${example.language}: ${run.stderr || run.error?.message}`).toBe(0);
        }
      }
    } finally {
      rmSync(temporaryDirectory, { recursive: true, force: true });
    }
  }, 30000);
});
