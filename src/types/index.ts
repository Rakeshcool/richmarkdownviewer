export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  handle?: FileSystemFileHandle | FileSystemDirectoryHandle;
  content?: string;
}

export interface MarkdownDocument {
  id: string;
  name: string;
  path: string;
  content: string;
  handle?: FileSystemFileHandle;
}

export interface Tab {
  id: string;
  document: MarkdownDocument;
  scrollPosition: number;
  /** True when the document has unsaved changes */
  dirty?: boolean;
  /** The last saved content, used as the revert target */
  savedContent?: string;
}

export interface SearchQuery {
  text: string;
  results: SearchResult[];
}

export interface SearchResult {
  document: MarkdownDocument;
  matches: SearchMatch[];
}

export interface SearchMatch {
  line: number;
  text: string;
  preview: string;
}

export interface Theme {
  mode: 'light' | 'dark' | 'system';
}

export type WorkspaceState = 'empty' | 'file' | 'folder';

export type ViewMode = 'read' | 'edit';

export interface AppState {
  workspace: WorkspaceState;
  fileTree: FileNode[];
  tabs: Tab[];
  activeTabId: string | null;
  sidebarExpanded: boolean;
  sidebarWidth: number;
  theme: Theme;
  recentFiles: RecentFile[];
  searchQuery: string;
  searchResults: SearchResult[];
  showSearch: boolean;
  showOutline: boolean;
  outlineVisible: boolean;
  viewMode: ViewMode;
}

export interface RecentFile {
  name: string;
  path: string;
  lastOpened: number;
  /** Snapshot of the content at last open, so history entries stay viewable without filesystem access */
  content?: string;
}

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export interface FileSystemAccessResult {
  success: boolean;
  files?: FileNode[];
  error?: string;
}
