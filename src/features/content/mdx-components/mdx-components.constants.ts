// No h1: the page title is the document's only one, and normalizeHeadings
// shifts a body so its top rank is h2. h5/h6 are reachable — a body starting at
// `#` with a `####` lands on h5 — and without an entry here Tailwind preflight
// leaves them looking exactly like a paragraph.
export const HEADING_CLASS = {
    h2: 'text-foreground mt-10 mb-3 text-lg font-semibold tracking-tight',
    h3: 'text-foreground mt-8 mb-2 text-base font-semibold tracking-tight',
    h4: 'text-foreground mt-6 mb-2 text-sm font-semibold tracking-tight',
    h5: 'text-foreground mt-6 mb-2 text-sm font-semibold tracking-tight',
    h6: 'text-muted-foreground mt-6 mb-2 text-sm font-semibold tracking-tight',
} as const

export const RULE = '─'.repeat(240)
