# UNO Mexican Grill — agent instructions

Public marketing site for a real restaurant in Glen Oaks, Queens. Astro static + TypeScript, plain CSS with design tokens, deployed to Netlify.

## Read these first

| File                              | What it is                                                            |
| --------------------------------- | --------------------------------------------------------------------- |
| `CONSTRAINTS.md`                  | **The quality bar. Read before changing anything.**                   |
| `PRODUCT.md`                      | Product truth — users, positioning, confirmed facts, brand commitments |
| `SPEC.md`                         | Technical contract — stack, structure, conventions, boundaries         |
| `DECISIONS.md`                    | Why, and what was chosen against                                       |
| `DESIGN.md`                       | The design system as shipped, plus the finish-review verdict            |
| `.impeccable/surfaces/homepage.md`| The homepage direction contract                                        |
| `tasks/plan.md`, `tasks/todo.md`  | The 15-task build plan and its current state                           |

## The quality bar

Read `CONSTRAINTS.md` before making changes, and run `npm run check:task` before considering any task done. It must pass.

**Never weaken a constraint to make a change pass.** Do not lower a threshold, delete or skip a test, strip an assertion, add a suppression comment, or add an exception in order to get to green. If a check fails, fix the code. If the constraint is genuinely wrong, change it in its own commit with the reason written down — and say so out loud rather than doing it quietly.

## Rules specific to this project

These come from `PRODUCT.md` and are not negotiable:

- **Never fabricate content.** No invented menu items, prices, reviews, testimonials, press mentions, awards, or history. This is a real restaurant; wrong information reaches real customers.
- **Anything not yet supplied must read as visibly provisional** — never presented as factual.
- **The seasonal soup is winter-only, never "sold out."** ChowBus's sold-out flag is a POS artifact of the same fact.
- **Ordering is always external.** The site routes to ChowBus, Uber Eats, DoorDash, Grubhub, phone or walk-in. It never takes an order itself.
- **Item numbers matter.** The printed menu says "please order by number" — that is how the counter works.
- **Casual register.** Takeout and dine-in, not fine dining. Do not style toward upscale gloss.

## Working notes

- `src/content/restaurant.json` is the canonical runtime source for hours, contact details and ordering channels. Do not hardcode a phone number or URL in a component.
- `src/content/menu.json` is the transcribed printed menu. **All 79 prices are verified** — cross-checked against a second independent transcription on 2026-09-02 and matched exactly. Clearing a verification flag requires recording it in `_provenance.verifiedWithRestaurant`; `check:content` fails otherwise. The site marks exactly the 25 items the menu asterisks — never infer a vegetarian flag.
- Prettier ignores `*.md` and `src/content/*.json` deliberately; it was reflowing prose contracts and exploding the menu data.
- All colours and font sizes come from `src/styles/tokens.css`. `npm run check:tokens` fails the build on a literal hex, `rgb()` or absolute `font-size` in a component. If a value belongs in the system, add it as a token — do not exempt the file.
- The visual language (Archivo Black display face, serape stripe, full-bleed mural hero, green number chips, alternating section grounds) is recorded in `.impeccable/surfaces/homepage.md` and `DECISIONS.md`. Reuse the existing components rather than restyling per page.
- Astro's current major is 7. Verify framework APIs against live docs rather than memory — especially content collections.

## Working across two machines

This project is worked on from a MacBook and a Windows desktop. **Claude Code conversations are stored per-machine and do not sync** — the repository is the handoff. Everything needed to continue is committed: `CONSTRAINTS.md`, `PRODUCT.md`, `SPEC.md`, `DECISIONS.md`, `DESIGN.md`, the direction contract, and `tasks/todo.md` for current state.

**Before doing anything on a fresh machine:**

1. **Work on `build/site-foundation`, not `main`.** All 25 commits of real work are on that branch; `main` still holds the initial three. Checking out `main` shows a repo that looks half-finished.
2. **Node must be ≥ 22.12.0.** Astro 7 hard-refuses to start below it with a clear error. `node --version` first; upgrade before debugging anything else.
3. **`npm install`.** `node_modules/` and `dist/` are gitignored, so a fresh clone has neither.
4. **Plugins are per-machine, not per-account.** This project uses `impeccable@impeccable` (marketplace `pbakaus/impeccable`) and `agent-skills@addy-agent-skills` (marketplace `addyosmani/agent-skills`). Both marketplaces must be re-added and the plugins reinstalled on each machine.
5. **Check you are in the right clone.** There is more than one copy of this project on the Windows machine; the one with the work is the clone tracking `build/site-foundation`. `git log --oneline -1` should show recent work, not "Initial commit".

`source-assets/` holds the full-resolution masters (~32 MB: mural, grill, catering trays, the original menu PDF). They are committed deliberately so both machines have them — never ship them, always derive resized copies into `public/images/`.
