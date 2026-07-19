import type { AnchorHTMLAttributes } from 'react'

export interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string
}

export function ExternalLink({ children, href, ...rest }: ExternalLinkProps) {
    return (
        <a href={href} rel="noreferrer noopener" target="_blank" {...rest}>
            {children}
        </a>
    )
}
