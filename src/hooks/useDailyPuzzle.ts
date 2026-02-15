import { useState, useEffect } from 'react';
import type { Movie } from '../types/movie';

interface DailyPuzzleData {
  movies: [Movie, Movie, Movie];
  genre: string;
  loading: boolean;
  error: string | null;
}

export function useDailyPuzzle(): DailyPuzzleData {
  const [data, setData] = useState<{ movies: [Movie, Movie, Movie]; genre: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/daily-puzzle')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(json => {
        if (cancelled) return;
        setData({ movies: json.movies as [Movie, Movie, Movie], genre: json.genre });
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
