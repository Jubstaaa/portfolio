import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Ul({ className, ...props }: HTMLAttributes<HTMLUListElement>) {
    return (
        <ul
            className={cn(
                'text-foreground mb-4 list-none space-y-1.5 pl-0',

                "[&>li]:before:text-muted-foreground [&>li]:relative [&>li]:pl-[2.75ch] [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:content-['→'] [&>li]:before:select-none",
                className
            )}
            data-mdx-list="bullet"
            {...props}
        />
    )
}
