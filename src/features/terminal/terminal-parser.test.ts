import { describe, expect, test } from 'bun:test'

import {
    getCompletions,
    PAGE_TARGETS,
    parseCommand,
    resolvePage,
} from './terminal-parser'

describe('parseCommand', () => {
    test.each([
        ['help', { args: '', name: 'help' }],
        ['  LS   -la  ', { args: '-la', name: 'ls' }],
        ['echo  hello   world ', { args: 'hello   world', name: 'echo' }],
    ])('%p', (raw, expected) => {
        expect(parseCommand(raw)).toEqual(expected)
    })

    test('blank input is not a command', () => {
        expect(parseCommand('   ')).toBeNull()
    })
})

describe('resolvePage', () => {
    test.each([
        ['blog', '/blog'],
        ['./blog', '/blog'],
        ['blog/', '/blog'],
        ['/', '/'],
        ['~', '/'],
        ['', '/'],

        ['BLOG', '/blog'],
        ['./Blog/', '/blog'],
    ])('%p resolves to %p', (arg, href) => {
        expect(resolvePage(arg)).toBe(href)
    })

    test.each(['constructor', 'toString', '__proto__', 'hasOwnProperty'])(
        'the prototype key %p is not a page',
        key => {
            expect(resolvePage(key)).toBeUndefined()
        }
    )
})

describe('getCompletions', () => {
    const names = ['help', 'cd', 'cat', 'clear', 'echo']

    test('completes a unique command with a trailing space', () => {
        const completion = getCompletions('hel', names)
        expect(completion?.matches).toEqual(['help'])
        expect(completion?.build('help')).toBe('help ')
    })

    test('offers pages for cd', () => {
        expect(getCompletions('cd bl', names)?.matches).toEqual(['blog'])
    })

    test('folds case the same way execution does', () => {
        expect(getCompletions('CD bl', names)?.matches).toEqual(['blog'])

        expect(getCompletions('cd BL', names)?.matches).toEqual(['blog'])
        expect(getCompletions('CD BL', names)?.matches).toEqual(['blog'])
    })

    test('does not complete arguments of other commands', () => {
        expect(getCompletions('echo b', names)).toBeNull()
    })

    test('empty input has nothing to complete', () => {
        expect(getCompletions('', names)).toBeNull()
    })
})

test('page completions start with the home aliases, then the nav order', () => {
    expect(PAGE_TARGETS.slice(0, 2)).toEqual(['~', 'home'])
})
