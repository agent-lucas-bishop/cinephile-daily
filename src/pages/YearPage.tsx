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
      <div style={{
        maxWidth: 500,
        margin: '0 auto',
        width: '100%',
        padding: '16px 4px 0',
      }}>
        <button
          onClick={() => window.history.back()}
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            color: 'var(--cream)',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            padding: '8px 16px',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        >
          ← RETURN TO DOSSIER
        </button>
      </div>
      {genre && <GenreBanner genre={genre} />}
      <YearGame movie={movies[2]} state={state} update={update} />
    </>
  );
}
