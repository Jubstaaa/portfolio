import type { Element, Root } from 'hast'

import { expect, test } from 'bun:test'
import { http, HttpResponse } from 'msw'
import sharp from 'sharp'

import { CDN_BASE } from '@/lib/cdn'
import { setupMockServer } from '@/test-utils/mock-server'

import { readImageDimensions, stampImageDimensions } from './image-dimensions'

const server = setupMockServer()

function img(properties: Element['properties']): Element {
    return { children: [], properties, tagName: 'img', type: 'element' }
}

async function serveImage(src: string, width: number, height: number) {
    const png = await sharp({
        create: { background: '#000', channels: 3, height, width },
    })
        .png()
        .toBuffer()
    server.use(
        http.get(`${CDN_BASE}${src}`, () =>
            HttpResponse.arrayBuffer(new Uint8Array(png).buffer)
        )
    )
}

test('reads the intrinsic size of a CDN image', async () => {
    await serveImage('/images/a.png', 3, 2)
    expect(await readImageDimensions('/images/a.png')).toEqual({
        height: 2,
        width: 3,
    })
})

test('stamps the intrinsic size on every body image', async () => {
    await serveImage('/images/a.png', 3, 2)
    await serveImage('/images/b.png', 5, 4)
    const a = img({ src: '/images/a.png' })
    const b = img({ src: '/images/b.png' })
    const tree: Root = { children: [a, b], type: 'root' }
    await stampImageDimensions(tree)
    expect(a.properties).toMatchObject({ height: 2, width: 3 })
    expect(b.properties).toMatchObject({ height: 4, width: 5 })
})

test('keeps dimensions an author already wrote', async () => {
    const node = img({ height: 10, src: '/images/a.png', width: 20 })
    await stampImageDimensions({ children: [node], type: 'root' })
    expect(node.properties).toMatchObject({ height: 10, width: 20 })
})

test('fails the build on a body image that is not on the CDN', async () => {
    const tree: Root = {
        children: [img({ src: 'https://example.com/a.png' })],
        type: 'root',
    }
    const failure = await stampImageDimensions(tree).catch(
        (error: unknown) => error
    )
    expect(failure).toBeInstanceOf(Error)
    expect(String(failure)).toContain('/images/')
})

test('names the image when the CDN serves something that is not one', async () => {
    server.use(
        http.get(`${CDN_BASE}/images/broken.png`, () =>
            HttpResponse.text('<html>not an image</html>')
        )
    )
    const failure = await readImageDimensions('/images/broken.png').catch(
        (error: unknown) => error
    )
    expect(String(failure)).toContain('/images/broken.png')
})
