export function getScore(round: number): number {
  // round 1 = 5pts, round 2 = 4pts, ... round 5 = 1pt
  return Math.max(1, 6 - round);
}

export function getYearScore(guessCount: number, diff: number): number {
  if (diff === 0) return Math.max(1, 6 - guessCount);
  return 0;
}
