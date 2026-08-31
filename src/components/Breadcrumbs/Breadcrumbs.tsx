import { memo } from 'react';
import { useAppStore } from '../../state/appState';

export const Breadcrumbs = memo(function Breadcrumbs() {
  const { tabs, activeTabId } = useAppStore();
  const activeTab = tabs.find((t) => t.id === activeTabId);

  if (!activeTab) return null;

  const pathParts = activeTab.document.path.split('/').filter(Boolean);

  return (
    <div className="breadcrumbs">
      {pathParts.map((part, index) => (
        <span key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {index > 0 && (
            <span className="breadcrumb-separator">/</span>
          )}
          {index === pathParts.length - 1 ? (
            <span className="breadcrumb-current">{part}</span>
          ) : (
            <span className="breadcrumb-item">{part}</span>
          )}
        </span>
      ))}
    </div>
  );
});
