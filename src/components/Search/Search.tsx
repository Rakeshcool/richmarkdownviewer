import { useRef, useEffect, useCallback } from 'react';
import { useSearch } from '../../hooks/useSearch';

export function Search() {
  const { searchQuery, searchResults, showSearch, search, handleResultClick, setShowSearch } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSearch(false);
      }
    },
    [setShowSearch]
  );

  if (!showSearch) return null;

  return (
    <div className="search-overlay" onClick={() => setShowSearch(false)}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-wrapper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search files and content..."
            value={searchQuery}
            onChange={(e) => search(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <span className="search-shortcut">ESC</span>
        </div>

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((result) => (
              <div
                key={result.document.id}
                className="search-result"
                onClick={() => handleResultClick(result)}
              >
                <div className="search-result-header">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="search-result-name">{result.document.name}</span>
                  <span className="search-result-path">{result.document.path}</span>
                  <span className="search-result-count">{result.matches.length} matches</span>
                </div>
                {result.matches.slice(0, 3).map((match, i) => (
                  <div key={i} className="search-result-match">
                    {match.line > 0 && (
                      <span className="search-result-line">L{match.line}: </span>
                    )}
                    <span className="search-result-preview">{match.preview}</span>
                  </div>
                ))}
                {result.matches.length > 3 && (
                  <div className="search-result-more">
                    +{result.matches.length - 3} more matches
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {searchQuery && searchResults.length === 0 && (
          <div className="search-empty">
            No results found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}
