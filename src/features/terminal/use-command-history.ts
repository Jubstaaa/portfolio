import { type KeyboardEvent, useCallback, useRef } from 'react'

import type { HistoryCursor } from './terminal-history'

import { historyDown, historyUp, IDLE_CURSOR } from './terminal-history'

interface UseCommandHistoryOptions {
    history: string[]
    input: string
    setInput: (value: string) => void
}

export function useCommandHistory({
    history,
    input,
    setInput,
}: UseCommandHistoryOptions) {
    const cursorRef = useRef<HistoryCursor>(IDLE_CURSOR)

    const resetHistoryNavigation = useCallback(() => {
        cursorRef.current = IDLE_CURSOR
    }, [])

    const step = (
        event: KeyboardEvent<HTMLInputElement>,
        result: null | { cursor: HistoryCursor; value: string }
    ): boolean => {
        if (!result) return false
        event.preventDefault()
        cursorRef.current = result.cursor
        setInput(result.value)
        return true
    }

    return {
        handleArrowDown: (event: KeyboardEvent<HTMLInputElement>) =>
            step(event, historyDown(cursorRef.current, history)),
        handleArrowUp: (event: KeyboardEvent<HTMLInputElement>) =>
            step(event, historyUp(cursorRef.current, history, input)),
        resetHistoryNavigation,
    }
}
