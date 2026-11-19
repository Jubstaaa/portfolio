import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Tbody({
    className,
    ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <tbody
            className={cn('[&>tr:not(:last-child)]:border-b', className)}
            {...props}
        />
    )
}
