import { expect, test } from 'bun:test'

import {
    appendEntry,
    clearTerminal,
    getSessionState,
    pushHistory,
} from './terminal-session'

test('clear hides the transcript and drops every entry', () => {
    appendEntry('whoami', null)
    clearTerminal()
    expect(getSessionState()).toMatchObject({ cleared: true, entries: [] })
})

test('the transcript and the history are both bounded', () => {
    for (let i = 0; i < 260; i += 1) {
        appendEntry(`cmd ${i}`, null)
        pushHistory(`cmd ${i}`)
    }
    const { entries, history } = getSessionState()
    expect(entries.length).toBe(200)
    expect(history.length).toBe(100)

    expect(entries.at(-1)?.command).toBe('cmd 259')
    expect(history.at(-1)).toBe('cmd 259')
})
