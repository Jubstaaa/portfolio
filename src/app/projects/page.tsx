import type { Metadata } from "next";

import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected work.",
};

export default function ProjectsPage() {
  return (
    <section className="container-default section-pad">
      <SectionHeading
        as="h1"
        eyebrow="Projects"
        title="Selected work."
        description="Project grid with category and stack filters arrives in S03."
      />
    </section>
  );
}
