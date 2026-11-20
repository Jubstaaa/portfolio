import type { AnchorHTMLAttributes } from 'react'

import { ExternalLink } from '@/components/external-link'
import { cn, LINK_CLASS } from '@/lib/utils'

import { StyledLink } from './styled-link'

export function Anchor({
    children,
    className,
    href,
    ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
    if (!href) {
        return <span className={cn(LINK_CLASS, className)}>{children}</span>
    }
    // Only an absolute URL (any scheme, including mailto:) parses without a base;
    // site paths and fragments do not.
    if (URL.canParse(href)) {
        return (
            <ExternalLink
                arrowClassName="text-muted-foreground"
                className={className}
                href={href}
                showArrow
                {...rest}>
                {children}
            </ExternalLink>
        )
    }
    return (
        <StyledLink className={className} href={href}>
            {children}
        </StyledLink>
    )
}
