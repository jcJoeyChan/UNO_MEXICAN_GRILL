# Design

The design system as **shipped**, not as intended. Every value here is taken from the code that runs; every contrast ratio was measured, not estimated.

Companion documents: `CONSTRAINTS.md` (the enforced bar), `PRODUCT.md` (product truth), `.impeccable/surfaces/homepage.md` (the direction contract this was built against). `DECISIONS.md` records why, and what was chosen against — it is gitignored and lives only on the Windows desktop, so anything another machine needs belongs here instead.

---

## Finish review — verdict

First audited 2026-09-02 against the direction contract, by behaviour rather than intention, since no comp exists (the build is code-led). **Re-verified 2026-09-08** against the shipped code, because the page audited in September no longer existed: reviews, `/news`, an art-directed hero and a rebuilt ordering block all landed after it.

**Verdict: ships.** All eleven contract clauses still hold.

| Clause | Holds | Evidence (2026-09-08) |
| --- | --- | --- |
| THESIS — order rail persists everywhere | Yes | Order control on all seven public pages |
| THESIS — real photography carries the page | Yes, amended | See the tension below |
| STORY — live open/closed state | Yes | Pill computed client-side from real hours |
| STORY — ordering reachable immediately | Yes | Rail panel, and the hero CTA opens the same panel rather than scrolling |
| MEMORABLE — oversized category headings | Yes | Display face on all twelve menu titles |
| STATES — nothing reads "sold out" | Yes | Zero occurrences, enforced by `check:content` |
| STATES — seasonal is its own state | Yes | "Seasonal — back in winter" on the soups |
| STATES — mobile rail collapses | Yes | Logo + hamburger + Order at 375px |
| INTERACTION — reduced motion honoured | Yes | Durations collapse to 1ms at token level |
| INTERACTION — Order expands to all channels | Yes | Four channels plus phone and walk-in |
| FINISH — rasters carry provenance | Yes | Recorded below and in `menu.json` |

**The same tension, now sharper.** The thesis says "real food photography carries the page"; the mural carries the first viewport instead. That was a recorded amendment — the food photography tops out at 750×600 and could not hold a hero. Since then the hero has become **art-directed**: phones get a portrait crop framed on the painted UNO MEXICAN GRILL sign, desktop keeps the landscape. The spirit holds — everything on the page is genuinely this restaurant — but the literal clause remains amended rather than met.

**Material fixes outstanding:** none blocking. Two documented exceptions carry expiry dates (`CONSTRAINTS.md`), both wanting better source photography rather than code.

---

## Colour

Nothing here was invented. Brand colours are sampled from the logo, neutrals from the food photography, and the remaining palette from the hand-painted dining-room mural.

### Brand — from `Logo.png`

| Token | Value | Use |
| --- | --- | --- |
| `--brand-green` | `#3cab48` | Identity only. **Cannot carry white text — 2.95:1.** |
| `--brand-red` | `#d7171f` | Identity, ring typography |
| `--brand-green-deep` | `#1f7a2c` | Primary buttons. White text 5.41:1 |
| `--brand-green-ink` | `#186226` | Links, active nav. 6.98:1 on surface |
| `--brand-red-deep` | `#b01018` | White text 7.16:1 |
| `--brand-red-ink` | `#96131a` | Accent text. 8.17:1 on surface |

### Warm neutrals — from the food photography

Sampled from six photographs whose colours sit in a warm band (hue 14–42: wood table, paper tray, foil). A generic grey ramp would fight the photography.

`--warm-950 #241611` · `--warm-800 #4b372e` · `--warm-600 #6b5546` · `--warm-400 #a99b7e` · `--warm-200 #e0d5c4` · `--warm-100 #f3ede3` · `--warm-50 #faf7f2`

### Mural palette — from `source-assets/MURAL.JPG`

| Token | Value | Measured |
| --- | --- | --- |
| `--mural-sky-wash` | `#dceaf5` | Ink 14.30:1 — menu-preview ground |
| `--mural-sand` | `#d9d5ca` | Ink 11.96:1 — ordering ground |
| `--mural-adobe` | `#c18c59` | Ink 5.98:1. **White fails at 2.93:1** |
| `--mural-terracotta` | `#925c44` | White 5.47:1 |
| `--mural-sage` | `#5e6d50` | White 5.56:1 |
| `--mural-frame-green` | `#819742` | Identity only. **White fails at 3.26:1** |
| `--mural-sage-deep` | `#4a5a2c` | White 7.53:1 |
| `--mural-terracotta-ink` | `#8a4a2f` | 6.34:1 on surface |
| `--mural-sage-ink` | `#41522f` | 7.95:1 on surface |

