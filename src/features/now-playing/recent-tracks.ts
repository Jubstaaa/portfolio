import { parseRecentTracks } from './last-fm'

const RECENT_TRACKS_ENDPOINT = 'https://ws.audioscrobbler.com/2.0/'
const UPSTREAM_TIMEOUT_MS = 3000

// One Last.fm call per window, shared by every visitor; the client polls on the
// same cadence. There is one container, so an in-process cache dedupes exactly
// as Next's data cache did — without putting the credentialed URL in it.
const REVALIDATE_SECONDS = 30

// The real payload at limit=1 is well under a kilobyte. Without a bound, a
// pathological upstream body would OOM a container capped at 160 MB of heap.
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
        // Last.fm only takes the key as a query parameter, so the URL is
        // credentialed. no-store keeps it out of Next's fetch cache, whose
        // entry stores res.url and whose cache-set failure path logs the whole
        // URL through console.warn — i.e. into the droplet's container log.
        cache: 'no-store',
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    })
    if (!res.ok) throw new Error(`Last.fm responded ${res.status}`)

    const payload = parseRecentTracks(await readCapped(res))
    cached = { at: Date.now(), payload }
    return payload
}

// Tests share one module registry, and so would two polls in the same window.
export function resetRecentTracksCache(): void {
    cached = null
}

async function readCapped(res: Response): Promise<unknown> {
    // Advisory only — absent under chunked encoding — hence the second check.
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
