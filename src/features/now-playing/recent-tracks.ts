import { parseRecentTracks } from './last-fm'

const RECENT_TRACKS_ENDPOINT = 'https://ws.audioscrobbler.com/2.0/'
const UPSTREAM_TIMEOUT_MS = 3000

const REVALIDATE_SECONDS = 30

const MAX_UPSTREAM_BYTES = 64 * 1024

type RecentTracks = ReturnType<typeof parseRecentTracks>

let cached: null | { at: number; payload: RecentTracks } = null

export async function fetchRecentTracks(
    apiKey: string,
    user: string
): Promise<RecentTracks> {
    if (cached && Date.now() - cached.at < REVALIDATE_SECONDS * 1000) {
        return cached.payload
    }

    const params = new URLSearchParams({
        api_key: apiKey,
        format: 'json',
        limit: '1',
        method: 'user.getrecenttracks',
        user,
    })

    const res = await fetch(`${RECENT_TRACKS_ENDPOINT}?${params}`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    })
    if (!res.ok) throw new Error(`Last.fm responded ${res.status}`)

    const payload = parseRecentTracks(await readCapped(res))
    cached = { at: Date.now(), payload }
    return payload
}

export function resetRecentTracksCache(): void {
    cached = null
}

async function readCapped(res: Response): Promise<unknown> {
    const declared = Number(res.headers.get('content-length'))
    if (declared > MAX_UPSTREAM_BYTES) {
        throw new Error(`Last.fm declared ${declared} bytes`)
    }

    const bytes = new Uint8Array(await res.arrayBuffer())
    if (bytes.byteLength > MAX_UPSTREAM_BYTES) {
        throw new Error(`Last.fm sent ${bytes.byteLength} bytes`)
    }
    return JSON.parse(new TextDecoder().decode(bytes))
}
