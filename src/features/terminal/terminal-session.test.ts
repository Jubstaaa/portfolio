import { expect, test } from 'bun:test'

import { appendEntry, clearTerminal, getSessionState } from './terminal-session'

test('clear hides the transcript and drops every entry', () => {
    appendEntry('whoami', null)
    clearTerminal()
    expect(getSessionState()).toMatchObject({ cleared: true, entries: [] })
})
