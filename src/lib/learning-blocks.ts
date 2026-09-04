export type LearningBlockPlacement = 'before-content' | 'after-content';

interface LearningBlockBase {
  id: string;
  placement: LearningBlockPlacement;
  title: string;
  body: string;
}

export interface MentalModelLearningBlock extends LearningBlockBase {
  type: 'mental-model';
  items: Array<{ label: string; detail: string }>;
}

export interface PredictionLearningBlock extends LearningBlockBase {
  type: 'prediction';
  question: string;
  choices: Array<{
    id: string;
    label: string;
    correct: boolean;
    feedback: string;
  }>;
}

export interface TraceLearningBlock extends LearningBlockBase {
  type: 'trace';
  steps: Array<{ label: string; state: string; explanation: string }>;
}

export interface ComplexityLearningBlock extends LearningBlockBase {
  type: 'complexity';
  steps: Array<{ label: string; detail: string }>;
  result: string;
}

export interface MistakeLearningBlock extends LearningBlockBase {
  type: 'mistake';
  wrong: string;
  why: string;
  fix: string;
}

export interface ChooseLearningBlock extends LearningBlockBase {
  type: 'choose';
  useWhen: string[];
  avoidWhen: string[];
}

export type LearningBlock =
  | MentalModelLearningBlock
  | PredictionLearningBlock
  | TraceLearningBlock
  | ComplexityLearningBlock
  | MistakeLearningBlock
  | ChooseLearningBlock;

export interface PredictionResult {
  correct: boolean;
  feedback: string;
}

export function evaluatePrediction(
  block: PredictionLearningBlock,
  choiceId: string,
): PredictionResult | null {
  const choice = block.choices.find(({ id }) => id === choiceId);
  return choice ? { correct: choice.correct, feedback: choice.feedback } : null;
}

export function assertValidLearningBlocks(blocks: readonly LearningBlock[]): void {
  const blockIds = new Set<string>();

  for (const block of blocks) {
    if (blockIds.has(block.id)) throw new Error(`learning blocks contain duplicate block ${block.id}`);
    blockIds.add(block.id);

    if (block.type !== 'prediction') continue;
    const choiceIds = new Set(block.choices.map(({ id }) => id));
    if (choiceIds.size !== block.choices.length) {
      throw new Error(`prediction block ${block.id} contains duplicate choice IDs`);
    }
    if (block.choices.filter(({ correct }) => correct).length !== 1) {
      throw new Error(`prediction block ${block.id} must have exactly one correct choice`);
    }
  }
}
