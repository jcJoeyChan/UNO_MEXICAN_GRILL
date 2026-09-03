/**
 * Sitemap.
 *
 * Hand-rolled rather than @astrojs/sitemap: SPEC.md requires approval before
 * adding a dependency, and for a handful of static routes plus one collection
 * the integration earns nothing a few lines here do not.
 *
 * Routes are derived from the pages directory so a new page cannot be silently
 * left out of the sitemap — the commonest way sitemaps rot.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { listPosts } from '../lib/posts';

/** Pages deliberately kept out: an error page and a form-completion page. */
const EXCLUDED = new Set(['/404', '/contact-thanks']);

const staticRoutes = Object.keys(import.meta.glob('./**/*.astro'))
  .map((file) =>
    file
      .replace(/^\./, '')
      .replace(/\.astro$/, '')
      .replace(/\/index$/, ''),
  )
  .filter((route) => !route.includes('[') && !EXCLUDED.has(route))
  .map((route) => route || '/');

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.origin ?? '';
  const posts = listPosts(await getCollection('posts'));

  const urls = [
    ...staticRoutes.map((route) => ({ path: route, lastmod: undefined as string | undefined })),
    ...posts.map((post) => ({
      path: `/news/${post.id}`,
      lastmod: post.data.date.toISOString().slice(0, 10),
    })),
  ].sort((a, b) => a.path.localeCompare(b.path));

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ path, lastmod }) =>
      `  <url>\n    <loc>${origin}${path === '/' ? '/' : path}</loc>${
        lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''
      }\n  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
