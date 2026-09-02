#!/usr/bin/env node
/**
 * Enforces the rule SPEC.md already states:
 *
 *   "Astro components use scoped styles and CSS variables from
 *    src/styles/tokens.css; no inline magic numbers for color/spacing."
 *
 * A written rule nothing checks is a rule that erodes. This is the moment it
 * matters: four more pages are about to be built, and a hardcoded colour in one
 * of them is how a design system quietly stops being a system.
 *
 * Scope is deliberately narrow — colours and absolute font sizes only.
 *
 * Spacing is NOT checked. Padding and margin have too many legitimate literal
 * values (hairline borders, 1px focus rings, 999px pills, structural heights),
 * and a check that cries wolf is a check people learn to skip. That lesson
 * already cost us once, when performance was gated on a number measured against
 * the wrong server.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;

/** Files allowed to contain literal values, with the reason. */
const EXEMPT = new Map([
  ['src/styles/tokens.css', 'defines the tokens'],
  ['src/styles/fonts.css', '@font-face declarations, no colours'],
  ['src/pages/tokens.astro', 'dev-only swatch page; must show literal values. Removed at Task 15'],
]);

const COLOUR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\(\s*[\d.]/g;
// font-size with an absolute unit and no var() on the line.
const FONT_SIZE = /font-size\s*:\s*[^;]*?(?<![\w-])\d*\.?\d+(px|rem|pt)\b[^;]*;/g;

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, ' ');
}

/** For .astro, only the <style> blocks are CSS. Frontmatter and markup are not. */
function styleSources(file, text) {
  if (!file.endsWith('.astro')) return [{ text, offset: 0 }];
  const blocks = [];
  const re = /<style[^>]*>([\s\S]*?)<\/style>/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    blocks.push({ text: m[1], offset: m.index + m[0].indexOf(m[1]) });
  }
  return blocks;
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(astro|css)$/.test(entry)) files.push(full);
  }
})(join(root, 'src'));

const failures = [];
let scanned = 0;

for (const file of files.sort()) {
  const rel = relative(root, file);
  if (EXEMPT.has(rel)) continue;
  scanned += 1;

  const text = readFileSync(file, 'utf8');

  for (const block of styleSources(file, text)) {
    const css = stripComments(block.text);

    for (const match of css.matchAll(COLOUR)) {
      const line = lineOf(text, block.offset + match.index);
      // Report the whole declaration, not the regex match: "rgba(2" tells a
      // future reader nothing about what to change.
      const source = text.split('\n')[line - 1]?.trim() ?? match[0];
      failures.push(
        `${rel}:${line}  literal colour in \`${source}\`\n      use a token from tokens.css, ` +
          `or color-mix(in srgb, var(--token) N%, transparent) if you need alpha`,
      );
    }

    for (const match of css.matchAll(FONT_SIZE)) {
      if (match[0].includes('var(')) continue;
      const line = lineOf(text, block.offset + match.index);
      failures.push(
        `${rel}:${line}  absolute font-size \`${match[0].trim()}\` — use a --font-size-* token`,
      );
    }
  }
}

console.log(`  note  scanned ${scanned} style sources (${EXEMPT.size} exempt by design)`);

if (failures.length > 0) {
  console.error(`\n✗ design tokens: ${failures.length} literal value(s) outside tokens.css\n`);
  for (const f of failures) console.error(`  - ${f}`);
  console.error(
    '\nSPEC.md: components use CSS variables from tokens.css, no inline magic numbers.\n' +
      'If a value genuinely belongs in the system, add it to tokens.css as a token.\n',
  );
  process.exit(1);
}

console.log('✓ design tokens: no literal colours or font sizes outside tokens.css\n');
