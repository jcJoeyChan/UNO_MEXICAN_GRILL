# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (static site generator) — delegated: user asked for a recommendation. Chosen because this is a content-driven marketing site (menu, hours, location) with no need for a heavy app framework: Astro ships minimal JS by default (good fit for "modern but not excessive" motion), supports component reuse for repeated sections (menu items, hours blocks), handles menu/content updates cleanly via content collections, and deploys simply to any static host.

## Users

- **Hungry local diner** — deciding where to eat or order from nearby; checks menu, hours, and location before visiting, calling, or ordering.
- **Returning customer** — already knows the restaurant; wants to quickly reorder, find hours, or get directions.

## Product Purpose

Public marketing/informational website for UNO Mexican Grill, a real casual Mexican restaurant offering takeout and dine-in (not a fine-dining/sit-down restaurant). The site exists to help diners decide to order or visit by presenting the menu, hours, location, and available ordering channels clearly. Success is measured by driving orders (call-in, walk-in, or routed to third-party ordering) and visits.

## Positioning

Casual, approachable Mexican takeout with a dine-in option — explicitly not an upscale or sit-down dining experience. Tone and content should stay grounded in that casual register.

## Operating Context

Ordering happens across multiple external channels, not on this site directly:

- ChowBus POS (online ordering for pickup) — https://pos.chowbus.com/online-ordering/store/UNO-Mexican-Grill/15192
- UberEats — https://www.ubereats.com/store/uno-mexican-grill/iiEbxQepXvSSxOIxUKzY2Q
- DoorDash — https://www.doordash.com/store/uno-mexican-grill-glen-oaks-29086681/37519563/
- Grubhub — https://www.grubhub.com/restaurant/uno-mexican-grill-25631-union-tpke-queens/8361416
- Phone call-in for pickup — (718) 470-2050
- Walk-in

The site's job is to route customers to the right channel clearly, not to replicate a checkout experience.

## Capabilities and Constraints

- No native online ordering/payment backend is needed on this site. The site links out to the four ordering channels above (all four links confirmed).
- Real assets confirmed: full menu with prices (sourced from the ChowBus store page), logo, five real food photos, and one storefront/exterior photo (all in `public/images/`: Logo.png, Spread1.jpg, Spread2.jpg, Burrito.jpg, Nacho_supreme.jpg, Tostada_Salad.jpg, OUTSIDE.jpg), address (256-31 Union Tpke, Glen Oaks, NY 11004), phone, and daily hours (11 AM–9:30 PM, with a note that holiday hours may differ). Do not fabricate menu items, prices, or photos beyond what's confirmed here.
- Seasonal availability is real, not stock-out: the seasonal soup is offered **during winter only** (user-confirmed). On the ChowBus source page it appears as "sold out" when out of season, which is a POS artifact, not the truth. The site must present it as seasonal — e.g. "Seasonal — back in winter" — and never as sold out, which would wrongly imply the kitchen ran out. Any menu rendering needs a `seasonal` item state distinct from an out-of-stock state.
- Identity is casual takeout-with-dine-in — avoid fine-dining visual or verbal register; the real food photography (paper trays, foil containers, wood table) is itself evidence of this register and should not be styled toward upscale gloss.

## Brand Commitments

- Name: UNO Mexican Grill (confirmed).
- Logo (confirmed, `public/images/Logo.png`): kelly-green circular badge, bold red ring typography, red taco line-art on white center.
- Visual direction constraint (user-stated, carried forward for later DESIGN.md work): modern look with tasteful, non-excessive animation.
- Voice: casual, not yet otherwise specified.

## Evidence on Hand

Confirmed real assets: logo, five food photos, full menu with prices, address, phone, hours, and all four ordering-channel links (see Operating Context). No testimonials, reviews, press mentions, or benchmarks exist — do not fabricate them.

## Product Principles

1. Make it effortless to decide where and how to order — menu, hours, location, and ordering channels visible fast.
2. Reflect the casual takeout/dine-in identity honestly — approachable, not upscale.
3. Ordering channels are external (ChowBus, UberEats, DoorDash, Grubhub, phone, walk-in) — the site's job is to route clearly, not to build a checkout.
4. Keep real content authoritative — never invent menu items, prices, reviews, or photos; placeholders must read as clearly provisional until real assets land.

## Accessibility & Inclusion

No product-specific accessibility requirement has been established yet.
