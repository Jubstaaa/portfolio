import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PathBar } from "@/components/PathBar";
import { MarkdownProse } from "@/components/Prose";
import { ProjectGallery } from "@/components/ProjectGallery";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllProjects, getProjectBySlug, site } from "@/lib/content";
import { buildMetadata, buildProjectJsonLd, JsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return buildMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    ...(project.images[0] ? { ogImage: project.images[0].src } : {}),
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      <PathBar path={`~/${site.handle}/projects/${project.slug}`} meta={project.role} />
      <section className="container-default section-pad space-y-10">
        <header className="max-w-3xl space-y-4">
          <p className="text-muted-foreground flex items-center gap-2 text-xs tracking-[0.18em] uppercase">
            <span>{project.category}</span>
            {project.status !== "shipped" ? (
              <>
                <span aria-hidden className="select-none">
                  ·
                </span>
                <span className="text-warning">{project.status}</span>
              </>
            ) : null}
          </p>
          <SectionHeading as="h1" title={project.title} />
          <p className="text-foreground max-w-prose text-base leading-relaxed">{project.summary}</p>
          {project.stack.length > 0 ? (
            <p className="text-muted-foreground flex flex-wrap gap-x-3 text-xs">
              {project.stack.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm">
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-foreground hover:text-accent transition-token inline-flex items-center gap-1 underline underline-offset-4"
              >
                live
                <span aria-hidden className="select-none">
                  ↗
                </span>
              </a>
            ) : null}
            {project.repo ? (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="text-foreground hover:text-accent transition-token inline-flex items-center gap-1 underline underline-offset-4"
              >
                source
                <span aria-hidden className="select-none">
                  ↗
                </span>
              </a>
            ) : null}
          </div>
        </header>

        <ProjectGallery
          images={project.images}
          firstViewTransitionName={`project-${project.slug}`}
          className="max-w-3xl"
        />

        {project.description ? (
          <MarkdownProse html={project.description} className="max-w-3xl" />
        ) : null}

        {project.highlights.length > 0 ? (
          <div className="max-w-3xl space-y-4">
            <SectionHeading title="highlights" />
            <ul className="text-foreground space-y-2">
              {project.highlights.map((h) => (
                <li
                  key={h}
                  className="before:text-muted-foreground pl-[1.5ch] before:mr-[0.5ch] before:-ml-[1.5ch] before:content-['→'] before:select-none"
                >
                  {h}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
      <JsonLd data={buildProjectJsonLd(project)} />
    </>
  );
}
