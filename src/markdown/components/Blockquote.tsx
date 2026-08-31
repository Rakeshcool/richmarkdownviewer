import { type ReactNode } from 'react';

interface BlockquoteProps {
  children: ReactNode;
}

export function Blockquote({ children }: BlockquoteProps) {
  return (
    <blockquote className="markdown-body">
      {children}
    </blockquote>
  );
}
