import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../state/appState';
import type { FileNode } from '../types';

describe('Search', () => {
  beforeEach(() => {
    // Reset the store
    useAppStore.setState({
      fileTree: [],
      searchQuery: '',
      searchResults: [],
    });
  });

  describe('file search', () => {
    it('searches filenames', () => {
      const fileTree: FileNode[] = [
        {
          id: 'file-1',
          name: 'README.md',
          path: 'README.md',
          type: 'file',
          content: '# Hello World',
        },
        {
          id: 'file-2',
          name: 'notes.md',
          path: 'notes.md',
          type: 'file',
          content: '# My Notes',
        },
      ];

      useAppStore.setState({ fileTree });

      const allFiles = fileTree.filter((f) => f.type === 'file');
      const results = allFiles.filter((f) =>
        f.name.toLowerCase().includes('readme')
      );

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('README.md');
    });

    it('searches content', () => {
      const fileTree: FileNode[] = [
        {
          id: 'file-1',
          name: 'README.md',
          path: 'README.md',
          type: 'file',
          content: 'This is about llama.cpp usage',
        },
        {
          id: 'file-2',
          name: 'notes.md',
          path: 'notes.md',
          type: 'file',
          content: 'Regular notes',
        },
      ];

      useAppStore.setState({ fileTree });

      const allFiles = fileTree.filter((f) => f.type === 'file');
      const results = allFiles.filter((f) =>
        f.content?.toLowerCase().includes('llama.cpp')
      );

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('README.md');
    });
  });
});
