export interface Completion {
    build: (match: string) => string
    matches: string[]
}

export interface ParsedCommand {
    args: string
    name: string
}
