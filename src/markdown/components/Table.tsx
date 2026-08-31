import { type ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
}

export function Table({ children }: TableProps) {
  return (
    <div style={{ overflowX: 'auto', margin: '0 0 1em 0' }}>
      <table className="markdown-body">{children}</table>
    </div>
  );
}
