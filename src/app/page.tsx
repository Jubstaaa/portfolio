import { JsonLd } from '@/components/json-ld'
import { TerminalBlock } from '@/components/terminal-block/terminal-block'
import { TerminalLine } from '@/components/terminal-block/terminal-line'
import { TerminalMeta } from '@/components/terminal-block/terminal-meta'
import { site } from '@/features/content/content'
import { renderCommandOutput } from '@/features/terminal/commands'
import { InteractiveTerminal } from '@/features/terminal/interactive-terminal'
import { buildPersonJsonLd } from '@/lib/seo'
import { handlePath } from '@/lib/site'

import { INTRO_COMMANDS } from './page.constants'

export default function HomePage() {
    return (
        <section className="container-default section-pad flex min-h-0 flex-1 flex-col">
            <JsonLd data={buildPersonJsonLd()} id="ld-person" />
            <h1 className="sr-only">
                {site.name} — {site.role}
            </h1>
            <div className="min-h-0 flex-1 overflow-y-auto">
                <TerminalBlock>
                    <TerminalMeta branch="main" path={handlePath()} />

                    <InteractiveTerminal introCommands={INTRO_COMMANDS}>
                        {INTRO_COMMANDS.map(name => (
                            <TerminalLine command={name} key={name}>
                                {renderCommandOutput(name)}
                            </TerminalLine>
                        ))}
                    </InteractiveTerminal>
                </TerminalBlock>
            </div>
        </section>
    )
}
