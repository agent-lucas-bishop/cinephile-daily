import { motion } from 'framer-motion';
import { GameCard } from '../components/GameCard';
import { ArtDecoLine } from '../components/ArtDecoLine';
import { useDailyPuzzle } from '../hooks/useDailyPuzzle';
import { useGameState } from '../hooks/useGameState';
import { getStats } from '../utils/storage';

export function Home() {
  const { genre } = useDailyPuzzle();
  const { state } = useGameState();
  const stats = getStats();
  const gs = state.games;
  const totalScore = gs.credits.score + gs.poster.score + gs.year.score;
  const allDone = gs.credits.completed && gs.poster.completed && gs.year.completed;

  return (
    <div style={{ padding: '0 20px 40px', maxWidth: 500, margin: '0 auto' }}>
      {/* Genre badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: 'center',
          margin: '8px 0 24px',
        }}
      >
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '0.85rem',
          letterSpacing: '0.3em',
          color: 'var(--gold-dark)',
          padding: '4px 16px',
          border: '1px solid var(--gold-dark)',
          display: 'inline-block',
        }}>
          TODAY'S GENRE · {genre.toUpperCase()}
        </span>
      </motion.div>

      {/* Stats bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 32,
        marginBottom: 24,
      }}>
        <StatItem label="STREAK" value={stats.streak} />
        <StatItem label="BEST" value={stats.maxStreak} />
        <StatItem label="TOTAL" value={stats.totalScore} />
      </div>

      <ArtDecoLine />

      {/* Game cards */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        marginTop: 24,
      }}>
        <GameCard
          title="THE CREDITS"
          subtitle="Name the film from its credits"
          icon="🎬"
          path="/credits"
          score={gs.credits.score}
          completed={gs.credits.completed}
          index={0}
        />
        <GameCard
          title="THE POSTER"
          subtitle="Identify the blurred poster"
          icon="🖼️"
          path="/poster"
          score={gs.poster.score}
          completed={gs.poster.completed}
          index={1}
        />
        <GameCard
          title="THE YEAR"
          subtitle="Guess the release year"
          icon="📅"
          path="/year"
          score={gs.year.score}
          completed={gs.year.completed}
          index={2}
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
            margin: '32px 0 0',
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(212,168,67,0.08), rgba(107,29,42,0.08))',
            border: '1px solid var(--gold-dark)',
          }}
        >
          <p style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1rem',
            letterSpacing: '0.2em',
            color: 'var(--text-muted)',
          }}>
            TODAY'S SCORE
          </p>
          <p style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '3rem',
            color: 'var(--gold)',
            lineHeight: 1,
            marginTop: 4,
          }}>
            {totalScore}/15
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            marginTop: 8,
          }}>
            Come back tomorrow for a new puzzle
          </p>
        </motion.div>
      )}

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: 40,
        color: 'var(--text-dim)',
        fontSize: '0.8rem',
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: 'italic',
      }}>
        A new puzzle every day at midnight
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '1.8rem',
        color: 'var(--gold)',
        lineHeight: 1,
      }}>
        {value}
      </p>
      <p style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '0.65rem',
        letterSpacing: '0.2em',
        color: 'var(--text-dim)',
        marginTop: 2,
      }}>
        {label}
      </p>
    </div>
  );
}
