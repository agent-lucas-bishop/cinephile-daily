import { getTodayString } from './dailySeed';

export interface DailyState {
  date: string;
  games: {
    credits: GameState;
    poster: GameState;
    year: YearGameState;
  };
}

export interface GameState {
  round: number;
  completed: boolean;
  score: number;
  guesses: string[];
  won: boolean;
}

export interface YearGameState extends GameState {
  yearGuesses: number[];
}

export interface Stats {
  streak: number;
  maxStreak: number;
  totalScore: number;
  gamesPlayed: number;
  lastPlayedDate: string;
}

export interface GameStreakStats {
  streak: number;
  bestStreak: number;
  totalScore: number;
  lastPlayedDate: string;
}

const DAILY_KEY = 'cinephile-daily-state';
const STATS_KEY = 'cinephile-daily-stats';

function defaultGameState(): GameState {
  return { round: 1, completed: false, score: 0, guesses: [], won: false };
}

function defaultYearState(): YearGameState {
  return { ...defaultGameState(), yearGuesses: [] };
}

export function getDailyState(): DailyState {
  const today = getTodayString();
  const raw = localStorage.getItem(DAILY_KEY);
  if (raw) {
    const parsed = JSON.parse(raw) as DailyState;
    if (parsed.date === today) return parsed;
  }
  return {
    date: today,
    games: {
      credits: defaultGameState(),
      poster: defaultGameState(),
      year: defaultYearState(),
    },
  };
}

export function saveDailyState(state: DailyState) {
  localStorage.setItem(DAILY_KEY, JSON.stringify(state));
}

export function getStats(): Stats {
  const raw = localStorage.getItem(STATS_KEY);
  if (raw) return JSON.parse(raw) as Stats;
  return { streak: 0, maxStreak: 0, totalScore: 0, gamesPlayed: 0, lastPlayedDate: '' };
}

export function saveStats(stats: Stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

// Per-game streak functions
function getGameStreakKey(game: 'credits' | 'poster' | 'year'): string {
  return `cinephile-streak-${game}`;
}

export function getGameStreak(game: 'credits' | 'poster' | 'year'): GameStreakStats {
  const raw = localStorage.getItem(getGameStreakKey(game));
  if (raw) return JSON.parse(raw) as GameStreakStats;
  return { streak: 0, bestStreak: 0, totalScore: 0, lastPlayedDate: '' };
}

export function getAllGameStreaks(): Record<'credits' | 'poster' | 'year', GameStreakStats> {
  return {
    credits: getGameStreak('credits'),
    poster: getGameStreak('poster'),
    year: getGameStreak('year'),
  };
}

function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
}

export function updateGameStreak(game: 'credits' | 'poster' | 'year', score: number, won: boolean) {
  const today = getTodayString();
  const stats = getGameStreak(game);
  
  if (stats.lastPlayedDate === today) return; // Already updated today
  
  const yStr = getYesterdayString();
  
  if (won) {
    if (stats.lastPlayedDate === yStr) {
      stats.streak += 1;
    } else {
      stats.streak = 1;
    }
    stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
  } else {
    stats.streak = 0;
  }
  
  stats.totalScore += score;
  stats.lastPlayedDate = today;
  
  localStorage.setItem(getGameStreakKey(game), JSON.stringify(stats));
}

export function updateStatsAfterGame(score: number) {
  const today = getTodayString();
  const stats = getStats();
  
  if (stats.lastPlayedDate === today) {
    stats.totalScore += score;
  } else {
    const yStr = getYesterdayString();
    
    if (stats.lastPlayedDate === yStr) {
      stats.streak += 1;
    } else {
      stats.streak = 1;
    }
    stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
    stats.gamesPlayed += 1;
    stats.totalScore += score;
    stats.lastPlayedDate = today;
  }
  
  saveStats(stats);
}
