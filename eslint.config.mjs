import { next } from '@jubstaaa/config/eslint/next'
import { defineConfig } from 'eslint/config'

export default defineConfig([
    ...next({
        internalPattern: ['^@/', '^#site/'],
        tsconfigRootDir: import.meta.dirname,
    }),
    {
        rules: {
            'jsx-a11y/no-noninteractive-tabindex': [
                'error',
                { roles: ['region', 'tabpanel'], tags: [] },
            ],
        },
    },
])
