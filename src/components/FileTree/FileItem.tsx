import { memo, useCallback } from 'react';
import { useAppStore } from '../../state/appState';
import type { FileNode } from '../../types';

interface FileItemProps {
  node: FileNode;
  level: number;
}

export const FileItem = memo(function FileItem({ node, level }: FileItemProps) {
  const { tabs, activeTabId, openTab, addRecentFile } = useAppStore();

  const isActive = tabs.some((t) => t.document.id === node.id && t.id === activeTabId);

  const handleClick = useCallback(() => {
    if (node.content) {
      openTab({
        id: node.id,
        document: {
          id: node.id,
          name: node.name,
          path: node.path,
          content: node.content,
          handle: node.handle as any,
        },
        scrollPosition: 0,
      });

      addRecentFile({
        name: node.name,
        path: node.path,
        lastOpened: Date.now(),
      });
    }
  }, [node, openTab, addRecentFile]);

  return (
    <div
      className={`file-item ${isActive ? 'active' : ''}`}
      role="treeitem"
      aria-selected={isActive}
      onClick={handleClick}
      style={{ paddingLeft: `${12 + level * 12}px` }}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <svg className="file-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      <span className="file-name">{node.name}</span>
    </div>
  );
});
