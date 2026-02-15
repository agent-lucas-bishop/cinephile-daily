import { useNavigate, useLocation } from 'react-router-dom';
import { ArtDecoLine } from './ArtDecoLine';
import { useIsMobile } from '../hooks/useMediaQuery';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isMobile = useIsMobile();

  const titleSize = isHome
    ? (isMobile ? '2.2rem' : '3.5rem')
    : (isMobile ? '1.5rem' : '2rem');

  const subtitleSize = isHome
    ? (isMobile ? '0.85rem' : '1.1rem')
    : (isMobile ? '0.65rem' : '0.8rem');

  return (
    <header style={{
      textAlign: 'center',
      padding: isMobile ? '12px 8px 8px' : '24px 20px 16px',
      flexShrink: 0,
    }}>
      <div
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      >
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: titleSize,
          letterSpacing: '0.15em',
          color: 'var(--gold)',
          lineHeight: 1,
          textShadow: '0 2px 20px rgba(212,168,67,0.3)',
          transition: 'font-size 0.3s ease',
          margin: 0,
        }}>
          CINEPHILE
        </h1>
        <p style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: subtitleSize,
          fontStyle: 'italic',
          color: 'var(--text-muted)',
          letterSpacing: '0.3em',
          marginTop: 2,
          transition: 'font-size 0.3s ease',
        }}>
          DAILY
        </p>
      </div>
      <div style={{ marginTop: isMobile ? 6 : 12 }}>
        <ArtDecoLine />
      </div>
    </header>
  );
}
