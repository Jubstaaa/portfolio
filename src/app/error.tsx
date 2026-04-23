"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-default section-pad">
      <div className="max-w-2xl space-y-6">
        <p className="text-muted-foreground font-mono text-xs tracking-[0.18em] uppercase">
          500 — something broke
        </p>
        <h1 className="text-display">Unexpected error.</h1>
        <p className="text-muted-foreground prose-max text-lg">
          The page failed to render. You can retry, or head back home.
        </p>
        {error.digest ? (
          <p className="text-muted-foreground font-mono text-xs">ref: {error.digest}</p>
        ) : null}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={reset}
            className="bg-foreground text-background hover:bg-foreground/90 transition-token inline-flex h-11 items-center rounded-md px-5 text-sm font-medium"
          >
            Try again
          </button>
          <Link
            href="/"
            className="hairline hover:bg-muted/60 transition-token inline-flex h-11 items-center rounded-md border px-5 text-sm font-medium"
          >
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
