'use client'

import { Check, Copy, X } from 'lucide-react'

import type { CopyStatus } from '@/hooks/use-copy-to-clipboard.types'

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
                {status === 'copied' ? (
                    <Check
                        aria-hidden
                        className="text-success size-3.5"
                        strokeWidth={2}
                    />
                ) : status === 'failed' ? (
                    <X
                        aria-hidden
                        className="text-destructive size-3.5"
                        strokeWidth={2}
                    />
                ) : (
                    <Copy aria-hidden className="size-3.5" strokeWidth={1.75} />
                )}
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
