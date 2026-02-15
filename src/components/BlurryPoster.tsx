interface Props {
  url: string;
  blur: number; // px
  maxWidth?: number;
}

export function BlurryPoster({ url, blur, maxWidth = 280 }: Props) {
  return (
    <div style={{
      position: 'relative',
      maxWidth,
      margin: '0 auto',
      border: '2px solid var(--gold-dark)',
      overflow: 'hidden',
      background: '#0D0A07',
    }}>
      <img
        src={url}
        alt="Movie poster"
        style={{
          width: '100%',
          display: 'block',
          filter: `blur(${blur}px)`,
          transition: 'filter 0.6s ease',
          transform: 'scale(1.1)', // prevent blur edge artifacts
        }}
      />
      {/* Film grain overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
