import type { Metadata } from 'next'

import Image from 'next/image'
import { notFound } from 'next/navigation'

import { AdjacentNav } from '@/components/adjacent-nav'
import { ArticleHeader } from '@/components/article-header'
import { ExternalLink } from '@/components/external-link'
import { JsonLd } from '@/components/json-ld'
import { Mdx } from '@/components/mdx'
import { PathBar } from '@/components/path-bar'
import { Prose } from '@/components/prose'
import { SectionHeading } from '@/components/section-heading'
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
        <>
            <JsonLd
                data={buildProjectJsonLd(project)}
                id={`ld-project-${project.slug}`}
            />
            <JsonLd
                id={`ld-breadcrumb-${project.slug}`}
                data={buildBreadcrumbJsonLd([
                    { name: 'Home', path: '/' },
                    { name: 'Projects', path: '/projects' },
                    { name: project.title, path: `/projects/${project.slug}` },
                ])}
            />
            <PathBar
                meta={project.category}
                path={`~/${site.handle}/projects/${project.slug}`}
            />
            <section className="container-default section-pad">
                <article className="mx-auto max-w-3xl min-w-0 space-y-8">
                    <ArticleHeader
                        lead={project.summary}
                        meta={<span>{project.category}</span>}
                        title={project.title}
                        {...(project.stack.length > 0
                            ? {
                                  tags: project.stack.map(s => (
                                      <span key={s}>{s}</span>
                                  )),
                              }
                            : {})}>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm">
                            {project.url ? (
                                <ExternalLink
                                    className="text-foreground hover:text-accent transition-token inline-flex items-center gap-1 underline underline-offset-4"
                                    href={project.url}>
                                    live
                                    <span aria-hidden className="select-none">
                                        ↗
                                    </span>
                                </ExternalLink>
                            ) : null}
                            {project.repo ? (
                                <ExternalLink
                                    className="text-foreground hover:text-accent transition-token inline-flex items-center gap-1 underline underline-offset-4"
                                    href={project.repo}>
                                    source
                                    <span aria-hidden className="select-none">
                                        ↗
                                    </span>
                                </ExternalLink>
                            ) : null}
                        </div>
                    </ArticleHeader>

                    {cover ? (
                        <Image
                            priority
                            alt={cover.alt}
                            className="hairline h-auto max-h-[500px] w-full rounded-md border object-contain"
                            height={cover.height ?? 0}
                            sizes="(min-width: 1024px) 720px, 100vw"
                            src={cover.src}
                            width={cover.width ?? 0}
                        />
                    ) : null}

                    {project.body ? (
                        <Prose>
                            <Mdx code={project.body} />
                        </Prose>
                    ) : null}

                    {project.highlights.length > 0 ? (
                        <div className="space-y-4">
                            <SectionHeading title="highlights" />
                            <ul className="text-foreground space-y-2">
                                {project.highlights.map(h => (
                                    <li key={h} className="arrow-bullet">
                                        {h}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    <AdjacentNav
                        {...(prev ? { prev } : {})}
                        {...(next ? { next } : {})}
                        ariaLabel="Project navigation"
                    />
                </article>
            </section>
        </>
    )
}
