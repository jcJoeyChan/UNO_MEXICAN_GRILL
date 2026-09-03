#!/usr/bin/env node
/**
 * Content-integrity checks.
 *
 * PRODUCT.md forbids fabricating menu items, prices, reviews or press mentions,
 * and requires anything unsupplied to read as visibly provisional. Those are the
 * project's sharpest rules and nothing else enforces them, so they live here.
 *
 * Runs against source data and, when dist/ exists, the built HTML.
 * Fast by design: no browser, no network.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const failures = [];
const notes = [];

const fail = (rule, detail) => failures.push(`${rule}: ${detail}`);
const note = (text) => notes.push(text);

// ---------------------------------------------------------------- menu.json
const menu = JSON.parse(readFileSync(join(root, 'src/content/menu.json'), 'utf8'));

const EXPECTED_CATEGORIES = 12;
const EXPECTED_ITEMS = 79;

if (menu.categories.length !== EXPECTED_CATEGORIES) {
  fail(
    'menu-shape',
    `expected ${EXPECTED_CATEGORIES} categories, found ${menu.categories.length}. If the menu genuinely changed, update this number and say so in the commit.`,
  );
}

const itemCount = menu.categories.reduce((n, c) => n + c.items.length, 0);
if (itemCount !== EXPECTED_ITEMS) {
  fail(
    'menu-shape',
    `expected ${EXPECTED_ITEMS} items, found ${itemCount}. Items must not appear or vanish silently.`,
  );
}

// Seasonal must never collapse into a stock-out state.
const soups = menu.categories.find((c) => c.id === 'soups');
if (!soups) fail('seasonal', 'soups category missing from menu.json');
else {
  if (soups.availability !== 'seasonal') fail('seasonal', 'soups must be availability:"seasonal"');
  if (soups.season !== 'winter') fail('seasonal', 'soups must be season:"winter"');
}

// Flags may only be cleared by actually verifying, and the verification has to
// be recorded. The original rule was "at least one item stays flagged", which
// was a proxy for this while everything was unverified. On 2026-09-02 the user
// confirmed the flagged items, so the proxy would now fail on correct data —
// it is replaced by the thing it was standing in for.
const flagged = menu.categories.flatMap((c) =>
  c.items.filter((i) => i.needsVerification || i.sizeUnclear),
);
note(`${flagged.length} menu items still flagged for verification with the restaurant`);

// The printed menu asterisks exactly 25 items. Marking more means asserting a
// dietary claim the restaurant did not make — which for cheesecake may simply
// be untrue. Confirmed against a second independent transcription 2026-09-02.
const EXPECTED_VEGETARIAN = 25;
const vegCount = menu.categories.reduce(
  (n, c) => n + c.items.filter((i) => i.vegetarian).length,
  0,
);
if (vegCount !== EXPECTED_VEGETARIAN) {
  fail(
    'vegetarian-marking',
    `${vegCount} items marked vegetarian, expected ${EXPECTED_VEGETARIAN}. The site marks exactly what the printed menu asterisks — never an inferred flag.`,
  );
}

const verified = menu._provenance?.verifiedWithRestaurant;
if (flagged.length === 0 && !verified?.date) {
  fail(
    'provenance',
    'every verification flag was cleared but _provenance.verifiedWithRestaurant records no date. ' +
      'Flags are cleared by confirming with the restaurant, not by deleting them.',
  );
}
if (verified && !Array.isArray(verified.confirmed)) {
  fail('provenance', '_provenance.verifiedWithRestaurant must list what was confirmed');
}

if (!menu._provenance?.verifyBeforeLaunch) {
  fail('provenance', 'menu.json lost its verifyBeforeLaunch note');
}

// ---------------------------------------------------------- restaurant.json
const restaurant = JSON.parse(readFileSync(join(root, 'src/content/restaurant.json'), 'utf8'));

for (const channel of restaurant.ordering.channels) {
  if (/[?&](rwg_token|utm_[a-z]+)=/i.test(channel.url)) {
    fail(
      'tracking-params',
      `${channel.name} URL carries search tracking parameters; DECISIONS.md records these were stripped deliberately`,
    );
  }
  if (!channel.url.startsWith('https://')) {
    fail('ordering-links', `${channel.name} URL is not https`);
  }
}

if (restaurant.ordering.channels.length !== 4) {
  fail(
    'ordering-links',
    `expected 4 ordering channels, found ${restaurant.ordering.channels.length}`,
  );
}

// ------------------------------------------------------------- built output
const dist = join(root, 'dist');
if (!existsSync(dist)) {
  note('dist/ not present — skipped built-HTML checks (run npm run build first)');
} else {
  const htmlFiles = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.endsWith('.html')) htmlFiles.push(full);
    }
  };
  walk(dist);

  if (htmlFiles.length === 0) fail('build', 'dist/ contains no HTML');

  // Case collisions are invisible on macOS and fatal on Netlify.
  //
  // public/Menu/MENU.pdf and the /menu route both wanted dist/menu/. macOS
  // silently merged them, so links worked locally; Linux would have kept them
  // apart and 404'd the PDF in production. Deploys are not the place to find
  // this out.
  const seen = new Map();
  const walkAll = (dir, prefix = '') => {
    for (const entry of readdirSync(dir)) {
      const rel = `${prefix}/${entry}`;
      const lower = rel.toLowerCase();
      if (seen.has(lower) && seen.get(lower) !== rel) {
        fail(
          'case-collision',
          `dist paths "${seen.get(lower)}" and "${rel}" differ only by case — these merge on macOS but not on Linux`,
        );
      }
      seen.set(lower, rel);
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walkAll(full, rel);
    }
  };
  walkAll(dist);

  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    const page = file.slice(dist.length) || '/';

    // The food is Tex-Mex. Claiming authenticity is a factual claim about the
    // cuisine, and it is not true — PRODUCT.md records this. "Mexican" alone is
    // fine: it is in the restaurant's name.
    for (const claim of [/\bauthentic\b/i, /real\s+mexican/i, /traditional\s+mexican/i]) {
      if (claim.test(html)) {
        fail(
          'cuisine-claim',
          `${page} claims authenticity (${claim}). The food is Tex-Mex — see PRODUCT.md. Lead with the tortillas instead.`,
        );
      }
    }

    // The seasonal soup must never be presented as sold out anywhere.
    if (/sold\s*out/i.test(html)) {
      fail(
        'seasonal',
        `${page} renders "sold out". Seasonal items are winter-only, not out of stock — see PRODUCT.md.`,
      );
    }

    // Structural accessibility floor. Cheap, no false positives, catches the
    // regressions that actually happen. Contrast and ARIA semantics are covered
    // by Lighthouse in check:full, which runs a real browser.
    if (!/<html[^>]+lang=/.test(html)) fail('a11y', `${page} <html> has no lang attribute`);
    if (!/<title>[^<]+<\/title>/.test(html)) fail('a11y', `${page} has no non-empty <title>`);
    if (!/<main[\s>]/.test(html)) fail('a11y', `${page} has no <main> landmark`);

    const h1s = html.match(/<h1[\s>]/g) ?? [];
    if (h1s.length !== 1)
      fail('a11y', `${page} has ${h1s.length} <h1> elements, expected exactly 1`);

    for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
      if (!/\salt=/.test(img)) fail('a11y', `${page} has an <img> with no alt attribute`);
    }

    // Pages deliberately kept out of search (the dev-only token reference) are
    // exempt: requiring a description there would be a rule people route around
    // rather than a rule that protects anything.
    const noindex = /name="robots"[^>]*content="[^"]*noindex/.test(html);
    if (!noindex && !/name="description"\s+content="[^"]{20,}"/.test(html)) {
      fail('seo', `${page} has no meaningful meta description`);
    }

    // Every external link opens safely and says so.
    for (const anchor of html.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? []) {
      if (!/rel="[^"]*noopener/.test(anchor)) {
        fail('security', `${page} has target="_blank" without rel="noopener"`);
      }
    }
  }
  note(`checked ${htmlFiles.length} built pages`);
}

// ------------------------------------------------------------------- report
for (const n of notes) console.log(`  note  ${n}`);

if (failures.length > 0) {
  console.error(`\n✗ content integrity: ${failures.length} failure(s)\n`);
  for (const f of failures) console.error(`  - ${f}`);
  console.error('');
  process.exit(1);
}

console.log('\n✓ content integrity: all checks passed\n');
