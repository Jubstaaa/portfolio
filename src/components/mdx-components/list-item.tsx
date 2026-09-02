import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Li({ className, ...props }: HTMLAttributes<HTMLLIElement>) {
    return <li className={cn(className)} {...props} />
}
