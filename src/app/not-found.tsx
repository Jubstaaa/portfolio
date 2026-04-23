import Link from "next/link";

import { StatusDot, TerminalBlock, TerminalLine, TerminalMeta } from "@/components/TerminalBlock";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="container-default section-pad">
      <TerminalBlock>
        <TerminalMeta path="~/unknown" branch="detached" />

        <TerminalLine command="cat .">
          <p>
            <StatusDot tone="danger" />
            not found · 404
          </p>
          <p className="text-muted-foreground">
            <span aria-hidden className="mr-1 select-none">
              →
            </span>
            the page you requested doesn&apos;t exist or has moved
          </p>
        </TerminalLine>

        <TerminalLine command="ls">
          <p className="flex flex-wrap gap-x-6 gap-y-1">
            <Link
              href="/"
              className="hover:text-accent transition-token underline-offset-4 hover:underline"
            >
              ./home
            </Link>
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-accent transition-token underline-offset-4 hover:underline"
              >
                .{item.href}
              </Link>
            ))}
          </p>
        </TerminalLine>
      </TerminalBlock>
    </section>
  );
}