**The recurring rule:** a sampled colour is an identity colour. Several cannot carry text, and each has a deepened variant that can. Never put white on `--brand-green`, `--mural-adobe` or `--mural-frame-green`.

### Serape stripe — from the printed menu's woven bands

`--serape-sage #4e8a6f` · `--serape-red #d82f40` · `--serape-sky #80c3d7` · `--serape-amber #e9b665`

Composed into `--serape`, a repeating gradient. **Decorative only** — a rule between sections, never a background for text, at most one per page.

### Ordering partners — from each platform’s published brand colour

Cards rest on a neutral ground and take their partner’s colour on hover and keyboard focus; a small dot carries the colour at rest, so touch users see it too.

| Partner | Ground | Text on it | Measured |
| --- | --- | --- | --- |
| ChowBus | `#cc2543` | `#fefefe` | 5.32:1 |
| Uber Eats | `#06c167` | `#000000` | 8.83:1 |
| DoorDash | `#eb1700` | `#ffffff` | 4.51:1 |
| Grubhub | `#ffffff` | `#b75c00` | 4.62:1 |

**The Published-Colour Rule.** A partner’s published colour is used as a *ground*, never as text. Every one of them fails AA as text on `--surface` — 2.68 / 2.23 / 3.46 / 3.58:1 — and Grubhub’s `#ff8000` measures 2.52:1 even on white, so the site uses a darkened `#b75c00` for its lettering instead.

Each partner also carries a `--partner-*-mark`: the hue that identifies it as a dot on a light ground. It is the brand ground for three of them and the orange for Grubhub, whose white ground would render as nothing.

These are not official brand assets. They identify a link to that partner; trademarks are their owners’.

### Focus

| Token | Value | Role |
| --- | --- | --- |
| `--focus-ring` | `--warm-950` | The ring itself |
| `--focus-ring-halo` | `--warm-50` | A light band just outside it |

**The Two-Tone Focus Rule.** One colour cannot do this. A focus ring must clear 3:1 (WCAG 1.4.11) against every ground a control can sit on, and those run from `#ffffff` to `#241611`; the mid-light grounds (`--mural-sand`, `--mural-sky-wash`) sit inside 3:1 of any mid-tone, so no single value exists. Ink carries the light grounds at 11.96–17.53:1; the halo carries the dark and brand-filled ones at 4.22–16.41:1. Every ground has at least one.

A single green ring was tried first and measured **1.38:1 on the primary button** — invisible exactly where the primary call to action lives.

### State

| State | Ground | Text | Ratio |
| --- | --- | --- | --- |
| Open | `#e4f3e2` | `--brand-green-ink` | 6.47:1 |
| Closed | `#f0e7e0` | `--warm-800` | 9.13:1 |
| Seasonal | `#fdf1dc` | `#7a4a10` | 6.68:1 |

Seasonal is deliberately its own state and must never share styling with an out-of-stock state. A winter-only soup is not a kitchen that ran out.

---

## Type

| | |
| --- | --- |
| Display | **Alfa Slab One**, self-hosted, SIL OFL 1.1, ~38KB across two subsets |
| Body | System stack — `system-ui, -apple-system, 'Segoe UI', Roboto…` |
| Accent | **Fredoka** (`--font-bubbly`), self-hosted, SIL OFL 1.1, ~16KB |

The display face is used for every heading — headlines, section headings and category titles. Body, prices and item numbers stay on the system stack: no CDN, and the ornamented face never reaches the text people scan when they are ordering. That split is what makes a heavy slab safe at this spread.

Scale is fluid: `--font-size-display` `clamp(2.75rem, 6vw + 1rem, 6rem)` · `--font-size-hero` `clamp(2.5rem, 3.2vw + 1rem, 4.25rem)` · `3xl` `clamp(2rem, 2vw + 1.5rem, 3rem)` · then `2xl`, `xl`, `lg`, `base`, `sm`, `xs`.

