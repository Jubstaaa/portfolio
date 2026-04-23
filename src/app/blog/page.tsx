import type { Metadata } from "next";

import { PathBar } from "@/components/PathBar";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing on frontend engineering, performance, and tooling.",
};

export default function BlogPage() {
  return (
    <>
      <PathBar path={`~/${site.handle}/blog`} meta="0 posts · rss available" />
      <section className="container-default section-pad">
        <SectionHeading
          as="h1"
          title="blog"
          number="01"
          description="MDX posts with ToC, reading time, Shiki highlighting, and RSS arrive in S04."
        />
      </section>
    </>
  );
}
