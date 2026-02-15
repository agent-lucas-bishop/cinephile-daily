import { motion, AnimatePresence } from 'framer-motion';
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

export function CreditsGame({ movie, state, update }: Props) {
  const gs = state.games.credits;
  const round = gs.round;
  const isMobile = useIsMobile();

  const handleGuess = (title: string) => {
    const correct = title.toLowerCase() === movie.title.toLowerCase();
    update(s => {
      const g = { ...s.games.credits };
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
      return { ...s, games: { ...s.games, credits: g } };
    });
  };

  // Progressive clues by round
  const clues: React.ReactNode[] = [];

  clues.push(
    <ClueSection key="r1" label="DIRECTOR" value={movie.director} isMobile={isMobile} />,
    <ClueSection key="r1c" label="STARRING" value={movie.cast.slice(0, 3).join(' · ')} isMobile={isMobile} />,
    <ClueSection key="r1g" label="GENRE" value={movie.genre} isMobile={isMobile} />,
  );

  if (round >= 2) {
    clues.push(
      <ClueSection key="r2c" label="ALSO STARRING" value={movie.cast[3] ?? ''} isMobile={isMobile} />,
      <ClueSection key="r2w" label="WRITTEN BY" value={movie.writers.join(' & ')} isMobile={isMobile} />,
      <ClueSection key="r2y" label="YEAR" value={String(movie.year)} isMobile={isMobile} />,
    );
  }

  if (round >= 3) {
    clues.push(
      <div key="r3p" style={{ margin: isMobile ? '8px 0' : '16px 0' }}>
        <BlurryPoster url={movie.posterUrl} blur={40} maxWidth={isMobile ? 120 : 180} />
      </div>,
      <ClueSection key="r3ch" label="CHARACTERS" value={movie.characters.slice(0, 3).join(' · ')} isMobile={isMobile} />,
    );
  }

  if (round >= 4) {
    clues.push(
      <div key="r4p" style={{ margin: isMobile ? '8px 0' : '16px 0' }}>
        <BlurryPoster url={movie.posterUrl} blur={15} maxWidth={isMobile ? 140 : 200} />
      </div>,
      <ClueSection key="r4k" label="PLOT KEYWORDS" value={movie.plotKeywords.join(' · ')} isMobile={isMobile} />,
    );
  }

  if (round >= 5) {
    clues.push(
      <div key="r5p" style={{ margin: isMobile ? '8px 0' : '16px 0' }}>
        <BlurryPoster url={movie.posterUrl} blur={4} maxWidth={isMobile ? 150 : 220} />
      </div>,
      <ClueSection key="r5t" label="TAGLINE" value={`"${movie.tagline}"`} isMobile={isMobile} />,
    );
  }

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
        THE CREDITS
      </h2>
      <p style={{
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontStyle: 'italic',
        fontSize: isMobile ? '0.8rem' : '0.95rem',
        marginBottom: isMobile ? 8 : 16,
      }}>
        Name the film from its credits
      </p>

      <RoundIndicator current={round} won={gs.won} />

      <AnimatePresence mode="wait">
        <motion.div
          key={round}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: 'rgba(28,23,20,0.6)',
            border: '1px solid rgba(212,168,67,0.2)',
            padding: isMobile ? '12px' : '20px',
            margin: isMobile ? '8px 0' : '16px 0',
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
          }}
        >
          {clues}
        </motion.div>
      </AnimatePresence>

      {/* Wrong guesses */}
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
        <GameResult won={gs.won} score={gs.score} movie={movie} isMobile={isMobile} />
      )}
    </div>
  );
}

function ClueSection({ label, value, isMobile }: { label: string; value: string; isMobile: boolean }) {
  if (!value) return null;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ marginBottom: isMobile ? 6 : 10 }}
    >
      <span style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: isMobile ? '0.65rem' : '0.75rem',
        letterSpacing: '0.15em',
        color: 'var(--gold-dark)',
      }}>
        {label}
      </span>
      <p style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: isMobile ? '0.9rem' : '1.1rem',
        color: 'var(--cream)',
        margin: '1px 0 0',
      }}>
        {value}
      </p>
    </motion.div>
  );
}

function GameResult({ won, score, movie, isMobile }: { won: boolean; score: number; movie: Movie; isMobile: boolean }) {
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
        {movie.title}
      </p>
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        color: 'var(--text-muted)',
        fontSize: isMobile ? '0.8rem' : '1rem',
      }}>
        {movie.year} · Directed by {movie.director}
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
