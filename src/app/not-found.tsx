import { NavLinks } from '@/components/nav-links/nav-links'
import { StatusDot } from '@/components/terminal-block/status-dot'
import { TerminalBlock } from '@/components/terminal-block/terminal-block'
import { TerminalLine } from '@/components/terminal-block/terminal-line'
import { TerminalMeta } from '@/components/terminal-block/terminal-meta'

export default function NotFound() {
    return (
        <section className="container-default section-pad">
            <TerminalBlock>
                <TerminalMeta branch="detached" path="~/unknown" />

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
                    <NavLinks includeHome />
                </TerminalLine>
            </TerminalBlock>
        </section>
    )
}
