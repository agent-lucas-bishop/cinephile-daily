import { useDailyPuzzle } from '../hooks/useDailyPuzzle';
import { useGameState } from '../hooks/useGameState';
import { CreditsGame } from '../games/Credits';

export function CreditsPage() {
  const { movies } = useDailyPuzzle();
  const { state, update } = useGameState();
  return <CreditsGame movie={movies[0]} state={state} update={update} />;
}
