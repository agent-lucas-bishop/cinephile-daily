import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEndlessMode } from '../hooks/useEndlessMode';
import { CreditsGame } from '../games/Credits';
import { PosterGame } from '../games/Poster';
import { YearGame } from '../games/Year';
import { LoadingScreen } from '../components/LoadingScreen';
import { EndlessShareCard } from '../components/EndlessShareCard';
import { useIsMobile } from '../hooks/useMediaQuery';
import type { GameType } from '../utils/endlessStorage';
import { useEffect } from 'react';

const GAME_TITLES: Record<GameType, string> = {
  credits: 'THE CREDITS',
  poster: 'THE POSTER',
  year: 'THE YEAR',
};

const GAME_EMOJIS: Record<GameType, string> = {
  credits: '🎭',
  poster: '🖼️',
  year: '📅',
};

export function EndlessPage() {
  const { gameType } = useParams<{ gameType: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const type = (gameType as GameType) || 'credits';

  if (!['credits', 'poster', 'year'].includes(type)) {
    navigate('/');
    return null;
  }

  const {
    run,
    movie,
    loading,
    error,
    state,
    update,
    startRun,
    isGameOver,
    roundJustWon,
    lastRoundScore,
    advanceToNextRound,
    bestRound: _bestRound,
    bestScore,
  } = useEndlessMode(type);

  // Auto-start run if none exists
  useEffect(() => {
    if (!run) startRun();
  }, [run, startRun]);

  if (!run) return <LoadingScreen />;

  // Game over screen
  if (isGameOver) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar navigate={navigate} run={run} bestScore={bestScore} />
        <EndlessBadge type={type} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            maxWidth: 500,
            margin: '16px auto',
            width: '100%',
            padding: isMobile ? '0 4px' : '0 20px',
          }}
        >
          <div style={{
            background: 'var(--cream)',
            border: '2px solid var(--cream-dark)',
            padding: isMobile ? '24px 16px' : '32px 24px',
            textAlign: 'center',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}>
            <div style={{
              position: 'absolute',
              inset: isMobile ? 8 : 12,
              border: '2px double rgba(26,26,26,0.2)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 10 }}>
              <div style={{ width: 60, height: 3, background: '#8B3A3A', margin: '0 auto 12px' }} />

              <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: isMobile ? '1.6rem' : '2rem',
                fontWeight: 900,
                color: '#8B3A3A',
                margin: '0 0 4px',
              }}>
                RUN OVER
              </h2>

              <p style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '0.65rem',
                letterSpacing: '0.3em',
                color: '#888',
                marginBottom: 16,
              }}>
                {GAME_EMOJIS[type]} {GAME_TITLES[type]} — ENDLESS MODE
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 16 }}>
                <div>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.6rem', letterSpacing: '0.2em', color: '#888', margin: 0 }}>ROUNDS</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 900, color: '#1a1a1a', margin: 0 }}>
                    {run.round - 1}
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.6rem', letterSpacing: '0.2em', color: '#888', margin: 0 }}>SCORE</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 900, color: '#C5A059', margin: 0 }}>
                    {run.score}
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.6rem', letterSpacing: '0.2em', color: '#888', margin: 0 }}>BEST</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 900, color: 'rgba(26,26,26,0.3)', margin: 0 }}>
                    {bestScore}
                  </p>
                </div>
              </div>

              {movie && (
                <>
                  <p style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.1rem',
                    color: '#1a1a1a',
                    fontWeight: 700,
                    margin: '4px 0',
                  }}>
                    Failed on: {movie.title}
                  </p>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: '#666',
                    fontSize: '0.85rem',
                    marginBottom: 16,
                  }}>
                    {movie.year} · Directed by {movie.director}
                  </p>
                </>
              )}

              <EndlessShareCard
                gameType={type}
                rounds={run.round - 1}
                score={run.score}
              />

              <button
                onClick={startRun}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '1rem',
                  letterSpacing: '0.2em',
                  background: '#C5A059',
                  color: '#0D0A07',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: 12,
                }}
              >
                TRY AGAIN →
              </button>

              <button
                onClick={() => navigate('/')}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '0.85rem',
                  letterSpacing: '0.15em',
                  background: 'transparent',
                  color: '#888',
                  border: '1px solid #ccc',
                  cursor: 'pointer',
                  marginTop: 8,
                }}
              >
                RETURN TO DOSSIER
              </button>

              <div style={{ width: 60, height: 3, background: '#8B3A3A', margin: '16px auto 0' }} />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Round won — transition screen
  if (roundJustWon) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar navigate={navigate} run={run} bestScore={bestScore} />
        <EndlessBadge type={type} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            maxWidth: 500,
            margin: '24px auto',
            width: '100%',
            padding: isMobile ? '0 4px' : '0 20px',
          }}
        >
          <div style={{
            background: 'var(--cream)',
            border: '2px solid var(--cream-dark)',
            padding: isMobile ? '32px 16px' : '40px 24px',
            textAlign: 'center',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}>
            <div style={{
              position: 'absolute',
              inset: isMobile ? 8 : 12,
              border: '2px double rgba(26,26,26,0.2)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 10 }}>
              <div style={{ width: 60, height: 3, background: '#4A8B5C', margin: '0 auto 16px' }} />

              <p style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '0.7rem',
                letterSpacing: '0.3em',
                color: '#4A8B5C',
                margin: '0 0 4px',
              }}>
                ROUND {run.round - 1} COMPLETE
              </p>

              {movie && (
                <p style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: '#1a1a1a',
                  margin: '8px 0',
                }}>
                  {movie.title}
                </p>
              )}

              <p style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '2rem',
                color: '#C5A059',
                margin: '8px 0',
              }}>
                +{lastRoundScore} PTS
              </p>

              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1rem',
                color: '#666',
                fontStyle: 'italic',
                margin: '4px 0 20px',
              }}>
                Total: {run.score} points
              </p>

              <button
                onClick={advanceToNextRound}
                style={{
                  width: '100%',
                  padding: '16px',
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '1.1rem',
                  letterSpacing: '0.2em',
                  background: '#1a1a1a',
                  color: '#F4F1EA',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                NEXT ROUND →
              </button>

              <div style={{ width: 60, height: 3, background: '#4A8B5C', margin: '16px auto 0' }} />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Active gameplay
  if (loading || !movie) return <LoadingScreen />;
  if (error) return <div style={{ padding: 40, textAlign: 'center', color: '#8B3A3A' }}>Failed to load movie: {error}</div>;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar navigate={navigate} run={run} bestScore={bestScore} />
      <EndlessBadge type={type} />

      {type === 'credits' && <CreditsGame movie={movie} state={state} update={update} endless />}
      {type === 'poster' && <PosterGame movie={movie} state={state} update={update} endless />}
      {type === 'year' && <YearGame movie={movie} state={state} update={update} endless />}
    </div>
  );
}

