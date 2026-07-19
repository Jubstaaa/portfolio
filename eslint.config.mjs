import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import importPlugin from 'eslint-plugin-import'
import perfectionistPlugin from 'eslint-plugin-perfectionist'

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    globalIgnores([
        '.next/**',
        'out/**',
        'build/**',
        '.velite/**',
        'next-env.d.ts',
        'scripts/**',
    ]),
    {
        files: ['src/**/*.{ts,tsx,js,jsx}'],
        plugins: {
            import: importPlugin,
            perfectionist: perfectionistPlugin,
        },
        rules: {
            'no-console': ['warn', { allow: ['error'] }],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/consistent-type-imports': [
                'error',
                { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
            ],
            'import/order': [
                'error',
                {
                    'groups': [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                    ],
                    'pathGroups': [
                        {
                            pattern: 'react',
                            group: 'external',
                            position: 'before',
                        },
                        {
                            pattern: 'react-*',
                            group: 'external',
                            position: 'before',
                        },
                        {
                            pattern: 'next',
                            group: 'external',
                            position: 'before',
                        },
                        {
                            pattern: 'next/**',
                            group: 'external',
                            position: 'before',
                        },
                        {
                            pattern: '@/**',
                            group: 'internal',
                            position: 'after',
                        },
                        {
                            pattern: '#site/**',
                            group: 'internal',
                            position: 'after',
                        },
                    ],
                    'pathGroupsExcludedImportTypes': ['react'],
                    'newlines-between': 'always',
                    'alphabetize': { order: 'asc', caseInsensitive: true },
                },
            ],
            'perfectionist/sort-interfaces': [
                'error',
                {
                    customGroups: [
                        {
                            elementNamePattern: '^(id|uuid)$',
                            groupName: 'identity',
                        },
                        {
                            elementNamePattern: '^on[A-Z]',
                            groupName: 'callbacks',
                        },
                    ],
                    groups: ['identity', 'unknown', 'callbacks'],
                    order: 'asc',
                    type: 'alphabetical',
                },
            ],
            'perfectionist/sort-object-types': [
                'error',
                {
                    customGroups: [
                        {
                            elementNamePattern: '^(id|uuid)$',
                            groupName: 'identity',
                        },
                        {
                            elementNamePattern: '^on[A-Z]',
                            groupName: 'callbacks',
                        },
                    ],
                    groups: ['identity', 'unknown', 'callbacks'],
                    order: 'asc',
                    type: 'alphabetical',
                },
            ],
            'perfectionist/sort-named-imports': [
                'warn',
                { order: 'asc', type: 'alphabetical' },
            ],
            'perfectionist/sort-objects': [
                'warn',
                {
                    customGroups: [
                        {
                            elementNamePattern: '^on[A-Z]',
                            groupName: 'callbacks',
                        },
                    ],
                    groups: ['unknown', 'callbacks'],
                    order: 'asc',
                    type: 'alphabetical',
                },
            ],
            'react/jsx-sort-props': [
                'warn',
                {
                    callbacksLast: true,
                    ignoreCase: true,
                    locale: 'auto',
                    multiline: 'last',
                    reservedFirst: ['key', 'ref'],
                    shorthandFirst: true,
                    shorthandLast: false,
                },
            ],
        },
    },
    {
        files: ['**/*.types.ts', '**/*.types.tsx', '**/*.d.ts'],
        rules: { 'no-unused-vars': 'off' },
    },
    {
        files: ['**/api/**/*.ts', '**/route.ts'],
        rules: {
            'perfectionist/sort-objects': [
                'warn',
                {
                    customGroups: [
                        {
                            elementNamePattern: '^url$',
                            groupName: 'request-url',
                        },
                        {
                            elementNamePattern: '^method$',
                            groupName: 'request-method',
                        },
                        {
                            elementNamePattern: '^(body|params|headers)$',
                            groupName: 'request-body',
                        },
                    ],
                    groups: [
                        'request-url',
                        'request-method',
                        'request-body',
                        'unknown',
                    ],
                    order: 'asc',
                    type: 'alphabetical',
                },
            ],
        },
    },
])

export default eslintConfig
