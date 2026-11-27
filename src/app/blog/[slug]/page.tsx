import type { Metadata } from 'next'

import { notFound } from 'next/navigation'

import { PostMeta } from '@/app/blog/_components/post-meta'
import {
    getAdjacent,
    getPostBySlug,
    getPublishedPosts,
    site,
} from '@/features/content/content'
import { ContentDetail } from '@/features/content/content-detail'
import {
    buildArticleJsonLd,
    buildBreadcrumbJsonLd,
    buildMetadata,
} from '@/features/content/seo'
import { formatDate } from '@/lib/format'

export default async function BlogDetailPage({
    params,
}: PageProps<'/blog/[slug]'>) {
    const { slug } = await params
    const post = getPostBySlug(slug)
    if (!post) notFound()

    const { next, prev } = getAdjacent(getPublishedPosts(), post)

    return (
        <ContentDetail
            adjacent={{
                ariaLabel: 'Post navigation',
                ...(prev ? { prev } : {}),
                ...(next ? { next } : {}),
            }}
            body={post.body}
            header={{
                lead: post.description,
                meta: <PostMeta category={post.category} date={post.date} />,
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
                          height: post.cover.height,
                          src: post.cover.src,
                          width: post.cover.width,
                      },
                  }
                : {})}
        />
    )
}

export async function generateMetadata({
    params,
}: PageProps<'/blog/[slug]'>): Promise<Metadata> {
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

export function generateStaticParams() {
    return getPublishedPosts().map(post => ({ slug: post.slug }))
}

export const dynamicParams = false
