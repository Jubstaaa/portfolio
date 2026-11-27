import type { AnchorHTMLAttributes } from 'react'

import Link from 'next/link'

import { cn, LINK_CLASS } from '@/lib/utils'

// Anchor's props, not ComponentProps<typeof Link>: the MDX map hands this
// component whatever attributes the pipeline produced, and an internal link has
// to forward them (GFM footnotes need the `id` and `aria-label`).
type StyledLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string
}

export function StyledLink({
    className,
    // next/link re-declares these three without `| undefined`, which
    // exactOptionalPropertyTypes refuses. MDX cannot produce event handlers, so
    // dropping them here costs nothing and lets everything else through.
    onClick: _onClick,
    onMouseEnter: _onMouseEnter,
    onTouchStart: _onTouchStart,
    ...props
}: StyledLinkProps) {
    return <Link className={cn(LINK_CLASS, className)} {...props} />
}
