import type { AnchorHTMLAttributes } from 'react'

import { ExternalLink } from '@/components/external-link'
import { StyledLink } from '@/components/styled-link'
import { cn, LINK_CLASS } from '@/lib/utils'

function isExternal(href: string | undefined): boolean {
    if (!href) return false
    return /^https?:\/\//.test(href) || href.startsWith('mailto:')
}

export function Anchor({
    children,
    className,
    href,
    ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
    const external = isExternal(href)
    const linkClass = cn(LINK_CLASS, className)
    if (!href) return <span className={linkClass}>{children}</span>
    if (external) {
        return (
            <ExternalLink className={linkClass} href={href} {...rest}>
                {children}
                <span
                    aria-hidden
                    className="text-muted-foreground ml-1 select-none">
                    ↗
                </span>
            </ExternalLink>
        )
    }
    return (
        <StyledLink className={className} href={href}>
            {children}
        </StyledLink>
    )
}
