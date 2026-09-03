/**
 * robots.txt, generated so the sitemap URL cannot drift from `site` in
 * astro.config.mjs.
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${site?.origin ?? ''}/sitemap.xml\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
