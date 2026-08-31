import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { remarkPlugins, rehypePlugins } from './markdownPlugins';
import { markdownComponents } from './markdownComponents';
import '../styles/markdown.css';

interface ChatRendererProps {
  content: string;
}

export const ChatRenderer = memo(function ChatRenderer({ content }: ChatRendererProps) {
  const processedContent = useMemo(() => {
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
  }, [content]);

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={markdownComponents}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
});
