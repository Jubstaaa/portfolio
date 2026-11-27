import type { Metadata } from 'next'

import { notFound } from 'next/navigation'

import { ExternalLink } from '@/components/external-link'
import {
    getAdjacent,
    getAllProjects,
    getProjectBySlug,
    site,
} from '@/features/content/content'
import { ContentDetail } from '@/features/content/content-detail'
import {
    buildBreadcrumbJsonLd,
    buildMetadata,
    buildProjectJsonLd,
} from '@/features/content/seo'

export async function generateMetadata({
    params,
}: PageProps<'/projects/[slug]'>): Promise<Metadata> {
    const { slug } = await params
    const project = getProjectBySlug(slug)
    if (!project) return {}
    return buildMetadata({
        authors: [site.name],
        description: project.summary,
        keywords: [project.title, project.category, ...project.stack],
        path: project.path,
        title: project.title,
    })
}

export function generateStaticParams() {
    return getAllProjects().map(project => ({ slug: project.slug }))
}

export default async function ProjectDetailPage({
    params,
}: PageProps<'/projects/[slug]'>) {
    const { slug } = await params
    const project = getProjectBySlug(slug)
    if (!project) notFound()

    const cover = project.images[0]
    const { next, prev } = getAdjacent(
        getAllProjects(),
        project,
        'display-order'
    )

    return (
        <ContentDetail
            adjacent={{
                ariaLabel: 'Project navigation',
                ...(prev ? { prev } : {}),
                ...(next ? { next } : {}),
            }}
            header={{
                children: (
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm">
                        {project.url ? (
                            <ExternalLink href={project.url} showArrow>
                                live
                            </ExternalLink>
                        ) : null}
                        {project.repo ? (
                            <ExternalLink href={project.repo} showArrow>
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
            highlights={project.highlights}
            jsonLd={{
                breadcrumb: buildBreadcrumbJsonLd([
                    { name: 'Home', path: '/' },
                    { name: 'Projects', path: '/projects' },
                    { name: project.title, path: project.path },
                ]),
                entity: buildProjectJsonLd(project),
                idPrefix: 'project',
                slug: project.slug,
            }}
            pathBar={{
                meta: project.category,
                segment: `projects/${project.slug}`,
            }}
            {...(project.body ? { body: project.body } : {})}
            {...(cover
                ? {
                      cover: {
                          alt: cover.alt,
                          height: cover.height,
                          src: cover.src,
                          width: cover.width,
                      },
                  }
                : {})}
        />
    )
}

// Unknown slugs 404 instead of rendering on demand.
export const dynamicParams = false
