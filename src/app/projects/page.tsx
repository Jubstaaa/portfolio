import type { Metadata } from "next";

import { PathBar } from "@/components/PathBar";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected work.",
};

export default function ProjectsPage() {
  return (
    <>
      <PathBar path={`~/${site.handle}/projects`} meta="0 entries · all years" />
      <section className="container-default section-pad">
        <SectionHeading
          as="h1"
          title="projects"
          number="01"
          description="Project grid with category and stack filters arrives in S03."
        />
      </section>
    </>
  );
}
