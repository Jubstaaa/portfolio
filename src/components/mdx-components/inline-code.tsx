import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function InlineCode({
    className,
    ...props
}: HTMLAttributes<HTMLElement>) {
    return (
        <code
            className={cn(
                'bg-muted text-foreground rounded px-1.5 py-0.5 text-[0.9em]',
                className
            )}
            {...props}
        />
    )
}
