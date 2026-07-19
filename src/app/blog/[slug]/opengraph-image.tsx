import { notFound } from 'next/navigation'

import { getPostBySlug, posts } from '@/lib/content'
import { formatDate } from '@/lib/format'
import { renderOgImage } from '@/lib/og'

export const size = { height: 630, width: 1200 }
export const contentType = 'image/jpeg'

export function generateStaticParams() {
    return posts.map(post => ({ slug: post.slug }))
}

export default async function Image({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
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
