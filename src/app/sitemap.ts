import type { MetadataRoute } from 'next'

import { getAllProjects, getPublishedPosts } from '@/features/content/content'
import { absoluteUrl } from '@/features/content/site'

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date()

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            changeFrequency: 'weekly',
            lastModified: now,
            priority: 1,
            url: absoluteUrl('/'),
        },
        {
            changeFrequency: 'monthly',
            lastModified: now,
            priority: 0.8,
            url: absoluteUrl('/about'),
        },
        {
            changeFrequency: 'weekly',
            lastModified: now,
            priority: 0.9,
            url: absoluteUrl('/projects'),
        },
        {
            changeFrequency: 'weekly',
            lastModified: now,
            priority: 0.9,
            url: absoluteUrl('/blog'),
        },
        {
            changeFrequency: 'monthly',
            lastModified: now,
            priority: 0.6,
            url: absoluteUrl('/contact'),
        },
    ]

    const projectRoutes: MetadataRoute.Sitemap = getAllProjects().map(
        project => ({
            changeFrequency: 'monthly',
            lastModified: now,
            priority: 0.7,
            url: absoluteUrl(project.path),
        })
    )

    const postRoutes: MetadataRoute.Sitemap = getPublishedPosts().map(post => ({
        changeFrequency: 'monthly',
        lastModified: new Date(post.updated ?? post.date),
        priority: 0.7,
        url: absoluteUrl(post.path),
    }))

    return [...staticRoutes, ...projectRoutes, ...postRoutes]
}
