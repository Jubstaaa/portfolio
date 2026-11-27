import type { ReactNode } from 'react'

import { useCallback, useRef } from 'react'

import type { CompletionSession } from './terminal-completion'

import { COMMAND_NAMES } from './commands'
import {
    completionValue,
    nextCompletion,
    startCompletion,
} from './terminal-completion'

interface UseTabCompletionOptions {
    appendEntry: (command: string, output: ReactNode) => void
    input: string
    setInput: (value: string) => void
}

export function useTabCompletion({
    appendEntry,
    input,
    setInput,
}: UseTabCompletionOptions) {
    const completionRef = useRef<CompletionSession | null>(null)

    const resetCompletion = useCallback(() => {
        completionRef.current = null
    }, [])

    const apply = (session: CompletionSession) => {
        completionRef.current = session
        const value = completionValue(session)
        if (value !== null) setInput(value)
    }

    const complete = (): boolean => {
        const active = completionRef.current
        if (active) {
            apply(nextCompletion(active))
            return true
        }

        const start = startCompletion(input, COMMAND_NAMES)
        if (start.kind === 'none') return false
        if (start.kind === 'single') {
            setInput(start.value)
            return true
        }

        appendEntry(
            input,
            <p className="text-muted-foreground">{start.listing.join('  ')}</p>
        )
        apply(start.session)
        return true
    }

    return { complete, resetCompletion }
}
