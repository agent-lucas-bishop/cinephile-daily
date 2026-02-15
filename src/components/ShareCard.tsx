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

  const handleShare = useCallback(async () => {
    const text = shareText(gs, streaks);

    // Mobile: try native share sheet first
    if (isMobile && navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        // User cancelled — fall through to copy
      }
    }

    // Desktop (or mobile fallback): copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Last resort: select-all fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [gs, streaks, isMobile]);

  return (
    <div>
      {/* Share button or incomplete message */}
      {allDone ? (
        <button
          onClick={handleShare}
          style={{
            width: '100%',
            marginTop: 16,
            padding: '14px 20px',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1rem',
            letterSpacing: '0.2em',
            background: copied ? '#4A8B5C' : '#C5A059',
            color: copied ? '#fff' : '#0D0A07',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            transition: 'background 0.3s, color 0.3s',
          }}
        >
          {copied ? '✓ COPIED TO CLIPBOARD' : (isMobile ? '↗ SHARE RESULTS' : '📋 COPY RESULTS')}
        </button>
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
