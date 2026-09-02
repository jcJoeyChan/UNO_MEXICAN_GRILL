# Implementation Plan: UNO Mexican Grill Website

## Overview

Build the six-page static marketing site for UNO Mexican Grill in Astro, per `SPEC.md` (technical contract), `PRODUCT.md` (product truth), `DECISIONS.md` (why, and what we chose against), and `.impeccable/surfaces/homepage.md` (the homepage direction contract). The site presents the menu, hours, and location, and routes visitors to external ordering channels — it never processes orders itself.

All planning inputs are settled. Menu data was transcribed from the restaurant's own printed menu into `src/content/menu.json` (12 categories, 79 items). No design comp exists — the build is code-led, and ambition is audited in behavior at the finish review.

## Architecture Decisions

Carried from `SPEC.md` and `DECISIONS.md`, not re-litigated here:

- **Astro static output + TypeScript.** Content-driven site needing component reuse, not an app framework.
- **Plain CSS via scoped `<style>` + `src/styles/tokens.css`.** Tailwind was considered and declined; no magic numbers for color or spacing.
- **Vitest for pure logic only.** `isOpenNow()` is the only real logic in the build. No e2e until interactive behavior exists.
- **Netlify static deploy.**

Decisions made *in this plan*, not inherited:

- **Scaffold via a temporary directory, then merge.** The repo is already non-empty and `src/content/menu.json` exists. Running `npm create astro@latest` in place risks clobbering it. Scaffold to a temp dir, copy in, verify menu.json survives.
- **Foundation phase before vertical page slices.** All six pages share one shell, tokens, and the open/closed pill. Building a page slice first would mean building the shell anyway and then reworking it. The foundation is the first vertical slice — it delivers a rendering, navigable shell with the signature interaction working.
- **`isOpenNow()` lands in Phase 1, before any page.** It is the site's one piece of real logic, its correctness is time- and timezone-dependent, and the always-visible open/closed pill is the named memorable moment. Fail fast on it.
- **Menu page before homepage.** The homepage's below-fold section is a *preview* of the menu — the item card primitives and seasonal-state handling are easier to get right against the full catalog first, then curate down.

## Task List

Tasks are recorded in `tasks/todo.md`. Order below reflects dependency order.

### Phase 1: Foundation
- Task 1: Scaffold Astro project and tooling
- Task 2: Design tokens and global styles
- Task 3: `isOpenNow()` with Vitest tests
- Task 4: BaseLayout, sticky order rail, and footer

### Checkpoint: Foundation

### Phase 2: Menu and Homepage
- Task 5: Menu content collection and schema
- Task 6: Menu page — full catalog
- Task 7: Homepage — order-rail hero

### Checkpoint: Core Experience

### Phase 3: Remaining Pages
- Task 8: Location & Hours page
- Task 9: Contact page
- Task 10: About page
- Task 11: Catering page

### Checkpoint: All Pages

### Phase 4: Polish and Ship
- Task 12: Asset optimization
- Task 13: Accessibility and motion pass
- Task 14: Impeccable finish review and DESIGN.md
- Task 15: Netlify deploy configuration

### Checkpoint: Complete

## Dependency Graph

