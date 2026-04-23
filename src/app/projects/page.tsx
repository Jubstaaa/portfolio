import type { Metadata } from "next";

import { PathBar } from "@/components/PathBar";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFilters } from "@/components/ProjectFilters";
import { SectionHeading } from "@/components/SectionHeading";
import {
  filterProjects,
  getAllProjectCategories,
  getAllProjectStacks,
  site,
  type ProjectCategory,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description: "Selected work.",
  path: "/projects",
});

const VALID_CATEGORIES: ReadonlyArray<ProjectCategory> = [
  "web",
  "mobile",
  "tool",
  "library",
  "other",
];

interface ProjectsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parseCategory(raw: string | string[] | undefined): ProjectCategory | undefined {
  if (typeof raw !== "string") return undefined;
  return (VALID_CATEGORIES as ReadonlyArray<string>).includes(raw)
    ? (raw as ProjectCategory)
    : undefined;
}

function parseStack(raw: string | string[] | undefined, all: string[]): string[] {
  if (typeof raw !== "string" || raw.length === 0) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => all.includes(s));
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const allCategories = getAllProjectCategories();
  const allStacks = getAllProjectStacks();

  const category = parseCategory(params.category);
  const stack = parseStack(params.stack, allStacks);
  const projects = filterProjects({
    ...(category ? { category } : {}),
    ...(stack.length ? { stack } : {}),
  });

  return (
    <>
      <PathBar
        path={`~/${site.handle}/projects`}
        meta={`${projects.length} ${projects.length === 1 ? "entry" : "entries"}${
          category || stack.length ? " · filtered" : ""
        }`}
      />
      <section className="container-default section-pad space-y-10">
        <SectionHeading
          as="h1"
          title="projects"
          number="01"
          description="Shipped products, tools, and side projects. Filter by category and stack below."
        />
        <ProjectFilters categories={allCategories} stacks={allStacks} />
        {projects.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            <span aria-hidden className="mr-1 select-none">
              →
            </span>
            no projects match the current filters
          </p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
