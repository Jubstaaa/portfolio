import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Strong({ className, ...props }: HTMLAttributes<HTMLElement>) {
    return (
        <strong
            className={cn('text-foreground font-semibold', className)}
            {...props}
        />
    )
}
