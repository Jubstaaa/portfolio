import type { Completion } from './terminal-parser.types'

import { getCompletions } from './terminal-parser'

export interface CompletionSession extends Completion {
    index: number
}

// `none` leaves the Tab key alone, `single` fills the one match, and `cycle`
// starts a session the next Tab advances through.
export type CompletionStart =
    | { kind: 'cycle'; listing: string[]; session: CompletionSession }
    | { kind: 'none' }
    | { kind: 'single'; value: string }

// Pure transitions behind useTabCompletion: the hook owns the ref and the JSX,
// the cycling arithmetic is testable without a DOM.
export function completionValue(session: CompletionSession): null | string {
    const match = session.matches[session.index]
    return match === undefined ? null : session.build(match)
}

export function nextCompletion(session: CompletionSession): CompletionSession {
    if (session.matches.length === 0) return session
    return {
        ...session,
        index: (session.index + 1) % session.matches.length,
    }
}

export function startCompletion(
    input: string,
    commandNames: readonly string[]
): CompletionStart {
    const completion = getCompletions(input, commandNames)
    if (!completion) return { kind: 'none' }

    const { build, matches } = completion
    const first = matches[0]
    if (matches.length === 1 && first !== undefined) {
        return { kind: 'single', value: build(first) }
    }

    return {
        kind: 'cycle',
        listing: matches,
        session: { build, index: 0, matches },
    }
}
