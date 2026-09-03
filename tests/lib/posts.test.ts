import { describe, it, expect } from 'vitest';
import {
  postSchema,
  isExpired,
  listPosts,
  sortPosts,
  formatPostDate,
  type PostEntry,
} from '../../src/lib/posts';

const base = {
  title: 'Taco Tuesday',
  description: 'Every Tuesday in September, tacos are two for one all day.',
  date: '2026-09-01',
  tag: 'news' as const,
};

const entry = (id: string, over: Record<string, unknown> = {}): PostEntry => ({
  id,
  data: postSchema.parse({ ...base, ...over }),
});

describe('postSchema', () => {
  it('accepts a plain news post with no expiry', () => {
    expect(() => postSchema.parse(base)).not.toThrow();
  });

  it('requires an expiry on a deal', () => {
    expect(() => postSchema.parse({ ...base, tag: 'deal' })).toThrow(/expires/);
  });

  it('requires an expiry on a promotion', () => {
    expect(() => postSchema.parse({ ...base, tag: 'promotion' })).toThrow(/expires/);
  });

  it('accepts a deal that declares its end date', () => {
    expect(() =>
      postSchema.parse({ ...base, tag: 'deal', expires: '2026-09-30' }),
    ).not.toThrow();
  });

  it('rejects an expiry that precedes publication', () => {
    expect(() =>
      postSchema.parse({ ...base, tag: 'deal', expires: '2026-08-01' }),
    ).toThrow(/never have been live/);
  });

  it('rejects a description too short to serve as a meta description', () => {
    expect(() => postSchema.parse({ ...base, description: 'Too short' })).toThrow();
  });

  it('defaults draft to false', () => {
    expect(postSchema.parse(base).draft).toBe(false);
  });
});

describe('isExpired', () => {
  const deal = postSchema.parse({ ...base, tag: 'deal', expires: '2026-09-30' });

  // Instants are given in UTC so the result does not depend on the machine's
  // timezone. In September, Glen Oaks is UTC-4.
  it('is not expired the day before', () => {
    expect(isExpired(deal, new Date('2026-09-29T16:00:00Z'))).toBe(false);
  });

  it('is still live at 11:59pm on the final day, New York time', () => {
    expect(isExpired(deal, new Date('2026-10-01T03:59:00Z'))).toBe(false);
  });

  it('expires just after midnight, New York time', () => {
    expect(isExpired(deal, new Date('2026-10-01T04:01:00Z'))).toBe(true);
  });

  it('does not retire early just because UTC has rolled over', () => {
    // 8:30pm in Glen Oaks on the final day is already the 1st in UTC.
    expect(isExpired(deal, new Date('2026-10-01T00:30:00Z'))).toBe(false);
  });

  it('never expires without an end date', () => {
    expect(isExpired(postSchema.parse(base), new Date('2099-01-01'))).toBe(false);
  });
});

describe('listPosts', () => {
  const now = new Date('2026-09-15T12:00:00');

  it('hides expired offers', () => {
    const posts = [
      entry('live', { tag: 'deal', expires: '2026-09-30' }),
      entry('over', { tag: 'deal', expires: '2026-09-02' }),
    ];
    expect(listPosts(posts, now).map((p) => p.id)).toEqual(['live']);
  });

  it('hides drafts', () => {
    const posts = [entry('shown'), entry('hidden', { draft: true })];
    expect(listPosts(posts, now).map((p) => p.id)).toEqual(['shown']);
  });

  it('orders newest first', () => {
    const posts = [
      entry('older', { date: '2026-09-01' }),
      entry('newer', { date: '2026-09-10' }),
    ];
    expect(listPosts(posts, now).map((p) => p.id)).toEqual(['newer', 'older']);
  });

  it('breaks a same-day tie on title, so ordering is stable', () => {
    const posts = [
      entry('b', { title: 'Beans' }),
      entry('a', { title: 'Arroz' }),
    ];
    expect(sortPosts(posts).map((p) => p.data.title)).toEqual(['Arroz', 'Beans']);
  });
});

describe('formatPostDate', () => {
  it('reads as a date a customer would recognise', () => {
    expect(formatPostDate(new Date('2026-09-02'))).toBe('September 2, 2026');
  });
});
