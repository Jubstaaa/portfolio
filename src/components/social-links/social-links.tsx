import { ExternalLink } from '@/components/external-link/external-link'
import { socials } from '@/lib/content'
import { cn } from '@/lib/utils'

import type { SocialLinksProps } from './social-links.types'

export function SocialLinks({ className }: SocialLinksProps) {
    return (
        <ul className={cn('flex flex-col gap-1.5 text-sm', className)}>
            {socials.map(social => (
                <li key={social.href}>
                    <ExternalLink
                        className="text-muted-foreground hover:text-foreground transition-token group inline-flex items-center gap-2 no-underline"
                        href={social.href}>
                        <span
                            aria-hidden
                            className="text-muted-foreground group-hover:text-accent select-none">
                            →
                        </span>
                        <span className="text-foreground lowercase">
                            {social.label}
                        </span>
                        <span aria-hidden className="select-none">
                            ↗
                        </span>
                    </ExternalLink>
                </li>
            ))}
        </ul>
    )
}
