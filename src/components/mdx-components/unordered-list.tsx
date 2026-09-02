import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Ul({ className, ...props }: HTMLAttributes<HTMLUListElement>) {
    return (
        <ul
            data-mdx-list="bullet"
            className={cn(
                'text-foreground mb-4 list-none space-y-1.5 pl-0',
                // The arrow belongs to the bullet list, not to the item: an <li>
                // inside an <ol> must keep its number and gain no marker.
                "[&>li]:before:text-muted-foreground [&>li]:relative [&>li]:pl-[2.75ch] [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:content-['→'] [&>li]:before:select-none",
                className
            )}
            {...props}
        />
    )
}
