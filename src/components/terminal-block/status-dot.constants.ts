import type { StatusTone } from './status-dot.types'

export const TONE_CLASS: Record<StatusTone, string> = {
    danger: 'text-destructive',
    muted: 'text-muted-foreground',
    success: 'text-success',
    warning: 'text-warning',
}
