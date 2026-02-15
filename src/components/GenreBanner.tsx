import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/useMediaQuery';

interface Props {
  genre: string;
}

export function GenreBanner({ genre }: Props) {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.8 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        textAlign: 'center',
        margin: isMobile ? '4px 0 16px' : '8px 0 24px',
        position: 'relative',
      }}
    >
      {/* Decorative top line */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 6,
      }}>
        <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'linear-gradient(to right, transparent, var(--gold))' }} />
        <div style={{ width: 6, height: 6, background: 'var(--gold)', transform: 'rotate(45deg)' }} />
        <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'linear-gradient(to left, transparent, var(--gold))' }} />
      </div>

      {/* Genre name */}
      <div style={{
        display: 'inline-block',
        padding: isMobile ? '6px 24px' : '8px 40px',
        border: '2px solid var(--gold)',
        borderTop: '3px solid var(--gold)',
        borderBottom: '3px solid var(--gold)',
        position: 'relative',
      }}>
        {/* Inner double border */}
        <div style={{
          position: 'absolute',
          inset: 3,
          border: '1px solid var(--gold)',
          opacity: 0.4,
          pointerEvents: 'none',
        }} />
        <span style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: isMobile ? '1rem' : '1.3rem',
          fontWeight: 700,
          letterSpacing: '0.25em',
          color: 'var(--gold)',
          textTransform: 'uppercase',
        }}>
          {genre}
        </span>
      </div>

      {/* Decorative bottom line */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginTop: 6,
      }}>
        <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'linear-gradient(to right, transparent, var(--gold))' }} />
        <div style={{ width: 6, height: 6, background: 'var(--gold)', transform: 'rotate(45deg)' }} />
        <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'linear-gradient(to left, transparent, var(--gold))' }} />
      </div>
    </motion.div>
  );
}
