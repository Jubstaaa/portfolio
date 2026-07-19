import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Li({ className, ...props }: HTMLAttributes<HTMLLIElement>) {
    return (
        <li
            className={cn(
                "before:text-muted-foreground relative pl-[1.5ch] before:absolute before:left-0 before:content-['→'] before:select-none data-[ordered=true]:pl-0 data-[ordered=true]:before:content-none",
                className
            )}
            {...props}
        />
    )
}
