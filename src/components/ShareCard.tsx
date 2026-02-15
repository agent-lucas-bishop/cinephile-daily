import { useRef, useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import type { DailyState, GameStreakStats } from '../utils/storage';

interface ShareCardProps {
  state: DailyState;
  streaks: Record<'credits' | 'poster' | 'year', GameStreakStats>;
}

const GAMES = [
  { key: 'credits' as const, title: 'THE CREDITS', emoji: '🎭' },
  { key: 'poster' as const, title: 'THE POSTER', emoji: '🖼️' },
  { key: 'year' as const, title: 'THE YEAR', emoji: '📅' },
];

function emojiRow(score: number): string {
  return '🟩'.repeat(score) + '⬛'.repeat(5 - score);
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function shareText(gs: DailyState['games'], streaks: ShareCardProps['streaks']): string {
  const total = gs.credits.score + gs.poster.score + gs.year.score;
  const lines = [
    `🎬 Cinéphile Daily — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
    '',
    ...GAMES.map(g => {
      const s = gs[g.key];
      const sk = streaks[g.key];
      return `${g.emoji} ${g.title}: ${s.score}/5 ${emojiRow(s.score)}${sk.streak > 0 ? ` 🔥${sk.streak}` : ''}`;
    }),
    '',
    `Total: ${total}/15`,
    '',
    'https://cinephile-daily.vercel.app',
  ];
  return lines.join('\n');
}

export function ShareCard({ state, streaks }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const gs = state.games;
  const totalScore = gs.credits.score + gs.poster.score + gs.year.score;

  const generateImage = useCallback(async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    setGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const res = await fetch(dataUrl);
      return await res.blob();
    } catch (e) {
      console.error('Image generation failed:', e);
      return null;
    } finally {
      setGenerating(false);
    }
  }, []);

  const handleShare = useCallback(async () => {
    const blob = await generateImage();
    if (blob && navigator.share) {
      try {
        const file = new File([blob], 'cinephile-daily.png', { type: 'image/png' });
        await navigator.share({
          text: shareText(gs, streaks),
          files: [file],
        });
        return;
      } catch {
        // User cancelled or not supported — fall through to download
      }
    }
    // Fallback: download
    if (blob) downloadBlob(blob);
  }, [gs, streaks, generateImage]);

  const handleDownload = useCallback(async () => {
    const blob = await generateImage();
    if (blob) downloadBlob(blob);
  }, [generateImage]);

  const handleTwitter = useCallback(() => {
    const text = encodeURIComponent(shareText(gs, streaks));
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  }, [gs, streaks]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText('https://cinephile-daily.vercel.app').then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  }, []);

  // Inline styles for the card (html-to-image needs inline styles)
  const cardStyle: React.CSSProperties = {
    width: 540,
    padding: '48px 40px',
    background: '#0D0A07',
    color: '#F4F1EA',
    fontFamily: "Georgia, 'Times New Roman', serif",
    position: 'relative',
    boxSizing: 'border-box',
  };

  const goldBorderStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 12,
    border: '2px solid #C5A059',
    pointerEvents: 'none',
  };

  const innerBorderStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 16,
    border: '1px solid rgba(197, 160, 89, 0.3)',
    pointerEvents: 'none',
  };

  return (
    <div>
      {/* Hidden card for image capture */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={cardRef} style={cardStyle}>
          <div style={goldBorderStyle} />
          <div style={innerBorderStyle} />

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'linear-gradient(to right, transparent, #C5A059)' }} />
              <span style={{ fontSize: 20, letterSpacing: 2 }}>🎬</span>
              <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'linear-gradient(to left, transparent, #C5A059)' }} />
            </div>
            <h1 style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 32,
              fontWeight: 700,
              color: '#C5A059',
              letterSpacing: 6,
              margin: '0 0 4px',
            }}>
              CINÉPHILE DAILY
            </h1>
            <div style={{
              fontSize: 11,
              letterSpacing: 4,
              color: '#888',
              textTransform: 'uppercase',
            }}>
              {formatDate()}
            </div>
          </div>

          {/* Decorative line */}
          <div style={{ height: 1, background: 'linear-gradient(to right, transparent, #C5A059, transparent)', margin: '0 0 24px' }} />

          {/* Game results */}
          {GAMES.map((game) => {
            const s = gs[game.key];
            const sk = streaks[game.key];
            return (
              <div key={game.key} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: '1px solid rgba(197, 160, 89, 0.15)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{game.emoji}</span>
                  <span style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: 15,
                    letterSpacing: 2,
                    color: '#F4F1EA',
                  }}>
                    {game.title}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 14, letterSpacing: 2 }}>{emojiRow(s.score)}</span>
                  <span style={{
                    fontFamily: "Georgia, serif",
                    fontSize: 16,
                    fontWeight: 700,
                    color: s.won ? '#6BBF7B' : '#C44',
                    minWidth: 32,
                    textAlign: 'right',
                  }}>
                    {s.score}/5
                  </span>
                  {sk.streak > 0 && (
                    <span style={{ fontSize: 13, color: '#C5A059' }}>
                      🔥{sk.streak}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Total score */}
          <div style={{ textAlign: 'center', margin: '28px 0 24px' }}>
            <div style={{
              fontSize: 11,
              letterSpacing: 4,
              color: '#888',
              marginBottom: 4,
            }}>
              TOTAL SCORE
            </div>
            <div style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 56,
              fontWeight: 700,
              color: '#C5A059',
              lineHeight: 1,
            }}>
              {totalScore}/15
            </div>
          </div>

          {/* Decorative line */}
          <div style={{ height: 1, background: 'linear-gradient(to right, transparent, #C5A059, transparent)', margin: '0 0 16px' }} />

          {/* Footer URL */}
          <div style={{
            textAlign: 'center',
            fontSize: 12,
            letterSpacing: 3,
            color: '#666',
          }}>
            cinephile-daily.vercel.app
          </div>
        </div>
      </div>

      {/* Share buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
        marginTop: 16,
      }}>
        <ShareButton
          onClick={handleShare}
          icon="↗"
          label={generating ? 'GENERATING...' : 'SHARE'}
          primary
        />
        <ShareButton onClick={handleTwitter} icon="𝕏" label="POST ON X" />
        <ShareButton onClick={handleCopyLink} icon="🔗" label={copiedLink ? 'COPIED!' : 'COPY LINK'} />
        <ShareButton onClick={handleDownload} icon="⬇" label="DOWNLOAD" />
      </div>
    </div>
  );
}

function ShareButton({ onClick, icon, label, primary }: {
  onClick: () => void;
  icon: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 8px',
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '0.85rem',
        letterSpacing: '0.15em',
        background: primary ? '#C5A059' : '#1A1A1A',
        color: primary ? '#0D0A07' : '#F4F1EA',
        border: primary ? 'none' : '1px solid #333',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'opacity 0.2s',
      }}
      onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
      onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
    >
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      {label}
    </button>
  );
}

function downloadBlob(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cinephile-daily-${new Date().toISOString().split('T')[0]}.png`;
  a.click();
  URL.revokeObjectURL(url);
}
