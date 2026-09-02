# UNO Mexican Grill — agent instructions

Public marketing site for a real restaurant in Glen Oaks, Queens. Astro static + TypeScript, plain CSS with design tokens, deployed to Netlify.

## Read these first

| File                              | What it is                                                            |
| --------------------------------- | --------------------------------------------------------------------- |
| `CONSTRAINTS.md`                  | **The quality bar. Read before changing anything.**                   |
| `PRODUCT.md`                      | Product truth — users, positioning, confirmed facts, brand commitments |
| `SPEC.md`                         | Technical contract — stack, structure, conventions, boundaries         |
| `DECISIONS.md`                    | Why, and what was chosen against                                       |
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
- `src/content/menu.json` is the transcribed printed menu. 14 items are flagged for verification — leave the flags until prices are confirmed with the restaurant.
- Prettier ignores `*.md` and `src/content/*.json` deliberately; it was reflowing prose contracts and exploding the menu data.
- All colours and font sizes come from `src/styles/tokens.css`. `npm run check:tokens` fails the build on a literal hex, `rgb()` or absolute `font-size` in a component. If a value belongs in the system, add it as a token — do not exempt the file.
- The visual language (display face, serape stripe, mural band, number chips) is recorded in `.impeccable/surfaces/homepage.md` and `DECISIONS.md`. Reuse the existing components rather than restyling per page.
- Astro's current major is 7. Verify framework APIs against live docs rather than memory — especially content collections.
