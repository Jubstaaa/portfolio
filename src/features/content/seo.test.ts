import { describe, expect, test } from 'bun:test'

import { getAllProjects, getPublishedPosts, site } from './content'
import { buildArticleJsonLd, buildMetadata, buildProjectJsonLd } from './seo'

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
})

describe('buildProjectJsonLd', () => {
    test('a project with a repository is SoftwareSourceCode', () => {
        const withRepo = getAllProjects().find(project => project.repo)
        if (!withRepo) throw new Error('fixture: no project with a repo')
        expect(buildProjectJsonLd(withRepo)).toMatchObject({
            '@type': 'SoftwareSourceCode',
            'codeRepository': withRepo.repo,
        })
    })

    test('a project without one stays a CreativeWork', () => {
        const withoutRepo = getAllProjects().find(project => !project.repo)
        if (!withoutRepo) throw new Error('fixture: no project without a repo')
        const jsonLd = buildProjectJsonLd(withoutRepo)
        expect(jsonLd['@type']).toBe('CreativeWork')
        expect(jsonLd).not.toHaveProperty('codeRepository')
    })
})

describe('buildArticleJsonLd', () => {
    test('declares the site language', () => {
        const [post] = getPublishedPosts()
        if (!post) throw new Error('fixture: no published post')
        expect(buildArticleJsonLd(post).inLanguage).toBe(site.locale)
    })
})
