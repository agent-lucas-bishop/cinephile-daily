import { useNavigate, useLocation } from 'react-router-dom';
import { ArtDecoLine } from './ArtDecoLine';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header style={{
      textAlign: 'center',
      padding: '24px 20px 16px',
    }}>
      <div
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      >
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: isHome ? '3.5rem' : '2rem',
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
          fontSize: isHome ? '1.1rem' : '0.8rem',
          fontStyle: 'italic',
          color: 'var(--text-muted)',
          letterSpacing: '0.3em',
          marginTop: 2,
          transition: 'font-size 0.3s ease',
        }}>
          DAILY
        </p>
      </div>
      <div style={{ marginTop: 12 }}>
        <ArtDecoLine />
      </div>
    </header>
  );
}
