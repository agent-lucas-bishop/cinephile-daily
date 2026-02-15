import { useDailyPuzzle } from '../hooks/useDailyPuzzle';
import { useGameState } from '../hooks/useGameState';
import { PosterGame } from '../games/Poster';

export function PosterPage() {
  const { movies } = useDailyPuzzle();
  const { state, update } = useGameState();
  return <PosterGame movie={movies[1]} state={state} update={update} />;
}
