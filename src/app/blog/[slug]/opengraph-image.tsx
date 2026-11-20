import { notFound } from 'next/navigation'

import { getPostBySlug, getPublishedPosts } from '@/features/content/content'
import { renderOgImage } from '@/features/content/og/og'
import { formatDate } from '@/lib/format'

export default async function BlogOgImage({
    params,
}: Pick<PageProps<'/blog/[slug]'>, 'params'>) {
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

export const dynamicParams = false
export const size = { height: 630, width: 1200 }
export const contentType = 'image/jpeg'
