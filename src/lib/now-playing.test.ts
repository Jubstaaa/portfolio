import { describe, expect, test } from 'bun:test'

import { parseRecentTracks } from '@/lib/now-playing'

const playing = {
    '@attr': { nowplaying: 'true' },
    'artist': { '#text': 'Boards of Canada' },
    'name': 'Roygbiv',
}

describe('parseRecentTracks', () => {
    test('returns the track that is playing (array form)', () => {
        expect(
            parseRecentTracks({ recenttracks: { track: [playing] } })
        ).toEqual({
            artist: 'Boards of Canada',
            isPlaying: true,
            title: 'Roygbiv',
        })
    })

    test('accepts a single track object', () => {
        expect(
            parseRecentTracks({ recenttracks: { track: playing } }).isPlaying
        ).toBe(true)
    })

    test('is idle when the latest track is not playing', () => {
        const { '@attr': _, ...stopped } = playing
        expect(
            parseRecentTracks({ recenttracks: { track: [stopped] } })
        ).toEqual({ isPlaying: false })
    })

    test.each([
        ['an empty track list', { recenttracks: { track: [] } }],
        [
            'a track without an artist',
            { recenttracks: { track: { '@attr': { nowplaying: 'true' } } } },
        ],
    ])('is idle for %s', (_label, json) => {
        expect(parseRecentTracks(json)).toEqual({ isPlaying: false })
    })

    // Not a normal state: Last.fm changed its payload or sent an error body.
    test.each([
        ['null', null],
        ['an HTML error page', '<html>'],
        ['an error body', { error: 6, message: 'User not found' }],
    ])('throws for %s', (_label, json) => {
        expect(() => parseRecentTracks(json)).toThrow()
    })
})
