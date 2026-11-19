import type { ReactNode } from 'react'

import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'

interface TerminalEntry {
    command: string
    id: number
    output: ReactNode
}

interface TerminalSessionState {
    cleared: boolean
    entries: TerminalEntry[]
    history: string[]
    introPlayed: boolean
    nextId: number
}

// Module-level so the transcript survives client-side navigation away from and
// back to the home page; the server always renders the initial state.
const store = createStore<TerminalSessionState>()(() => ({
    cleared: false,
    entries: [],
    history: [],
    introPlayed: false,
    nextId: 0,
}))

export function abortIntro(): void {
    store.setState({ cleared: false, entries: [] })
}

export function appendEntry(command: string, output: ReactNode): void {
    store.setState(state => ({
        entries: [...state.entries, { command, id: state.nextId + 1, output }],
        nextId: state.nextId + 1,
    }))
}

// The intro hides the server-rendered output and replays it as typed commands.
// It only counts as played once it finishes: a visitor who navigates away midway
// must come back to the static output, not to a half-typed transcript.
export function beginIntro(): void {
    store.setState({ cleared: true })
}

export function clearTerminal(): void {
    store.setState({ cleared: true, entries: [] })
}

export function completeIntro(): void {
    store.setState({ introPlayed: true })
}

export function getSessionState(): TerminalSessionState {
    return store.getState()
}

export function pushHistory(command: string): void {
    store.setState(state => ({ history: [...state.history, command] }))
}

export function useTerminalSession(): TerminalSessionState {
    return useStore(store)
}
