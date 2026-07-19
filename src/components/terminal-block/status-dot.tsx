import { cn } from '@/lib/utils'

export type StatusTone = 'success' | 'warning' | 'danger' | 'muted'

export interface StatusDotProps {
    className?: string
    tone?: StatusTone
}

const toneClass: Record<StatusTone, string> = {
    danger: 'text-destructive',
    muted: 'text-muted-foreground',
    success: 'text-success',
    warning: 'text-warning',
}

export function StatusDot({ className, tone = 'success' }: StatusDotProps) {
    return (
        <span
            aria-hidden
            className={cn('mr-2 select-none', toneClass[tone], className)}>
            ●
        </span>
    )
}
