import type { Metadata } from 'next'

import { PathBar } from '@/components/path-bar'
import { SectionHeading } from '@/components/section-heading'
import { getAllProjects } from '@/features/content/content'
import { ContentCard } from '@/features/content/content-card'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
    description:
        'Selected projects by İlker Balcılar — web apps, open-source developer tools, mobile apps, and games built with TypeScript, Next.js, React Native, Hono, and Node.js.',
    keywords: [
        'ilker balcilar projects',
        'nextjs projects',
        'typescript portfolio',
        'react native',
        'open source',
        'hono telescope',
        'prosbase',
    ],
    path: '/projects',
    title: 'Projects',
})

export default function ProjectsListPage() {
    const projects = getAllProjects()

    return (
        <>
            <PathBar
                meta={`${projects.length} ${projects.length === 1 ? 'entry' : 'entries'}`}
                segment="projects"
            />
            <section className="container-default section-pad space-y-10">
                <SectionHeading
                    as="h1"
                    description="Shipped products, tools, and side projects."
                    number="01"
                    title="projects"
                />
                <ol className="divide-border hairline flex flex-col divide-y border-t">
                    {projects.map(project => (
                        <li key={project.slug}>
                            <ContentCard
                                description={project.summary}
                                href={project.path}
                                meta={<span>{project.category}</span>}
                                title={project.title}
                                {...(project.stack.length > 0
                                    ? {
                                          tags: project.stack.map(s => (
                                              <span key={s}>{s}</span>
                                          )),
                                      }
                                    : {})}
                            />
                        </li>
                    ))}
                </ol>
            </section>
        </>
    )
}
