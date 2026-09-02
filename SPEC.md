# Spec: UNO Mexican Grill Website

## Objective

Build the public marketing/informational website for UNO Mexican Grill — a real, casual Mexican restaurant offering takeout and dine-in (not upscale/sit-down). The site helps two kinds of visitors: a hungry local diner deciding where to eat/order, and a returning customer who wants to quickly reorder or find hours/location. The site does not process orders itself; it routes visitors to the restaurant's existing ordering channels (ChowBus POS, UberEats, DoorDash, Grubhub) or to phone/walk-in.

Success: a visitor can, within seconds of landing, see what the restaurant is, view the menu, confirm hours/location, and reach an ordering channel or contact method — with a modern look and tasteful (non-excessive) motion, in a casual register that doesn't read as fine dining.

Full product context (users, positioning, constraints, brand commitments) lives in `PRODUCT.md` — this spec does not repeat it, only builds on it.

## Tech Stack

- **Framework:** Astro (static output)
- **Language:** TypeScript
- **Styling:** Plain CSS via Astro scoped `<style>` blocks + a shared CSS-variable token file (no CSS framework)
- **Linting:** ESLint with `@typescript-eslint` + `eslint-plugin-astro`
- **Formatting:** Prettier + `prettier-plugin-astro`
- **Testing:** Vitest (unit tests for any logic, e.g. hours/open-status calculations)
- **Deploy target:** Netlify (Astro's Netlify adapter or static deploy)

## Commands

```
Dev:      npm run dev
Build:    npm run build
Preview:  npm run preview
Lint:     npm run lint
Format:   npm run format
Typecheck: npm run typecheck   (astro check)
Test:     npm run test         (vitest run)
```

## Project Structure

```
src/
  components/     → Reusable UI pieces (Nav, Footer, MenuItemCard, HoursBadge, OrderingLinks, etc.)
  layouts/         → Shared page shell(s) (BaseLayout.astro)
  pages/           → Route files: index.astro, menu.astro, location.astro, contact.astro
  content/         → Content collections (menu items, hours) — placeholder entries until real data lands
  styles/          → Global tokens (colors, spacing, type scale) and reset
  lib/             → Small utilities (e.g. isOpenNow(hours))
public/            → Static assets: images, favicon, logo (placeholders until real assets supplied)
tests/             → Vitest unit tests, mirroring src/lib structure
netlify.toml       → Netlify build config
```

## Code Style

Astro components use scoped styles and CSS variables from `src/styles/tokens.css`; no inline magic numbers for color/spacing.

```astro
---
// src/components/HoursBadge.astro
import { isOpenNow } from '../lib/hours';

interface Props {
  hours: { day: string; open: string; close: string }[];
}
const { hours } = Astro.props;
const open = isOpenNow(hours);
---
<span class={`hours-badge ${open ? 'is-open' : 'is-closed'}`}>
  {open ? 'Open now' : 'Closed'}
</span>

<style>
  .hours-badge {
    font-size: var(--font-size-sm);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-full);
  }
  .is-open { background: var(--color-success-bg); color: var(--color-success-text); }
  .is-closed { background: var(--color-muted-bg); color: var(--color-muted-text); }
</style>
```

Naming: PascalCase for components, camelCase for functions/variables, kebab-case for file-system routes and CSS custom properties (`--color-brand-primary`).

## Testing Strategy

- **Unit tests (Vitest):** cover pure logic only — e.g. `isOpenNow`, any hours/formatting helpers. Live in `tests/`, mirroring `src/lib/`.
- **No e2e framework yet.** The site is static/content-first with minimal interactivity; add Playwright later only if real interactive behavior (e.g. a filterable menu) is introduced.
- **Visual/UX verification** happens through Impeccable's audit/critique/polish commands, not automated tests — animation feel and visual hierarchy are judged, not asserted.
- No coverage threshold is enforced yet (`/constraints` was deliberately deferred until there's a real codebase to measure).

## Boundaries

- **Always:** run `npm run lint`, `npm run typecheck`, and `npm run test` before considering a task done; follow the naming conventions above; keep placeholder content (menu items, prices, photos, testimonials) visibly provisional until real assets are supplied — never present invented content as factual.
- **Ask first:** adding any dependency beyond what's listed above; changing the deploy target or Netlify config; introducing an in-site ordering/payment backend (ordering is explicitly external per `PRODUCT.md`); changing the site's page structure/IA.
- **Never:** commit secrets or API keys; fabricate real menu items, prices, reviews, or press mentions; remove a failing test without approval; edit generated/vendor output directly.

## Success Criteria

- `npm run build` completes with no errors; `npm run typecheck` and `npm run lint` pass clean.
- Site has four pages sharing one layout/design system: Home, Menu, Location & Hours, Contact.
- Every page surfaces the ordering channels (ChowBus, UberEats, DoorDash, Grubhub) plus phone/walk-in, once their real links are supplied; until then, the UI clearly marks them as pending.
- Placeholder menu items, photos, and copy are visually distinguishable as provisional wherever real content hasn't been supplied yet.
- Visual direction reads as modern with tasteful, non-excessive motion — verified via an Impeccable audit/critique pass before considering the build done.
- Site deploys successfully to Netlify.

## Open Questions

- Exact final page list — is there a need for an About/Story or Catering page beyond Home/Menu/Location/Contact? (default: the four above; expand if the user confirms more.)
- Real menu items/prices, photos, logo, address, hours, and the specific ChowBus/UberEats/DoorDash/Grubhub URLs — pending from the user (see `PRODUCT.md` Evidence on Hand).
- No accessibility standard has been formally locked (no CONSTRAINTS.md yet) — building to a reasonable WCAG AA baseline as good practice, not as an enforced gate.
