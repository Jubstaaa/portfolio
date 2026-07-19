import type { AnchorHTMLAttributes } from 'react'

import { cn, LINK_CLASS } from '@/lib/utils'

export interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string
    showArrow?: boolean
}

export function ExternalLink({
    children,
    className,
    href,
    showArrow = false,
    ...rest
}: ExternalLinkProps) {
    return (
        <a
            href={href}
            rel="noreferrer noopener"
            target="_blank"
            className={cn(
                LINK_CLASS,
                showArrow && 'inline-flex items-center gap-1',
                className
            )}
            {...rest}>
            {children}
            {showArrow ? (
                <span aria-hidden className="select-none">
                    ↗
                </span>
            ) : null}
        </a>
    )
}
