import type { ReactNode } from 'react'

interface CommandPreProps {
    children: ReactNode
}
export function CommandPre({ children }: CommandPreProps) {
    return <pre className="text-muted-foreground leading-snug">{children}</pre>
}
