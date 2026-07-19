import type { ReactNode } from 'react'

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
            <div className="relative space-y-3">
                <h1 className="text-foreground flex items-baseline gap-2 text-lg font-normal">
                    <span
                        aria-hidden
                        className="text-muted-foreground select-none">
                        #
                    </span>
                    <span>{title}</span>
                </h1>
                <hr className="border-foreground my-2 border-t" />
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
