import type { MetadataRoute } from 'next'

import { getAllProjects, getPublishedPosts } from '@/features/content/content'
import { absoluteUrl } from '@/features/content/site'

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            changeFrequency: 'weekly',
            priority: 1,
            url: absoluteUrl('/'),
        },
        {
            changeFrequency: 'monthly',
            priority: 0.8,
            url: absoluteUrl('/about'),
        },
        {
            changeFrequency: 'weekly',
            priority: 0.9,
            url: absoluteUrl('/projects'),
        },
        {
            changeFrequency: 'weekly',
            priority: 0.9,
            url: absoluteUrl('/blog'),
        },
        {
            changeFrequency: 'monthly',
            priority: 0.6,
            url: absoluteUrl('/contact'),
        },
    ]

    const projectRoutes: MetadataRoute.Sitemap = getAllProjects().map(
        project => ({
            changeFrequency: 'monthly',
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
