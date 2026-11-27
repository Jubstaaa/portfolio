import { describe, expect, test } from 'bun:test'

import { getAllProjects, getPublishedPosts } from '@/features/content/content'

describe.each([
    ['blog page', () => import('./blog/[slug]/page')],
    ['blog OG image', () => import('./blog/[slug]/opengraph-image')],
    ['project page', () => import('./projects/[slug]/page')],
    ['project OG image', () => import('./projects/[slug]/opengraph-image')],
])('%s', (_name, load) => {
    test('rejects slugs it did not prerender', async () => {
        const route = await load()
        expect(route.dynamicParams).toBe(false)
    })
})

describe('prerendered slugs', () => {
    test('blog routes cover exactly the published posts', async () => {
        const published = getPublishedPosts().map(post => ({ slug: post.slug }))
        const page = await import('./blog/[slug]/page')
        const og = await import('./blog/[slug]/opengraph-image')
        expect(page.generateStaticParams()).toEqual(published)
        expect(og.generateStaticParams()).toEqual(published)
    })

    test('project routes cover every project', async () => {
        const all = getAllProjects().map(project => ({ slug: project.slug }))
        const page = await import('./projects/[slug]/page')
        expect(page.generateStaticParams()).toEqual(all)
    })
})
