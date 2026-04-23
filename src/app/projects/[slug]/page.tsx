import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Mdx } from "@/components/Mdx";
import { PathBar } from "@/components/PathBar";
import { Prose } from "@/components/Prose";
import { ReadingProgress } from "@/components/ReadingProgress";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllProjects, getProjectBySlug, site, type Project } from "@/lib/content";
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

function adjacent(current: Project): { prev?: Project; next?: Project } {
  const list = getAllProjects();
  const index = list.findIndex((p) => p.slug === current.slug);
  return {
    ...(list[index + 1] ? { prev: list[index + 1]! } : {}),
    ...(list[index - 1] ? { next: list[index - 1]! } : {}),
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const cover = project.images[0];
  const { prev, next } = adjacent(project);

  return (
    <>
      <JsonLd data={buildProjectJsonLd(project)} />
      <ReadingProgress />
      <PathBar path={`~/${site.handle}/projects/${project.slug}`} meta={project.category} />
      <section className="container-default section-pad">
        <article className="mx-auto max-w-3xl min-w-0 space-y-8">
          <header className="space-y-4">
            <p className="text-muted-foreground flex flex-wrap items-center gap-x-3 text-xs">
              <span>{project.category}</span>
            </p>
            <div className="relative space-y-3">
              <h1
                className="text-foreground flex items-baseline gap-2 text-lg font-normal"
                style={{ viewTransitionName: `project-${project.slug}` }}
              >
                <span aria-hidden className="text-muted-foreground select-none">
                  #
                </span>
                <span>{project.title}</span>
              </h1>
              <div
                aria-hidden
                className="term-rule overflow-hidden text-sm leading-none whitespace-nowrap"
              >
                {"─".repeat(240)}
              </div>
            </div>
            <p className="text-foreground max-w-prose text-base leading-relaxed">
              {project.summary}
            </p>
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

          {cover ? (
            <div className="hairline relative aspect-[16/9] overflow-hidden rounded-md border">
              <Image
                src={cover.src}
                alt={cover.alt}
                fill
                priority
                sizes="(min-width: 1024px) 720px, 100vw"
                className="object-cover"
              />
            </div>
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

          {prev || next ? (
            <nav
              aria-label="Project navigation"
              className="hairline grid grid-cols-1 gap-4 border-t pt-8 md:grid-cols-2"
            >
              {prev ? (
                <Link
                  href={prev.path}
                  className="hover:text-foreground transition-token text-muted-foreground group block space-y-1"
                >
                  <span className="text-xs tracking-[0.18em] uppercase">← prev</span>
                  <span className="text-foreground group-hover:text-accent transition-token block truncate">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={next.path}
                  className="hover:text-foreground transition-token text-muted-foreground group block space-y-1 md:text-right"
                >
                  <span className="text-xs tracking-[0.18em] uppercase">next →</span>
                  <span className="text-foreground group-hover:text-accent transition-token block truncate">
                    {next.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          ) : null}
        </article>
      </section>
    </>
  );
}
