/**
 * Presets carry the rules; this file only wires them together and adds the few
 * project-specific choices at the end.
 */

import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import perfectionist from 'eslint-plugin-perfectionist'
import { defineConfig, globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig([
    globalIgnores([
        '.next/**',
        '.velite/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
    ]),

    ...nextVitals,
    ...nextTs,

    // eslint-config-next registers jsx-a11y but enables only a handful of its rules.
    { rules: jsxA11y.flatConfigs.recommended.rules },

    {
        extends: [
            tseslint.configs.strictTypeChecked,
            tseslint.configs.stylisticTypeChecked,
        ],
        files: ['**/*.{ts,tsx,mts}'],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // verbatimModuleSyntax needs type-only imports to be marked as such.
            '@typescript-eslint/consistent-type-imports': [
                'error',
                { fixStyle: 'inline-type-imports' },
            ],
            '@typescript-eslint/no-import-type-side-effects': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            // Numbers in template literals are unambiguous; the strict preset bans
            // them, the recommended one does not.
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                { allowNumber: true },
            ],
        },
    },

    perfectionist.configs['recommended-natural'],
    {
        rules: {
            'perfectionist/sort-imports': [
                'error',
                { internalPattern: ['^@/', '^#site/'], type: 'natural' },
            ],
        },
    },

    {
        rules: {
            // Server logs go through console.error / console.warn; nothing else ships.
            'no-console': ['error', { allow: ['error', 'warn'] }],
        },
    },

    {
        // Asymmetric matchers (expect.any, expect.stringContaining, …) are typed
        // `any` by the test runner.
        files: ['**/*.test.{ts,tsx}', 'e2e/**'],
        rules: {
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
        },
    },
    {
        // Next.js documents headers()/redirects() as async functions.
        files: ['next.config.ts'],
        rules: { '@typescript-eslint/require-await': 'off' },
    },
    {
        // CLI scripts report to the terminal.
        files: ['scripts/**'],
        rules: { 'no-console': 'off' },
    },

    // Must stay last: turns off every rule Prettier owns.
    prettier,
])
