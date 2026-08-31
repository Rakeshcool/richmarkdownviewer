import { useState } from 'react';

interface ImageProps {
  src?: string;
  alt?: string;
  title?: string;
}

export function Image({ src, alt, title }: ImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        style={{
          padding: '12px 16px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          color: 'var(--text-muted)',
          fontSize: '14px',
        }}
      >
        ⚠️ Unable to load image: {alt || src}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      title={title}
      onError={() => setError(true)}
      style={{
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '8px',
      }}
    />
  );
}
