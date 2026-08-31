import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../state/appState';
import type { Tab } from '../types';

describe('Tabs', () => {
  beforeEach(() => {
    // Reset the store
    useAppStore.setState({
      tabs: [],
      activeTabId: null,
    });
  });

  describe('opening tabs', () => {
    it('opens a new tab', () => {
      const { openTab } = useAppStore.getState();
      const tab: Tab = {
        id: 'tab-1',
        document: {
          id: 'doc-1',
          name: 'README.md',
          path: 'README.md',
          content: '# Hello',
        },
        scrollPosition: 0,
      };

      openTab(tab);

      const state = useAppStore.getState();
      expect(state.tabs).toHaveLength(1);
      expect(state.activeTabId).toBe('tab-1');
    });

    it('prevents duplicate tabs', () => {
      const { openTab } = useAppStore.getState();
      const tab: Tab = {
        id: 'tab-1',
        document: {
          id: 'doc-1',
          name: 'README.md',
          path: 'README.md',
          content: '# Hello',
        },
        scrollPosition: 0,
      };

      openTab(tab);
      openTab(tab); // Try to open same tab again

      const state = useAppStore.getState();
      expect(state.tabs).toHaveLength(1);
    });
  });

  describe('closing tabs', () => {
    it('closes a tab', () => {
      const { openTab, closeTab } = useAppStore.getState();
      const tab: Tab = {
        id: 'tab-1',
        document: {
          id: 'doc-1',
          name: 'README.md',
          path: 'README.md',
          content: '# Hello',
        },
        scrollPosition: 0,
      };

      openTab(tab);
      closeTab('tab-1');

      const state = useAppStore.getState();
      expect(state.tabs).toHaveLength(0);
      expect(state.activeTabId).toBeNull();
    });

    it('switches to adjacent tab when closing active tab', () => {
      const { openTab, closeTab } = useAppStore.getState();
      const tab1: Tab = {
        id: 'tab-1',
        document: { id: 'doc-1', name: 'File1.md', path: 'File1.md', content: '' },
        scrollPosition: 0,
      };
      const tab2: Tab = {
        id: 'tab-2',
        document: { id: 'doc-2', name: 'File2.md', path: 'File2.md', content: '' },
        scrollPosition: 0,
      };

      openTab(tab1);
      openTab(tab2);
      closeTab('tab-2');

      const state = useAppStore.getState();
      expect(state.tabs).toHaveLength(1);
      expect(state.activeTabId).toBe('tab-1');
    });
  });

  describe('switching tabs', () => {
    it('switches to a different tab', () => {
      const { openTab, setActiveTab } = useAppStore.getState();
      const tab1: Tab = {
        id: 'tab-1',
        document: { id: 'doc-1', name: 'File1.md', path: 'File1.md', content: '' },
        scrollPosition: 0,
      };
      const tab2: Tab = {
        id: 'tab-2',
        document: { id: 'doc-2', name: 'File2.md', path: 'File2.md', content: '' },
        scrollPosition: 0,
      };

      openTab(tab1);
      openTab(tab2);
      setActiveTab('tab-1');

      const state = useAppStore.getState();
      expect(state.activeTabId).toBe('tab-1');
    });
  });
});
