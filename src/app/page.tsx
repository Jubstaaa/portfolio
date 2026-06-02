import { NavLinks } from "@/components/InteractiveTerminal/NavLinks";
import { NowPlaying } from "@/components/NowPlaying";
import {
  TerminalBlock,
  TerminalLine,
  TerminalMeta,
  TerminalPrompt,
} from "@/components/TerminalBlock";
import { JsonLd } from "@/components/JsonLd";
import { buildPersonJsonLd } from "@/lib/seo";
import { site } from "@/lib/content";

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
          <NavLinks />
        </TerminalLine>

        <TerminalLine command="now-playing">
          <NowPlaying />
        </TerminalLine>

        <TerminalPrompt />
      </TerminalBlock>
    </section>
  );
}
