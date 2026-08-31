import { memo, useCallback } from 'react';
import { useAppStore } from '../../state/appState';
import type { Tab } from '../../types';

export function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useAppStore();

  if (tabs.length === 0) return null;

  return (
    <div className="tab-bar" role="tablist">
      {tabs.map((tab) => (
        <TabItem
          key={tab.id}
          tab={tab}
          isActive={tab.id === activeTabId}
          onActivate={() => setActiveTab(tab.id)}
          onClose={() => closeTab(tab.id)}
        />
      ))}
    </div>
  );
}

interface TabItemProps {
  tab: Tab;
  isActive: boolean;
  onActivate: () => void;
  onClose: () => void;
}

const TabItem = memo(function TabItem({ tab, isActive, onActivate, onClose }: TabItemProps) {
  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClose();
    },
    [onClose]
  );

  return (
    <div
      className={`tab ${isActive ? 'active' : ''}`}
      role="tab"
      aria-selected={isActive}
      onClick={onActivate}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate();
        }
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.6, flexShrink: 0 }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      <span className="tab-name">{tab.document.name}</span>
      <button
        className="tab-close"
        onClick={handleClose}
        aria-label={`Close ${tab.document.name}`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
});
