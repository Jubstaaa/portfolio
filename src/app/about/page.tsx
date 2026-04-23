import type { Metadata } from "next";

import { PathBar } from "@/components/PathBar";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Background, experience, and what I work on.",
};

export default function AboutPage() {
  return (
    <>
      <PathBar path={`~/${site.handle}/about`} meta="last updated 2026-04-23" />
      <section className="container-default section-pad">
        <SectionHeading
          as="h1"
          title="about"
          number="01"
          description="Long-form bio, timeline, and education arrive in S02 (content pipeline) and S03 (about layout)."
        />
      </section>
    </>
  );
}
