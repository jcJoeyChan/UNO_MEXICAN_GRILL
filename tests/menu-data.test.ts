import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

// Guards the transcription in src/content/menu.json against accidental loss.
// Task 5 replaces this with a real schema; until then this is the safety net.
const menu = JSON.parse(readFileSync(new URL('../src/content/menu.json', import.meta.url), 'utf8'));

describe('menu.json', () => {
  it('has all 12 categories', () => {
    expect(menu.categories).toHaveLength(12);
  });

  it('has 79 items in total', () => {
    const total = menu.categories.reduce(
      (n: number, c: { items: unknown[] }) => n + c.items.length,
      0,
    );
    expect(total).toBe(79);
  });

  it('marks soups as seasonal, never as sold out', () => {
    const soups = menu.categories.find((c: { id: string }) => c.id === 'soups');
    expect(soups.availability).toBe('seasonal');
    expect(soups.season).toBe('winter');
    expect(JSON.stringify(menu).toLowerCase()).not.toContain('"sold out"');
  });
});
