import type { Metadata } from "next";

import { EducationList } from "@/components/EducationList";
import { Mdx } from "@/components/Mdx";
import { PathBar } from "@/components/PathBar";
import { Prose } from "@/components/Prose";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SkillsGrid } from "@/components/SkillsGrid";
import { StacksGrid } from "@/components/StacksGrid";
import { Timeline } from "@/components/Timeline";
import { about, getEducationSorted, getExperiencesSorted, site } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: `${site.role} · ${site.location}`,
  path: "/about",
});

export default function AboutPage() {
  const experiences = getExperiencesSorted();
  const educations = getEducationSorted();

  return (
    <>
      <PathBar path={`~/${site.handle}/about`} meta={`${site.role} · ${site.location}`} />
      <section className="container-default section-pad space-y-20">
        <div className="max-w-3xl space-y-10">
          <SectionHeading as="h1" title="bio" number="01" />
          <Prose>
            <Mdx code={about.body} />
          </Prose>
        </div>

        <Reveal className="space-y-6">
          <SectionHeading title="experience" number="02" />
          <Timeline items={experiences} />
        </Reveal>

        <Reveal className="space-y-6">
          <SectionHeading title="education" number="03" />
          <EducationList items={educations} />
        </Reveal>

        <Reveal className="space-y-6">
          <SectionHeading title="skills" number="04" />
          <SkillsGrid />
        </Reveal>

        <Reveal className="space-y-6">
          <SectionHeading title="stacks" number="05" />
          <StacksGrid />
        </Reveal>
      </section>
    </>
  );
}
