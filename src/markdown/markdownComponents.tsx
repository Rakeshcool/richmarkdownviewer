import { CodeBlock } from './components/CodeBlock';
import { Image } from './components/Image';
import { type Components } from 'react-markdown';

export const markdownComponents: Components = {
  pre: ({ children }) => {
    return <>{children}</>;
  },
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const isBlock = String(children).includes('\n');

    if (isBlock) {
      return (
        <CodeBlock language={match?.[1]}>
          {String(children).replace(/\n$/, '')}
        </CodeBlock>
      );
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  img: (props) => {
    return <Image {...props} />;
  },
  table: ({ children }) => {
    return (
      <div style={{ overflowX: 'auto', margin: '0 0 1em 0' }}>
        <table>{children}</table>
      </div>
    );
  },
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith('http://') || href?.startsWith('https://');

    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
  input: ({ checked, ...props }) => {
    return (
      <input
        type="checkbox"
        checked={checked}
        disabled
        readOnly
        style={{ marginRight: '0.5em', accentColor: 'var(--primary)' }}
        {...props}
      />
    );
  },
};
