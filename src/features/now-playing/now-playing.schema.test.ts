import { describe, expect, test } from 'bun:test'

import { nowPlayingPayloadSchema } from './now-playing.schema'

describe('nowPlayingPayloadSchema', () => {
    test.each([
        { isPlaying: false },
        { artist: 'a', isPlaying: true, title: 't', url: 'https://x.test' },
    ])('accepts %p', payload => {
        expect(nowPlayingPayloadSchema.parse(payload)).toEqual(payload)
    })

    // The route is ours, but a proxy or an error page can still answer for it.
    test.each([{}, { isPlaying: true }, '<html>', null])(
        'rejects %p',
        payload => {
            expect(nowPlayingPayloadSchema.safeParse(payload).success).toBe(
                false
            )
        }
    )
})
