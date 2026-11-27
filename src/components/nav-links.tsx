import Link from 'next/link'

import { site } from '@/features/content/content'
import { navLabel } from '@/features/content/site'

interface NavLinksProps {
    includeHome?: boolean
}

export function NavLinks({ includeHome = false }: NavLinksProps) {
    return (
        <p className="flex flex-wrap gap-x-6 gap-y-1">
            {includeHome ? (
                <Link
                    className="hover:text-accent transition-token underline-offset-4 hover:underline"
                    href="/">
                    {navLabel('home')}
                </Link>
            ) : null}
            {site.nav.map(item => (
                <Link
                    className="hover:text-accent transition-token underline-offset-4 hover:underline"
                    href={item.href}
                    key={item.href}>
                    {navLabel(item.label)}
                </Link>
            ))}
        </p>
    )
}
