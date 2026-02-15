import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '../hooks/useMediaQuery';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isMobile = useIsMobile();

  if (!isHome) return null; // Game pages have their own back nav

  return (
    <header style={{
      textAlign: 'center',
      padding: isMobile ? '16px 8px 8px' : '32px 20px 16px',
      flexShrink: 0,
    }}>
      <div
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      >
        {/* Top gold line */}
        <div style={{
          height: 2,
          background: 'linear-gradient(to right, transparent, var(--gold-dark), var(--gold), var(--gold-dark), transparent)',
          marginBottom: 8,
        }} />

        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: isMobile ? '2.5rem' : '3.5rem',
          fontWeight: 900,
          letterSpacing: '0.08em',
          color: 'var(--cream)',
          lineHeight: 1,
          textShadow: '0 2px 20px rgba(212,168,67,0.2)',
          margin: 0,
        }}>
          CINÉPHILE
        </h1>
        <p style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: isMobile ? '0.7rem' : '0.85rem',
          letterSpacing: '0.4em',
          color: 'var(--text-muted)',
          marginTop: 2,
        }}>
          THE DAILY EDITION
        </p>

        {/* Bottom gold line */}
        <div style={{
          height: 2,
          background: 'linear-gradient(to right, transparent, var(--gold-dark), var(--gold), var(--gold-dark), transparent)',
          marginTop: 8,
        }} />
      </div>
    </header>
  );
}
