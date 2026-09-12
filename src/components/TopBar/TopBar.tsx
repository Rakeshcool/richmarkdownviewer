import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppStore } from '../../state/appState';
import { useTheme } from '../../hooks/useTheme';
import type { RecentFile } from '../../types';

export function TopBar() {
  const {
    toggleSidebar,
    setShowSearch,
    toggleOutline,
    viewMode,
    toggleViewMode,
    recentFiles,
    openTab,
    setViewMode,
    activeTabId,
  } = useAppStore();
  const { theme, cycleTheme } = useTheme();
  const [historyOpen, setHistoryOpen] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);

  const themeIcon = theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '💻';
  const themeLabel = theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System';

  // Close history dropdown on outside click or Escape
  useEffect(() => {
    if (!historyOpen) return;

    const handlePointer = (e: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
        setHistoryOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setHistoryOpen(false);
    };

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [historyOpen]);

  const openHistoryEntry = useCallback(
    (entry: RecentFile) => {
      if (!entry.content) return;
      openTab({
        id: `history-${entry.path}`,
        document: {
          id: `history-${entry.path}`,
          name: entry.name,
          path: entry.path,
          content: entry.content,
        },
        scrollPosition: 0,
      });
      setViewMode('read');
      setHistoryOpen(false);
    },
    [openTab, setViewMode]
  );

  const viewable = recentFiles.filter((f) => f.content);

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button
          className="topbar-button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          title="Toggle sidebar (Ctrl+B)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>
        <span className="topbar-title">Markdown Browser</span>

        <div className="history-container" ref={historyRef}>
          <button
            className="topbar-button"
            onClick={() => setHistoryOpen((o) => !o)}
            aria-label="View history"
            aria-expanded={historyOpen}
            title="Recently viewed files"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </button>

          {historyOpen && (
            <div className="history-dropdown" role="menu">
              <div className="history-header">Recently viewed</div>
              {viewable.length === 0 ? (
                <div className="history-empty">
                  Files you open will appear here.
                </div>
              ) : (
                viewable.map((entry) => (
                  <button
                    key={entry.path}
                    className="history-item"
                    role="menuitem"
                    onClick={() => openHistoryEntry(entry)}
                    title={entry.path}
                  >
                    <svg className="history-item-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span className="history-item-name">{entry.name}</span>
                    <span className="history-item-time">
                      {formatRelativeTime(entry.lastOpened)}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="topbar-right">
        {activeTabId && (
          <button
            className="topbar-button"
            onClick={toggleViewMode}
            aria-label={viewMode === 'read' ? 'Switch to edit mode' : 'Switch to read mode'}
            title={viewMode === 'read' ? 'Edit file' : 'Back to reading'}
          >
            {viewMode === 'read' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}

        <button
          className="topbar-button"
          onClick={() => setShowSearch(true)}
          aria-label="Search"
          title="Quick search (Ctrl+P)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        <button
          className="topbar-button"
          onClick={toggleOutline}
          aria-label="Toggle outline"
          title="Toggle document outline"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </button>

        <button
          className="topbar-button"
          onClick={cycleTheme}
          aria-label={`Theme: ${themeLabel}`}
          title={`Theme: ${themeLabel}`}
        >
          <span style={{ fontSize: '16px' }}>{themeIcon}</span>
        </button>
      </div>
    </div>
  );
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
