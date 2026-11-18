import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Thead({
    className,
    ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
    return <thead className={cn('hairline border-b', className)} {...props} />
}
