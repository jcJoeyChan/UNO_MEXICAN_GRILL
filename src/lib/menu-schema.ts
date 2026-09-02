/**
 * Zod schemas for the menu data.
 *
 * Kept in src/lib rather than inline in src/content.config.ts so the tests can
 * import the exact same schema the build uses. A schema the tests cannot reach
 * is a schema nobody proves anything about.
 */
import { z } from 'astro/zod';

/** '11.00' style money, always a positive number of dollars. */
// .finite() is deprecated in this zod version; z.number() already rejects
// NaN and Infinity, so .positive() is the whole constraint we need.
const money = z.number().positive();

export const menuItemSchema = z
  .object({
    /**
     * Printed item number — '1', '2F', 'N1', 'K1'. Null for the handful of
     * items the menu lists without one (drinks, desserts, soups, apple juice).
     * The printed menu says "please order by number", so this is identity, not
     * decoration.
     */
    number: z.string().min(1).nullable(),
    name: z.string().min(1),
    /** Retained where the printed menu has a typo we corrected for display. */
    nameAsPrinted: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    vegetarian: z.boolean(),

    /** Flat price. Mutually exclusive with `prices`. */
    price: money.optional(),

    /** Tiered price: plain/supreme for quesadillas, sm/4oz/8oz for sides. */
    prices: z
      .object({
        plain: money.optional(),
        supreme: money.optional(),
        sm: money.optional(),
        oz4: money.optional(),
        oz8: money.optional(),
      })
      .optional(),

    /**
     * Provenance flags. These must survive until someone confirms the real
     * value with the restaurant — CONSTRAINTS.md enforces that at least one
     * item still carries one.
     */
    sizeUnclear: z.boolean().optional(),
    needsVerification: z.string().min(1).optional(),
  })
  .refine((item) => (item.price === undefined) !== (item.prices === undefined), {
    message: 'an item must have exactly one of `price` or `prices`',
  })
  .refine((item) => item.prices === undefined || Object.keys(item.prices).length > 0, {
    message: '`prices` must contain at least one tier',
  });

export const menuCategorySchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    note: z.string().min(1).optional(),

    /** Which price shape this category's items use. */
    priceType: z.enum(['single', 'plainSupreme', 'sizes']),
    priceColumns: z.array(z.string()).optional(),
    columnCaveat: z.string().optional(),

    /**
     * Seasonal is a first-class availability state, deliberately NOT a
     * stock-out. The printed menu says "SOUPS (Winter Only)"; ChowBus's
     * "sold out" flag was a POS artifact of the same fact. Rendering these as
     * sold out would misrepresent the restaurant, so the type system does not
     * even offer that option here.
     */
    availability: z.literal('seasonal').optional(),
    season: z.enum(['winter', 'spring', 'summer', 'autumn']).optional(),
    seasonalLabel: z.string().min(1).optional(),
    seasonalNote: z.string().min(1).optional(),

    modifiers: z.array(z.object({ name: z.string().min(1), price: money })).optional(),

    items: z.array(menuItemSchema).min(1),
  })
  .refine((cat) => cat.availability !== 'seasonal' || cat.season !== undefined, {
    message: 'a seasonal category must say which season',
  })
  .refine(
    (cat) =>
      cat.priceType !== 'plainSupreme' ||
      cat.items.every((i) => i.prices?.plain !== undefined && i.prices?.supreme !== undefined),
    { message: 'every item in a plainSupreme category needs both plain and supreme prices' },
  )
  .refine((cat) => cat.priceType !== 'single' || cat.items.every((i) => i.price !== undefined), {
    message: 'every item in a single-price category needs a flat price',
  });

export type MenuItem = z.infer<typeof menuItemSchema>;
export type MenuCategory = z.infer<typeof menuCategorySchema>;
