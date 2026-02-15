import { useDailyPuzzle } from '../hooks/useDailyPuzzle';
import { useGameState } from '../hooks/useGameState';
import { YearGame } from '../games/Year';
import { GenreBanner } from '../components/GenreBanner';
import { LoadingScreen } from '../components/LoadingScreen';

export function YearPage() {
  const { movies, genre, loading, error } = useDailyPuzzle();
  const { state, update } = useGameState();
  if (loading) return <LoadingScreen />;
  if (error || !movies[2]) return <div style={{ padding: 40, textAlign: 'center', color: '#8B3A3A' }}>Failed to load puzzle data.</div>;
  return (
    <>
      {genre && <GenreBanner genre={genre} />}
      <YearGame movie={movies[2]} state={state} update={update} />
    </>
  );
}
