import type { ReactNode } from 'react'

import Link from 'next/link'

import { cn } from '@/lib/utils'

export interface ContentCardProps {
    className?: string
    description: string
    href: string
    meta: ReactNode
    tags?: ReactNode
    title: string
}

export function ContentCard({
    className,
    description,
    href,
    meta,
    tags,
    title,
}: ContentCardProps) {
    return (
        <Link
            href={href}
            className={cn(
                'hairline group transition-token block border-b py-6 transition-[border-color]',
                className
            )}>
            <p className="text-muted-foreground flex flex-wrap items-center gap-x-3 text-xs">
                {meta}
            </p>
            <h2 className="text-foreground group-hover:text-accent transition-token mt-2 text-lg font-semibold tracking-tight">
                {title}
            </h2>
            <p className="text-muted-foreground mt-1 max-w-prose text-sm">
                {description}
            </p>
            {tags ? (
                <p className="text-muted-foreground mt-2 flex flex-wrap gap-x-3 text-xs">
                    {tags}
                </p>
            ) : null}
        </Link>
    )
}
