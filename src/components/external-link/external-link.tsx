import { cn, LINK_CLASS } from '@/lib/utils'

import type { ExternalLinkProps } from './external-link.types'

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
