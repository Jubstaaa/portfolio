import type { ReactNode } from 'react'

import type { CommandContext, TerminalCommand } from './commands.types'

import { commands } from './commands'
import { parseCommand } from './terminal-parser'

export type CommandResult =
    | { command: string; kind: 'clear' }
    | { command: string; kind: 'entry'; output: ReactNode }
    | { kind: 'empty' }

export function runCommand(
    raw: string,
    ctx: CommandContext,
    registry: Record<string, TerminalCommand> = commands
): CommandResult {
    const parsed = parseCommand(raw)
    if (!parsed) return { kind: 'empty' }

    const command = raw.trim()
    const { args, name } = parsed
    if (name === 'clear') return { command, kind: 'clear' }

    const handler = Object.hasOwn(registry, name) ? registry[name] : undefined
    if (!handler) {
        return {
            command,
            kind: 'entry',
            output: (
                <p className="text-muted-foreground">{`command not found: ${name} — try 'help'`}</p>
            ),
        }
    }

    try {
        return { command, kind: 'entry', output: handler.run(args, ctx) }
    } catch (error) {
        console.error(`terminal: '${name}' failed`, error)
        return {
            command,
            kind: 'entry',
            output: (
                <p className="text-muted-foreground">
                    error: something went wrong
                </p>
            ),
        }
    }
}
