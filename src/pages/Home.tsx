import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDailyPuzzle } from '../hooks/useDailyPuzzle';
import { useGameState } from '../hooks/useGameState';
import { getAllGameStreaks } from '../utils/storage';
import { useIsMobile } from '../hooks/useMediaQuery';
import { LoadingScreen } from '../components/LoadingScreen';

const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E`;

const COLORS = {
  paper: '#F4F1EA',
  ink: '#1A1A1A',
  gold: '#C5A059',
  red: '#720e0e',
};

export function Home() {
  const { genre, loading } = useDailyPuzzle();
  const { state } = useGameState();
  const streaks = getAllGameStreaks();
  const gs = state.games;
  const totalScore = gs.credits.score + gs.poster.score + gs.year.score;
  const allDone = gs.credits.completed && gs.poster.completed && gs.year.completed;
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (loading) return <LoadingScreen />;

  const games = [
    { key: 'credits' as const, title: 'THE CREDITS', icon: '🎭', path: '/credits', emoji: '🎭' },
    { key: 'poster' as const, title: 'THE POSTER', icon: '🖼️', path: '/poster', emoji: '🖼️' },
    { key: 'year' as const, title: 'THE YEAR', icon: '📅', path: '/year', emoji: '📅' },
  ];

  function buildEmojiRow(score: number): string {
    return '🟩'.repeat(score) + '⬛'.repeat(5 - score);
  }

  function formatDate(): string {
    const d = new Date();
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function handleShare() {
    const lines = [
      `🎬 Cinéphile Daily — ${formatDate()}`,
      '',
      ...games.map(g => {
        const s = gs[g.key];
        return `${g.emoji} ${g.title}: ${s.score}/5 ${buildEmojiRow(s.score)}`;
      }),
      '',
      `Total: ${totalScore}/15 | 🔥 Streaks: ${streaks.credits.streak}/${streaks.poster.streak}/${streaks.year.streak}`,
      '',
      'Play at cinephile-daily.vercel.app',
    ];
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{
      padding: isMobile ? '0 4px 24px' : '0 20px 40px',
      maxWidth: 500,
      margin: '0 auto',
      width: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Category label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: 'center',
          margin: isMobile ? '8px 0 20px' : '12px 0 28px',
        }}
      >
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: isMobile ? '0.7rem' : '0.8rem',
          letterSpacing: '0.3em',
          color: '#666',
          padding: '4px 16px',
          border: '1px solid #555',
          display: 'inline-block',
          background: 'rgba(0,0,0,0.3)',
        }}>
          SELECT CATEGORY
        </span>
      </motion.div>

      {/* Game cards */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? 16 : 20,
        flex: allDone ? 0 : 1,
      }}>
        {games.map((game, index) => {
          const gameState = gs[game.key];
          const streak = streaks[game.key];
          return (
            <PaperGameCard
              key={game.key}
              title={game.title}
              icon={game.icon}
              path={game.path}
              score={gameState.score}
              completed={gameState.completed}
              won={gameState.won}
              streak={streak.streak}
              index={index}
              navigate={navigate}
              isMobile={isMobile}
            />
          );
        })}
      </div>

      {/* Share screen when all done */}
      {allDone && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{ marginTop: isMobile ? 20 : 28 }}
        >
          <div style={{
            position: 'relative',
            backgroundColor: COLORS.paper,
            color: COLORS.ink,
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            overflow: 'hidden',
          }}>
            {/* Paper texture */}
            <div style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              opacity: 0.2,
              mixBlendMode: 'multiply' as const,
              backgroundImage: `url("${NOISE_SVG}")`,
            }} />
            {/* Double border inset */}
            <div style={{
              position: 'absolute',
              inset: isMobile ? 8 : 12,
              border: '2px double rgba(26,26,26,0.2)',
              pointerEvents: 'none',
            }} />

            <div style={{
              position: 'relative',
              zIndex: 10,
              padding: isMobile ? '24px 16px' : '32px 24px',
              textAlign: 'center',
            }}>
              {/* Gold decorative line */}
              <div style={{ width: 60, height: 3, background: COLORS.gold, margin: '0 auto 12px' }} />

              <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: isMobile ? '1.6rem' : '2rem',
                fontWeight: 900,
                color: COLORS.ink,
                margin: '0 0 4px',
              }}>
                DAILY RESULTS
              </h2>
              <p style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '0.65rem',
                letterSpacing: '0.3em',
                color: '#888',
                marginBottom: 16,
              }}>
                {formatDate().toUpperCase()}
              </p>

              {/* Results per game */}
              {games.map((game) => {
                const s = gs[game.key];
                const sk = streaks[game.key];
                return (
                  <div key={game.key} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #e0dcd4',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '1.1rem' }}>{game.icon}</span>
                      <span style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: '0.85rem',
                        letterSpacing: '0.1em',
                        color: COLORS.ink,
                      }}>
                        {game.title}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '0.8rem', letterSpacing: 1 }}>
                        {buildEmojiRow(s.score)}
                      </span>
                      <span style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: '0.9rem',
                        color: s.won ? '#4A8B5C' : COLORS.red,
                        minWidth: 30,
                        textAlign: 'right',
                      }}>
                        {s.score}/5
                      </span>
                      {sk.streak > 0 && (
                        <span style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: '0.7rem',
                          color: COLORS.gold,
                        }}>
                          🔥{sk.streak}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Total score */}
              <div style={{ margin: '20px 0 16px' }}>
                <p style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '0.7rem',
                  letterSpacing: '0.25em',
                  color: '#888',
                }}>
                  TOTAL SCORE
                </p>
                <p style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: isMobile ? '2.5rem' : '3rem',
                  fontWeight: 900,
                  color: COLORS.gold,
                  lineHeight: 1,
                  margin: '4px 0',
                }}>
                  {totalScore}/15
                </p>
              </div>

              {/* Share button */}
              <button
                onClick={handleShare}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '1rem',
                  letterSpacing: '0.2em',
                  background: COLORS.ink,
                  color: COLORS.paper,
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: 8,
                  transition: 'background 0.2s',
                }}
              >
                {copied ? '✓ COPIED TO CLIPBOARD' : '📋 SHARE RESULTS'}
              </button>

              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '0.9rem',
                color: '#888',
                fontStyle: 'italic',
                marginTop: 8,
              }}>
                Come back tomorrow for a new puzzle
              </p>

              {/* Gold decorative line */}
              <div style={{ width: 60, height: 3, background: COLORS.gold, margin: '12px auto 0' }} />
            </div>
          </div>
        </motion.div>
      )}

      {/* Today's genre badge */}
      {genre && (
        <div style={{
          textAlign: 'center',
          marginTop: 20,
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          color: 'var(--text-dim)',
        }}>
          TODAY'S GENRE · {genre.toUpperCase()}
        </div>
      )}
    </div>
  );
}

interface PaperGameCardProps {
  title: string;
  icon: string;
  path: string;
  score: number;
  completed: boolean;
  won: boolean;
  streak: number;
  index: number;
  navigate: (path: string) => void;
  isMobile: boolean;
}

function PaperGameCard({ title, icon, path, score, completed, won, streak, index, navigate, isMobile }: PaperGameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 * index, duration: 0.5, ease: 'easeOut' }}
      onClick={() => navigate(path)}
      style={{
        position: 'relative',
        backgroundColor: '#F4F1EA',
        color: '#1A1A1A',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        cursor: 'pointer',
        transition: 'transform 0.3s, box-shadow 0.3s',
        overflow: 'hidden',
      }}
      whileHover={{ scale: 1.005, boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}
      whileTap={{ scale: 0.995 }}
    >
      {/* Paper texture overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: 0.2,
        mixBlendMode: 'multiply' as const,
        backgroundImage: `url("${NOISE_SVG}")`,
      }} />

      {/* Decorative double border inset */}
      <div style={{
        position: 'absolute',
        inset: isMobile ? 6 : 10,
        border: '2px double rgba(26,26,26,0.15)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: isMobile ? '20px 16px' : '28px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? 12 : 16,
      }}>
        {/* Icon circle */}
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.3rem',
          flexShrink: 0,
          boxShadow: '0 0 0 3px rgba(26,26,26,0.1)',
        }}>
          {icon}
        </div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: isMobile ? '1.3rem' : '1.5rem',
            letterSpacing: '0.1em',
            color: '#1a1a1a',
            margin: 0,
          }}>
            {title}
          </h3>
          {completed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '0.9rem',
                letterSpacing: '0.1em',
                color: won ? '#4A8B5C' : '#720e0e',
              }}>
                {won ? `SOLVED · ${score}/5 PTS` : 'UNSOLVED · 0/5'}
              </span>
              {streak > 0 && (
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '0.7rem',
                  color: COLORS.gold,
                }}>
                  🔥{streak}
                </span>
              )}
            </div>
          ) : (
            <p style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '0.7rem',
              letterSpacing: '0.25em',
              color: COLORS.gold,
              margin: '2px 0 0',
            }}>
              OPEN CASE FILES →
            </p>
          )}
        </div>

        {/* Score badge */}
        {completed && (
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.4rem',
            fontWeight: 900,
            color: won ? '#4A8B5C' : '#999',
          }}>
            {score}/5
          </div>
        )}
        {!completed && (
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: isMobile ? '0.85rem' : '1rem',
            color: '#999',
            letterSpacing: '0.1em',
          }}>
            PLAY →
          </div>
        )}
      </div>
    </motion.div>
  );
}
