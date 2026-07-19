import type { MetadataRoute } from 'next'

import { getAllProjects, getPublishedPosts, site } from '@/lib/content'

function absolute(path: string): string {
    return new URL(path, site.url).toString()
}

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date()

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            changeFrequency: 'weekly',
            lastModified: now,
            priority: 1,
            url: absolute('/'),
        },
        {
            changeFrequency: 'monthly',
            lastModified: now,
            priority: 0.8,
            url: absolute('/about'),
        },
        {
            changeFrequency: 'weekly',
            lastModified: now,
            priority: 0.9,
            url: absolute('/projects'),
        },
        {
            changeFrequency: 'weekly',
            lastModified: now,
            priority: 0.9,
            url: absolute('/blog'),
        },
        {
            changeFrequency: 'monthly',
            lastModified: now,
            priority: 0.6,
            url: absolute('/contact'),
        },
    ]

    const projectRoutes: MetadataRoute.Sitemap = getAllProjects().map(
        project => ({
            changeFrequency: 'monthly',
            lastModified: now,
            priority: 0.7,
            url: absolute(`/projects/${project.slug}`),
        })
    )

    const postRoutes: MetadataRoute.Sitemap = getPublishedPosts().map(post => ({
        changeFrequency: 'monthly',
        lastModified: new Date(post.updated ?? post.date),
        priority: 0.7,
        url: absolute(post.path),
    }))

    return [...staticRoutes, ...projectRoutes, ...postRoutes]
}
