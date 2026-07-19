import type { ReactNode } from 'react'

export interface HeadingProps {
    as?: 'h1' | 'h2' | 'h3'
    title: ReactNode
}

export function Heading({ as = 'h2', title }: HeadingProps) {
    const Tag = as

    return (
        <div className="relative space-y-3">
            <Tag className="text-foreground flex items-baseline gap-2 text-lg font-normal">
                <span aria-hidden className="text-muted-foreground select-none">
                    #
                </span>
                <span>{title}</span>
            </Tag>
            <hr className="border-foreground my-2 border-t" />
        </div>
    )
}
