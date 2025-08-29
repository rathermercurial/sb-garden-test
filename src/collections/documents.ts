import { defineCollection } from 'astro:content';

import { ObsidianMdLoader, ObsidianWikiLinkSchema } from "astro-loader-obsidian";

import { DOCUMENTS_COLLECTION_NAME } from 'astro-spaceship/constants';
import { DocumentSchema } from 'astro-spaceship/schemas';

import config from '@/config';


export default {
  [DOCUMENTS_COLLECTION_NAME]: defineCollection({
    loader: ObsidianMdLoader({
      author: config.author,
      base: 'src/content/vault',
      url: 'vault',
      assetsPattern: '**/*.{svg,png,jpg,jpeg,avif,webp,gif,tiff,ico,pdf}',
      wikilinkFields: ['relateds']
    }),
    schema: ({ image }) => DocumentSchema.extend({
      images: ObsidianWikiLinkSchema.extend({
        href: image().optional(),
      }).array().optional(),
      cover: image().optional(),
      image: image().optional(),
    }),
  })
}