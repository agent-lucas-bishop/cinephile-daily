import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/useMediaQuery';

interface Props {
  title: string;
  subtitle: string;
  icon: string;
  path: string;
  score?: number;
  completed?: boolean;
  index: number;
}

export function GameCard({ title, subtitle, icon, path, score, completed, index }: Props) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 * index, duration: 0.5, ease: 'easeOut' }}
      onClick={() => navigate(path)}
      style={{
        position: 'relative',
        padding: isMobile ? '14px 16px' : '24px',
        minHeight: 44, // touch target
        background: completed
          ? 'linear-gradient(135deg, rgba(74,139,92,0.15), rgba(28,23,20,0.9))'
          : 'linear-gradient(135deg, rgba(212,168,67,0.06), rgba(28,23,20,0.9))',
        border: `1px solid ${completed ? 'rgba(74,139,92,0.4)' : 'var(--gold-dark)'}`,
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'border-color 0.3s, transform 0.2s',
      }}
      whileHover={{ scale: 1.02, borderColor: 'var(--gold)' }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Corner accents - smaller on mobile */}
      {!isMobile && (
        <>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTop: '2px solid var(--gold)', borderLeft: '2px solid var(--gold)' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: 20, height: 20, borderTop: '2px solid var(--gold)', borderRight: '2px solid var(--gold)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 20, height: 20, borderBottom: '2px solid var(--gold)', borderLeft: '2px solid var(--gold)' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottom: '2px solid var(--gold)', borderRight: '2px solid var(--gold)' }} />
        </>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 16 }}>
        <span style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: isMobile ? '1.1rem' : '1.4rem',
            letterSpacing: '0.1em',
            color: 'var(--gold-light)',
            margin: 0,
          }}>
            {title}
          </h3>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: isMobile ? '0.8rem' : '0.95rem',
            color: 'var(--text-muted)',
            margin: '2px 0 0',
            fontStyle: 'italic',
          }}>
            {subtitle}
          </p>
        </div>
        {completed && (
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: isMobile ? '1.2rem' : '1.5rem',
            color: 'var(--gold)',
          }}>
            {score}/5
          </div>
        )}
        {!completed && (
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: isMobile ? '0.85rem' : '1rem',
            color: 'var(--text-dim)',
            letterSpacing: '0.1em',
          }}>
            PLAY →
          </div>
        )}
      </div>
    </motion.div>
  );
}
