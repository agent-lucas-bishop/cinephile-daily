import { motion } from 'framer-motion';
import { MovieSearch } from '../components/MovieSearch';
import { RoundIndicator } from '../components/RoundIndicator';
import { BlurryPoster } from '../components/BlurryPoster';
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
      } else if (g.round >= 5) {
        g.completed = true;
        g.won = false;
        g.score = 0;
      } else {
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
      <h2 style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: isMobile ? '1.3rem' : '1.8rem',
        letterSpacing: '0.1em',
        color: 'var(--gold)',
        textAlign: 'center',
        margin: isMobile ? '8px 0 4px' : '16px 0 8px',
      }}>
        THE POSTER
      </h2>
      <p style={{
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontStyle: 'italic',
        fontSize: isMobile ? '0.8rem' : '0.95rem',
        marginBottom: isMobile ? 8 : 16,
      }}>
        Name the film from its poster
      </p>

      <RoundIndicator current={round} won={gs.won} />

      <div style={{
        margin: isMobile ? '8px 0' : '20px 0',
        flex: gs.completed ? undefined : 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 0,
      }}>
        <BlurryPoster
          url={movie.posterUrl}
          blur={gs.completed ? 0 : blur}
          maxWidth={isMobile ? 200 : 300}
        />
      </div>

      {gs.guesses.length > 0 && (
        <div style={{ marginBottom: 8, textAlign: 'center' }}>
          {gs.guesses.map((g, i) => (
            <span key={i} style={{
              display: 'inline-block',
              padding: '2px 8px',
              margin: 2,
              fontSize: isMobile ? '0.75rem' : '0.85rem',
              color: g.toLowerCase() === movie.title.toLowerCase() ? '#4A8B5C' : '#8B3A3A',
              border: `1px solid ${g.toLowerCase() === movie.title.toLowerCase() ? 'rgba(74,139,92,0.4)' : 'rgba(139,58,58,0.3)'}`,
              fontFamily: "'Cormorant Garamond', serif",
              textDecoration: g.toLowerCase() === movie.title.toLowerCase() ? 'none' : 'line-through',
            }}>
              {g}
            </span>
          ))}
        </div>
      )}

      {!gs.completed ? (
        <div style={{ flexShrink: 0, paddingBottom: isMobile ? 8 : 16 }}>
          <MovieSearch onSelect={handleGuess} placeholder={`Guess ${round} of 5...`} />
        </div>
      ) : (
        <CompactResult won={gs.won} score={gs.score} title={movie.title} isMobile={isMobile} />
      )}
    </div>
  );
}

function CompactResult({ won, score, title, isMobile }: { won: boolean; score: number; title: string; isMobile: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        textAlign: 'center',
        padding: isMobile ? '12px' : '24px',
        margin: isMobile ? '8px 0' : '16px 0',
        background: won
          ? 'linear-gradient(135deg, rgba(74,139,92,0.1), rgba(28,23,20,0.9))'
          : 'linear-gradient(135deg, rgba(139,58,58,0.1), rgba(28,23,20,0.9))',
        border: `1px solid ${won ? 'rgba(74,139,92,0.4)' : 'rgba(139,58,58,0.3)'}`,
      }}
    >
      <p style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: isMobile ? '1rem' : '1.3rem',
        letterSpacing: '0.1em',
        color: won ? '#4A8B5C' : '#8B3A3A',
      }}>
        {won ? 'CORRECT!' : 'THE ANSWER WAS...'}
      </p>
      <p style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: isMobile ? '1.1rem' : '1.5rem',
        color: 'var(--gold-light)',
        margin: '4px 0',
        fontWeight: 700,
      }}>
        {title}
      </p>
      {won && (
        <p style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: isMobile ? '1.4rem' : '2rem',
          color: 'var(--gold)',
          marginTop: 4,
        }}>
          +{score} PTS
        </p>
      )}
    </motion.div>
  );
}
