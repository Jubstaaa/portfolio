import { ContentCard } from "@/components/content-card";
import type { Project } from "@/lib/content";

export interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <ContentCard
      href={`/projects/${project.slug}`}
      meta={<span>{project.category}</span>}
      title={project.title}
      description={project.summary}
      {...(project.stack.length > 0
        ? { tags: project.stack.map((s) => <span key={s}>{s}</span>) }
        : {})}
      {...(className ? { className } : {})}
    />
  );
}
