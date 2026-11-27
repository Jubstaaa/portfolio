import { expect, test } from 'bun:test'
import { http, HttpResponse } from 'msw'
import sharp from 'sharp'

import { CDN_BASE } from '@/lib/cdn'
import { setupMockServer } from '@/test-utils/mock-server'

import { imageSchema } from './image-schema'

const server = setupMockServer()

test('stamps the intrinsic size on a CDN image', async () => {
    const png = await sharp({
        create: { background: '#000', channels: 3, height: 2, width: 3 },
    })
        .png()
        .toBuffer()
    server.use(
        http.get(`${CDN_BASE}/images/a.png`, () =>
            HttpResponse.arrayBuffer(new Uint8Array(png).buffer)
        )
    )
    expect(
        await imageSchema.parseAsync({ alt: 'a', src: '/images/a.png' })
    ).toEqual({ alt: 'a', height: 2, src: '/images/a.png', width: 3 })
})

test.each(['https://example.com/a.png', 'a.png', '/other/a.png'])(
    'rejects %p, which is not on the CDN',
    async src => {
        expect(
            await imageSchema.safeParseAsync({ alt: 'a', src })
        ).toMatchObject({ success: false })
    }
)
