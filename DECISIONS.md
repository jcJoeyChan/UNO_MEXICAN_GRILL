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

## Visual direction: A+C hybrid, mural, and a real typeface (2026-09-02)

The built pages were correct and legible but read as plain — the user's word, and a fair one. Three causes, diagnosed rather than guessed: the type was a system font stack (the same face as every OS dialog), the palette was ~95% warm neutral because green and red were reserved for brand and state, and there was no ornament of any kind.

Three directions were mocked up on identical real content — a throwaway `/directions` page, since describing typography is much less useful than showing it. **A — Counter board** (Archivo Black, serape band, dark menu section, amber number discs), **B — Warm print** (Fraunces serif, paper tones), **C — Ornament only** (no new typeface, stripe and chips alone).

**Chosen: a hybrid of A and C**, at the user's direction. Display type and ornament from A; C's restraint everywhere else.

B was rejected on two grounds. Its serif drifts toward the upscale register `PRODUCT.md` explicitly rules out, and the design hook independently flagged both of its faces — Fraunces and Inter — as overused, the exact defaults that make AI-built sites look alike. Archivo Black was not flagged.

### What changed

| Element | Decision |
|---|---|
| Display type | **Archivo Black**, self-hosted (~16KB, two subsets), SIL OFL 1.1. Headlines and category titles only. |
| Body type | Unchanged system stack. One font file, no CDN, and the page stays restrained rather than shouty. |
| Ornament | The **serape stripe** from the printed menu's woven bands — sage `#4e8a6f`, red `#d82f40`, sky `#80c3d7`, amber `#e9b665`, sampled from the scan. |
| Place | A full-bleed **mural band**, from the hand-painted dining-room mural the user supplied. |
| Item numbers | Green chips rather than grey fine print — "please order by number" is how the counter works, so it should look like a feature. |

### The mural changes what is possible

`MURAL.JPG` is 5712×4284 — a real 25-megapixel photograph, against 750×600 for the largest food photo. It is the only image that can go full-bleed.

It is deliberately **not** the hero. The direction contract's thesis is that real *food* photography carries the page; the mural carries *place*. Making it the hero would have changed the thesis, not just the form. The master lives in `source-assets/` and is not shipped; three derivatives (1200/1800/2400px, 102–318KB) are, served via `srcset`.

Copy over the mural sits on a scrim. The painting is busy and light in places, and text laid directly on it would fail contrast somewhere along its width whatever colour it used.

### Amendment: the colour reserve is loosened

`PRODUCT.md` and the earlier decisions reserved green and red for brand identity and state signalling, with neutrals carrying the interface. That discipline is exactly why the pages read restrained — and it is now **partially relaxed, deliberately**:

- The **serape stripe** introduces four more colours, but only as a decorative rule. It never carries text and never signals state.
- The **mural palette** (sky, adobe, terracotta, sage, sand) is available for grounds and accents.

The core rule survives: green and red still mean brand and state in the *interface*. Ornament is now allowed its own colours. Every new pair that carries text was measured — white on the mural's frame green fails at 3.26:1 and white on adobe fails at 2.93:1, so both stay identity-only with deepened variants (`--mural-sage-deep`, `--mural-terracotta`) for text.

### Dependency

Adding a typeface is a dependency, which `SPEC.md` requires approval for. The user chose a direction that entails one. It is self-hosted rather than loaded from Google: the site works offline, no visitor data reaches a third party, and there is no extra DNS hop. Google Fonts was used only on the throwaway comparison page, which has been deleted.

---

## Second visual pass: bolder, and the mural becomes the hero (2026-09-02)

The A+C hybrid was still not satisfying. The user's read: still too quiet overall, the hero mosaic was weak, and there was too much beige. All three were fair — I had hedged toward C's restraint after being told the site looked plain.

**What changed**

