
import { defineConfig } from 'astro/config';
import { astroSpaceship } from 'astro-spaceship';
import sitemap from '@astrojs/sitemap';
import remarkFixObsidianLinks from './src/lib/markdown/remark-fix-obsidian-links.js';

import websiteConfig from './website.config.json';

export default defineConfig({
  site: websiteConfig.site,
  // Override the buildTree function using a more direct approach
  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/Tree\/utils\/buildTree$/,
          replacement: './src/components/Tree/utils/buildTree.js'
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
    astroSpaceship(websiteConfig),
    sitemap()
  ]
});