function TopBar({ navigate, run, bestScore }: {
  navigate: (p: string) => void;
  run: EndlessRun;
  bestScore: number;
}) {
  return (
    <div style={{
      maxWidth: 500,
      margin: '0 auto',
      width: '100%',
      padding: '16px 4px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <button
        onClick={() => navigate('/')}
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          color: 'var(--cream)',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          padding: '8px 16px',
          cursor: 'pointer',
        }}
      >
        ← EXIT
      </button>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <StatPill label="ROUND" value={String(run.round)} />
        <StatPill label="SCORE" value={String(run.score)} />
        <StatPill label="BEST" value={String(bestScore)} dim />
      </div>
    </div>
  );
}

function StatPill({ label, value, dim }: { label: string; value: string; dim?: boolean }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '0.55rem',
        letterSpacing: '0.2em',
        color: 'rgba(255,255,255,0.5)',
        margin: 0,
      }}>{label}</p>
      <p style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: dim ? '0.9rem' : '1.2rem',
        color: dim ? 'rgba(255,255,255,0.4)' : '#C5A059',
        margin: 0,
      }}>{value}</p>
    </div>
  );
}

function EndlessBadge({ type }: { type: GameType }) {
  return (
    <div style={{
      maxWidth: 500,
      margin: '8px auto 0',
      width: '100%',
      textAlign: 'center',
    }}>
      <span style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '0.6rem',
        letterSpacing: '0.3em',
        color: '#C5A059',
        background: 'rgba(197,160,89,0.1)',
        border: '1px solid rgba(197,160,89,0.3)',
        padding: '4px 12px',
        display: 'inline-block',
      }}>
        ∞ ENDLESS MODE — {GAME_EMOJIS[type]} {GAME_TITLES[type]}
      </span>
    </div>
  );
}

// Need to import EndlessRun type for TopBar
import type { EndlessRun } from '../utils/endlessStorage';
