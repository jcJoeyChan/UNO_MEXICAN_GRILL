/**
 * Open/closed calculation for the live status pill.
 *
 * The pill is the site's memorable moment, so being wrong here is worse than
 * not having it. Two rules govern this file:
 *
 * 1. The restaurant's clock is the only clock that matters. Everything resolves
 *    in America/New_York regardless of where the visitor is, using Intl rather
 *    than the host's local timezone.
 * 2. `now` is always injectable, so behaviour is testable without touching the
 *    system clock.
 *
 * No date library is used — Intl handles DST correctly and SPEC.md requires
 * asking before adding dependencies.
 */

export const RESTAURANT_TIMEZONE = 'America/New_York';

const WEEKDAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

export interface DayHours {
  /** Lowercase weekday name, e.g. 'monday'. */
  day: string;
  /** 24-hour wall clock in the restaurant's timezone, e.g. '11:00'. */
  open: string;
  /** 24-hour wall clock, e.g. '21:30'. Exclusive: at this minute we are closed. */
  close: string;
}

export interface OpenStatus {
  isOpen: boolean;
  /** The instant at which the state next flips. */
  nextChange: Date;
  /** Human label for that time, e.g. '9:30 pm'. */
  nextChangeLabel: string;
  /** Full pill text, e.g. 'Open now — closes 9:30 pm'. */
  label: string;
  /**
   * PRODUCT.md records that holiday hours may differ but supplies no dates.
   * Rather than invent a holiday calendar, the caveat is surfaced as a flag the
   * UI can show alongside the pill. Turn it off once real holiday data exists.
   */
  holidayCaveat: boolean;
}

export interface OpenNowOptions {
  timeZone?: string;
  holidayCaveat?: boolean;
}

interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: string;
}

function zonedParts(date: Date, timeZone: string): ZonedParts {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const found: Record<string, string> = {};
  for (const { type, value } of parts) found[type] = value;

  return {
    year: Number(found.year),
    month: Number(found.month),
    day: Number(found.day),
    hour: Number(found.hour),
    minute: Number(found.minute),
    second: Number(found.second),
    weekday: (found.weekday ?? '').toLowerCase(),
  };
}

/** Offset of `timeZone` from UTC, in ms, at the given instant. */
function offsetMs(date: Date, timeZone: string): number {
  const p = zonedParts(date, timeZone);
  const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second, 0);
  return asUTC - Math.floor(date.getTime() / 1000) * 1000;
}

/**
 * Convert a wall-clock time in `timeZone` to a real instant.
 *
 * The offset depends on the instant we are trying to find, so this guesses,
 * measures the offset there, and corrects once. That second pass is what makes
 * "tomorrow's opening time" land correctly across a DST change.
 */
function instantFromWallTime(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const target = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  const firstOffset = offsetMs(new Date(target), timeZone);
  let instant = target - firstOffset;
  const secondOffset = offsetMs(new Date(instant), timeZone);
  if (secondOffset !== firstOffset) instant = target - secondOffset;
  return new Date(instant);
}

/** Pure calendar arithmetic — no timezone involved, so UTC getters are safe. */
function addDays(year: number, month: number, day: number, delta: number) {
  const t = new Date(Date.UTC(year, month - 1, day + delta));
  return {
    year: t.getUTCFullYear(),
    month: t.getUTCMonth() + 1,
    day: t.getUTCDate(),
    weekday: WEEKDAYS[t.getUTCDay()] as string,
  };
}

function toMinutes(clock: string): number {
  const [h, m] = clock.split(':').map(Number);
  return h * 60 + m;
}

function splitClock(clock: string): [number, number] {
  const [h, m] = clock.split(':').map(Number);
  return [h, m];
}

/** '21:30' → '9:30 pm' */
export function formatClock(clock: string): string {
  const [h, m] = splitClock(clock);
  const period = h < 12 ? 'am' : 'pm';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

function findDay(hours: DayHours[], weekday: string): DayHours | undefined {
  return hours.find((h) => h.day.toLowerCase() === weekday);
}

export function isOpenNow(
  hours: DayHours[],
  now: Date = new Date(),
  options: OpenNowOptions = {},
): OpenStatus {
  const timeZone = options.timeZone ?? RESTAURANT_TIMEZONE;
  const holidayCaveat = options.holidayCaveat ?? true;

  const p = zonedParts(now, timeZone);
  const minutesNow = p.hour * 60 + p.minute;
  const today = findDay(hours, p.weekday);

  if (today) {
    const opensAt = toMinutes(today.open);
    const closesAt = toMinutes(today.close);

    if (minutesNow >= opensAt && minutesNow < closesAt) {
      const [h, m] = splitClock(today.close);
      const label = formatClock(today.close);
      return {
        isOpen: true,
        nextChange: instantFromWallTime(p.year, p.month, p.day, h, m, timeZone),
        nextChangeLabel: label,
        label: `Open now — closes ${label}`,
        holidayCaveat,
      };
    }

    if (minutesNow < opensAt) {
      const [h, m] = splitClock(today.open);
      const label = formatClock(today.open);
      return {
        isOpen: false,
        nextChange: instantFromWallTime(p.year, p.month, p.day, h, m, timeZone),
        nextChangeLabel: label,
        label: `Closed — opens ${label}`,
        holidayCaveat,
      };
    }
  }

  // Either past closing, or no hours listed for today: find the next day that
  // opens. Bounded at 7 so a malformed hours array cannot loop forever.
  for (let delta = 1; delta <= 7; delta += 1) {
    const date = addDays(p.year, p.month, p.day, delta);
    const next = findDay(hours, date.weekday);
    if (!next) continue;

    const [h, m] = splitClock(next.open);
    const label = formatClock(next.open);
    return {
      isOpen: false,
      nextChange: instantFromWallTime(date.year, date.month, date.day, h, m, timeZone),
      nextChangeLabel: label,
      label: `Closed — opens ${label}`,
      holidayCaveat,
    };
  }

  // No day in the week has hours. Report closed rather than guessing.
  return {
    isOpen: false,
    nextChange: now,
    nextChangeLabel: '',
    label: 'Closed',
    holidayCaveat,
  };
}
