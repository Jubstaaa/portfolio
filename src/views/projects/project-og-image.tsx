import { notFound } from 'next/navigation'

import { getAllProjects, getProjectBySlug } from '@/lib/content'
import { renderOgImage } from '@/lib/og'

import type { ProjectPageProps } from './project-detail.types'

export function generateStaticParams() {
    return getAllProjects().map(project => ({ slug: project.slug }))
}

export default async function ProjectOgImage({ params }: ProjectPageProps) {
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
