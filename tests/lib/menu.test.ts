import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { menuCategorySchema, menuItemSchema } from '../../src/lib/menu-schema';
import {
  sortCategories,
  isSeasonal,
  seasonalLabel,
  isOutOfSeason,
  priceTiers,
  formatPrice,
  needsVerification,
  flaggedItems,
  countItems,
  vegetarianItems,
  CATEGORY_ORDER,
  type MenuCategory,
} from '../../src/lib/menu';

const raw = JSON.parse(
  readFileSync(new URL('../../src/content/menu.json', import.meta.url), 'utf8'),
);
const categories: MenuCategory[] = raw.categories;

describe('the real menu data', () => {
  it('validates every category against the schema', () => {
    for (const category of categories) {
      const result = menuCategorySchema.safeParse(category);
      if (!result.success) {
        throw new Error(`${category.id} failed: ${JSON.stringify(result.error.issues, null, 2)}`);
      }
      expect(result.success).toBe(true);
    }
  });

  it('has the transcribed shape: 12 categories, 79 items', () => {
    expect(categories).toHaveLength(12);
    expect(countItems(categories)).toBe(79);
  });

  it('matches the printed per-category counts', () => {
    const expected: Record<string, number> = {
      tacos: 9,
      quesadillas: 8,
      nachos: 3,
      burritos: 8,
      'rice-platters': 7,
      'tostada-salads': 10,
      'fajitas-by-the-pound': 4,
      'kids-meal': 5,
      'side-orders': 17,
      beverages: 4,
      dessert: 2,
      soups: 2,
    };
    for (const [id, count] of Object.entries(expected)) {
      expect(categories.find((c) => c.id === id)?.items).toHaveLength(count);
    }
  });

  it('covers every category in CATEGORY_ORDER, with none left over', () => {
    expect(new Set(categories.map((c) => c.id))).toEqual(new Set(CATEGORY_ORDER));
  });

  it('keeps 14 items flagged for verification with the restaurant', () => {
    expect(flaggedItems(categories)).toHaveLength(14);
  });

  it('marks 31 items vegetarian, from the menu’s own asterisk convention', () => {
    expect(vegetarianItems(categories)).toHaveLength(31);
  });
});

describe('schema rejects malformed data', () => {
  const validItem = { number: '1', name: 'Ground Beef Taco', price: 3.5, vegetarian: false };

  it('rejects an item with neither price nor prices', () => {
    const noPrice = { number: '1', name: 'Ground Beef Taco', vegetarian: false };
    expect(menuItemSchema.safeParse(noPrice).success).toBe(false);
  });

  it('rejects an item with both price and prices', () => {
    expect(
      menuItemSchema.safeParse({ ...validItem, prices: { plain: 1, supreme: 2 } }).success,
    ).toBe(false);
  });

  it('rejects a negative or zero price', () => {
    expect(menuItemSchema.safeParse({ ...validItem, price: -1 }).success).toBe(false);
    expect(menuItemSchema.safeParse({ ...validItem, price: 0 }).success).toBe(false);
  });

  it('rejects an empty name', () => {
    expect(menuItemSchema.safeParse({ ...validItem, name: '' }).success).toBe(false);
  });

  it('rejects a missing vegetarian flag', () => {
    const noFlag = { number: '1', name: 'Ground Beef Taco', price: 3.5 };
    expect(menuItemSchema.safeParse(noFlag).success).toBe(false);
  });

  it('rejects a seasonal category that does not say which season', () => {
    expect(
      menuCategorySchema.safeParse({
        id: 'soups',
        name: 'Soups',
        priceType: 'single',
        availability: 'seasonal',
        items: [validItem],
      }).success,
    ).toBe(false);
  });

  it('rejects a plainSupreme category whose item lacks a supreme price', () => {
    expect(
      menuCategorySchema.safeParse({
        id: 'quesadillas',
        name: 'Quesadillas',
        priceType: 'plainSupreme',
        items: [{ number: '8', name: 'Cheese', vegetarian: false, prices: { plain: 5.5 } }],
      }).success,
    ).toBe(false);
  });

  it('rejects a category with no items', () => {
    expect(
      menuCategorySchema.safeParse({ id: 'x', name: 'X', priceType: 'single', items: [] }).success,
    ).toBe(false);
  });
});

