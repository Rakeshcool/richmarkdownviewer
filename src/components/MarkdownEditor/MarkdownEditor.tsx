import { memo, useCallback, useEffect, useRef } from 'react';
import { useAppStore } from '../../state/appState';

/**
 * Full-content Markdown editor for the active tab.
 * Renders a plain textarea with tab-key support and dirty-state tracking
 * via the store's updateTabContent.
 */
export const MarkdownEditor = memo(function MarkdownEditor({
  tabId,
  content,
  name,
}: {
  tabId: string;
  content: string;
  name: string;
}) {
  const updateTabContent = useAppStore((s) => s.updateTabContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateTabContent(tabId, e.target.value);
    },
    [tabId, updateTabContent]
  );

  // Tab key inserts two spaces instead of leaving the textarea
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const el = e.currentTarget;
    const { selectionStart, selectionEnd } = el;
    const value = el.value;
    const next =
      value.slice(0, selectionStart) + '  ' + value.slice(selectionEnd);
    updateTabContent(tabId, next);
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = selectionStart + 2;
    });
  }, [tabId, updateTabContent]);

  // Focus the editor when entering edit mode on a new document
  useEffect(() => {
    textareaRef.current?.focus();
  }, [tabId]);

  return (
    <div className="markdown-editor">
      <textarea
        ref={textareaRef}
        className="markdown-editor-textarea"
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        aria-label={`Editing ${name}`}
        placeholder="Start writing Markdown…"
      />
    </div>
  );
});
