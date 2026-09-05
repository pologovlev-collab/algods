import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { defineConfig } from 'astro/config';
import { defineMdastPlugin } from 'satteri';

const prebundleContentDependencies = {
  name: 'algods-prebundle-content-dependencies',
  configEnvironment(name) {
    if (name === 'client') return;

    // Astro's content runners need this CommonJS dependency transformed by Vite.
    return { optimizeDeps: { include: ['picomatch'] } };
  },
};

const removeLeadingMarkdownTitle = defineMdastPlugin({
  name: 'algods-remove-leading-markdown-title',
  heading(node, context) {
    const index = context.indexOf(node);
    const parent = context.parent(node);
    const isLeadingTitle = node.depth === 1
      && parent?.type === 'root'
      && index !== undefined
      && parent.children.slice(0, index).every((sibling) => sibling.type === 'yaml' || sibling.type === 'toml');
    if (isLeadingTitle) context.removeNode(node);
  },
});

export default defineConfig({
  site: 'https://algods.ru',
  output: 'static',
  integrations: [sitemap()],
  build: {
    format: 'directory',
  },
  markdown: {
    processor: satteri({ mdastPlugins: [removeLeadingMarkdownTitle] }),
  },
  vite: {
    plugins: [prebundleContentDependencies],
  },
});
