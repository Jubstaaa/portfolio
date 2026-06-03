import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { AdjacentNav } from "@/components/AdjacentNav";
import { ArticleHeader } from "@/components/ArticleHeader";
import { Mdx } from "@/components/Mdx";
import { PathBar } from "@/components/PathBar";
import { Prose } from "@/components/Prose";
import { SectionHeading } from "@/components/SectionHeading";
import { getAdjacent, getAllProjects, getProjectBySlug, site } from "@/lib/content";
import { JsonLd } from "@/components/JsonLd";
import { buildBreadcrumbJsonLd, buildMetadata, buildProjectJsonLd } from "@/lib/seo";

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
    authors: [site.name],
    keywords: [project.title, project.category, ...project.stack],
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const cover = project.images[0];
  const { prev, next } = getAdjacent(getAllProjects(), project);

  return (
    <>
      <JsonLd id={`ld-project-${project.slug}`} data={buildProjectJsonLd(project)} />
      <JsonLd
        id={`ld-breadcrumb-${project.slug}`}
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
          { name: project.title, path: `/projects/${project.slug}` },
        ])}
      />
      <PathBar path={`~/${site.handle}/projects/${project.slug}`} meta={project.category} />
      <section className="container-default section-pad">
        <article className="mx-auto max-w-3xl min-w-0 space-y-8">
          <ArticleHeader
            meta={<span>{project.category}</span>}
            title={project.title}
            lead={project.summary}
            {...(project.stack.length > 0
              ? { tags: project.stack.map((s) => <span key={s}>{s}</span>) }
              : {})}
          >
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
          </ArticleHeader>

          {cover ? (
            <Image
              src={cover.src}
              alt={cover.alt}
              width={0}
              height={0}
              priority
              sizes="(min-width: 1024px) 720px, 100vw"
              className="hairline max-h-[500px] w-full rounded-md border object-contain"
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
                {project.highlights.map((h) => (
                  <li
                    key={h}
                    className="before:text-muted-foreground pl-[1.5ch] before:mr-[0.5ch] before:ml-[-1.5ch] before:content-['→'] before:select-none"
                  >
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
  );
}
