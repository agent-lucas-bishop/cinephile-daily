import { useMemo } from 'react';
import { movies } from '../data/movies';
import { getDailyMovieIndices } from '../utils/dailySeed';
import type { Movie } from '../data/movies';

const GENRES = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Thriller'] as const;

export function useDailyPuzzle() {
  return useMemo(() => {
    const [i1, i2, i3] = getDailyMovieIndices(movies.length);
    const dailyMovies: [Movie, Movie, Movie] = [movies[i1], movies[i2], movies[i3]];
    const seed = new Date().getDay();
    const genre = GENRES[seed % GENRES.length];
    return { movies: dailyMovies, genre };
  }, []);
}
