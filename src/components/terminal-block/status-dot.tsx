import { cn } from '@/lib/utils'

interface StatusDotProps {
    className?: string
    tone?: StatusTone
}

type StatusTone = 'danger' | 'muted' | 'success' | 'warning'

const TONE_CLASS: Record<StatusTone, string> = {
    danger: 'text-destructive',
    muted: 'text-muted-foreground',
    success: 'text-success',
    warning: 'text-warning',
}

export function StatusDot({ className, tone = 'success' }: StatusDotProps) {
    return (
        <span
            aria-hidden
            className={cn('mr-2 select-none', TONE_CLASS[tone], className)}>
            ●
        </span>
    )
}
