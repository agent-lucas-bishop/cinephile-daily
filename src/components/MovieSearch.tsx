import { useState, useRef, useEffect } from 'react';

interface SearchResult {
  id: number;
  title: string;
  year: number | null;
}

interface Props {
  onSelect: (title: string) => void;
  disabled?: boolean;
  placeholder?: string;
  variant?: 'dark' | 'cream';
}

export function MovieSearch({ onSelect, disabled, placeholder = "Type a movie title...", variant = 'dark' }: Props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const isCream = variant === 'cream';

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search-movies?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.results ?? []);
          setSelectedIdx(-1);
        }
      } catch {
        // ignore
      }
    }, 250);
    return () => clearTimeout(debounceRef.current);
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
        submit(suggestions[selectedIdx].title);
      } else if (suggestions.length === 1) {
        submit(suggestions[0].title);
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
          top: '100%',
          left: 0,
          right: 0,
          background: isCream ? '#fff' : '#1C1714',
          border: `1px solid ${isCream ? '#d4c5a9' : 'var(--gold-dark)'}`,
          borderTop: 'none',
          zIndex: 9999,
          maxHeight: 200,
          overflowY: 'auto',
        }}>
          {suggestions.map((s, i) => (
            <div
              key={`${s.id}-${s.title}`}
              onClick={() => submit(s.title)}
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
                justifyContent: 'space-between',
              }}
              onMouseEnter={() => setSelectedIdx(i)}
            >
              <span>{s.title}</span>
              {s.year && (
                <span style={{
                  fontSize: '0.8rem',
                  opacity: 0.6,
                  marginLeft: 8,
                }}>({s.year})</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
