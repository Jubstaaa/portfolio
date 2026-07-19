import Link from 'next/link'

import { site } from '@/lib/content'
import { handlePath } from '@/lib/site'
import { cn } from '@/lib/utils'

export interface LogoProps {
    className?: string
}

export function Logo({ className }: LogoProps) {
    return (
        <Link
            aria-label={`${site.name} — home`}
            href="/"
            className={cn(
                'text-foreground hover:text-accent transition-token text-sm tracking-tight',
                className
            )}>
            {handlePath()}
        </Link>
    )
}
