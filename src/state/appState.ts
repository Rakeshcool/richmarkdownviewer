import { create } from 'zustand';
import type { Tab, FileNode, Theme, RecentFile, SearchResult, WorkspaceState, ViewMode } from '../types';
import { loadPersisted, persistState, flushPersist } from '../storage/persistence';

/** Maximum number of history entries kept */
const MAX_HISTORY = 30;
/** Max characters of content stored per history entry (~50 KB cap) */
const MAX_HISTORY_CONTENT_CHARS = 50_000;

interface AppState {
  // Workspace
  workspace: WorkspaceState;
  fileTree: FileNode[];
  setWorkspace: (workspace: WorkspaceState) => void;
  setFileTree: (tree: FileNode[]) => void;
  workspaceName: string;
  setWorkspaceName: (name: string) => void;

  // Tabs
  tabs: Tab[];
  activeTabId: string | null;
  openTab: (tab: Tab) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateScrollPosition: (tabId: string, position: number) => void;

  // Sidebar
  sidebarExpanded: boolean;
  sidebarWidth: number;
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  expandedFolders: Set<string>;
  toggleFolder: (folderId: string) => void;

  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Recent files
  recentFiles: RecentFile[];
  addRecentFile: (file: RecentFile) => void;

  // Search
  searchQuery: string;
  searchResults: SearchResult[];
  showSearch: boolean;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: SearchResult[]) => void;
  setShowSearch: (show: boolean) => void;

  // Outline
  showOutline: boolean;
  toggleOutline: () => void;

  // View mode (read / edit)
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;

  // Editing
  updateTabContent: (tabId: string, content: string) => void;
  saveActiveTab: () => Promise<boolean>;
  setTabDirty: (tabId: string, dirty: boolean) => void;

  // Mobile
  showMobileSidebar: boolean;
  setShowMobileSidebar: (show: boolean) => void;
}

function serializeState(state: Partial<AppState>) {
  return {
    sidebarWidth: state.sidebarWidth,
    theme: state.theme,
    expandedFolders: state.expandedFolders ? Array.from(state.expandedFolders) : [],
    recentFiles: (state.recentFiles || []).map((f) => ({
      ...f,
      // Don't persist huge blobs: cap content stored per history entry
      content:
        f.content && f.content.length > MAX_HISTORY_CONTENT_CHARS
          ? undefined
          : f.content,
    })),
  };
}

/** Hydrate persisted state into the store once the storage backend resolves. */
async function hydrateState() {
  const saved = await loadPersisted();
  if (!saved) return;
  useAppStore.setState((s) => ({
    sidebarWidth: saved.sidebarWidth ?? s.sidebarWidth,
    theme: saved.theme ?? s.theme,
    expandedFolders: new Set(saved.expandedFolders || []),
    recentFiles: (saved.recentFiles as RecentFile[] | undefined) || s.recentFiles,
  }));
}

void hydrateState();

// Best-effort flush when the window/app closes
if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => {
    void flushPersist();
  });
}

