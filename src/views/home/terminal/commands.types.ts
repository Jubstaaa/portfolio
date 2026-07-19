import type { ReactNode } from 'react'

export interface CommandContext {
    getHistory: () => string[]
    glitch: () => void
    navigate: (href: string) => void
}

export interface TerminalCommand {
    description: string
    hidden?: boolean
    run: (args: string, ctx: CommandContext) => ReactNode
}
