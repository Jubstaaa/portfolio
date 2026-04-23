import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";

export interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const cover = project.images[0];
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "hairline group block border bg-[color:var(--card)] transition-[border-color,transform] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-[color:var(--foreground)]/30",
        className,
      )}
    >
      {cover ? (
        <div className="relative aspect-[16/10] overflow-hidden border-b">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover:scale-[1.02]"
          />
        </div>
      ) : null}
      <div className="space-y-3 p-5">
        <div className="flex items-baseline justify-between gap-4 text-xs">
          <span className="text-muted-foreground">
            {project.category}
            {project.status !== "shipped" ? (
              <>
                <span aria-hidden className="mx-2 select-none">
                  ·
                </span>
                <span className="text-warning">{project.status}</span>
              </>
            ) : null}
          </span>
          <span className="text-muted-foreground font-mono tracking-tight">{project.year}</span>
        </div>
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
    </Link>
  );
}
