import { describe, expect, test } from 'bun:test'

import { site } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

describe('buildMetadata', () => {
    test('a website page gets an absolute canonical matching og:url', () => {
        const metadata = buildMetadata({ path: '/blog', title: 'Blog' })
        const canonical = new URL('/blog', site.url).toString()
        expect(metadata.alternates?.canonical).toBe(canonical)
        expect(metadata.openGraph).toEqual({
            description: site.description,
            locale: expect.any(String),
            siteName: site.name,
            title: 'Blog',
            type: 'website',
            url: canonical,
        })
    })

    test('an article carries only the article fields it was given', () => {
        const metadata = buildMetadata({
            authors: ['a'],
            path: '/blog/x',
            publishedTime: '2026-01-01',
            tags: ['t'],
            title: 'X',
            type: 'article',
        })
        expect(metadata.openGraph).toMatchObject({
            authors: ['a'],
            publishedTime: '2026-01-01',
            tags: ['t'],
            type: 'article',
        })
        expect(metadata.openGraph).not.toHaveProperty('modifiedTime')
        expect(metadata.openGraph).not.toHaveProperty('section')
    })

    test('an og image is shared with twitter', () => {
        const metadata = buildMetadata({ ogImage: '/og.png', title: 'X' })
        expect(metadata.openGraph).toMatchObject({
            images: [{ url: '/og.png' }],
        })
        expect(metadata.twitter).toMatchObject({ images: [{ url: '/og.png' }] })
    })
})
