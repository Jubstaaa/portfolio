import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Blockquote({
    className,
    ...props
}: HTMLAttributes<HTMLQuoteElement>) {
    return (
        <blockquote
            className={cn(
                'text-muted-foreground my-4 border-l-2 pl-4 italic before:content-none',
                className
            )}
            {...props}
        />
    )
}
