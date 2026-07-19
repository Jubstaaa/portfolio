import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Em({ className, ...props }: HTMLAttributes<HTMLElement>) {
    return <em className={cn('italic', className)} {...props} />
}
