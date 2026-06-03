import { InteractiveTerminal, renderCommandOutput } from "@/components/interactive-terminal";
import { TerminalBlock, TerminalLine, TerminalMeta } from "@/components/terminal-block";
import { JsonLd } from "@/components/json-ld";
import { buildPersonJsonLd } from "@/lib/seo";
import { site } from "@/lib/content";

const INTRO_COMMANDS = ["whoami", "ls", "now-playing"];

export default function Home() {
  return (
    <section className="container-default section-pad flex min-h-0 flex-1 flex-col">
      <JsonLd id="ld-person" data={buildPersonJsonLd()} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <TerminalBlock>
          <TerminalMeta path={`~/${site.handle}`} branch="main" />

          <InteractiveTerminal introCommands={INTRO_COMMANDS}>
            {INTRO_COMMANDS.map((name) => (
              <TerminalLine key={name} command={name}>
                {renderCommandOutput(name)}
              </TerminalLine>
            ))}
          </InteractiveTerminal>
        </TerminalBlock>
      </div>
    </section>
  );
}
