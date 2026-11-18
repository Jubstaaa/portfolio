import { NextResponse } from 'next/server'

import { type NowPlayingPayload, parseRecentTracks } from '@/lib/now-playing'

const RECENT_TRACKS_ENDPOINT = 'https://ws.audioscrobbler.com/2.0/'
const SPOTIFY_PROFILE_URL = 'https://open.spotify.com/user/11154024788'
const UPSTREAM_TIMEOUT_MS = 3000
// One Last.fm call per window, shared by every visitor through Next's data cache;
// the client polls on the same cadence.
const REVALIDATE_SECONDS = 30

const CACHE_HEADERS = {
    'Cache-Control':
        'public, max-age=15, s-maxage=30, stale-while-revalidate=60',
}

let warnedMissingCredentials = false

function respond(payload: NowPlayingPayload): NextResponse {
    return NextResponse.json(payload, { headers: CACHE_HEADERS })
}

async function fetchRecentTracks(apiKey: string, user: string) {
    const params = new URLSearchParams({
        method: 'user.getrecenttracks',
        api_key: apiKey,
        format: 'json',
        limit: '1',
        user,
    })
    const res = await fetch(`${RECENT_TRACKS_ENDPOINT}?${params}`, {
        next: { revalidate: REVALIDATE_SECONDS },
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    })
    if (!res.ok) throw new Error(`Last.fm responded ${res.status}`)
    return parseRecentTracks(await res.json())
}

export async function GET(): Promise<NextResponse> {
    const apiKey = process.env.LASTFM_API_KEY
    const user = process.env.LASTFM_USERNAME
    if (!apiKey || !user) {
        if (!warnedMissingCredentials) {
            warnedMissingCredentials = true
            console.warn(
                'now-playing: LASTFM_API_KEY or LASTFM_USERNAME is unset; the widget always reports idle'
            )
        }
        return respond({ isPlaying: false })
    }

    try {
        const track = await fetchRecentTracks(apiKey, user)
        return respond(
            track.isPlaying ? { ...track, url: SPOTIFY_PROFILE_URL } : track
        )
    } catch (error) {
        console.error('now-playing: upstream request failed', error)
        return respond({ isPlaying: false })
    }
}
