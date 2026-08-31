import { useState, useCallback, useRef, useEffect } from 'react';
import { useAppStore } from '../../state/appState';
import { useWorkspace } from '../../hooks/useWorkspace';
import { FileTree } from '../FileTree/FileTree';

export function Sidebar() {
  const { sidebarExpanded, sidebarWidth, setSidebarWidth, fileTree } = useAppStore();
  const { handleOpenFile, handleOpenFolder } = useWorkspace();
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (sidebarRef.current) {
        const rect = sidebarRef.current.getBoundingClientRect();
        const newWidth = e.clientX - rect.left;
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setSidebarWidth]);

  if (!sidebarExpanded) return null;

  return (
    <div
      ref={sidebarRef}
      className="sidebar"
      style={{ width: sidebarWidth }}
    >
      <div
        className={`sidebar-resize-handle ${isResizing ? 'active' : ''}`}
        onMouseDown={handleMouseDown}
      />

      <div className="sidebar-content">
        <div className="sidebar-header">
          <h3 className="sidebar-title">Workspace</h3>
        </div>

        <div className="sidebar-actions">
          <button className="sidebar-action-button" onClick={handleOpenFile}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            Open File
          </button>
          <button className="sidebar-action-button" onClick={handleOpenFolder}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              <line x1="12" y1="11" x2="12" y2="17" />
              <line x1="9" y1="14" x2="15" y2="14" />
            </svg>
            Open Folder
          </button>
        </div>

        {fileTree.length > 0 ? (
          <div className="sidebar-files">
            <FileTree files={fileTree} />
          </div>
        ) : (
          <div className="sidebar-empty">
            <p>No files loaded</p>
            <p className="sidebar-empty-hint">
              Open a Markdown file or folder to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
