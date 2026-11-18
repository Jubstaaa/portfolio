import { cn } from '@/lib/utils'

import type { StatusDotProps } from './status-dot.types'

import { TONE_CLASS } from './status-dot.constants'

export function StatusDot({ className, tone = 'success' }: StatusDotProps) {
    return (
        <span
            aria-hidden
            className={cn('mr-2 select-none', TONE_CLASS[tone], className)}>
            ●
        </span>
    )
}
