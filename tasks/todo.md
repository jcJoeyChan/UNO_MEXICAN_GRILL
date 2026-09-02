# Tasks: UNO Mexican Grill Website

Plan document: `tasks/plan.md`. Tasks are in dependency order.

**Definition of Done** — every task also clears: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` all pass clean; no fabricated content; unsupplied content is visibly provisional.

---

## Phase 1: Foundation

## Task 1: Scaffold Astro project and tooling

**Description:** Stand up the Astro static + TypeScript project inside the existing repo without disturbing files already committed. Wire the ESLint, Prettier, and Vitest tooling `SPEC.md` names, and the seven npm scripts it specifies.

**Acceptance criteria:**
- [x] Astro (static output) + TypeScript strict installed and building
- [x] ESLint (`@typescript-eslint`, `eslint-plugin-astro`) and Prettier (`prettier-plugin-astro`) configured
- [x] Vitest configured and running
- [x] All seven scripts from `SPEC.md` exist and work: `dev`, `build`, `preview`, `lint`, `format`, `typecheck`, `test`
- [x] `src/content/menu.json` is byte-identical to before scaffolding
- [x] `PRODUCT.md`, `SPEC.md`, `DECISIONS.md`, `.impeccable/`, `public/images/`, `public/menu.pdf` all untouched
- [x] `.gitignore` covers `node_modules`, `dist`, `.astro`

**Verification:**
- [x] `npm run build` succeeds on the empty starter
- [x] `npm run lint && npm run typecheck && npm run test` all pass
- [x] `git status` shows no deletions or modifications to pre-existing tracked files
- [x] Manual: `git diff --stat src/content/menu.json` is empty

**Dependencies:** None

**Files likely touched:** `package.json`, `astro.config.mjs`, `tsconfig.json`, `eslint.config.js`, `.prettierrc`, `vitest.config.ts`, `.gitignore`

**Estimated scope:** Medium (3–5 files)

**Note:** Scaffold into a temp directory and merge in — do not run `npm create astro@latest` directly in the repo root.

---

## Task 2: Design tokens and global styles

**Description:** Define the site's whole visual vocabulary as CSS custom properties: brand palette from the real logo, neutrals sampled from the actual food photography, type scale, spacing, radii, and motion tokens. Per `DECISIONS.md`, green/red are reserved for brand and state signaling — they are not general-purpose UI colors.

**Acceptance criteria:**
- [x] `src/styles/tokens.css` defines color, spacing, type-scale, radius, and motion custom properties
- [x] Brand green/red/white derived from `public/images/Logo.png`, not invented
- [x] Neutrals sampled from the food photography's wood-table/paper-tray world — no generic grey ramp
- [x] Separate accessible text-color tokens where saturated brand colors fail contrast
- [x] Every token pair used for text/background documented with its measured contrast ratio
- [x] Motion tokens include a `prefers-reduced-motion` reduced set
- [x] A reset is in place and applied globally

**Verification:**
- [x] All body-text token pairs measure ≥ 4.5:1; large-text pairs ≥ 3:1 (record the numbers in a comment)
- [x] `npm run build` succeeds
- [x] Manual: a scratch page rendering every token swatch looks like one coherent system

**Dependencies:** Task 1

**Files likely touched:** `src/styles/tokens.css`, `src/styles/reset.css`

**Estimated scope:** Small (1–2 files)

---

## Task 3: `isOpenNow()` with Vitest tests

**Description:** Implement the open/closed calculation backing the site's memorable moment. Hours are 11:00–21:30 daily in `America/New_York`. The function must take an injectable clock so it is testable, and must not silently assume the visitor's local timezone.

**Acceptance criteria:**
- [x] `src/lib/hours.ts` exports `isOpenNow(hours, now?)` returning open state plus the next transition time
- [x] Timezone is explicitly `America/New_York`, independent of the visitor's clock
- [x] Correct across DST transitions in both directions
- [x] Handles the exact boundary minutes (11:00 open, 21:30 close)
- [x] Returns enough for the pill to render "Open now — closes 9:30 pm" and the closed equivalent
- [x] Holiday-hours caveat is representable (a flag or note, not a hardcoded date list)

**Verification:**
- [x] `npm run test` passes with cases for: mid-open, mid-closed, both boundary minutes, both DST transitions, and a visitor clock in a different timezone
- [x] `npm run typecheck` passes
- [x] Manual: no test relies on the real system clock

**Dependencies:** Task 1

**Files likely touched:** `src/lib/hours.ts`, `tests/lib/hours.test.ts`

**Estimated scope:** Small (1–2 files)

---

## Task 4: BaseLayout, sticky order rail, and footer

**Description:** Build the shell all six pages share: the sticky top bar (logo · Menu · Location · Order▾), the live open/closed pill, the expanding order menu covering all four channels plus phone and walk-in, and the footer. This is the persistent-ordering thesis made real — "order now" stays one tap away at every scroll position.

**Acceptance criteria:**
- [x] `BaseLayout.astro` provides the page shell with per-page title/description slots
- [x] Sticky bar stays fixed through scroll and does not obscure content or focus targets
- [x] `HoursBadge` renders live state from Task 3
- [x] `OrderingLinks` expands to ChowBus, UberEats, DoorDash, Grubhub + phone + walk-in note, using the canonical URLs in `PRODUCT.md` (no tracking parameters)
- [x] External links carry `rel="noopener noreferrer"` and are marked as leaving the site
- [x] Mobile: bar collapses to logo + hamburger + Order button
- [x] Keyboard operable — the Order menu opens, traps focus appropriately, and closes on Escape
- [x] Uses tokens only; no hardcoded colors or spacing

**Verification:**
- [x] `npm run build` succeeds; `npm run lint` and `npm run typecheck` pass
- [x] Manual: keyboard-only walkthrough of the bar and Order menu at desktop and 375 px widths
- [x] Manual: all six ordering destinations open the correct page

**Dependencies:** Tasks 2, 3

**Files likely touched:** `src/layouts/BaseLayout.astro`, `src/components/Nav.astro`, `src/components/OrderingLinks.astro`, `src/components/HoursBadge.astro`, `src/components/Footer.astro`

**Estimated scope:** Medium (3–5 files)

---

## Checkpoint: Foundation

- [ ] `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` all pass clean
- [ ] The shell renders, is navigable by keyboard, and the open/closed pill shows correct live state
- [ ] Every ordering channel reachable in two interactions from anywhere
- [ ] Revisit `/constraints` — a build and test runner now exist, so thresholds can be measured rather than invented
- [ ] **Review with human before proceeding**

---

## Phase 2: Menu and Homepage

## Task 5: Menu content collection and schema

**Description:** Put a typed, validated layer over `src/content/menu.json` so pages consume the menu through a schema rather than raw JSON — including the three price shapes (single, plain/supreme, SM/4oz/8oz) and the seasonal availability state.

**Acceptance criteria:**
- [ ] Schema validates all 12 categories and 79 items; build fails loudly on malformed data
- [ ] All three price shapes typed and discriminated
- [ ] `seasonal` availability is a first-class state, distinct from any stock-out state
- [ ] `vegetarian` flag and item `number` exposed (order-by-number is an identity element)
- [ ] Items flagged `sizeUnclear` / `needsVerification` remain queryable so unverified data can be surfaced or withheld deliberately
- [ ] Astro's current content-collection API verified against live docs before writing

**Verification:**
- [ ] `npm run typecheck` passes; consuming a wrong field is a type error
- [ ] `npm run test` includes a case asserting the schema rejects a malformed item
- [ ] Manual: item counts per category match the plan's table (Tacos 9, Quesadillas 8, Nachos 3, Burritos 8, Rice Platters 7, Tostada Salads 10, Fajitas 4, Kids 5, Sides 17, Beverages 4, Dessert 2, Soups 2)

**Dependencies:** Task 1

**Files likely touched:** `src/content/config.ts`, `src/lib/menu.ts`, `tests/lib/menu.test.ts`

**Estimated scope:** Small (1–2 files)

---

## Task 6: Menu page — full catalog

**Description:** Render the complete menu across all 12 categories with confidently oversized category headings (the discipline kept from the declined "futurist bolted book" challenger). Item numbers are shown because the restaurant asks customers to order by number.

**Acceptance criteria:**
- [ ] All 79 items render, grouped by category, with correct prices in all three price shapes
- [ ] Item numbers displayed; the "please order by number" convention explained once
- [ ] Vegetarian items marked, with the asterisk convention explained
- [ ] Soups render as **"Seasonal — back in winter"**, visually distinct from any sold-out styling, and never as "sold out"
- [ ] Shrimp preparation note surfaced where shrimp items appear
- [ ] Tostada salad `+$2` tostada-shell modifier shown as an explicit related tier, not a bare "+"
- [ ] Category headings use display weight, not timid corporate headings
- [ ] Link to the printed PDF, labeled as a download with its file size
- [ ] Responsive: price columns stay readable at 375 px

**Verification:**
- [ ] `npm run build` succeeds; lint and typecheck pass
- [ ] Manual: spot-check 10 items against `public/menu.pdf`, including one from each price shape
- [ ] Manual: confirm no item anywhere reads "sold out"
- [ ] Manual: 375 px and 1440 px both legible without horizontal scroll

**Dependencies:** Tasks 4, 5

**Files likely touched:** `src/pages/menu.astro`, `src/components/MenuItemCard.astro`, `src/components/MenuCategory.astro`

**Estimated scope:** Medium (3–5 files)

---

## Task 7: Homepage — order-rail hero

**Description:** Build the chosen direction: a full-bleed real food photo carrying the first viewport, headline and one-line positioning, the live status pill, and primary "Order Now ▾" / secondary "View Menu" in the lower third — with a curated menu preview below the fold. Explicitly refuses the generic headline-over-stock-hero template.

**Acceptance criteria:**
- [ ] First viewport contains: sticky bar, full-bleed real photo, headline, one-line positioning, live open/closed pill, primary and secondary CTAs in the lower third
- [ ] Hero photo is one of the real photographs — no stock, no upscale-gloss treatment
- [ ] Below-fold menu preview shows a curated subset (not all 12 categories) with oversized category headings
- [ ] Hero entrance is a subtle fade/soft-scale; no autoplay video
- [ ] Menu-preview cards scroll-reveal with light stagger
- [ ] All motion fully disabled under `prefers-reduced-motion`
- [ ] A visitor can reach an ordering channel or the menu in one interaction from landing

**Verification:**
- [ ] `npm run build` succeeds; lint and typecheck pass
- [ ] Manual: with reduced-motion enabled, all content is present and no animation runs
- [ ] Manual: first viewport at 375 px still shows pill + both CTAs without scrolling
- [ ] Manual: hero image does not cause layout shift

**Dependencies:** Task 6

**Files likely touched:** `src/pages/index.astro`, `src/components/Hero.astro`, `src/components/MenuPreview.astro`

**Estimated scope:** Medium (3–5 files)

---

## Checkpoint: Core Experience

- [ ] All quality gates pass
- [ ] Home → Menu → order channel works end-to-end on desktop and mobile
- [ ] Seasonal soup reads as seasonal everywhere it appears
- [ ] Reduced-motion path verified
- [ ] **Review with human before proceeding**

---

## Phase 3: Remaining Pages

## Task 8: Location & Hours page

**Description:** Address, landmark, hours, and directions — the page the returning customer opens on their phone in the car.

**Acceptance criteria:**
- [ ] Address, landmark ("across from the Post Office, in Glen Oaks Shopping Center"), and phone shown
- [ ] Full weekly hours (Mon–Sun 11:00 am – 9:30 pm) plus the live pill and the holiday-hours caveat
- [ ] Tap-to-call and tap-for-directions work on mobile
- [ ] Map embed is lazy-loaded, or replaced by a static image linking out, to avoid third-party cost on load
- [ ] Storefront photo (`OUTSIDE.jpg`) used so visitors recognize the building

**Verification:**
- [ ] Build, lint, typecheck pass
- [ ] Manual: on a phone, tap-to-call dials and directions open a maps app
- [ ] Manual: no third-party script blocks first paint

**Dependencies:** Task 4

**Files likely touched:** `src/pages/location.astro`

**Estimated scope:** Small (1–2 files)

---

## Task 9: Contact page

**Description:** Phone, hours, address, and every ordering channel in one place. Default is no contact form — `PRODUCT.md` says the site routes to existing channels rather than operating its own. **Confirm with the user before building; see Open Questions.**

**Acceptance criteria:**
- [ ] Phone (tap-to-call), address, hours, and all four ordering channels present
- [ ] Walk-in and call-in-for-pickup both described
- [ ] No form unless explicitly approved; if approved, no personal data beyond name/email/message
- [ ] Catering enquiry routed to phone

**Verification:**
- [ ] Build, lint, typecheck pass
- [ ] Manual: every channel link resolves to the correct store page

**Dependencies:** Task 4

**Files likely touched:** `src/pages/contact.astro`

**Estimated scope:** Small (1–2 files)

---

## Task 10: About page

**Description:** Tell the restaurant's story using only what is actually confirmed — the six "Fresh is our #1 Goal" claims printed on the real menu, plus the storefront and food photography. No origin story has been supplied, so that section is explicitly provisional.

**Acceptance criteria:**
- [ ] The six freshness claims presented as the page's spine, in the restaurant's own words
- [ ] Source typo "quaulity" corrected to "quality" in display copy
- [ ] Real photography used; casual register preserved, no upscale styling
- [ ] Origin-story section clearly marked provisional — visually distinguishable, not passed off as real
- [ ] No invented history, awards, reviews, or press

**Verification:**
- [ ] Build, lint, typecheck pass
- [ ] Manual: every factual claim traces to `PRODUCT.md` or `menu.json`
- [ ] Manual: a stranger can tell at a glance which copy is placeholder

**Dependencies:** Task 4

**Files likely touched:** `src/pages/about.astro`

**Estimated scope:** Small (1–2 files)

---

## Task 11: Catering page

**Description:** Only "Small & Large Party Catering Available" is confirmed, plus Fajitas by the Pound as genuinely party-sized menu items. Everything else stays provisional and routes to a phone call.

**Acceptance criteria:**
- [ ] Confirmed catering availability stated; phone is the primary call to action
- [ ] Fajitas by the Pound surfaced as real party-scale options with real prices
- [ ] Offerings, pricing, minimums, and lead times marked provisional — no invented packages
- [ ] No fabricated testimonials or event photos

**Verification:**
- [ ] Build, lint, typecheck pass
- [ ] Manual: no claim on the page lacks a source in `PRODUCT.md` or `menu.json`

**Dependencies:** Task 4

**Files likely touched:** `src/pages/catering.astro`

**Estimated scope:** Small (1–2 files)

---

## Checkpoint: All Pages

- [ ] All six pages build, share one shell, and pass every quality gate
- [ ] Ordering channels reachable from every page
- [ ] All provisional content visibly provisional
- [ ] Internal links resolve; no 404s
- [ ] **Review with human before proceeding**

---

## Phase 4: Polish and Ship

## Task 12: Asset optimization

**Description:** The real photographs and the 7.9 MB scanned PDF are the site's entire payload. Get them down without visible loss.

**Acceptance criteria:**
- [ ] `public/menu.pdf` compressed to under 1 MB with text still legible at 100%
- [ ] Original PDF preserved (e.g. `MENU.original.pdf`, untracked or clearly named) so nothing is lost
- [ ] Food photos served responsively via Astro's image pipeline, with modern formats and correct `width`/`height`
- [ ] Hero image preloaded; below-fold images lazy-loaded
- [ ] PDF download link states the file size

**Verification:**
- [ ] Build succeeds; `dist/` total transfer for the homepage is well under 1 MB
- [ ] Manual: compressed PDF is readable at 100% zoom
- [ ] Manual: no visible quality loss in hero or preview images

**Dependencies:** Tasks 7, 8, 10, 11

**Files likely touched:** `public/menu.pdf`, `src/components/Hero.astro`, `src/components/MenuPreview.astro`, `astro.config.mjs`

**Estimated scope:** Small (1–2 files)

---

## Task 13: Accessibility and motion pass

**Description:** Bring the whole site to a WCAG AA baseline — good practice, not an enforced gate, since no CONSTRAINTS.md exists. Confirm the restrained-motion commitment holds everywhere.

**Acceptance criteria:**
- [ ] Every text/background pair meets AA (4.5:1 body, 3:1 large)
- [ ] Full keyboard operability with visible focus on every interactive element
- [ ] Landmarks, heading order, and alt text correct — food photos described meaningfully, decorative images empty-alt
- [ ] `prefers-reduced-motion` removes all non-essential motion sitewide
- [ ] Page titles and meta descriptions unique per page
- [ ] Menu tables readable by screen reader, including the multi-column price shapes

**Verification:**
- [ ] Manual: keyboard-only pass over all six pages
- [ ] Manual: screen-reader pass over the menu page's three price shapes
- [ ] Manual: an automated audit (Lighthouse or axe) reports no critical issues
- [ ] All quality gates pass

**Dependencies:** Tasks 7, 8, 9, 10, 11

**Files likely touched:** `src/styles/tokens.css`, `src/layouts/BaseLayout.astro`, various pages

**Estimated scope:** Medium (3–5 files)

---

## Task 14: Impeccable finish review and DESIGN.md

**Description:** The direction contract's FINISH clause is explicit: "unreviewed and undocumented is unfinished." Because no comp exists, the review audits behavior against the contract, then records the shipped design system.

**Acceptance criteria:**
- [ ] Finish review run against `.impeccable/surfaces/homepage.md` — thesis, own-world, story, first viewport, form, memorable moment
- [ ] Verdict recorded, with material fixes applied or explicitly deferred with reasons
- [ ] `DESIGN.md` derived from the shipped artifact, not from intentions
- [ ] Every shipping raster carries its provenance, per the contract
- [ ] Confirmed: the build does not read as the generic template the thesis refuses

**Verification:**
- [ ] Review verdict is written down, not just asserted
- [ ] Manual: `DESIGN.md` matches what actually shipped
- [ ] All quality gates pass

**Dependencies:** Tasks 12, 13

**Files likely touched:** `DESIGN.md`, `.impeccable/`, fix commits across components

**Estimated scope:** Medium (3–5 files)

---

## Task 15: Netlify deploy configuration

**Description:** Ship it. **Gated on menu price verification — do not publish publicly until prices are confirmed with the restaurant.**

**Acceptance criteria:**
- [ ] `netlify.toml` with correct build command and publish directory
- [ ] Production build deploys successfully
- [ ] 404 page exists and uses the site shell
- [ ] Favicon from the real logo
- [ ] Open Graph / social preview per page using real photography
- [ ] `robots.txt` and a sitemap
- [ ] **Menu prices verified with the restaurant** — all 14 flagged items resolved, `menu.json` provenance updated
- [ ] Deploy preview reviewed on a real phone before going live

**Verification:**
- [ ] Deploy preview builds and serves all six pages
- [ ] Manual: real-device check of homepage, menu, and location
- [ ] Manual: every ordering link works from the deployed site
- [ ] Manual: verification call completed and recorded in `menu.json`

**Dependencies:** Task 14

**Files likely touched:** `netlify.toml`, `src/pages/404.astro`, `public/favicon.ico`, `src/content/menu.json`

**Estimated scope:** Medium (3–5 files)

---

## Checkpoint: Complete

- [ ] All acceptance criteria met across all 15 tasks
- [ ] Menu prices verified with the restaurant
- [ ] Finish review verdict recorded; `DESIGN.md` written
- [ ] Site live on Netlify and checked on a real phone
- [ ] Ready for review
