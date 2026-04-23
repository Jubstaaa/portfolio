import type { Metadata } from "next";

import { PathBar } from "@/components/PathBar";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to reach me.",
};

export default function ContactPage() {
  return (
    <>
      <PathBar path={`~/${site.handle}/contact`} meta="mailto · sociallinks in S03" />
      <section className="container-default section-pad">
        <SectionHeading
          as="h1"
          title="contact"
          number="01"
          description="Social links grid and copy-to-clipboard email arrive in S03."
        />
        <div className="mt-10">
          <a
            href={`mailto:${site.email}`}
            className="text-foreground hover:text-accent transition-token underline-offset-4 hover:underline"
          >
            {site.email}
            <span aria-hidden className="text-muted-foreground ml-1 select-none">
              ↗
            </span>
          </a>
        </div>
      </section>
    </>
  );
}
