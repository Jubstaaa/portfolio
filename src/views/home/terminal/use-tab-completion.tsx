import { useCallback, useRef } from 'react'

import { COMMAND_NAMES, PAGE_TARGETS } from './commands'
import { HIDDEN_FILES } from './terminal-output.constants'
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

        const spaceIndex = input.indexOf(' ')
        let prefix: string
        let candidates: string[]
        let build: (match: string) => string

        if (spaceIndex === -1) {
            if (!input) return false
            prefix = input
            candidates = COMMAND_NAMES
            build = match => `${match} `
        } else {
            const name = input.slice(0, spaceIndex)
            prefix = input.slice(spaceIndex + 1).trimStart()
            if (name === 'cd' || name === 'open') {
                candidates = PAGE_TARGETS
            } else if (name === 'cat') {
                candidates = HIDDEN_FILES
            } else {
                return false
            }
            build = match => `${name} ${match}`
        }

        const matches = candidates.filter(candidate =>
            candidate.startsWith(prefix)
        )
        if (matches.length === 0) return false

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
