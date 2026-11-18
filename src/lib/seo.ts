import type { Metadata } from 'next'

import { pickBy } from 'lodash-es'

import { cdnUrl } from '@/lib/cdn'
import { type Post, type Project, site } from '@/lib/content'
import { absoluteUrl, ogLocale } from '@/lib/site'

// Content image paths are relative in frontmatter but only resolve on the CDN, so
// structured data has to name the bucket URL rather than a site path that redirects.
function absoluteImageUrl(src: string): string {
    return absoluteUrl(cdnUrl(src))
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

    const base = {
        description,
        locale: ogLocale,
        siteName: site.name,
        title: input.title,
        url,
        ...(images ? { images } : {}),
    }
    const openGraph: Metadata['openGraph'] =
        type === 'article'
            ? {
                  ...base,
                  type: 'article',
                  ...pickBy(
                      {
                          authors: input.authors,
                          modifiedTime: input.modifiedTime,
                          publishedTime: input.publishedTime,
                          section: input.section,
                          tags: input.tags,
                      },
                      value => value !== undefined
                  ),
              }
            : { ...base, type: 'website' }

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
        'author': { '@type': 'Person', 'name': site.name, 'url': site.url },
        'dateModified': post.updated ?? post.date,
        'datePublished': post.date,
        'description': post.description,
        'headline': post.title,
        'url': absoluteUrl(post.path),
        ...(post.cover ? { image: absoluteImageUrl(post.cover.src) } : {}),
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
        'url': absoluteUrl(project.path),
        ...(project.repo ? { codeRepository: project.repo } : {}),
        ...(cover ? { image: absoluteImageUrl(cover.src) } : {}),
        'keywords': project.stack.join(', '),
    }
}
