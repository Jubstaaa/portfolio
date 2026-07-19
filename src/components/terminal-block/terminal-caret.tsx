import { cn } from '@/lib/utils'

import type { TerminalCaretProps } from './terminal-caret.types'

export function TerminalCaret({ className }: TerminalCaretProps) {
    return (
        <span
            aria-hidden
            className={cn(
                'text-accent w-[2ch] shrink-0 select-none',
                className
            )}>
            ❯
        </span>
    )
}
