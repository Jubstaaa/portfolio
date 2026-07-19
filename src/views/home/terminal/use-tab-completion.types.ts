import type { ReactNode } from 'react'

export interface CompletionSession {
    build: (match: string) => string
    index: number
    matches: string[]
}

export interface UseTabCompletionOptions {
    appendEntry: (command: string, output: ReactNode) => void
    input: string
    setInput: (value: string) => void
}
