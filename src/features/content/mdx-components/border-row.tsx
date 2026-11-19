import type { ReactNode } from 'react'

import { RULE } from './mdx-components.constants'

interface BorderRowProps {
    label?: ReactNode
    left: string
    right: string
}

export function BorderRow({ label, left, right }: BorderRowProps) {
    return (
        <div className="text-muted-foreground flex items-baseline gap-2 text-sm leading-none">
            <span aria-hidden className="select-none">
                {left}
            </span>
            {label}
            <span
                aria-hidden
                className="term-rule flex-1 overflow-hidden whitespace-nowrap select-none">
                {RULE}
            </span>
            <span aria-hidden className="select-none">
                {right}
            </span>
        </div>
    )
}
