import { NextResponse } from 'next/server'

import type { NowPlayingPayload } from '@/features/now-playing/now-playing.schema'

import { getSocialHref } from '@/features/content/content'
import { fetchRecentTracks } from '@/features/now-playing/recent-tracks'

const SPOTIFY_PROFILE_URL = getSocialHref('Spotify')

const CACHE_HEADERS = {
    'Cache-Control':
        'public, max-age=15, s-maxage=30, stale-while-revalidate=60',
}

let warnedMissingCredentials = false

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

function respond(payload: NowPlayingPayload): NextResponse {
    return NextResponse.json(payload, { headers: CACHE_HEADERS })
}
