import { describe, expect, test } from 'bun:test'

import { historyDown, historyUp, IDLE_CURSOR } from './terminal-history'

const HISTORY = ['help', 'cd blog', 'whoami']

describe('historyUp', () => {
    test('an empty history is not ours to handle', () => {
        expect(historyUp(IDLE_CURSOR, [], 'typed')).toBeNull()
    })

    test('the first press saves the draft and lands on the newest entry', () => {
        expect(historyUp(IDLE_CURSOR, HISTORY, 'half-typed')).toEqual({
            cursor: { draft: 'half-typed', index: 2 },
            value: 'whoami',
        })
    })

    test('further presses walk back and then stop at the oldest entry', () => {
        let cursor = { draft: 'd', index: 1 }
        expect(historyUp(cursor, HISTORY, 'ignored')).toEqual({
            cursor: { draft: 'd', index: 0 },
            value: 'help',
        })
        cursor = { draft: 'd', index: 0 }
        expect(historyUp(cursor, HISTORY, 'ignored')).toEqual({
            cursor: { draft: 'd', index: 0 },
            value: 'help',
        })
    })
})

describe('historyDown', () => {
    test('does nothing while the user is not navigating', () => {
        expect(historyDown(IDLE_CURSOR, HISTORY)).toBeNull()
    })

    test('walks forward through the entries', () => {
        expect(historyDown({ draft: 'd', index: 0 }, HISTORY)).toEqual({
            cursor: { draft: 'd', index: 1 },
            value: 'cd blog',
        })
    })

    test('past the newest entry it restores the draft and goes idle', () => {
        expect(historyDown({ draft: 'half-typed', index: 2 }, HISTORY)).toEqual(
            {
                cursor: IDLE_CURSOR,
                value: 'half-typed',
            }
        )
    })
})

// The round trip is the behaviour users actually notice: type, walk up, walk
// back down, and the half-typed command is still there.
test('up then down returns the draft untouched', () => {
    const up = historyUp(IDLE_CURSOR, HISTORY, 'git stat')
    if (!up) throw new Error('expected ArrowUp to be handled')
    let cursor = up.cursor
    for (const _ of HISTORY) {
        const down = historyDown(cursor, HISTORY)
        if (!down) throw new Error('expected ArrowDown to be handled')
        cursor = down.cursor
        if (cursor.index === -1) {
            expect(down.value).toBe('git stat')
            return
        }
    }
    throw new Error('never returned to the draft')
})
