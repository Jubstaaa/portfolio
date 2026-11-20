import { Check, Copy, X } from 'lucide-react'

import type { CopyStatus } from '@/hooks/use-copy-to-clipboard.types'

interface CopyStatusIconProps {
    status: CopyStatus
}

export function CopyStatusIcon({ status }: CopyStatusIconProps) {
    if (status === 'copied') {
        return (
            <Check
                aria-hidden
                className="text-success size-3.5"
                strokeWidth={2}
            />
        )
    }
    if (status === 'failed') {
        return (
            <X
                aria-hidden
                className="text-destructive size-3.5"
                strokeWidth={2}
            />
        )
    }
    return <Copy aria-hidden className="size-3.5" strokeWidth={1.75} />
}
