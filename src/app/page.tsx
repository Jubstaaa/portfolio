import Link from "next/link";

import {
  StatusDot,
  TerminalBlock,
  TerminalLine,
  TerminalMeta,
  TerminalPrompt,
} from "@/components/TerminalBlock";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <section className="container-default section-pad">
      <TerminalBlock>
        <TerminalMeta path={`~/${site.handle}`} branch="main" />

        <TerminalLine command="whoami">
          <p>{site.name}</p>
          <p className="text-muted-foreground">
            {site.role} · {site.location}
          </p>
        </TerminalLine>

        <TerminalLine command="cat status">
          <p>
            <StatusDot tone="success" />
            available for work
          </p>
          <p className="text-muted-foreground">
            <span aria-hidden className="mr-1 select-none">
              →
            </span>
            open to remote & contract
          </p>
        </TerminalLine>

        <TerminalLine command="ls">
          <p className="flex flex-wrap gap-x-6 gap-y-1">
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

        <TerminalPrompt />
      </TerminalBlock>
    </section>
  );
}
