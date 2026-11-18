'use client'

import { type HTMLAttributes, useCallback, useRef } from 'react'

import { Check, Copy, X } from 'lucide-react'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'

import { COPY_CODE_LABEL } from './code-block.constants'

export function CodeBlock({
    children,
    className,
    ...rest
}: HTMLAttributes<HTMLPreElement>) {
    const preRef = useRef<HTMLPreElement>(null)
    const { copy, status } = useCopyToClipboard()

    const onCopy = useCallback(() => {
        const text = preRef.current?.innerText ?? ''
        if (!text) return
        copy(text)
    }, [copy])

    return (
        <div className="group relative my-6">
            <pre
                ref={preRef}
                className={cn(
                    'hairline bg-muted overflow-x-auto rounded-md border p-4 text-[0.85rem] leading-relaxed',
                    className
                )}
                {...rest}>
                {children}
            </pre>
            <button
                aria-label={COPY_CODE_LABEL[status]}
                className="hairline text-muted-foreground hover:text-foreground bg-background absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded border opacity-0 transition-opacity duration-(--duration-fast) group-hover:opacity-100 focus-visible:opacity-100"
                type="button"
                onClick={onCopy}>
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
        </div>
    )
}
