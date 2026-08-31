import { useState, useEffect, memo } from 'react';
import { codeToHtml } from 'shiki';

interface CodeBlockProps {
  language?: string;
  children: string;
}

export const CodeBlock = memo(function CodeBlock({ language, children }: CodeBlockProps) {
  const [html, setHtml] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function highlight() {
      try {
        const result = await codeToHtml(children, {
          lang: language || 'text',
          theme: document.documentElement.getAttribute('data-theme') === 'dark' ||
            (document.documentElement.getAttribute('data-theme') === 'system' &&
              window.matchMedia('(prefers-color-scheme: dark)').matches)
            ? 'github-dark'
            : 'github-light',
        });

        if (!cancelled) {
          setHtml(result);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setHtml(`<pre><code>${escapeHtml(children)}</code></pre>`);
          setLoading(false);
        }
      }
    }

    highlight();

    return () => {
      cancelled = true;
    };
  }, [children, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = children;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="code-block-wrapper">
        <div className="code-block-header">
          <span className="code-block-language">{language || 'code'}</span>
        </div>
        <div className="code-block-content">
          <pre><code>{children}</code></pre>
        </div>
      </div>
    );
  }

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-block-language">{language || 'code'}</span>
        <button
          className={`code-block-copy ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <div
        className="code-block-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
});

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
