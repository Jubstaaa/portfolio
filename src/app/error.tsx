"use client";

import Link from "next/link";
import { useEffect } from "react";

import { StatusDot, TerminalBlock, TerminalLine, TerminalMeta } from "@/components/TerminalBlock";

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
      <TerminalBlock>
        <TerminalMeta path="~/error" branch="500" />

        <TerminalLine command="cat .">
          <p>
            <StatusDot tone="danger" />
            unexpected error · 500
          </p>
          <p className="text-muted-foreground">
            <span aria-hidden className="mr-1 select-none">
              →
            </span>
            the page failed to render
          </p>
          {error.digest ? (
            <p className="text-muted-foreground">
              <span aria-hidden className="mr-1 select-none">
                →
              </span>
              ref: {error.digest}
            </p>
          ) : null}
        </TerminalLine>

        <TerminalLine command="retry">
          <p>
            <button
              type="button"
              onClick={reset}
              className="text-foreground hover:text-accent transition-token underline underline-offset-4"
            >
              ./reset
            </button>
            <span aria-hidden className="text-muted-foreground mx-3 select-none">
              ·
            </span>
            <Link
              href="/"
              className="text-foreground hover:text-accent transition-token underline-offset-4 hover:underline"
            >
              ./home
            </Link>
          </p>
        </TerminalLine>
      </TerminalBlock>
    </section>
  );
}
