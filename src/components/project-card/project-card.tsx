import { ContentCard } from '@/components/content-card'
import type { Project } from '@/lib/content'

export interface ProjectCardProps {
    className?: string
    project: Project
}

export function ProjectCard({ className, project }: ProjectCardProps) {
    return (
        <ContentCard
            description={project.summary}
            href={`/projects/${project.slug}`}
            meta={<span>{project.category}</span>}
            title={project.title}
            {...(project.stack.length > 0
                ? { tags: project.stack.map(s => <span key={s}>{s}</span>) }
                : {})}
            {...(className ? { className } : {})}
        />
    )
}
