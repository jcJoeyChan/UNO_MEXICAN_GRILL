import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';

// Flat config as a plain array — tseslint.config() is deprecated as of
// typescript-eslint 8.69. eslint-plugin-jsx-a11y is deliberately absent: it does
// not yet support ESLint 10, and it is only a peerOptional of eslint-plugin-astro.
// Accessibility is verified manually in Task 13.
export default [
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', 'public/**'],
  },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
];
