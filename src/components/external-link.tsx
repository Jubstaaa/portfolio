import type { AnchorHTMLAttributes } from 'react'

import { cn, LINK_CLASS } from '@/lib/utils'

interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
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
            className={cn(
                LINK_CLASS,
                showArrow && 'inline-flex items-center gap-1',
                className
            )}
            href={href}
            rel="noreferrer noopener"
            target="_blank"
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
