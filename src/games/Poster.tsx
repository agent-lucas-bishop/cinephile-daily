import { motion } from 'framer-motion';
import { MovieSearch } from '../components/MovieSearch';
import { getScore } from '../utils/scoring';
import { updateStatsAfterGame, updateGameStreak } from '../utils/storage';
import { useIsMobile } from '../hooks/useMediaQuery';
import type { Movie } from '../types/movie';
import type { DailyState } from '../utils/storage';

interface Props {
  movie: Movie;
  state: DailyState;
  update: (fn: (s: DailyState) => DailyState) => void;
}

const BLUR_LEVELS = [50, 35, 20, 10, 3];

export function PosterGame({ movie, state, update }: Props) {
  const gs = state.games.poster;
  const round = gs.round;
  const blur = BLUR_LEVELS[Math.min(round - 1, 4)];
  const isMobile = useIsMobile();

  const handleGuess = (title: string) => {
    const correct = title.toLowerCase() === movie.title.toLowerCase();
    update(s => {
      const g = { ...s.games.poster };
      g.guesses = [...g.guesses, title];
      if (correct) {
        g.completed = true;
        g.won = true;
        g.score = getScore(g.round);
        updateStatsAfterGame(g.score);
        updateGameStreak('poster', g.score, true);
      } else if (g.round >= 5) {
        g.completed = true;
        g.won = false;
        g.score = 0;
        updateGameStreak('poster', 0, false);
      } else {
        g.round += 1;
      }
      return { ...s, games: { ...s.games, poster: g } };
    });
  };

  const handleHint = () => {
    update(s => {
      const g = { ...s.games.poster };
      if (g.round < 5 && !g.completed) {
        g.round += 1;
      }
      return { ...s, games: { ...s.games, poster: g } };
    });
  };

  return (
    <div style={{
      padding: isMobile ? '0 4px' : '0 20px',
      maxWidth: 500,
      margin: '0 auto',
      width: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Back link */}
      <div style={{
        padding: '8px 0',
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '0.75rem',
        letterSpacing: '0.2em',
        color: 'var(--text-muted)',
        cursor: 'pointer',
      }} onClick={() => window.history.back()}>
        ← RETURN TO DOSSIER
      </div>

      {/* Large blurred poster */}
      <div style={{
        position: 'relative',
        margin: '0 auto',
        maxWidth: isMobile ? '85%' : 380,
        width: '100%',
        border: '3px solid #333',
        background: '#0D0A07',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        <img
          src={movie.posterUrl}
          alt="Movie poster"
          style={{
            width: '100%',
            display: 'block',
            filter: `blur(${gs.completed ? 0 : blur}px)`,
            transition: 'filter 0.6s ease',
            transform: 'scale(1.1)',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Cream card below */}
      <div style={{
        background: 'var(--cream)',
        border: '2px solid var(--cream-dark)',
        padding: isMobile ? '16px' : '24px',
        marginTop: 16,
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: isMobile ? '1.4rem' : '1.8rem',
          color: '#6B1D2A',
          fontWeight: 700,
          fontStyle: 'italic',
          margin: 0,
        }}>
          Visual Decryption
        </h2>
        <p style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '0.6rem',
          letterSpacing: '0.25em',
          color: '#666',
          margin: '2px 0 12px',
        }}>
          IDENTIFY FILM FROM RECOVERED ASSETS
        </p>

        {/* Gold divider */}
        <div style={{ height: 2, background: '#8B6914', marginBottom: 16 }} />

        {/* Wrong guesses */}
        {gs.guesses.length > 0 && (
          <div style={{ marginBottom: 12, textAlign: 'center' }}>
            {gs.guesses.map((g, i) => (
              <span key={i} style={{
                display: 'inline-block',
                padding: '2px 8px',
                margin: 2,
                fontSize: '0.75rem',
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: '0.05em',
                color: g.toLowerCase() === movie.title.toLowerCase() ? '#4A8B5C' : '#8B3A3A',
                textDecoration: g.toLowerCase() === movie.title.toLowerCase() ? 'none' : 'line-through',
              }}>
                {g}
              </span>
            ))}
          </div>
        )}

        {!gs.completed ? (
          <>
            {/* Search input with burgundy border */}
            <div style={{
              border: '2px solid #6B1D2A',
              marginBottom: 12,
            }}>
              <MovieSearch
                onSelect={handleGuess}
                placeholder="ENTER FILM TITLE..."
                variant="cream"
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                style={{
                  flex: 1,
                  padding: '10px',
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '0.9rem',
                  letterSpacing: '0.15em',
                  background: '#1a1a1a',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                IDENTIFY
              </button>
              <button
                onClick={handleHint}
                style={{
                  width: 44,
                  height: 44,
                  background: '#8B6914',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                👁
              </button>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: 8 }}
          >
            <p style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              color: gs.won ? '#4A8B5C' : '#8B3A3A',
            }}>
              {gs.won ? 'FILM IDENTIFIED!' : 'CASE REMAINS OPEN...'}
            </p>
            <p style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.3rem',
              color: '#1a1a1a',
              fontWeight: 700,
              margin: '4px 0',
            }}>
              {movie.title}
            </p>
            {gs.won && (
              <p style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '1.5rem',
                color: '#8B6914',
                marginTop: 4,
              }}>
                +{gs.score} PTS
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
