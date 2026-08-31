import { useCallback, useEffect } from 'react';
import { useAppStore } from '../state/appState';
import { flattenFileTree } from '../filesystem/fileSystem';
import type { SearchResult, SearchMatch } from '../types';

export function useSearch() {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    showSearch,
    setShowSearch,
    fileTree,
    openTab,
    addRecentFile,
  } = useAppStore();

  const search = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      const allFiles = flattenFileTree(fileTree);
      const results: SearchResult[] = [];
      const lowerQuery = query.toLowerCase();

      for (const file of allFiles) {
        const matches: SearchMatch[] = [];

        // Search filename
        if (file.name.toLowerCase().includes(lowerQuery)) {
          matches.push({
            line: 0,
            text: file.name,
            preview: file.name,
          });
        }

        // Search content
        if (file.content) {
          const lines = file.content.split('\n');
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].toLowerCase().includes(lowerQuery)) {
              matches.push({
                line: i + 1,
                text: lines[i],
                preview: lines[i].trim(),
              });
            }
          }
        }

        if (matches.length > 0) {
          results.push({
            document: {
              id: file.id,
              name: file.name,
              path: file.path,
              content: file.content || '',
              handle: file.handle as any,
            },
            matches,
          });
        }
      }

      setSearchResults(results);
    },
    [fileTree, setSearchQuery, setSearchResults]
  );

  const handleResultClick = useCallback(
    (result: SearchResult) => {
      openTab({
        id: result.document.id,
        document: result.document,
        scrollPosition: 0,
      });
      addRecentFile({
        name: result.document.name,
        path: result.document.path,
        lastOpened: Date.now(),
      });
      setShowSearch(false);
    },
    [openTab, addRecentFile, setShowSearch]
  );

  const toggleSearch = useCallback(() => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [showSearch, setShowSearch, setSearchQuery, setSearchResults]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        toggleSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSearch]);

  return {
    searchQuery,
    searchResults,
    showSearch,
    search,
    handleResultClick,
    toggleSearch,
    setShowSearch,
  };
}
