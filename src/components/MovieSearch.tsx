import { useState, useRef, useEffect } from 'react';
import { allMovieTitles } from '../data/movies';

interface Props {
  onSelect: (title: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MovieSearch({ onSelect, disabled, placeholder = "Type a movie title..." }: Props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }
    const q = query.toLowerCase();
    const matches = allMovieTitles.filter(t => t.toLowerCase().includes(q)).slice(0, 6);
    setSuggestions(matches);
    setSelectedIdx(-1);
  }, [query]);

  const submit = (title: string) => {
    onSelect(title);
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
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
    <div style={{ position: 'relative', width: '100%', maxWidth: 400, margin: '0 auto' }}>
      <input
        ref={inputRef}
        value={query}
        onChange={e => { setQuery(e.target.value); setShowSuggestions(true); }}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: '1.1rem',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          background: 'rgba(28, 23, 20, 0.9)',
          border: '1px solid var(--gold-dark)',
          color: 'var(--cream)',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--gold-dark)')}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#1C1714',
          border: '1px solid var(--gold-dark)',
          borderTop: 'none',
          zIndex: 100,
          maxHeight: 240,
          overflowY: 'auto',
        }}>
          {suggestions.map((s, i) => (
            <div
              key={s}
              onClick={() => submit(s)}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                background: i === selectedIdx ? 'rgba(212,168,67,0.15)' : 'transparent',
                color: i === selectedIdx ? 'var(--gold-light)' : 'var(--cream)',
                borderBottom: '1px solid rgba(212,168,67,0.1)',
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
