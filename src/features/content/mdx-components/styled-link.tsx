import type { AnchorHTMLAttributes } from 'react'

import Link from 'next/link'

import { cn, LINK_CLASS } from '@/lib/utils'

type StyledLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string
}

export function StyledLink({
    className,

    onClick: _onClick,
    onMouseEnter: _onMouseEnter,
    onTouchStart: _onTouchStart,
    ...props
}: StyledLinkProps) {
    return <Link className={cn(LINK_CLASS, className)} {...props} />
}
