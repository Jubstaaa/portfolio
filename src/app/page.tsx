import { InteractiveTerminal, NavLinks } from "@/components/InteractiveTerminal";
import { NowPlaying } from "@/components/NowPlaying";
import { TerminalBlock, TerminalLine, TerminalMeta } from "@/components/TerminalBlock";
import { JsonLd } from "@/components/JsonLd";
import { buildPersonJsonLd } from "@/lib/seo";
import { site } from "@/lib/content";

export default function Home() {
  return (
    <section className="container-default section-pad flex min-h-0 flex-1 flex-col">
      <JsonLd id="ld-person" data={buildPersonJsonLd()} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <TerminalBlock>
          <TerminalMeta path={`~/${site.handle}`} branch="main" />

          <InteractiveTerminal introCommands={["whoami", "ls", "now-playing"]}>
            <TerminalLine command="whoami">
              <p>{site.name}</p>
              <p className="text-muted-foreground">
                {site.role} · {site.location}
              </p>
            </TerminalLine>

            <TerminalLine command="ls">
              <NavLinks />
            </TerminalLine>

            <TerminalLine command="now-playing">
              <NowPlaying />
            </TerminalLine>
          </InteractiveTerminal>
        </TerminalBlock>
      </div>
    </section>
  );
}