export const useAppStore = create<AppState>((set, get) => ({
  // Workspace
  workspace: 'empty',
  fileTree: [],
  workspaceName: '',
  setWorkspace: (workspace) => set({ workspace }),
  setFileTree: (tree) => set({ fileTree: tree }),
  setWorkspaceName: (name) => set({ workspaceName: name }),

  // Tabs
  tabs: [],
  activeTabId: null,
  openTab: (tab) => {
    const state = get();
    // Dedupe by path first (same file opened from tree/search/history), then by id
    const existingTab =
      state.tabs.find((t) => t.document.path === tab.document.path) ||
      state.tabs.find((t) => t.document.id === tab.document.id);
    if (existingTab) {
      // Refresh content and re-point the id so the tab stays in sync
      set({
        tabs: state.tabs.map((t) =>
          t.id === existingTab.id
            ? {
                ...t,
                id: tab.id,
                document: { ...t.document, content: tab.document.content },
                dirty: false,
                savedContent: tab.document.content,
              }
            : t
        ),
        activeTabId: tab.id,
      });
    } else {
      const tabWithSaveState: Tab = {
        ...tab,
        dirty: false,
        savedContent: tab.document.content,
      };
      set({
        tabs: [...state.tabs, tabWithSaveState],
        activeTabId: tabWithSaveState.id,
      });
    }
  },
  closeTab: (tabId) => {
    const state = get();
    const newTabs = state.tabs.filter((t) => t.id !== tabId);
    let newActiveId = state.activeTabId;

    if (state.activeTabId === tabId) {
      const closedIndex = state.tabs.findIndex((t) => t.id === tabId);
      if (newTabs.length > 0) {
        newActiveId = newTabs[Math.min(closedIndex, newTabs.length - 1)].id;
      } else {
        newActiveId = null;
      }
    }

    set({
      tabs: newTabs,
      activeTabId: newActiveId,
    });
  },
  setActiveTab: (tabId) => set({ activeTabId: tabId }),
  updateScrollPosition: (tabId, position) => {
    const state = get();
    set({
      tabs: state.tabs.map((t) =>
        t.id === tabId ? { ...t, scrollPosition: position } : t
      ),
    });
  },

  // Sidebar
  sidebarExpanded: true,
  sidebarWidth: 280,
  toggleSidebar: () => {
    const newExpanded = !get().sidebarExpanded;
    set({ sidebarExpanded: newExpanded });
    void persistState(serializeState(get()));
  },
  setSidebarWidth: (width) => {
    set({ sidebarWidth: Math.max(200, Math.min(500, width)) });
    void persistState(serializeState(get()));
  },
  expandedFolders: new Set<string>(),
  toggleFolder: (folderId) => {
    const state = get();
    const newExpanded = new Set(state.expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    set({ expandedFolders: newExpanded });
    void persistState(serializeState(get()));
  },

  // Theme
  theme: { mode: 'system' },
  setTheme: (theme) => {
    set({ theme });
    void persistState(serializeState(get()));
  },

  // Recent files (view history)
  recentFiles: [],
  addRecentFile: (file) => {
    const state = get();
    const filtered = state.recentFiles.filter((f) => f.path !== file.path);
    const newRecent = [file, ...filtered].slice(0, MAX_HISTORY);
    set({ recentFiles: newRecent });
    void persistState(serializeState(get()));
  },

  // Search
  searchQuery: '',
  searchResults: [],
  showSearch: false,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),
  setShowSearch: (show) => set({ showSearch: show }),

  // Outline
  showOutline: false,
  toggleOutline: () => set({ showOutline: !get().showOutline }),

  // Mobile
  showMobileSidebar: false,
  setShowMobileSidebar: (show) => set({ showMobileSidebar: show }),

  // View mode
  viewMode: 'read',
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleViewMode: () =>
    set((state) => ({ viewMode: state.viewMode === 'read' ? 'edit' : 'read' })),

  // Editing
  updateTabContent: (tabId, content) => {
    const state = get();
    set({
      tabs: state.tabs.map((t) => {
        if (t.id !== tabId) return t;
        const saved = t.savedContent ?? t.document.content;
        return {
          ...t,
          document: { ...t.document, content },
          dirty: content !== saved,
        };
      }),
    });
  },
  setTabDirty: (tabId, dirty) => {
    const state = get();
    set({
      tabs: state.tabs.map((t) => (t.id === tabId ? { ...t, dirty } : t)),
    });
  },
  saveActiveTab: async () => {
    const state = get();
    const tab = state.tabs.find((t) => t.id === state.activeTabId);
    if (!tab || !tab.dirty) return false;
    const ok = await saveTabDocument(tab);
    if (ok) {
      set({
        tabs: state.tabs.map((t) =>
          t.id === tab.id
            ? { ...t, dirty: false, savedContent: t.document.content }
            : t
        ),
      });
    }
    return ok;
  },
}));

/**
 * Save a tab's document back to disk via its File System Access handle.
 * Falls back to download for files opened without a handle.
 */
export async function saveTabDocument(tab: Tab): Promise<boolean> {
  const handle = tab.document.handle as any;
  const content = tab.document.content;

  if (handle && typeof handle.createWritable === 'function') {
    try {
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
      return true;
    } catch (error) {
      // Permission may have been revoked; fall through to download fallback
      console.warn('Direct save failed, falling back to download:', error);
    }
  }

  // No usable handle: offer the file as a download so work is never lost
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = tab.document.name;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}

// Dev-only: expose the store for debugging and E2E testing
if (import.meta.env.DEV) {
  (window as any).__markdownBrowserStore = useAppStore;
}
