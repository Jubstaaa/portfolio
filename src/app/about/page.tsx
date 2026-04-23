import type { Metadata } from "next";

import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "About",
  description: "Background, experience, and what I work on.",
};

export default function AboutPage() {
  return (
    <section className="container-default section-pad">
      <SectionHeading
        as="h1"
        eyebrow="About"
        title="Bio, experience, skills."
        description="Long-form bio, timeline, and education arrive in S02 (content pipeline) and S03 (about layout)."
      />
    </section>
  );
}