| Before | After |
|---|---|
| Hero: 6 food tiles at 168px on beige | Hero: full-bleed mural, copy in a dark left column |
| Mural: a band below the ordering section | Mural: the first viewport |
| Food: the hero | Food: a dark strip immediately below, six photos in one row |
| Every section on one off-white | Sections alternate mural / dark / sand / sky wash |

Small photographs read as a gallery on a dark ground and as clip art on beige. That single change did more for the food photography than any amount of layout work on the beige version.

**Text over a painting is the real risk, and no audit catches it.** Lighthouse scores accessibility 100 while text sits illegibly over an image, because it does not evaluate that case. So contrast here is measured by drawing the mural to a canvas, compositing it with the scrim gradient at each pixel, and taking the worst case under each text block:

| Attempt | Headline | Verdict |
|---|---|---|
| Gradual gradient, falloff at 38% | **2.16:1** | Fails (large text needs 3:1) |
| Plateau extended to 52% | 5.73:1 | Passes, but the mural was invisible — the scrim only lightened at the extreme right edge |
| Steep falloff, copy in a left column | **12.72:1** | Passes, and the right third of the painting is fully clear |

The third is what shipped. Body copy measures 9.49:1. The meta line measured 4.86:1 on `--warm-400` — passing, but with almost no margin if the crop ever changes, so it moved to `--mural-sand`.

The lesson: fighting a gradient was the wrong approach. Constraining the copy to a column and letting the scrim clear completely gives both legibility and the painting.

**Performance cost, paid down not written off.** The full-bleed hero made the mural the LCP element and the homepage dropped 100 → 97, below the floor. Rather than re-baseline, the image was converted to WebP (49% fewer bytes) and the LCP preloaded, recovering to 98 — inside the ±2 tolerance. The floor stays at 100 with no headroom on the homepage, which is deliberate: the next regression should fail.

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

---

## The check scripts were POSIX-only (2026-09-02)

Setting the project up on the Windows desktop, `npm run check:task` and `npm run check:audit` both failed. Not on content — on the scripts themselves. Three bugs of the same family:

- All three scripts derived the project root with `new URL('..', import.meta.url).pathname`, which on Windows yields `/C:/Users/.../CLAUDE%20PROJECTS/...` — a leading slash and a percent-encoded space. `check:content` crashed opening `C:\C:\...`. Now `fileURLToPath`, which is the portable form and behaves identically on macOS.
- `check:tokens` matched its exempt list against `path.relative()` output, which is `src\styles	okens.css` on Windows and never matched the `src/styles/tokens.css` keys — so it flagged `tokens.css` for defining the very tokens it exists to define. Separators are normalised before the lookup.
- `audit.mjs` spawned `npm`/`npx` directly. On Windows those are `.cmd` shims that need a shell to resolve via PATHEXT, and Node >= 20 refuses to spawn a `.cmd` without one. Fixed with a platform-conditional `shell`.

These are portability fixes, not a weakened bar: no threshold, exemption or assertion changed. The macOS behaviour is unaffected — `fileURLToPath` is what that code should always have used.
---

## Display face: Alfa Slab One, applied to every heading (2026-09-02)

The user asked for a more Mexican display face, with three reference images: an ornate Victorian/Western chromatic "TEQUILA" logotype, the "Brellos" fiesta typeface, and the folk-art "Mexican Vibes".

**All three references are commercial fonts and none was used.** `DECISIONS.md` already commits this site to self-hosted SIL OFL faces — works offline, no visitor data to a third party, no extra DNS hop — and buying a licence was not on the table. Four open faces were offered as matches for the register: **Rye** (Victorian wood type, structurally closest to the TEQUILA reference), **Chicle** (Latin vernacular display, closest to Brellos/Mexican Vibes), **Bungee Shade** (true chromatic layer fonts, the closest thing to the layered orange-on-blue effect), and **Alfa Slab One** (circus-poster slab — the most legible, the least ornate).

**Chosen: Alfa Slab One, at every heading**, at the user's direction. It is the least like the references and the most legible of the four, and that pairing is deliberate rather than a compromise: the spread is what makes it safe.

