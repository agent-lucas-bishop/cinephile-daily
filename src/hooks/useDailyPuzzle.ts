import { useState, useEffect } from 'react';
import type { Movie } from '../types/movie';

const PUZZLE_CACHE_KEY = 'cinephile-daily-puzzle-cache';

function getTodayUTC(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

function getCachedPuzzle(): { movies: [Movie, Movie, Movie]; genre: string } | null {
  try {
    const raw = localStorage.getItem(PUZZLE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.date === getTodayUTC() && parsed.movies?.length === 3) {
      return { movies: parsed.movies, genre: parsed.genre };
    }
  } catch {}
  return null;
}

function cachePuzzle(movies: [Movie, Movie, Movie], genre: string) {
  localStorage.setItem(PUZZLE_CACHE_KEY, JSON.stringify({ date: getTodayUTC(), movies, genre }));
}

interface DailyPuzzleData {
  movies: [Movie, Movie, Movie];
  genre: string;
  loading: boolean;
  error: string | null;
}

export function useDailyPuzzle(): DailyPuzzleData {
  const cached = getCachedPuzzle();
  const [data, setData] = useState<{ movies: [Movie, Movie, Movie]; genre: string } | null>(cached);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we have a valid cache for today, skip the fetch
    if (cached) return;

    let cancelled = false;
    fetch('/api/daily-puzzle')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(json => {
        if (cancelled) return;
        const movies = json.movies as [Movie, Movie, Movie];
        cachePuzzle(movies, json.genre);
        setData({ movies, genre: json.genre });
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (data) {
    return { ...data, loading: false, error: null };
  }
  // Return placeholder while loading
  return {
    movies: [null as unknown as Movie, null as unknown as Movie, null as unknown as Movie],
    genre: '',
    loading,
    error,
  };
}
