'use client'

import type { CopyStatus } from '@/hooks/use-copy-to-clipboard.types'

import { CopyStatusIcon } from '@/components/copy-status-icon'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { cn, LINK_CLASS } from '@/lib/utils'

interface CopyEmailProps {
    className?: string
    email: string
}

const COPY_EMAIL_LABEL: Record<CopyStatus, string> = {
    copied: 'Email copied',
    failed: 'Copy failed — select the address instead',
    idle: 'Copy email',
}

export function CopyEmail({ className, email }: CopyEmailProps) {
    const { copy, status } = useCopyToClipboard()

    return (
        <div className={cn('inline-flex items-center gap-3', className)}>
            <a className={LINK_CLASS} href={`mailto:${email}`}>
                {email}
            </a>
            <button
                aria-label={COPY_EMAIL_LABEL[status]}
                className="hairline text-muted-foreground hover:text-foreground transition-token inline-flex size-7 items-center justify-center rounded border"
                onClick={() => {
                    copy(email)
                }}
                type="button">
                <CopyStatusIcon status={status} />
            </button>
            <span
                aria-live="polite"
                className={cn(
                    'text-xs transition-opacity',
                    status === 'failed' ? 'text-destructive' : 'text-success',
                    status === 'idle' ? 'opacity-0' : 'opacity-100'
                )}>
                {status === 'failed' ? 'copy failed — select it' : 'copied'}
            </span>
        </div>
    )
}
