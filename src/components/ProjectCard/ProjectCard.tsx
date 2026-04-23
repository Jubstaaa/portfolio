import { ViewTransitionLink } from "@/components/ViewTransitionLink";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";

export interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const vtName = `project-${project.slug}`;

  return (
    <ViewTransitionLink
      href={`/projects/${project.slug}`}
      className={cn(
        "hairline group block border-b py-6 transition-[border-color] duration-[var(--duration-base)] ease-[var(--ease-out)]",
        className,
      )}
    >
      <p className="text-muted-foreground flex flex-wrap items-center gap-x-3 text-xs">
        <span>{project.category}</span>
      </p>
      <h2
        className="text-foreground group-hover:text-accent transition-token mt-2 text-lg font-semibold tracking-tight"
        style={{ viewTransitionName: vtName }}
      >
        {project.title}
      </h2>
      <p className="text-muted-foreground mt-1 max-w-prose text-sm">{project.summary}</p>
      {project.stack.length > 0 ? (
        <p className="text-muted-foreground mt-2 flex flex-wrap gap-x-3 text-xs">
          {project.stack.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </p>
      ) : null}
    </ViewTransitionLink>
  );
}
