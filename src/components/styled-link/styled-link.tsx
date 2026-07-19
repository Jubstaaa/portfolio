import type { ComponentProps } from 'react'

import Link from 'next/link'

import { cn, LINK_CLASS } from '@/lib/utils'

export type StyledLinkProps = ComponentProps<typeof Link>

export function StyledLink({ className, ...props }: StyledLinkProps) {
    return <Link className={cn(LINK_CLASS, className)} {...props} />
}
