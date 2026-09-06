# Learning-block authoring

Active-learning blocks are optional structured lesson metadata. Add them to a lesson's JSON frontmatter under `learningBlocks`; do not place component markup or arbitrary JavaScript in Markdown.

Use a block only when it asks the learner to reason or makes hidden state explicit. The supported vocabulary is:

- `mental-model`: a compact mapping between two or more concepts;
- `prediction`: one question, two or more choices, and exactly one correct answer;
- `trace`: ordered state transitions with an explanation for each step;
- `complexity`: an explicit cost derivation ending in a result;
- `mistake`: a concrete broken operation, why it fails, and a safe replacement;
- `choose`: conditions for using or avoiding a technique.

Every block needs a kebab-case `id`, a Russian `title` and `body`, plus `placement: "before-content"` or `"after-content"`. Prefer one strong block in a lesson; the schema permits at most four. Prediction feedback must explain the algorithmic reason without scores or blame.

The schema in `src/content.config.ts` is authoritative. Pure prediction and validation behavior lives in `src/lib/learning-blocks.ts`, and `src/components/LearningBlocks.astro` owns rendering and interaction.
