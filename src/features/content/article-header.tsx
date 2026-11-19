import { Heading } from '@/components/heading'

import type { ArticleHeaderProps } from './article-header.types'

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
            <div className="relative space-y-3">
                <Heading as="h1" title={title} />
            </div>
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
