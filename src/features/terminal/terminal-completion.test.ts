import { describe, expect, test } from 'bun:test'

import {
    completionValue,
    nextCompletion,
    startCompletion,
} from './terminal-completion'

const NAMES = ['cat', 'cd', 'clear', 'help'] as const

describe('startCompletion', () => {
    test('leaves Tab alone when nothing matches', () => {
        expect(startCompletion('zzz', NAMES).kind).toBe('none')
        expect(startCompletion('', NAMES).kind).toBe('none')
    })

    test('fills a single match outright, with no session to cycle', () => {
        expect(startCompletion('he', NAMES)).toEqual({
            kind: 'single',
            value: 'help ',
        })
    })

    test('several matches open a cycle and list every one of them', () => {
        const start = startCompletion('c', NAMES)
        if (start.kind !== 'cycle') throw new Error(`got ${start.kind}`)
        expect(start.listing).toEqual(['cat', 'cd', 'clear'])
        expect(start.session.index).toBe(0)
        expect(completionValue(start.session)).toBe('cat ')
    })
})

describe('nextCompletion', () => {
    const session = () => {
        const start = startCompletion('c', NAMES)
        if (start.kind !== 'cycle') throw new Error(`got ${start.kind}`)
        return start.session
    }

    test('advances one match per call and wraps at the end', () => {
        let current = session()
        const seen = [completionValue(current)]
        for (let i = 0; i < 3; i += 1) {
            current = nextCompletion(current)
            seen.push(completionValue(current))
        }

        expect(seen).toEqual(['cat ', 'cd ', 'clear ', 'cat '])
    })

    test('does not mutate the session it was given', () => {
        const original = session()
        nextCompletion(original)
        expect(original.index).toBe(0)
    })

    test('an empty match set cannot divide by zero', () => {
        const empty = { build: (m: string) => m, index: 0, matches: [] }
        expect(nextCompletion(empty).index).toBe(0)
        expect(completionValue(empty)).toBeNull()
    })
})
