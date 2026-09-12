import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAppStore, saveTabDocument } from '../state/appState';
import type { Tab } from '../types';

function makeTab(overrides: Partial<Tab> = {}): Tab {
  return {
    id: 'tab-1',
    document: {
      id: 'doc-1',
      name: 'README.md',
      path: 'README.md',
      content: '# Hello',
    },
    scrollPosition: 0,
    ...overrides,
  };
}

describe('View history (recent files)', () => {
  beforeEach(() => {
    useAppStore.setState({ recentFiles: [] });
  });

  it('records a recently viewed file with content', () => {
    const { addRecentFile } = useAppStore.getState();
    addRecentFile({ name: 'a.md', path: 'docs/a.md', lastOpened: 1, content: '# A' });

    const state = useAppStore.getState();
    expect(state.recentFiles).toHaveLength(1);
    expect(state.recentFiles[0].content).toBe('# A');
  });

  it('moves a repeated file to the front instead of duplicating', () => {
    const { addRecentFile } = useAppStore.getState();
    addRecentFile({ name: 'a.md', path: 'a.md', lastOpened: 1, content: '# A' });
    addRecentFile({ name: 'b.md', path: 'b.md', lastOpened: 2, content: '# B' });
    addRecentFile({ name: 'a.md', path: 'a.md', lastOpened: 3, content: '# A2' });

    const state = useAppStore.getState();
    expect(state.recentFiles).toHaveLength(2);
    expect(state.recentFiles[0].path).toBe('a.md');
    expect(state.recentFiles[0].content).toBe('# A2');
  });

  it('caps history at 30 entries', () => {
    const { addRecentFile } = useAppStore.getState();
    for (let i = 0; i < 40; i++) {
      addRecentFile({ name: `f${i}.md`, path: `f${i}.md`, lastOpened: i, content: `#${i}` });
    }
    expect(useAppStore.getState().recentFiles).toHaveLength(30);
    // Newest kept, oldest dropped
    expect(useAppStore.getState().recentFiles[0].path).toBe('f39.md');
  });
});

describe('Editing tabs', () => {
  beforeEach(() => {
    useAppStore.setState({ tabs: [], activeTabId: null });
  });

  it('marks tab dirty when content changes and clean again when reverted', () => {
    const tab = makeTab();
    useAppStore.getState().openTab(tab);
    expect(useAppStore.getState().tabs[0].dirty).toBe(false);

    useAppStore.getState().updateTabContent('tab-1', '# Hello edited');
    expect(useAppStore.getState().tabs[0].dirty).toBe(true);

    useAppStore.getState().updateTabContent('tab-1', '# Hello');
    expect(useAppStore.getState().tabs[0].dirty).toBe(false);
  });

  it('openTab initializes savedContent so dirty tracking works', () => {
    useAppStore.getState().openTab(makeTab());
    const tab = useAppStore.getState().tabs[0];
    expect(tab.savedContent).toBe('# Hello');
    expect(tab.dirty).toBe(false);
  });

  it('keeps other tabs untouched when editing one', () => {
    useAppStore.getState().openTab(makeTab());
    useAppStore.getState().openTab(
      makeTab({ id: 'tab-2', document: { id: 'doc-2', name: 'b.md', path: 'b.md', content: '# B' } })
    );
    useAppStore.getState().setActiveTab('tab-2');

    useAppStore.getState().updateTabContent('tab-2', '# B edited');

    const tabs = useAppStore.getState().tabs;
    expect(tabs.find((t) => t.id === 'tab-1')!.document.content).toBe('# Hello');
    expect(tabs.find((t) => t.id === 'tab-2')!.document.content).toBe('# B edited');
    expect(tabs.find((t) => t.id === 'tab-2')!.dirty).toBe(true);
  });
});

describe('saveTabDocument', () => {
  it('falls back to a download when no handle exists', async () => {
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});
    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:fake');
    const revokeObjectURLSpy = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {});

    const tab = makeTab({ document: { id: 'doc-1', name: 'README.md', path: 'README.md', content: '# data' } });
    const ok = await saveTabDocument(tab);

    expect(ok).toBe(true);
    expect(clickSpy).toHaveBeenCalled();

    clickSpy.mockRestore();
    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
  });
});