`--font-size-hero` exists because the hero headline must fit a constrained column without breaking mid-word. Headings never use `overflow-wrap: break-word` — a display headline split as "Mexica / n" is worse than any overflow.

**The Third-Face Rule.** Fredoka earns its 16KB on exactly one control: the ChowBus lead button. A rounded face reads as friendly where the site asks for the order, and appears nowhere else — not on the marketplace chips, and never on the restaurant’s own phone number, which belongs to the page’s voice rather than a partner’s. It loads with `font-display: swap` and never sits in the first viewport, so it cannot delay LCP.

---

## Layout and rhythm

Sections alternate real grounds so the page has rhythm rather than one flat off-white:

**Homepage:** mural hero → serape band → dark (food) → raised (reviews) → sand (ordering) → serape band → sky wash (menu preview) → footer.

Spacing is a 4px base scale, `--space-1` through `--space-10`. Radii: `4 / 8 / 16 / 999px`. Content widths: `--content-max 72rem`, `--content-narrow 42rem`, `--rail-height 4rem`. Minimum tap target: `--tap-target 2.75rem` (44px, WCAG 2.5.5).

**The Own-Width Rule.** A component that renders in more than one container asks about its own width, not the window's. The ordering block sits in a 318px rail panel, a 560px footer column and a 1152px section; a viewport media query gave the footer a cramped two-column grid because the *window* was wide. It wraps intrinsically instead.

**The Hit-Area Rule.** Controls meet 44px with real size. A small visible mark meets it with an extended hit area rather than being inflated — the review card's "Read on Google" link and the hero phone number keep their type size and grow only what a thumb can hit. Inline links inside a sentence are left alone; WCAG 2.5.8 exempts them, and padding them out breaks the text they live in.

---

## Motion

Restrained by instruction — "modern, not excessive".

`--duration-fast 120ms` · `--duration-base 240ms` · `--duration-slow 480ms` · `--ease-out cubic-bezier(0.22, 0.61, 0.36, 1)`

`prefers-reduced-motion` collapses every duration to 1ms and zeroes `--reveal-distance` and `--reveal-scale` **at token level**, so any component built on the tokens inherits the behaviour without repeating the media query.

**Rule learned the hard way:** content hidden by JavaScript must never depend on JavaScript firing later to become visible. The menu preview's scroll reveal applies its hiding class only after the script runs, and carries a 1.5s failsafe — an IntersectionObserver legitimately does not fire on a hidden page.

---

## Components

| Component | Rule |
| --- | --- |
| `Nav` | Sticky at every scroll position. Collapses to logo + hamburger + Order at ≤48rem. Both menus close on Escape, on a tap outside and on following a link, returning focus to the control that opened them. The Order panel anchors to the viewport on phones — anchored to the button it ran past the screen edge and was clipped, not scrollable — and scrolls itself on a short screen. |
| `HoursBadge` | Server-renders the *hours*, then upgrades to live state client-side. A static build must never ship a frozen "Open now". |
| `MuralHero` | **Art-directed.** Desktop gets the landscape mural, copy in a dark left column, scrim clearing by 66%. Phones get a portrait crop framed on the painted sign, under an even veil that never drops below 75% — a clearing gradient was measured first and fell to 2.01:1 where the copy actually sits. Text contrast is measured by compositing real pixels; no automated check can see text on an image. |
| `HeroMosaic` | Seven equal tiles on a **dark** ground. Build-time guard: no photo renders above its native pixels on either axis. |
| `Serape` | Decorative, `aria-hidden`. Rule or band. |
| `MenuItem` | Number as a green chip — "order by number" is how the counter works. Single prices stay inline on mobile; only multi-tier stack. |
| `OrderingLinks` | Grouped by who takes the money, not by container. ChowBus leads as a primary button, the phone number is a typographic element, the three marketplaces are one wrapping row of chips with a brand dot, and walk-in is a footnote rather than something that looks clickable. Equal cards used to claim all four were peers, and orphaned a row wherever the container was narrow. All external links `rel="noopener noreferrer"` with a visually-hidden "opens in a new tab". |
| `Reviews` | Five real Google reviews, verbatim, each linking to its source. Horizontal scroll-snap; the prev/next controls disable at the ends and stay hidden until the script runs — without JavaScript they would be visible and inert, while the strip still scrolls natively and stays keyboard-reachable. It never auto-advances: a carousel that moves on its own steals reading time from anyone slower than its timer. |

