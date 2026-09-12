import { memo } from 'react';
import { useAppStore } from '../../state/appState';

export const StatusBar = memo(function StatusBar() {
  const { tabs, activeTabId, workspace, workspaceName, viewMode } = useAppStore();
  const activeTab = tabs.find((t) => t.id === activeTabId);
  const isDirty = Boolean(activeTab?.dirty);

  return (
    <div className="statusbar">
      <div className="statusbar-left">
        {workspaceName && (
          <span className="statusbar-item">
            {workspace === 'folder' ? '📁' : '📄'} {workspaceName}
          </span>
        )}
        {activeTab && (
          <span className="statusbar-item" title={viewMode === 'edit' ? 'Editing' : 'Reading'}>
            {viewMode === 'edit' ? '✏️ editing' : '👁 reading'}
          </span>
        )}
      </div>
      <div className="statusbar-right">
        {activeTab && (
          <span className="statusbar-item">
            {activeTab.document.name}
            {isDirty && (
              <span className="statusbar-dirty" title="Unsaved changes — Ctrl+S to save">
                ● unsaved
              </span>
            )}
          </span>
        )}
        <span className="statusbar-item">
          {tabs.length} tab{tabs.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
});
