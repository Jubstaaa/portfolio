import type { CommandContext } from './commands.types'

export const VIM_ESCAPE_MESSAGE =
    "E37: no write since last change — just kidding, you're free."

// Context for rendering command output on the server, where nothing can navigate.
export const STATIC_CTX: CommandContext = {
    getHistory: () => [],
    glitch: () => undefined,
    navigate: () => undefined,
}
