// Pure transitions behind useCommandHistory. `index` is -1 while the user is not
// navigating, and `draft` holds what they had typed before the first ArrowUp so
// walking back down to the bottom restores it.
export interface HistoryCursor {
    draft: string
    index: number
}

export const IDLE_CURSOR: HistoryCursor = { draft: '', index: -1 }

// null means the key was not ours to handle, so the caller leaves the event alone.
export function historyDown(
    cursor: HistoryCursor,
    history: readonly string[]
): null | { cursor: HistoryCursor; value: string } {
    if (cursor.index === -1) return null

    if (cursor.index < history.length - 1) {
        const index = cursor.index + 1
        return { cursor: { ...cursor, index }, value: history[index] ?? '' }
    }

    return { cursor: IDLE_CURSOR, value: cursor.draft }
}

export function historyUp(
    cursor: HistoryCursor,
    history: readonly string[],
    input: string
): null | { cursor: HistoryCursor; value: string } {
    if (history.length === 0) return null

    const next: HistoryCursor =
        cursor.index === -1
            ? { draft: input, index: history.length - 1 }
            : { ...cursor, index: Math.max(0, cursor.index - 1) }

    return { cursor: next, value: history[next.index] ?? '' }
}