---

## Image provenance

Every shipping raster, its source and why it is the size it is.

| File | Source | Native | Notes |
| --- | --- | --- | --- |
| `Logo.png` | Supplied | 225×225 | Rail at 2.25rem, favicon |
| `Spread1/2`, `Burrito`, `Nacho_supreme`, `Tostada_Salad` | Supplied, already compressed by ChowBus | 225×225 – 750×600 | Food strip, capped at 168px so none upscales. **WebP tried and rejected — 11% larger** on these already-compressed sources. |
| `grill-900/1400/2000` | `source-assets/GrilledMeats-original.jpg`, 4032×3024 phone original | up to 2000×1500 | Food strip. Chicken and steak on the flat-top. |
| `Spread3-450/900` | `source-assets/Spread3-original.png`, an iOS screenshot | 900×721 | Food strip. The screenshot chrome (status bar, toolbar) was detected and cropped off automatically. Confirmed by the user as the restaurant's own photograph. |
| `catering1–3 -450/700/1100` | `source-assets/catering{n}-original.jpg`, 3024×4032 phone originals | up to 1100×1467 | Catering trays. Converted from HEIC. |
| `OUTSIDE.jpg` | Supplied | 348×348 | Storefront. Too low-res for high-DPI; documented exception, expires 2026-12-01. |
| `mural-1200/1800/2400 .jpg/.webp` | `source-assets/MURAL.JPG`, 5712×4284 phone original | up to 2400×1072 | Cropped to the painted area. WebP saves 49% — it comes from an uncompressed original. |
| `menu.pdf` | `source-assets/menu-original.pdf`, 7.9MB scan | 2 pages | Rebuilt at JPEG q78 → 832KB. Legibility verified on a rendered crop, not assumed. |

---

## Content rules that shape the design

From `PRODUCT.md`, enforced by `npm run check:content`:

- **Never fabricate.** No invented items, prices, reviews, press or history. The About page's origin story is deliberately empty and says so.
- **Unsupplied content reads as provisional** — amber pill, plain language about what is missing.
- **Item numbers are identity**, not fine print.
- **Ordering is always external.** The contact form states outright that it does not place an order.
- **Seasonal is not sold-out.**

---

## Known gaps

1. ~~**Menu prices unverified.**~~ **Closed 2026-09-02.** All prices were cross-checked against a second, independent transcription of the printed menu and matched exactly — both quesadilla columns and every side-order tier included. That cross-check also caught a fabrication of mine: six drinks and desserts had been marked vegetarian by inference rather than transcription. The site marks exactly the 25 items the menu asterisks, enforced by `check:content`.
2. **The hours pill does not know about holidays.** It will read "Open now" on Thanksgiving. The caveat lives in the footer, five screens from the claim. The fix is closure dates the site does not have, so this stays a stated limit rather than a guess.
3. **Three menu sections have no icon** — Quesadillas, Fajitas by the Pound, Side Orders. They render without one rather than falling back to a different icon family; mixing flat colour emoji into a set of black line art looks like a mistake, not a gap.
4. **Eight menu sections have no photograph.** The four that do float beside the heading and the text reflows without one, so a missing photo reads as deliberate.
5. **Storefront photo too low-res** — 348×348, soft on a high-DPI phone, and the reason `/location` sits at best-practices 96. One phone snapshot closes it. Expires 2026-12-01.
6. **Older food photography is small** — 750×600 at best, which is why the strip sits on dark at 168px tiles. The newer photos (grill, Spread3, catering trays) are full-resolution phone originals and have no such limit.
7. **No origin story.** About stays visibly incomplete until someone tells it — the section was removed rather than shipped announcing its own emptiness.
8. **Homepage performance floor is 97 with two points of tolerance.** Deliberate: the next real regression fails the build. It has already caught two this month — the reviews strip, and a hero that preloaded the wrong crop.
9. **No dark mode.** The site is light-only and nothing records that as a decision. It may well be the right one for a takeout counter; it is simply not written down anywhere but here.
