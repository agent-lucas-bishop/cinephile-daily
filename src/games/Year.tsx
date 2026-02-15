import { useState } from 'react';
import { motion } from 'framer-motion';
import { getScore } from '../utils/scoring';
import { updateStatsAfterGame } from '../utils/storage';
import { useIsMobile } from '../hooks/useMediaQuery';
import type { Movie } from '../data/movies';
import type { DailyState } from '../utils/storage';

interface Props {
  movie: Movie;
  state: DailyState;
  update: (fn: (s: DailyState) => DailyState) => void;
}

export function YearGame({ movie, state, update }: Props) {
  const gs = state.games.year;
  const [inputYear, setInputYear] = useState('');
  const isMobile = useIsMobile();

  const handleGuess = () => {
    const year = parseInt(inputYear, 10);
    if (isNaN(year) || year < 1900 || year > 2030) return;

    const correct = year === movie.year;
    setInputYear('');

    update(s => {
      const g = { ...s.games.year };
      g.guesses = [...g.guesses, String(year)];
      g.yearGuesses = [...g.yearGuesses, year];
      if (correct) {
        g.completed = true;
        g.won = true;
        g.score = getScore(g.round);
        updateStatsAfterGame(g.score);
      } else if (g.round >= 5) {
        g.completed = true;
        g.won = false;
        g.score = 0;
      } else {
        g.round += 1;
      }
      return { ...s, games: { ...s.games, year: g } };
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

      {/* Blurred poster with silver frame */}
      <div style={{
        position: 'relative',
        margin: '0 auto',
        maxWidth: isMobile ? '70%' : 320,
        width: '100%',
        padding: 8,
        background: 'linear-gradient(135deg, #c0c0c0, #888, #c0c0c0)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          overflow: 'hidden',
          background: '#0D0A07',
        }}>
          <img
            src={movie.posterUrl}
            alt={movie.title}
            style={{
              width: '100%',
              display: 'block',
              filter: gs.completed ? 'blur(0px)' : `blur(${40 - gs.round * 6}px)`,
              transition: 'filter 0.6s ease',
              transform: 'scale(1.1)',
            }}
          />
        </div>
      </div>

      {/* Cream card */}
      <div style={{
        background: 'var(--cream)',
        border: '2px solid var(--cream-dark)',
        padding: isMobile ? '20px 16px' : '28px 24px',
        marginTop: 16,
        textAlign: 'center',
      }}>
        {/* Art deco line above title */}
        <div style={{ width: 80, height: 2, background: '#1a1a1a', margin: '0 auto 8px' }} />

        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: isMobile ? '1.4rem' : '1.8rem',
          color: '#1a1a1a',
          letterSpacing: '0.1em',
          margin: 0,
          lineHeight: 1,
        }}>
          {movie.title.toUpperCase()}
        </h2>

        {/* Art deco line below title */}
        <div style={{ width: 80, height: 2, background: '#1a1a1a', margin: '8px auto 12px' }} />

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: isMobile ? '0.9rem' : '1rem',
          color: '#555',
          fontStyle: 'italic',
          margin: '0 0 16px',
        }}>
          "Identify the year of release"
        </p>

        {/* Previous guesses */}
        {gs.yearGuesses.length > 0 && !gs.completed && (
          <div style={{ marginBottom: 12 }}>
            {gs.yearGuesses.map((y, i) => (
              <span key={i} style={{
                display: 'inline-block',
                padding: '3px 10px',
                margin: 2,
                fontSize: '0.9rem',
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: '0.05em',
                color: y === movie.year ? '#4A8B5C' : '#8B3A3A',
              }}>
                {y} {y < movie.year ? '↑' : y > movie.year ? '↓' : '✓'}
              </span>
            ))}
          </div>
        )}

        {!gs.completed ? (
          <>
            {/* Year input with gold underline */}
            <div style={{ maxWidth: 200, margin: '0 auto 12px' }}>
              <input
                type="number"
                value={inputYear}
                onChange={e => setInputYear(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGuess()}
                placeholder="YYYY"
                min={1900}
                max={2030}
                inputMode="numeric"
                style={{
                  width: '100%',
                  padding: '8px 0',
                  fontSize: '1.5rem',
                  fontFamily: "'Bebas Neue', sans-serif",
                  letterSpacing: '0.2em',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '3px solid #8B6914',
                  color: '#1a1a1a',
                  outline: 'none',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                  borderRadius: 0,
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield' as never,
                }}
              />
            </div>

            <button
              onClick={handleGuess}
              style={{
                padding: '10px 32px',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '0.9rem',
                letterSpacing: '0.15em',
                background: '#1a1a1a',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              STAMP DATE
            </button>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ padding: 8 }}
          >
            <p style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              color: gs.won ? '#4A8B5C' : '#8B3A3A',
            }}>
              {gs.won ? 'DATE CONFIRMED!' : 'INCORRECT DATE...'}
            </p>
            <p style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '2rem',
              color: '#1a1a1a',
              margin: '4px 0',
            }}>
              {movie.year}
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

        {/* Dashed line separator */}
        <div style={{
          borderTop: '2px dashed #c0c0c0',
          margin: '16px 0',
        }} />

        {/* Attempt indicators */}
        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
        }}>
          {Array.from({ length: 5 }).map((_, i) => {
            const used = i < gs.round;
            const isCorrect = gs.won && i === gs.round - 1;
            return (
              <div
                key={i}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: `2px solid ${isCorrect ? '#4A8B5C' : used ? '#c0c0c0' : '#e0d8c8'}`,
                  background: isCorrect ? '#4A8B5C' : used ? '#c0c0c0' : 'transparent',
                  transition: 'all 0.3s',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
