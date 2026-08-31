import { memo, useCallback } from 'react';
import { useAppStore } from '../../state/appState';
import type { FileNode } from '../../types';
import { FileItem } from './FileItem';
import { FolderItem } from './FolderItem';

interface FileTreeProps {
  files: FileNode[];
  level?: number;
}

export const FileTree = memo(function FileTree({ files, level = 0 }: FileTreeProps) {
  return (
    <div className="file-tree" role="tree" style={{ paddingLeft: level > 0 ? '12px' : 0 }}>
      {files.map((node) => (
        <FileTreeNode key={node.id} node={node} level={level} />
      ))}
    </div>
  );
});

interface FileTreeNodeProps {
  node: FileNode;
  level: number;
}

const FileTreeNode = memo(function FileTreeNode({ node, level }: FileTreeNodeProps) {
  const { expandedFolders, toggleFolder } = useAppStore();
  const isExpanded = expandedFolders.has(node.id);

  const handleToggle = useCallback(() => {
    toggleFolder(node.id);
  }, [node.id, toggleFolder]);

  if (node.type === 'directory') {
    return (
      <FolderItem
        node={node}
        level={level}
        isExpanded={isExpanded}
        onToggle={handleToggle}
      >
        {isExpanded && node.children && (
          <FileTree files={node.children} level={level + 1} />
        )}
      </FolderItem>
    );
  }

  return <FileItem node={node} level={level} />;
});
