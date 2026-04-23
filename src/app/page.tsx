import Link from "next/link";

import {
  TerminalBlock,
  TerminalLine,
  TerminalMeta,
  TerminalPrompt,
} from "@/components/TerminalBlock";
import { JsonLd } from "@/components/JsonLd";
import { buildPersonJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <section className="container-default section-pad">
      <JsonLd id="ld-person" data={buildPersonJsonLd()} />
      <TerminalBlock>
        <TerminalMeta path={`~/${site.handle}`} branch="main" />

        <TerminalLine command="whoami">
          <p>{site.name}</p>
          <p className="text-muted-foreground">
            {site.role} · {site.location}
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
