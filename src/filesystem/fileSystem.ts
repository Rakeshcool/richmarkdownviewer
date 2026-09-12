import type { FileNode, FileSystemAccessResult } from '../types';
import { isMarkdownFile, joinPath, normalizePath } from './pathUtils';

let idCounter = 0;
function generateId(): string {
  return `file-${Date.now()}-${idCounter++}`;
}

/**
 * Ask for read/write permission on a handle we already hold.
 * Returns true if the handle is writable.
 */
export async function ensureWritePermission(handle: any): Promise<boolean> {
  if (!handle) return false;
  try {
    if ((await handle.queryPermission({ mode: 'readwrite' })) === 'granted') {
      return true;
    }
    return (
      (await handle.requestPermission({ mode: 'readwrite' })) === 'granted'
    );
  } catch {
    return false;
  }
}

export function isFileSystemAccessSupported(): boolean {
  return 'showOpenFilePicker' in window || 'showDirectoryPicker' in window;
}

export async function openFile(): Promise<FileSystemAccessResult> {
  try {
    const [fileHandle] = await (window as any).showOpenFilePicker({
      types: [
        {
          description: 'Markdown files',
          accept: {
            'text/markdown': ['.md', '.markdown'],
            'text/plain': ['.md', '.markdown'],
          },
        },
      ],
      multiple: false,
    });
    // Request readwrite up front so saving later doesn't need another prompt
    await ensureWritePermission(fileHandle);

    const file = await fileHandle.getFile();
    const content = await file.text();
    const name = file.name;
    const path = name;

    return {
      success: true,
      files: [
        {
          id: generateId(),
          name,
          path,
          type: 'file',
          content,
          handle: fileHandle,
        },
      ],
    };
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      return { success: false, error: 'User cancelled' };
    }
    return {
      success: false,
      error: `Failed to open file: ${(error as Error).message}`,
    };
  }
}

export async function openFolder(): Promise<FileSystemAccessResult> {
  try {
    const dirHandle = await (window as any).showDirectoryPicker({
      mode: 'readwrite',
    });

    const files = await scanDirectory(dirHandle, '');
    const markdownFiles = files.filter((f) => f.type === 'file' && isMarkdownFile(f.name));

    return {
      success: true,
      files: markdownFiles.length > 0 ? files : [],
    };
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      return { success: false, error: 'User cancelled' };
    }
    return {
      success: false,
      error: `Failed to open folder: ${(error as Error).message}`,
    };
  }
}

async function scanDirectory(
  dirHandle: any,
  parentPath: string
): Promise<FileNode[]> {
  const nodes: FileNode[] = [];

  for await (const [name, handle] of dirHandle.entries()) {
    if (name.startsWith('.')) continue;

    const path = joinPath(parentPath, name);

    if (handle.kind === 'file') {
      if (isMarkdownFile(name)) {
        const file = await handle.getFile();
        const content = await file.text();

        nodes.push({
          id: generateId(),
          name,
          path: normalizePath(path),
          type: 'file',
          content,
          handle,
        });
      }
    } else if (handle.kind === 'directory') {
      const children = await scanDirectory(handle, path);
      if (children.length > 0) {
        nodes.push({
          id: generateId(),
          name,
          path: normalizePath(path),
          type: 'directory',
          children,
          handle,
        });
      }
    }
  }

  return sortNodes(nodes);
}

function sortNodes(nodes: FileNode[]): FileNode[] {
  return nodes.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }
    return a.type === 'directory' ? -1 : 1;
  });
}

export async function readFileContent(fileHandle: any): Promise<string> {
  try {
    const file = await fileHandle.getFile();
    return await file.text();
  } catch (error) {
    throw new Error(`Failed to read file: ${(error as Error).message}`);
  }
}

export function flattenFileTree(tree: FileNode[]): FileNode[] {
  const result: FileNode[] = [];

  function traverse(nodes: FileNode[]) {
    for (const node of nodes) {
      if (node.type === 'file') {
        result.push(node);
      }
      if (node.children) {
        traverse(node.children);
      }
    }
  }

  traverse(tree);
  return result;
}

export function findFileByPath(tree: FileNode[], path: string): FileNode | undefined {
  for (const node of tree) {
    if (node.path === path) return node;
    if (node.children) {
      const found = findFileByPath(node.children, path);
      if (found) return found;
    }
  }
  return undefined;
}
