/** Decorative film strip border element */
export function FilmStrip({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        [side]: 0,
        bottom: 0,
        width: 28,
        background: 'var(--charcoal)',
        borderInline: '1px solid var(--gold-dark)',
        opacity: 0.3,
        zIndex: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: '8px 4px',
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 18,
            height: 12,
            borderRadius: 2,
            border: '1px solid var(--gold-dark)',
            opacity: 0.5,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}
