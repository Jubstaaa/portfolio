import pRetry, { AbortError } from 'p-retry'

import { CDN_BASE } from '@/lib/cdn'

const FETCH_TIMEOUT_MS = 15_000
// Request timeout and rate limiting are transient even though they are 4xx.
const RETRYABLE_STATUS = new Set([408, 429])

// Anything that needs the actual image bytes at build time — intrinsic dimensions
// for the aspect-ratio boxes, OG card rasterisation — reads them from the CDN,
// because the repo no longer carries a copy.
//
// Transient failures (network errors, 5xx, timeouts) are retried; after that this
// throws rather than returning nothing: every caller's fallback is
// a silent degradation (dimensions vanish → layout shift on every content image,
// cover vanishes → a blank OG card), and the build is the right place to find out.
export async function readImageBytes(src: string): Promise<Buffer> {
    const url = `${CDN_BASE}${src}`
    return pRetry(
        async () => {
            const res = await fetch(url, {
                signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
            })
            if (res.ok) return Buffer.from(await res.arrayBuffer())
            const error = new Error(
                `image fetch failed: ${url} → HTTP ${res.status}`
            )
            // Other 4xx mean the image is not on the CDN: retrying cannot fix that.
            throw RETRYABLE_STATUS.has(res.status) || res.status >= 500
                ? error
                : new AbortError(error)
        },
        { minTimeout: 200, retries: 2 }
    )
}
