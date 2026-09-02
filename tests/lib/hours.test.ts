import { describe, it, expect } from 'vitest';
import { isOpenNow, RESTAURANT_TIMEZONE, type DayHours } from '../../src/lib/hours';

/**
 * Every instant here is constructed with Date.UTC, so these tests are
 * independent of the machine's own timezone. That matters: this repo is worked
 * on from two machines, and a test that passes only in one local zone is worse
 * than no test at all.
 *
 * Real hours, from PRODUCT.md: open 7 days, 11:00-21:30, America/New_York.
 * US DST in 2026 starts Sun 8 March and ends Sun 1 November.
 */
const HOURS: DayHours[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
].map((day) => ({ day, open: '11:00', close: '21:30' }));

describe('RESTAURANT_TIMEZONE', () => {
  it('is pinned to the restaurant, not the visitor', () => {
    expect(RESTAURANT_TIMEZONE).toBe('America/New_York');
  });
});

describe('isOpenNow — core state', () => {
  it('is open at midday', () => {
    // 16:00 UTC = 12:00 EDT, Monday 15 June 2026
    expect(isOpenNow(HOURS, new Date(Date.UTC(2026, 5, 15, 16, 0))).isOpen).toBe(true);
  });

  it('is closed at midnight', () => {
    // 04:00 UTC = 00:00 EDT
    expect(isOpenNow(HOURS, new Date(Date.UTC(2026, 5, 15, 4, 0))).isOpen).toBe(false);
  });
});

describe('isOpenNow — boundary minutes', () => {
  it('is open at exactly 11:00, the opening minute', () => {
    expect(isOpenNow(HOURS, new Date(Date.UTC(2026, 5, 15, 15, 0))).isOpen).toBe(true);
  });

  it('is closed at 10:59, one minute before opening', () => {
    expect(isOpenNow(HOURS, new Date(Date.UTC(2026, 5, 15, 14, 59))).isOpen).toBe(false);
  });

  it('is open at 21:29, the last serving minute', () => {
    expect(isOpenNow(HOURS, new Date(Date.UTC(2026, 5, 16, 1, 29))).isOpen).toBe(true);
  });

  it('is closed at exactly 21:30, the closing minute', () => {
    // Closing time means closed. A customer arriving at 21:30 is too late.
    expect(isOpenNow(HOURS, new Date(Date.UTC(2026, 5, 16, 1, 30))).isOpen).toBe(false);
  });
});

describe('isOpenNow — daylight saving', () => {
  it('is open at 11:00 EDT on the day DST begins', () => {
    // 15:00 UTC = 11:00 EDT, Sunday 8 March 2026 (clocks already sprang forward)
    expect(isOpenNow(HOURS, new Date(Date.UTC(2026, 2, 8, 15, 0))).isOpen).toBe(true);
  });

  it('is closed at 09:00 EDT on the day DST begins', () => {
    expect(isOpenNow(HOURS, new Date(Date.UTC(2026, 2, 8, 13, 0))).isOpen).toBe(false);
  });

  it('is open at 11:00 EST the day before DST begins', () => {
    // 16:00 UTC = 11:00 EST, Saturday 7 March 2026 — one hour further from UTC
    expect(isOpenNow(HOURS, new Date(Date.UTC(2026, 2, 7, 16, 0))).isOpen).toBe(true);
  });

  it('is open at 11:00 EST on the day DST ends', () => {
    // 16:00 UTC = 11:00 EST, Sunday 1 November 2026
    expect(isOpenNow(HOURS, new Date(Date.UTC(2026, 10, 1, 16, 0))).isOpen).toBe(true);
  });

  it('is open at 11:00 EDT the day before DST ends', () => {
    expect(isOpenNow(HOURS, new Date(Date.UTC(2026, 9, 31, 15, 0))).isOpen).toBe(true);
  });

  it('uses the same UTC instant differently on either side of the DST change', () => {
    // 15:00 UTC is 11:00 EDT (open) in summer but 10:00 EST (closed) in winter.
    expect(isOpenNow(HOURS, new Date(Date.UTC(2026, 9, 31, 15, 0))).isOpen).toBe(true);
    expect(isOpenNow(HOURS, new Date(Date.UTC(2026, 10, 1, 15, 0))).isOpen).toBe(false);
  });
});

