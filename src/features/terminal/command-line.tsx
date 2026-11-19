import type { CommandLineProps } from './command-line.types'

export function CommandLine({ children }: CommandLineProps) {
    return <p className="text-muted-foreground">{children}</p>
}
