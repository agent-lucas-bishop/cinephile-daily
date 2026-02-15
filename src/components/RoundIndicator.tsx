export function RoundIndicator({ current, total = 5, won }: { current: number; total?: number; won?: boolean }) {
  return (
    <div style={{
      display: 'flex',
      gap: 8,
      justifyContent: 'center',
      margin: '12px 0',
    }}>
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < current;
        const isWon = won && i === current - 1;
        return (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              transform: 'rotate(45deg)',
              border: `1px solid ${isWon ? 'var(--success, #4A8B5C)' : 'var(--gold-dark)'}`,
              background: filled
                ? isWon ? '#4A8B5C' : 'var(--gold-dark)'
                : 'transparent',
              transition: 'all 0.3s',
            }}
          />
        );
      })}
    </div>
  );
}
