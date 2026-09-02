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

- ChowBus POS (online ordering for pickup)
- UberEats, DoorDash, Grubhub (third-party delivery)
- Phone call-in for pickup
- Walk-in

The site's job is to route customers to the right channel clearly, not to replicate a checkout experience.

## Capabilities and Constraints

- No native online ordering/payment backend is needed on this site. The site should link out to the ChowBus POS ordering page and the third-party delivery apps (UberEats, DoorDash, Grubhub) once those links are provided.
- Real assets — menu items/prices, food photos, logo, address, and hours — are partially available; some are confirmed, some are still TBD. Do not fabricate real menu items, prices, or photos as if factual; use clearly-provisional placeholders until the real content is supplied.
- Identity is casual takeout-with-dine-in — avoid fine-dining visual or verbal register.

## Brand Commitments

- Name: UNO Mexican Grill (confirmed).
- Visual direction constraint (user-stated, carried forward for later DESIGN.md work): modern look with tasteful, non-excessive animation.
- Logo, color palette, and voice: not yet confirmed.

## Evidence on Hand

Some real assets (menu items, photos, logo, address/hours) exist but have not yet been supplied — treated as TBD until provided by the user. Do not fabricate testimonials, reviews, press mentions, or benchmarks.

## Product Principles

1. Make it effortless to decide where and how to order — menu, hours, location, and ordering channels visible fast.
2. Reflect the casual takeout/dine-in identity honestly — approachable, not upscale.
3. Ordering channels are external (ChowBus, UberEats, DoorDash, Grubhub, phone, walk-in) — the site's job is to route clearly, not to build a checkout.
4. Keep real content authoritative — never invent menu items, prices, reviews, or photos; placeholders must read as clearly provisional until real assets land.

## Accessibility & Inclusion

No product-specific accessibility requirement has been established yet.
