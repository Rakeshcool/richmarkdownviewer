import { create } from 'zustand';
import type { Tab, FileNode, Theme, RecentFile, SearchResult, WorkspaceState } from '../types';

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

  // Mobile
  showMobileSidebar: boolean;
  setShowMobileSidebar: (show: boolean) => void;
}

const STORAGE_KEY = 'markdown-browser-state';

function loadState(): Partial<AppState> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignore errors
  }
  return {};
}

function saveState(state: Partial<AppState>) {
  try {
    const toSave = {
      sidebarWidth: state.sidebarWidth,
      theme: state.theme,
      expandedFolders: state.expandedFolders ? Array.from(state.expandedFolders) : [],
      recentFiles: state.recentFiles,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // Ignore errors
  }
}

const savedState = loadState();

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
    const existingTab = state.tabs.find((t) => t.document.id === tab.document.id);
    if (existingTab) {
      set({ activeTabId: existingTab.id });
    } else {
      set({
        tabs: [...state.tabs, tab],
        activeTabId: tab.id,
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
  sidebarExpanded: savedState.sidebarExpanded ?? true,
  sidebarWidth: savedState.sidebarWidth ?? 280,
  toggleSidebar: () => {
    const newExpanded = !get().sidebarExpanded;
    set({ sidebarExpanded: newExpanded });
    saveState({ ...get(), sidebarExpanded: newExpanded });
  },
  setSidebarWidth: (width) => {
    set({ sidebarWidth: Math.max(200, Math.min(500, width)) });
    saveState({ ...get(), sidebarWidth: width });
  },
  expandedFolders: new Set(savedState.expandedFolders || []),
  toggleFolder: (folderId) => {
    const state = get();
    const newExpanded = new Set(state.expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    set({ expandedFolders: newExpanded });
    saveState({ ...get(), expandedFolders: newExpanded });
  },

  // Theme
  theme: savedState.theme || { mode: 'system' },
  setTheme: (theme) => {
    set({ theme });
    saveState({ ...get(), theme });
  },

  // Recent files
  recentFiles: savedState.recentFiles || [],
  addRecentFile: (file) => {
    const state = get();
    const filtered = state.recentFiles.filter((f) => f.path !== file.path);
    const newRecent = [file, ...filtered].slice(0, 10);
    set({ recentFiles: newRecent });
    saveState({ ...get(), recentFiles: newRecent });
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
}));
