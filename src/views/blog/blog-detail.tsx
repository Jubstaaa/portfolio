import type { Metadata } from 'next'

import { notFound } from 'next/navigation'

import { AdjacentNav } from '@/components/adjacent-nav'
import { ArticleHeader } from '@/components/article-header'
import { ContentImage } from '@/components/content-image'
import { JsonLd } from '@/components/json-ld'
import { Mdx } from '@/components/mdx'
import { PathBar } from '@/components/path-bar'
import { Prose } from '@/components/prose'
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

export function generateStaticParams() {
    return posts.map(post => ({ slug: post.slug }))
}

interface PostPageProps {
    params: Promise<{ slug: string }>
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
        <>
            <JsonLd
                data={buildArticleJsonLd(post)}
                id={`ld-article-${post.slug}`}
            />
            <JsonLd
                id={`ld-breadcrumb-${post.slug}`}
                data={buildBreadcrumbJsonLd([
                    { name: 'Home', path: '/' },
                    { name: 'Blog', path: '/blog' },
                    { name: post.title, path: post.path },
                ])}
            />
            <PathBar
                meta={`${formatDate(post.date)} · ${post.category}`}
                path={`~/${site.handle}/blog/${post.slug}`}
            />
            <section className="container-default section-pad">
                <article className="mx-auto max-w-3xl min-w-0 space-y-8">
                    <ArticleHeader
                        lead={post.description}
                        title={post.title}
                        meta={
                            <>
                                <span className="font-mono tracking-tight">
                                    {formatDate(post.date)}
                                </span>
                                <span aria-hidden className="select-none">
                                    ·
                                </span>
                                <span>{post.category}</span>
                            </>
                        }
                        {...(post.tags.length > 0
                            ? {
                                  tags: post.tags.map(tag => (
                                      <span key={tag}>#{tag}</span>
                                  )),
                              }
                            : {})}
                    />

                    {post.cover && post.showCover ? (
                        <ContentImage
                            priority
                            alt={post.cover.alt}
                            height={post.cover.height ?? 0}
                            src={post.cover.src}
                            width={post.cover.width ?? 0}
                        />
                    ) : null}

                    <Prose>
                        <Mdx code={post.body} />
                    </Prose>

                    <AdjacentNav
                        {...(prev ? { prev } : {})}
                        {...(next ? { next } : {})}
                        ariaLabel="Post navigation"
                    />
                </article>
            </section>
        </>
    )
}
