import { useDailyPuzzle } from '../hooks/useDailyPuzzle';
import { useGameState } from '../hooks/useGameState';
import { CreditsGame } from '../games/Credits';
import { LoadingScreen } from '../components/LoadingScreen';

export function CreditsPage() {
  const { movies, loading, error } = useDailyPuzzle();
  const { state, update } = useGameState();
  if (loading) return <LoadingScreen />;
  if (error || !movies[0]) return <div style={{ padding: 40, textAlign: 'center', color: '#8B3A3A' }}>Failed to load puzzle data.</div>;
  return <CreditsGame movie={movies[0]} state={state} update={update} />;
}
