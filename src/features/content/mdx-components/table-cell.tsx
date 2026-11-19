import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Td({
    className,
    ...props
}: HTMLAttributes<HTMLTableCellElement>) {
    return (
        <td
            className={cn(
                'text-muted-foreground px-3 py-2 first:pl-0 last:pr-0',
                className
            )}
            {...props}
        />
    )
}
