import pRetry, { AbortError } from 'p-retry'

import { CDN_BASE } from '@/lib/cdn'

const FETCH_TIMEOUT_MS = 15_000

const RETRYABLE_STATUS = new Set([408, 429])

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

            throw RETRYABLE_STATUS.has(res.status) || res.status >= 500
                ? error
                : new AbortError(error)
        },
        { minTimeout: 200, retries: 2 }
    )
}