### The spread was the real decision, not the face

The references are all logotypes — one word, huge, hand-ornamented. `--font-display` sets 18 sites across 8 pages, including all twelve menu category titles. The failure mode is the one this project already named for the serape stripe: repeated often enough, a signature becomes wallpaper. An ornate face fails that way harder than a plain one.

Three spreads were offered (signature only / signature + categories / everywhere). The user chose everywhere. With Rye or Bungee that would have been a legibility problem; with Alfa Slab One it is not, because **the body stack is untouched**. Item names, prices, item numbers and descriptions all stay on `--font-sans`. The decorative face never touches the text a customer scans while ordering.

### Verified, not assumed

- All 12 category titles and the long ones (`Fajitas by the Pound`, `Mexican Rice Platters`) measured for overflow at 800px and 375px — none overflows, no horizontal document scroll. Alfa Slab One is materially wider than Archivo Black, so this was a real risk, not a formality.
- `document.fonts.check` confirms the face actually loads rather than silently falling back to the system stack.
- Lighthouse floors all hold: a11y **100** on all six pages, perf 96–100.

### Cost

~38KB across two subsets, against Archivo Black's ~16KB. **Archivo Black was deleted** — both `.woff2` files, the `@font-face` rules and the `<link rel="preload">` in `BaseLayout.astro`, which pointed at a file nothing would have used. Net +22KB, and the preload now points at the face actually in use.
---

## /news: a Markdown-backed post section (2026-09-02)

The user asked for a page to post promotions, deals, new items and "about us". Built as **/news** with tags rather than /blog: this is a restaurant announcing specials, not a journal, and `/about` already exists as a standing page so it was left alone.

**Authoring is Markdown files in `src/content/posts/`**, at the user's direction, with a CMS explicitly deferred. The tradeoff was put plainly first: a Markdown blog needs git to post, so if counter staff ever need to post from a phone this becomes the wrong answer. A git-based CMS reads these same files, so that switch costs no rework.

`_template.md` sits in the directory as an authoring reference. The glob pattern is `**/[^_]*.md`, so underscore files never become posts.

### Expired offers are the real problem a deals page has

"Half off tacos this weekend" still reading as current in March misinforms customers exactly the way an invented menu item would. Three layers, so it cannot happen by neglect:

1. **Schema** — `promotion` and `deal` posts must set `expires`. A time-limited offer with no end date is rejected at build time.
2. **Pages** — the index lists only unexpired, non-draft posts. Expired posts keep their permalink (shared links should not 404) and their page carries a plain "This offer ended on ..." banner.
3. **`check:content`** — fails if an expired post's title reaches the built index, and if a deal has no `expires`. Both were verified by deliberately breaking them, not assumed.

### Expiry is a calendar day in Glen Oaks, not an instant

The first implementation used `setHours()` on a date parsed from `expires`. Date-only values parse as **UTC midnight** while `setHours` is **local**, so an offer expiring on the 30th died several hours early — during business hours on its own last day. The tests caught it.

It now compares calendar days in `RESTAURANT_TIMEZONE`, the same principle `hours.ts` sets out: the restaurant's clock is the only clock that matters. A test pins the case where UTC has rolled over to the next day while Glen Oaks is still open and serving.

### No posts shipped

`PRODUCT.md` forbids invented content, so the section ships empty with an honest empty state pointing at the menu and the phone number, rather than a fabricated special. The rendering paths were proven with temporary posts that were deleted before commit.

`/news` was added to `scripts/audit.mjs` and given its own floor in `.constraints-baseline.json` (100/100/100/100). Worth noting: the audit treats a **missing** baseline entry as no floor at all, so a new page is measured but unenforced until it is added by hand. `--update` was deliberately not used, since it rewrites every floor with today's scores and could lower one silently.

---

## Menu corrections from the restaurant (2026-09-03)

Five corrections, all recorded in `_provenance.verifiedWithRestaurant.confirmed`, which is how this project keeps `menu.json` honest:

