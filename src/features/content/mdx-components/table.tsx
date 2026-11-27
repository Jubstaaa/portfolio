import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Table({
    className,
    ...props
}: HTMLAttributes<HTMLTableElement>) {
    return (
        // tabIndex so a keyboard-only user can scroll a wide table; the
        // <pre> next door already gets one from rehype-pretty-code.
        <div
            aria-label="Table"
            className="-mx-1 my-6 overflow-x-auto px-1"
            role="region"
            tabIndex={0}>
            <table
                className={cn(
                    'w-full min-w-128 border-collapse text-left text-sm',
                    className
                )}
                {...props}
            />
        </div>
    )
}
