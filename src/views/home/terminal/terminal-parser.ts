import { site } from '@/lib/content'

import type { Completion, ParsedCommand } from './terminal-parser.types'

import { HIDDEN_FILES } from './terminal-output.constants'

const PAGES = new Map<string, string>([
    ['home', '/'],
    ['~', '/'],
    ...site.nav.map(item => [item.label, item.href] as const),
])

export const PAGE_TARGETS = [...PAGES.keys()]

const ARGUMENT_COMPLETIONS = new Map<string, readonly string[]>([
    ['cat', HIDDEN_FILES],
    ['cd', PAGE_TARGETS],
    ['open', PAGE_TARGETS],
])

export function getCompletions(
    input: string,
    commandNames: readonly string[]
): Completion | null {
    const spaceIndex = input.indexOf(' ')
    if (spaceIndex === -1) {
        if (!input) return null
        const prefix = input.toLowerCase()
        const matches = commandNames.filter(name => name.startsWith(prefix))
        return matches.length ? { build: match => `${match} `, matches } : null
    }

    const name = input.slice(0, spaceIndex).toLowerCase()
    const candidates = ARGUMENT_COMPLETIONS.get(name)
    if (!candidates) return null
    const prefix = input.slice(spaceIndex + 1).trimStart()
    const matches = candidates.filter(candidate => candidate.startsWith(prefix))
    return matches.length
        ? { build: match => `${name} ${match}`, matches }
        : null
}

export function parseCommand(raw: string): null | ParsedCommand {
    const trimmed = raw.trim()
    if (!trimmed) return null
    const spaceIndex = trimmed.indexOf(' ')
    if (spaceIndex === -1) return { args: '', name: trimmed.toLowerCase() }
    return {
        args: trimmed.slice(spaceIndex + 1).trim(),
        name: trimmed.slice(0, spaceIndex).toLowerCase(),
    }
}

export function resolvePage(arg: string): string | undefined {
    const key = arg.replace(/^\.?\//, '').replace(/\/$/, '') || '~'
    return PAGES.get(key)
}
