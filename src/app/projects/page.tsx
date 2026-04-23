import type { Metadata } from "next";

import { PathBar } from "@/components/PathBar";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllProjects, site } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description:
    "Selected projects by İlker Balcılar — web apps, open-source developer tools, mobile apps, and games built with TypeScript, Next.js, React Native, Hono, and Node.js.",
  path: "/projects",
  keywords: [
    "ilker balcilar projects",
    "nextjs projects",
    "typescript portfolio",
    "react native",
    "open source",
    "hono telescope",
    "prosbase",
  ],
});

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <>
      <PathBar
        path={`~/${site.handle}/projects`}
        meta={`${projects.length} ${projects.length === 1 ? "entry" : "entries"}`}
      />
      <section className="container-default section-pad space-y-10">
        <SectionHeading
          as="h1"
          title="projects"
          number="01"
          description="Shipped products, tools, and side projects."
        />
        <ol className="divide-border hairline flex flex-col divide-y border-t">
          {projects.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
