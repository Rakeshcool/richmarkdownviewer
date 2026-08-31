import { describe, it, expect } from 'vitest';
import { flattenFileTree, findFileByPath } from '../filesystem/fileSystem';
import type { FileNode } from '../types';

describe('FileTree', () => {
  const mockTree: FileNode[] = [
    {
      id: 'dir-1',
      name: 'docs',
      path: 'docs',
      type: 'directory',
      children: [
        {
          id: 'file-1',
          name: 'README.md',
          path: 'docs/README.md',
          type: 'file',
          content: '# README',
        },
        {
          id: 'file-2',
          name: 'guide.md',
          path: 'docs/guide.md',
          type: 'file',
          content: '# Guide',
        },
      ],
    },
    {
      id: 'file-3',
      name: 'index.md',
      path: 'index.md',
      type: 'file',
      content: '# Index',
    },
  ];

  describe('flattenFileTree', () => {
    it('flattens nested file tree to array of files', () => {
      const files = flattenFileTree(mockTree);

      expect(files).toHaveLength(3);
      expect(files.map((f) => f.name)).toEqual([
        'README.md',
        'guide.md',
        'index.md',
      ]);
    });

    it('ignores directories', () => {
      const files = flattenFileTree(mockTree);

      expect(files.every((f) => f.type === 'file')).toBe(true);
    });
  });

  describe('findFileByPath', () => {
    it('finds a file by path', () => {
      const file = findFileByPath(mockTree, 'docs/README.md');

      expect(file).toBeDefined();
      expect(file?.name).toBe('README.md');
    });

    it('finds root-level file', () => {
      const file = findFileByPath(mockTree, 'index.md');

      expect(file).toBeDefined();
      expect(file?.name).toBe('index.md');
    });

    it('returns undefined for non-existent path', () => {
      const file = findFileByPath(mockTree, 'nonexistent.md');

      expect(file).toBeUndefined();
    });
  });
});
