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
- FIRST VIEWPORT: Sticky top bar (logo · Menu · Location · Order▾) over a full-bleed real photo, headline + one-line positioning, live open/closed status pill, primary "Order Now ▾" + secondary "View Menu" in the lower third.
- FORM: Order-rail hero. Dealt lead (index 3) of 7 grounded structural candidates, seed key b4e446bb, recorded via concept-seed.mjs --kind assigned. Kept from declined challengers: always-visible open/closed status pill; confidently oversized category headings in the below-fold menu-preview section.
- FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

Build path: code-led (no image generation tool available in this environment — no comp exists; ambition lives in this contract and is audited in behavior at finish review).

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
