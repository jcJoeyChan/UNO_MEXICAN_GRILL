/**
 * Content collections.
 *
 * Astro 7 requires this file at src/content.config.ts (not src/content/config.ts)
 * and requires every collection to declare a loader. Verified against
 * https://docs.astro.build/en/guides/content-collections/ rather than memory —
 * this API moved in Astro 5 and the old path would fail silently.
 *
 * menu.json is a single object, not a directory of entries, so the file()
 * loader gets a custom parser that yields the categories array. Each category
 * has an `id`, which is what the loader keys entries by.
 */
import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { menuCategorySchema } from './lib/menu-schema';

const menu = defineCollection({
  loader: file('src/content/menu.json', {
    parser: (text) => JSON.parse(text).categories,
  }),
  schema: menuCategorySchema,
});

export const collections = { menu };
