# Decisions

Decisions and rejected alternatives from the planning sessions that aren't captured in `PRODUCT.md` (product truth), `SPEC.md` (technical spec), or `.impeccable/surfaces/homepage.md` (the homepage direction contract). This is the "why", and what we chose *against*.

---

## Homepage structure: the candidates

Seven grounded structural approaches were generated for the homepage, ranked by resonance. Impeccable's concept-seed roll (seed key `b4e446bb`, scope `surface`, mode `persuade`) dealt three of them to the table — indices 3, 4, 1, with index 3 leading — to break the ranking rut while leaving a real choice.

| # | Candidate | Status |
|---|---|---|
| 1 | **Open-ticket rail** — page reads like a real order ticket/receipt; menu items as line items, ordering channels where the "total/pay" line sits | Dealt, not chosen |
| 2 | **Counter menu board cascade** — categories stacked like an illuminated taqueria menu board, each with a real photo | Not dealt (never presented) |
| 3 | **Order-rail hero** — full-bleed real food photo + persistent order/menu bar | **Dealt (lead) → CHOSEN** |
| 4 | **Photo-grid taqueria wall** — tappable grid of real dish photos by category | Dealt, not chosen |
| 5 | **Split hero (photo \| action)** — half food photography, half sticky order/menu/hours actions | Not dealt (never presented) |
| 6 | **Single-scroll story path** — conventional hero → story → menu teaser → ordering → hours/map | Not dealt (never presented) |
| 7 | **Ticket-order kiosk** — big category tiles, app-like ordering mechanic | Not dealt (never presented) |

**Chosen: Order-rail hero**, recorded via `concept-seed.mjs --kind assigned`. Full contract in `.impeccable/surfaces/homepage.md`.

Note on candidates 2, 5, 6, 7: these were ranked but not dealt by the roll, so they were never put in front of the user — they are unselected, not rejected on their merits. #6 (single-scroll story path) is the category default this project is deliberately steering away from; #7 leaned Operate/app-like, which is the wrong mode for a marketing homepage.

---

## The six catalog challengers — all declined

Impeccable's concept-seed also deals "challengers": external visual/structural systems from its catalog, fused against the grounded candidates and judged on two axes — **audience identification** and **product clarity**. A challenger wins only by beating the grounded direction on *both*. All six lost; two donated a discipline that was folded into the chosen direction ("raises").

| Challenger | Verdict | Why it lost | Donated to the build |
|---|---|---|---|
| **Gravity-rain garden** (surreal dreamscape; rain falls per cloud-color gravity) | Declined | Whimsical/surreal register contradicts a real neighborhood takeout spot; nothing in it makes ordering faster or clearer. Fails both axes. | — |
| **Sewing pattern envelope** (lettered views A/B/C, yardage tables, nested cut lines) | Declined | The nested-variant metaphor is legible but sits in craft-sewing, not food; would read as costume on a taqueria. | **Nested variant display** — "+"-priced items and combo tiers should show as an explicit related-tier system, not a vague "+". |
| **Suminagashi ink basin** (GPU fluid marbling surface) | Declined | Abstract art-piece register plus heavy WebGL cost; works directly against both "modern but not excessive" motion and fast ordering. | — |
| **Drum machine step row** (16 candy-colored step keys under a running chase light) | Declined | Music-hardware identity is foreign to a taqueria; step-sequencer interaction has no analog in ordering food. | **The chase light's "always tells you where *now* is"** → became the always-visible live open/closed status pill. |
| **Elbow panel console** (sci-fi console; pastel pills on pure black, elbow frame as grid) | Declined | Sci-fi identity contradicts the confirmed green/red/white brand; a dark pastel-on-black palette would fight the real food photography. | — |
| **Futurist bolted book** (tilted wood type, percussive page-slams) | Declined | Aggressive typographic shouting conflicts head-on with the user's stated "not excessive" constraint. | **Confident oversized typographic scale** → below-fold menu-category headings get real display weight instead of timid corporate headings. |

A declined challenger is not wasted: the discipline it does better gets transferred into the chosen direction. What transfers is ambition and system discipline, never the challenger's literal look.

---

## Hero form changed: full-bleed photo → photo mosaic (2026-09-02)

The direction contract's FIRST VIEWPORT specified one full-bleed real photograph. Building it revealed the source photography cannot carry that form:

| File | Pixels |
|---|---|
| Spread2.jpg | 750x600 |
| OUTSIDE.jpg | 348x348 |
| Tostada_Salad.jpg | 289x174 |
| Burrito.jpg | 251x201 |
| Spread1.jpg, Nacho_supreme.jpg | 225x225 |

A full-bleed desktop hero needs roughly 2000px wide. Upscaling a 750px image to fill it produces visible softness, and a soft hero on a restaurant site reads as cheap — which attacks the thesis directly, since the whole bet is "this is real food, not stock photography". Shipping a blurry photograph to prove the food is real would have been self-defeating.

**Options considered:**

1. *Get better source files.* Preferred, but the originals may not exist; the user has only what ChowBus resized.
2. *Generate or buy stock imagery.* Rejected outright — PRODUCT.md forbids fabricated content, and stock food photography is precisely what the thesis refuses.
3. *Crop one photo to a wide letterbox band.* Reduces the pixel deficit but not enough, and cropping a 225px image to a banner leaves almost nothing.
4. **Photo mosaic — chosen.** Every photograph renders at or below its native size, so all six stay sharp. Spread2 anchors as the large tile; the rest fill smaller ones.

