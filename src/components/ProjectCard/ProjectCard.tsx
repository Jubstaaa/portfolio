import Image from "next/image";

import { ViewTransitionLink } from "@/components/ViewTransitionLink";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";

export interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const cover = project.images[0];
  const vtName = `project-${project.slug}`;

  return (
    <ViewTransitionLink
      href={`/projects/${project.slug}`}
      className={cn(
        "hairline block border bg-[color:var(--card)] transition-[border-color] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-[color:var(--foreground)]/30",
        className,
      )}
    >
      {cover ? (
        <div
          className="relative aspect-[16/10] overflow-hidden border-b"
          style={{ viewTransitionName: vtName }}
        >
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="space-y-3 p-5">
        <p className="text-muted-foreground text-xs">{project.category}</p>
        <h3 className="text-foreground text-base font-semibold tracking-tight">{project.title}</h3>
        <p className="text-muted-foreground line-clamp-2 text-sm">{project.summary}</p>
        {project.stack.length > 0 ? (
          <p className="text-muted-foreground flex flex-wrap gap-x-3 text-xs">
            {project.stack.slice(0, 4).map((s) => (
              <span key={s}>{s}</span>
            ))}
            {project.stack.length > 4 ? <span>+{project.stack.length - 4}</span> : null}
          </p>
        ) : null}
      </div>
    </ViewTransitionLink>
  );
}