| Was | Now |
|---|---|
| Category "Taco" | "Tacos" |
| "Corn tortillas — soft or hard shell" | "Soft: flour or corn tortillas. Hard shell: corn only." |
| Items 5, 14, 23 had no description | "Broccoli, carrot & mushroom" |
| "Supreme adds ..." buried in the category note | explicit legend: **Plain** = cheese only, **Supreme** = adds lettuce, tomato, guacamole & sour cream |
| "Shrimp ... may have mushrooms" | "Shrimp items are cooked w. onions & cilantro." |

The old shrimp note asserted mushrooms **everywhere** shrimp appeared, which is wrong for Quesadillas and Burritos. Mushrooms are now stated only where they are true; the Rice Platter and Tostada Salad items already name them individually.

### One conflict was surfaced, not resolved silently

Item 44 (Shrimp, Fajitas by the Pound) is transcribed from the printed menu as "Cooked w. mushroom & cilantro", which contradicts "shrimp only comes with mushroom in Rice Platters and Tostada Salads". The user confirmed the printed menu is right and the rule was about Quesadillas and Burritos, so **item 44 is unchanged**.

Guessing either way would have put a wrong ingredient in front of someone with an allergy. That is the whole reason `PRODUCT.md` forbids inferring menu facts.

### Plain/Supreme is data, not markup

The columns are headed "Plain" and "Supreme", which say nothing on their own — two prices with no explanation is the commonest way a menu confuses people at the counter. Rather than bolding words inside a prose string, the meanings became a structured `columnLegend` the schema validates, so emphasis is the renderer's job and the content stays plain text.

---

## Ordering partner cards carry their own brand colour (2026-09-03)

The user first asked for the four partners' **logos** wherever they are cited, then for the brand names **tinted**, and finally for the card ground itself to be the brand colour. Only the last was built.

**No logos.** They are third-party trademarks and no official asset was on hand. Drawing approximations would have been fabricated brand content, forbidden by `PRODUCT.md` for the same reason invented menu items are — it reaches real customers, and it goes stale the moment a platform rebrands. Real assets from each merchant portal can be wired in whenever the restaurant pulls them.

### Every published brand colour fails AA as text

Measured on `--surface`, not assumed:

| Partner | Published | As text | As a ground, with `--text` on top |
|---|---|---|---|
| ChowBus | `#ff6a13` | 2.68:1 fail | **6.11:1 pass** |
| Uber Eats | `#06c167` | 2.23:1 fail | **7.37:1 pass** |
| DoorDash | `#ff3008` | 3.46:1 fail | **4.74:1 pass** |
| Grubhub | `#f63440` | 3.58:1 fail | **4.58:1 pass** |

The channel name is bold 16px — not "large text", so 4.5:1 is the bar either way.

This is why the final answer is better than the two before it. **Tinting the text** required darkening each hue until it carried type, which made DoorDash and Grubhub converge into near-identical reds that also sat close to the site's own `--brand-red` — three of four cards read as "warm red-orange", and the colour bought almost no differentiation. **Using the colour as a ground** needs no darkening at all: the published values are used unmodified, which is how this file already permits brand colour to be used — as a large fill, never as text.

White would not have worked as the foreground: 2.87 / 2.38 / 3.70 / 3.83, all failing, and chasing it would have forced the backgrounds darker and away from the real brand colour — the opposite of the point.

`--text-muted` is measured against `--surface` only and drops below AA on a saturated ground, so partner cards use full-strength ink for the detail line and take their hierarchy from size instead of lightness.

### Implementation

The colour rides on a `--partner-bg` custom property set inline per channel rather than a `is-${channel.id}` class, so the mapping stays in one typed object and an unknown id falls back to the normal card surface. `OrderingLinks.astro` renders in 8 places — nav dropdown, footer and six pages — so this was one component change, not eight.

### A note on the dev server

Astro's dev server did not pick up style edits on this Windows machine — it served CSS one edit behind, including rules already deleted from source. Verify style changes against `npm run build` plus `npm run preview`, not `npm run dev`.