describe('isOpenNow — next change', () => {
  it('while open, points at today’s closing time', () => {
    const s = isOpenNow(HOURS, new Date(Date.UTC(2026, 5, 15, 16, 0)));
    expect(s.nextChange.toISOString()).toBe(new Date(Date.UTC(2026, 5, 16, 1, 30)).toISOString());
    expect(s.nextChangeLabel).toBe('9:30 pm');
  });

  it('while closed before opening, points at today’s opening time', () => {
    const s = isOpenNow(HOURS, new Date(Date.UTC(2026, 5, 15, 13, 0))); // 09:00 EDT
    expect(s.nextChange.toISOString()).toBe(new Date(Date.UTC(2026, 5, 15, 15, 0)).toISOString());
    expect(s.nextChangeLabel).toBe('11:00 am');
  });

  it('while closed after closing, points at tomorrow’s opening time', () => {
    const s = isOpenNow(HOURS, new Date(Date.UTC(2026, 5, 16, 2, 0))); // 22:00 EDT Mon
    expect(s.nextChange.toISOString()).toBe(new Date(Date.UTC(2026, 5, 16, 15, 0)).toISOString());
  });

  it('crosses the DST boundary correctly when computing tomorrow’s opening', () => {
    // Saturday 31 Oct 2026 22:00 EDT → next open is Sunday 1 Nov 11:00 EST,
    // which is 16:00 UTC, not 15:00. Getting this wrong is a one-hour lie.
    const s = isOpenNow(HOURS, new Date(Date.UTC(2026, 10, 1, 2, 0)));
    expect(s.nextChange.toISOString()).toBe(new Date(Date.UTC(2026, 10, 1, 16, 0)).toISOString());
  });
});

describe('isOpenNow — labels', () => {
  it('reads "Open now — closes 9:30 pm" while open', () => {
    expect(isOpenNow(HOURS, new Date(Date.UTC(2026, 5, 15, 16, 0))).label).toBe(
      'Open now — closes 9:30 pm',
    );
  });

  it('reads "Closed — opens 11:00 am" while closed', () => {
    expect(isOpenNow(HOURS, new Date(Date.UTC(2026, 5, 15, 13, 0))).label).toBe(
      'Closed — opens 11:00 am',
    );
  });
});

describe('isOpenNow — per-day hours', () => {
  it('selects the row matching the weekday in the restaurant’s timezone', () => {
    const varied = HOURS.map((h) =>
      h.day === 'sunday' ? { ...h, open: '12:00', close: '20:00' } : h,
    );
    // Sunday 14 June 2026, 11:30 EDT — open under Mon-Sat hours, closed on Sunday
    const sunday = new Date(Date.UTC(2026, 5, 14, 15, 30));
    expect(isOpenNow(varied, sunday).isOpen).toBe(false);
    expect(isOpenNow(HOURS, sunday).isOpen).toBe(true);
  });

  it('treats a day with no entry as closed all day', () => {
    const noSunday = HOURS.filter((h) => h.day !== 'sunday');
    const sunday = new Date(Date.UTC(2026, 5, 14, 16, 0));
    expect(isOpenNow(noSunday, sunday).isOpen).toBe(false);
  });
});

describe('isOpenNow — holiday caveat', () => {
  it('flags the caveat by default, since PRODUCT.md says holiday hours may differ', () => {
    expect(isOpenNow(HOURS, new Date(Date.UTC(2026, 5, 15, 16, 0))).holidayCaveat).toBe(true);
  });

  it('can be turned off without hardcoding a list of dates', () => {
    const s = isOpenNow(HOURS, new Date(Date.UTC(2026, 5, 15, 16, 0)), { holidayCaveat: false });
    expect(s.holidayCaveat).toBe(false);
  });
});
