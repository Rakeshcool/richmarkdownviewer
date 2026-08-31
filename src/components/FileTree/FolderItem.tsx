import { memo, type ReactNode } from 'react';
import type { FileNode } from '../../types';

interface FolderItemProps {
  node: FileNode;
  level: number;
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export const FolderItem = memo(function FolderItem({
  node,
  level,
  isExpanded,
  onToggle,
  children,
}: FolderItemProps) {
  return (
    <div role="treeitem" aria-expanded={isExpanded}>
      <div
        className="folder-item"
        onClick={onToggle}
        style={{ paddingLeft: `${12 + level * 12}px` }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <svg
          className={`folder-chevron ${isExpanded ? 'expanded' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <svg className="folder-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          {isExpanded ? (
            <>
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </>
          ) : (
            <>
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </>
          )}
        </svg>
        <span className="folder-name">{node.name}</span>
      </div>
      {children}
    </div>
  );
});
