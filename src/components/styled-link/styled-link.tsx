import Link from 'next/link'

import { cn, LINK_CLASS } from '@/lib/utils'

import type { StyledLinkProps } from './styled-link.types'

export function StyledLink({ className, ...props }: StyledLinkProps) {
    return <Link className={cn(LINK_CLASS, className)} {...props} />
}