The mosaic is close to candidate 4, the *photo-grid taqueria wall*, which the concept-seed roll dealt but which was not chosen. The constraint has since made it the stronger option. It also arguably serves the thesis better than the original: six real dishes carry more evidence of a real kitchen than one photograph does.

**Unchanged:** thesis, own-world, story, memorable moment, and the persistent order rail. This is a change of form, not of direction. Recorded in `.impeccable/surfaces/homepage.md` as a FORM AMENDMENT.

**If larger originals ever surface**, revisiting the full-bleed form is legitimate — but the mosaic should be judged on its own merits first rather than assumed inferior.

---

## Technical choices and the alternatives rejected

| Decision | Chosen | Rejected alternatives | Why |
|---|---|---|---|
| Framework | **Astro** (static output) | Plain static HTML/CSS/JS; a heavier framework (Next.js/React) | Content-driven marketing site needs component reuse and easy menu/content updates, but not an app framework. Astro ships minimal JS by default — a good fit for restrained motion. User delegated the choice. |
| Styling | **Plain CSS** via Astro scoped `<style>` + CSS-variable tokens | Tailwind CSS | Small site with no velocity pressure; dependency-free and readable for whoever maintains it later. Tailwind's speed advantage doesn't pay for its markup clutter and config at this scale. |
| Language | **TypeScript** | Plain JavaScript | Built into Astro at zero setup cost; cheap insurance if interactivity grows beyond a nav toggle and scroll reveals. |
| Deploy target | **Netlify** | Vercel, Cloudflare Pages, "decide later" | Astro's static output is portable, so this is low lock-in either way. Netlify is the friendliest default for a restaurant site (forms, redirects, simple free tier). |
| Testing | **Vitest** for pure logic only | Playwright/e2e now | The site is static and content-first; e2e tooling doesn't earn its keep until there's real interactive behavior (e.g. a filterable menu) to break. |
| Lint/format | ESLint (`@typescript-eslint`, `eslint-plugin-astro`) + Prettier (`prettier-plugin-astro`) | — | Standard Astro+TS combo. Chosen by me and disclosed, not separately approved. |
| Spec scope | **One spec for the whole site** | Homepage-first, spec the rest later | All pages share one design system and shell, so splitting the spec would fragment one contract. |
| Quality gates | **`/constraints` deferred** | Writing CONSTRAINTS.md up front | No code, test runner, or CI existed yet — every threshold would have been invented rather than measured. Revisit after scaffolding. |

---

## Process decisions

- **Build path is code-led.** No image-generation tool exists in this environment, so no design comp was produced. Impeccable's default is comp-led; without image generation, code-led is the only path. The ambition instead lives in the direction contract's FIRST VIEWPORT block and named signature interaction, which the finish review audits *in behavior* rather than against an image.
- **Decision channel.** The three dealt structures were presented through the structured question tool with ASCII wireframe previews, rather than by serving Impeccable's local decision-page server. With no image generation there were no comps to display, and the structured tool is the sanctioned lower-richness channel for this round.
- **Surface brief persisted early.** Impeccable's `shape` command normally stops *before* persisting a direction contract. We wrote `.impeccable/surfaces/homepage.md` anyway so the decision would survive the Windows → MacBook machine switch, since a fresh session on another machine can't inherit chat context.
- **Menu data provenance.** The full menu with prices was read from the live ChowBus store page, not supplied by hand; the phone number `(718) 470-2050` came from that same page. **Re-verify against the restaurant before launch** — prices and availability drift. Note the seasonal soup showed as "sold out" on ChowBus; the user has since confirmed it is **winter-only**, so that flag was a seasonal-availability artifact of the POS, not a stock-out. Treat other ChowBus "sold out" flags with the same suspicion — confirm before rendering any item as unavailable.
- **Ordering URLs normalized.** The UberEats/DoorDash/Grubhub links were supplied with Google-search tracking parameters (`rwg_token`, `utm_*`). Those were stripped, keeping only canonical store URLs — the tokens are tied to one search click and don't belong baked into permanent site markup.
- **Placeholder policy.** Anything not yet supplied (About story copy, Catering offerings/pricing, dedicated photos for those pages) is built as *clearly provisional* placeholder content, never presented as factual, and swapped when the user provides real material.

---

## Environment notes

Not project decisions, but they cost time to work out and will matter on a fresh machine:

- Claude Code plugins are **per-machine**, not synced to your account — cached in `~/.claude/plugins/cache/`, registered in `~/.claude/settings.json`. A new machine needs the marketplaces re-added and plugins reinstalled.
- Plugins used here: `impeccable@impeccable` (marketplace `pbakaus/impeccable`) and `agent-skills@addy-agent-skills` (marketplace `addyosmani/agent-skills`).
- On macOS, plugin installs defaulted to SSH GitHub URLs and failed without an SSH key. Fixed with `git config --global url."https://github.com/".insteadOf "git@github.com:"` (plus `ssh-keyscan -t ed25519 github.com >> ~/.ssh/known_hosts` for the host-key prompt).
- The official marketplace (`claude-plugins-official`) is only auto-registered on first *interactive* launch of `claude`, not by `claude plugin ...` subcommands.
