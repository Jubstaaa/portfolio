import type { Metadata } from "next";

import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to reach me.",
};

export default function ContactPage() {
  return (
    <section className="container-default section-pad">
      <SectionHeading
        as="h1"
        eyebrow="Contact"
        title="Best reached by email."
        description="Social links grid and copy-to-clipboard email arrive in S03."
      />
      <div className="mt-10">
        <a
          href={`mailto:${site.email}`}
          className="text-foreground font-mono text-lg underline-offset-4 hover:underline"
        >
          {site.email}
        </a>
      </div>
    </section>
  );
}
