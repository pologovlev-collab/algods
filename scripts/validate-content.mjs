import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const { readLessonDocuments } = await import(pathToFileURL(path.join(root, 'src/lib/content.ts')).href);
const { validateCurriculum, validateLessonDocument } = await import(
  pathToFileURL(path.join(root, 'src/lib/validation.ts')).href
);

const lessons = await readLessonDocuments(path.join(root, 'src/content/lessons'));
const stageArgument = process.argv.find((argument) => /^--stages-\d+-\d+$/.test(argument));
const stageRange = stageArgument?.match(/^--stages-(\d+)-(\d+)$/);
const minimumStage = stageRange ? Number(stageRange[1]) : 0;
const maximumStage = stageRange ? Number(stageRange[2]) : 20;
const validateStageSlice = stageRange !== undefined;
const lessonsToValidate = validateStageSlice
  ? lessons.filter(({ data }) => data.stage >= minimumStage && data.stage <= maximumStage)
  : lessons;
const allLessonIds = new Set(lessons.map(({ data }) => data.id));
const sliceLessonIds = new Set(lessonsToValidate.map(({ data }) => data.id));
const graphDocuments = validateStageSlice
  ? lessonsToValidate.map((lesson) => ({
      ...lesson,
      data: {
        ...lesson.data,
        prerequisites: lesson.data.prerequisites.filter((id) => sliceLessonIds.has(id)),
      },
    }))
  : lessonsToValidate;
const issues = [
  ...lessonsToValidate.flatMap(validateLessonDocument),
  ...validateCurriculum(graphDocuments),
];
if (validateStageSlice) {
  for (const lesson of lessonsToValidate) {
    for (const prerequisite of lesson.data.prerequisites) {
      if (!allLessonIds.has(prerequisite)) {
        issues.push({ filePath: lesson.filePath, field: 'prerequisites', message: `unknown lesson: ${prerequisite}` });
      }
    }
  }
}

const knownSliceCounts = new Map([
  ['0-5', 14],
  ['6-13', 25],
  ['14-18', 11],
  ['19-20', 4],
  ['14-20', 15],
]);
const rangeKey = `${minimumStage}-${maximumStage}`;
const expectedLessonCount = validateStageSlice ? knownSliceCounts.get(rangeKey) : 54;
const expectedStageCount = maximumStage - minimumStage + 1;
if (expectedLessonCount !== undefined && lessonsToValidate.length !== expectedLessonCount) {
  issues.push({ filePath: 'src/content/lessons', field: 'count', message: `expected ${expectedLessonCount} lessons, found ${lessonsToValidate.length}` });
}
if (new Set(lessonsToValidate.map(({ data }) => data.stage)).size !== expectedStageCount) {
  issues.push({ filePath: 'src/content/lessons', field: 'stage', message: `expected stages ${minimumStage} through ${maximumStage}` });
}

const checkCode = process.argv.includes('--check-code');
if (checkCode) {
  const selected = lessonsToValidate;
  let compiledExampleCount = 0;
  const issueCountBeforeCodeChecks = issues.length;
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'algods-code-'));
  try {
    for (const lesson of selected) {
      const cpp = lesson.body.match(/```cpp\s*\r?\n([\s\S]*?)\r?\n```/)?.[1];
      const python = lesson.body.match(/```python\s*\r?\n([\s\S]*?)\r?\n```/)?.[1];
      if (cpp === undefined || python === undefined) continue;
      compiledExampleCount += 1;

      const cppPath = path.join(temporaryDirectory, `${lesson.data.id}.cpp`);
      const executablePath = path.join(temporaryDirectory, `${lesson.data.id}.exe`);
      const pythonPath = path.join(temporaryDirectory, `${lesson.data.id}.py`);
      await writeFile(cppPath, cpp, 'utf8');
      await writeFile(pythonPath, python, 'utf8');

      const compile = spawnSync('g++', ['-std=c++17', '-Wall', '-Wextra', '-pedantic', cppPath, '-o', executablePath], { encoding: 'utf8' });
      if (compile.status !== 0) {
        const detail = compile.error?.message ?? compile.stderr?.trim() ?? 'unknown compiler failure';
        issues.push({ filePath: lesson.filePath, field: 'code.cpp', message: `compile failed: ${detail}` });
        continue;
      }
      const cppRun = spawnSync(executablePath, [], { encoding: 'utf8', timeout: 5000 });
      if (cppRun.status !== 0) {
        const detail = cppRun.error?.message ?? cppRun.stderr?.trim() ?? 'unknown execution failure';
        issues.push({ filePath: lesson.filePath, field: 'code.cpp', message: `execution failed: ${detail}` });
      }
      const pythonRun = spawnSync('python', [pythonPath], { encoding: 'utf8', timeout: 5000 });
      if (pythonRun.status !== 0) {
        const detail = pythonRun.error?.message ?? pythonRun.stderr?.trim() ?? 'unknown execution failure';
        issues.push({ filePath: lesson.filePath, field: 'code.python', message: `execution failed: ${detail}` });
      }
    }
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
  if (issues.length === issueCountBeforeCodeChecks) {
    console.log(`Compiled and ran ${compiledExampleCount} C++17 and ${compiledExampleCount} Python 3 lesson examples (stages ${minimumStage}-${maximumStage}).`);
  }
}

if (issues.length > 0) {
  for (const issue of issues) console.error(`${issue.filePath} [${issue.field}] ${issue.message}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${lessonsToValidate.length} core lessons across ${expectedStageCount} stages.`);
}
