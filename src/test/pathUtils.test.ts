import { describe, it, expect } from 'vitest';
import {
  getFileName,
  getFileExtension,
  isMarkdownFile,
  joinPath,
  normalizePath,
  getParentPath,
} from '../filesystem/pathUtils';

describe('pathUtils', () => {
  describe('getFileName', () => {
    it('extracts filename from path', () => {
      expect(getFileName('README.md')).toBe('README.md');
      expect(getFileName('docs/README.md')).toBe('README.md');
      expect(getFileName('src/components/App.tsx')).toBe('App.tsx');
    });

    it('handles Windows paths', () => {
      expect(getFileName('D:\\Notes\\README.md')).toBe('README.md');
    });
  });

  describe('getFileExtension', () => {
    it('extracts file extension', () => {
      expect(getFileExtension('README.md')).toBe('md');
      expect(getFileExtension('app.tsx')).toBe('tsx');
      expect(getFileExtension('no-extension')).toBe('');
    });

    it('returns lowercase extension', () => {
      expect(getFileExtension('README.MD')).toBe('md');
      expect(getFileExtension('file.MARKDOWN')).toBe('markdown');
    });
  });

  describe('isMarkdownFile', () => {
    it('identifies markdown files', () => {
      expect(isMarkdownFile('README.md')).toBe(true);
      expect(isMarkdownFile('notes.markdown')).toBe(true);
      expect(isMarkdownFile('app.tsx')).toBe(false);
      expect(isMarkdownFile('styles.css')).toBe(false);
    });
  });

  describe('joinPath', () => {
    it('joins path segments', () => {
      expect(joinPath('docs', 'README.md')).toBe('docs/README.md');
      expect(joinPath('src', 'components', 'App.tsx')).toBe('src/components/App.tsx');
    });

    it('handles double slashes', () => {
      expect(joinPath('docs//', '//README.md')).toBe('docs/README.md');
    });
  });

  describe('normalizePath', () => {
    it('normalizes Windows paths', () => {
      expect(normalizePath('D:\\Notes\\README.md')).toBe('D:/Notes/README.md');
    });

    it('removes double slashes', () => {
      expect(normalizePath('docs//README.md')).toBe('docs/README.md');
    });
  });

  describe('getParentPath', () => {
    it('returns parent directory', () => {
      expect(getParentPath('docs/README.md')).toBe('docs');
      expect(getParentPath('src/components/App.tsx')).toBe('src/components');
    });
  });
});
