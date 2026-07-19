import Link from 'next/link'

export interface AdjacentNavProps {
    ariaLabel: string
    next?: { path: string; title: string }
    prev?: { path: string; title: string }
}

export function AdjacentNav({ ariaLabel, next, prev }: AdjacentNavProps) {
    if (!prev && !next) return null
    return (
        <nav
            aria-label={ariaLabel}
            className="hairline grid grid-cols-1 gap-4 border-t pt-8 md:grid-cols-2">
            {prev ? (
                <Link
                    className="hover:text-foreground transition-token text-muted-foreground group block space-y-1"
                    href={prev.path}>
                    <span className="label-caps">← prev</span>
                    <span className="text-foreground group-hover:text-accent transition-token block truncate">
                        {prev.title}
                    </span>
                </Link>
            ) : (
                <span />
            )}
            {next ? (
                <Link
                    className="hover:text-foreground transition-token text-muted-foreground group block space-y-1 md:text-right"
                    href={next.path}>
                    <span className="label-caps">next →</span>
                    <span className="text-foreground group-hover:text-accent transition-token block truncate">
                        {next.title}
                    </span>
                </Link>
            ) : (
                <span />
            )}
        </nav>
    )
}