```
T1 Scaffold
 ├── T2 Tokens
 │    └── T4 BaseLayout + order rail ──┬── T6 Menu page ── T7 Homepage
 │         ▲                           ├── T8 Location
 │         │                           ├── T9 Contact
 │    T3 isOpenNow ────────────────────┼── T10 About
 │         (HoursBadge)                └── T11 Catering
 │                                          │
 └── T5 Menu collection ── T6 ──────────────┘
                                            │
                          T12 Assets ───────┤
                          T13 A11y/motion ──┼── T14 Finish review ── T15 Deploy
                                            │
```

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| **Menu prices are unverified.** Transcribed from a printed menu of unknown vintage; ChowBus already disagreed on availability. | **High** — publishing wrong prices misleads real customers | Task 15 is gated on a verification call. Build everything; do not deploy publicly until prices are confirmed. Tracked as an open question below. |
| Scaffolding into a non-empty repo clobbers `src/content/menu.json` | High — that file cost real work to produce | T1 scaffolds to a temp dir and merges; T1 acceptance explicitly re-validates menu.json afterward |
| Astro content-collection API differs by major version (v5 content layer vs. older `defineCollection`) | Medium — silent breakage or deprecated patterns | T5 verifies the API against current Astro docs before writing the schema; do not write it from memory |
| Brand green/red on white may fail WCAG AA contrast at small sizes | Medium — the palette is fixed by the real logo | T2 measures contrast ratios when tokens are defined, not at T13. Reserve saturated brand colors for large text/UI, derive accessible text tones as separate tokens |
| DST and timezone bugs in `isOpenNow()` | Medium — the pill is the memorable moment; wrong is worse than absent | T3 tests with an injected clock across DST boundaries, explicitly in `America/New_York` |
| 7.9 MB image-only PDF ships to visitors | Low-Medium — mobile data cost | T12 compresses it; link it only as an explicit download |
| Seasonal soup rendered as "sold out" | Low but reputationally bad | Encoded as a distinct `seasonal` state in menu.json; T6 acceptance asserts the distinction |
| No design comp exists to check against | Medium — ambition can quietly deflate | T14 finish review audits behavior against the direction contract, per its FINISH clause |

## Open Questions

Blocking launch (not blocking the build):

- **Menu price verification.** Confirm all 79 items with the restaurant. Specifically: item 34 printed as "Tex-Mex Chill" (Chili?), and side orders 49–61 whose SM/4oz/8oz column is ambiguous in the scan (14 items flagged `sizeUnclear` / `needsVerification` in `menu.json`).
- **Holiday hours.** `PRODUCT.md` notes they may differ but gives no data. Currently handled as a static caveat next to the pill — confirm that's acceptable.

Blocking specific tasks:

- **Source photography is too small for a full-bleed hero (T7, T12).** Measured: `Spread2.jpg` 750x600 is the largest; `OUTSIDE.jpg` 348x348; `Spread1.jpg`, `Nacho_supreme.jpg`, `Logo.png` 225x225; `Tostada_Salad.jpg` 289x174; `Burrito.jpg` 251x201. The direction contract's FIRST VIEWPORT calls for a full-bleed real photograph, which needs roughly 2000px wide to hold up on a desktop display and 1500px on a modern phone. At current sizes the hero would be visibly soft — which would read as a cheap site and undercut the "real food, not stock" thesis. Need the originals (phone camera files, or whatever was uploaded to ChowBus) before T7. If no larger files exist, the hero form has to change — a tiled/collage treatment tolerates small sources where one full-bleed image does not.

- **About story copy (T10).** The "Fresh is our #1 Goal" claims from the printed menu are real and usable, but there is no origin story. Build with those claims plus clearly-provisional placeholder for the story.
- **Catering details (T11).** Only "Small & Large Party Catering Available" is confirmed. No offerings, pricing, or minimums. Page routes to phone; everything else stays provisional.
- ~~**Contact page form (T9).**~~ **Resolved 2026-09-02: yes, a Netlify form.** Name, email and message, handled by Netlify Forms so there is no backend. Ordering still routes to the external channels — the form is for questions and catering enquiries, not orders. Needs a honeypot for spam and must collect nothing beyond those three fields.
- **Deploy target details (T15).** No domain named. Netlify subdomain assumed unless told otherwise.

Deferred by earlier decision:

- **`/constraints` and CONSTRAINTS.md.** Deliberately deferred until there is a codebase to measure. Revisit after Checkpoint: Foundation, when a build and test runner exist and thresholds can be measured rather than invented.

## Definition of Done (project-wide)

Every task clears this bar before it counts as done, per `SPEC.md`:

- `npm run lint` passes clean
- `npm run typecheck` (astro check) passes clean
- `npm run test` passes
- `npm run build` completes with no errors
- No fabricated content — no invented menu items, prices, reviews, or press mentions
- Anything not yet supplied is visibly provisional, never presented as factual
