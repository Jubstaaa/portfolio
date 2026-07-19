'use client'

import { Check, Copy } from 'lucide-react'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { cn, LINK_CLASS } from '@/lib/utils'

export interface CopyEmailProps {
    className?: string
    email: string
}

export function CopyEmail({ className, email }: CopyEmailProps) {
    const { copied, copy } = useCopyToClipboard()

    return (
        <div className={cn('inline-flex items-center gap-3', className)}>
            <a className={LINK_CLASS} href={`mailto:${email}`}>
                {email}
            </a>
            <button
                aria-label={copied ? 'Email copied' : 'Copy email'}
                className="hairline text-muted-foreground hover:text-foreground transition-token inline-flex size-7 items-center justify-center rounded border"
                type="button"
                onClick={() => copy(email)}>
                {copied ? (
                    <Check
                        aria-hidden
                        className="text-success size-3.5"
                        strokeWidth={2}
                    />
                ) : (
                    <Copy aria-hidden className="size-3.5" strokeWidth={1.75} />
                )}
            </button>
            <span
                aria-live="polite"
                className={cn(
                    'text-success text-xs transition-opacity',
                    copied ? 'opacity-100' : 'opacity-0'
                )}>
                copied
            </span>
        </div>
    )
}
