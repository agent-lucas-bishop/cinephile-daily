import { useState, useCallback } from 'react';
import { useIsMobile } from '../hooks/useMediaQuery';
import type { GameType } from '../utils/endlessStorage';

const SITE_URL = 'https://cinephile.codyp.xyz';

const GAME_TITLES: Record<GameType, string> = {
  credits: 'THE CREDITS',
  poster: 'THE POSTER',
  year: 'THE YEAR',
};

const GAME_EMOJIS: Record<GameType, string> = {
  credits: '🎭',
  poster: '🖼️',
  year: '📅',
};

function shareText(gameType: GameType, rounds: number, score: number): string {
  return [
    `🎬 Cinéphile Daily — ∞ Endless Mode`,
    `${GAME_EMOJIS[gameType]} ${GAME_TITLES[gameType]}`,
    '',
    `💀 Died at Round ${rounds + 1}`,
    `🏆 Score: ${score}`,
    `📊 Rounds survived: ${rounds}`,
    '',
    `Can you beat my score?`,
    SITE_URL,
  ].join('\n');
}

interface Props {
  gameType: GameType;
  rounds: number;
  score: number;
}

export function EndlessShareCard({ gameType, rounds, score }: Props) {
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();

  const text = shareText(gameType, rounds, score);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try { await navigator.share({ text }); } catch {}
    }
  }, [text]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [text]);

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {isMobile && (
        <button
          onClick={handleShare}
          style={{
            flex: 1,
            padding: '12px',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '0.9rem',
            letterSpacing: '0.15em',
            background: '#1a1a1a',
            color: '#F4F1EA',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ↗ SHARE
        </button>
      )}
      <button
        onClick={handleCopy}
        style={{
          flex: 1,
          padding: '12px',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '0.9rem',
          letterSpacing: '0.15em',
          background: copied ? '#4A8B5C' : '#1a1a1a',
          color: '#F4F1EA',
          border: '1px solid #333',
          cursor: 'pointer',
          transition: 'background 0.3s',
        }}
      >
        {copied ? '✓ COPIED' : '📋 COPY RESULTS'}
      </button>
    </div>
  );
}
