import Link from 'next/link'

import { handlePath } from '@/lib/site'
import { cn } from '@/lib/utils'

interface LogoProps {
    className?: string
}

export function Logo({ className }: LogoProps) {
    return (
        <Link
            className={cn(
                'text-foreground hover:text-accent transition-token text-sm tracking-tight',
                className
            )}
            href="/">
            {handlePath()}
            <span className="sr-only"> — home</span>
        </Link>
    )
}
