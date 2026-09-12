import { memo, useMemo } from 'react';
import { useAppStore } from '../../state/appState';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export const DocumentOutline = memo(function DocumentOutline() {
  const { tabs, activeTabId, showOutline } = useAppStore();
  const activeTab = tabs.find((t) => t.id === activeTabId);

  const headings = useMemo(() => {
    if (!activeTab?.document.content) return [];

    const content = activeTab.document.content;
    const result: Heading[] = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(/^(#{1,6})\s+(.*)/);
      if (match) {
        const level = match[1].length;
        const text = match[2].replace(/[*_`~[]/g, '').trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        result.push({ id, text, level });
      }
    }

    return result;
  }, [activeTab?.document.content]);

  if (!showOutline || headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="document-outline">
      <div className="outline-header">
        <h4>On This Page</h4>
      </div>
      <nav className="outline-nav">
        {headings.map((heading, index) => (
          <button
            key={index}
            className="outline-item"
            onClick={() => scrollToHeading(heading.id)}
            style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
          >
            {heading.text}
          </button>
        ))}
      </nav>
    </div>
  );
});
