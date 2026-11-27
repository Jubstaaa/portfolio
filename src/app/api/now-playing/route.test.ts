import {
    afterEach,
    beforeEach,
    describe,
    expect,
    mock,
    spyOn,
    test,
} from 'bun:test'
import { delay, http, HttpResponse } from 'msw'

import { getSocialHref } from '@/features/content/content'
import { resetRecentTracksCache } from '@/features/now-playing/recent-tracks'
import { setupMockServer } from '@/test-utils/mock-server'

import { GET } from './route'

const LASTFM = 'https://ws.audioscrobbler.com/2.0/'

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

const server = setupMockServer()

function lastFm(resolver: Parameters<typeof http.get>[1]) {
    server.use(http.get(LASTFM, resolver))
}

describe('GET /api/now-playing', () => {
    beforeEach(() => {
        // The upstream call is deduped in-process, so without this every test
        // after the first would be served the previous test's track.
        resetRecentTracksCache()
        process.env.LASTFM_API_KEY = 'key'
        process.env.LASTFM_USERNAME = 'user'
        spyOn(console, 'error').mockImplementation(() => undefined)
        spyOn(console, 'warn').mockImplementation(() => undefined)
    })

    afterEach(() => {
        mock.restore()
        delete process.env.LASTFM_API_KEY
        delete process.env.LASTFM_USERNAME
    })

    test('is idle without credentials, warns once and never calls Last.fm', async () => {
        delete process.env.LASTFM_API_KEY
        const requests = mock()
        server.events.on('request:start', requests)
        expect(await (await GET()).json()).toEqual({ isPlaying: false })
        await GET()
        expect(requests).not.toHaveBeenCalled()
        // A misconfigured droplet must leave a trace, but not on every poll.
        expect(console.warn).toHaveBeenCalledTimes(1)
        server.events.removeAllListeners()
    })

    test('returns the playing track with the Spotify profile from socials', async () => {
        lastFm(() => HttpResponse.json(nowPlaying))
        expect(await (await GET()).json()).toMatchObject({
            artist: 'Boards of Canada',
            isPlaying: true,
            title: 'Roygbiv',
            url: getSocialHref('Spotify'),
        })
    })

    test('is idle on an upstream error status', async () => {
        lastFm(() => new HttpResponse(null, { status: 503 }))
        const res = await GET()
        expect(res.status).toBe(200)
        expect(await res.json()).toEqual({ isPlaying: false })
    })

    // A hiccup cached as "not playing" would outlive the recovery by up to 90s
    // at a shared cache, so only a real answer gets the long window.
    test('does not cache a degraded answer', async () => {
        lastFm(() => HttpResponse.error())
        expect((await GET()).headers.get('cache-control')).toBe('no-store')

        resetRecentTracksCache()
        delete process.env.LASTFM_API_KEY
        expect((await GET()).headers.get('cache-control')).toBe('no-store')
    })

    test('caches a real answer for the polling window', async () => {
        lastFm(() => HttpResponse.json(nowPlaying))
        expect((await GET()).headers.get('cache-control')).toContain('s-maxage')
    })

    test('is idle when the network fails', async () => {
        lastFm(() => HttpResponse.error())
        const res = await GET()
        expect(res.status).toBe(200)
        expect(await res.json()).toEqual({ isPlaying: false })
    })

    test('is idle on a body that is not JSON', async () => {
        lastFm(() => HttpResponse.text('<html>'))
        expect(await (await GET()).json()).toEqual({ isPlaying: false })
    })

    test('logs and degrades when Last.fm changes its payload', async () => {
        lastFm(() => HttpResponse.json({ error: 6, message: 'User not found' }))
        expect(await (await GET()).json()).toEqual({ isPlaying: false })
        expect(console.error).toHaveBeenCalled()
    })

    test(
        'gives up on a hanging upstream instead of holding the request',
        async () => {
            lastFm(async () => {
                await delay('infinite')
                return HttpResponse.json(nowPlaying)
            })
            expect(await (await GET()).json()).toEqual({ isPlaying: false })
        },
        { timeout: 10_000 }
    )

    // One upstream call per window, shared across visitors — the reason the
    // route does not simply pass the credentialed URL to Next's data cache.
    test('dedupes polls inside the window to one upstream call', async () => {
        const requests = mock()
        server.events.on('request:start', requests)
        lastFm(() => HttpResponse.json(nowPlaying))

        const first = await (await GET()).json()
        const second = await (await GET()).json()

        expect(requests).toHaveBeenCalledTimes(1)
        expect(second).toEqual(first)
        server.events.removeAllListeners()
    })

    // The key can only travel as a query parameter, so the URL is a secret:
    // Next's fetch cache stores res.url and logs the whole URL when a cache
    // write fails, which would put the key in the droplet's container log.
    test('keeps the credentialed URL out of the Next fetch cache', async () => {
        lastFm(() => HttpResponse.json(nowPlaying))
        const fetchSpy = spyOn(globalThis, 'fetch')
        await GET()
        const init = fetchSpy.mock.calls[0]?.[1]
        expect(init?.cache).toBe('no-store')
        expect(init?.next).toBeUndefined()
    })

    test('is idle rather than OOM when the upstream body is unbounded', async () => {
        // 64 KB is the cap; the real payload at limit=1 is under a kilobyte.
        lastFm(() => HttpResponse.text('x'.repeat(128 * 1024)))
        expect(await (await GET()).json()).toEqual({ isPlaying: false })
        expect(console.error).toHaveBeenCalled()
    })

    test('refuses a body whose declared length is over the cap', async () => {
        lastFm(
            () =>
                new HttpResponse(JSON.stringify(nowPlaying), {
                    headers: { 'content-length': String(1024 * 1024) },
                })
        )
        expect(await (await GET()).json()).toEqual({ isPlaying: false })
        expect(console.error).toHaveBeenCalled()
    })
})
