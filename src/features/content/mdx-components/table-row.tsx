import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Tr({
    className,
    ...props
}: HTMLAttributes<HTMLTableRowElement>) {
    return <tr className={cn('hairline align-top', className)} {...props} />
}
