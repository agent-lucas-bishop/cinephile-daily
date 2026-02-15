export function ArtDecoLine() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      width: '100%',
      maxWidth: 500,
      margin: '0 auto',
      padding: '0 20px',
    }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, var(--gold-dark))' }} />
      <div style={{
        width: 8, height: 8,
        border: '1px solid var(--gold)',
        transform: 'rotate(45deg)',
      }} />
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, var(--gold-dark))' }} />
    </div>
  );
}
