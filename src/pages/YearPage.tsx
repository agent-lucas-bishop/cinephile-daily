import { useDailyPuzzle } from '../hooks/useDailyPuzzle';
import { useGameState } from '../hooks/useGameState';
import { YearGame } from '../games/Year';

export function YearPage() {
  const { movies } = useDailyPuzzle();
  const { state, update } = useGameState();
  return <YearGame movie={movies[2]} state={state} update={update} />;
}
