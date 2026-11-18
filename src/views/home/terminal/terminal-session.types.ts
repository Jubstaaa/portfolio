import type { ReactNode } from 'react'

export interface TerminalEntry {
    id: number
    command: string
    output: ReactNode
}

export interface TerminalSessionState {
    cleared: boolean
    entries: TerminalEntry[]
    history: string[]
    introPlayed: boolean
    nextId: number
}
