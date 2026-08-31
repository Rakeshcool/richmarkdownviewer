import { useAppStore } from '../../state/appState';
import { useTheme } from '../../hooks/useTheme';

export function TopBar() {
  const { toggleSidebar, setShowSearch, toggleOutline } = useAppStore();
  const { theme, cycleTheme } = useTheme();

  const themeIcon = theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '💻';
  const themeLabel = theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System';

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
      </div>

      <div className="topbar-right">
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
