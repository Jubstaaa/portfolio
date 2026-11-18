import { notFound } from 'next/navigation'

import { getPostBySlug, getPublishedPosts } from '@/lib/content'
import { formatDate } from '@/lib/format'
import { renderOgImage } from '@/lib/og'

import type { PostPageProps } from './blog-detail.types'

export default async function BlogOgImage({ params }: PostPageProps) {
    const { slug } = await params
    const post = getPostBySlug(slug)
    if (!post) notFound()
    return renderOgImage({
        eyebrow: `${post.category} · ${formatDate(post.date)}`,
        segment: 'blog',
        title: post.title,
        ...(post.cover ? { cover: post.cover.src } : {}),
    })
}

export function generateStaticParams() {
    return getPublishedPosts().map(post => ({ slug: post.slug }))
}
