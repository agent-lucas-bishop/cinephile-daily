import { useState, useRef, useEffect } from 'react';
import { allMovieTitles } from '../data/movies';

interface Props {
  onSelect: (title: string) => void;
  disabled?: boolean;
  placeholder?: string;
  variant?: 'dark' | 'cream';
}

export function MovieSearch({ onSelect, disabled, placeholder = "Type a movie title...", variant = 'dark' }: Props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isCream = variant === 'cream';

  useEffect(() => {
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }
    const q = query.toLowerCase();
    const matches = allMovieTitles.filter(t => t.toLowerCase().includes(q)).slice(0, 5);
    setSuggestions(matches);
    setSelectedIdx(-1);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const submit = (title: string) => {
    onSelect(title);
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIdx >= 0 && suggestions[selectedIdx]) {
        submit(suggestions[selectedIdx]);
      } else if (suggestions.length === 1) {
        submit(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="go"
          style={{
            width: '100%',
            padding: isCream ? '8px 32px 8px 10px' : '12px 16px',
            fontSize: isCream ? '0.8rem' : '1rem',
            fontFamily: isCream ? "'Bebas Neue', sans-serif" : "'Cormorant Garamond', Georgia, serif",
            letterSpacing: isCream ? '0.15em' : undefined,
            background: isCream ? 'transparent' : 'rgba(28, 23, 20, 0.9)',
            border: isCream ? 'none' : '1px solid var(--gold-dark)',
            borderBottom: isCream ? '2px solid #8B3A3A' : undefined,
            color: isCream ? '#333' : 'var(--cream)',
            outline: 'none',
            boxSizing: 'border-box',
            borderRadius: 0,
            WebkitAppearance: 'none',
          }}
        />
        {isCream && (
          <span style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '0.9rem',
            color: '#999',
          }}>🔍</span>
        )}
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: 0,
          right: 0,
          background: isCream ? '#fff' : '#1C1714',
          border: `1px solid ${isCream ? '#d4c5a9' : 'var(--gold-dark)'}`,
          borderBottom: 'none',
          zIndex: 100,
          maxHeight: 200,
          overflowY: 'auto',
        }}>
          {suggestions.map((s, i) => (
            <div
              key={s}
              onClick={() => submit(s)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                background: i === selectedIdx
                  ? (isCream ? 'rgba(139,105,20,0.1)' : 'rgba(212,168,67,0.15)')
                  : 'transparent',
                color: isCream
                  ? (i === selectedIdx ? '#333' : '#555')
                  : (i === selectedIdx ? 'var(--gold-light)' : 'var(--cream)'),
                borderBottom: `1px solid ${isCream ? '#e8d9b8' : 'rgba(212,168,67,0.1)'}`,
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
              }}
              onMouseEnter={() => setSelectedIdx(i)}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
