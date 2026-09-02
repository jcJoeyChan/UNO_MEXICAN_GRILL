# Constraints

The quality bar for this project. Agents and humans both work to it.

**Never weaken a constraint to make a change pass.** If a check fails, fix the code. If the constraint itself is wrong, change it deliberately — in its own commit, with the reason written down — not as a side effect of shipping something else. Silently lowering a threshold, deleting an assertion, skipping a test, or adding a suppression comment is a bug, not a workaround.

Established 2026-09-02, after Task 4. Numbers are **measured**, not aspirational: they record what this project actually achieved on that date and forbid regression from it.

---

## Floor — always, no exceptions

Every task clears all five before it counts as done.

| Rule                     | Command                | Why                                                                       |
| ------------------------ | ---------------------- | ------------------------------------------------------------------------- |
| Types clean              | `npm run typecheck`    | `astro check`, TypeScript strict. Zero errors, zero warnings, zero hints. |
| Lint clean               | `npm run lint`         | ESLint 10 flat config. Zero errors.                                       |
| Tests pass               | `npm run test`         | Vitest. Currently 26 tests across 2 files.                                |
| Build succeeds           | `npm run build`        | Astro static output.                                                      |
| Content integrity passes | `npm run check:content`| The project's own rules about truthful content — see below.               |

Run all five: `npm run check:task` — **currently ~5 seconds**, budget 90 seconds.

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

## Accessibility — enforced

`SPEC.md` commits to a WCAG AA baseline. Lighthouse's accessibility category is axe-core in a real browser, which is why it can measure colour contrast that a DOM shim cannot.

**Command:** `npm run check:audit` (review/CI tier — takes ~25s, too slow for task end)

| Page        | Floor | Measured 2026-09-02 |
| ----------- | ----- | ------------------- |
| `/`         | 100   | 100                 |
| `/menu`     | 100   | 100                 |
| `/location` | 100   | 100                 |

Tolerance ±2. Stable across four consecutive runs — this number does not wobble, so a drop is a real regression.

**Also enforced at the same floors:** best-practices **100**, SEO **91** on all three pages.

> Setting this up found a real bug. At mobile widths the brand text was `display: none` and the logo carries `alt=""`, leaving the home link with no accessible name at all. Fixed before baselining — a floor recorded on top of a known defect enshrines the defect.

---

## Performance — measured only, not enforced

**Command:** `npm run check:audit` (reports, never fails the build)

| Page        | Recorded 2026-09-02 | Observed range over 4 runs |
| ----------- | ------------------- | -------------------------- |
| `/`         | 77                  | 58–80                      |
| `/menu`     | 80                  | 58–80                      |
| `/location` | 80                  | 58–80                      |

**Why this is not a gate yet.** Measured over four consecutive runs on identical builds, performance swung 22 points on the same pages while every other category returned an identical score every time. These pages are near-empty placeholders, so the number is currently measuring scheduling jitter rather than the site. A gate that fails at random is a gate people learn to ignore.

**Promote it to enforced at Task 12**, when real images and content make the measurement meaningful. Move `performance` from `MEASURED_ONLY` to `ENFORCED` in `scripts/audit.mjs` and re-baseline with `node scripts/audit.mjs --update`.

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
| 1 | Performance measured, not enforced                                        | 22-point run-to-run variance on placeholder pages; not yet meaningful                                                  | Joey Chan        | 2026-10-01 (Task 12) |
| 2 | `eslint-plugin-jsx-a11y` not installed                                    | Does not support ESLint 10; it is a `peerOptional` of `eslint-plugin-astro`. Forcing it needs `--legacy-peer-deps`. Lighthouse covers a11y in the meantime. | Joey Chan | 2026-12-01 |
| 3 | Menu prices unverified                                                    | Transcribed from a printed menu of unknown vintage; 14 items flagged. **Blocks public launch, not development.**       | Joey Chan        | Before launch (Task 15) |
| 4 | Source photography below hero resolution                                  | Largest photo is 750×600; the direction contract needs ~2000px for a full-bleed hero. **Blocks Task 7.**              | Joey Chan        | 2026-09-16 |
| 5 | `/tokens` dev page exempt from the meta-description rule                  | `noindex` development reference, removed at Task 15                                                                    | Joey Chan        | 2026-10-01 (Task 15) |

---

## Where checks run

Scoped by cost, so the fast ones stay fast.

| Tier            | Command              | Contents                                                    | Time  |
| --------------- | -------------------- | ----------------------------------------------------------- | ----- |
| Edit loop       | `npm run check:fast` | typecheck, lint                                             | ~3s   |
| Task end (gate) | `npm run check:task` | typecheck, lint, test, build, content integrity             | ~5s   |
| Review / CI     | `npm run check:full` | everything above, plus Lighthouse a11y + performance         | ~30s  |

**Enforcement:** fast checks warn while editing; `check:task` **blocks** — a task is not complete and nothing is committed until it passes.
