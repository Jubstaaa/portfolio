import { afterEach, expect, mock, spyOn, test } from 'bun:test'

import { fetchNowPlaying } from './now-playing.hooks'

afterEach(() => {
    mock.restore()
})

function respondWith(body: unknown, status = 200) {
    spyOn(globalThis, 'fetch').mockResolvedValue(
        Response.json(body, { status })
    )
}

test('returns a valid payload', async () => {
    respondWith({ isPlaying: false })
    expect(await fetchNowPlaying()).toEqual({ isPlaying: false })
})

// The widget only reads data, so a failed query would otherwise leave no trace.
test.each([
    ['an unexpected body', { isPlaying: 'yes' }, 200],
    ['an error status', { isPlaying: false }, 502],
])('logs and rejects on %s', async (_case, body, status) => {
    const logged = spyOn(console, 'error').mockImplementation(() => undefined)
    respondWith(body, status)
    expect(await fetchNowPlaying().catch(() => 'rejected')).toBe('rejected')
    expect(logged).toHaveBeenCalled()
})
