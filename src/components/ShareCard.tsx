import { useState, useCallback } from 'react';
import { useIsMobile } from '../hooks/useMediaQuery';
import type { DailyState, GameStreakStats } from '../utils/storage';

interface ShareCardProps {
  state: DailyState;
  streaks: Record<'credits' | 'poster' | 'year', GameStreakStats>;
  allDone: boolean;
}

const SITE_URL = 'https://cinephile.codyp.xyz';

const GAMES = [
  { key: 'credits' as const, title: 'THE CREDITS', emoji: '🎭' },
  { key: 'poster' as const, title: 'THE POSTER', emoji: '🖼️' },
  { key: 'year' as const, title: 'THE YEAR', emoji: '📅' },
];

function emojiRow(score: number): string {
  return '🟩'.repeat(score) + '⬛'.repeat(5 - score);
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
    SITE_URL,
  ];
  return lines.join('\n');
}

export function ShareCard({ state, streaks, allDone }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();
  const gs = state.games;

  const handleNativeShare = useCallback(async () => {
    const text = shareText(gs, streaks);
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // User cancelled
      }
    }
  }, [gs, streaks]);

  const handleCopy = useCallback(async () => {
    const text = shareText(gs, streaks);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [gs, streaks]);

  return (
    <div>
      {/* Share button(s) or incomplete message */}
      {allDone ? (
        <div style={{
          display: 'flex',
          gap: 10,
          marginTop: 16,
        }}>
          {isMobile && (
            <button
              onClick={handleNativeShare}
              style={{
                flex: 1,
                padding: '14px 20px',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '1rem',
                letterSpacing: '0.2em',
                background: '#C5A059',
                color: '#0D0A07',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              ↗ SHARE
            </button>
          )}
          <button
            onClick={handleCopy}
            style={{
              flex: 1,
              padding: '14px 20px',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '1rem',
              letterSpacing: '0.2em',
              background: copied ? '#4A8B5C' : (isMobile ? '#1A1A1A' : '#C5A059'),
              color: copied ? '#fff' : (isMobile ? '#F4F1EA' : '#0D0A07'),
              border: isMobile ? '1px solid #333' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              transition: 'background 0.3s, color 0.3s',
            }}
          >
            {copied ? '✓ COPIED' : '📋 COPY'}
          </button>
        </div>
      ) : (
        <div style={{
          marginTop: 16,
          padding: '16px 12px',
          border: '1px solid #d0ccc4',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '0.85rem',
            letterSpacing: '0.15em',
            color: '#888',
            margin: 0,
          }}>
            COMPLETE ALL THREE CASES TO SHARE YOUR RESULTS
          </p>
        </div>
      )}
    </div>
  );
}
