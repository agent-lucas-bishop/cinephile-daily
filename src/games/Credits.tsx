import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MovieSearch } from '../components/MovieSearch';
import { getScore } from '../utils/scoring';
import { updateStatsAfterGame, updateGameStreak } from '../utils/storage';
import { useIsMobile } from '../hooks/useMediaQuery';
import { getHeadshotUrl } from '../types/movie';
import { NowStreaming } from '../components/NowStreaming';
import { PlayMoreButton } from '../components/PlayMoreButton';
import type { Movie } from '../types/movie';
import type { DailyState } from '../utils/storage';

interface Props {
  movie: Movie;
  state: DailyState;
  update: (fn: (s: DailyState) => DailyState) => void;
  endless?: boolean;
}

const BLUR_LEVELS = [80, 50, 30, 15, 5];

const CHALK_TEXTURE = 'https://www.transparenttextures.com/patterns/black-chalk.png';

export function CreditsGame({ movie, state, update, endless }: Props) {
  const gs = state.games.credits;
  const round = gs.round;
  const isMobile = useIsMobile();
  const caseNumber = String(movie.id * 137 + movie.year).slice(-4);
  const posterBlur = BLUR_LEVELS[Math.min(round - 1, 4)];

  // Generate stable random rotations for cast cards
  const castRotations = useMemo(() => {
    const seed = movie.id;
    return movie.cast.map((_, i) => {
      const x = Math.sin(seed * 9301 + i * 4973) * 10000;
      return ((x - Math.floor(x)) * 6) - 3; // -3 to 3 degrees
    });
  }, [movie.id, movie.cast]);

  const handleGuess = (title: string) => {
    const correct = title.toLowerCase() === movie.title.toLowerCase();
    update(s => {
      const g = { ...s.games.credits };
      g.guesses = [...g.guesses, title];
      if (correct) {
        g.completed = true;
        g.won = true;
        g.score = getScore(g.round);
        if (!endless) { updateStatsAfterGame(g.score); updateGameStreak('credits', g.score, true); }
      } else if (g.round >= 5) {
        g.completed = true;
        g.won = false;
        g.score = 0;
        if (!endless) { updateGameStreak('credits', 0, false); }
      } else {
        g.round += 1;
      }
      return { ...s, games: { ...s.games, credits: g } };
    });
  };

  const handleHint = () => {
    update(s => {
      const g = { ...s.games.credits };
      if (g.round < 5 && !g.completed) {
        g.round += 1;
      }
      return { ...s, games: { ...s.games, credits: g } };
    });
  };

  const visibleCast = round >= 2 ? movie.cast.slice(0, Math.min(round + 2, movie.cast.length)) : movie.cast.slice(0, 3);
  const showWriters = round >= 2;
  const showYear = round >= 3;
  const showCharacters = round >= 3;

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
      {/* Main cream card with PaperCard styling */}
      <div style={{
        position: 'relative',
        background: 'var(--cream)',
        border: '2px solid var(--cream-dark)',
        padding: isMobile ? '16px' : '24px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      }}>
        {/* Decorative double-line border inset */}
        <div style={{
          position: 'absolute',
          inset: isMobile ? 8 : 12,
          border: '2px double rgba(26,26,26,0.2)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* Header row: poster thumbnail + case info + search */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, position: 'relative', zIndex: 100 }}>
          {/* Blurred poster thumbnail */}
          <div style={{
            width: isMobile ? 70 : 90,
            flexShrink: 0,
            border: '2px solid #333',
            background: '#0D0A07',
            overflow: 'hidden',
            position: 'relative',
          }}>
            <img
              src={movie.posterUrl}
              alt="?"
              style={{
                width: '100%',
                display: 'block',
                filter: `blur(${gs.completed ? 0 : posterBlur}px)`,
                transition: 'filter 0.6s ease',
                transform: 'scale(1.15)',
              }}
            />
            {!gs.completed && posterBlur > 30 && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold)',
                fontSize: '1.5rem',
                fontFamily: "'Playfair Display', serif",
                textShadow: '0 0 10px rgba(0,0,0,0.8)',
              }}>?</div>
            )}
          </div>

          {/* Case info + search */}
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: isMobile ? '1.3rem' : '1.6rem',
              color: '#6B1D2A',
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.1,
            }}>
              Case #{caseNumber}
            </h2>
            <p style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '0.65rem',
              letterSpacing: '0.25em',
              color: '#666',
              margin: '2px 0 8px',
            }}>
              IDENTIFY THE MOTION PICTURE
            </p>

            {/* Status dots showing attempts remaining */}
            {!gs.completed && (
              <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: i < round ? '#8B3A3A' : 'rgba(197,160,89,0.5)',
                    transition: 'background 0.3s',
                  }} />
                ))}
              </div>
            )}

            {!gs.completed && (
              <>
                <div style={{ position: 'relative', zIndex: 9999 }}>
                  <MovieSearch
                    onSelect={handleGuess}
                    placeholder="SEARCH EVIDENCE..."
                    variant="cream"
                  />
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button
                    onClick={() => {/* submit handled by MovieSearch */}}
                    style={{
                      flex: 1,
                      padding: '8px',
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '0.85rem',
                      letterSpacing: '0.15em',
                      background: '#1a1a1a',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    SUBMIT
                  </button>
                  <button
                    onClick={handleHint}
                    style={{
                      padding: '8px 16px',
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '0.85rem',
                      letterSpacing: '0.1em',
                      background: 'transparent',
                      color: '#666',
                      border: '1px solid #ccc',
                      cursor: 'pointer',
                    }}
                  >
                    Hint
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--cream-dark)', margin: '4px 0 16px', position: 'relative', zIndex: 10 }} />

        {/* Clues area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={round}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ flex: 1, position: 'relative', zIndex: 10 }}
          >
            {/* Director banner — angled with chalk texture */}
            <div style={{
              background: 'linear-gradient(135deg, #2a2320, #1a1714)',
              padding: isMobile ? '14px 16px' : '18px 24px',
              textAlign: 'center',
              marginBottom: 16,
              borderRadius: 0,
              position: 'relative',
              transform: 'rotate(-1deg)',
              border: '4px solid #333',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}>
              {/* Chalk texture overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.1,
                pointerEvents: 'none',
                backgroundImage: `url('${CHALK_TEXTURE}')`,
              }} />
              <span style={{
                display: 'inline-block',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '0.6rem',
                letterSpacing: '0.3em',
                color: '#6B1D2A',
                background: 'var(--cream)',
                padding: '2px 10px',
                marginBottom: 6,
                position: 'relative',
                zIndex: 1,
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }}>
                DIRECTOR
              </span>
              <p style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: isMobile ? '1.1rem' : '1.3rem',
                color: 'var(--cream)',
                fontWeight: 600,
                margin: 0,
                position: 'relative',
                zIndex: 1,
                letterSpacing: '0.03em',
              }}>
                {movie.director}
              </p>
            </div>

            {/* Screenplay (round 2+) */}
            {showWriters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center', marginBottom: 16 }}
              >
                <div style={{ height: 1, background: '#d4c5a9', marginBottom: 12 }} />
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '0.6rem',
                  letterSpacing: '0.25em',
                  color: '#8B6914',
                }}>
                  SCREENPLAY BY
                </span>
                <p style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  color: '#333',
                  fontStyle: 'italic',
                  margin: '2px 0 0',
                }}>
                  {movie.writers.join(' & ')}
                </p>
              </motion.div>
            )}

            {/* Release year (round 3+) */}
            {showYear && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center', marginBottom: 16 }}
              >
                <div style={{ height: 1, background: '#d4c5a9', marginBottom: 12 }} />
                <span style={{
                  display: 'inline-block',
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '0.6rem',
                  letterSpacing: '0.3em',
                  color: '#6B1D2A',
                  background: '#f0e0c0',
                  padding: '2px 10px',
                  border: '1px solid #6B1D2A',
                  marginBottom: 4,
                }}>
                  RELEASE YEAR
                </span>
                <p style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '1.4rem',
                  color: '#1a1a1a',
                  letterSpacing: '0.1em',
                  margin: 0,
                }}>
                  {movie.year}
                </p>
              </motion.div>
            )}

            {/* Cast polaroid cards with random tilts */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: isMobile ? 8 : 12,
              justifyContent: 'center',
              marginTop: 8,
            }}>
              {visibleCast.map((member, i) => {
                const headshot = getHeadshotUrl(member.profilePath);
                const rotation = castRotations[i] ?? 0;
                return (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="cast-polaroid"
                    style={{
                      width: isMobile ? 'calc(33% - 6px)' : 110,
                      background: '#fff',
                      padding: 6,
                      paddingBottom: 10,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
                      transform: `rotate(${rotation}deg)`,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease, z-index 0s',
                      cursor: 'default',
                      position: 'relative',
                    }}
                  >
                    <div style={{
                      width: '100%',
                      aspectRatio: '3/4',
                      background: '#222',
                      overflow: 'hidden',
                    }}>
                      {headshot ? (
                        <img
                          src={headshot}
                          alt={member.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'sepia(0.2)',
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#666',
                          fontSize: '2rem',
                        }}>🎭</div>
                      )}
                    </div>
                    <p style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: isMobile ? '0.55rem' : '0.65rem',
                      letterSpacing: '0.15em',
                      color: '#333',
                      textAlign: 'center',
                      margin: '4px 0 0',
                      lineHeight: 1.2,
                    }}>
                      {member.name.toUpperCase()}
                    </p>
                    {showCharacters && (
                      <p style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: isMobile ? '0.6rem' : '0.7rem',
                        color: '#888',
                        textAlign: 'center',
                        fontStyle: 'italic',
                        margin: '1px 0 0',
                        lineHeight: 1.2,
                      }}>
                        as {member.character}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Wrong guesses */}
        {gs.guesses.length > 0 && (
          <div style={{ marginTop: 12, textAlign: 'center', position: 'relative', zIndex: 10 }}>
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

        {/* Result */}
        {gs.completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              textAlign: 'center',
              padding: 16,
              marginTop: 16,
              background: gs.won ? 'rgba(74,139,92,0.08)' : 'rgba(139,58,58,0.08)',
              border: `1px solid ${gs.won ? '#4A8B5C' : '#8B3A3A'}`,
              position: 'relative',
              zIndex: 10,
            }}
          >
            <p style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              color: gs.won ? '#4A8B5C' : '#8B3A3A',
            }}>
              {gs.won ? 'CASE SOLVED!' : 'CASE REMAINS OPEN...'}
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
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: '#666',
              fontSize: '0.9rem',
            }}>
              {movie.year} · Directed by {movie.director}
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

        {gs.completed && !endless && (
          <PlayMoreButton gameType="credits" />
        )}
      </div>
    </div>
  );
}
