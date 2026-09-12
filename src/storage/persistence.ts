/**
 * Durable key/value persistence layer.
 *
 * - Inside Tauri: uses tauri-plugin-store, which writes a real JSON file
 *   under the app's data directory. It survives app restarts, WebView
 *   profile resets, and reinstalls (file lives outside the webview).
 * - In the browser: falls back to localStorage.
 *
 * Both backends share the same shape: get()/set() of a single JSON blob
 * under STORAGE_KEY.
 */

const STORAGE_KEY = 'markdown-browser-state';

export interface PersistedState {
  sidebarWidth?: number;
  sidebarExpanded?: boolean;
  theme?: { mode: 'light' | 'dark' | 'system' };
  expandedFolders?: string[];
  recentFiles?: unknown[];
}

function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

// Lazily-created store promise (Tauri only)
let storePromise: Promise<any> | null = null;

async function getTauriStore(): Promise<any> {
  if (!storePromise) {
    storePromise = (async () => {
      const { load, Store } = await import('@tauri-apps/plugin-store');
      // lazy getter keeps a singleton around for repeated calls
      void Store;
      return load('markdown-browser-store.json', { autoSave: false });
    })();
  }
  return storePromise;
}

export async function loadPersisted(): Promise<PersistedState | null> {
  try {
    if (isTauri()) {
      const store = await getTauriStore();
      const value = await store.get(STORAGE_KEY);
      return (value as PersistedState) ?? null;
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as PersistedState) : null;
  } catch (error) {
    console.warn('Failed to load persisted state:', error);
    return null;
  }
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Persist state. In Tauri this writes to disk (debounced 300ms);
 * in the browser it writes localStorage immediately.
 */
export async function persistState(state: PersistedState): Promise<void> {
  try {
    if (isTauri()) {
      const store = await getTauriStore();
      await store.set(STORAGE_KEY, state);
      if (saveTimer) clearTimeout(saveTimer);
      await new Promise<void>((resolve) => {
        saveTimer = setTimeout(resolve, 300);
      });
      await store.save();
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to persist state:', error);
  }
}

/** Flush any pending debounced write (used on window close / pagehide). */
export async function flushPersist(): Promise<void> {
  if (!isTauri()) return;
  try {
    const store = await getTauriStore();
    await store.save();
  } catch {
    // best-effort
  }
}
