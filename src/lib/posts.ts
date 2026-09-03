/**
 * News posts — promotions, deals, new items and announcements.
 *
 * The schema lives here rather than inline in content.config.ts so the tests
 * can import exactly what the build validates, matching menu-schema.ts. A
 * schema the tests cannot reach is a schema nobody proves anything about.
 */
import { z } from 'astro/zod';
import { RESTAURANT_TIMEZONE } from './hours';

export const POST_TAGS = ['promotion', 'deal', 'new-item', 'news'] as const;
export type PostTag = (typeof POST_TAGS)[number];

/** Tags that make a time-limited claim, and so must say when they stop being true. */
export const DATED_TAGS: readonly PostTag[] = ['promotion', 'deal'];

export const TAG_LABELS: Record<PostTag, string> = {
  promotion: 'Promotion',
  deal: 'Deal',
  'new-item': 'New item',
  news: 'News',
};

export const postSchema = z
  .object({
    title: z.string().min(1),
    /** Doubles as the page's meta description, which check:content requires to be >= 20 chars. */
    description: z.string().min(20),
    date: z.coerce.date(),
    tag: z.enum(POST_TAGS),
    /**
     * The day the offer stops being true. Required for promotions and deals:
     * PRODUCT.md forbids presenting anything as factual when it is not, and an
     * expired discount with no end date reads as current forever.
     */
    expires: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  })
  .superRefine((post, ctx) => {
    if (DATED_TAGS.includes(post.tag) && !post.expires) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['expires'],
        message: `a "${post.tag}" post must set \`expires\` — a time-limited offer with no end date would go on looking current after it ends`,
      });
    }
    if (post.expires && post.expires < post.date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['expires'],
        message: '`expires` is before `date` — the offer would never have been live',
      });
    }
  });

export type Post = z.infer<typeof postSchema>;

/** An entry as the pages consume it: the id is the URL slug. */
export interface PostEntry {
  id: string;
  data: Post;
}

/** The calendar day a date falls on, in a given zone, as YYYY-MM-DD. */
function dayKey(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/**
 * Expiry is end-of-day inclusive, in the restaurant's timezone: an offer that
 * expires on the 30th is good all through the 30th in Glen Oaks.
 *
 * Both sides are compared as calendar days, not instants, because that is what
 * an author means by a date. `expires` is a date-only value, so it parses as
 * UTC midnight and is read back in UTC to recover the day that was written;
 * `now` is read in the restaurant's zone, the only clock that matters here
 * (same principle as hours.ts). Doing this with setHours() instead retires the
 * offer several hours early, which the tests caught.
 */
export function isExpired(post: Post, now: Date = new Date()): boolean {
  if (!post.expires) return false;
  return dayKey(now, RESTAURANT_TIMEZONE) > dayKey(post.expires, 'UTC');
}

/** Newest first. Posts published on the same day fall back to title for a stable order. */
export function sortPosts<T extends PostEntry>(entries: readonly T[]): T[] {
  return [...entries].sort((a, b) => {
    const diff = b.data.date.getTime() - a.data.date.getTime();
    return diff !== 0 ? diff : a.data.title.localeCompare(b.data.title);
  });
}

/**
 * What the index is allowed to show: published, in-date, newest first.
 * Expired posts keep their permalink — links people already shared should not
 * 404 — but they stop being advertised, and the post page marks them ended.
 */
export function listPosts<T extends PostEntry>(entries: readonly T[], now: Date = new Date()): T[] {
  return sortPosts(entries.filter((e) => !e.data.draft && !isExpired(e.data, now)));
}

/** Long form for reading, e.g. "2 September 2026". */
export function formatPostDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
