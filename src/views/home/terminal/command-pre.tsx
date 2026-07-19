import type { ReactNode } from 'react'

export function Pre({ children }: { children: ReactNode }) {
    return <pre className="text-muted-foreground leading-snug">{children}</pre>
}
