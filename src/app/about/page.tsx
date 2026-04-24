import type { Metadata } from "next";

import { EducationList } from "@/components/EducationList";
import { PathBar } from "@/components/PathBar";
import { SectionHeading } from "@/components/SectionHeading";
import { SkillsGrid } from "@/components/SkillsGrid";
import { StacksGrid } from "@/components/StacksGrid";
import { Timeline } from "@/components/Timeline";
import { getEducationSorted, getExperiencesSorted, site } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Software engineer based in Istanbul. Full-stack web development with Next.js, React, TypeScript, Node.js, and cloud infra. Currently studying Software Engineering.",
  path: "/about",
  keywords: [
    "ilker balcilar",
    "software engineer",
    "frontend engineer",
    "full-stack developer",
    "istanbul",
    "nextjs developer",
    "typescript",
    "react",
  ],
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
          <div className="text-foreground space-y-4 leading-relaxed">
            <p>
              I&apos;m a software engineering student based in Istanbul. I build full-stack web
              applications — mostly with Next.js, React, and Node.js, and I work with TypeScript
              end-to-end.
            </p>
            <p>
              I&apos;ve shipped projects from UI to infra: writing the frontend, designing the API,
              modeling the data, and setting up servers with Nginx on Ubuntu. I&apos;ve used GitHub
              Actions to automate deployments and enjoy working with teams to create clean, fast,
              and accessible web experiences.
            </p>
            <p>
              My biggest motivation is combining my technical skills with my passion for gaming and
              entertainment to build projects that are both useful and fun.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <SectionHeading title="experience" number="02" />
          <Timeline items={experiences} />
        </div>

        <div className="space-y-6">
          <SectionHeading title="education" number="03" />
          <EducationList items={educations} />
        </div>

        <div className="space-y-6">
          <SectionHeading title="skills" number="04" />
          <SkillsGrid />
        </div>

        <div className="space-y-6">
          <SectionHeading title="stacks" number="05" />
          <StacksGrid />
        </div>
      </section>
    </>
  );
}
