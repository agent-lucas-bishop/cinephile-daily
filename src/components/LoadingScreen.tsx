export function LoadingScreen() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px',
      textAlign: 'center',
    }}>
      <div style={{
        width: 48,
        height: 48,
        border: '3px solid transparent',
        borderTop: '3px solid var(--gold, #8B6914)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <p style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '0.8rem',
        letterSpacing: '0.3em',
        color: '#666',
        marginTop: 20,
      }}>
        ACCESSING CASE FILES...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
