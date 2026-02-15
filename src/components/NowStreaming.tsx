import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/useMediaQuery';
import type { WatchProvider } from '../types/movie';

interface Props {
  providers: WatchProvider[];
  completed: boolean;
  won: boolean;
  movieTitle: string;
  rating: number;
  tagline?: string;
  overview?: string;
}

const AMAZON_ASSOCIATE_TAG = 'codyp0c-20';

// Major providers we show — must have real links, no fake redirects
const MAJOR_PROVIDERS = new Set([
  'Amazon Prime Video',
  'Amazon Video',
  'Apple TV',
  'Apple TV Plus',
  'YouTube',
  'YouTube Premium',
  'Google Play Movies',
]);

function getProviderLink(providerName: string, movieTitle: string): string | null {
  const encoded = encodeURIComponent(movieTitle);
  const links: Record<string, string> = {
    'Amazon Prime Video': `https://www.amazon.com/s?k=${encoded}&i=instant-video&tag=${AMAZON_ASSOCIATE_TAG}`,
    'Amazon Video': `https://www.amazon.com/s?k=${encoded}&i=instant-video&tag=${AMAZON_ASSOCIATE_TAG}`,
    'Apple TV': `https://tv.apple.com/search?term=${encoded}`,
    'Apple TV Plus': `https://tv.apple.com/search?term=${encoded}`,
    'YouTube': `https://www.youtube.com/results?search_query=${encoded}+full+movie`,
    'YouTube Premium': `https://www.youtube.com/results?search_query=${encoded}+full+movie`,
    'Google Play Movies': `https://play.google.com/store/search?q=${encoded}&c=movies`,
  };
  return links[providerName] || null;
}

function isAmazon(name: string): boolean {
  return name === 'Amazon Prime Video' || name === 'Amazon Video';
}

const TYPE_LABELS: Record<string, string> = {
  stream: 'STREAM',
  rent: 'RENT',
  buy: 'BUY',
};

function StarRating({ rating }: { rating: number }) {
  const stars = Math.round(rating / 2); // Convert 0-10 to 0-5
  return (
    <div style={{ display: 'flex', gap: 2, justifyContent: 'center', margin: '4px 0' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{
          fontSize: '1rem',
          color: i < stars ? '#C5A059' : '#d4cfc4',
        }}>
          ★
        </span>
      ))}
      <span style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '0.85rem',
        color: '#C5A059',
        marginLeft: 6,
      }}>
        {rating}/10
      </span>
    </div>
  );
}

function truncateOverview(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.substring(0, text.lastIndexOf(' ', maxLen)) + '…';
}

export function NowStreaming({ providers, completed, won, movieTitle, rating, tagline, overview }: Props) {
  const isMobile = useIsMobile();

  if (!completed) return null;

  const grouped = {
    stream: providers.filter(p => p.type === 'stream'),
    rent: providers.filter(p => p.type === 'rent'),
    buy: providers.filter(p => p.type === 'buy'),
  };

  const majorProviders = providers.filter(p => MAJOR_PROVIDERS.has(p.name));
  const hasProviders = majorProviders.length > 0;

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
        {/* Context-aware header */}
        <p style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: isMobile ? '0.7rem' : '0.75rem',
          letterSpacing: '0.25em',
          color: '#999',
          margin: '0 0 4px',
        }}>
          {won ? 'RELIVE THE CLASSIC' : 'DISCOVER THIS FILM'}
        </p>

        {/* Rating */}
        {rating > 0 && <StarRating rating={rating} />}

        {/* Tagline or overview snippet */}
        {won && tagline && (
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '0.9rem',
            color: '#555',
            fontStyle: 'italic',
            margin: '8px 0 12px',
          }}>
            "{tagline}"
          </p>
        )}
        {!won && overview && (
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '0.85rem',
            color: '#555',
            margin: '8px 0 12px',
            lineHeight: 1.5,
          }}>
            {truncateOverview(overview, 150)}
          </p>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: '#d4c5a9', margin: '12px 0' }} />

        <p style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: isMobile ? '0.85rem' : '0.9rem',
          letterSpacing: '0.2em',
          color: '#C5A059',
          margin: '0 0 12px',
        }}>
          {won ? '🎬 WATCH IT AGAIN' : '🎬 STREAM IT NOW'}
        </p>

        {hasProviders ? (
          <>
            {(['stream', 'rent', 'buy'] as const).map(type => {
              const group = grouped[type].filter(p => MAJOR_PROVIDERS.has(p.name));
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
                    alignItems: 'center',
                  }}>
                    {group.map(p => {
                      const link = getProviderLink(p.name, movieTitle);
                      if (!link) return null;
                      const amazon = isAmazon(p.name);
                      const size = amazon
                        ? (isMobile ? 46 : 52)
                        : (isMobile ? 36 : 40);
                      return (
                        <a
                          key={p.id}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={p.name}
                          style={{ textDecoration: 'none' }}
                        >
                          <div style={{
                            width: size,
                            height: size,
                            borderRadius: '50%',
                            background: '#fff',
                            border: amazon ? '2px solid #C5A059' : '1px solid #e0d8c8',
                            boxShadow: amazon
                              ? '0 2px 8px rgba(197,160,89,0.3)'
                              : '0 2px 6px rgba(0,0,0,0.1)',
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
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <a
            href={`https://www.amazon.com/s?k=${encodeURIComponent(movieTitle)}&i=instant-video&tag=${AMAZON_ASSOCIATE_TAG}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '0.85rem',
              color: '#C5A059',
              fontStyle: 'italic',
              margin: '8px 0',
              display: 'inline-block',
            }}
          >
            Search on Prime Video →
          </a>
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