describe('seasonal handling', () => {
  const soups = categories.find((c) => c.id === 'soups')!;
  const tacos = categories.find((c) => c.id === 'tacos')!;

  it('treats soups as seasonal and tacos as not', () => {
    expect(isSeasonal(soups)).toBe(true);
    expect(isSeasonal(tacos)).toBe(false);
  });

  it('labels seasonal items by season, never as sold out', () => {
    const label = seasonalLabel(soups)!;
    expect(label).toMatch(/winter/i);
    expect(label.toLowerCase()).not.toContain('sold out');
  });

  it('gives no seasonal label to a non-seasonal category', () => {
    expect(seasonalLabel(tacos)).toBeUndefined();
  });

  it('knows soups are in season in January and out in July', () => {
    expect(isOutOfSeason(soups, new Date('2026-01-15T12:00:00Z'))).toBe(false);
    expect(isOutOfSeason(soups, new Date('2026-07-15T12:00:00Z'))).toBe(true);
  });

  it('never reports a non-seasonal category as out of season', () => {
    expect(isOutOfSeason(tacos, new Date('2026-07-15T12:00:00Z'))).toBe(false);
  });
});

describe('price shapes', () => {
  it('renders a flat price as one untitled tier', () => {
    const taco = categories.find((c) => c.id === 'tacos')!.items[0];
    expect(priceTiers(taco)).toEqual([{ value: '$3.50' }]);
  });

  it('renders quesadillas as plain and supreme, in printed order', () => {
    const cheese = categories.find((c) => c.id === 'quesadillas')!.items[0];
    expect(priceTiers(cheese)).toEqual([
      { label: 'Plain', value: '$5.50' },
      { label: 'Supreme', value: '$8.00' },
    ]);
  });

  it('renders sour cream across all three side-order sizes', () => {
    const sides = categories.find((c) => c.id === 'side-orders')!;
    expect(priceTiers(sides.items[0])).toEqual([
      { label: 'SM', value: '$1.00' },
      { label: '4 oz', value: '$2.00' },
      { label: '8 oz', value: '$4.00' },
    ]);
  });

  it('omits tiers an item does not have', () => {
    const sides = categories.find((c) => c.id === 'side-orders')!;
    const guacamole = sides.items.find((i) => i.name === 'Guacamole')!;
    expect(priceTiers(guacamole).map((t) => t.label)).toEqual(['4 oz', '8 oz']);
  });

  it('formats money to two decimal places', () => {
    expect(formatPrice(46)).toBe('$46.00');
    expect(formatPrice(1.75)).toBe('$1.75');
  });
});

describe('verification flags', () => {
  it('flags the ambiguous Tex-Mex Chill spelling', () => {
    const salads = categories.find((c) => c.id === 'tostada-salads')!;
    const item = salads.items.find((i) => i.number === '34')!;
    expect(needsVerification(item)).toBe(true);
    expect(item.nameAsPrinted).toBe('Tex-Mex Chill');
  });

  it('flags side orders whose size column is unclear in the scan', () => {
    const sides = categories.find((c) => c.id === 'side-orders')!;
    expect(sides.items.filter((i) => i.sizeUnclear)).toHaveLength(13);
  });

  it('does not flag an item transcribed cleanly', () => {
    const taco = categories.find((c) => c.id === 'tacos')!.items[0];
    expect(needsVerification(taco)).toBe(false);
  });
});

describe('ordering', () => {
  it('sorts categories into printed-menu order', () => {
    const shuffled = [...categories].reverse();
    expect(sortCategories(shuffled).map((c) => c.id)).toEqual([...CATEGORY_ORDER]);
  });
});
