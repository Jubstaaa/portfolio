import { JsonLd } from '@/components/json-ld'
import {
    TerminalBlock,
    TerminalLine,
    TerminalMeta,
} from '@/components/terminal-block'
import { site } from '@/lib/content'
import { buildPersonJsonLd } from '@/lib/seo'

import { renderCommandOutput } from './terminal/commands'
import { InteractiveTerminal } from './terminal/interactive-terminal'

const INTRO_COMMANDS = ['whoami', 'ls', 'now-playing']

export default function HomePage() {
    return (
        <section className="container-default section-pad flex min-h-0 flex-1 flex-col">
            <JsonLd data={buildPersonJsonLd()} id="ld-person" />
            <div className="min-h-0 flex-1 overflow-y-auto">
                <TerminalBlock>
                    <TerminalMeta branch="main" path={`~/${site.handle}`} />

                    <InteractiveTerminal introCommands={INTRO_COMMANDS}>
                        {INTRO_COMMANDS.map(name => (
                            <TerminalLine key={name} command={name}>
                                {renderCommandOutput(name)}
                            </TerminalLine>
                        ))}
                    </InteractiveTerminal>
                </TerminalBlock>
            </div>
        </section>
    )
}
