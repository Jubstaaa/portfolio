import { useCallback, useRef } from 'react'

import { COMMAND_NAMES } from './commands'
import { getCompletions } from './terminal-parser'
import type {
    CompletionSession,
    UseTabCompletionOptions,
} from './use-tab-completion.types'

export function useTabCompletion({
    appendEntry,
    input,
    setInput,
}: UseTabCompletionOptions) {
    const completionRef = useRef<CompletionSession | null>(null)

    const resetCompletion = useCallback(() => {
        completionRef.current = null
    }, [])

    const complete = (): boolean => {
        const active = completionRef.current
        if (active) {
            active.index = (active.index + 1) % active.matches.length
            const match = active.matches[active.index]
            if (match) setInput(active.build(match))
            return true
        }

        const completion = getCompletions(input, COMMAND_NAMES)
        if (!completion) return false
        const { build, matches } = completion

        const first = matches[0]
        if (matches.length === 1 && first) {
            setInput(build(first))
            return true
        }

        appendEntry(
            input,
            <p className="text-muted-foreground">{matches.join('  ')}</p>
        )
        completionRef.current = { build, index: 0, matches }
        if (first) setInput(build(first))
        return true
    }

    return { complete, resetCompletion }
}
