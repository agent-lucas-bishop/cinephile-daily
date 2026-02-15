import { motion } from 'framer-motion';
import { MovieSearch } from '../components/MovieSearch';
import { getScore } from '../utils/scoring';
import { updateStatsAfterGame, updateGameStreak } from '../utils/storage';
import { useIsMobile } from '../hooks/useMediaQuery';
import { NowStreaming } from '../components/NowStreaming';
import type { Movie } from '../types/movie';
import type { DailyState } from '../utils/storage';

interface Props {
  movie: Movie;
  state: DailyState;
  update: (fn: (s: DailyState) => DailyState) => void;
}

const BLUR_LEVELS = [50, 35, 20, 10, 3];

// Progressive clues revealed alongside the unblurring
function getClues(movie: Movie, round: number): string[] {
  const clues: string[] = [];
  // Round 2+: genre
  if (round >= 2) clues.push(`Genre: ${movie.genre}`);
  // Round 3+: tagline (if available)
  if (round >= 3 && movie.tagline) clues.push(`"${movie.tagline}"`);
  // Round 4+: release year
  if (round >= 4) clues.push(`Released: ${movie.year}`);
  // Round 5: director
  if (round >= 5) clues.push(`Director: ${movie.director}`);
  return clues;
}

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
      {/* Darkroom poster area */}
      <div style={{
        position: 'relative',
        margin: '0 auto',
        maxWidth: isMobile ? '85%' : 380,
        width: '100%',
        background: '#0a0a0a',
        padding: isMobile ? 12 : 16,
        border: '1px solid #333',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        overflow: 'hidden',
      }}>
        {/* Darkroom red light effect */}
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'rgba(139, 0, 0, 0.1)',
          mixBlendMode: 'overlay',
          zIndex: 2,
        }} />

        <div style={{
          overflow: 'hidden',
          border: '3px solid #333',
          background: '#0D0A07',
          position: 'relative',
        }}>
          <img
            src={movie.posterUrl}
            alt="Movie poster"
            style={{
              width: '100%',
              display: 'block',
              filter: `blur(${gs.completed ? 0 : blur}px) grayscale(${gs.completed ? 0 : Math.max(0, 100 - round * 20)}%) contrast(1.2)`,
              transition: 'filter 0.6s ease',
              transform: 'scale(1.1)',
            }}
          />
          {/* Developing liquid gradient */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))',
            pointerEvents: 'none',
          }} />
          {/* Scanline overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
            pointerEvents: 'none',
          }} />
        </div>
      </div>

      {/* Cream card below with PaperCard styling */}
      <div style={{
        position: 'relative',
        background: 'var(--cream)',
        border: '2px solid var(--cream-dark)',
        padding: isMobile ? '16px' : '24px',
        marginTop: 16,
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        overflow: 'hidden',
      }}>
        {/* Decorative double-line border inset */}
        <div style={{
          position: 'absolute',
          inset: isMobile ? 8 : 12,
          border: '2px double rgba(26,26,26,0.2)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
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

          {/* Status dots */}
          {!gs.completed && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: i < round ? '#8B3A3A' : '#d4cfc4',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>
          )}

          {/* Gold divider */}
          <div style={{ height: 2, background: '#8B6914', marginBottom: 16 }} />

          {/* Progressive clues */}
          {!gs.completed && round > 1 && (
            <div style={{ marginBottom: 14 }}>
              {getClues(movie, round).map((clue, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '0.85rem',
                    color: '#555',
                    fontStyle: clue.startsWith('"') ? 'italic' : 'normal',
                    margin: '4px 0',
                    padding: '2px 0',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  {clue}
                </motion.p>
              ))}
            </div>
          )}

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

              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '0.8rem',
                color: '#888',
                fontStyle: 'italic',
                textAlign: 'center',
                marginTop: 10,
              }}>
                {5 - round + 1} attempts remaining
              </p>
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

          {gs.completed && (
            <NowStreaming
              providers={movie.watchProviders}
              completed={gs.completed}
            won={gs.won}
            rating={movie.rating}
            tagline={movie.tagline}
            overview={movie.overview}
              movieTitle={movie.title}
            />
          )}
        </div>
      </div>
    </div>
  );
}
