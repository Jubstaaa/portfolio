import type { ReactNode } from 'react'

interface CommandLineProps {
    children: ReactNode
}
export function CommandLine({ children }: CommandLineProps) {
    return <p className="text-muted-foreground">{children}</p>
}
