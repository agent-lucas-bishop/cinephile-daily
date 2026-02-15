import { useDailyPuzzle } from '../hooks/useDailyPuzzle';
import { useGameState } from '../hooks/useGameState';
import { CreditsGame } from '../games/Credits';
import { GenreBanner } from '../components/GenreBanner';
import { LoadingScreen } from '../components/LoadingScreen';

export function CreditsPage() {
  const { movies, genre, loading, error } = useDailyPuzzle();
  const { state, update } = useGameState();
  if (loading) return <LoadingScreen />;
  if (error || !movies[0]) return <div style={{ padding: 40, textAlign: 'center', color: '#8B3A3A' }}>Failed to load puzzle data.</div>;
  return (
    <>
      <div style={{
        maxWidth: 500,
        margin: '0 auto',
        width: '100%',
        padding: '16px 4px 0',
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          color: 'var(--text-muted)',
          cursor: 'pointer',
        }} onClick={() => window.history.back()}>
          ← RETURN TO DOSSIER
        </div>
      </div>
      {genre && <GenreBanner genre={genre} />}
      <CreditsGame movie={movies[0]} state={state} update={update} />
    </>
  );
}
