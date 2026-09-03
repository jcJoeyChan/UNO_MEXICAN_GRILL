// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  /**
   * The canonical origin. Everything absolute derives from this single value —
   * canonical tags, Open Graph URLs, the sitemap and robots.txt — so moving the
   * site to another domain is a one-line change here plus a redeploy.
   */
  site: 'https://unomexicangrillny.com',
});
