#!/usr/bin/env node
/**
 * Lighthouse audit — accessibility and performance.
 *
 * Lighthouse's accessibility category is axe-core running in a real browser, so
 * this covers both chosen dimensions with one tool and gets colour-contrast
 * results that a DOM shim cannot produce.
 *
 * Slow (roughly 15-25s per page), so this is a review/CI check, not a task-end
 * one. Thresholds come from CONSTRAINTS.md and are measured floors, not
 * aspirations: they record what the site scores today and forbid regression.
 *
 *   node scripts/audit.mjs                 # audit against a running preview
 *   node scripts/audit.mjs --update        # rewrite the floors with today's scores
 */
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const root = new URL('..', import.meta.url).pathname;
const BASELINE = join(root, '.constraints-baseline.json');
const ORIGIN = process.env.AUDIT_ORIGIN ?? 'http://localhost:4321';
const PAGES = ['/', '/menu', '/location'];
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];
const update = process.argv.includes('--update');

/**
 * Enforced vs measured-only.
 *
 * Measured over four consecutive runs on identical builds, performance ranged
 * 58-80 on the same pages while accessibility, best-practices and SEO returned
 * exactly 100/100/91 every time. The pages are near-empty placeholders, so the
 * performance number is currently measuring scheduling jitter rather than the
 * site. Gating on it would fail at random, and a gate that fails at random is a
 * gate people learn to ignore.
 *
 * So performance is reported, not enforced, until Task 12 puts real images and
 * content on the page and the number starts meaning something. Move it into
 * ENFORCED then, and re-baseline.
 */
const ENFORCED = ['accessibility', 'best-practices', 'seo'];
const MEASURED_ONLY = ['performance'];

// Small band for the stable categories — they have not moved at all, but a
// one-point wobble should not fail a build.
const TOLERANCE = 2;

function waitForServer(url, timeoutMs = 30_000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        if (res.ok) return resolve();
      } catch {
        /* not up yet */
      }
      if (Date.now() - started > timeoutMs) return reject(new Error(`${url} never responded`));
      setTimeout(tick, 400);
    };
    tick();
  });
}

let preview;
async function ensureServer() {
  try {
    await waitForServer(ORIGIN, 1500);
    return false;
  } catch {
    console.log(`starting preview server at ${ORIGIN} ...`);
    preview = spawn('npm', ['run', 'preview'], { cwd: root, stdio: 'ignore', detached: false });
    await waitForServer(ORIGIN);
    return true;
  }
}

const started = await ensureServer();
const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });
const results = {};

try {
  for (const page of PAGES) {
    const url = `${ORIGIN}${page}`;
    const run = await lighthouse(
      url,
      { port: chrome.port, output: 'json', logLevel: 'error' },
      { extends: 'lighthouse:default', settings: { onlyCategories: CATEGORIES } },
    );

    const scores = {};
    for (const key of CATEGORIES) {
      scores[key] = Math.round((run.lhr.categories[key]?.score ?? 0) * 100);
    }
    results[page] = scores;

    const a11yFailures = Object.values(run.lhr.audits).filter(
      (a) =>
        a.score !== null &&
        a.score < 1 &&
        run.lhr.categories.accessibility.auditRefs.some((r) => r.id === a.id),
    );

    console.log(
      `\n${page}  perf ${scores.performance}  a11y ${scores.accessibility}  best-practices ${scores['best-practices']}  seo ${scores.seo}`,
    );
    for (const a of a11yFailures) console.log(`    a11y issue: ${a.id} — ${a.title}`);
  }
} finally {
  await chrome.kill();
  if (started && preview) preview.kill();
}

if (update) {
  writeFileSync(BASELINE, `${JSON.stringify(results, null, 2)}\n`);
  console.log(`\nwrote floors to ${BASELINE}`);
  process.exit(0);
}

if (!existsSync(BASELINE)) {
  console.log('\nno baseline recorded yet — run: node scripts/audit.mjs --update');
  process.exit(0);
}

const baseline = JSON.parse(readFileSync(BASELINE, 'utf8'));
const regressions = [];

for (const [page, scores] of Object.entries(results)) {
  for (const [category, score] of Object.entries(scores)) {
    const floor = baseline[page]?.[category];
    if (floor === undefined) continue;

    if (MEASURED_ONLY.includes(category)) {
      const delta = score - floor;
      const arrow = delta === 0 ? '=' : delta > 0 ? '+' : '';
      console.log(`  measured  ${page} ${category}: ${score} (${arrow}${delta} vs recorded)`);
      continue;
    }

    if (ENFORCED.includes(category) && score < floor - TOLERANCE) {
      regressions.push(`${page} ${category}: ${score}, floor ${floor} (tolerance ${TOLERANCE})`);
    }
  }
}

if (regressions.length > 0) {
  console.error(`\n✗ ${regressions.length} regression(s) below the recorded floor:\n`);
  for (const r of regressions) console.error(`  - ${r}`);
  console.error('\nRaise the code back up, or if the drop is intentional and justified,');
  console.error('record it as an exception in CONSTRAINTS.md with an owner and expiry.\n');
  process.exit(1);
}

console.log('\n✓ no regressions below the recorded floors\n');
