import { useEffect, useCallback } from 'react';
import { useAppStore } from './state/appState';
import { TopBar } from './components/TopBar/TopBar';
import { Sidebar } from './components/Sidebar/Sidebar';
import { TabBar } from './components/TabBar/TabBar';
import { Breadcrumbs } from './components/Breadcrumbs/Breadcrumbs';
import { StatusBar } from './components/StatusBar/StatusBar';
import { Search } from './components/Search/Search';
import { DocumentOutline } from './components/DocumentOutline/DocumentOutline';
import { ChatRenderer } from './markdown/ChatRenderer';
import { MarkdownEditor } from './components/MarkdownEditor/MarkdownEditor';
import { useWorkspace } from './hooks/useWorkspace';
import { useTheme } from './hooks/useTheme';
import { useSearch } from './hooks/useSearch';
import './styles/global.css';
import './styles/layout.css';

function App() {
  const {
    tabs,
    activeTabId,
    sidebarExpanded,
    showOutline,
    showMobileSidebar,
    setShowMobileSidebar,
    toggleSidebar,
    viewMode,
    saveActiveTab,
  } = useAppStore();

  const { handleOpenFile, handleOpenFolder } = useWorkspace();
  useTheme();
  useSearch();

  const activeTab = tabs.find((t) => t.id === activeTabId);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ctrl/Cmd + O - Open file
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        handleOpenFile();
      }
      // Ctrl/Cmd + Shift + O - Open folder
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'O') {
        e.preventDefault();
        handleOpenFolder();
      }
      // Ctrl/Cmd + F - Toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
      // Ctrl/Cmd + S - Save current file
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveActiveTab();
      }
      // Escape - Close dialogs
      if (e.key === 'Escape') {
        setShowMobileSidebar(false);
      }
    },
    [handleOpenFile, handleOpenFolder, toggleSidebar, setShowMobileSidebar, saveActiveTab]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="app-layout">
      <TopBar />

      <div className="main-layout">
        {sidebarExpanded && (
          <>
            <Sidebar />
            {showMobileSidebar && (
              <div
                className="sidebar-overlay"
                onClick={() => setShowMobileSidebar(false)}
              />
            )}
          </>
        )}

        <div className="content-area">
          <TabBar />
          <Breadcrumbs />

          <div className="markdown-content">
            {activeTab ? (
              viewMode === 'edit' ? (
                <MarkdownEditor
                  tabId={activeTab.id}
                  content={activeTab.document.content}
                  name={activeTab.document.name}
                />
              ) : (
                <div className="markdown-content-inner">
                  <ChatRenderer content={activeTab.document.content} />
                </div>
              )
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📄</div>
                <div className="empty-state-title">No file open</div>
                <div className="empty-state-text">
                  Open a Markdown file or folder to get started
                </div>
                <div className="empty-state-actions">
                  <button className="empty-state-button primary" onClick={handleOpenFile}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                    Open File
                  </button>
                  <button className="empty-state-button" onClick={handleOpenFolder}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                      <line x1="12" y1="11" x2="12" y2="17" />
                      <line x1="9" y1="14" x2="15" y2="14" />
                    </svg>
                    Open Folder
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {showOutline && activeTab && <DocumentOutline />}
      </div>

      <StatusBar />
      <Search />
    </div>
  );
}

export default App;
