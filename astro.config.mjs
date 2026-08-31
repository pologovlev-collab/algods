import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const prebundleContentDependencies = {
  name: 'algods-prebundle-content-dependencies',
  configEnvironment(name) {
    if (name === 'client') return;

    // Astro's content runners need this CommonJS dependency transformed by Vite.
    return { optimizeDeps: { include: ['picomatch'] } };
  },
};

export default defineConfig({
  site: 'https://algods.ru',
  output: 'static',
  integrations: [sitemap()],
  build: {
    format: 'directory',
  },
  vite: {
    plugins: [prebundleContentDependencies],
  },
});
