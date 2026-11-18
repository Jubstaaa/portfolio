import { describe, expect, mock, test } from 'bun:test'

import { commands } from './commands'

function context() {
    return { getHistory: () => [], glitch: () => undefined, navigate: mock() }
}

describe('cd', () => {
    test('navigates to a known page', () => {
        const ctx = context()
        commands.cd?.run('blog', ctx)
        expect(ctx.navigate).toHaveBeenCalledWith('/blog')
    })

    test('does not navigate for a prototype key', () => {
        const ctx = context()
        commands.cd?.run('constructor', ctx)
        expect(ctx.navigate).not.toHaveBeenCalled()
    })
})
