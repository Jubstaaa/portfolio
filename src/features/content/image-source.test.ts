import { expect, mock, test } from 'bun:test'
import { http, HttpResponse } from 'msw'

import { CDN_BASE } from '@/lib/cdn'
import { setupMockServer } from '@/test-utils/mock-server'

import { readImageBytes } from './image-source'

const server = setupMockServer()

function countRequests() {
    const requests = mock()
    server.events.removeAllListeners()
    server.events.on('request:start', requests)
    return requests
}

test('retries a transient CDN failure', async () => {
    server.use(
        http.get(
            `${CDN_BASE}/images/a.webp`,
            () => new HttpResponse(null, { status: 503 }),
            { once: true }
        ),
        http.get(`${CDN_BASE}/images/a.webp`, () =>
            HttpResponse.arrayBuffer(new Uint8Array([1, 2, 3]).buffer)
        )
    )
    const requests = countRequests()
    expect([...(await readImageBytes('/images/a.webp'))]).toEqual([1, 2, 3])
    expect(requests).toHaveBeenCalledTimes(2)
})

test('fails the build on a missing image without retrying', async () => {
    server.use(
        http.get(
            `${CDN_BASE}/images/missing.webp`,
            () => new HttpResponse(null, { status: 404 })
        )
    )
    const requests = countRequests()
    const failure = await readImageBytes('/images/missing.webp').catch(
        (error: unknown) => error
    )
    expect(failure).toBeInstanceOf(Error)
    expect(String(failure)).toContain('HTTP 404')
    expect(requests).toHaveBeenCalledTimes(1)
})

test.each([408, 429])('retries a %i from the CDN', async status => {
    server.use(
        http.get(
            `${CDN_BASE}/images/a.webp`,
            () => new HttpResponse(null, { status }),
            { once: true }
        ),
        http.get(`${CDN_BASE}/images/a.webp`, () =>
            HttpResponse.arrayBuffer(new Uint8Array([1]).buffer)
        )
    )
    const requests = countRequests()
    await readImageBytes('/images/a.webp')
    expect(requests).toHaveBeenCalledTimes(2)
})

test('retries a network failure', async () => {
    server.use(
        http.get(`${CDN_BASE}/images/a.webp`, () => HttpResponse.error(), {
            once: true,
        }),
        http.get(`${CDN_BASE}/images/a.webp`, () =>
            HttpResponse.arrayBuffer(new Uint8Array([7]).buffer)
        )
    )
    expect([...(await readImageBytes('/images/a.webp'))]).toEqual([7])
})
