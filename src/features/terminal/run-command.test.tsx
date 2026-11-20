import { afterEach, describe, expect, mock, spyOn, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'

import type { CommandContext, TerminalCommand } from './commands.types'

import { runCommand } from './run-command'

const ctx: CommandContext = {
    getHistory: () => [],
    glitch: () => undefined,
    navigate: mock(),
}

function textOf(result: ReturnType<typeof runCommand>): string {
    if (result.kind !== 'entry') throw new Error(`no output: ${result.kind}`)
    return renderToStaticMarkup(result.output).replace(/<[^>]+>/g, '')
}

describe('runCommand', () => {
    afterEach(() => {
        mock.restore()
    })

    test('blank input is an empty prompt line, not a command', () => {
        expect(runCommand('   ', ctx)).toEqual({ kind: 'empty' })
    })

    test('clear asks the terminal to clear and is recorded in history', () => {
        expect(runCommand(' clear ', ctx)).toEqual({
            command: 'clear',
            kind: 'clear',
        })
    })

    test('a known command renders its output under the trimmed input', () => {
        const result = runCommand('  echo hello ', ctx)
        expect(result.kind === 'entry' && result.command).toBe('echo hello')
        expect(textOf(result)).toBe('hello')
    })

    test('an unknown command points to help', () => {
        expect(textOf(runCommand('nope', ctx))).toContain(
            'command not found: nope — try'
        )
    })

    test('a prototype key is not a command', () => {
        expect(textOf(runCommand('constructor', ctx))).toContain(
            'command not found: constructor — try'
        )
    })

    test('a failing command reports an error instead of crashing', () => {
        const consoleError = spyOn(console, 'error').mockImplementation(
            () => undefined
        )
        const failure = new Error('boom')
        const registry: Record<string, TerminalCommand> = {
            broken: {
                description: '',
                run: () => {
                    throw failure
                },
            },
        }

        const result = runCommand('broken', ctx, registry)

        expect(textOf(result)).toBe('error: something went wrong')
        expect(consoleError).toHaveBeenCalledWith(
            "terminal: 'broken' failed",
            failure
        )
    })

    test('commands receive their arguments and the context', () => {
        const run = mock(() => null)
        runCommand('cd   blog', ctx, { cd: { description: '', run } })
        expect(run).toHaveBeenCalledWith('blog', ctx)
    })
})
