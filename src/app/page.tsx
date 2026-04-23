import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { site } from "@/lib/site";

export default function Home() {
  return (
    <section className="container-default section-pad">
      <div className="max-w-4xl space-y-10">
        {site.isAvailable ? (
          <p className="text-muted-foreground inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] uppercase">
            <span aria-hidden className="bg-success relative flex size-2 rounded-full">
              <span className="bg-success/60 absolute inset-0 -z-10 animate-ping rounded-full" />
            </span>
            Available for work
          </p>
        ) : null}

        <h1 className="text-display text-balance">
          {site.name}. Senior frontend engineer building fast, accessible interfaces.
        </h1>

        <p className="text-muted-foreground prose-max text-lg text-balance md:text-xl">
          I design and ship production web apps with React, TypeScript, and a sharp eye for
          performance. Currently open to staff-level roles, product advisory, and focused
          engagements.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/projects"
            className="bg-foreground text-background hover:bg-foreground/90 transition-token inline-flex h-11 items-center gap-2 rounded-md px-5 text-sm font-medium"
          >
            View projects
            <ArrowUpRight className="size-4" strokeWidth={2} aria-hidden />
          </Link>
          <Link
            href="/contact"
            className="hairline hover:bg-muted/60 transition-token inline-flex h-11 items-center gap-2 rounded-md border px-5 text-sm font-medium"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}