---

## Menu section icons: Twemoji, self-hosted (2026-09-03)

Twelve Twemoji SVGs (~28KB total), CC-BY 4.0, self-hosted alongside the fonts.

**Native emoji were rejected** because they render differently on iPhone, Android, Windows and Mac — the restaurant would not control how its own menu looks. **Custom line icons were rejected** because a recognisable taco or quesadilla at 24px is genuinely hard, and mediocre custom icons look worse than none. There is no taco or burrito glyph in the usual open icon sets (Lucide, Feather), which ruled out the easy route.

Icons are decorative: `alt=""`, because the heading already names the section and announcing it twice is noise for a screen reader. Sized in `em` so they track the display heading without needing their own clamp. **The attribution in the footer is not optional — CC-BY requires it.**

Mapping was chosen against what each section actually contains rather than by name: Side Orders is condiments, so it takes a bowl rather than fries; Nacho is white corn tortilla chips, so it takes corn rather than a second cheese.

`/menu` holds performance 100 with all twelve.

### Two things that cost time

- **`img { display: block }` in `reset.css`** put every icon on its own line above its heading. Any inline icon in this codebase must set `display: inline-block` explicitly.
- **The browser pane lays out at zero width while hidden.** Every element in the subtree then reports `width: 0` from `getBoundingClientRect`, which sent an investigation chasing a CSS bug that did not exist — and also explains a phantom "clipped heading" reported earlier on `/about`. Verify layout from screenshots or from the built CSS, never from in-pane measurement.

---

## Task 15: deploy configuration (2026-09-03)

`netlify.toml` (build command, publish dir, and `NODE_VERSION = 22.12.0` — not optional, since Astro 7 refuses to start below it and Netlify's default is older), immutable cache headers for fingerprinted assets and fonts, `nosniff` and a referrer policy.

A `404.astro` in the normal shell, so someone who mistypes a URL still gets the order rail, the hours pill and the phone number.

**`/tokens` is deleted.** With it went its entry in the `check:tokens` exempt list and exception 5 in `CONSTRAINTS.md`, now closed. An exemption left behind for a file that no longer exists is exactly the rot these files exist to prevent — nothing is exempt from the description rule any more.

### Absolute URLs come from one place

`site` in `astro.config.mjs` is the single source for canonical tags, Open Graph URLs, the sitemap and robots.txt. Moving domains is a one-line change plus a redeploy.

`robots.txt` and `sitemap.xml` are generated endpoints rather than static files in `public/`, so the sitemap URL cannot drift from `site`. **The sitemap is hand-rolled rather than `@astrojs/sitemap`**: `SPEC.md` requires approval before adding a dependency, and for seven routes plus one collection the integration earns nothing thirty lines do not. Routes are derived from the pages directory rather than listed by hand, so a new page cannot be silently omitted — the commonest way a sitemap rots. `/404` and `/contact-thanks` are excluded deliberately.

Open Graph was **entirely absent** before this: sharing any page gave a blank grey box, which matters for a restaurant, since sharing is how people pass it around. Each page now carries canonical, `og:*` and `twitter:*` tags with an absolute image, explicit dimensions (crawlers do not fetch the image to learn them, and a missing size is the usual cause of a thumbnail-sized preview) and alt text. The mural is the default; `/menu` uses the grill and `/catering` its own tray photo.

### Still open before going live

The Netlify site itself, merging to `main`, and a real-device check.

**Domain: `unomexicangrillny.com`.** The first choice, `unomexicangrill.com`, is already registered — parked at Namecheap with email forwarding configured, which suggests an owner who set it up deliberately rather than a squatter, and it may even be the restaurant's own from years ago. Worth asking the owner before assuming it is lost. `unomexicangrillny.com` was confirmed unregistered against the .com registry over RDAP (404, and no DNS), and the NY suffix is honest for a Queens restaurant. It still has to be bought — nothing reserves it until then.
