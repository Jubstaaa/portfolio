import type { ReactNode } from 'react'

import { Heading } from '@/components/heading'

export interface ArticleHeaderProps {
    children?: ReactNode
    lead: string
    meta: ReactNode
    tags?: ReactNode
    title: string
}

export function ArticleHeader({
    children,
    lead,
    meta,
    tags,
    title,
}: ArticleHeaderProps) {
    return (
        <header className="space-y-4">
            <p className="text-muted-foreground flex flex-wrap items-center gap-x-3 text-xs">
                {meta}
            </p>
            <Heading as="h1" title={title} />
            <p className="text-foreground max-w-prose text-base leading-relaxed">
                {lead}
            </p>
            {tags ? (
                <p className="text-muted-foreground flex flex-wrap gap-x-3 text-xs">
                    {tags}
                </p>
            ) : null}
            {children}
        </header>
    )
}
