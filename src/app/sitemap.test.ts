import { expect, test } from 'bun:test'

import { getPublishedPosts } from '@/features/content/content'
import { absoluteUrl } from '@/features/content/site'

import sitemap from './sitemap'

// A lastmod that changes on every build teaches crawlers to ignore it.
test('only dated content carries a last-modified date', () => {
    const entries = sitemap()
    const posts = new Set(
        getPublishedPosts().map(post => absoluteUrl(post.path))
    )
    for (const entry of entries) {
        if (posts.has(entry.url)) {
            expect(entry.lastModified).toBeInstanceOf(Date)
        } else {
            expect(entry).not.toHaveProperty('lastModified')
        }
    }
})

test('a post is last modified on its update date, else its publish date', () => {
    const [post] = getPublishedPosts()
    if (!post) throw new Error('fixture: no published post')
    const entry = sitemap().find(e => e.url === absoluteUrl(post.path))
    expect(entry?.lastModified).toEqual(new Date(post.updated ?? post.date))
})
