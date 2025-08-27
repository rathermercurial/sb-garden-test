
import { defineConfig } from 'astro/config';
import { astroSpaceship } from 'astro-spaceship';
import remarkFixObsidianLinks from './src/lib/markdown/remark-fix-obsidian-links.js';

import websiteConfig from './website.config.json';

export default defineConfig({
  // Override the buildTree function using a more direct approach
  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/Tree\/utils\/buildTree$/,
          replacement: 'F:/projects/sb-spaceship/src/components/Tree/utils/buildTree.js'
        }
      ]
    }
  },
  markdown: {
    remarkPlugins: [
      remarkFixObsidianLinks,
    ],
  },
  integrations: [
    astroSpaceship(websiteConfig)
  ]
});