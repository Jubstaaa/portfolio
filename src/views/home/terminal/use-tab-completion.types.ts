import type { ReactNode } from 'react'

import type { Completion } from './terminal-parser.types'

export interface CompletionSession extends Completion {
    index: number
}

export interface UseTabCompletionOptions {
    appendEntry: (command: string, output: ReactNode) => void
    input: string
    setInput: (value: string) => void
}
