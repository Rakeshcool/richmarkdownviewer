import { memo } from 'react';
import { useAppStore } from '../../state/appState';

export const StatusBar = memo(function StatusBar() {
  const { tabs, activeTabId, workspace, workspaceName } = useAppStore();
  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <div className="statusbar">
      <div className="statusbar-left">
        {workspaceName && (
          <span className="statusbar-item">
            {workspace === 'folder' ? '📁' : '📄'} {workspaceName}
          </span>
        )}
      </div>
      <div className="statusbar-right">
        {activeTab && (
          <span className="statusbar-item">
            {activeTab.document.name}
          </span>
        )}
        <span className="statusbar-item">
          {tabs.length} tab{tabs.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
});
