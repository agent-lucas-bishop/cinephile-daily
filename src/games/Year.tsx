import { useState } from 'react';
import { motion } from 'framer-motion';
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
        updateGameStreak('year', g.score, true);
      } else if (g.round >= 5) {
        g.completed = true;
        g.won = false;
        g.score = 0;
        updateGameStreak('year', 0, false);
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

      {/* Tilted poster with white border frame */}
      <div className="year-poster" style={{
        position: 'relative',
        margin: '0 auto 16px',
        maxWidth: isMobile ? '60%' : 260,
        width: '100%',
        padding: 6,
        background: '#fff',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        transform: 'rotate(-2deg)',
        transition: 'transform 0.5s ease',
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
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Ticket-style cream card */}
      <div style={{
        position: 'relative',
        background: 'var(--cream)',
        border: '2px solid var(--cream-dark)',
        padding: isMobile ? '20px 16px' : '28px 24px',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        overflow: 'visible',
      }}>
        {/* Ticket perforations */}
        <div style={{
          position: 'absolute',
          left: -8,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 16,
          height: 32,
          background: 'var(--dark-bg)',
          borderRadius: '0 16px 16px 0',
        }} />
        <div style={{
          position: 'absolute',
          right: -8,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 16,
          height: 32,
          background: 'var(--dark-bg)',
          borderRadius: '16px 0 0 16px',
        }} />

        {/* Decorative double-line border inset */}
        <div style={{
          position: 'absolute',
          inset: isMobile ? 8 : 12,
          border: '2px double rgba(26,26,26,0.2)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
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
    </div>
  );
}
