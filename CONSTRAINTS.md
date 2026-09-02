# Constraints

The quality bar for this project. Agents and humans both work to it.

**Never weaken a constraint to make a change pass.** If a check fails, fix the code. If the constraint itself is wrong, change it deliberately — in its own commit, with the reason written down — not as a side effect of shipping something else. Silently lowering a threshold, deleting an assertion, skipping a test, or adding a suppression comment is a bug, not a workaround.

Established 2026-09-02, after Task 4. Numbers are **measured**, not aspirational: they record what this project actually achieved on that date and forbid regression from it.

---

## Floor — always, no exceptions

Every task clears all six before it counts as done.

| Rule                     | Command                | Why                                                                       |
| ------------------------ | ---------------------- | ------------------------------------------------------------------------- |
| Types clean              | `npm run typecheck`    | `astro check`, TypeScript strict. Zero errors, zero warnings, zero hints. |
| Lint clean               | `npm run lint`         | ESLint 10 flat config. Zero errors.                                       |
| Tests pass               | `npm run test`         | Vitest. Currently 54 tests across 3 files.                                |
| Build succeeds           | `npm run build`        | Astro static output.                                                      |
| Content integrity passes | `npm run check:content`| The project's own rules about truthful content — see below.               |
| Design tokens respected  | `npm run check:tokens` | No literal colours or font sizes outside `tokens.css` — see below.        |

Run all six: `npm run check:task` — **currently ~5 seconds**, budget 90 seconds.

---

## Content integrity — enforced

`PRODUCT.md` forbids fabricating menu items, prices, reviews or press mentions, and requires unsupplied content to read as visibly provisional. Those are this project's sharpest rules and no off-the-shelf tool enforces them, so `scripts/check-content.mjs` does.

**Command:** `npm run check:content`

| Rule                                   | Threshold                                  | Why                                                                                                                          |
| -------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Menu shape holds                       | Exactly 12 categories, 79 items            | Transcribed from the printed menu. Items must not appear or vanish silently; a real menu change means updating this number deliberately. |
| Soups stay seasonal                    | `availability: "seasonal"`, `season: "winter"` | The printed menu says "SOUPS (Winter Only)". ChowBus's "sold out" flag was a POS artifact.                                  |
| No page renders "sold out"             | Zero occurrences in `dist/`                | A winter-only soup is not a kitchen that ran out. Getting this wrong misrepresents the restaurant.                            |
| Unverified items stay flagged          | ≥1 item flagged                            | 14 items carry `needsVerification`/`sizeUnclear`. Clearing them requires confirming prices with the restaurant, not deleting the flag. |
| Provenance note survives               | `_provenance.verifyBeforeLaunch` present   | The record of where this data came from and what still needs checking.                                                        |
| Ordering URLs are clean and https      | 4 channels, no `rwg_token`/`utm_*`         | `DECISIONS.md` records these were stripped deliberately — they are tied to one search click.                                  |
| Structural a11y floor                  | `lang`, `<title>`, `<main>`, exactly one `<h1>`, every `<img>` has `alt` | Cheap, zero false positives, catches the regressions that actually happen. |
| External links safe                    | Every `target="_blank"` has `rel="noopener"` | Tabnabbing, and it is free to prevent.                                                                                       |
| Indexed pages have descriptions        | ≥20 chars, `noindex` pages exempt          | The dev-only `/tokens` page is exempt by design; a rule that page had to route around would be a rule nobody respects.        |

---

## Design tokens — enforced

`SPEC.md` requires components to use CSS variables from `tokens.css` with "no inline magic numbers for color/spacing". Nothing checked that, so `scripts/check-design-tokens.mjs` now does. Added before Phase 3, when four pages get built in sequence — a hardcoded colour in one of them is how a design system quietly stops being a system.

**Command:** `npm run check:tokens` (runs inside `check:task`)

| Rule | Threshold | Why |
| --- | --- | --- |
| No literal colours in component styles | Zero hex / `rgb()` / `hsl()` outside `tokens.css` | The palette is sampled from the real logo, photography and mural. A one-off colour is not part of that system. Use `color-mix(in srgb, var(--token) N%, transparent)` when alpha is needed. |
| No absolute font sizes | Zero `px`/`rem`/`pt` on `font-size` without `var()` | The type scale is fluid and deliberate. `em` and `%` are allowed — they are relative, not magic. |

**Exempt, by design:** `src/styles/tokens.css` (defines them), `src/styles/fonts.css` (`@font-face` only), `src/pages/tokens.astro` (dev-only swatch page that must show literal values; removed at Task 15).

**Spacing is deliberately not checked.** Padding and margin have too many legitimate literal values — hairline borders, 1px focus rings, 999px pills, structural heights. A check that cries wolf is one people learn to skip, and that lesson already cost us once when performance was gated on a number measured against the wrong server.

> This check caught a real violation the moment it was written: the hero headline carried an ad-hoc `clamp()` rather than a token. It became `--font-size-hero`. The fix for a flagged value is to add it to the system, not to exempt the file.

---

## Accessibility, performance, best practices, SEO — all enforced

`SPEC.md` commits to a WCAG AA baseline. Lighthouse's accessibility category is axe-core in a real browser, which is why it can measure colour contrast that a DOM shim cannot.

**Command:** `npm run check:audit` (review/CI tier — ~30s, too slow for task end)

