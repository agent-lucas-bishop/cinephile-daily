export type GameType = 'credits' | 'poster' | 'year';

export interface EndlessRun {
  seed: number;
  gameType: GameType;
  round: number;       // current round (1-indexed)
  score: number;       // accumulated score
  active: boolean;     // run is still going
  // Current round game state
  currentRound: number;
  currentGuesses: string[];
  currentYearGuesses: number[];
  currentCompleted: boolean;
  currentWon: boolean;
  currentScore: number;
}

export interface EndlessBest {
  bestRound: number;
  bestScore: number;
}

const RUN_KEY_PREFIX = 'cinephile-endless-run-';
const BEST_KEY_PREFIX = 'cinephile-endless-best-';

export function getEndlessRun(gameType: GameType): EndlessRun | null {
  const raw = localStorage.getItem(RUN_KEY_PREFIX + gameType);
  if (!raw) return null;
  return JSON.parse(raw);
}

export function saveEndlessRun(run: EndlessRun): void {
  localStorage.setItem(RUN_KEY_PREFIX + run.gameType, JSON.stringify(run));
}

export function clearEndlessRun(gameType: GameType): void {
  localStorage.removeItem(RUN_KEY_PREFIX + gameType);
}

export function getEndlessBest(gameType: GameType): EndlessBest {
  const raw = localStorage.getItem(BEST_KEY_PREFIX + gameType);
  if (raw) return JSON.parse(raw);
  return { bestRound: 0, bestScore: 0 };
}

export function updateEndlessBest(gameType: GameType, round: number, score: number): void {
  const best = getEndlessBest(gameType);
  let changed = false;
  if (round > best.bestRound) { best.bestRound = round; changed = true; }
  if (score > best.bestScore) { best.bestScore = score; changed = true; }
  if (changed) localStorage.setItem(BEST_KEY_PREFIX + gameType, JSON.stringify(best));
}

export function getAllEndlessBests(): Record<GameType, EndlessBest> {
  return {
    credits: getEndlessBest('credits'),
    poster: getEndlessBest('poster'),
    year: getEndlessBest('year'),
  };
}

export function startNewEndlessRun(gameType: GameType): EndlessRun {
  const run: EndlessRun = {
    seed: Date.now(),
    gameType,
    round: 1,
    score: 0,
    active: true,
    currentRound: 1,
    currentGuesses: [],
    currentYearGuesses: [],
    currentCompleted: false,
    currentWon: false,
    currentScore: 0,
  };
  saveEndlessRun(run);
  return run;
}
