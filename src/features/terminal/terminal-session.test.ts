import { expect, test } from 'bun:test'

import {
    abortIntro,
    appendEntry,
    beginIntro,
    completeIntro,
    getSessionState,
} from './terminal-session'

test('the intro counts as played only once it finishes', () => {
    beginIntro()
    appendEntry('whoami', null)
    expect(getSessionState().introPlayed).toBe(false)

    abortIntro()
    expect(getSessionState()).toMatchObject({
        cleared: false,
        entries: [],
        introPlayed: false,
    })

    beginIntro()
    appendEntry('whoami', null)
    completeIntro()
    expect(getSessionState()).toMatchObject({
        cleared: true,
        introPlayed: true,
    })
})
