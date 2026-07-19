import type { Metadata } from 'next'

import { type Post, type Project, site } from '@/lib/content'
import { ogLocale } from '@/lib/site'

function absoluteUrl(path: string): string {
    return new URL(path, site.url).toString()
}

interface BuildMetadataInput {
    authors?: string[]
    description?: string
    keywords?: string[]
    modifiedTime?: string
    ogImage?: string
    path?: string
    publishedTime?: string
    section?: string
    tags?: string[]
    title: string
    type?: 'website' | 'article'
}

export function buildMetadata(input: BuildMetadataInput): Metadata {
    const description = input.description ?? site.description
    const path = input.path ?? '/'
    const url = absoluteUrl(path)
    const images = input.ogImage ? [{ url: input.ogImage }] : undefined
    const type = input.type ?? 'website'

    const openGraph: Metadata['openGraph'] =
        type === 'article'
            ? {
                  description,
                  locale: ogLocale,
                  siteName: site.name,
                  title: input.title,
                  type: 'article',
                  url,
                  ...(input.publishedTime
                      ? { publishedTime: input.publishedTime }
                      : {}),
                  ...(input.modifiedTime
                      ? { modifiedTime: input.modifiedTime }
                      : {}),
                  ...(input.authors ? { authors: input.authors } : {}),
                  ...(input.section ? { section: input.section } : {}),
                  ...(input.tags ? { tags: input.tags } : {}),
                  ...(images ? { images } : {}),
              }
            : {
                  description,
                  locale: ogLocale,
                  siteName: site.name,
                  title: input.title,
                  type: 'website',
                  url,
                  ...(images ? { images } : {}),
              }

    return {
        description,
        title: input.title,
        ...(input.keywords && input.keywords.length > 0
            ? { keywords: input.keywords }
            : {}),
        ...(input.authors
            ? { authors: input.authors.map(name => ({ name })) }
            : {}),
        alternates: { canonical: url },
        openGraph,
        twitter: {
            card: 'summary_large_image',
            description,
            title: input.title,
            ...(images ? { images } : {}),
            creator: `@${site.handle}`,
        },
    }
}

export function buildPersonJsonLd(): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        'address': {
            '@type': 'PostalAddress',
            'addressLocality': site.location,
        },
        'email': `mailto:${site.email}`,
        'jobTitle': site.role,
        'name': site.name,
        'url': site.url,
    }
}

export function buildArticleJsonLd(post: Post): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'datePublished': post.date,
        'description': post.description,
        'headline': post.title,
        ...(post.updated
            ? { dateModified: post.updated }
            : { dateModified: post.date }),
        'author': { '@type': 'Person', 'name': site.name, 'url': site.url },
        'url': absoluteUrl(post.path),
        ...(post.cover ? { image: absoluteUrl(post.cover.src) } : {}),
        'articleSection': post.category,
        'inLanguage': 'en',
        'keywords': post.tags.join(', '),
        'mainEntityOfPage': absoluteUrl(post.path),
    }
}

export function buildBreadcrumbJsonLd(
    trail: Array<{ name: string; path: string }>
): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': trail.map((entry, i) => ({
            '@type': 'ListItem',
            'item': absoluteUrl(entry.path),
            'name': entry.name,
            'position': i + 1,
        })),
    }
}

export function buildProjectJsonLd(project: Project): Record<string, unknown> {
    const cover = project.images[0]
    return {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        'creator': { '@type': 'Person', 'name': site.name },
        'description': project.summary,
        'name': project.title,
        'url': absoluteUrl(`/projects/${project.slug}`),
        ...(project.repo ? { codeRepository: project.repo } : {}),
        ...(cover ? { image: absoluteUrl(cover.src) } : {}),
        'keywords': project.stack.join(', '),
    }
}
