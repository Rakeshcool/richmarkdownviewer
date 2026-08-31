export function getFileName(path: string): string {
  const parts = path.replace(/\\/g, '/').split('/');
  return parts[parts.length - 1] || '';
}

export function getFileExtension(name: string): string {
  const lastDot = name.lastIndexOf('.');
  if (lastDot === -1) return '';
  return name.slice(lastDot + 1).toLowerCase();
}

export function isMarkdownFile(name: string): boolean {
  const ext = getFileExtension(name);
  return ext === 'md' || ext === 'markdown';
}

export function joinPath(...parts: string[]): string {
  return parts
    .join('/')
    .replace(/\/+/g, '/')
    .replace(/\/$/, '') || '/';
}

export function getRelativePath(from: string, to: string): string {
  const fromParts = from.replace(/\\/g, '/').split('/').filter(Boolean);
  const toParts = to.replace(/\\/g, '/').split('/').filter(Boolean);

  let commonLength = 0;
  while (
    commonLength < fromParts.length &&
    commonLength < toParts.length &&
    fromParts[commonLength] === toParts[commonLength]
  ) {
    commonLength++;
  }

  const upCount = fromParts.length - commonLength;
  const up = Array(upCount).fill('..');
  const down = toParts.slice(commonLength);

  return [...up, ...down].join('/') || '.';
}

export function getParentPath(path: string): string {
  const parts = path.replace(/\\/g, '/').split('/');
  parts.pop();
  return parts.join('/') || '/';
}

export function normalizePath(path: string): string {
  return path.replace(/\\/g, '/').replace(/\/+/g, '/');
}

export function getDisplayPath(path: string): string {
  return normalizePath(path);
}
