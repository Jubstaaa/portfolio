import { cn } from '@/lib/utils'

import type { TerminalBlockProps } from './terminal-block.types'

export function TerminalBlock({ children, className }: TerminalBlockProps) {
    return (
        <div
            className={cn(
                'prose-max text-foreground flex flex-col gap-3 text-[0.95rem] leading-relaxed',
                className
            )}>
            {children}
        </div>
    )
}
