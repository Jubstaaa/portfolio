import { afterEach, expect, mock, spyOn, test } from 'bun:test'

import { readImageBytes } from './image-source'

afterEach(() => mock.restore())

test('retries a transient CDN failure', async () => {
    const fetchSpy = spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(new Response(null, { status: 503 }))
        .mockResolvedValueOnce(new Response(new Uint8Array([1, 2, 3])))
    const bytes = await readImageBytes('/images/a.webp')
    expect([...bytes]).toEqual([1, 2, 3])
    expect(fetchSpy).toHaveBeenCalledTimes(2)
})

test('fails the build on a missing image without retrying', async () => {
    const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(null, { status: 404 })
    )
    await expect(readImageBytes('/images/missing.webp')).rejects.toThrow(
        'HTTP 404'
    )
    expect(fetchSpy).toHaveBeenCalledTimes(1)
})

test('bounds each request with a timeout', async () => {
    const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(new Uint8Array([1]))
    )
    await readImageBytes('/images/a.webp')
    expect(fetchSpy.mock.calls[0]?.[1]?.signal).toBeInstanceOf(AbortSignal)
})

test.each([408, 429])('retries a %i from the CDN', async status => {
    const fetchSpy = spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(new Response(null, { status }))
        .mockResolvedValueOnce(new Response(new Uint8Array([1])))
    await readImageBytes('/images/a.webp')
    expect(fetchSpy).toHaveBeenCalledTimes(2)
})
