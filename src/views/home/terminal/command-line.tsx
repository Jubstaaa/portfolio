import type { ReactNode } from 'react'

export function Line({ children }: { children: ReactNode }) {
    return <p className="text-muted-foreground">{children}</p>
}
