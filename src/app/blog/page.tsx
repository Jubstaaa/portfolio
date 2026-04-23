import type { Metadata } from "next";

import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing on frontend engineering, performance, and tooling.",
};

export default function BlogPage() {
  return (
    <section className="container-default section-pad">
      <SectionHeading
        as="h1"
        eyebrow="Blog"
        title="Notes on frontend, performance, and tooling."
        description="MDX posts with ToC, reading time, Shiki highlighting, and RSS arrive in S04."
      />
    </section>
  );
}
