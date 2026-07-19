import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Ol({ className, ...props }: HTMLAttributes<HTMLOListElement>) {
    return (
        <ol
            className={cn(
                'text-foreground mb-4 list-decimal space-y-1.5 pl-5',
                className
            )}
            {...props}
        />
    )
}
