import { cn } from '@/lib/utils'

export interface TerminalCaretProps {
    className?: string
}

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
