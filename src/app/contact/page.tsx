import type { Metadata } from "next";

import { CopyEmail } from "@/components/copy-email";
import { PathBar } from "@/components/path-bar";
import { SectionHeading } from "@/components/section-heading";
import { SocialLinks } from "@/components/social-links";
import { site } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with İlker Balcılar — email and social links for collaboration, contract work, or open-source questions.",
  path: "/contact",
  keywords: ["contact ilker balcilar", "hire frontend engineer", "freelance developer istanbul"],
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
          <p className="text-muted-foreground label-caps">email</p>
          <CopyEmail email={site.email} />
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground label-caps">socials</p>
          <SocialLinks />
        </div>
      </section>
    </>
  );
}
