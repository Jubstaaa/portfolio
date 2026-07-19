import { type ReactNode, useSyncExternalStore } from 'react'

interface TerminalEntry {
    id: number
    command: string
    output: ReactNode
}

export interface TerminalSessionState {
    cleared: boolean
    entries: TerminalEntry[]
    history: string[]
    introPlayed: boolean
}

const INITIAL_STATE: TerminalSessionState = {
    cleared: false,
    entries: [],
    history: [],
    introPlayed: false,
}

let state = INITIAL_STATE
let nextId = 0

const listeners = new Set<() => void>()

function setState(partial: Partial<TerminalSessionState>): void {
    state = { ...state, ...partial }
    for (const listener of listeners) listener()
}

export function getSessionState(): TerminalSessionState {
    return state
}

export function appendEntry(command: string, output: ReactNode): void {
    nextId += 1
    setState({ entries: [...state.entries, { command, id: nextId, output }] })
}

export function clearTerminal(): void {
    setState({ cleared: true, entries: [] })
}

export function pushHistory(command: string): void {
    setState({ history: [...state.history, command] })
}

export function setCleared(cleared: boolean): void {
    setState({ cleared })
}

export function markIntroPlayed(): void {
    setState({ introPlayed: true })
}

function subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => {
        listeners.delete(listener)
    }
}

function getSnapshot(): TerminalSessionState {
    return state
}

function getServerSnapshot(): TerminalSessionState {
    return INITIAL_STATE
}

export function useTerminalSession(): TerminalSessionState {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
