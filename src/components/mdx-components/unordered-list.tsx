import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Ul({ className, ...props }: HTMLAttributes<HTMLUListElement>) {
    return (
        <ul
            data-mdx-list="bullet"
            className={cn(
                'text-foreground mb-4 list-none space-y-1.5 pl-0',
                className
            )}
            {...props}
        />
    )
}
