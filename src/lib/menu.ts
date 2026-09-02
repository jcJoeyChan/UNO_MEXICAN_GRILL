/**
 * Typed access to the menu.
 *
 * Pages go through these helpers rather than reaching into raw JSON, so the
 * rules that matter — seasonal is not sold-out, unverified prices stay
 * visible, order-by-number is preserved — live in one place.
 */
import type { MenuCategory, MenuItem } from './menu-schema';

export type { MenuCategory, MenuItem };

/** The order categories appear on the printed menu. */
export const CATEGORY_ORDER = [
  'tacos',
  'quesadillas',
  'nachos',
  'burritos',
  'rice-platters',
  'tostada-salads',
  'fajitas-by-the-pound',
  'kids-meal',
  'side-orders',
  'beverages',
  'dessert',
  'soups',
] as const;

export function sortCategories(categories: MenuCategory[]): MenuCategory[] {
  // Explicitly keyed by string: CATEGORY_ORDER is a const tuple, so an inferred
  // Map would only accept those literal ids and reject a category.id of type
  // string — including a genuinely new category, which should sort last rather
  // than fail to compile.
  const rank = new Map<string, number>(CATEGORY_ORDER.map((id, i) => [id, i]));
  return [...categories].sort(
    (a, b) => (rank.get(a.id) ?? 999) - (rank.get(b.id) ?? 999) || a.name.localeCompare(b.name),
  );
}

/**
 * Seasonal availability. Deliberately distinct from any stock-out concept:
 * a winter-only soup is not a kitchen that ran out, and must never be styled
 * or labelled as though it were.
 */
export function isSeasonal(category: MenuCategory): boolean {
  return category.availability === 'seasonal';
}

export function seasonalLabel(category: MenuCategory): string | undefined {
  if (!isSeasonal(category)) return undefined;
  return category.seasonalLabel ?? `Seasonal — back in ${category.season}`;
}

/** True when the category is seasonal and we are outside its season right now. */
export function isOutOfSeason(category: MenuCategory, now: Date = new Date()): boolean {
  if (!isSeasonal(category) || !category.season) return false;
  const month = now.getMonth(); // 0-11
  const seasons: Record<string, number[]> = {
    winter: [11, 0, 1],
    spring: [2, 3, 4],
    summer: [5, 6, 7],
    autumn: [8, 9, 10],
  };
  return !(seasons[category.season] ?? []).includes(month);
}

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * The price tiers to display for an item, in printed-menu order.
 * Returns label/value pairs so a category with columns and one without can
 * share a component.
 */
export function priceTiers(item: MenuItem): { label?: string; value: string }[] {
  if (item.price !== undefined) return [{ value: formatPrice(item.price) }];
  if (!item.prices) return [];

  const order: [keyof NonNullable<MenuItem['prices']>, string][] = [
    ['plain', 'Plain'],
    ['supreme', 'Supreme'],
    ['sm', 'SM'],
    ['oz4', '4 oz'],
    ['oz8', '8 oz'],
  ];

  return order
    .filter(([key]) => item.prices?.[key] !== undefined)
    .map(([key, label]) => ({ label, value: formatPrice(item.prices![key]!) }));
}

/** Items whose data still needs confirming with the restaurant. */
export function needsVerification(item: MenuItem): boolean {
  return item.sizeUnclear === true || item.needsVerification !== undefined;
}

export function flaggedItems(categories: MenuCategory[]): MenuItem[] {
  return categories.flatMap((c) => c.items.filter(needsVerification));
}

export function countItems(categories: MenuCategory[]): number {
  return categories.reduce((n, c) => n + c.items.length, 0);
}

export function vegetarianItems(categories: MenuCategory[]): MenuItem[] {
  return categories.flatMap((c) => c.items.filter((i) => i.vegetarian));
}
