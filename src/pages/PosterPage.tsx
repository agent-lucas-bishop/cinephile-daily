import { useDailyPuzzle } from '../hooks/useDailyPuzzle';
import { useGameState } from '../hooks/useGameState';
import { PosterGame } from '../games/Poster';
import { GenreBanner } from '../components/GenreBanner';
import { LoadingScreen } from '../components/LoadingScreen';

export function PosterPage() {
  const { movies, genre, loading, error } = useDailyPuzzle();
  const { state, update } = useGameState();
  if (loading) return <LoadingScreen />;
  if (error || !movies[1]) return <div style={{ padding: 40, textAlign: 'center', color: '#8B3A3A' }}>Failed to load puzzle data.</div>;
  return (
    <>
      {genre && <GenreBanner genre={genre} />}
      <PosterGame movie={movies[1]} state={state} update={update} />
    </>
  );
}
