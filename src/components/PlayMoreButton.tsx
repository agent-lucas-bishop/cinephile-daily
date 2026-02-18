import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { GameType } from '../utils/endlessStorage';
import { getEndlessBest } from '../utils/endlessStorage';

interface Props {
  gameType: GameType;
}

export function PlayMoreButton({ gameType }: Props) {
  const navigate = useNavigate();
  const best = getEndlessBest(gameType);

  const handleClick = () => {
    navigate(`/endless/${gameType}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      style={{
        textAlign: 'center',
        marginTop: 16,
      }}
    >
      <button
        onClick={handleClick}
        style={{
          width: '100%',
          maxWidth: 360,
          padding: '14px 24px',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1rem',
          letterSpacing: '0.2em',
          background: 'rgba(197,160,89,0.12)',
          color: '#C5A059',
          border: '1px solid rgba(197,160,89,0.4)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(197,160,89,0.25)';
          e.currentTarget.style.borderColor = '#C5A059';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(197,160,89,0.12)';
          e.currentTarget.style.borderColor = 'rgba(197,160,89,0.4)';
        }}
      >
        ∞ PLAY MORE →
      </button>
      {best.bestRound > 0 && (
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '0.8rem',
          color: 'rgba(197,160,89,0.6)',
          fontStyle: 'italic',
          marginTop: 6,
        }}>
          Your best: {best.bestRound} rounds · {best.bestScore} pts
        </p>
      )}
    </motion.div>
  );
}
