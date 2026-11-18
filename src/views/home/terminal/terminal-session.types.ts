import type { ReactNode } from 'react'

export interface TerminalEntry {
    command: string
    id: number
    output: ReactNode
}

export interface TerminalSessionState {
    cleared: boolean
    entries: TerminalEntry[]
    history: string[]
    introPlayed: boolean
    nextId: number
}
