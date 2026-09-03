---
version: 1
slug: "homepage"
primary_target: "homepage"
related_targets: []
---

## Scope and visitor mode

Persuade. Homepage + shared header/footer shell (reused by Menu, Location, Contact, About, Catering).

## Audience, job, action, proof, constraints

- Hungry local diner deciding whether to eat/order now; returning customer wanting to reorder or find hours/directions fast.
- Primary action: reach an ordering channel (ChowBus, UberEats, DoorDash, Grubhub) or phone/walk-in. Secondary: browse menu.
- Real proof: real logo, real food photography (paper trays/foil containers/wood table — genuinely casual), full real menu with prices, confirmed address/hours/phone. All in PRODUCT.md.
- Constraint: no in-site checkout, ever — every order action routes externally. Casual takeout register, not upscale.

## Direction contract

- THESIS: Real food photography carries the page; a persistent order/menu bar keeps "order now" one tap away at all times — refuses the generic template pattern of a big headline over decorative stock hero.
- OWN-WORLD: Fixed to the real logo's green/red/white identity + the real food photography's wood-table/paper-tray/foil-container material world. No upscale gloss. Green/red reserved for brand and state signaling (open/closed pill, active nav, primary CTA); neutral tones drawn from the photography itself.
- STORY: Land → instantly recognize real food (not stock) → see "open now, closes 9:30pm" → reach an order channel or the menu within one interaction.
- FIRST VIEWPORT (amended twice; current): Sticky top bar (logo · Menu · Location · Order▾) over the **full-bleed dining-room mural**, with the copy in a dark left column — live open/closed pill, headline, one-line positioning, primary "Order Now" + secondary "View Menu". The scrim clears completely by 66% so the right third of the painting, including the hand-painted UNO MEXICAN GRILL sign, is fully visible. The real food photography moves to a dark strip immediately below.
- FORM: Order-rail hero, **amended 2026-09-02: photo mosaic instead of a single full-bleed photograph**. Dealt lead (index 3) of 7 grounded structural candidates, seed key b4e446bb, recorded via concept-seed.mjs --kind assigned. Kept from declined challengers: always-visible open/closed status pill; confidently oversized category headings in the below-fold menu-preview section.
- FORM AMENDMENT 2 (2026-09-02, why): the mosaic was honest about resolution but read as a grid of thumbnails, and the user was not satisfied with how the site looked. Six 168px tiles cannot carry a homepage. The mural — 5277x2356 after cropping — is the only image that can, it is hand-painted, and it has the restaurant's name in it. Food still carries the page, one section lower, on a dark ground where small photographs read as a gallery rather than clip art. Sections now alternate real grounds sampled from the mural (dark, sand, sky) instead of one flat off-white.
- FORM AMENDMENT 1 (why): the original FIRST VIEWPORT called for one full-bleed real photograph. Measured, the source photography cannot carry it — largest is Spread2.jpg at 750x600, most are 225x225. A full-bleed hero needs roughly 2000px and would upscale to visible softness, which reads as a cheap site and actively undercuts the thesis that this is real food rather than stock. The mosaic renders every photo at or below its native size, so the photography stays sharp and the thesis holds. This borrows from candidate 4, the photo-grid taqueria wall, which was dealt but not chosen — the constraint has since made it the stronger option. The thesis, own-world, story and memorable moment are unchanged.
- FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

Build path: code-led (no image generation tool available in this environment — no comp exists; ambition lives in this contract and is audited in behavior at finish review).

## Visual language (added 2026-09-02)

- Display type: Alfa Slab One, self-hosted, every heading. Body, prices and item numbers stay on the system stack — the split that keeps a heavy slab legible.
- Ornament: the serape stripe sampled from the printed menu's woven bands. A rule between sections, never a background for text — repeating it above all twelve menu categories would turn a signature into wallpaper.
- Place: the mural is the hero backdrop. Copy sits in a dark left column; text contrast over the painting is measured by compositing the real pixels with the scrim, because no automated audit checks text over an image.
- Grounds: sections alternate — mural, dark (food), sand (ordering), sky wash (menu preview). All sampled from the mural.
- Item numbers are green chips, not grey fine print.

## Memorable moment

Live open/closed status pill computed from real hours, always visible; menu-preview cards with confidently oversized category headings.

## States and ranges

- Open/closed pill must handle "closes at 9:30pm" and a holiday-hours-may-differ note.
- Menu preview (curated subset, not the full 15+ category catalog) must handle "+" variable pricing and **seasonal items** (the seasonal soup is winter-only). Seasonal is its own state, visually distinct from sold-out: "Seasonal — back in winter", never "sold out". A true stock-out state may also be needed later; the two must not share styling.
- Mobile: sticky bar collapses to logo + hamburger + Order button.

## Interaction and layout

- Hero photo: subtle entrance (fade/soft-scale), no autoplay video.
- Menu-preview cards: scroll-reveal with light stagger.
- Order button expands to the 4 channels + phone/walk-in note.
- All motion respects `prefers-reduced-motion`; stays restrained per user's "modern, not excessive" direction.

## Unresolved decisions

- About and Catering page content (story copy, catering offerings/pricing, dedicated photos) not yet supplied — build with clearly-marked placeholders until real content arrives.
- Accessibility target is a good-practice WCAG AA baseline, not an enforced gate (no CONSTRAINTS.md yet).
