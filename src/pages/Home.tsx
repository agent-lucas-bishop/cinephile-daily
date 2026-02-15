import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDailyPuzzle } from '../hooks/useDailyPuzzle';
import { useGameState } from '../hooks/useGameState';
import { getStats } from '../utils/storage';
import { useIsMobile } from '../hooks/useMediaQuery';

export function Home() {
  const { genre } = useDailyPuzzle();
  const { state } = useGameState();
  const stats = getStats();
  const gs = state.games;
  const totalScore = gs.credits.score + gs.poster.score + gs.year.score;
  const allDone = gs.credits.completed && gs.poster.completed && gs.year.completed;
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <div style={{
      padding: isMobile ? '0 4px 12px' : '0 20px 40px',
      maxWidth: 500,
      margin: '0 auto',
      width: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Genre / Category label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: 'center',
          margin: isMobile ? '8px 0 16px' : '12px 0 24px',
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

      {/* Stats bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: isMobile ? 24 : 32,
        marginBottom: isMobile ? 16 : 24,
      }}>
        <StatItem label="STREAK" value={stats.streak} isMobile={isMobile} />
        <StatItem label="BEST" value={stats.maxStreak} isMobile={isMobile} />
        <StatItem label="TOTAL" value={stats.totalScore} isMobile={isMobile} />
      </div>

      {/* Game cards - cream panels */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? 16 : 20,
        flex: 1,
      }}>
        <CategoryCard
          title="THE CREDITS"
          subtitle="Name the film from its credits"
          icon="🎬"
          path="/credits"
          score={gs.credits.score}
          completed={gs.credits.completed}
          index={0}
          navigate={navigate}
          isMobile={isMobile}
        />
        <CategoryCard
          title="THE POSTER"
          subtitle="Identify the blurred poster"
          icon="🖼️"
          path="/poster"
          score={gs.poster.score}
          completed={gs.poster.completed}
          index={1}
          navigate={navigate}
          isMobile={isMobile}
        />
        <CategoryCard
          title="THE YEAR"
          subtitle="Guess the release year"
          icon="📅"
          path="/year"
          score={gs.year.score}
          completed={gs.year.completed}
          index={2}
          navigate={navigate}
          isMobile={isMobile}
        />
      </div>

      {/* Summary if all done */}
      {allDone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            textAlign: 'center',
            margin: isMobile ? '16px 0 0' : '32px 0 0',
            padding: isMobile ? '16px' : '24px',
            background: 'var(--cream)',
            border: '2px solid var(--cream-dark)',
          }}
        >
          <p style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: isMobile ? '0.75rem' : '0.85rem',
            letterSpacing: '0.2em',
            color: '#666',
          }}>
            TODAY'S SCORE
          </p>
          <p style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: isMobile ? '2rem' : '3rem',
            color: '#8B6914',
            lineHeight: 1,
            marginTop: 4,
          }}>
            {totalScore}/15
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: '#888',
            fontStyle: 'italic',
            marginTop: 4,
            fontSize: isMobile ? '0.85rem' : '1rem',
          }}>
            Come back tomorrow for a new puzzle
          </p>
        </motion.div>
      )}

      {/* Today's genre badge */}
      <div style={{
        textAlign: 'center',
        marginTop: 16,
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '0.65rem',
        letterSpacing: '0.2em',
        color: 'var(--text-dim)',
      }}>
        TODAY'S GENRE · {genre.toUpperCase()}
      </div>
    </div>
  );
}

function StatItem({ label, value, isMobile }: { label: string; value: number; isMobile: boolean }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: isMobile ? '1.4rem' : '1.8rem',
        color: 'var(--gold)',
        lineHeight: 1,
        margin: 0,
      }}>
        {value}
      </p>
      <p style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: isMobile ? '0.55rem' : '0.65rem',
        letterSpacing: '0.2em',
        color: 'var(--text-dim)',
        marginTop: 2,
      }}>
        {label}
      </p>
    </div>
  );
}

interface CategoryCardProps {
  title: string;
  subtitle: string;
  icon: string;
  path: string;
  score?: number;
  completed?: boolean;
  index: number;
  navigate: (path: string) => void;
  isMobile: boolean;
}

function CategoryCard({ title, subtitle: _subtitle, icon, path, score, completed, index, navigate, isMobile }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 * index, duration: 0.5, ease: 'easeOut' }}
      onClick={() => navigate(path)}
      style={{
        background: completed
          ? 'linear-gradient(135deg, rgba(74,139,92,0.06), var(--cream))'
          : 'var(--cream)',
        border: `2px solid ${completed ? 'rgba(74,139,92,0.3)' : 'var(--cream-dark)'}`,
        padding: isMobile ? '24px 16px' : '32px 24px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      whileHover={{ scale: 1.01, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Icon in circle */}
      <div style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 12px',
        fontSize: '1.3rem',
        border: '2px solid #8B6914',
      }}>
        {icon}
      </div>

      <h3 style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: isMobile ? '1.4rem' : '1.6rem',
        letterSpacing: '0.1em',
        color: '#1a1a1a',
        margin: '0 0 4px',
      }}>
        {title}
      </h3>

      {completed ? (
        <p style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1rem',
          letterSpacing: '0.1em',
          color: '#4A8B5C',
        }}>
          SOLVED · {score}/5 PTS
        </p>
      ) : (
        <p style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '0.7rem',
          letterSpacing: '0.25em',
          color: '#8B6914',
          margin: 0,
        }}>
          OPEN CASE FILES →
        </p>
      )}
    </motion.div>
  );
}
