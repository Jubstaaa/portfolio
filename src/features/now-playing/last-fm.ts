import { z } from 'zod'

import type { NowPlayingPayload } from './now-playing.schema'

export type NowPlayingTrack = Omit<
    Extract<NowPlayingPayload, { isPlaying: true }>,
    'url'
>

const trackSchema = z.object({
    '@attr': z.object({ nowplaying: z.string().optional() }).optional(),
    'artist': z.object({ '#text': z.string() }),
    'name': z.string(),
})

const recentTracksSchema = z.object({
    recenttracks: z.object({
        track: z.union([z.array(z.unknown()), z.unknown()]),
    }),
})

const IDLE = { isPlaying: false } as const

export function parseRecentTracks(
    json: unknown
): NowPlayingTrack | typeof IDLE {
    const recent = recentTracksSchema.safeParse(json)
    // Unlike an empty or stopped track, a missing envelope is never a normal state:
    // Last.fm changed its payload or sent an error body. Throw so it gets logged.
    if (!recent.success) {
        throw new Error(`unexpected Last.fm payload: ${recent.error.message}`)
    }
    const { track: tracks } = recent.data.recenttracks
    const latest = trackSchema.safeParse(
        Array.isArray(tracks) ? tracks[0] : tracks
    )
    if (!latest.success || latest.data['@attr']?.nowplaying !== 'true') {
        return IDLE
    }
    return {
        artist: latest.data.artist['#text'],
        isPlaying: true,
        title: latest.data.name,
    }
}
