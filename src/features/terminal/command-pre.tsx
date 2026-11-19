import type { CommandPreProps } from './command-pre.types'

export function CommandPre({ children }: CommandPreProps) {
    return <pre className="text-muted-foreground leading-snug">{children}</pre>
}
