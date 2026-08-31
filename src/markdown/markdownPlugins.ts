import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export const remarkPlugins = [remarkGfm, remarkMath];
export const rehypePlugins = [rehypeKatex];
