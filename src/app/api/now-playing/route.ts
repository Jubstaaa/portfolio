import { NextResponse } from 'next/server'

interface LastFmTrack {
    '@attr'?: { nowplaying?: string }
    'artist': { '#text': string }
    'name': string
}

interface LastFmRecentTracks {
    recenttracks?: { track: LastFmTrack | LastFmTrack[] }
}

interface NowPlayingPayload {
    artist?: string
    isPlaying: boolean
    title?: string
    url?: string
}

const RECENT_TRACKS_ENDPOINT = 'https://ws.audioscrobbler.com/2.0/'

const CACHE_HEADERS = {
    'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
}

const idleResponse = (): NextResponse =>
    NextResponse.json({ isPlaying: false } satisfies NowPlayingPayload, {
        headers: CACHE_HEADERS,
    })

export async function GET(): Promise<NextResponse> {
    const apiKey = process.env.LASTFM_API_KEY
    const user = process.env.LASTFM_USERNAME
    if (!apiKey || !user) return idleResponse()

    const params = new URLSearchParams({
        method: 'user.getrecenttracks',
        api_key: apiKey,
        format: 'json',
        limit: '1',
        user,
    })
    const res = await fetch(`${RECENT_TRACKS_ENDPOINT}?${params}`, {
        cache: 'no-store',
    })
    if (!res.ok) {
        console.error(`now-playing: Last.fm responded ${res.status}`)
        return idleResponse()
    }

    const data = (await res.json()) as LastFmRecentTracks
    const tracks = data.recenttracks?.track
    const track = Array.isArray(tracks) ? tracks[0] : tracks
    if (!track || track['@attr']?.nowplaying !== 'true') return idleResponse()

    const artist = track.artist['#text']
    const payload: NowPlayingPayload = {
        url: `https://open.spotify.com/search/${encodeURIComponent(`${track.name} ${artist}`)}`,
        artist,
        isPlaying: true,
        title: track.name,
    }

    return NextResponse.json(payload, { headers: CACHE_HEADERS })
}
