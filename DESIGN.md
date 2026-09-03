# Design

The design system as **shipped**, not as intended. Every value here is taken from the code that runs; every contrast ratio was measured, not estimated.

Companion documents: `CONSTRAINTS.md` (the enforced bar), `PRODUCT.md` (product truth), `.impeccable/surfaces/homepage.md` (the direction contract this was built against), `DECISIONS.md` (why, and what was chosen against).

---

## Finish review — verdict

Audited 2026-09-02 against the direction contract, by behaviour rather than by intention, since no comp exists (the build is code-led).

**Verdict: ships.** All eleven contract clauses hold.

| Clause | Holds | Evidence |
| --- | --- | --- |
| THESIS — order rail persists everywhere | Yes | Order button present in all six public pages |
| THESIS — real photography carries the page | Yes | Mural in the first viewport, seven real food photos below |
| STORY — live open/closed state | Yes | Pill computed client-side from real hours |
| STORY — ordering reachable immediately | Yes | Four channels plus phone and walk-in, two taps from anywhere |
| MEMORABLE — oversized category headings | Yes | 48px display face on the menu |
| STATES — nothing reads "sold out" | Yes | Zero occurrences across the built site, enforced by `check:content` |
| STATES — seasonal is its own state | Yes | "Seasonal — back in winter" on the soups |
| STATES — mobile rail collapses | Yes | Logo + hamburger + Order at 375px |
| INTERACTION — reduced motion honoured | Yes | Durations collapse to 1ms at token level |
| INTERACTION — Order expands to all channels | Yes | Plus phone and walk-in note |
| FINISH — rasters carry provenance | Yes | Recorded below and in `menu.json` |

**One tension worth naming.** The thesis says "real food photography carries the page", and the mural now carries the first viewport instead. That was a deliberate, recorded amendment — the food photography tops out at 750×600 and could not hold a hero. The spirit holds: everything on the page is genuinely this restaurant, and nothing is stock. But a future reader should know the literal clause was amended rather than met.

**Material fixes outstanding:** none blocking. Two documented exceptions carry expiry dates (`CONSTRAINTS.md`), both requiring better source photography rather than code changes.

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
| Display | **Archivo Black**, self-hosted, SIL OFL 1.1, ~16KB across two subsets |
| Body | System stack — `system-ui, -apple-system, 'Segoe UI', Roboto…` |

The display face is used only for headlines, section headings and category titles. Body stays on the system stack: one font file, no CDN, and the page reads restrained rather than shouty.

Scale is fluid: `--font-size-display` `clamp(2.75rem, 6vw + 1rem, 6rem)` · `--font-size-hero` `clamp(2.5rem, 3.2vw + 1rem, 4.25rem)` · `3xl` `clamp(2rem, 2vw + 1.5rem, 3rem)` · then `2xl`, `xl`, `lg`, `base`, `sm`, `xs`.

`--font-size-hero` exists because the hero headline must fit a constrained column without breaking mid-word. Headings never use `overflow-wrap: break-word` — a display headline split as "Mexica / n" is worse than any overflow.

---

## Layout and rhythm

Sections alternate real grounds so the page has rhythm rather than one flat off-white:

**Homepage:** mural hero → serape band → dark (food) → sand (ordering) → serape band → sky wash (menu preview) → footer.

Spacing is a 4px base scale, `--space-1` through `--space-10`. Radii: `4 / 8 / 16 / 999px`. Content widths: `--content-max 72rem`, `--content-narrow 42rem`, `--rail-height 4rem`.

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
| `Nav` | Sticky at every scroll position. Collapses to logo + hamburger + Order at ≤48rem. Escape closes the Order menu and returns focus to the button. |
| `HoursBadge` | Server-renders the *hours*, then upgrades to live state client-side. A static build must never ship a frozen "Open now". |
| `MuralHero` | Copy in a dark left column; scrim clears by 66% so the painting shows. Text contrast measured by compositing real pixels. |
| `HeroMosaic` | Seven equal tiles on a **dark** ground. Build-time guard: no photo renders above its native pixels on either axis. |
| `Serape` | Decorative, `aria-hidden`. Rule or band. |
| `MenuItem` | Number as a green chip — "order by number" is how the counter works. Single prices stay inline on mobile; only multi-tier stack. |
| `OrderingLinks` | ChowBus marked primary — it is the restaurant's own channel. All external links `rel="noopener noreferrer"` with a visually-hidden "opens in a new tab". |

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

1. **Menu prices partly verified.** All 14 flagged items were confirmed with the user on 2026-09-02: item 34 is "Tex-Mex Chili", item 49's $2.50 is the 8 oz price, and items 50–61 are single prices whose sizes vary and are deliberately unstated. **Still outstanding: whether the remaining 65 prices are current. Blocks launch.**
2. **Storefront photo too low-res** — one phone snapshot closes it. The user will retake it in better weather. Expires 2026-12-01.
3. **Older food photography is small** — 750×600 at best, which is why the strip sits on dark at 168px tiles. The newer photos (grill, Spread3, catering trays) are full-resolution phone originals and have no such limit.
4. **No origin story** — About stays visibly incomplete until someone tells it.
5. **Homepage performance at 98** with no headroom — deliberate, so the next regression fails.
