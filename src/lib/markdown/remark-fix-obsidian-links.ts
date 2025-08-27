import type { Plugin } from 'unified';
import type { Root, Link } from 'mdast';
import { visit } from 'unist-util-visit';

/**
 * Remark plugin to fix internal relative links in Obsidian markdown content.
 * This works at the markdown AST level, before HTML rendering.
 * Converts relative paths like "tags/blockchain" to absolute "/tags/blockchain"
 * while preserving external links and anchors.
 */
const remarkFixObsidianLinks: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'link', (node: Link) => {
      if (node.url && typeof node.url === 'string') {
        // Only process internal links (not external URLs or anchors)
        if (!node.url.startsWith('http') && !node.url.startsWith('mailto:') && !node.url.startsWith('#')) {
          
          // Convert relative paths to vault content areas to absolute paths
          if (node.url.match(/^(tags|artifacts|links|notes|attachments)\//)) {
            node.url = '/' + node.url;
          }
          
          // Strip .md extension if present (though obsidian-loader should handle this)
          if (node.url.endsWith('.md')) {
            node.url = node.url.replace(/\.md$/, '');
          }
          
          // Flatten index references: /path/index -> /path (but not root)
          if (node.url.endsWith('/index') && node.url !== '/index') {
            node.url = node.url.replace(/\/index$/, '');
          }
          
          // Handle root index case
          if (node.url === '/index') {
            node.url = '/';
          }
        }
      }
    });
  };
};

export default remarkFixObsidianLinks;