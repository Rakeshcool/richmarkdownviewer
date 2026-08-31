import type { FileNode, FileSystemAccessResult } from '../types';
import { isMarkdownFile, normalizePath } from './pathUtils';

let idCounter = 0;
function generateId(): string {
  return `file-${Date.now()}-${idCounter++}`;
}

export function openFileFallback(): Promise<FileSystemAccessResult> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown';
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        resolve({ success: false, error: 'No file selected' });
        return;
      }

      try {
        const content = await file.text();
        resolve({
          success: true,
          files: [
            {
              id: generateId(),
              name: file.name,
              path: file.name,
              type: 'file',
              content,
            },
          ],
        });
      } catch (error) {
        resolve({
          success: false,
          error: `Failed to read file: ${(error as Error).message}`,
        });
      }
    };
    input.click();
  });
}

export function openFolderFallback(): Promise<FileSystemAccessResult> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    (input as any).webkitdirectory = true;
    input.multiple = true;

    input.onchange = async (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (!files || files.length === 0) {
        resolve({ success: false, error: 'No folder selected' });
        return;
      }

      try {
        const markdownFiles: FileNode[] = [];

        for (const file of Array.from(files)) {
          if (isMarkdownFile(file.name)) {
            const relativePath = file.webkitRelativePath || file.name;
            const pathParts = relativePath.split('/');
            pathParts.shift(); // Remove the folder name
            const cleanPath = pathParts.join('/');

            const content = await file.text();
            markdownFiles.push({
              id: generateId(),
              name: file.name,
              path: normalizePath(cleanPath),
              type: 'file',
              content,
            });
          }
        }

        const tree = buildTreeFromFiles(markdownFiles);
        resolve({
          success: true,
          files: tree,
        });
      } catch (error) {
        resolve({
          success: false,
          error: `Failed to read folder: ${(error as Error).message}`,
        });
      }
    };

    input.click();
  });
}

function buildTreeFromFiles(files: FileNode[]): FileNode[] {
  const tree: FileNode[] = [];

  for (const file of files) {
    const parts = file.path.split('/');
    let currentLevel = tree;

    for (let i = 0; i < parts.length - 1; i++) {
      const dirName = parts[i];
      let dir = currentLevel.find(
        (n) => n.type === 'directory' && n.name === dirName
      );

      if (!dir) {
        dir = {
          id: generateId(),
          name: dirName,
          path: parts.slice(0, i + 1).join('/'),
          type: 'directory',
          children: [],
        };
        currentLevel.push(dir);
      }

      currentLevel = dir.children!;
    }

    currentLevel.push(file);
  }

  return sortNodes(tree);
}

function sortNodes(nodes: FileNode[]): FileNode[] {
  return nodes.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }
    return a.type === 'directory' ? -1 : 1;
  });
}
