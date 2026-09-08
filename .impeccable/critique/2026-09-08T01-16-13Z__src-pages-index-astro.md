---
target: the homepage
total_score: 27
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
target_identity: "file:C:\\Users\\joeyc\\CLAUDE PROJECTS\\UNO_MEXICAN_GRILL\\src\\pages\\index.astro"
target_fingerprint: "sha256:b0f6c01ecafa75b5397c81950a970c0331b7b845a12b6d260ca920ce920bb43b"
target_path: "C:\\Users\\joeyc\\CLAUDE PROJECTS\\UNO_MEXICAN_GRILL\\src\\pages\\index.astro"
timestamp: 2026-09-08T01-16-13Z
slug: src-pages-index-astro
closed: true
---
**Method: dual-agent** (A: design review · B: detector + browser evidence), run in isolation.
**Target:** `src/pages/index.astro` + its nine components · **Mode:** Persuade · Inspected at 1280x3400 and 375x4600.

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | `.rail-pill{display:none}` in the mobile media query (Nav.astro:304) removes "Open now" once you scroll past the hero; contract says always visible. |
| 2 | Match System / Real World | 3 | Number chips and seasonal-not-sold-out are exemplary; undercut by "A few favourites" = `items.slice(0, 3)`. |
| 3 | User Control and Freedom | 3 | Order dropdown closes on Escape/outside-click/focus-out; the mobile hamburger closes on none. |
| 4 | Consistency and Standards | 2 | Two controls labelled "Order Now" ~90px apart: MuralHero.astro:62 scrolls 1500px, Nav.astro:56 opens a panel. |
| 5 | Error Prevention | 2 | Pill says "Open now" on holidays; caveat is five screens away in the footer. |
| 6 | Recognition Rather Than Recall | 3 | Partner brand colours only on :hover/:focus-visible — invisible to touch users. |
| 7 | Flexibility and Efficiency | 3 | Rail to ChowBus is two taps; but 12 links on the page all resolve to /menu. |
| 8 | Aesthetic and Minimalist Design | 2 | Identical four-card ordering block renders three times; hours pill three times visibly. |
| 9 | Error Recovery | 3 | Review arrows disable at ends rather than lying; no fallback for a failed food image. |
| 10 | Help and Documentation | 3 | Missing what locals ask: parking, delivery radius, pickup time. |
| **Total** | | **27/40** | **Solid, with real gaps** |

## Design Specificity Verdict

Desktop: authored for this restaurant (mural, serape from the printed menu, green number chips derived from "please order by number"). Mobile: a generic dark-hero template. A 2.24:1 mural forced through object-fit: cover into a ~375x650 box under a 94% scrim becomes an unreadable brown wash.

Deterministic scan: static detector returned ZERO findings, and that result is meaningless here. Positive control confirmed the toolchain works on .astro. Structural reason: every live finding resolves through a token in tokens.css, a CSS-only file outside the markup scan. A markup-only scan on this codebase reports clean regardless of quality.

Browser detector: 11 findings on the homepage (24 on /menu, 6 each on /contact and /about). Carried as genuine: tight-leading x5 on review quotes (--line-height-snug: 1.25 on --font-size-lg, below the 1.3 floor). Rejected as false positives: ai-color-palette on .serape (8-stop stripe sampled from the paper menu, not the cyan-indigo cliche); monotonous-spacing (12 samples vs nine distinct tokens across 79 usages); text-overflow on /contact (the Netlify honeypot, deliberately clipped). Contested: cream-palette on body (#faf7f2 is documented in DESIGN.md as sampled from the food photography).

## What's Working

1. HoursBadge.astro server-renders the hours and client-upgrades to live state, so a no-JS visitor sees the hours rather than a frozen "Open now" lie.
2. The green number chip is product character derived from operations — it makes the homepage preview usable as a script for a phone call.
3. The type split (Alfa Slab One headings, system stack for prices/item names) is why a heavy slab survives; the ornamented face never touches scanned text.

## Priority Issues

[P0] Mobile hero destroys the page's best asset. Mural unrecognisable at 375; no food in the first viewport (appears ~1230px down). Fix: portrait crop centred on the painted sign from source-assets/MURAL.JPG (5712x4284) via <source media="(max-width: 48rem)">, lift mobile scrim 94% -> ~78%, reduce hero min-height. Command: /impeccable adapt

[P1] Two "Order Now" controls, same colour, different behaviour (anchor to #order vs panel). Fix: hero CTA opens the same panel, or relabel "See all ordering options". Command: /impeccable clarify

[P1] Ordering block appears three times; its most important instance is weakest. Partner brand colours gated behind hover, invisible to touch. Fix: show partner colour at rest; ChowBus as a full primary button with a plain reason; collapse the footer instance. Command: /impeccable layout

[P2] Menu preview sits below the ordering CTA — persuasion behind conversion; ~3000px down on mobile. Fix: hero -> food -> menu preview -> reviews -> order. Command: /impeccable layout

[P2] Focus rings fail contrast on the dark hero: outline 3px var(--brand-green-ink) #186226 on #241611 = ~2.2:1, under the 3:1 WCAG 1.4.11 floor, on the hero's primary CTAs. Review arrows and hamburger are 40px, under the 44px touch target. Command: /impeccable audit

## Persona Red Flags

Hungry local (20s, phone): no food in first viewport; hero "Order Now" throws them past food to six undifferentiated choices, three labelled only "Delivery"; prices ~3000px away; no price range; "Open now" disappears on scroll.

Returning customer: best served (rail to ChowBus two taps), but "A few favourites" is slice(0,3) — JSON order, not what sells.

Low vision / screen reader: four aria-live regions on one page and HoursBadge updates all pills at once, so the 9:30pm flip announces up to four times. Reviews.astro prev button has aria-controls pointing at the h2, not the scroll container; next button has none. Mobile nav opens with no Escape support.

## Minor Observations

- Verified doc drift: CLAUDE.md:37 and CONSTRAINTS.md:36 say 79 items; live site and check-content.mjs say 78.
- DESIGN.md's finish review (2026-09-02) audits a page that no longer exists — Reviews and the /news nav entry landed 2026-09-06 and appear nowhere in it.
- No LocalBusiness JSON-LD anywhere in src/ — confirmed absent. Highest-leverage omission for a business whose customers ask Google "is UNO open".
- Serape appears twice as a band plus a border-image per menu-preview group, against DESIGN.md's "at most one per page".
- .is-anchor in HeroMosaic.astro is dead code.
- Contract requires the painted UNO MEXICAN GRILL sign fully visible in the first viewport; at 1280 it is sliced mid-word.

## Questions to Consider

1. If the mural cannot read at 375, is it the hero or only the desktop hero? What would a phone-first version look like?
2. If the rail keeps ordering one tap away, what is the "Order From" section for — could that space be food?
3. "A few favourites" is slice(0,3). Is an unearned claim of curation different in kind from an invented review?
4. The reviews are real and source-linked but persuade less than one star rating would. Why carry the hard half of the proof?
5. Nothing tells Google this is a restaurant. Is the most valuable surface one you have not designed at all?
