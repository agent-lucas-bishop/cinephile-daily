import { useState } from 'react';
import { motion } from 'framer-motion';
import { RoundIndicator } from '../components/RoundIndicator';
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
  const [hint, setHint] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleGuess = () => {
    const year = parseInt(inputYear, 10);
    if (isNaN(year) || year < 1900 || year > 2030) return;

    const correct = year === movie.year;
    setInputYear('');

    if (correct) {
      setHint(null);
    } else {
      setHint(year < movie.year ? '↑ Higher' : '↓ Lower');
    }

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
      <h2 style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: isMobile ? '1.3rem' : '1.8rem',
        letterSpacing: '0.1em',
        color: 'var(--gold)',
        textAlign: 'center',
        margin: isMobile ? '8px 0 4px' : '16px 0 8px',
      }}>
        THE YEAR
      </h2>
      <p style={{
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontStyle: 'italic',
        fontSize: isMobile ? '0.8rem' : '0.95rem',
        marginBottom: isMobile ? 8 : 16,
      }}>
        When was this film released?
      </p>

      <RoundIndicator current={gs.round} won={gs.won} />

      {/* Movie info */}
      <div style={{
        textAlign: 'center',
        margin: isMobile ? '8px 0' : '20px 0',
        flex: gs.completed ? undefined : 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 0,
      }}>
        <div style={{
          maxWidth: isMobile ? 140 : 200,
          margin: isMobile ? '0 auto 8px' : '0 auto 16px',
          border: '2px solid var(--gold-dark)',
          overflow: 'hidden',
        }}>
          <img
            src={movie.posterUrl}
            alt={movie.title}
            style={{ width: '100%', display: 'block' }}
          />
        </div>
        <h3 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: isMobile ? '1.1rem' : '1.5rem',
          color: 'var(--gold-light)',
          fontWeight: 700,
        }}>
          {movie.title}
        </h3>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: 'var(--text-muted)',
          marginTop: 4,
          fontSize: isMobile ? '0.85rem' : '1rem',
        }}>
          Directed by {movie.director}
        </p>
      </div>

      {/* Previous guesses */}
      {gs.yearGuesses.length > 0 && (
        <div style={{ marginBottom: 8, textAlign: 'center' }}>
          {gs.yearGuesses.map((y, i) => (
            <span key={i} style={{
              display: 'inline-block',
              padding: '3px 10px',
              margin: 2,
              fontSize: isMobile ? '0.85rem' : '1rem',
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: '0.05em',
              color: y === movie.year ? '#4A8B5C' : '#8B3A3A',
              border: `1px solid ${y === movie.year ? 'rgba(74,139,92,0.4)' : 'rgba(139,58,58,0.3)'}`,
            }}>
              {y} {y < movie.year ? '↑' : y > movie.year ? '↓' : '✓'}
            </span>
          ))}
        </div>
      )}

      {hint && !gs.completed && (
        <p style={{
          textAlign: 'center',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: isMobile ? '1rem' : '1.2rem',
          color: 'var(--gold)',
          letterSpacing: '0.1em',
          marginBottom: 8,
        }}>
          {hint}
        </p>
      )}

      {!gs.completed ? (
        <div style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'center',
          maxWidth: 300,
          margin: '0 auto',
          flexShrink: 0,
          paddingBottom: isMobile ? 8 : 16,
        }}>
          <input
            type="number"
            value={inputYear}
            onChange={e => setInputYear(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGuess()}
            placeholder="e.g. 1994"
            min={1900}
            max={2030}
            inputMode="numeric"
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '1.1rem',
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: '0.1em',
              background: 'rgba(28,23,20,0.9)',
              border: '1px solid var(--gold-dark)',
              color: 'var(--cream)',
              outline: 'none',
              textAlign: 'center',
              boxSizing: 'border-box',
              borderRadius: 0,
              WebkitAppearance: 'none',
              minHeight: 44,
            }}
          />
          <button
            onClick={handleGuess}
            style={{
              padding: '12px 20px',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '1rem',
              letterSpacing: '0.1em',
              background: 'var(--burgundy)',
              border: '1px solid var(--gold-dark)',
              color: 'var(--gold)',
              transition: 'all 0.2s',
              minHeight: 44,
              minWidth: 44,
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--burgundy-dark)';
              e.currentTarget.style.borderColor = 'var(--gold)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--burgundy)';
              e.currentTarget.style.borderColor = 'var(--gold-dark)';
            }}
          >
            GUESS
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            textAlign: 'center',
            padding: isMobile ? '12px' : '24px',
            margin: isMobile ? '8px 0' : '16px 0',
            background: gs.won
              ? 'linear-gradient(135deg, rgba(74,139,92,0.1), rgba(28,23,20,0.9))'
              : 'linear-gradient(135deg, rgba(139,58,58,0.1), rgba(28,23,20,0.9))',
            border: `1px solid ${gs.won ? 'rgba(74,139,92,0.4)' : 'rgba(139,58,58,0.3)'}`,
          }}
        >
          <p style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: isMobile ? '1rem' : '1.3rem',
            letterSpacing: '0.1em',
            color: gs.won ? '#4A8B5C' : '#8B3A3A',
          }}>
            {gs.won ? 'CORRECT!' : 'THE ANSWER WAS...'}
          </p>
          <p style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: isMobile ? '2rem' : '3rem',
            color: 'var(--gold-light)',
            margin: '4px 0',
          }}>
            {movie.year}
          </p>
          {gs.won && (
            <p style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: isMobile ? '1.4rem' : '2rem',
              color: 'var(--gold)',
              marginTop: 4,
            }}>
              +{gs.score} PTS
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
