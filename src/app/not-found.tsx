import {
    StatusDot,
    TerminalBlock,
    TerminalLine,
    TerminalMeta,
} from '@/components/terminal-block'
import { NavLinks } from '@/views/home/terminal/nav-links'

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
