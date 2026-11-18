import {
    afterEach,
    beforeEach,
    describe,
    expect,
    mock,
    type Mock,
    spyOn,
    test,
} from 'bun:test'

import { GET } from './route'

const nowPlaying = {
    recenttracks: {
        track: [
            {
                '@attr': { nowplaying: 'true' },
                'artist': { '#text': 'Boards of Canada' },
                'name': 'Roygbiv',
            },
        ],
    },
}

function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), { status })
}

describe('GET /api/now-playing', () => {
    let fetchSpy: Mock<typeof fetch>

    beforeEach(() => {
        process.env.LASTFM_API_KEY = 'key'
        process.env.LASTFM_USERNAME = 'user'
        fetchSpy = spyOn(globalThis, 'fetch')
        spyOn(console, 'error').mockImplementation(() => undefined)
    })

    afterEach(() => {
        mock.restore()
        delete process.env.LASTFM_API_KEY
        delete process.env.LASTFM_USERNAME
    })

    test('is idle without credentials and never calls Last.fm', async () => {
        delete process.env.LASTFM_API_KEY
        const warned = spyOn(console, 'warn').mockImplementation(
            () => undefined
        )
        expect(await (await GET()).json()).toEqual({ isPlaying: false })
        await GET()
        expect(fetchSpy).not.toHaveBeenCalled()
        // A misconfigured droplet must leave a trace, but not on every poll.
        expect(warned).toHaveBeenCalledTimes(1)
    })

    test('returns the playing track with a profile link', async () => {
        fetchSpy.mockResolvedValue(json(nowPlaying))
        expect(await (await GET()).json()).toMatchObject({
            url: expect.stringContaining('spotify.com'),
            artist: 'Boards of Canada',
            isPlaying: true,
            title: 'Roygbiv',
        })
    })

    test('is idle on an upstream error status', async () => {
        fetchSpy.mockResolvedValue(json({}, 503))
        const res = await GET()
        expect(res.status).toBe(200)
        expect(await res.json()).toEqual({ isPlaying: false })
    })

    test('is idle when the network fails', async () => {
        fetchSpy.mockRejectedValue(new TypeError('fetch failed'))
        const res = await GET()
        expect(res.status).toBe(200)
        expect(await res.json()).toEqual({ isPlaying: false })
    })

    test('is idle on a body that is not JSON', async () => {
        fetchSpy.mockResolvedValue(new Response('<html>', { status: 200 }))
        expect(await (await GET()).json()).toEqual({ isPlaying: false })
    })

    test('bounds the upstream call and shares it across visitors', async () => {
        fetchSpy.mockResolvedValue(json(nowPlaying))
        await GET()
        const init = fetchSpy.mock.calls[0]?.[1]
        expect(init?.signal).toBeInstanceOf(AbortSignal)
        expect(init?.cache).toBeUndefined()
        expect(init?.next?.revalidate).toBeGreaterThan(0)
    })
})

describe('GET /api/now-playing payload drift', () => {
    test('logs and degrades when Last.fm changes its payload', async () => {
        process.env.LASTFM_API_KEY = 'key'
        process.env.LASTFM_USERNAME = 'user'
        const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
            json({ error: 6, message: 'User not found' })
        )
        const logged = spyOn(console, 'error').mockImplementation(
            () => undefined
        )
        expect(await (await GET()).json()).toEqual({ isPlaying: false })
        expect(logged).toHaveBeenCalled()
        fetchSpy.mockRestore()
        logged.mockRestore()
        delete process.env.LASTFM_API_KEY
        delete process.env.LASTFM_USERNAME
    })
})
