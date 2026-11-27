const config = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'body-max-line-length': [1, 'always', 120],
        'subject-case': [0],
        'type-enum': [
            2,
            'always',
            [
                'feat',
                'fix',
                'chore',
                'refactor',
                'docs',
                'style',
                'test',
                'perf',
                'ci',
                'build',
                'revert',
            ],
        ],
    },
}

export default config
