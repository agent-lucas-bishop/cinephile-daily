import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/useMediaQuery';
import type { WatchProvider } from '../types/movie';

interface Props {
  providers: WatchProvider[];
  completed: boolean;
  movieTitle: string;
}

function getProviderLink(providerName: string, movieTitle: string): string {
  const encoded = encodeURIComponent(movieTitle);
  const links: Record<string, string> = {
    'Amazon Prime Video': `https://www.amazon.com/s?k=${encoded}&i=instant-video`,
    'Apple TV': `https://tv.apple.com/search?term=${encoded}`,
    'default': `https://www.google.com/search?q=watch+${encoded}+online`,
  };
  return links[providerName] || links['default'];
}

const TYPE_LABELS: Record<string, string> = {
  stream: 'STREAM',
  rent: 'RENT',
  buy: 'BUY',
};

export function NowStreaming({ providers, completed, movieTitle }: Props) {
  const isMobile = useIsMobile();

  if (!completed) return null;

  const grouped = {
    stream: providers.filter(p => p.type === 'stream'),
    rent: providers.filter(p => p.type === 'rent'),
    buy: providers.filter(p => p.type === 'buy'),
  };

  const hasProviders = providers.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      style={{
        background: 'var(--cream, #F4F1EA)',
        border: '2px solid var(--cream-dark, #d4c5a9)',
        padding: isMobile ? '16px' : '20px 24px',
        marginTop: 16,
        textAlign: 'center',
        position: 'relative',
      }}
    >
      {/* Decorative double-line border inset */}
      <div style={{
        position: 'absolute',
        inset: isMobile ? 6 : 8,
        border: '2px double rgba(26,26,26,0.15)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 10 }}>
        <p style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: isMobile ? '1rem' : '1.1rem',
          letterSpacing: '0.2em',
          color: '#C5A059',
          margin: '0 0 12px',
        }}>
          🎬 NOW STREAMING ON
        </p>

        {hasProviders ? (
          <>
            {(['stream', 'rent', 'buy'] as const).map(type => {
              const group = grouped[type];
              if (group.length === 0) return null;
              return (
                <div key={type} style={{ marginBottom: 12 }}>
                  <p style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '0.55rem',
                    letterSpacing: '0.25em',
                    color: '#999',
                    margin: '0 0 6px',
                  }}>
                    {TYPE_LABELS[type]}
                  </p>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    justifyContent: 'center',
                  }}>
                    {group.map(p => (
                      <a
                        key={p.id}
                        href={getProviderLink(p.name, movieTitle)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={p.name}
                        style={{ textDecoration: 'none' }}
                      >
                        <div style={{
                          width: isMobile ? 36 : 40,
                          height: isMobile ? 36 : 40,
                          borderRadius: '50%',
                          background: '#fff',
                          border: '1px solid #e0d8c8',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <img
                            src={p.logoUrl}
                            alt={p.name}
                            style={{
                              width: '80%',
                              height: '80%',
                              objectFit: 'contain',
                              borderRadius: '50%',
                            }}
                          />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '0.85rem',
            color: '#999',
            fontStyle: 'italic',
            margin: '8px 0',
          }}>
            Streaming info unavailable
          </p>
        )}

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '0.65rem',
          color: '#bbb',
          margin: '8px 0 0',
        }}>
          Data by JustWatch
        </p>
      </div>
    </motion.div>
  );
}
