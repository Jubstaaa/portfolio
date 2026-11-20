import type { AnchorHTMLAttributes } from 'react'

import { cn, LINK_CLASS } from '@/lib/utils'

interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    arrowClassName?: string
    href: string
    showArrow?: boolean
}

export function ExternalLink({
    arrowClassName,
    children,
    className,
    href,
    showArrow = false,
    ...rest
}: ExternalLinkProps) {
    return (
        <a
            className={cn(LINK_CLASS, className)}
            href={href}
            rel="noreferrer noopener"
            target="_blank"
            {...rest}>
            {children}
            {showArrow ? (
                <span
                    aria-hidden
                    className={cn('ml-1 select-none', arrowClassName)}>
                    ↗
                </span>
            ) : null}
        </a>
    )
}
