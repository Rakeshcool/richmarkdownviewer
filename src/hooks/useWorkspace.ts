import { useCallback } from 'react';
import { useAppStore } from '../state/appState';
import { openFile, openFolder, isFileSystemAccessSupported } from '../filesystem/fileSystem';
import { openFileFallback, openFolderFallback } from '../filesystem/fallback';

export function useWorkspace() {
  const {
    setWorkspace,
    setFileTree,
    setWorkspaceName,
    openTab,
    addRecentFile,
  } = useAppStore();

  const handleOpenFile = useCallback(async () => {
    let result;

    if (isFileSystemAccessSupported()) {
      result = await openFile();
    } else {
      result = await openFileFallback();
    }

    if (result.success && result.files && result.files.length > 0) {
      const file = result.files[0];
      setWorkspace('file');
      setFileTree(result.files);
      setWorkspaceName(file.name);

      openTab({
        id: file.id,
        document: {
          id: file.id,
          name: file.name,
          path: file.path,
          content: file.content || '',
          handle: file.handle as any,
        },
        scrollPosition: 0,
      });

      addRecentFile({
        name: file.name,
        path: file.path,
        lastOpened: Date.now(),
      });
    }
  }, [setWorkspace, setFileTree, setWorkspaceName, openTab, addRecentFile]);

  const handleOpenFolder = useCallback(async () => {
    let result;

    if (isFileSystemAccessSupported()) {
      result = await openFolder();
    } else {
      result = await openFolderFallback();
    }

    if (result.success && result.files && result.files.length > 0) {
      setWorkspace('folder');
      setFileTree(result.files);
      setWorkspaceName(result.files[0]?.name || 'Workspace');
    }
  }, [setWorkspace, setFileTree, setWorkspaceName]);

  return {
    handleOpenFile,
    handleOpenFolder,
  };
}
