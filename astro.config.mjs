import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const siteUrl = process.env.SITE_URL || 'http://jasa-perijinan-haki.lan';

export default defineConfig({
  site: siteUrl,
  vite: {
    plugins: [tailwindcss()],
  },
});
