import { useState, useEffect, useCallback } from 'react';
import type { Movie } from '../types/movie';
import type { DailyState, GameState, YearGameState } from '../utils/storage';
import {
  type GameType,
  type EndlessRun,
  getEndlessRun,
  saveEndlessRun,
  updateEndlessBest,
  startNewEndlessRun,
  getEndlessBest,
} from '../utils/endlessStorage';

interface UseEndlessModeReturn {
  run: EndlessRun | null;
  movie: Movie | null;
  loading: boolean;
  error: string | null;
  state: DailyState;
  update: (fn: (s: DailyState) => DailyState) => void;
  startRun: () => void;
  isGameOver: boolean;
  roundJustWon: boolean; // true briefly after winning a round
  lastRoundScore: number;
  bestRound: number;
  bestScore: number;
  advanceToNextRound: () => void;
}

function defaultGameState(): GameState {
  return { round: 1, completed: false, score: 0, guesses: [], won: false };
}

function defaultYearState(): YearGameState {
  return { ...defaultGameState(), yearGuesses: [] };
}

function buildDailyState(gameType: GameType, run: EndlessRun | null): DailyState {
  const base: DailyState = {
    date: 'endless',
    games: {
      credits: defaultGameState(),
      poster: defaultGameState(),
      year: defaultYearState(),
    },
  };
  if (run) {
    const gs: GameState = {
      round: run.currentRound,
      completed: run.currentCompleted,
      score: run.currentScore,
      guesses: run.currentGuesses,
      won: run.currentWon,
    };
    if (gameType === 'year') {
      base.games.year = { ...gs, yearGuesses: run.currentYearGuesses };
    } else {
      base.games[gameType] = gs;
    }
  }
  return base;
}

export function useEndlessMode(gameType: GameType): UseEndlessModeReturn {
  const [run, setRun] = useState<EndlessRun | null>(() => getEndlessRun(gameType));
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(() => {
    const r = getEndlessRun(gameType);
    return r ? !r.active : false;
  });
  const [roundJustWon, setRoundJustWon] = useState(false);
  const [lastRoundScore, setLastRoundScore] = useState(0);
  const best = getEndlessBest(gameType);

  // Fetch movie for current round
  useEffect(() => {
    if (!run || !run.active || roundJustWon) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/endless-puzzle?seed=${run.seed}&round=${run.round}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(json => {
        if (cancelled) return;
        setMovie(json.movie);
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [run?.seed, run?.round, run?.active, roundJustWon]);

  const startRun = useCallback(() => {
    const newRun = startNewEndlessRun(gameType);
    setRun(newRun);
    setMovie(null);
    setIsGameOver(false);
    setRoundJustWon(false);
  }, [gameType]);

  const advanceToNextRound = useCallback(() => {
    setRoundJustWon(false);
    // The run was already updated, just trigger movie fetch
  }, []);

  const update = useCallback((updater: (s: DailyState) => DailyState) => {
    setRun(prev => {
      if (!prev || !prev.active) return prev;
      const oldState = buildDailyState(gameType, prev);
      const newState = updater(oldState);
      const gs = gameType === 'year'
        ? newState.games.year
        : newState.games[gameType];

      const updated: EndlessRun = {
        ...prev,
        currentRound: gs.round,
        currentGuesses: gs.guesses,
        currentYearGuesses: gameType === 'year' ? (gs as YearGameState).yearGuesses : prev.currentYearGuesses,
        currentCompleted: gs.completed,
        currentWon: gs.won,
        currentScore: gs.score,
      };

      if (gs.completed) {
        if (gs.won) {
          updated.score += gs.score;
          setLastRoundScore(gs.score);
          updateEndlessBest(gameType, updated.round, updated.score);
          // Advance round but keep state until user clicks next
          updated.round += 1;
          updated.currentRound = 1;
          updated.currentGuesses = [];
          updated.currentYearGuesses = [];
          updated.currentCompleted = false;
          updated.currentWon = false;
          updated.currentScore = 0;
          setRoundJustWon(true);
        } else {
          updated.active = false;
          updateEndlessBest(gameType, updated.round - 1, updated.score);
          setIsGameOver(true);
        }
      }

      saveEndlessRun(updated);
      return updated;
    });
  }, [gameType]);

  const state = buildDailyState(gameType, run);

  return {
    run,
    movie,
    loading,
    error,
    state,
    update,
    startRun,
    isGameOver,
    roundJustWon,
    lastRoundScore,
    advanceToNextRound,
    bestRound: best.bestRound,
    bestScore: best.bestScore,
  };
}
