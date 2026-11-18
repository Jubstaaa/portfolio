import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Th({
    className,
    ...props
}: HTMLAttributes<HTMLTableCellElement>) {
    return (
        <th
            className={cn(
                'text-foreground px-3 py-2 font-medium first:pl-0 last:pr-0',
                className
            )}
            {...props}
        />
    )
}
