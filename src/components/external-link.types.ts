import type { AnchorHTMLAttributes } from 'react'

export interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string
    showArrow?: boolean
}
