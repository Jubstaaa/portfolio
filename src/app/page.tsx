import { JsonLd } from '@/components/json-ld'
import { TerminalBlock } from '@/components/terminal-block/terminal-block'
import { TerminalMeta } from '@/components/terminal-block/terminal-meta'
import { site } from '@/features/content/content'
import { buildPersonJsonLd } from '@/features/content/seo'
import { handlePath } from '@/features/content/site'
import { InteractiveTerminal } from '@/features/terminal/interactive-terminal'
import { IntroTranscript } from '@/features/terminal/intro-transcript'

const INTRO_COMMANDS = ['whoami', 'ls', 'now-playing']

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

                    <InteractiveTerminal>
                        <IntroTranscript commands={INTRO_COMMANDS} />
                    </InteractiveTerminal>
                </TerminalBlock>
            </div>
        </section>
    )
}
