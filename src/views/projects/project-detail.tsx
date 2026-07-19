import type { Metadata } from 'next'

import { notFound } from 'next/navigation'

import { ContentDetail } from '@/components/content-detail'
import { ExternalLink } from '@/components/external-link'
import {
    getAdjacent,
    getAllProjects,
    getProjectBySlug,
    site,
} from '@/lib/content'
import {
    buildBreadcrumbJsonLd,
    buildMetadata,
    buildProjectJsonLd,
} from '@/lib/seo'

export function generateStaticParams() {
    return getAllProjects().map(project => ({ slug: project.slug }))
}

interface ProjectPageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({
    params,
}: ProjectPageProps): Promise<Metadata> {
    const { slug } = await params
    const project = getProjectBySlug(slug)
    if (!project) return {}
    return buildMetadata({
        authors: [site.name],
        description: project.summary,
        keywords: [project.title, project.category, ...project.stack],
        path: `/projects/${project.slug}`,
        title: project.title,
    })
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
    const { slug } = await params
    const project = getProjectBySlug(slug)
    if (!project) notFound()

    const cover = project.images[0]
    const { next, prev } = getAdjacent(getAllProjects(), project)

    return (
        <ContentDetail
            highlights={project.highlights}
            adjacent={{
                ariaLabel: 'Project navigation',
                ...(prev ? { prev } : {}),
                ...(next ? { next } : {}),
            }}
            header={{
                children: (
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm">
                        {project.url ? (
                            <ExternalLink showArrow href={project.url}>
                                live
                            </ExternalLink>
                        ) : null}
                        {project.repo ? (
                            <ExternalLink showArrow href={project.repo}>
                                source
                            </ExternalLink>
                        ) : null}
                    </div>
                ),
                lead: project.summary,
                meta: <span>{project.category}</span>,
                title: project.title,
                ...(project.stack.length > 0
                    ? {
                          tags: project.stack.map(s => (
                              <span key={s}>{s}</span>
                          )),
                      }
                    : {}),
            }}
            jsonLd={{
                breadcrumb: buildBreadcrumbJsonLd([
                    { name: 'Home', path: '/' },
                    { name: 'Projects', path: '/projects' },
                    { name: project.title, path: `/projects/${project.slug}` },
                ]),
                entity: buildProjectJsonLd(project),
                idPrefix: 'project',
                slug: project.slug,
            }}
            pathBar={{
                meta: project.category,
                path: `~/${site.handle}/projects/${project.slug}`,
            }}
            {...(project.body ? { body: project.body } : {})}
            {...(cover
                ? {
                      cover: {
                          alt: cover.alt,
                          height: cover.height ?? 0,
                          src: cover.src,
                          width: cover.width ?? 0,
                      },
                  }
                : {})}
        />
    )
}
