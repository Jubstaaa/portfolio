import type { Metadata } from 'next'

import { notFound } from 'next/navigation'

import { ContentDetail } from '@/components/content-detail/content-detail'
import {
    getAdjacent,
    getPostBySlug,
    getPublishedPosts,
    posts,
    site,
} from '@/lib/content'
import { formatDate } from '@/lib/format'
import {
    buildArticleJsonLd,
    buildBreadcrumbJsonLd,
    buildMetadata,
} from '@/lib/seo'

import type { PostPageProps } from './blog-detail.types'

export function generateStaticParams() {
    return posts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({
    params,
}: PostPageProps): Promise<Metadata> {
    const { slug } = await params
    const post = getPostBySlug(slug)
    if (!post) return {}
    return buildMetadata({
        authors: [site.name],
        description: post.description,
        keywords: post.tags,
        modifiedTime: post.updated ?? post.date,
        path: post.path,
        publishedTime: post.date,
        section: post.category,
        tags: post.tags,
        title: post.title,
        type: 'article',
    })
}

export default async function BlogDetailPage({ params }: PostPageProps) {
    const { slug } = await params
    const post = getPostBySlug(slug)
    if (!post) notFound()

    const { next, prev } = getAdjacent(getPublishedPosts(), post)

    return (
        <ContentDetail
            body={post.body}
            adjacent={{
                ariaLabel: 'Post navigation',
                ...(prev ? { prev } : {}),
                ...(next ? { next } : {}),
            }}
            header={{
                lead: post.description,
                meta: (
                    <>
                        <span className="font-mono tracking-tight">
                            {formatDate(post.date)}
                        </span>
                        <span aria-hidden className="select-none">
                            ·
                        </span>
                        <span>{post.category}</span>
                    </>
                ),
                title: post.title,
                ...(post.tags.length > 0
                    ? {
                          tags: post.tags.map(tag => (
                              <span key={tag}>#{tag}</span>
                          )),
                      }
                    : {}),
            }}
            jsonLd={{
                breadcrumb: buildBreadcrumbJsonLd([
                    { name: 'Home', path: '/' },
                    { name: 'Blog', path: '/blog' },
                    { name: post.title, path: post.path },
                ]),
                entity: buildArticleJsonLd(post),
                idPrefix: 'article',
                slug: post.slug,
            }}
            pathBar={{
                meta: `${formatDate(post.date)} · ${post.category}`,
                segment: `blog/${post.slug}`,
            }}
            {...(post.cover && post.showCover
                ? {
                      cover: {
                          alt: post.cover.alt,
                          height: post.cover.height ?? 0,
                          src: post.cover.src,
                          width: post.cover.width ?? 0,
                      },
                  }
                : {})}
        />
    )
}
