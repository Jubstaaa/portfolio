import { notFound } from 'next/navigation'

import { getAllProjects, getProjectBySlug } from '@/features/content/content'
import { renderOgImage } from '@/lib/og/og'

export function generateStaticParams() {
    return getAllProjects().map(project => ({ slug: project.slug }))
}

export default async function ProjectOgImage({
    params,
}: Pick<PageProps<'/projects/[slug]'>, 'params'>) {
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

export const dynamicParams = false
export const size = { height: 630, width: 1200 }
export const contentType = 'image/jpeg'
