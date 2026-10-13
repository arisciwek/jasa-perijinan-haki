import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import rehypeSlug from 'rehype-slug';

export default defineConfig({
  site: 'https://example.com',
  markdown: {
    rehypePlugins: [rehypeSlug],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
