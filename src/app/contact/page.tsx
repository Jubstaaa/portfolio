import type { Metadata } from "next";

import { CopyEmail } from "@/components/CopyEmail";
import { PathBar } from "@/components/PathBar";
import { SectionHeading } from "@/components/SectionHeading";
import { SocialLinks } from "@/components/SocialLinks";
import { site } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "How to reach me.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PathBar path={`~/${site.handle}/contact`} meta="email · sociallinks" />
      <section className="container-default section-pad space-y-12">
        <SectionHeading
          as="h1"
          title="contact"
          number="01"
          description="The fastest way to reach me is email. For everything else, socials below."
        />

        <div className="space-y-4">
          <p className="text-muted-foreground text-xs tracking-[0.18em] uppercase">email</p>
          <CopyEmail email={site.email} />
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground text-xs tracking-[0.18em] uppercase">socials</p>
          <SocialLinks />
        </div>
      </section>
    </>
  );
}
