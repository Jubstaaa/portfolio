import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-default section-pad">
      <div className="max-w-2xl space-y-6">
        <p className="text-muted-foreground font-mono text-xs tracking-[0.18em] uppercase">
          404 — not found
        </p>
        <h1 className="text-display">This page is off the map.</h1>
        <p className="text-muted-foreground prose-max text-lg">
          The page you were looking for doesn&apos;t exist, or has moved. Try one of the links
          below.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/"
            className="bg-foreground text-background hover:bg-foreground/90 transition-token inline-flex h-11 items-center rounded-md px-5 text-sm font-medium"
          >
            Back to home
          </Link>
          <Link
            href="/projects"
            className="hairline hover:bg-muted/60 transition-token inline-flex h-11 items-center rounded-md border px-5 text-sm font-medium"
          >
            See projects
          </Link>
        </div>
      </div>
    </section>
  );
}
