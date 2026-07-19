import { notFound } from 'next/navigation'

import { getProjectBySlug, projects } from '@/lib/content'
import { renderOgImage } from '@/lib/og'

export const size = { height: 630, width: 1200 }
export const contentType = 'image/jpeg'

export function generateStaticParams() {
    return projects.map(project => ({ slug: project.slug }))
}

export default async function Image({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const project = getProjectBySlug(slug)
    if (!project) notFound()
    return renderOgImage({
        eyebrow: project.category,
        segment: 'projects',
        title: project.title,
        ...(project.images[0] ? { cover: project.images[0].src } : {}),
    })
}