| Page        | Performance | Accessibility | Best practices | SEO |
| ----------- | ----------- | ------------- | -------------- | --- |
| `/`         | 97          | 100           | 100            | 100 |
| `/menu`     | 100         | 100           | 100            | 100 |
| `/location` | 100         | 100           | 96 (exception) | 100 |
| `/contact`  | 100         | 100           | 100            | 100 |
| `/about`    | 100         | 100           | 100            | 100 |
| `/catering` | 100         | 100           | 100            | 100 |

Re-recorded 2026-09-02 against a production build, across all six public pages. Tolerance ±2.

> **The homepage floor was lowered from 100 to 97, deliberately.** Two things happened. First, the original 100 was measured when the site had no images at all — it recorded an empty page, not this one. Second, the earlier baseline had gone stale: it held three pages when the site had six, because an `--update` run failed partway and never wrote, so the gate was silently comparing against numbers that predated the hero, the mural and every photograph.
>
> 97 is what the real site scores with a full-bleed hero and real photography, which is the product. Recording that is honest; leaving a floor the site cannot meet would have meant a gate that fails on every run until someone learned to ignore it.
>
> **What would raise it back:** the hero image is the LCP element and the largest single cost. Smaller derivatives, AVIF, or a lighter crop would recover points. Not doing that today is a choice, not an oversight.

**Exceptions are declared in `scripts/audit.mjs`, not absorbed by lowering a number.** A lowered baseline looks like a passing gate; an exception looks like what it is. Each carries a reason and an expiry, and the script **fails once an expiry passes** — an exception nobody revisits is a weakened bar with extra steps.

> **These floors replaced an earlier, wrong set.** The first baseline recorded performance 58–80 and SEO 91, and performance was marked "measured only" on the reasoning that a 22-point swing between identical runs made it too noisy to gate. The reasoning was fine; the data was not. `astro dev` and `astro preview` both serve port 4321, and the audit script reused whatever was already answering — so it had been profiling an **unminified dev server**. Against a real production preview every category returns 100 and does not move. The script now builds and serves its own preview on port 4322 and refuses to audit a server it did not start.
>
> A second trap in the same area: Astro 7 daemonizes its preview server, so killing the spawned npm process leaves the real server running and Astro then refuses to start another. Lifecycle goes through `astro preview stop`.

> Setting this up also found a real bug. At mobile widths the brand text was `display: none` and the logo carries `alt=""`, leaving the home link with no accessible name at all. Lighthouse flagged it as `link-name` and accessibility scored 96. Fixed before baselining — a floor recorded on top of a known defect enshrines the defect.

**Real images land at Task 12 and may genuinely push performance down.** That is the gate working, not a reason to weaken it: optimise the images, or record a deliberate exception below with an owner and an expiry.

---

## Not adopted, and why

Recording these so nobody re-litigates them by accident.

- **Coverage thresholds** — declined. The codebase is 12 `.astro` components and one `.ts` file; a repo-wide percentage would measure almost nothing. The one piece of real logic, `src/lib/hours.ts`, has 23 dedicated tests including both DST transitions. Revisit if `src/lib/` grows.
- **Semgrep / osv-scanner / gitleaks** — declined. A static marketing site with no backend, no auth, no user input and no secrets. Adding scanners here would be ceremony. Revisit if a form or any server-side code lands.

---

## Exceptions

Every exception needs an owner and an expiry. An exception with neither is just a lowered bar.

| # | Exception                                                                 | Reason                                                                                                                | Owner            | Expires    |
| - | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------- | ---------- |
| 1 | ~~Performance measured, not enforced~~ **Withdrawn 2026-09-02**            | Based on a mismeasurement — the audit was profiling a dev server. Against a production build every score is 100 and stable, so performance is now enforced. | Joey Chan | Closed |
| 2 | `eslint-plugin-jsx-a11y` not installed                                    | Does not support ESLint 10; it is a `peerOptional` of `eslint-plugin-astro`. Forcing it needs `--legacy-peer-deps`. Lighthouse covers a11y in the meantime. | Joey Chan | 2026-12-01 |
| 3 | Menu prices unverified                                                    | Transcribed from a printed menu of unknown vintage; 14 items flagged. **Blocks public launch, not development.**       | Joey Chan        | Before launch (Task 15) |
| 4 | Source photography below hero resolution                                  | Largest photo is 750×600; the direction contract needs ~2000px for a full-bleed hero. **Blocks Task 7.**              | Joey Chan        | 2026-09-16 |
| 5 | `/tokens` dev page exempt from the meta-description rule                  | `noindex` development reference, removed at Task 15                                                                    | Joey Chan        | 2026-10-01 (Task 15) |
| 6 | `/location` best-practices floor 96, not 100                              | Lighthouse `image-size-responsive`: the storefront photo is 348×348, too low-res for high-DPI screens. Shrinking it to pass would make the building unrecognisable, which is the photo's entire job. **The fix is a better photo, not a code change** — one phone snapshot would close it. Enforced in `scripts/audit.mjs`, which fails once this date passes. | Joey Chan | 2026-12-01 |

---

## Where checks run

Scoped by cost, so the fast ones stay fast.

| Tier            | Command              | Contents                                                    | Time  |
| --------------- | -------------------- | ----------------------------------------------------------- | ----- |
| Edit loop       | `npm run check:fast` | typecheck, lint                                             | ~3s   |
| Task end (gate) | `npm run check:task` | typecheck, lint, test, build, content integrity, design tokens | ~5s   |
| Review / CI     | `npm run check:full` | everything above, plus Lighthouse a11y + performance         | ~30s  |

**Enforcement:** fast checks warn while editing; `check:task` **blocks** — a task is not complete and nothing is committed until it passes.
