import { cn } from '@/lib/utils'

import type { ProseProps } from './prose.types'

export function Prose({ children, className }: ProseProps) {
    return (
        <div className={cn('prose text-foreground', className)}>{children}</div>
    )
}
